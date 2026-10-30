/**
 * SMM VANGUARD — MASTER SCRIPT (REJOUICE CANON)
 * Zero-Lag Native Scroll + Kinetic Typography + Hero Play Reel Cursor + Smooth Anchor Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // Trigger kinetic entrance animation on Hero wordmark, statement & header
  function triggerEntrance() {
    if (document.body.classList.contains('is-loaded')) return;
    document.body.classList.add('is-loaded');
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      setTimeout(triggerEntrance, 60);
    }).catch(() => {
      setTimeout(triggerEntrance, 120);
    });
  } else {
    setTimeout(triggerEntrance, 120);
  }
  setTimeout(triggerEntrance, 350);

  initMagneticCursor();
  initScrollReveals();
  initManifestoScroll();
  initCaseTabs();
  initRetentionLab();
  initSprintConfigurator();
  initModalReel();
  initMobileMenu();
  initSmoothAnchorScroll();
});

/* ==========================================================================
   1. MAGNETIC CURSOR FOLLOWER PILL (REJOUICE PLAY REEL — HERO ONLY)
   ========================================================================== */
function initMagneticCursor() {
  const hero = document.getElementById('hero');
  const follower = document.getElementById('cursorFollower');
  const header = document.querySelector('.site-header');
  if (!hero || !follower) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isInsideHero = false;
  let hasMovedPointer = false;
  let scaleVal = 0;
  let targetScale = 0;
  let lastClientX = 0;
  let lastClientY = 0;

  function updateHeroBounds(clientX, clientY) {
    lastClientX = clientX;
    lastClientY = clientY;
    const rect = hero.getBoundingClientRect();
    const headerH = header ? header.offsetHeight : 72;

    // Must be below top navigation, inside hero horizontally, and above bottom fold
    const inVert = clientY >= headerH && clientY <= rect.bottom;
    const inHoriz = clientX >= rect.left && clientX <= rect.right;
    const heroVisible = rect.bottom > headerH + 20 && window.scrollY < rect.height * 0.75;

    if (inVert && inHoriz && heroVisible) {
      if (!hasMovedPointer) {
        hasMovedPointer = true;
        cursorX = clientX - rect.left;
        cursorY = clientY - rect.top;
      }
      mouseX = clientX - rect.left;
      mouseY = clientY - rect.top;
      isInsideHero = true;
      targetScale = 1;
      follower.classList.add('active');
    } else {
      isInsideHero = false;
      targetScale = 0;
      follower.classList.remove('active');
    }
  }

  window.addEventListener('mousemove', (e) => {
    updateHeroBounds(e.clientX, e.clientY);
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    isInsideHero = false;
    targetScale = 0;
    follower.classList.remove('active');
  });

  window.addEventListener('scroll', () => {
    const rect = hero.getBoundingClientRect();
    const headerH = header ? header.offsetHeight : 72;
    if (rect.bottom <= headerH + 20 || window.scrollY > window.innerHeight * 0.5) {
      isInsideHero = false;
      targetScale = 0;
      follower.classList.remove('active');
    } else if (hasMovedPointer && lastClientY > 0) {
      updateHeroBounds(lastClientX, lastClientY);
    }
  }, { passive: true });

  // Clicking inside the hero opens the Showreel Modal
  hero.addEventListener('click', (e) => {
    if (e.target.closest('.site-header') || e.target.closest('a') || e.target.closest('button')) return;
    const modal = document.getElementById('reelModal');
    if (modal) {
      modal.classList.add('active');
    }
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    scaleVal += (targetScale - scaleVal) * 0.2;
    if (scaleVal < 0.005 && targetScale === 0) {
      scaleVal = 0;
    }
    follower.style.transform = `translate3d(${cursorX.toFixed(1)}px, ${cursorY.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scaleVal.toFixed(3)})`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

/* ==========================================================================
   1B. INTERSECTION OBSERVER SCROLL REVEALS
   ========================================================================== */
function initScrollReveals() {
  const els = document.querySelectorAll('.reveal-on-scroll');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));
}

/* ==========================================================================
   1C. SMOOTH ANCHOR SCROLL (ZERO WHEEL HIJACKING)
   ========================================================================== */
function initSmoothAnchorScroll() {
  let animId = null;

  function cancelSmoothScroll() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  window.addEventListener('wheel', cancelSmoothScroll, { passive: true });
  window.addEventListener('touchstart', cancelSmoothScroll, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      cancelSmoothScroll();

      const startY = window.scrollY;
      const targetRect = target.getBoundingClientRect();
      const offset = (href === '#hero') ? 0 : 72;
      const targetY = Math.max(0, startY + targetRect.top - offset);
      const distance = targetY - startY;
      if (Math.abs(distance) < 4) return;

      const duration = 780;
      const startTime = performance.now();

      function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3); // cubicOut
        window.scrollTo(0, startY + distance * ease);
        if (t < 1) {
          animId = requestAnimationFrame(step);
        } else {
          animId = null;
        }
      }
      animId = requestAnimationFrame(step);
    });
  });
}

/* ==========================================================================
   2. MANIFESTO WORD-BY-WORD SCROLL HIGHLIGHT
   ========================================================================== */
function initManifestoScroll() {
  const manifesto = document.getElementById('manifestoText');
  if (!manifesto) return;

  const words = manifesto.querySelectorAll('.word');
  if (!words.length) return;

  function updateWords() {
    const rect = manifesto.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    const start = windowH * 0.85;
    const end = windowH * 0.2;
    const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
    
    const countToHighlight = Math.floor(progress * words.length);
    words.forEach((word, index) => {
      if (index <= countToHighlight) {
        word.classList.add('illuminated');
      } else {
        word.classList.remove('illuminated');
      }
    });
  }

  window.addEventListener('scroll', updateWords, { passive: true });
  updateWords();
}

/* ==========================================================================
   3. CASE SHOWCASE FORMAT SWITCHER TABS
   ========================================================================== */
const CASE_DATA = {
  aura: {
    hook: "Pierwsze 1.2 sekundy: Makro-ujęcie fuzji zimnej wody z esencją różaną w 120 FPS. Zero logo w kadrze, czysty sensoryczny szok przerywający bezwładny swipe.",
    storyboard: "9 ujęć 35mm: Od laboratoryjnej ekstrakcji w szkle do żywego kontaktu z cerą o poranku. Rytm montażu dopasowany do pulsu 128 BPM.",
    metrics: "4.8M Zasięgu Organicznego · 18.2% CTR do zakupu · 96 godzin do wyprzedania całego pierwszego nakładu (4 000 sztuk)."
  },
  kinetic: {
    hook: "Tytanowe słuchawki uderzają w bazaltową skałę — gwałtowne wyciszenie całego dźwięku aplikacji do zera na 600ms. Słuchacz fizycznie czuje ciszę.",
    storyboard: "Brutalistyczny montaż 35mm: Monolity islandzkiego bazaltu zestawione z precyzją frezowanego tytanu. Dźwięk mikrofoniczny w standardzie binauralnym.",
    metrics: "Drop 72h Sold Out · 4.1× Zwrot z nakładów (ROAS) · 14 000 organicznych remiksów formatu dźwiękowego w TikTok Sounds."
  },
  velo: {
    hook: "Cięcie w pełnej prędkości: Rower mknie przez mokry plac Grzybowski w Warszawie. Odbicie neonu rozrywa kadr na pół. Pytanie: 'Dlaczego miasto ma stać?'",
    storyboard: "Sekwencja nocna: Anamorficzne flary świetlne, dźwięk silnika elektrycznego wkręcającego się na obroty. Kontrast surowej architektury z technologią.",
    metrics: "+310% Retencji w 3. sekundzie w porównaniu z benchmarkiem branży · 1.2M wyświetleń w Warszawie i Berlinie."
  }
};

function initCaseTabs() {
  document.querySelectorAll('.case-card').forEach(card => {
    const caseKey = card.dataset.case;
    const contentEl = card.querySelector('.format-tab-content');
    const tabs = card.querySelectorAll('.format-tab-btn');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const format = tab.dataset.format;
        if (CASE_DATA[caseKey] && CASE_DATA[caseKey][format]) {
          contentEl.style.opacity = '0';
          setTimeout(() => {
            contentEl.textContent = CASE_DATA[caseKey][format];
            contentEl.style.opacity = '1';
          }, 120);
        }
      });
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE 3-SECOND RETENTION LAB
   ========================================================================== */
const HOOK_PRESETS = {
  shock: {
    title: "Visual Shock & Odwrócona Grawitacja",
    ret3s: "78%",
    ret15s: "54%",
    ctr: "+4.2%",
    cpa: "-44%",
    path: "M 0,20 C 40,25 80,45 150,60 C 250,75 350,90 500,105",
    color: "#FF451A"
  },
  pattern: {
    title: "Pattern Interrupt & Brutalne Cięcie",
    ret3s: "84%",
    ret15s: "49%",
    ctr: "+3.8%",
    cpa: "-38%",
    path: "M 0,20 C 30,22 60,35 150,55 C 270,85 380,110 500,120",
    color: "#FF6633"
  },
  asmr: {
    title: "ASMR Tactile Macro & Dźwięk Materiału",
    ret3s: "72%",
    ret15s: "68%",
    ctr: "+5.1%",
    cpa: "-49%",
    path: "M 0,20 C 50,30 100,40 150,50 C 250,60 380,72 500,85",
    color: "#FF3300"
  }
};

function initRetentionLab() {
  const hookBtns = document.querySelectorAll('.hook-btn');
  const curvePath = document.getElementById('curvePath');
  const ret3sEl = document.getElementById('retStat3s');
  const ret15sEl = document.getElementById('retStat15s');
  const ctrEl = document.getElementById('retStatCtr');
  const cpaEl = document.getElementById('retStatCpa');
  const activeTitleEl = document.getElementById('activeHookTitle');

  if (!hookBtns.length || !curvePath) return;

  hookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      hookBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const hookKey = btn.dataset.hook;
      const data = HOOK_PRESETS[hookKey];
      if (!data) return;

      curvePath.setAttribute('d', data.path);
      curvePath.setAttribute('stroke', data.color);

      ret3sEl.textContent = data.ret3s;
      ret15sEl.textContent = data.ret15s;
      ctrEl.textContent = data.ctr;
      cpaEl.textContent = data.cpa;
      if (activeTitleEl) activeTitleEl.textContent = data.title;
    });
  });
}

/* ==========================================================================
   5. SPRINT CONFIGURATOR & BRIEF FORM
   ========================================================================== */
function initSprintConfigurator() {
  const tierOptions = document.querySelectorAll('.tier-option');
  const scopeInput = document.getElementById('sprintScopeInput');
  const form = document.getElementById('sprintForm');

  tierOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      tierOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      if (scopeInput) {
        scopeInput.value = opt.dataset.tier;
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = "Zgłoszenie wysłane — rezerwacja potwierdzona!";
      submitBtn.style.backgroundColor = "#22C55E";
      
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = "";
      }, 2500);
    });
  }
}

/* ==========================================================================
   6. VIDEO REEL MODAL INSPECTOR
   ========================================================================== */
function initModalReel() {
  const modal = document.getElementById('reelModal');
  const closeBtn = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDesc');

  if (!modal || !closeBtn) return;

  document.querySelectorAll('.open-reel-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.dataset.reelTitle || "SMM Vanguard Showreel";
      const img = btn.dataset.reelImg || "assets/01_rejouice_hero_set.jpg";
      const desc = btn.dataset.reelDesc || "Pełna 14-dniowa telemetryczna analiza formatu wideo w standardzie 35mm.";

      if (modalTitle) modalTitle.textContent = title;
      if (modalImage) modalImage.src = img;
      if (modalDesc) modalDesc.textContent = desc;

      modal.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('active');
  });
}

/* ==========================================================================
   7. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileMenuOverlay') || document.getElementById('headerNav');
  const closeBtn = document.getElementById('mobileNavClose');
  if (!btn || !nav) return;

  function openMenu() {
    nav.classList.add('is-open', 'active');
    btn.classList.add('active', 'is-active');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open', 'menu-locked');
  }

  function closeMenu() {
    nav.classList.remove('is-open', 'active');
    btn.classList.remove('active', 'is-active');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open', 'menu-locked');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.contains('is-open') || nav.classList.contains('active') || btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (nav.classList.contains('is-open') || nav.classList.contains('active'))) {
      closeMenu();
    }
  });

  // Clicking any link inside nav closes the menu
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Ensure resize back to desktop clears any locked states
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && (nav.classList.contains('is-open') || nav.classList.contains('active'))) {
      closeMenu();
    }
  }, { passive: true });
}
