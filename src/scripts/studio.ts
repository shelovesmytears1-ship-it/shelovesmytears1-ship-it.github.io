/**
 * overflow — Studio motion layer (direction 01)
 * Lenis smooth scroll + scroll reveals + custom cursor + magnetic buttons
 * + hero word reveal + project-row hover preview + live clock.
 * Everything degrades gracefully: reduced-motion and touch/coarse pointers
 * get a fully static, fully usable page.
 */
import Lenis from 'lenis';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---- hero word split ---- */
document.querySelectorAll<HTMLElement>('.js-split').forEach((el) => {
  const words = (el.textContent || '').trim().split(/\s+/);
  el.innerHTML = words
    .map((w) => `<span class="word"><span>${w}</span></span>`)
    .join(' ');
  el.querySelectorAll<HTMLElement>('.word > span').forEach((s, i) => {
    s.style.transitionDelay = `${0.05 * i}s`;
  });
});
requestAnimationFrame(() => document.body.classList.add('loaded'));

/* ---- scroll reveal ---- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
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
    const t = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
      import('./hero3d')
        .then((m) => m.initHero3D(hero3d))
        .catch(() => {});
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
        import('./gallery3d')
          .then((m) => m.initGallery3D(gallery, cap))
          .catch(() => {});
      }
    }, { threshold: 0.05 });
    galObs.observe(gallery);
  } else {
    // no 3D here → collapse so there's no empty gap (rows below stay)
    gallery.style.display = 'none';
    const cap = document.getElementById('gallery3d-cap');
    if (cap) cap.style.display = 'none';
  }
}

/* Everything below is enhancement only. */
if (!reduce) {
  /* ---- Lenis smooth scroll ---- */
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

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
    let cx = innerWidth / 2,
      cy = innerHeight / 2,
      tx = cx,
      ty = cy;
    addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
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

    rows.forEach((row, i) => {
      row.addEventListener('mouseenter', () => {
        // slide the whole strip instead of swapping the image
        strip.style.transform = `translateY(${-i * 100}%)`;
        show(true);
      });
      row.addEventListener('mouseleave', () => show(false));
    });

    // image window lags further behind than the pill → they separate while moving
    let ix = innerWidth / 2, iy = innerHeight / 2, bx = ix, by = iy, mx = ix, my = iy;
    addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    const pvLoop = () => {
      if (pv.classList.contains('show')) {
        ix += (mx - ix) * 0.085;
        iy += (my - iy) * 0.085;
        bx += (mx - bx) * 0.17;
        by += (my - by) * 0.17;
      } else {
        ix = bx = mx; iy = by = my;
      }
      pv.style.transform = `translate(${ix}px,${iy}px)`;
      pvBtn.style.transform = `translate(${bx}px,${by}px)`;
      requestAnimationFrame(pvLoop);
    };
    requestAnimationFrame(pvLoop);
  }

  /* ---- magnetic buttons ---- */
  document.querySelectorAll<HTMLElement>('.magnetic').forEach((b) => {
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.3;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.4;
      b.style.transform = `translate(${dx}px,${dy}px)`;
    });
    b.addEventListener('mouseleave', () => {
      b.style.transform = '';
    });
  });
}
