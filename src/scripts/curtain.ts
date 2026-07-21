/**
 * Loading screen + page transitions.
 *
 * Navigation is a real page load with the curtain covering the seam, rather
 * than an SPA router: the new document paints already hidden (an inline script
 * in <head> sets html.curtain-on before first paint), so there is no flash and
 * no scroll/observer state to tear down and rebuild on every route.
 *
 * First visit → greetings cycle through the four locales.
 * Navigation  → the destination name sits on the curtain while the page loads.
 */

const NAV_KEY = 'of:nav';           // set right before we navigate away
const NAV_LABEL = 'of:navlabel';

const curtain = document.getElementById('curtain');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* ---------- exit: reveal the page ---------- */

async function playGreetings(): Promise<void> {
  const words = Array.from(document.querySelectorAll<HTMLElement>('#curtain-words .curtain-word'));
  const box = document.getElementById('curtain-words');
  if (!box || !words.length) return;

  box.classList.add('on');
  await wait(reduce ? 0 : 260);
  for (let i = 0; i < words.length; i++) {
    words.forEach((w) => w.classList.remove('on'));
    words[i].classList.add('on');
    // hold the final (visitor's own language) noticeably longer
    await wait(reduce ? 0 : i === words.length - 1 ? 420 : 165);
  }
}

async function showNavLabel(label: string): Promise<void> {
  const box = document.getElementById('curtain-nav');
  const el = document.getElementById('curtain-nav-label');
  if (!box || !el || !curtain) return;
  el.textContent = label;
  curtain.classList.add('mode-nav');
  box.classList.add('on');
  box.querySelector('.curtain-word')?.classList.add('on');
}

async function exit(): Promise<void> {
  if (!curtain) return;
  curtain.classList.remove('is-in');
  curtain.classList.add('is-cover');

  const navLabel = sessionStorage.getItem(NAV_LABEL);
  if (sessionStorage.getItem(NAV_KEY)) {
    sessionStorage.removeItem(NAV_KEY);
    sessionStorage.removeItem(NAV_LABEL);
    if (navLabel) await showNavLabel(navLabel);
    await wait(reduce ? 0 : 180);
  } else {
    await playGreetings();
  }

  document.querySelectorAll('.curtain-words').forEach((w) => w.classList.remove('on'));
  curtain.classList.remove('is-cover');
  curtain.classList.add('is-out');
  // hero words + content rise as the curtain lifts off them
  document.body.classList.add('curtain-done', 'loaded');

  await wait(reduce ? 0 : 900);
  curtain.classList.remove('is-out', 'mode-nav');
  document.documentElement.classList.remove('curtain-on');
}

/* ---------- enter: cover the page, then navigate ---------- */

function labelFor(a: HTMLAnchorElement): string {
  const explicit = a.getAttribute('data-tname');
  if (explicit) return explicit;
  const name = a.querySelector('.work-name, .cs-next-name');
  if (name?.textContent) return name.textContent.trim();
  const text = (a.textContent || '').trim().replace(/\s+/g, ' ');
  return text.length > 24 ? text.slice(0, 24) + '…' : text || 'overflow';
}

function isInternal(a: HTMLAnchorElement, e: MouseEvent): boolean {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
  if (a.target && a.target !== '_self') return false;
  if (a.hasAttribute('download')) return false;
  const href = a.getAttribute('href') || '';
  if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return false;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return false;
  // same page, different hash → let the smooth-scroll handler deal with it
  if (url.pathname === location.pathname && url.hash) return false;
  return true;
}

function bindLinks(): void {
  document.addEventListener('click', (e) => {
    const a = (e.target as Element)?.closest?.('a');
    if (!a || !isInternal(a as HTMLAnchorElement, e)) return;
    const link = a as HTMLAnchorElement;
    e.preventDefault();

    sessionStorage.setItem(NAV_KEY, '1');
    sessionStorage.setItem(NAV_LABEL, labelFor(link));

    if (!curtain || reduce) { location.href = link.href; return; }

    curtain.classList.remove('is-out', 'is-cover');
    curtain.classList.add('is-in');
    // navigate once the curtain has covered the viewport
    setTimeout(() => { location.href = link.href; }, 560);
  });
}

/* ---------- boot ---------- */

if (curtain) {
  bindLinks();
  // safety: never leave the page trapped behind the curtain
  const failsafe = setTimeout(() => {
    document.documentElement.classList.remove('curtain-on');
    curtain.classList.remove('is-cover', 'is-in');
    document.body.classList.add('curtain-done', 'loaded');
  }, 6000);
  exit().finally(() => clearTimeout(failsafe));

  // returning via back/forward from bfcache: the curtain may still be mid-flight
  addEventListener('pageshow', (e) => {
    if ((e as PageTransitionEvent).persisted) {
      curtain.classList.remove('is-in', 'is-cover', 'is-out', 'mode-nav');
      document.documentElement.classList.remove('curtain-on');
    }
  });
} else {
  document.documentElement.classList.remove('curtain-on');
}
