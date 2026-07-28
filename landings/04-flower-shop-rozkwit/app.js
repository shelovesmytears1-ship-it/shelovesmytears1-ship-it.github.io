/* ============================================================
   Rozkwit — shared behaviour
   cart (localStorage) · drawer · burger · reveal · delivery clock
   ============================================================ */

/* ---------- SVG icons (Lucide-style, no emoji) ---------- */
const ICON = {
  cart:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  menu:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  plus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-2"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  leaf:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-6 6-9 16-10-1 10-4 16-9 17Z"/><path d="M4 20c3-4 5.5-6.5 9-8"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.5 3-3.4 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.1 1.5 4 3 5.5l7 7Z"/></svg>',
  gift:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9"/><path d="M12 8S9 3 6.5 4.5 8.5 8 12 8Zm0 0s3-5 5.5-3.5S15.5 8 12 8Z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/></svg>',
  flower:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5c0-3 1-4.5 0-6.5-1 2 0 3.5 0 6.5Zm0 5c0 3-1 4.5 0 6.5 1-2 0-3.5 0-6.5Zm-2.5-2.5c-3 0-4.5-1-6.5 0 2 1 3.5 0 6.5 0Zm5 0c3 0 4.5 1 6.5 0-2-1-3.5 0-6.5 0Z"/></svg>',
  star:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 6 20.4l1.4-6.8L2.3 9.1l6.9-.8z"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  pin:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
};

/* ---------- Cart store ---------- */
const CART_KEY = "rozkwit_cart_v1";
const Cart = {
  read() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } },
  write(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent("cart:change")); },
  add(item) {
    const items = Cart.read();
    const found = items.find(i => i.key === item.key);
    if (found) found.qty += item.qty; else items.push(item);
    Cart.write(items);
  },
  setQty(key, qty) {
    let items = Cart.read();
    if (qty <= 0) items = items.filter(i => i.key !== key);
    else { const it = items.find(i => i.key === key); if (it) it.qty = qty; }
    Cart.write(items);
  },
  remove(key) { Cart.write(Cart.read().filter(i => i.key !== key)); },
  clear() { Cart.write([]); },
  count() { return Cart.read().reduce((n, i) => n + i.qty, 0); },
  total() { return Cart.read().reduce((n, i) => n + i.price * i.qty, 0); },
};

/* ---------- Delivery cutoff clock — "Dziś do 21:00" ---------- */
const CUTOFF_HOUR = 21;
function deliveryClock(el) {
  if (!el) return;
  function tick() {
    const now = new Date();
    const cutoff = new Date(now); cutoff.setHours(CUTOFF_HOUR, 0, 0, 0);
    const timeEl = el.querySelector("[data-clock-time]");
    const labelEl = el.querySelector("[data-clock-label]");
    if (now < cutoff) {
      const diff = cutoff - now;
      const h = Math.floor(diff / 3.6e6);
      const m = Math.floor((diff % 3.6e6) / 6e4);
      const s = Math.floor((diff % 6e4) / 1000);
      if (labelEl) labelEl.textContent = "Zamów w ciągu";
      if (timeEl) timeEl.textContent = `${h}h ${String(m).padStart(2,"0")}m ${String(s).padStart(2,"0")}s`;
      el.classList.remove("clock--muted");
    } else {
      el.classList.add("clock--muted");
      if (labelEl) labelEl.textContent = "Dostawa";
      if (timeEl) timeEl.textContent = "jutro rano";
    }
  }
  tick(); setInterval(tick, 1000);
}

/* ---------- Reveal on scroll ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) { els.forEach(e => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add("is-in"), (e.target.dataset.delay || 0) * 1); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(e => io.observe(e));
}

/* ---------- Header: scroll state + burger ---------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".mobile-menu");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (burger && menu) {
    const setOpen = (open) => {
      menu.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.innerHTML = open ? ICON.close : ICON.menu;
    };
    burger.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
    window.addEventListener("resize", () => { if (window.innerWidth > 768) setOpen(false); });
  }
}

/* ---------- Cart drawer ---------- */
function initDrawer() {
  const drawer = document.querySelector(".drawer");
  const overlay = document.querySelector(".drawer-overlay");
  const openers = document.querySelectorAll("[data-open-cart]");
  const closers = document.querySelectorAll("[data-close-cart]");
  if (!drawer) return;
  const setOpen = (open) => {
    drawer.classList.toggle("is-open", open);
    overlay.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) renderDrawer();
  };
  openers.forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); setOpen(true); }));
  closers.forEach(b => b.addEventListener("click", () => setOpen(false)));
  overlay.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.__openCart = () => setOpen(true);
}

function renderDrawer() {
  const body = document.querySelector(".drawer__body");
  const foot = document.querySelector(".drawer__foot");
  if (!body) return;
  const items = Cart.read();
  if (!items.length) {
    body.innerHTML = `<div class="drawer__empty">${ICON.cart}<p>Twój koszyk jest pusty.</p><a class="btn btn--ghost" href="sklep.html" style="margin-top:16px" data-close-cart>Wybierz bukiet</a></div>`;
    if (foot) foot.hidden = true;
    document.querySelectorAll("[data-close-cart]").forEach(b => b.addEventListener("click", () => window.__openCart && document.querySelector(".drawer").classList.remove("is-open")));
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = items.map(i => lineItemHTML(i)).join("");
  if (foot) {
    foot.querySelector("[data-cart-total]").textContent = fmtPrice(Cart.total());
  }
  bindLineItems(body);
}

function lineItemHTML(i) {
  return `<div class="line-item" data-key="${i.key}">
    <div class="line-item__media">${bouquetSVG(productById(i.id))}</div>
    <div>
      <div class="line-item__name">${i.name}</div>
      <div class="line-item__meta">${i.sizeLabel} · ${fmtPrice(i.price)}</div>
      <div class="qty">
        <button data-dec aria-label="Mniej">${ICON.minus}</button>
        <span>${i.qty}</span>
        <button data-inc aria-label="Więcej">${ICON.plus}</button>
      </div>
    </div>
    <div style="text-align:right;display:flex;flex-direction:column;justify-content:space-between">
      <div class="line-item__price">${fmtPrice(i.price * i.qty)}</div>
      <button class="line-item__remove" data-remove>Usuń</button>
    </div>
  </div>`;
}

function bindLineItems(scope) {
  scope.querySelectorAll(".line-item").forEach(row => {
    const key = row.dataset.key;
    const item = Cart.read().find(i => i.key === key);
    row.querySelector("[data-inc]").addEventListener("click", () => Cart.setQty(key, item.qty + 1));
    row.querySelector("[data-dec]").addEventListener("click", () => Cart.setQty(key, item.qty - 1));
    row.querySelector("[data-remove]").addEventListener("click", () => Cart.remove(key));
  });
}

/* ---------- Cart count badge ---------- */
function updateCartCount(bump) {
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    const n = Cart.count();
    el.textContent = n;
    el.classList.toggle("is-visible", n > 0);
    if (bump && n > 0) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  });
}

/* ---------- Add to cart helper ---------- */
function addToCart(product, size, qty = 1) {
  const s = SIZES.find(x => x.id === size) || SIZES[0];
  const price = product.price + s.delta;
  Cart.add({ key: `${product.id}__${s.id}`, id: product.id, name: product.name, size: s.id, sizeLabel: s.label, price, qty });
  updateCartCount(true);
}

/* ---------- Delivery pricing ---------- */
const FREE_DELIVERY = 150;
const DELIVERY_FEE = 15;
function deliveryFee(subtotal) { return subtotal >= FREE_DELIVERY || subtotal === 0 ? 0 : DELIVERY_FEE; }
function orderTotal() { const s = Cart.total(); return s + deliveryFee(s); }

/* ---------- Shared product card ---------- */
function productCardHTML(p) {
  return `<article class="card reveal">
    <a class="card__media" href="bukiet.html?id=${p.id}" aria-label="${p.name}">
      ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ""}
      ${bouquetSVG(p)}
    </a>
    <div class="card__body">
      <a class="card__name" href="bukiet.html?id=${p.id}">${p.name}</a>
      <p class="card__meta">${p.short}</p>
      <div class="card__foot">
        <span class="card__price">${fmtPrice(p.price)}</span>
        <button class="card__add" data-add="${p.id}" aria-label="Dodaj ${p.name} do koszyka">${ICON.plus}</button>
      </div>
    </div>
  </article>`;
}
function bindProductCards(scope) {
  if (!scope) return;
  scope.querySelectorAll("[data-add]").forEach(btn => {
    if (btn.dataset.bound) return; btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      addToCart(productById(btn.dataset.add), "standardowy", 1);
      if (window.__openCart) window.__openCart();
    });
  });
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // inject shared icons where marked
  document.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = ICON[el.dataset.icon] || ""; });
  initHeader();
  initDrawer();
  initReveal();
  document.querySelectorAll(".clock").forEach(deliveryClock);
  updateCartCount(false);
  if (typeof onPageReady === "function") onPageReady();
});
document.addEventListener("cart:change", () => {
  updateCartCount(false);
  if (document.querySelector(".drawer.is-open")) renderDrawer();
  if (typeof onCartChange === "function") onCartChange();
});
