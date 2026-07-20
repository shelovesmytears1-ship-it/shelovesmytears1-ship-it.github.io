/**
 * Global motion layer — GSAP-powered premium polish.
 *
 * Page transition: simple reliable y-translate on a div curtain.
 *   - Reveal (enter): curtain starts at y=0 (covering), slides to y=-100%
 *   - Cover  (leave): curtain starts at y=100% (below), slides to y=0
 * No SVG path morphing — was causing diagonal glitches.
 */

import Lenis from 'lenis';
import gsap from 'gsap';

const reduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fineCursor = window.matchMedia('(pointer: fine)').matches;

/* ─── 1. Smooth scroll ─────────────────────────────────────── */
let lenis: Lenis | null = null;
if (!reduced) {
  lenis = new Lenis({
    duration: 1.0,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel:    true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });
  const raf = (time: number) => { lenis!.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  document.documentElement.style.scrollBehavior = 'auto';

  // Anchor links → smooth scroll
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis!.scrollTo(target as HTMLElement, { offset: -64, duration: 1.2 });
  });
}

/* ─── 2. Page-transition curtain ───────────────────────────── */
/*
 * The curtain is a full-screen <div> with background: var(--accent).
 * clip-path gives it a wave-shaped bottom edge for a liquid feel.
 *
 * ENTER (page loaded): y=0 → y=-105%   (slides up and out)
 * LEAVE (link click) : y=105% → y=0    (rises up from below, then navigate)
 *
 * Using 105% (not 100%) so the wave-bottom edge clears the viewport fully.
 */
const curtain = document.querySelector<HTMLElement>('.page-curtain');

if (curtain && !reduced) {

  /* ── ENTER: reveal page ── */
  // Curtain starts at y=0 (visible, set by CSS) — slide it up off screen
  gsap.fromTo(
    curtain,
    { yPercent: 0 },
    {
      yPercent: -105,
      duration: 0.9,
      ease: 'power4.inOut',
      onComplete: () => { curtain.style.display = 'none'; },
    },
  );

  /* ── LEAVE: cover before navigation ── */
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href) return;
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    let url: URL;
    try { url = new URL(href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;

    e.preventDefault();

    // Reset curtain below viewport and animate up to cover
    curtain.style.display = '';
    gsap.fromTo(
      curtain,
      { yPercent: 105 },
      {
        yPercent: 0,
        duration: 0.7,
        ease: 'power4.inOut',
        onComplete: () => { location.href = url.href; },
      },
    );
  });

} else if (curtain) {
  // Reduced motion: hide curtain immediately
  curtain.style.display = 'none';
}

/* ─── 3. Homepage hero ─────────────────────────────────────────────── */
/* A short, ordered entrance establishes hierarchy before the visitor starts
   scrolling. Content remains fully visible without JavaScript. */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero && !reduced) {
  const heroItems = hero.querySelectorAll<HTMLElement>('[data-hero-item]');
  const heroLines = hero.querySelectorAll<HTMLElement>('[data-hero-line]');

  gsap.timeline({ delay: 0.12 })
    .fromTo(heroItems[0], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.42, ease: 'power2.out' })
    .fromTo(heroLines, { yPercent: 112, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.78, stagger: 0.1, ease: 'power4.out' }, '-=0.08')
    .fromTo(Array.from(heroItems).slice(1), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: 'power2.out' }, '-=0.28');
}

/* ─── 4. Scroll progress ───────────────────────────────────────────── */
const scrollProgress = document.querySelector<HTMLElement>('.scroll-progress__bar');
if (scrollProgress) {
  let progressFrame = 0;
  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    scrollProgress.style.transform = `scaleX(${value})`;
    progressFrame = 0;
  };
  const requestProgressUpdate = () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateScrollProgress);
  };
  window.addEventListener('scroll', requestProgressUpdate, { passive: true });
  window.addEventListener('resize', requestProgressUpdate, { passive: true });
  updateScrollProgress();
}

/* ─── 5. Magnetic CTAs ─────────────────────────────────────── */
if (fineCursor && !reduced) {
  const STRENGTH = 0.25;
  const RADIUS   = 80;
  document.querySelectorAll<HTMLElement>('.btn--primary, .btn--ghost, [data-magnetic]')
    .forEach((el) => {
      let raf = 0;
      let tx = 0, ty = 0, cx = 0, cy = 0;

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const dx   = e.clientX - (rect.left + rect.width  / 2);
        const dy   = e.clientY - (rect.top  + rect.height / 2);
        if (Math.hypot(dx, dy) > RADIUS + Math.max(rect.width, rect.height) / 2) return;
        tx = Math.max(-12, Math.min(12, dx * STRENGTH));
        ty = Math.max(-12, Math.min(12, dy * STRENGTH));
        if (!raf) raf = requestAnimationFrame(loop);
      };
      const loop = () => {
        cx += (tx - cx) * 0.22;
        cy += (ty - cy) * 0.22;
        el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
          raf = requestAnimationFrame(loop);
        } else { raf = 0; }
      };
      const reset = () => {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      };
      el.addEventListener('mousemove',  onMove);
      el.addEventListener('mouseleave', reset);
    });
}

/* ─── 6. Elastic Pill — main nav ───────────────────────────── */
const navPill      = document.querySelector<HTMLElement>('.nav-pill');
const navItems     = document.querySelectorAll<HTMLElement>('.site-header__nav .nav-item');
const navContainer = document.querySelector<HTMLElement>('.site-header__nav');

if (navPill && navContainer && navItems.length && !reduced) {
  const activeItem =
    Array.from(navItems).find(n => n.getAttribute('aria-current') === 'page') ?? null;

  const movePill = (target: HTMLElement, instant = false) => {
    const pRect = navContainer.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    if (instant) {
      gsap.set(navPill,  { x: tRect.left - pRect.left, width: tRect.width, opacity: 1 });
    } else {
      gsap.to(navPill,   { x: tRect.left - pRect.left, width: tRect.width, opacity: 1, duration: 0.35, ease: 'power3.out' });
    }
  };

  if (activeItem) movePill(activeItem, true);

  navItems.forEach(item => item.addEventListener('mouseenter', () => movePill(item)));
  navContainer.addEventListener('mouseleave', () => {
    if (activeItem) movePill(activeItem);
    else gsap.to(navPill, { opacity: 0, duration: 0.25 });
  });
}

/* ─── 7. Lang pill — static, NO hover movement ─────────────── */
const langPill      = document.querySelector<HTMLElement>('.lang-pill');
const langContainer = document.querySelector<HTMLElement>('.lang-switcher');
const langItems     = document.querySelectorAll<HTMLElement>('.lang-switcher__btn');

if (langPill && langContainer && langItems.length) {
  const activeLang =
    Array.from(langItems).find(n => n.classList.contains('lang-switcher__btn--active')) ?? null;
  if (activeLang) {
    const pRect = langContainer.getBoundingClientRect();
    const tRect = activeLang.getBoundingClientRect();
    gsap.set(langPill, {
      x:       tRect.left - pRect.left,
      width:   tRect.width,
      opacity: 1,
    });
  } else {
    gsap.set(langPill, { opacity: 0 });
  }
}

/* ─── 8. Custom cursor — dot + elastic ring ────────────────── */
/*
 * Dot tracks pointer 1:1; ring follows with damped lerp for elastic feel.
 * `mix-blend-mode: difference` (in CSS) inverts colours against any
 * background, so the cursor reads correctly in both light and dark themes
 * without theme-specific styling.
 *
 * Hover state expands the ring + hides the dot. Triggered for any
 * interactive ancestor (a, button, .g-card, [data-cursor-hover]).
 * Uses a nesting counter so going from card → nested link doesn't blink.
 */
const cursorEl   = document.querySelector<HTMLElement>('.cursor');
const cursorDot  = cursorEl?.querySelector<HTMLElement>('.cursor__dot') ?? null;
const cursorRing = cursorEl?.querySelector<HTMLElement>('.cursor__ring') ?? null;

if (cursorEl && cursorDot && cursorRing && fineCursor && !reduced) {
  document.documentElement.classList.add('has-custom-cursor');

  let mx = -100, my = -100;     // raw mouse
  let rx = -100, ry = -100;     // smoothed ring position
  let firstMove = true;

  const loop = () => {
    /* Dot snaps to cursor every frame */
    cursorDot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    /* Ring lags behind with elastic damping (0.22 = snappy, 0.12 = lazy) */
    rx += (mx - rx) * 0.22;
    ry += (my - ry) * 0.22;
    cursorRing.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (firstMove) {
      /* On the very first frame, snap ring to mouse to avoid flying-in glitch */
      rx = mx;
      ry = my;
      firstMove = false;
    }
    if (!cursorEl.classList.contains('is-visible')) {
      cursorEl.classList.add('is-visible');
    }
  }, { passive: true });

  /* Hide when the cursor leaves the document (window blur, tab switch) */
  document.addEventListener('mouseleave', () => cursorEl.classList.remove('is-visible'));
  window.addEventListener('blur',         () => cursorEl.classList.remove('is-visible'));

  /* Click feedback — ring contracts briefly */
  window.addEventListener('mousedown', () => cursorEl.classList.add('is-down'),    { passive: true });
  window.addEventListener('mouseup',   () => cursorEl.classList.remove('is-down'), { passive: true });

  /* Context-aware variants — Cuberto-style.
     Priority is intentional and stops at the first match:
       1. view   — project cards, hero/case images   (big filled blob + arrow)
       2. button — primary/ghost CTAs, chip links    (filled ring, no dot)
       3. link   — everything else interactive       (subtle ring expand)
     Authors can override per element with [data-cursor="view|button|link|none"].
     Uses mouseover/mouseout bubbling — works on dynamic content and nested
     interactives without per-element listeners. */
  const VARIANT_RULES: Array<[string, 'view' | 'button' | 'link']> = [
    ['[data-cursor="view"], .g-card, .cs__visual-img, .cs__visual-frame, .w-grid .g-card, .h-gallery .g-card', 'view'],
    ['[data-cursor="button"], .btn, .cs__chip, .site-header__burger, .theme-toggle', 'button'],
    ['[data-cursor="link"], a, button, [role="button"], .w-filter, .lang-switcher__btn, .nav-item', 'link'],
  ];
  const VARIANT_CLASSES = ['is-link', 'is-button', 'is-view'] as const;

  const getVariantFor = (el: Element | null): 'view' | 'button' | 'link' | null => {
    if (!el) return null;
    /* Explicit opt-out wins over inheritance */
    const optOut = (el as Element).closest?.('[data-cursor="none"]');
    if (optOut) return null;
    for (const [selector, variant] of VARIANT_RULES) {
      if (el.closest(selector)) return variant;
    }
    return null;
  };

  let currentVariant: string | null = null;
  const applyVariant = (variant: 'view' | 'button' | 'link' | null) => {
    if (variant === currentVariant) return;
    cursorEl.classList.remove(...VARIANT_CLASSES);
    if (variant) cursorEl.classList.add(`is-${variant}`);
    currentVariant = variant;
  };

  document.addEventListener('mouseover', (e) => {
    applyVariant(getVariantFor(e.target as Element));
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    /* mouseout fires constantly when moving inside a single element via child
       transitions — use relatedTarget so we only react to real exits. */
    const next = (e as MouseEvent).relatedTarget as Element | null;
    const variant = getVariantFor(next);
    if (variant !== currentVariant) applyVariant(variant);
  }, { passive: true });

  /* Re-evaluate the variant whenever the page scrolls.
     With Lenis (transform-based scroll), elements move under a stationary
     pointer but mouseover/mouseout don't refire — so the cursor would stay
     stuck in is-view after scrolling a card out from under the pointer.
     elementFromPoint queries what's actually beneath the cursor right now. */
  const recheckVariantUnderPointer = () => {
    if (mx < 0 || my < 0) return;
    const el = document.elementFromPoint(mx, my);
    applyVariant(getVariantFor(el));
  };
  window.addEventListener('scroll', recheckVariantUnderPointer, { passive: true });
  if (lenis) lenis.on('scroll', recheckVariantUnderPointer);

  /* Hide custom cursor over form fields — native text I-beam is more useful
     for typing. The CSS rule `html.has-custom-cursor input { cursor: text }`
     restores the native cursor; this class hides our overlay. */
  const TEXT_INPUT_SELECTOR =
    'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]), textarea, [contenteditable="true"]';
  document.addEventListener('mouseover', (e) => {
    const el = e.target as Element;
    if (el && el.matches?.(TEXT_INPUT_SELECTOR)) {
      cursorEl.classList.add('is-text');
    }
  }, { passive: true });
  document.addEventListener('mouseout', (e) => {
    const el = e.target as Element;
    if (el && el.matches?.(TEXT_INPUT_SELECTOR)) {
      cursorEl.classList.remove('is-text');
    }
  }, { passive: true });
}

/* ─── 9. Project-card light tracking ────────────────────────── */
/* The effect is pointer-only and writes transform/CSS variables in rAF, so it
   stays smooth without changing layout or becoming a touch-only affordance. */
if (fineCursor && !reduced) {
  document.querySelectorAll<HTMLElement>('.g-card').forEach((card) => {
    const visual = card.querySelector<HTMLElement>('.g-card__visual');
    if (!visual) return;

    let frame = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    const render = () => {
      card.style.setProperty('--tilt-x', `${((0.5 - pointerY) * 5).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${((pointerX - 0.5) * 6).toFixed(2)}deg`);
      visual.style.setProperty('--spotlight-x', `${(pointerX * 100).toFixed(1)}%`);
      visual.style.setProperty('--spotlight-y', `${(pointerY * 100).toFixed(1)}%`);
      frame = 0;
    };

    card.addEventListener('pointerenter', () => card.classList.add('is-tilting'));
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      pointerX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      pointerY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
      visual.style.setProperty('--spotlight-x', '50%');
      visual.style.setProperty('--spotlight-y', '50%');
    });
  });
}

/* ─── 10. Scroll-reveal ────────────────────────────────────── */
if (!reduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target as HTMLElement;
      io.unobserve(el);

      if (el.classList.contains('stagger')) {
        gsap.fromTo(
          Array.from(el.children) as HTMLElement[],
          { y: 20, opacity: 0, scale: 0.985 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.05, ease: 'power3.out' },
        );
      } else {
        gsap.fromTo(el, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll<HTMLElement>('.reveal, .stagger').forEach(el => io.observe(el));
}
