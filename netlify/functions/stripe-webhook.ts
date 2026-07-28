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

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Durable fulfilment: push the paid order to the florist's Telegram (same bot as
// the contact form). If Telegram isn't configured, we still log the order so it
// is never silently lost — and the payment itself always lives in the Stripe
// Dashboard, which is the ultimate source of truth.
async function notifyFlorist(session: Stripe.Checkout.Session): Promise<void> {
  const m = session.metadata ?? {};
  const amount = session.amount_total != null
    ? `${(session.amount_total / 100).toFixed(2)} ${(session.currency ?? 'pln').toUpperCase()}`
    : (m.suma ?? '');
  const lines = [
    '🌷 <b>Nowe opłacone zamówienie — Rozkwit</b>',
    '',
    m.zamowienie ? `<b>Bukiety:</b> ${escapeHtml(m.zamowienie)}` : '',
    amount ? `<b>Kwota:</b> ${escapeHtml(amount)}` : '',
    m.odbiorca ? `<b>Odbiorca:</b> ${escapeHtml(m.odbiorca)}` : '',
    m.telefon ? `<b>Telefon:</b> ${escapeHtml(m.telefon)}` : '',
    m.adres ? `<b>Adres:</b> ${escapeHtml(m.adres)}` : '',
    (m.data || m.godzina) ? `<b>Dostawa:</b> ${escapeHtml([m.data, m.godzina].filter(Boolean).join(', '))}` : '',
    m.bilecik ? `<b>Bilecik:</b> ${escapeHtml(m.bilecik)}` : '',
    session.customer_details?.email ? `<b>E-mail:</b> ${escapeHtml(session.customer_details.email)}` : '',
    `\n<i>Stripe session: ${session.id}</i>`,
  ].filter(Boolean);
  const text = lines.join('\n');

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.info('[stripe-webhook] Telegram not configured; order:\n' + text.replace(/<[^>]+>/g, ''));
    return;
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  if (!res.ok) throw new Error('Telegram ' + res.status + ' ' + (await res.text()));
}

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
        // Only fulfil once the money is actually there. Card pays synchronously
        // (payment_status = 'paid' on completed); BLIK/P24 can be 'unpaid' on
        // `completed` and settle later via async_payment_succeeded.
        if (session.payment_status === 'paid' || stripeEvent.type === 'checkout.session.async_payment_succeeded') {
          // Idempotency: Stripe may deliver an event more than once — in a real DB
          // you'd upsert on session.id so the florist isn't notified twice.
          await notifyFlorist(session);
        } else {
          console.info('[stripe-webhook] completed but not yet paid (async method pending):', session.id);
        }
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
