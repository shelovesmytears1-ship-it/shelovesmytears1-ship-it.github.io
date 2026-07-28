// Creates a Stripe Checkout Session for the Rozkwit flower shop (TEST mode).
// The secret key lives only here (Netlify env), never in client JS.
// Prices are resolved SERVER-SIDE from the map below — the client only sends
// {id, size, qty}, so a tampered client price can't change what is charged.
//
// Env (Netlify UI → Site settings → Environment variables — a secrets store,
// never a committed file):
//   STRIPE_SECRET_KEY = rk_test_...   (PREFER a restricted API key with only
//                       "Checkout Sessions: write"; a full sk_test_ key also works)
//   SITE_URL          = https://<your-site>   (optional; used for return URLs)
//
// Poland: line items are in PLN. Payment methods (card, BLIK, Przelewy24) are
// enabled in the Dashboard via dynamic payment methods — not hardcoded here.
// Test data on the Stripe page: card 4242 4242 4242 4242, BLIK code 123456.

import Stripe from 'stripe';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string>;
  isBase64Encoded?: boolean;
}

// ---- server-side catalog (must mirror data.js) ----
const CATALOG: Record<string, { name: string; price: number }> = {
  'poranna-rosa':     { name: 'Poranna Rosa',      price: 129 },
  'zlota-godzina':    { name: 'Złota Godzina',     price: 149 },
  'rozany-zmierzch':  { name: 'Różany Zmierzch',   price: 189 },
  'polna-laka':       { name: 'Polna Łąka',        price: 119 },
  'biala-elegancja':  { name: 'Biała Elegancja',   price: 169 },
  'lawendowe-pole':   { name: 'Lawendowe Pole',    price: 139 },
  'wiosenne-tulipany':{ name: 'Wiosenne Tulipany', price: 99  },
  'piwonie-marzen':   { name: 'Piwonie Marzeń',    price: 209 },
  'sloneczny-bukiet': { name: 'Słoneczny Bukiet',  price: 129 },
  'delikatny-poranek':{ name: 'Delikatny Poranek', price: 145 },
};
const SIZE: Record<string, { label: string; delta: number }> = {
  standardowy: { label: 'Standardowy', delta: 0 },
  okazaly:     { label: 'Okazały',     delta: 40 },
  wielki:      { label: 'Wielki',      delta: 90 },
};
const FREE_DELIVERY = 150;
const DELIVERY_FEE = 15;

const json = (status: number, data: unknown) => ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'method not allowed' });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Not configured yet → the client falls back to a demo confirmation.
    console.error('[create-checkout] STRIPE_SECRET_KEY not set');
    return json(501, { error: 'stripe not configured' });
  }

  let payload: { items?: Array<{ id: string; size: string; qty: number }>; email?: string; delivery?: Record<string, string> };
  try {
    const raw = event.isBase64Encoded && event.body
      ? Buffer.from(event.body, 'base64').toString('utf-8')
      : (event.body ?? '{}');
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: 'invalid json' });
  }

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) return json(400, { error: 'empty cart' });

  const stripe = new Stripe(key, { apiVersion: '2026-06-24.dahlia' as Stripe.StripeConfig['apiVersion'] });

  // Build line items from the server catalog (never trust client prices).
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summaryParts: string[] = [];
  let subtotal = 0;
  for (const it of items) {
    const prod = CATALOG[it.id];
    const size = SIZE[it.size] ?? SIZE.standardowy;
    const qty = Math.max(1, Math.min(20, Math.floor(Number(it.qty) || 1)));
    if (!prod) return json(400, { error: `unknown product: ${it.id}` });
    const unit = prod.price + size.delta;
    subtotal += unit * qty;
    summaryParts.push(`${qty}× ${prod.name} (${size.label})`);
    line_items.push({
      quantity: qty,
      price_data: {
        currency: 'pln',
        unit_amount: unit * 100, // grosze
        product_data: { name: `${prod.name} — ${size.label}` },
      },
    });
  }

  // Delivery fee as its own line (free above threshold).
  const fee = subtotal >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
  if (fee > 0) {
    line_items.push({
      quantity: 1,
      price_data: { currency: 'pln', unit_amount: fee * 100, product_data: { name: 'Dostawa' } },
    });
  }

  const origin =
    process.env.SITE_URL ||
    event.headers['origin'] ||
    (event.headers['host'] ? `https://${event.headers['host']}` : '');

  const d = payload.delivery ?? {};
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Dynamic payment methods: do NOT hardcode payment_method_types. Card / BLIK /
      // Przelewy24 are enabled in the Dashboard (Settings → Payment methods) and Stripe
      // ranks the most relevant ones per customer for maximum conversion.
      line_items,
      customer_email: payload.email,
      locale: 'pl',
      success_url: `${origin}/sukces.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/anulowano.html`,
      metadata: {
        zamowienie: summaryParts.join(', ').slice(0, 480),
        suma: `${subtotal + fee} zł`,
        odbiorca: d.rname ?? '',
        telefon: d.rphone ?? '',
        adres: [d.street, d.postal, d.city].filter(Boolean).join(', '),
        data: d.date ?? '',
        godzina: d.slot ?? '',
        bilecik: (d.msg ?? '').slice(0, 400),
      },
    });
    return json(200, { url: session.url });
  } catch (e) {
    console.error('[create-checkout] Stripe error:', e instanceof Error ? e.message : e);
    return json(502, { error: 'stripe session failed' });
  }
}
