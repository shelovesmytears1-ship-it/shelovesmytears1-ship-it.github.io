// Stripe webhook — the authoritative source of truth for "was this order paid?".
// The browser redirect to /sukces.html is only a UX convenience and can be
// skipped or forged; real fulfilment must be driven by a signature-verified
// webhook event (best practice). This handler verifies the signature and reacts
// to `checkout.session.completed`.
//
// Setup:
//   1. Dashboard → Developers → Webhooks → Add endpoint
//        URL:   https://<your-site>/.netlify/functions/stripe-webhook
//        Events: checkout.session.completed  (add checkout.session.async_payment_*
//                too, because BLIK/Przelewy24 can settle asynchronously)
//   2. Copy the signing secret (whsec_...) into Netlify env as STRIPE_WEBHOOK_SECRET.
//   3. Local testing: `stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook`
//      (the CLI prints a whsec_ to use locally) then `stripe trigger checkout.session.completed`.

import Stripe from 'stripe';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string>;
  isBase64Encoded?: boolean;
}

const json = (status: number, data: unknown) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method not allowed' });

  const key = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key || !whSecret) {
    console.error('[stripe-webhook] STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET not set');
    return json(501, { error: 'not configured' });
  }

  const stripe = new Stripe(key, { apiVersion: '2026-06-24.dahlia' as Stripe.StripeConfig['apiVersion'] });

  // Signature verification needs the EXACT raw body bytes — never JSON.parse first.
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const rawBody = event.isBase64Encoded && event.body
    ? Buffer.from(event.body, 'base64').toString('utf-8')
    : (event.body ?? '');

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig as string, whSecret);
  } catch (e) {
    console.error('[stripe-webhook] signature verification failed:', e instanceof Error ? e.message : e);
    return json(400, { error: 'invalid signature' });
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        // ✅ Paid. This is where real fulfilment goes: mark the order paid, tell the
        // florist to prepare & deliver the bouquet, send the confirmation e-mail.
        // Use session.id for idempotency (Stripe may deliver an event more than once).
        console.info('[stripe-webhook] paid:', session.id, session.amount_total, session.currency,
          'odbiorca=', session.metadata?.odbiorca, 'data=', session.metadata?.data);
        break;
      }
      case 'checkout.session.async_payment_failed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        console.warn('[stripe-webhook] async payment failed:', session.id);
        break;
      }
      default:
        // Unhandled event types are fine — acknowledge so Stripe stops retrying.
        break;
    }
  } catch (e) {
    // Return 500 so Stripe retries if OUR fulfilment failed (not the signature).
    console.error('[stripe-webhook] handler error:', e instanceof Error ? e.message : e);
    return json(500, { error: 'handler failed' });
  }

  return json(200, { received: true });
}
