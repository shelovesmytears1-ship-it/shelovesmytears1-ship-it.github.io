# Brief — Rozkwit (kwiaciarnia internetowa / everyday flower delivery)

> Brand name is a proposal (free rein). **Rozkwit** = pl. "rozkwit" (blossoming,
> flourishing). Warm, real Polish word, brandable, has the diacritic register we
> want. Alt fallbacks if rejected: *Kwitnie*, *Łąka*, *Świeżo*.

## Goal & role
- **Type:** real, working store — but with payments in **test/sandbox mode**.
- **What it must achieve:** a visitor picks a bouquet, sets delivery date + a card
  message, and pays through a real payment gateway (Stripe Checkout, test mode) —
  so the owner learns end-to-end how a payment gateway actually works (session
  creation, redirect, BLIK/Przelewy24/card, success/cancel return, later webhook).
- **Polish level:** ship-quality front end; payment is explicitly TEST (no real
  money moves). Nothing on the page pretends otherwise.

## Niche & audience
- **Niche:** everyday flower delivery in Poland — birthdays, love, apologies,
  "just because", congratulations. Impulse + emotional, not wedding/event planning.
- **Audience:** mostly gifting for someone else, often last-minute, on a phone.
  They want *reassurance* far more than *selection*: "will it arrive today, will it
  look like the photo, is this the right gesture." They buy a feeling, not stems.
- **The site's job (visitor's words):** *"Chcę wysłać ładny bukiet, dziś, i mieć
  pewność że dojedzie i będzie wyglądał jak na zdjęciu."*
- **Target market + language:** **Poland / Polish** — native copy required.
  Full Latin-Extended diacritics (ą ć ę ł ń ó ś ż ź) must render in every font.
  ⚠️ I am not a native PL speaker — headlines are natural but flag for a native pass.

## The spine (anti-convention)
- **Genre convention (Polish incumbents — Poczta Kwiatowa, 123kwiaty, Kurier
  Kwiatowy):** crowded category walls, permanent coupon/discount banners, stock
  photography, dated dense UI, trust bought with loud "DARMOWA DOSTAWA!!!" badges.
  Everything shouts; nothing is calm.
- **Our angle — the one idea the site is built around:** *calm, market-fresh
  confidence.* The UI is warm and quiet; **the flowers are the only loud thing on
  the page** (like Bloom & Wild / UrbanStems, unlike the PL incumbents). The single
  built-around mechanic is the **"Dziś do 21:00" same-day promise**: a quiet live
  cutoff (small ticking countdown near the CTA and in the cart) that turns the
  page's biggest anxiety — *will it arrive today* — into the hero feature. One
  confident coral accent, lots of air, honest photography. Restraint, not effects.

## Identity
- **Palette (60/30/10)** — semantic tokens:
  - `--bg` cream `#FAF6EF` (60%)
  - `--surface` `#FFFFFF`, `--surface-tint` `#F1E9DB`, `--brand` deep leaf-green
    `#35603F` (30% — nav, footer, headings accents, "fresh" cues)
  - `--accent` warm coral/terracotta `#E27D5A` (10% — CTAs, price highlights, the
    delivery clock). `--accent-strong` `#D0603E` for hover.
  - `--ink` `#23291F`, `--muted` `#6B7263`, `--line` `#E7DECF`.
  - Rule: chrome stays cream/green/white; **saturated color comes only from the
    bouquet photos.** No gradient blobs.
- **Fonts:** heading **Fraunces** (variable, `opsz`/`SOFT` — soft optical serif,
  reads handcrafted-florist, full PL diacritics) · body/UI **Inter** (clean, full
  PL support). Google Fonts, `preconnect`. Hero headline MUST be Fraunces, verified
  loaded (not a serif fallback).
- **Motion level: 4/10 — calm.** What moves and why: scroll-reveal stagger on card
  grids (IntersectionObserver); hover-lift + slow image zoom on bouquet cards;
  cart drawer slides in; the "do 21:00" clock ticks; add-to-cart bumps the cart
  count. `transform`/`opacity` only, `prefers-reduced-motion` guarded. No scrolljack.
- **Overrides vs. rules.md:** none — standard constitution applies.

## Structure (multi-page store)
1. **`index.html`** — hero (Fraunces headline + "dziś do 21:00" clock + Zamów CTA +
   one strong bouquet photo), bestseller bouquet grid, occasion row (Urodziny /
   Miłość / Gratulacje / Przeprosiny / Bez okazji), "Jak działa dostawa" 3 steps,
   reviews strip (**labeled as sample/concept — no invented counts**), footer.
2. **`sklep.html`** — full catalog: filterable bouquet grid (occasion, price ≤ zł,
   color), sort. Warm neutral cards; price + short name + "Dostawa dziś".
3. **`bukiet.html?id=…`** — product: large photo/gallery, size options
   (Standardowy / Okazały / Wielki), delivery-date picker, card-message field,
   care/freshness note, "Do koszyka".
4. **Cart drawer** (all pages) + **`koszyk.html`** — line items, delivery cutoff
   reminder, subtotal, "Do kasy".
5. **`kasa.html`** — recipient address, delivery date/time, gift message, then
   "Zapłać" → calls the Netlify function → redirects to Stripe Checkout (test).
6. **`sukces.html` / `anulowano.html`** — Stripe return URLs; success reads the
   session, thanks the buyer, clears the cart.

## References (real, live)
| Site | URL | The one lesson |
|---|---|---|
| Bloom & Wild | https://www.bloomandwild.com/ | Calm minimal + editorial hero copy ("Send golden hour flowers"); whitespace + per-product care info builds trust without shouting. |
| UrbanStems | https://urbanstems.com/ | Warm-neutral UI so the flowers are the only color; 4-col grid, occasion mega-menu, subtle GIF/zoom motion inside cards. |
| Floom | https://floom.com/ | Premium curated feel; strong filtering by occasion + price is the core shopping UX. |
| **Poczta Kwiatowa** (opposite pole) | https://www.pocztakwiatowa.pl/ | The PL convention to reject: coupon banners, dense category walls, dated chrome. Our calm is defined against this. |

### Techniques summary (what this build actually uses)
Warm neutral chrome + flowers supply all saturation · big honest photography ·
generous whitespace · occasion-based nav + price filters · per-product
freshness/care line · subtle motion only (hover-lift, slow image zoom, reveal
stagger, cart-drawer slide) · sticky simple header with live cart count · trust
via reviews kept **honest and labeled**, never fake numbers · one coral accent
carrying every CTA.

## Stack & deploy
- **Stack:** vanilla HTML/CSS/JS, multi-page, zero build (consistent with the
  `landings/` series) + **one Netlify Function** `netlify/functions/create-checkout`
  (Stripe Node SDK) that creates a Checkout Session in **PLN** with
  `payment_method_types: card, blik, p24`, test keys from Netlify env. Optional
  `stripe-webhook` function as the "learn the full loop" step 2.
- **Test-mode facts:** BLIK test code `123456`; test card `4242 4242 4242 4242`;
  P24 test bank returns immediate success/fail. Keys `STRIPE_SECRET_KEY` /
  `STRIPE_PUBLISHABLE_KEY` (test) in `.env` + Netlify env, never in client JS.
- **Save to:** `landings/04-flower-shop-rozkwit/` (front end) + root
  `netlify/functions/create-checkout.ts`.
- **Deploy target:** ⚠️ TO CONFIRM. Repo publishes Astro `dist` to overflow-web.pl;
  the standalone store isn't in that build. Decide: (a) its own Netlify site /
  subdomain, or (b) fold into the Astro build output. Until decided → "concept,
  runs locally via `netlify dev`," not "live."

## Non-negotiables (from the standing bar)
Handcrafted not AI/template · real bouquet visuals in real proportions (never
squashed/`scale()`-cropped) · Fraunces in the hero, verified loaded · working
mobile burger at ≤768px, checked at 375px · unified warm composition, no dead
empty sides · **honest** — payment labeled TEST, reviews labeled sample, zero
invented metrics · native PL copy (flagged for native pass) · deploy reality
checked before saying "live" · secret Stripe key server-side only.
Full constitution: ../.claude/skills/site-brief/references/rules.md
Recurring pitfalls to pre-empt: ../.claude/skills/site-brief/references/pitfalls.md

## COPY-PASTE BUILD PROMPT
Build **Rozkwit**, a working Polish everyday-flower-delivery store (vanilla
HTML/CSS/JS, multi-page, zero build) whose spine is *calm market-fresh confidence*
— warm cream/green chrome where the bouquet photos are the only saturated color,
defined against crowded coupon-heavy Polish incumbents. Palette: bg cream
`#FAF6EF`, brand leaf-green `#35603F`, one coral accent `#E27D5A` on every CTA,
ink `#23291F`. Fonts: Fraunces (soft serif) for headings — used in the hero and
verified loaded — Inter for UI; both must render Polish diacritics. Motion 4/10:
scroll-reveal stagger, hover-lift + slow image zoom on cards, cart-drawer slide,
`prefers-reduced-motion` guarded, no scrolljack. Pages: home (hero + a live
"Dziś do 21:00" same-day-cutoff clock + bestseller grid + occasions + how-delivery
-works + honest reviews strip), `sklep.html` catalog with occasion/price/color
filters, `bukiet.html` product page (gallery, size options, delivery-date picker,
card message, freshness note), a slide-in cart drawer + `koszyk.html`, `kasa.html`
checkout collecting recipient/date/message, and `sukces.html`/`anulowano.html`.
Payment is a **real gateway in TEST mode**: a Netlify Function
`netlify/functions/create-checkout` uses the Stripe Node SDK to create a Checkout
Session in PLN with `card, blik, p24`, reading `STRIPE_SECRET_KEY` (test) from env
— the secret key never touches client JS — and the client redirects to the Stripe
-hosted page. Label payment as test everywhere; keep all copy native Polish (flag
for a native pass); no fake metrics or testimonials. Save front end to
`landings/04-flower-shop-rozkwit/`. Honor
`../.claude/skills/site-brief/references/rules.md` and pre-empt every item in
`../.claude/skills/site-brief/references/pitfalls.md`. Verify at 375px then
desktop: burger works, Fraunces loads in the hero, no horizontal scroll, bouquet
images in real proportions, console clean.
