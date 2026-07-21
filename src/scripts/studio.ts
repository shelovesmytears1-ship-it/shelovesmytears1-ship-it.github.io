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

  /* ---- project row hover preview (cover image + "view" pill) ---- */
  const pv = document.createElement('div');
  pv.className = 'work-preview';
  const pvImg = document.createElement('div');
  pvImg.className = 'work-preview-img';
  const pvBtn = document.createElement('span');
  pvBtn.className = 'work-preview-btn';
  pv.append(pvImg, pvBtn);
  document.body.appendChild(pv);

  document.querySelectorAll<HTMLElement>('[data-preview]').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      const src = row.dataset.preview;
      if (!src) return;
      pvImg.style.backgroundImage = `url('${src}')`;
      pvBtn.textContent = row.dataset.view || 'View';
      pv.classList.add('show');
      document.body.classList.add('previewing');
    });
    row.addEventListener('mouseleave', () => {
      pv.classList.remove('show');
      document.body.classList.remove('previewing');
    });
  });

  // lerp-follow so the card trails the cursor instead of snapping to it
  let px = innerWidth / 2, py = innerHeight / 2, ptx = px, pty = py;
  addEventListener('mousemove', (e) => { ptx = e.clientX; pty = e.clientY; });
  const pvLoop = () => {
    if (pv.classList.contains('show')) {
      px += (ptx - px) * 0.12;
      py += (pty - py) * 0.12;
      pv.style.left = `${px}px`;
      pv.style.top = `${py}px`;
    } else {
      px = ptx; py = pty;
    }
    requestAnimationFrame(pvLoop);
  };
  requestAnimationFrame(pvLoop);

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
