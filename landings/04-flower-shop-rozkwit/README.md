# Rozkwit — kwiaciarnia internetowa (flower e-commerce)

Working Polish everyday flower-delivery store. Vanilla HTML/CSS/JS, zero build.
Catalog → product → cart → checkout → **real payment gateway in TEST mode** (Stripe).

Brief: [`prompts/rozkwit-flower-shop-brief.md`](../../prompts/rozkwit-flower-shop-brief.md)

## Pages
| File | Rola |
|---|---|
| `index.html` | Strona główna: hero z zegarem „Dziś do 21:00”, bestsellery, okazje, dostawa, opinie |
| `sklep.html` | Katalog z filtrami (okazja / kolor) i sortowaniem |
| `bukiet.html?id=…` | Karta produktu: rozmiar, data dostawy, bilecik |
| `koszyk.html` | Koszyk z podsumowaniem |
| `kasa.html` | Dane dostawy + start płatności Stripe |
| `sukces.html` / `anulowano.html` | Powrót po płatności |

Core: `styles.css` (design system), `data.js` (katalog + generator ilustracji SVG),
`app.js` (koszyk w localStorage, drawer, zegar dostawy, reveal).

## Ilustracje
Bukiety to **wektorowe ilustracje** generowane w `data.js` (`bouquetSVG`), nie zdjęcia
stockowe. Aby podmienić na prawdziwe zdjęcia: wrzuć `images/<id>.webp` (4:5) i zamień
wywołania `bouquetSVG(p)` na `<picture>`.

## Płatności (Stripe, TEST) — jak włączyć realny przepływ płatności
Płatność wymaga serwera (sekretny klucz), więc działa tam, gdzie działają funkcje
serwerowe — **na Netlify** (`netlify/functions/create-checkout.ts`).
Na GitHub Pages (statyczny hosting) funkcji nie ma → strona kasy używa
**trybu demo** (przekierowanie na `sukces.html?demo=1`, bez realnej sesji Stripe).

1. Załóż konto na [dashboard.stripe.com](https://dashboard.stripe.com) i włącz **Test mode**.
2. Skopiuj **Secret key** (`sk_test_...`).
3. Netlify → Site settings → Environment variables:
   - `STRIPE_SECRET_KEY = sk_test_...`
   - (opcjonalnie) `SITE_URL = https://twoja-domena`
4. Deploy. Kasa wywoła `/.netlify/functions/create-checkout`, dostaniesz sesję Stripe
   w PLN z metodami **Karta / BLIK / Przelewy24**.

### Dane testowe na stronie Stripe
- Karta: `4242 4242 4242 4242`, dowolna przyszła data, dowolny CVC.
- BLIK: kod `123456`.
- Przelewy24: wybierz testowy bank i zatwierdź.

Ceny są liczone **po stronie serwera** (`CATALOG` w funkcji) — klient wysyła tylko
`{id, size, qty}`, więc podmiana ceny w przeglądarce nic nie zmienia.

## Lokalny podgląd
```bash
npx serve landings/04-flower-shop-rozkwit -p 4210
```
Pełna płatność testowa lokalnie: `netlify dev` (uruchamia funkcje) zamiast `serve`.

## Deploy na GitHub Pages
Workflow `.github/workflows/deploy-pages.yml` kopiuje ten folder do
`dist/sklep-kwiatowy/` — po deployu sklep jest pod `…github.io/sklep-kwiatowy/`
(kasa w trybie demo, bo Pages nie uruchamia funkcji).

> Projekt demonstracyjny. Opinie klientów są przykładowe. Płatności w trybie testowym.
