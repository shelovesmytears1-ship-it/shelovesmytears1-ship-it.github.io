/* ============================================
   KULT ENERGY — app.js
   ============================================ */

/* === CUSTOM CURSOR ======================== */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  var cursor = document.getElementById('cursor');
  var mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  });

  (function raf() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform = 'translate(' + (cx - 5) + 'px,' + (cy - 5) + 'px)';
    requestAnimationFrame(raf);
  })();

  function addHover(el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('cursor--hover'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('cursor--hover'); });
  }

  document.querySelectorAll('a, button').forEach(addHover);
})();

/* === MAGNETIC BUTTONS ===================== */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.mag-btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
      var dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
      btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
      btn.style.transform  = '';
      setTimeout(function () { btn.style.transition = ''; }, 560);
    });
  });
})();

/* === FLAVOR THEME SWITCHER ================ */
var flavorMap = {
  black: { accent: '#D4FF00', rgb: '212,255,0', label: 'BLACK CAN' },
  void:  { accent: '#9B72CF', rgb: '155,114,207', label: 'VOID CAN' },
  burn:  { accent: '#FF2D00', rgb: '255,45,0', label: 'BURN CAN' },
};

function setFlavorTheme(flavor) {
  var theme = flavorMap[flavor] || flavorMap.black;
  document.documentElement.style.setProperty('--accent', theme.accent);
  document.documentElement.style.setProperty('--accent-rgb', theme.rgb);
  document.body.dataset.flavor = flavor;

  document.querySelectorAll('.flavor-chip').forEach(function (chip) {
    var active = chip.dataset.flavor === flavor;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  var shell = document.querySelector('.hero-product-shell');
  if (shell && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shell.classList.remove('is-flavor-shifting');
    void shell.offsetWidth;
    shell.classList.add('is-flavor-shifting');
    window.setTimeout(function () {
      shell.classList.remove('is-flavor-shifting');
    }, 620);
  }
}

(function () {
  document.querySelectorAll('.flavor-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      setFlavorTheme(chip.dataset.flavor);
    });
  });
})();

/* === HERO POINTER DEPTH =================== */
(function () {
  var hero = document.getElementById('hero');
  if (!hero || !window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.addEventListener('pointermove', function (event) {
    var rect = hero.getBoundingClientRect();
    var px = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    var py = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    hero.style.setProperty('--hero-px', px.toFixed(2));
    hero.style.setProperty('--hero-py', py.toFixed(2));
  });

  hero.addEventListener('pointerleave', function () {
    hero.style.setProperty('--hero-px', '0');
    hero.style.setProperty('--hero-py', '0');
  });
})();

/* === STICKY HEADER ======================== */
(function () {
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* === COUNTDOWN TIMER ====================== */
(function () {
  var end = Date.now() + ((23 * 3600) + (47 * 60) + 12) * 1000;

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  var hEl = document.getElementById('cd-h');
  var mEl = document.getElementById('cd-m');
  var sEl = document.getElementById('cd-s');

  function tick() {
    var rem = Math.max(0, end - Date.now());
    var h = Math.floor(rem / 3600000);
    var m = Math.floor((rem % 3600000) / 60000);
    var s = Math.floor((rem % 60000) / 1000);
    if (hEl) hEl.textContent = pad(h);
    if (mEl) mEl.textContent = pad(m);
    if (sEl) sEl.textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();

/* === FOMO TICKER ========================== */
(function () {
  var unitsEl = document.getElementById('fomo-units');
  var timeEl = document.getElementById('fomo-time');
  if (!unitsEl || !timeEl) return;

  var units = 127;
  var end = Date.now() + ((23 * 3600) + (47 * 60) + 12) * 1000;

  function pad(n) { return String(Math.max(0, n)).padStart(2, '0'); }

  function tickTime() {
    var rem = Math.max(0, end - Date.now());
    var h = Math.floor(rem / 3600000);
    var m = Math.floor((rem % 3600000) / 60000);
    var s = Math.floor((rem % 60000) / 1000);
    timeEl.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  function sellSome() {
    units = Math.max(83, units - (Math.random() > 0.35 ? 1 : 0));
    unitsEl.textContent = units + ' UNITS LEFT';
  }

  tickTime();
  setInterval(tickTime, 1000);
  setInterval(sellSome, 3600);
})();

/* === JOIN FORM ============================ */
(function () {
  var form = document.getElementById('join-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('.join-input');
    var btn   = form.querySelector('button[type="submit"]');

    btn.textContent  = "YOU'RE IN ✓";
    btn.disabled     = true;
    btn.style.background   = 'var(--fg)';
    btn.style.borderColor  = 'var(--fg)';
    btn.style.color        = 'var(--bg)';
    input.value      = '';
    input.placeholder = 'CHECK YOUR EMAIL';
    input.disabled   = true;
  });
})();

/* === UNDERGROUND PASS ===================== */
(function () {
  var form = document.getElementById('pass-form');
  var shell = document.getElementById('pass-shell');
  if (!form || !shell) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    shell.classList.remove('is-unlocked');
    void shell.offsetWidth;
    shell.classList.add('is-unlocked');
    form.querySelector('button').textContent = 'ACCESS GRANTED';
  });
})();

/* === DROP DETAIL / SHARED ELEMENT ========= */
(function () {
  var modal = document.getElementById('drop-modal');
  if (!modal) return;

  var visual = modal.querySelector('.drop-modal__visual');
  var closeBtn = modal.querySelector('.drop-modal__close');
  var title = document.getElementById('drop-modal-title');
  var desc = document.getElementById('drop-modal-desc');
  var flavor = document.getElementById('drop-modal-flavor');
  var stock = document.getElementById('drop-modal-stock');
  var movedImg = null;
  var placeholder = null;
  var originWrap = null;
  var lastFocus = null;

  function setModalOpen(open) {
    modal.hidden = !open;
    modal.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('modal-open', open);
  }

  function openProduct(product) {
    var source = product.querySelector('.product-can-img');
    if (!source || !visual) return;

    if (product.dataset.flavor) setFlavorTheme(product.dataset.flavor);

    lastFocus = document.activeElement;
    title.textContent = product.querySelector('.product-name').textContent;
    desc.textContent = product.querySelector('.product-desc').textContent;
    flavor.textContent = product.dataset.dropFlavor || 'Drop 001 formula';
    stock.textContent = product.dataset.dropStock || product.querySelector('.product-stock').textContent.trim();

    originWrap = source.parentElement;
    placeholder = document.createElement('div');
    placeholder.className = 'product-can-placeholder';
    placeholder.style.width = source.offsetWidth + 'px';
    placeholder.style.height = source.offsetHeight + 'px';

    var state = window.Flip ? Flip.getState(source) : null;
    originWrap.insertBefore(placeholder, source);
    visual.appendChild(source);
    movedImg = source;

    setModalOpen(true);
    closeBtn.focus();

    if (state && window.gsap) {
      Flip.from(state, {
        targets: movedImg,
        duration: 0.64,
        ease: 'expo.inOut',
        absolute: true,
        scale: true,
      });
      gsap.fromTo('.drop-modal__panel', { opacity: 0.35 }, { opacity: 1, duration: 0.24, ease: 'power2.out' });
      gsap.fromTo('.drop-modal__copy > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.42, stagger: 0.045, ease: 'power3.out', delay: 0.18 });
    }
  }

  function closeModal() {
    if (!movedImg || !originWrap || !placeholder) {
      setModalOpen(false);
      return;
    }

    var state = window.Flip ? Flip.getState(movedImg) : null;
    originWrap.insertBefore(movedImg, placeholder);
    placeholder.remove();
    placeholder = null;

    function finish() {
      setModalOpen(false);
      movedImg = null;
      originWrap = null;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (state && window.gsap) {
      Flip.from(state, {
        targets: movedImg,
        duration: 0.42,
        ease: 'expo.inOut',
        absolute: true,
        scale: true,
        onComplete: finish,
      });
    } else {
      finish();
    }
  }

  document.querySelectorAll('.product').forEach(function (product) {
    product.addEventListener('click', function () { openProduct(product); });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

/* ============================================
   SPLIT TEXT UTILITY
   Wraps each character in overflow:hidden spans
   so chars can slide in from below.
============================================ */
function splitToChars(el) {
  var text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = '';

  var result = [];
  text.split('').forEach(function (char) {
    if (char === ' ') {
      var sp = document.createElement('span');
      sp.innerHTML = '&nbsp;';
      sp.style.display = 'inline-block';
      el.appendChild(sp);
      return;
    }
    var wrap  = document.createElement('span');
    var inner = document.createElement('span');
    wrap.className  = 'js-char-wrap';
    inner.className = 'js-char-inner';
    inner.textContent = char;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    result.push(inner);
  });

  return result;
}

/* === TEXT SCRAMBLE UTILITY ================ */
var scrambleChars = '#@!%KULT_01';

function getScrambleText(el) {
  return (el.innerText || el.textContent || '').trim();
}

function renderScrambleText(el, text) {
  el.innerHTML = text.split('\n').map(function (line) {
    return line.replace(/ /g, '&nbsp;');
  }).join('<br>');
}

function scrambleText(el) {
  if (!el || el.dataset.scrambled === 'true') return;
  var original = getScrambleText(el);
  if (!original) return;
  el.dataset.scrambled = 'true';
  el.setAttribute('aria-label', original.replace(/\n+/g, ' '));

  var frame = 0;
  var maxFrames = 18;
  var timer = setInterval(function () {
    frame += 1;
    var progress = frame / maxFrames;
    var next = original.split('').map(function (char, index) {
      if (char === '\n' || char === ' ') return char;
      if (index / original.length < progress) return char;
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
    }).join('');

    renderScrambleText(el, next);
    if (frame >= maxFrames) {
      clearInterval(timer);
      renderScrambleText(el, original);
    }
  }, 24);
}

/* ============================================
   GSAP ANIMATIONS
   Called from index.html after GSAP + ScrollTrigger load.
============================================ */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setStatsFinal() {
    document.querySelectorAll('.kstat-num').forEach(function (el) {
      var target = Number(el.dataset.countTo || 0);
      var pad = Number(el.dataset.pad || 0);
      el.textContent = pad ? String(target).padStart(pad, '0') : String(target);
    });
  }

  if (reduced) {
    setStatsFinal();
    return;
  }
  if (typeof ScrollTrigger === 'undefined') return;

  /* --- Hero parallax on scroll --- */
  gsap.to('.hero-title', {
    y: -54,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.fromTo('.hero-product-shell',
    { x: 0, y: 0, scale: 1, rotate: 0 },
    {
      y: -82, scale: 1.035, rotate: -1.25, transformOrigin: '50% 70%',
      immediateRender: true,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    }
  );
  gsap.fromTo('.hero-scene__image',
    { scale: 1.075, yPercent: 0 },
    {
      scale: 1.13, yPercent: -2.5,
      immediateRender: true,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    }
  );
  gsap.fromTo('.hero-ghost',
    { x: 0 },
    {
      x: -64,
      immediateRender: true,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    }
  );
  gsap.fromTo('.hero-drop-index',
    { y: 0, opacity: 1 },
    {
      y: 54, opacity: 0,
      immediateRender: true,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    }
  );

  /* --- Pinned horizontal-scroll reel (desktop only) --- */
  if (window.matchMedia('(min-width: 901px)').matches) {
    var track   = document.getElementById('hscroll-track');
    var section = document.getElementById('hscroll');
    if (track && section) {
      var getDist = function () { return track.scrollWidth - window.innerWidth; };
      gsap.to(track, {
        x: function () { return -getDist(); },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () { return '+=' + getDist(); },
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  /* --- Manifesto reveal --- */
  gsap.from('.manifesto-big', {
    opacity: 0, y: 55, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.manifesto', start: 'top 82%' },
  });
  gsap.from('.manifesto-accent', {
    opacity: 0, y: 55, duration: 1, ease: 'power3.out', delay: 0.14,
    scrollTrigger: { trigger: '.manifesto', start: 'top 82%' },
  });
  gsap.from('.manifesto-body', {
    opacity: 0, y: 28, duration: 0.8, ease: 'power3.out', delay: 0.28,
    scrollTrigger: { trigger: '.manifesto', start: 'top 78%' },
  });

  /* --- Hacker text scramble on section headlines --- */
  document.querySelectorAll('.manifesto-big, .manifesto-accent, .drop-title, .culture-title, .formula-title, .pass-title, .ugc-title, .fct-word').forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 86%',
      once: true,
      onEnter: function () { scrambleText(el); },
    });
  });

  /* --- Cult rules slam in from the left --- */
  gsap.from('.rule-line', {
    x: -180,
    opacity: 0,
    duration: 0.82,
    stagger: 0.09,
    ease: 'power4.out',
    scrollTrigger: { trigger: '.cult-rules', start: 'top 76%' },
  });

  /* --- Kinetic stats counters --- */
  ScrollTrigger.create({
    trigger: '.kinetic-stats',
    start: 'top 82%',
    once: true,
    onEnter: function () {
      document.querySelectorAll('.kstat-num').forEach(function (el) {
        var target = Number(el.dataset.countTo || 0);
        var pad = Number(el.dataset.pad || 0);
        var state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 1.2,
          ease: 'power4.out',
          onUpdate: function () {
            var value = Math.round(state.value);
            el.textContent = pad ? String(value).padStart(pad, '0') : String(value);
          },
          onComplete: function () {
            el.textContent = pad ? String(target).padStart(pad, '0') : String(target);
          },
        });
      });
    },
  });

  gsap.from('.formula-tile', {
    opacity: 0,
    y: 46,
    duration: 0.72,
    stagger: 0.055,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.formula-grid', start: 'top 84%' },
  });

  /* --- Drop header --- */
  gsap.from('.drop-title', {
    opacity: 0, x: -50, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.drop', start: 'top 82%' },
  });
  gsap.from('.drop-cd-wrap', {
    opacity: 0, x: 50, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.drop', start: 'top 82%' },
  });
  gsap.from('.fomo-ticker', {
    opacity: 0, y: 18, duration: 0.55, ease: 'power2.out',
    scrollTrigger: { trigger: '.drop', start: 'top 82%' },
  });

  /* --- Product cards stagger --- */
  gsap.from('.product', {
    opacity: 0, y: 60, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.products', start: 'top 88%' },
  });

  /* --- Culture title --- */
  gsap.from('.culture-title', {
    opacity: 0, x: -55, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.culture', start: 'top 82%' },
  });

  /* --- Bento cells --- */
  gsap.from('.bento-cell', {
    opacity: 0, scale: 0.94, duration: 0.65, stagger: 0.07, ease: 'power2.out',
    scrollTrigger: { trigger: '.bento', start: 'top 88%' },
  });

  gsap.from('.culture-media', {
    opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.culture-media', start: 'top 84%' },
  });

  gsap.from('.hpanel-can-shot img', {
    y: 80,
    scale: 0.9,
    opacity: 0,
    duration: 0.85,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.hscroll', start: 'top 70%' },
  });
  gsap.fromTo('.culture-media img', { scale: 1 }, {
    scale: 1.3,
    ease: 'none',
    scrollTrigger: { trigger: '.culture-media', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  /* --- UGC --- */
  gsap.from('.ugc-title', {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.ugc', start: 'top 82%' },
  });
  gsap.from('.ugc-card', {
    opacity: 0, y: 50, duration: 0.75, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.ugc-grid', start: 'top 88%' },
  });

  /* --- Final CTA --- */
  gsap.from('.fct-title .fct-word', {
    opacity: 0, y: 50, duration: 0.85, stagger: 0.13, ease: 'power3.out',
    scrollTrigger: { trigger: '.final-cta', start: 'top 82%' },
  });
  gsap.from(['.fct-desc', '.join-form', '.join-legal'], {
    opacity: 0, y: 28, duration: 0.75, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.final-cta', start: 'top 78%' },
  });
}
