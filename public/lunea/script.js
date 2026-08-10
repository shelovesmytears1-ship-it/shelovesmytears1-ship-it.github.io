const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const form = document.querySelector('#budget-form');
const formStatus = form?.querySelector('.form-status');
const dialog = document.querySelector('#success');
const menuTrigger = document.querySelector('.menu-trigger');
const menuPanel = document.querySelector('.menu-panel');

// Accessible off-canvas menu with focus restoration and Escape support.
const menuClose = document.createElement('button');
menuClose.className = 'menu-close';
menuClose.type = 'button';
menuClose.setAttribute('aria-label', 'Zamknij menu');
menuClose.innerHTML = '×';
menuPanel.prepend(menuClose);

let menuReturnFocus = null;
const focusableSelector = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const setMenu = (open) => {
  menuPanel.classList.toggle('is-open', open);
  menuTrigger.classList.toggle('is-open', open);
  menuTrigger.setAttribute('aria-expanded', String(open));
  menuTrigger.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  menuPanel.setAttribute('aria-hidden', String(!open));
  menuPanel.inert = !open;
  document.body.classList.toggle('menu-open', open);

  if (open) {
    menuReturnFocus = document.activeElement;
    menuClose.focus();
  } else if (menuReturnFocus instanceof HTMLElement) {
    menuReturnFocus.focus();
  }
};

menuTrigger.addEventListener('click', () => setMenu(menuTrigger.getAttribute('aria-expanded') !== 'true'));
menuClose.addEventListener('click', () => setMenu(false));
menuPanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuTrigger.getAttribute('aria-expanded') === 'true') setMenu(false);
  if (event.key !== 'Tab' || menuTrigger.getAttribute('aria-expanded') !== 'true') return;

  const items = [...menuPanel.querySelectorAll(focusableSelector)].filter((item) => !item.inert);
  const first = items[0];
  const last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const detailsSection = document.querySelector('.details');
const gallery = document.createElement('section');
gallery.className = 'gallery-wall';
gallery.id = 'galeria';
gallery.setAttribute('aria-label', 'Jedna historia — galeria');
gallery.innerHTML = `
  <div class="split-copy">
    <p class="eyebrow">02 / Jedna historia</p>
    <span class="split-kicker">Ślub w pałacowym ogrodzie</span>
    <h2>Piękno<br><em>bez pośpiechu.</em></h2>
    <p class="split-description">Od pierwszego spaceru po ostatni toast. Układamy dzień z czułością, światłem i przestrzenią na to, co wydarza się samo.</p>
    <div class="split-meta"><span>Willa pod Warszawą</span><span>42 osoby / czerwiec 2026</span></div>
    <div class="split-controls">
      <button class="split-prev" type="button" aria-label="Poprzednie zdjęcie">←</button>
      <span class="split-count" aria-live="polite">01 / 04</span>
      <button class="split-next" type="button" aria-label="Następne zdjęcie">→</button>
    </div>
  </div>
  <div class="split-stage" tabindex="0" aria-label="Galeria zdjęć. Użyj strzałek w lewo i w prawo.">
    <img class="split-image is-active" src="assets/editorial-walk.webp" width="1536" height="1024" alt="Nowożeńcy spacerują po pałacowym ogrodzie" loading="lazy" decoding="async">
    <img class="split-image" src="assets/editorial-ribbon.webp" width="1122" height="1402" alt="Bukiet i jedwabna wstążka przy samochodzie" loading="lazy" decoding="async">
    <img class="split-image" src="assets/editorial-dinner.webp" width="1122" height="1402" alt="Kolacja przy świecach w sadzie" loading="lazy" decoding="async">
    <img class="split-image" src="assets/editorial-laugh.webp" width="1122" height="1402" alt="Nowożeńcy śmieją się wśród drzew" loading="lazy" decoding="async">
  </div>`;
detailsSection.after(gallery);

let splitIndex = 0;
let splitBusy = false;
const splitImages = [...gallery.querySelectorAll('.split-image')];
const splitCount = gallery.querySelector('.split-count');
const showSplit = async (next) => {
  if (splitBusy) return;
  splitBusy = true;
  const target = (next + splitImages.length) % splitImages.length;
  try {
    await splitImages[target].decode();
  } catch {
    // Browsers can reject decode() for an already decoded image; the image is still usable.
  }
  splitImages[splitIndex].classList.remove('is-active');
  splitImages[splitIndex].setAttribute('aria-hidden', 'true');
  splitIndex = target;
  splitImages[splitIndex].classList.add('is-active');
  splitImages[splitIndex].setAttribute('aria-hidden', 'false');
  splitCount.textContent = `${String(splitIndex + 1).padStart(2, '0')} / ${String(splitImages.length).padStart(2, '0')}`;
  splitBusy = false;
};

splitImages.forEach((image, index) => image.setAttribute('aria-hidden', String(index !== 0)));
gallery.querySelector('.split-next').addEventListener('click', () => showSplit(splitIndex + 1));
gallery.querySelector('.split-prev').addEventListener('click', () => showSplit(splitIndex - 1));
gallery.querySelector('.split-stage').addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') showSplit(splitIndex + 1);
  if (event.key === 'ArrowLeft') showSplit(splitIndex - 1);
});

let touchStartX = 0;
gallery.querySelector('.split-stage').addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });
gallery.querySelector('.split-stage').addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 45) showSplit(splitIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

const archive = document.createElement('section');
archive.className = 'old-archive';
archive.innerHTML = `
  <div class="archive-head">
    <p class="eyebrow">03 / Archiwum</p>
    <h2>Wspomnienia<br><em>z bliska.</em></h2>
    <p>Detale z naszych wcześniejszych historii — osobno, spokojnie, bez powtarzania głównej opowieści.</p>
  </div>
  <div class="archive-rail" role="region" aria-label="Archiwum zdjęć" tabindex="0">
    <figure><img src="assets/gallery-bouquet.webp" width="1122" height="1402" alt="Bukiet ślubny na kamiennym stole" loading="lazy" decoding="async"><figcaption>Kwiaty / maj 2026</figcaption></figure>
    <figure><img src="assets/gallery-fireworks.webp" width="1122" height="1402" alt="Nowożeńcy oglądają fajerwerki nad jeziorem" loading="lazy" decoding="async"><figcaption>Ostatni taniec / Kazimierz</figcaption></figure>
    <figure><img src="assets/archive-ceremony.webp" width="1536" height="1024" alt="Kameralna ceremonia w ogrodzie" loading="lazy" decoding="async"><figcaption>Ceremonia / Łódź</figcaption></figure>
    <figure><img src="assets/gallery-champagne.webp" width="1122" height="1402" alt="Toast w ogrodzie przy zachodzie słońca" loading="lazy" decoding="async"><figcaption>Toast / ogród za miastem</figcaption></figure>
  </div>`;
gallery.after(archive);

// Stable hero slideshow: a slide is decoded before the crossfade, can be paused,
// stops in background tabs and is disabled when reduced motion is requested.
const heroSlides = [...document.querySelectorAll('.hero-slides img')];
const heroDots = [...document.querySelectorAll('.hero-dot')];
const heroPause = document.querySelector('.hero-pause');
let heroIndex = 0;
let heroTimer = null;
let heroBusy = false;
let heroPausedByUser = false;

const updateHeroControl = () => {
  heroDots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === heroIndex)));
  const paused = heroPausedByUser || reduceMotion.matches;
  heroPause.setAttribute('aria-pressed', String(paused));
  heroPause.textContent = paused ? 'Wznów' : 'Pauza';
};

const stopHero = () => {
  if (heroTimer) window.clearInterval(heroTimer);
  heroTimer = null;
};

const showHero = async (next) => {
  if (heroBusy || next === heroIndex) return;
  heroBusy = true;
  const target = (next + heroSlides.length) % heroSlides.length;
  try {
    await heroSlides[target].decode();
  } catch {
    // Keep the current slide visible if decoding is not supported.
  }
  heroSlides[heroIndex].classList.remove('is-active');
  heroIndex = target;
  heroSlides[heroIndex].classList.add('is-active');
  updateHeroControl();
  heroBusy = false;
};

const startHero = () => {
  stopHero();
  if (heroPausedByUser || reduceMotion.matches || document.hidden) return;
  heroTimer = window.setInterval(() => showHero(heroIndex + 1), 7600);
};

heroDots.forEach((dot, index) => dot.addEventListener('click', () => {
  showHero(index);
  startHero();
}));
heroPause.addEventListener('click', () => {
  heroPausedByUser = !heroPausedByUser;
  updateHeroControl();
  startHero();
});
document.addEventListener('visibilitychange', startHero);
reduceMotion.addEventListener?.('change', () => {
  updateHeroControl();
  startHero();
});
updateHeroControl();
startHero();

document.querySelectorAll('.service-list details').forEach((item) => {
  item.open = false;
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const values = Object.fromEntries(new FormData(form));
  const subject = 'LUNEA — zapytanie o organizację wesela';
  const body = [
    'Dzień dobry,',
    '',
    `Planowana data: ${values.date}`,
    `Liczba gości: ${values.guests}`,
    `Budżet: ${values.budget}`,
    `Adres zwrotny: ${values.email}`,
    '',
    'Chcielibyśmy porozmawiać o naszej uroczystości.',
  ].join('\n');

  formStatus.textContent = 'Przygotowujemy szkic wiadomości…';
  window.location.href = `mailto:hello@lunea.pl?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.setTimeout(() => {
    formStatus.textContent = '';
    dialog?.showModal();
    dialog?.querySelector('button')?.focus();
  }, 250);
});

dialog?.querySelector('button')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
