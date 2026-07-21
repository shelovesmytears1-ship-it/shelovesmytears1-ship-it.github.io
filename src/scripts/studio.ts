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
  const words = (el.textContent || '').trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="${cls}"><span>${w}</span></span>`).join(' ');
  el.querySelectorAll<HTMLElement>(`.${cls} > span`).forEach((s, i) => {
    s.style.transitionDelay = `${step * i}s`;
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

/* ---- scroll reveal (replays on re-entry, like the reference site) ---- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      // only reset once it is fully clear of the viewport, so it never
      // re-triggers while the user is still reading it
      if (e.isIntersecting) e.target.classList.add('in');
      else if (e.intersectionRatio === 0) e.target.classList.remove('in');
    });
  },
  { threshold: [0, 0.12] }
);
document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

/* ---- sticky nav state ---- */
const hdr = document.querySelector('.hdr');
if (hdr) {
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

/* ---- live local clock ---- */
const clock = document.getElementById('clock');
if (clock) {
  const tick = () => {
    const t = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    clock.textContent = `${clock.dataset.label || ''} ${t}`.trim();
  };
  tick();
  setInterval(tick, 10_000);
}

/* ---- hero 3D (lazy chunk, desktop + motion only) ---- */
const hero3d = document.getElementById('hero3d');
if (hero3d && !reduce && matchMedia('(min-width: 821px)').matches) {
  const once = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      once.disconnect();
      import('./hero3d').then((m) => m.initHero3D(hero3d)).catch(() => {});
    }
  }, { threshold: 0.1 });
  once.observe(hero3d);
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
  const pItems: PItem[] = Array.from(
    document.querySelectorAll<HTMLElement>('[data-speed],[data-rotate]')
  ).map((el) => ({
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
  };

  /* ---- marquee that reverses with the scroll direction ---- */
  const mq = document.querySelector<HTMLElement>('.marquee');
  const mqTrack = mq?.querySelector('div') as HTMLElement | undefined;
  let mqX = 0, mqDir = 1, mqHalf = 0;
  if (mq && mqTrack) {
    mq.classList.add('js');
    const measure = () => { mqHalf = mqTrack.scrollWidth / 2; };
    measure();
    new ResizeObserver(measure).observe(mqTrack);
  }

  let lastY = 0;
  const raf = (time: number) => {
    lenis.raf(time);
    applyParallax();

    if (mqTrack && mqHalf) {
      mqX -= 0.55 * mqDir;
      if (mqX <= -mqHalf) mqX += mqHalf;
      if (mqX > 0) mqX -= mqHalf;
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
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cur.style.transform = `translate(${cx}px,${cy}px)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => cur.classList.add('hover'));
      el.addEventListener('mouseleave', () => cur.classList.remove('hover'));
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
    const strip = document.createElement('div');
    strip.className = 'work-preview-strip';

    rows.forEach((row, i) => {
      const cell = document.createElement('div');
      cell.style.top = `${i * 100}%`;
      cell.style.backgroundImage = `url('${row.dataset.preview}')`;
      strip.appendChild(cell);
    });
    pvInner.appendChild(strip);
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
    // wrap the label so it can drift independently of the shell
    if (!b.querySelector('.btn-text')) {
      const span = document.createElement('span');
      span.className = 'btn-text';
      while (b.firstChild) span.appendChild(b.firstChild);
      b.appendChild(span);
    }
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
