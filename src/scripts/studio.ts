/**
 * overflow — Studio motion layer (direction 01)
 *
 * Lenis smooth scroll + replaying scroll reveals + line reveals + parallax and
 * scroll-scrubbed rotation + custom cursor + elastic magnetic buttons +
 * direction-aware marquee + sliding project preview + live clock.
 *
 * Parallax/scrub run in the single rAF loop that already drives Lenis, so this
 * stays dependency-free — no ScrollTrigger, no extra ~40kb on every page.
 *
 * Everything degrades: reduced-motion and touch/coarse pointers get a fully
 * static, fully usable page.
 */
import Lenis from 'lenis';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---- split text into per-word masked tracks (reads as line reveal) ---- */
function splitInto(el: HTMLElement, cls: string, step: number): void {
  type Token = { word?: string; accent?: boolean; br?: boolean };
  const tokens: Token[] = [];
  const walk = (node: Node, accent = false): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      (node.textContent || '').trim().split(/\s+/).filter(Boolean)
        .forEach((word) => tokens.push({ word, accent }));
      return;
    }
    if (!(node instanceof HTMLElement)) return;
    if (node.tagName === 'BR') {
      tokens.push({ br: true });
      return;
    }
    const nextAccent = accent || node.tagName === 'EM' || node.classList.contains('accent');
    node.childNodes.forEach((child) => walk(child, nextAccent));
  };
  el.childNodes.forEach((node) => walk(node));

  el.replaceChildren();
  let wordIndex = 0;
  tokens.forEach((token, index) => {
    if (token.br) {
      el.appendChild(document.createElement('br'));
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const outer = document.createElement('span');
    outer.className = cls;
    const inner = document.createElement('span');
    if (token.accent) inner.className = 'accent';
    inner.textContent = token.word || '';
    inner.style.transitionDelay = `${step * wordIndex}s`;
    wordIndex += 1;
    outer.appendChild(inner);
    el.appendChild(outer);
    if (index < tokens.length - 1 && !tokens[index + 1]?.br) {
      el.appendChild(document.createTextNode(' '));
    }
  });
}

document.querySelectorAll<HTMLElement>('.js-split').forEach((el) => splitInto(el, 'word', 0.05));
// section headings get the tight stagger that reads as whole lines lifting
document.querySelectorAll<HTMLElement>('.sec-head h2, .page-hero h1, .contact h2').forEach((el) => {
  if (el.querySelector('.line, .word')) return;
  splitInto(el, 'line', 0.014);
  el.setAttribute('data-reveal', '');
});

// the curtain owns this on pages that have one
if (!document.getElementById('curtain')) {
  requestAnimationFrame(() => document.body.classList.add('loaded'));
}

/* ---- scroll reveal -------------------------------------------------------
   Reveal each element once per page load. Re-hiding content after it leaves
   the viewport made sections blink at IntersectionObserver boundaries,
   especially while Lenis was still easing the scroll position. The CSS
   default stays visible; motion-ready is added only after the observer is
   installed, so a failed/disabled script can never leave content invisible. */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
);
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
document.documentElement.classList.add('motion-ready');

/* ---- sticky nav state ---- */
const hdr = document.querySelector('.hdr');
if (hdr) {
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

/* ---- mobile menu ----
   The nav links are display:none under 760px, so without this the Work /
   Method / About pages are simply unreachable from a phone. */
const burger = document.getElementById('burger');
const mnav = document.getElementById('mnav');
if (burger && mnav) {
  const setMenu = (open: boolean) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    // keep the closed panel out of the tab order and off screen readers
    if (open) mnav.removeAttribute('inert');
    else mnav.setAttribute('inert', '');
    if (open) mnav.querySelector('a')?.focus({ preventScroll: true });
  };
  burger.addEventListener('click', () =>
    setMenu(burger.getAttribute('aria-expanded') !== 'true')
  );
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenu(false);
      burger.focus();
    }
  });
  // if the viewport grows past the breakpoint the panel must not stay latched
  matchMedia('(min-width: 761px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });
}

/* ---- wrap every button label ----
   .btn::before is the hover fill and paints over anything without a stacking
   context. A bare text node cannot be raised above it, so labels that were not
   already wrapped (every non-magnetic button) got covered. Wrap them all. */
document.querySelectorAll<HTMLElement>('.btn').forEach((b) => {
  if (!b.querySelector('.btn-text')) {
    const span = document.createElement('span');
    span.className = 'btn-text';
    while (b.firstChild) span.appendChild(b.firstChild);
    b.appendChild(span);
  }
  /* origin the hover fill at the point where the pointer entered, so it grows
     out from under the cursor (--fx/--fy consumed by .btn::before) */
  b.addEventListener('mouseenter', (e) => {
    const r = b.getBoundingClientRect();
    b.style.setProperty('--fx', `${e.clientX - r.left}px`);
    b.style.setProperty('--fy', `${e.clientY - r.top}px`);
  });
});

/* ---- live local clock (hero strip + footer) ---- */
const clocks = Array.from(document.querySelectorAll<HTMLElement>('[data-clock]'));
if (clocks.length) {
  const tick = () => {
    const t = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    clocks.forEach((el) => { el.textContent = `${el.dataset.label || ''} ${t}`.trim(); });
  };
  tick();
  setInterval(tick, 10_000);
}

/* ---- device videos: play only while on screen, never in the background ---- */
const vids = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-inview]'));
if (vids.length) {
  const play = (v: HTMLVideoElement) => { if (!reduce) v.play().catch(() => {}); };
  const vObs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) play(v); else v.pause();
    }),
    { threshold: 0.25 }
  );
  vids.forEach((v) => vObs.observe(v));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) vids.forEach((v) => v.pause());
  });
}

/* ---- hero 3D (desktop + motion only) -------------------------------------
   The hero is above the fold, so start fetching its chunk immediately while
   the page curtain is still covering the document. The CSS fallback remains
   visible until hero3d has rendered its first frame. */
const hero3d = document.getElementById('hero3d');
if (hero3d && !reduce) {
  import('./hero3d').then((m) => m.initHero3D(hero3d)).catch(() => {});
}

/* ---- 3D coverflow carousel (lazy chunk, desktop + motion only) ---- */
const gallery = document.getElementById('gallery3d');
if (gallery) {
  if (!reduce && matchMedia('(min-width: 821px)').matches) {
    const cap = document.getElementById('gallery3d-cap');
    const galObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        galObs.disconnect();
        import('./gallery3d').then((m) => m.initGallery3D(gallery, cap)).catch(() => {});
      }
    }, { threshold: 0.05 });
    galObs.observe(gallery);
  } else {
    gallery.style.display = 'none';
    const cap = document.getElementById('gallery3d-cap');
    if (cap) cap.style.display = 'none';
  }
}

/* Everything below is enhancement only. */
if (!reduce) {
  /* ---- Lenis smooth scroll ---- */
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });

  /* ---- parallax + scroll-scrubbed rotation ----
     data-speed: >0 lags behind the page, <0 runs ahead of it
     data-rotate: total degrees swept while the element crosses the viewport */
  type PItem = { el: HTMLElement; speed: number; rotate: number; on: boolean };
  // desktop only: on a phone the transforms fight the swipeable phone row and
  // buy nothing, since everything is already one column
  const wide = matchMedia('(min-width: 821px)').matches;
  const pItems: PItem[] = (wide ? Array.from(
    document.querySelectorAll<HTMLElement>('[data-speed],[data-rotate]')
  ) : []).map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed || '0'),
    rotate: parseFloat(el.dataset.rotate || '0'),
    on: false,
  }));

  if (pItems.length) {
    const pObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const item = pItems.find((p) => p.el === e.target);
        if (item) item.on = e.isIntersecting;
      }),
      { rootMargin: '15% 0px' }
    );
    pItems.forEach((p) => pObs.observe(p.el));
  }

  /* Arcs: a wide ellipse peeking through a short window. The window height
     collapses to 0 as the section takes over the screen, so the curved seam
     flattens into a straight edge. Absolutely positioned, so resizing it
     costs no reflow. */
  const arcs = Array.from(document.querySelectorAll<HTMLElement>('[data-collapse]'));

  const applyParallax = () => {
    const vh = innerHeight;
    for (const p of pItems) {
      if (!p.on) continue;
      const r = p.el.getBoundingClientRect();
      // -1 when the element sits below the fold, +1 once it is above it
      const progress = 1 - (r.top + r.height / 2) / (vh / 2 + r.height / 2);
      const y = p.speed ? progress * p.speed * -22 : 0;
      const rot = p.rotate ? progress * p.rotate : 0;
      p.el.style.transform =
        `translate3d(0,${y.toFixed(2)}px,0)` + (rot ? ` rotate(${rot.toFixed(2)}deg)` : '');
    }
    for (const el of arcs) {
      const base = parseFloat(el.dataset.collapse || '0');
      const top = el.getBoundingClientRect().top;
      if (top > vh || top < -vh) continue;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.55)));
      el.style.height = `${(base * (1 - p)).toFixed(2)}vh`;
    }
  };

  /* ---- marquee that reverses with the scroll direction ----
     The strip loops by exactly one unit width, which only looks seamless while
     the strip is longer than the viewport. Two hardcoded copies were not: one
     copy measured ~920px against a 1345px viewport, so the tail cleared the
     screen and left a gap. Clone until the strip outruns the viewport instead. */
  const mq = document.querySelector<HTMLElement>('.marquee');
  const mqTrack = mq?.querySelector<HTMLElement>('.mq-track') ?? null;
  const mqUnit = mqTrack?.querySelector<HTMLElement>('.mq-unit') ?? null;
  let mqX = 0, mqDir = 1, mqUnitW = 0;

  const buildMarquee = () => {
    if (!mqTrack || !mqUnit) return;
    mqTrack.querySelectorAll('.mq-unit.clone').forEach((n) => n.remove());
    mqUnitW = mqUnit.getBoundingClientRect().width;
    if (!mqUnitW) return;
    const copies = Math.ceil(innerWidth / mqUnitW) + 1;
    for (let i = 1; i < copies; i++) {
      const clone = mqUnit.cloneNode(true) as HTMLElement;
      clone.classList.add('clone');
      mqTrack.appendChild(clone);
    }
  };

  if (mqTrack && mqUnit) {
    buildMarquee();
    addEventListener('resize', buildMarquee);
    // webfonts change the unit width once they land
    document.fonts?.ready.then(buildMarquee).catch(() => {});
  }

  let lastY = 0;
  const raf = (time: number) => {
    lenis.raf(time);
    applyParallax();

    if (mqTrack && mqUnitW) {
      mqX -= 0.55 * mqDir;
      if (mqX <= -mqUnitW) mqX += mqUnitW;
      if (mqX > 0) mqX -= mqUnitW;
      mqTrack.style.transform = `translate3d(${mqX.toFixed(2)}px,0,0)`;
    }
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  lenis.on('scroll', ({ scroll }: { scroll: number }) => {
    const dir = scroll > lastY ? 1 : scroll < lastY ? -1 : mqDir;
    mqDir = dir;
    lastY = scroll;
  });

  // anchor links → smooth scroll via Lenis
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -20 });
      }
    });
  });
}

if (!reduce && fine) {
  /* ---- custom cursor ---- */
  document.body.classList.add('cursoron');
  const cur = document.querySelector<HTMLElement>('.cur');
  if (cur) {
    const labelEl = cur.querySelector<HTMLElement>('.cur-label');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // per-locale default verbs for the cursor pill
    const lang = document.documentElement.lang || 'pl';
    const view: Record<string, string> = { pl: 'Zobacz', ru: 'Смотреть', en: 'View', ua: 'Дивитись' };
    const viewWord = view[lang] || view.pl;

    // Resolve the word shown inside the expanding cursor:
    //  explicit data-cursor text > project link > external link > default arrow
    const labelFor = (el: HTMLElement): string => {
      const explicit = (el.dataset.cursor || '').trim();
      if (explicit) return explicit;
      const a = el.closest('a') as HTMLAnchorElement | null;
      const href = a?.getAttribute('href') || '';
      if (/\/work\/[^/]+/.test(href)) return viewWord;  // a specific case, not the index
      if (/^https?:/i.test(href) || a?.target === '_blank') return '↗';
      return '→';
    };

    document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const word = labelFor(el);
        if (labelEl) labelEl.textContent = word;
        cur.classList.add('hover');
        cur.classList.toggle('labeled', !!word);
      });
      el.addEventListener('mouseleave', () => {
        cur.classList.remove('hover', 'labeled');
      });
    });
  }

  /* ---- project row preview: one strip of every cover that slides between rows.
         Two layers trail the cursor at different speeds, so they parallax. ---- */
  const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-preview]'));
  if (rows.length) {
    const pv = document.createElement('div');
    pv.className = 'work-preview';
    const pvInner = document.createElement('div');
    pvInner.className = 'work-preview-inner';
    const pvChrome = document.createElement('div');
    pvChrome.className = 'work-preview-chrome';
    pvChrome.innerHTML = '<span class="work-preview-dots"><i></i><i></i><i></i></span>';
    const pvLabel = document.createElement('span');
    pvLabel.className = 'work-preview-label';
    const pvIndex = document.createElement('span');
    pvIndex.className = 'work-preview-index';
    pvChrome.append(pvLabel, pvIndex);
    const pvViewport = document.createElement('div');
    pvViewport.className = 'work-preview-viewport';
    const strip = document.createElement('div');
    strip.className = 'work-preview-strip';

    rows.forEach((row, i) => {
      const cell = document.createElement('div');
      cell.style.top = `${i * 100}%`;
      cell.style.backgroundImage = `url('${row.dataset.preview}')`;
      strip.appendChild(cell);
    });
    pvViewport.appendChild(strip);
    pvInner.append(pvChrome, pvViewport);
    pv.appendChild(pvInner);

    const pvBtn = document.createElement('div');
    pvBtn.className = 'work-preview-btn';
    const pvBtnInner = document.createElement('div');
    pvBtnInner.className = 'work-preview-btn-inner';
    pvBtnInner.textContent = rows[0].dataset.view || 'View';
    pvBtn.appendChild(pvBtnInner);

    document.body.append(pv, pvBtn);

    const show = (on: boolean) => {
      pv.classList.toggle('show', on);
      pvBtn.classList.toggle('show', on);
      document.body.classList.toggle('previewing', on);
    };

    let ix = innerWidth / 2, iy = innerHeight / 2, bx = ix, by = iy, mx = ix, my = iy;
    let current = -1;

    const setRow = (i: number) => {
      if (i === current) return;
      current = i;
      if (i < 0) { show(false); return; }
      strip.style.transform = `translateY(${-i * 100}%)`;
      pvLabel.textContent = rows[i].querySelector<HTMLElement>('.work-name')?.textContent?.trim() || '';
      pvIndex.textContent = `${String(i + 1).padStart(2, '0')} / ${String(rows.length).padStart(2, '0')}`;
      show(true);
    };

    // Resolve from the pointer position rather than mouseenter/mouseleave: when
    // the wheel moves rows under a stationary cursor the browser fires no mouse
    // events at all, which left the strip stuck on the previous project.
    const syncFromPoint = () => {
      const el = document.elementFromPoint(mx, my);
      const row = (el as Element | null)?.closest?.('[data-preview]') as HTMLElement | null;
      setRow(row ? rows.indexOf(row) : -1);
    };

    addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      syncFromPoint();
    });

    let queued = false;
    addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; syncFromPoint(); });
    }, { passive: true });
    const pvLoop = () => {
      if (pv.classList.contains('show')) {
        ix += (mx - ix) * 0.085; iy += (my - iy) * 0.085;
        bx += (mx - bx) * 0.17;  by += (my - by) * 0.17;
      } else {
        ix = bx = mx; iy = by = my;
      }
      pv.style.transform = `translate(${ix}px,${iy}px)`;
      pvBtn.style.transform = `translate(${bx}px,${by}px)`;
      requestAnimationFrame(pvLoop);
    };
    requestAnimationFrame(pvLoop);
  }

  /* ---- magnetic buttons: shell and label pull at different strengths,
         then snap back on an elastic curve ---- */
  document.querySelectorAll<HTMLElement>('.magnetic').forEach((b) => {
    const label = b.querySelector<HTMLElement>('.btn-text');
    const strength = parseFloat(b.dataset.strength || '34');
    const textStrength = parseFloat(b.dataset.strengthText || '16');

    b.addEventListener('mouseenter', () => b.classList.add('pull'));
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.transform = `translate(${nx * strength}px,${ny * strength}px)`;
      if (label) label.style.transform = `translate(${nx * textStrength}px,${ny * textStrength}px)`;
    });
    b.addEventListener('mouseleave', () => {
      b.classList.remove('pull');
      b.style.transform = '';
      if (label) label.style.transform = '';
    });
  });
}
