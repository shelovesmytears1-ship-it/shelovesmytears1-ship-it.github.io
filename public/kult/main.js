/**
 * KULT — 9-Chapter Kinetic & Interactive Flagship Logic
 * Flagship #2 // Tonic Drinks Canon & Audiophile Studio
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. NATIVE ZERO-LATENCY HARDWARE SCROLL (No Wheel Hijacking)
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================================================================
     1. FLAVOUR MASTER DATA
     ========================================================================== */
  const FLAVOURS = {
    '01': {
      idStr: 'NO. 01',
      name: 'Yuzu & Gentian',
      color: '#F5D547',
      canSrc: 'assets/01_yuzu_cutout_rgba.webp?v=4',
      alt: 'KULT No. 01 Yuzu & Gentian Tonic Can',
      headline: 'BRIGHT YUZU.<br>BITTER GENTIAN.<br>FINE BUBBLES.<br>NOTHING ELSE.',
      kicker: '04 — NO. 01, UP CLOSE',
      sku: 'kult-no1-yuzu',
      price: 36.00,
      thumb: 'assets/01_yuzu_card.webp',
      ledger: [
        { title: 'Cold Botanical Extraction', desc: 'Extracted at low temperatures to protect delicate aromatic citrus oils and bitter gentian flavonoids.' },
        { title: 'Zero Refined Sugar', desc: 'No sucralose, no aspartame, no stevia aftertaste. Natural fruit oils provide crisp balance.' },
        { title: 'Micro-Bubble Effervescence', desc: 'Fine champagne-grade carbonation that lifts the botanical bouquet without bloat.' }
      ]
    },
    '02': {
      idStr: 'NO. 02',
      name: 'Blood Orange & Hibiscus',
      color: '#EE6030',
      canSrc: 'assets/02_blood_orange_cutout_rgba.webp?v=4',
      alt: 'KULT No. 02 Blood Orange & Hibiscus Can',
      headline: 'CRIMSON CITRUS.<br>WILD HIBISCUS.<br>CRISP TART TONE.<br>PURE FOCUS.',
      kicker: '04 — NO. 02, UP CLOSE',
      sku: 'kult-no2-orange',
      price: 36.00,
      thumb: 'assets/02_blood_orange.webp',
      ledger: [
        { title: 'Sicilian Tarocco Extract', desc: 'Pressed within 6 hours of morning harvest to preserve deep anthocyanin antioxidants.' },
        { title: 'Egyptian Wild Hibiscus', desc: 'Sun-dried sepals steeped slowly in glacial spring water for a ruby crimson hue.' },
        { title: 'Brisk Bitter Resonance', desc: 'Gentian backbone balances natural fruit acidity without cloying sweetness.' }
      ]
    },
    '03': {
      idStr: 'NO. 03',
      name: 'Cucumber & Elderflower',
      color: '#B6C89B',
      canSrc: 'assets/03_cucumber_cutout_rgba.webp?v=4',
      alt: 'KULT No. 03 Cucumber & Elderflower Can',
      headline: 'ALPINE BOTANICALS.<br>CRISP CUCUMBER.<br>FLORAL LIFT.<br>ZERO CRASH.',
      kicker: '04 — NO. 03, UP CLOSE',
      sku: 'kult-no3-cucumber',
      price: 36.00,
      thumb: 'assets/03_cucumber_elderflower.webp',
      ledger: [
        { title: 'Hand-Picked Elderflower', desc: 'Wild Austrian blooms harvested at dawn before direct sun evaporates aromatic oils.' },
        { title: 'Distilled English Cucumber', desc: 'Low-pressure vacuum distillation yields translucent herbal essence without vegetable weight.' },
        { title: 'Gentle Herbal Mineral Finish', desc: 'Clean, lingering mouthfeel ideal for pairing with gin or solo refreshment.' }
      ]
    },
    '04': {
      idStr: 'NO. 04',
      name: 'Grapefruit & Rosemary',
      color: '#F7B9B7',
      canSrc: 'assets/04_grapefruit_cutout_rgba.webp?v=4',
      alt: 'KULT No. 04 Grapefruit & Rosemary Can',
      headline: 'RUBY POMELO.<br>PROVENCE ROSEMARY.<br>DRY BITTER BODY.<br>PRISTINE CLARITY.',
      kicker: '04 — NO. 04, UP CLOSE',
      sku: 'kult-no4-grapefruit',
      price: 36.00,
      thumb: 'assets/04_grapefruit_rosemary.webp',
      ledger: [
        { title: 'Cold-Pressed Ruby Pomelo', desc: 'Zesty peel oils and tart pink juice delivering intense citrus fragrance.' },
        { title: 'Steam-Distilled Rosemary', desc: 'Mediterranean piney herbal notes that anchor the effervescence.' },
        { title: 'Dry Digestion Finish', desc: 'Gentian root works synergistically with natural grapefruit naringin.' }
      ]
    },
    '05': {
      idStr: 'NO. 05',
      name: 'Spiced Ginger & Lime',
      color: '#E3AA5F',
      canSrc: 'assets/05_ginger_cutout_rgba.webp?v=4',
      alt: 'KULT No. 05 Spiced Ginger & Lime Can',
      headline: 'FIERY GINGER ROOT.<br>PERSIAN KEY LIME.<br>WARM TINGLE.<br>CLEAN ENERGY.',
      kicker: '04 — NO. 05, UP CLOSE',
      sku: 'kult-no5-ginger',
      price: 36.00,
      thumb: 'assets/05_ginger_lime.webp',
      ledger: [
        { title: 'Fijian Ginger Root Press', desc: 'Fresh rhizome press providing genuine fiery bite and thermogenic warmth.' },
        { title: 'Cold-Pressed Key Lime', desc: 'Sharp citrus bite that cuts the ginger heat for instant refreshment.' },
        { title: 'Natural Guayusa Boost', desc: '120mg slow-burn natural caffeine without jitters, spikes, or crashes.' }
      ]
    }
  };

  /* ==========================================================================
     2. SCREEN 1: BUBBLE CANVAS & KINETIC PARALLAX
     ========================================================================== */
  const bubbleCanvas = document.getElementById('heroBubblesCanvas');
  let bubbleCtx = bubbleCanvas ? bubbleCanvas.getContext('2d') : null;
  let bubbles = [];
  let bubbleSpeedBoost = 1.0;

  function initBubbleCanvas() {
    if (!bubbleCanvas || !bubbleCtx) return;
    const rect = bubbleCanvas.getBoundingClientRect();
    bubbleCanvas.width = rect.width || window.innerWidth;
    bubbleCanvas.height = rect.height || window.innerHeight;

    bubbles = [];
    const count = Math.min(42, Math.floor(bubbleCanvas.width / 40));
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: Math.random() * bubbleCanvas.width,
        y: Math.random() * bubbleCanvas.height,
        r: 1.5 + Math.random() * 3.5,
        speed: 0.4 + Math.random() * 0.9,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        alpha: 0.15 + Math.random() * 0.35,
        isLight: Math.random() > 0.45
      });
    }
  }

  let heroInView = true;
  let bubbleRafId = null;

  function renderBubbles() {
    if (!bubbleCtx || !bubbleCanvas || !heroInView) {
      bubbleRafId = null;
      return;
    }
    bubbleCtx.clearRect(0, 0, bubbleCanvas.width, bubbleCanvas.height);

    for (let b of bubbles) {
      b.wobble += b.wobbleSpeed;
      b.y -= b.speed * bubbleSpeedBoost;
      b.x += Math.sin(b.wobble) * 0.45;

      if (b.y < -10) {
        b.y = bubbleCanvas.height + 10;
        b.x = Math.random() * bubbleCanvas.width;
      }

      bubbleCtx.beginPath();
      bubbleCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      bubbleCtx.fillStyle = b.isLight 
        ? `rgba(255, 255, 255, ${b.alpha})`
        : `rgba(22, 19, 15, ${b.alpha * 0.35})`;
      bubbleCtx.fill();
    }

    if (bubbleSpeedBoost > 1.0) {
      bubbleSpeedBoost = Math.max(1.0, bubbleSpeedBoost - 0.04);
    }

    bubbleRafId = requestAnimationFrame(renderBubbles);
  }

  initBubbleCanvas();
  renderBubbles();
  window.addEventListener('resize', initBubbleCanvas);

  // Pause Hero canvas when scrolled past Hero for zero GPU overhead
  const heroStage = document.getElementById('hero');
  if (heroStage && 'IntersectionObserver' in window) {
    const heroObs = new IntersectionObserver((entries) => {
      heroInView = entries[0].isIntersecting;
      if (heroInView && !bubbleRafId) {
        bubbleRafId = requestAnimationFrame(renderBubbles);
      }
    }, { threshold: 0.02 });
    heroObs.observe(heroStage);
  }

  // 3D Parallax on Central Can & Typography (rAF-throttled)
  const heroCanWrapper = document.getElementById('heroCanWrapper');
  const heroColossalTitle = document.getElementById('heroColossalTitle');
  let mouseRafPending = false;

  if (heroStage && heroCanWrapper && heroColossalTitle && window.innerWidth > 1024) {
    heroStage.addEventListener('mousemove', (e) => {
      if (mouseRafPending || !heroInView) return;
      mouseRafPending = true;
      const clientX = e.clientX;
      const clientY = e.clientY;
      requestAnimationFrame(() => {
        mouseRafPending = false;
        const rect = heroStage.getBoundingClientRect();
        const normX = (clientX - rect.left) / rect.width - 0.5;
        const normY = (clientY - rect.top) / rect.height - 0.5;
        heroCanWrapper.style.transform = `translate3d(${(normX * 14).toFixed(1)}px, ${(normY * 8).toFixed(1)}px, 0) rotate(${(normX * 2).toFixed(2)}deg)`;
        heroColossalTitle.style.transform = `translate3d(${(-normX * 7).toFixed(1)}px, ${(-normY * 4).toFixed(1)}px, 0)`;
      });
    }, { passive: true });

    heroStage.addEventListener('mouseleave', () => {
      heroCanWrapper.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      heroColossalTitle.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  /* ==========================================================================
     3. HERO FLAVOUR SWITCHER (Expanding Color-Wave)
     ========================================================================== */
  const heroFlavorDots = document.querySelectorAll('.hero-flavor-dots .flavor-dot-btn');
  const heroCanImg = document.getElementById('heroCanImg');
  const heroFlavorId = document.getElementById('heroFlavorId');
  const heroFlavorTitle = document.getElementById('heroFlavorTitle');
  const heroColorWave = document.getElementById('heroColorWave');

  function setHeroFlavor(id, clickEvent) {
    const data = FLAVOURS[id];
    if (!data) return;

    heroFlavorDots.forEach(btn => {
      const isActive = btn.dataset.flavor === id;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (heroFlavorId) heroFlavorId.textContent = data.idStr;
    if (heroFlavorTitle) heroFlavorTitle.textContent = data.name.toUpperCase();

    // Trigger Expanding Circular Color Wave
    if (heroColorWave && clickEvent) {
      const rect = heroStage.getBoundingClientRect();
      const originX = clickEvent.clientX - rect.left;
      const originY = clickEvent.clientY - rect.top;

      heroColorWave.style.backgroundColor = data.color;
      heroColorWave.style.clipPath = `circle(0% at ${originX}px ${originY}px)`;
      heroColorWave.style.transition = 'none';

      requestAnimationFrame(() => {
        heroColorWave.style.transition = 'clip-path 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        heroColorWave.style.clipPath = `circle(150% at ${originX}px ${originY}px)`;

        setTimeout(() => {
          document.documentElement.style.setProperty('--flavor-current-bg', data.color);
        }, 620);
      });
    } else {
      document.documentElement.style.setProperty('--flavor-current-bg', data.color);
    }

    // Spring Bounce Can Image
    if (heroCanImg) {
      heroCanImg.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s';
      heroCanImg.style.opacity = '0';
      heroCanImg.style.transform = 'translateY(14px) scale(0.94) rotate(-3deg)';
      setTimeout(() => {
        heroCanImg.src = data.canSrc;
        heroCanImg.alt = data.alt;
        heroCanImg.style.opacity = '1';
        heroCanImg.style.transform = 'translateY(0) scale(1) rotate(0deg)';
      }, 180);
    }
  }

  heroFlavorDots.forEach(btn => {
    btn.addEventListener('click', (e) => {
      setHeroFlavor(btn.dataset.flavor, e);
    });
  });

  /* ==========================================================================
     4. GSAP SCROLLTRIGGER ANIMATIONS
     ========================================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Stagger slide-up for Screen 3 Manifesto ribbons
    gsap.from('#ribbonsColumn .ribbon-bar', {
      scrollTrigger: {
        trigger: '#manifesto',
        start: 'top 75%'
      },
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Parallax scrub on Screen 3 floating cans
    gsap.to('.float-left-top', {
      yPercent: -16,
      rotate: 22,
      scrollTrigger: {
        trigger: '#manifesto',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.float-right-bot', {
      yPercent: 14,
      rotate: 8,
      scrollTrigger: {
        trigger: '#manifesto',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  /* ==========================================================================
     5. NEW CHAPTER A: 03 — ANATOMY OF A DROP (Hotspot Explorer)
     ========================================================================== */
  const ANATOMY_SPOTS = {
    '01': {
      stepTag: 'PRINCIPLE 01 // EXTRACTION PROTOCOL',
      title: '4.2 GV MICRO-CARBONATION',
      desc: 'Pinpoint champagne effervescence calibrated at 4.2 volumes of dissolved CO₂. Lifts delicate volatile citrus terpenes to the palate before the first sip without digestive bloating.',
      metrics: ['4.2 BAR', '3.8 °C', '< 0.2° BRIX', '0.00 G'],
      bars: [96, 88, 92, 0]
    },
    '02': {
      stepTag: 'PRINCIPLE 02 // COLD-PRESSED CITRUS',
      title: '4°C COLD-PRESSED RIND',
      desc: 'Never boiled or pasteurized from concentrate. Whole yuzu, blood orange, and grapefruit peels are cold-pressed at 4°C to preserve raw essential oils and bright aromatic top notes.',
      metrics: ['120 BAR', '4.0 °C', '1.1° BRIX', '0.00 G'],
      bars: [98, 74, 85, 0]
    },
    '03': {
      stepTag: 'PRINCIPLE 03 // WILD APERITIVO BARK',
      title: '1,800M WILD GENTIAN BITTER',
      desc: 'Harvested in the Auvergne highlands. Wild gentian root provides the unmistakable dry aperitivo backbone that stimulates digestive clarity and replaces alcohol burn.',
      metrics: ['1.0 BAR', '14.0 °C', '0.4° BRIX', '0.00 G'],
      bars: [82, 94, 80, 0]
    },
    '04': {
      stepTag: 'PRINCIPLE 04 // CLEAN FOCUS ARCHITECTURE',
      title: '0.0G SWEETENER ARCHITECTURE',
      desc: 'No cane sugar, no stevia, no erythritol, no monkfruit. Only pressed botanicals, pure mountain spring water, and a pinch of unrefined sea salt for crisp palate reset.',
      metrics: ['1.0 BAR', '3.5 °C', '0.0° BRIX', '0.00 G'],
      bars: [90, 85, 95, 0]
    }
  };

  const hotspotBtns = document.querySelectorAll('.anatomy-hotspot-btn');
  const spotStepTag = document.getElementById('spotStepTag');
  const spotTitle = document.getElementById('spotTitle');
  const spotDesc = document.getElementById('spotDesc');
  const spotMetric1 = document.getElementById('spotMetric1');
  const spotMetric2 = document.getElementById('spotMetric2');
  const spotMetric3 = document.getElementById('spotMetric3');
  const spotMetric4 = document.getElementById('spotMetric4');
  const barFill1 = document.getElementById('barFill1');
  const barVal1 = document.getElementById('barVal1');
  const barFill2 = document.getElementById('barFill2');
  const barVal2 = document.getElementById('barVal2');
  const barFill3 = document.getElementById('barFill3');
  const barVal3 = document.getElementById('barVal3');
  const barFill4 = document.getElementById('barFill4');
  const barVal4 = document.getElementById('barVal4');

  function setAnatomySpot(num) {
    const data = ANATOMY_SPOTS[num];
    if (!data) return;

    hotspotBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.spot === num);
    });

    // Update lines
    for (let i = 1; i <= 4; i++) {
      const line = document.getElementById(`leadLine${i}`);
      if (line) line.classList.toggle('active-line', String(i).padStart(2, '0') === num);
    }

    if (spotStepTag) spotStepTag.textContent = data.stepTag;
    if (spotTitle) spotTitle.textContent = data.title;
    if (spotDesc) spotDesc.textContent = data.desc;
    if (spotMetric1) spotMetric1.textContent = data.metrics[0];
    if (spotMetric2) spotMetric2.textContent = data.metrics[1];
    if (spotMetric3) spotMetric3.textContent = data.metrics[2];
    if (spotMetric4) spotMetric4.textContent = data.metrics[3];

    if (barFill1) barFill1.style.width = `${data.bars[0]}%`;
    if (barVal1) barVal1.textContent = `${data.bars[0]}%`;
    if (barFill2) barFill2.style.width = `${data.bars[1]}%`;
    if (barVal2) barVal2.textContent = `${data.bars[1]}%`;
    if (barFill3) barFill3.style.width = `${data.bars[2]}%`;
    if (barVal3) barVal3.textContent = `${data.bars[2]}%`;
    if (barFill4) barFill4.style.width = `${data.bars[3]}%`;
    if (barVal4) barVal4.textContent = `${data.bars[3]}%`;
  }

  hotspotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setAnatomySpot(btn.dataset.spot);
    });
  });

  /* ==========================================================================
     6. SCREEN 4: EDITORIAL FLAVOUR TAB SWITCHER
     ========================================================================== */
  const editorialTabs = document.querySelectorAll('.flavour-tab-pills .pill-tab-btn');
  const closeKicker = document.getElementById('closeKicker');
  const closeHeadline = document.getElementById('closeHeadline');
  const ledgerTitle1 = document.getElementById('ledgerTitle1');
  const ledgerDesc1 = document.getElementById('ledgerDesc1');
  const ledgerTitle2 = document.getElementById('ledgerTitle2');
  const ledgerDesc2 = document.getElementById('ledgerDesc2');
  const ledgerTitle3 = document.getElementById('ledgerTitle3');
  const ledgerDesc3 = document.getElementById('ledgerDesc3');
  const editorialAddBtn = document.getElementById('editorialAddBtn');

  function setEditorialFlavor(id) {
    const data = FLAVOURS[id];
    if (!data) return;

    editorialTabs.forEach(tab => {
      const isActive = tab.dataset.flavor === id;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (closeKicker) closeKicker.textContent = data.kicker;
    if (closeHeadline) closeHeadline.innerHTML = data.headline;
    
    if (ledgerTitle1 && data.ledger[0]) ledgerTitle1.textContent = data.ledger[0].title;
    if (ledgerDesc1 && data.ledger[0]) ledgerDesc1.textContent = data.ledger[0].desc;
    if (ledgerTitle2 && data.ledger[1]) ledgerTitle2.textContent = data.ledger[1].title;
    if (ledgerDesc2 && data.ledger[1]) ledgerDesc2.textContent = data.ledger[1].desc;
    if (ledgerTitle3 && data.ledger[2]) ledgerTitle3.textContent = data.ledger[2].title;
    if (ledgerDesc3 && data.ledger[2]) ledgerDesc3.textContent = data.ledger[2].desc;

    if (editorialAddBtn) {
      editorialAddBtn.dataset.sku = data.sku;
      editorialAddBtn.dataset.name = `No. ${id} ${data.name} (12-Pack)`;
      editorialAddBtn.dataset.price = data.price.toFixed(2);
      editorialAddBtn.dataset.thumb = data.thumb;
      const span = editorialAddBtn.querySelector('span');
      if (span) span.textContent = `Shop No. ${id} — $${data.price.toFixed(0)} · 12 × 355 ML`;
    }
  }

  editorialTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setEditorialFlavor(tab.dataset.flavor);
    });
  });

  /* ==========================================================================
     7. NEW CHAPTER B: 04 — THE SERVING RITUAL (Mixology Switcher)
     ========================================================================== */
  const MIXOLOGY_DATA = {
    '1730': {
      img: 'assets/06_ritual_glass_pour.webp',
      glassware: 'GLASSWARE: Tall Fluted Highball · Kold-Draft Spear Ice',
      num: 'SERVE NO. 01 // GOLDEN HOUR',
      title: 'THE UNCUT HIGHBALL.',
      narrative: 'A pristine, crystal-clear aperitivo serve poured straight over hand-carved ice spears. Volatile yuzu oils are released across the surface, grounded by wild Japanese gentian root bitterness.',
      prop1: { w: '85%', col: '#F5D547', label: '85% KULT No. 01 Yuzu' },
      prop2: { w: '12%', col: '#EE6030', label: '12% Expressed Peel Oils' },
      prop3: { w: '3%', col: '#FFFFFF', label: '3% Sea Salt Mist' },
      sound: "Ryuichi Sakamoto — 'Merry Christmas Mr. Lawrence' (Ambient Dub) · 92 BPM"
    },
    '2200': {
      img: 'assets/08_blood_orange_bar_ritual.webp',
      glassware: 'GLASSWARE: Heavy-Base Highball · Hand-Carved Ice Spear',
      num: 'SERVE NO. 02 // LATE NIGHT',
      title: 'THE SMOKED HIBISCUS BITTER.',
      narrative: 'A moody listening-bar serve crafted with ruby-red blood orange and steeped Egyptian hibiscus. Finished with torched rosemary pine smoke for late-night sensory focus.',
      prop1: { w: '80%', col: '#EE6030', label: '80% KULT No. 02 Orange' },
      prop2: { w: '15%', col: '#991B1B', label: '15% Cold-Brewed Hibiscus' },
      prop3: { w: '5%', col: '#A8A29E', label: '5% Torched Rosemary' },
      sound: "Bill Evans — 'Peace Piece' (Tokyo Jazz Kissa Pressing) · 78 BPM"
    },
    '1400': {
      img: 'assets/09_cucumber_atelier_ritual.webp',
      glassware: 'GLASSWARE: Low Faceted Rocks Glass · Single Clear Block',
      num: 'SERVE NO. 03 // STUDIO AFTERNOON',
      title: 'THE MINERAL STUDIO COOLER.',
      narrative: 'A daylight studio refresher poured over dense clear block ice with translucent cucumber ribbons. Micro-bubbles elevate Austrian elderflower without midday sugar crashes.',
      prop1: { w: '90%', col: '#B6C89B', label: '90% KULT No. 03 Cucumber' },
      prop2: { w: '8%', col: '#4ADE80', label: '8% Cucumber Ribbon' },
      prop3: { w: '2%', col: '#F5F5F4', label: '2% White Peppercorn' },
      sound: "Brian Eno — 'Music for Airports / 1/1' (Modular Synth) · 64 BPM"
    }
  };

  const timeTabs = document.querySelectorAll('.time-tab-btn');
  const mixologyServeImg = document.getElementById('mixologyServeImg');
  const glasswarePill = document.getElementById('glasswarePill');
  const serveNumId = document.getElementById('serveNumId');
  const serveTitle = document.getElementById('serveTitle');
  const serveNarrative = document.getElementById('serveNarrative');
  const propSeg1 = document.getElementById('propSeg1');
  const propSeg2 = document.getElementById('propSeg2');
  const propSeg3 = document.getElementById('propSeg3');
  const legText1 = document.getElementById('legText1');
  const legText2 = document.getElementById('legText2');
  const legText3 = document.getElementById('legText3');
  const soundTitle = document.getElementById('soundTitle');

  function setMixologyServe(timeKey) {
    const data = MIXOLOGY_DATA[timeKey];
    if (!data) return;

    timeTabs.forEach(tab => {
      const isActive = tab.dataset.time === timeKey;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (mixologyServeImg) {
      mixologyServeImg.style.opacity = '0';
      setTimeout(() => {
        mixologyServeImg.src = data.img;
        mixologyServeImg.style.opacity = '1';
      }, 160);
    }

    if (glasswarePill) glasswarePill.querySelector('span').textContent = data.glassware;
    if (serveNumId) serveNumId.textContent = data.num;
    if (serveTitle) serveTitle.textContent = data.title;
    if (serveNarrative) serveNarrative.textContent = data.narrative;

    if (propSeg1) {
      propSeg1.style.width = data.prop1.w;
      propSeg1.style.backgroundColor = data.prop1.col;
    }
    if (propSeg2) {
      propSeg2.style.width = data.prop2.w;
      propSeg2.style.backgroundColor = data.prop2.col;
    }
    if (propSeg3) {
      propSeg3.style.width = data.prop3.w;
      propSeg3.style.backgroundColor = data.prop3.col;
    }

    if (legText1) legText1.textContent = data.prop1.label;
    if (legText2) legText2.textContent = data.prop2.label;
    if (legText3) legText3.textContent = data.prop3.label;
    if (soundTitle) soundTitle.textContent = data.sound;
  }

  timeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setMixologyServe(tab.dataset.time);
    });
  });

  /* ==========================================================================
     8. UPGRADED SCREEN 5: 12-SLOT VISUAL CRATE BUILDER
     ========================================================================== */
  const crateSlotsGrid = document.getElementById('crateSlotsGrid');
  const slotCountNum = document.getElementById('slotCountNum');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const addPackBtn = document.getElementById('addPackBtn');
  const configPriceVal = document.getElementById('configPriceVal');
  const radioInputs = document.querySelectorAll('input[name="orderType"]');

  let crateComposition = {
    '01': 3,
    '02': 3,
    '03': 2,
    '04': 2,
    '05': 2
  };
  let isCrateSub = false;

  const PRESETS = {
    'balanced': { '01': 3, '02': 3, '03': 2, '04': 2, '05': 2 },
    'citrus': { '01': 4, '02': 4, '03': 0, '04': 4, '05': 0 },
    'bitter': { '01': 3, '02': 0, '03': 3, '04': 3, '05': 3 }
  };

  const FLAVOR_COLORS = {
    '01': '#F5D547',
    '02': '#EE6030',
    '03': '#B6C89B',
    '04': '#F7B9B7',
    '05': '#E3AA5F'
  };

  function getTotalCans() {
    return Object.values(crateComposition).reduce((sum, v) => sum + v, 0);
  }

  function renderCrateSlots() {
    if (!crateSlotsGrid) return;
    crateSlotsGrid.innerHTML = '';

    const slotItems = [];
    for (let [flvId, qty] of Object.entries(crateComposition)) {
      for (let i = 0; i < qty; i++) {
        slotItems.push(flvId);
      }
    }

    for (let idx = 0; idx < 12; idx++) {
      const flvId = slotItems[idx] || null;
      const capsule = document.createElement('div');
      capsule.className = `crate-slot-capsule ${flvId ? 'filled' : 'empty'}`;

      if (flvId) {
        capsule.style.backgroundColor = FLAVOR_COLORS[flvId];
        capsule.innerHTML = `<span>#${idx + 1}</span><strong>${flvId}</strong>`;
      } else {
        capsule.innerHTML = `<span>#${idx + 1}</span><strong>—</strong>`;
      }
      crateSlotsGrid.appendChild(capsule);
    }

    // Update Stepper Values
    for (let id of ['01', '02', '03', '04', '05']) {
      const el = document.getElementById(`qtyVal${id}`);
      if (el) el.textContent = crateComposition[id];
    }

    const total = getTotalCans();
    if (slotCountNum) slotCountNum.textContent = total;

    // Price Update
    const basePrice = 36.00;
    const finalPrice = isCrateSub ? basePrice * 0.85 : basePrice;
    if (configPriceVal) configPriceVal.textContent = `$${finalPrice.toFixed(2)}`;
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.preset;
      if (PRESETS[presetKey]) {
        crateComposition = { ...PRESETS[presetKey] };
        renderCrateSlots();
      }
    });
  });

  // Increment / Decrement handlers
  document.querySelectorAll('.slot-inc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.flavor;
      const total = getTotalCans();
      if (total < 12) {
        crateComposition[id] += 1;
        renderCrateSlots();
      }
    });
  });

  document.querySelectorAll('.slot-dec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.flavor;
      if (crateComposition[id] > 0) {
        crateComposition[id] -= 1;
        renderCrateSlots();
      }
    });
  });

  radioInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      isCrateSub = e.target.value === 'sub';
      document.querySelectorAll('.radio-label').forEach(label => {
        label.classList.toggle('active', label.querySelector('input').checked);
      });
      renderCrateSlots();
    });
  });

  if (addPackBtn) {
    addPackBtn.addEventListener('click', () => {
      const finalPrice = isCrateSub ? 36.00 * 0.85 : 36.00;
      const parts = [];
      if (crateComposition['01']) parts.push(`${crateComposition['01']}× Yuzu`);
      if (crateComposition['02']) parts.push(`${crateComposition['02']}× Orange`);
      if (crateComposition['03']) parts.push(`${crateComposition['03']}× Cucumber`);
      if (crateComposition['04']) parts.push(`${crateComposition['04']}× Grapefruit`);
      if (crateComposition['05']) parts.push(`${crateComposition['05']}× Ginger`);

      const name = `Curated 12-Can Crate (${parts.join(', ')}) ${isCrateSub ? '(Subscribe -15%)' : ''}`;
      addToCart({
        sku: `crate-12-${isCrateSub ? 'sub' : 'one'}`,
        name: name,
        price: finalPrice,
        thumb: 'assets/07_all_five_pack.webp'
      });
    });
  }

  renderCrateSlots();

  /* ==========================================================================
     9. NEW CHAPTER C: 06 — IN THE WILD (Architectural Stockists)
     ========================================================================== */
  const VENUES = {
    'warsaw': {
      title: 'BAR STUDIO · PALACE OF CULTURE',
      coords: '52.2318° N, 21.0060° E',
      city: 'WARSAW, PL',
      img: 'assets/08_blood_orange_bar_ritual.webp',
      sound: 'Klipschorn 3-Way Horn Speakers · Custom 300B Tube Amplification · Garrard 301 Turntable',
      status: 'ON ICE TODAY: NO. 01 YUZU & GENTIAN ON DRAFT'
    },
    'berlin': {
      title: 'ORA APOTHEKE · KREUZBERG',
      coords: '52.5008° N, 13.4243° E',
      city: 'BERLIN, DE',
      img: 'assets/06_ritual_glass_pour.webp',
      sound: 'Altec Lansing Voice of the Theatre · McIntosh MC275 Tube Amp · Thorens TD124',
      status: 'ON ICE TODAY: FULL 5-CAN COLLECTION'
    },
    'tokyo': {
      title: 'BAR MARTHA · EBISU',
      coords: '35.6467° N, 139.7101° E',
      city: 'TOKYO, JP',
      img: 'assets/09_cucumber_atelier_ritual.webp',
      sound: 'JBL 4344 Studio Monitors · Luxman MQ-88uC · Technics SP-10R Direct Drive',
      status: 'ON ICE TODAY: NO. 01 YUZU HIGHBALL'
    },
    'copenhagen': {
      title: 'ATELIER SEPTEMBER · INDRE BY',
      coords: '55.6819° N, 12.5861° E',
      city: 'COPENHAGEN, DK',
      img: 'assets/09_cucumber_atelier_ritual.webp',
      sound: 'B&O Beovox 5000 Flat Panels · Marantz Model 7 · Rega Planar 8',
      status: 'ON ICE TODAY: NO. 03 CUCUMBER COOLER'
    },
    'london': {
      title: 'BRILLIANT CORNERS · KINGSLAND RD',
      coords: '51.5442° N, 0.0755° W',
      city: 'LONDON, UK',
      img: 'assets/08_blood_orange_bar_ritual.webp',
      sound: 'Klipsch La Scala Loudspeakers · Isonoe Custom Isolators · Bozak CMA-10-2DL Mixer',
      status: 'ON ICE TODAY: NO. 04 & NO. 05 SPICED BITTER'
    }
  };

  const venueRows = document.querySelectorAll('.venue-row-item');
  const venueInspectImg = document.getElementById('venueInspectImg');
  const venueStatusPill = document.getElementById('venueStatusPill');
  const venueCoords = document.getElementById('venueCoords');
  const venueCityLabel = document.getElementById('venueCityLabel');
  const venueTitle = document.getElementById('venueTitle');
  const venueSoundSpec = document.getElementById('venueSoundSpec');

  function setVenue(key) {
    const data = VENUES[key];
    if (!data) return;

    venueRows.forEach(row => {
      row.classList.toggle('active', row.dataset.venue === key);
    });

    if (venueInspectImg) {
      venueInspectImg.style.opacity = '0';
      setTimeout(() => {
        venueInspectImg.src = data.img;
        venueInspectImg.style.opacity = '1';
      }, 150);
    }

    if (venueStatusPill) venueStatusPill.innerHTML = `<span class="dot-live"></span> ${data.status}`;
    if (venueCoords) venueCoords.textContent = data.coords;
    if (venueCityLabel) venueCityLabel.textContent = data.city;
    if (venueTitle) venueTitle.textContent = data.title;
    if (venueSoundSpec) venueSoundSpec.textContent = data.sound;
  }

  venueRows.forEach(row => {
    row.addEventListener('click', () => {
      setVenue(row.dataset.venue);
    });
    row.addEventListener('mouseenter', () => {
      setVenue(row.dataset.venue);
    });
  });

  /* ==========================================================================
     10. CART DRAWER & STATE MANAGEMENT
     ========================================================================== */
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const emptyShopBtn = document.getElementById('emptyShopBtn');
  const headerCartCount = document.getElementById('headerCartCount');
  const drawerItemCount = document.getElementById('drawerItemCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartSubtotalVal = document.getElementById('cartSubtotalVal');
  const cartShippingVal = document.getElementById('cartShippingVal');
  const shippingText = document.getElementById('shippingText');
  const shippingProgressFill = document.getElementById('shippingProgressFill');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutSuccessOverlay = document.getElementById('checkoutSuccessOverlay');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const orderNumber = document.getElementById('orderNumber');

  let cart = [];

  function openCart() {
    if (cartDrawer) {
      cartDrawer.classList.add('open');
      cartDrawer.setAttribute('aria-hidden', 'false');
    }
    if (cartBackdrop) {
      cartBackdrop.classList.add('open');
      cartBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove('open');
      cartDrawer.setAttribute('aria-hidden', 'true');
    }
    if (cartBackdrop) {
      cartBackdrop.classList.remove('open');
      cartBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  if (emptyShopBtn) {
    emptyShopBtn.addEventListener('click', () => {
      closeCart();
    });
  }

  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (headerCartCount) headerCartCount.textContent = totalCount;
    if (drawerItemCount) drawerItemCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;
    if (cartSubtotalVal) cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;

    // Free Shipping Motivator ($50 threshold)
    const FREE_SHIPPING_THRESHOLD = 50.00;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      if (shippingText) shippingText.textContent = "🎉 You've unlocked FREE cold-chain courier delivery!";
      if (shippingProgressFill) shippingProgressFill.style.width = '100%';
      if (cartShippingVal) cartShippingVal.textContent = 'FREE';
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      if (shippingText) shippingText.textContent = `Add $${remaining.toFixed(2)} more for FREE shipping!`;
      const pct = Math.min(100, Math.max(8, (subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      if (shippingProgressFill) shippingProgressFill.style.width = `${pct}%`;
      if (cartShippingVal) cartShippingVal.textContent = subtotal > 0 ? '$7.50' : 'Calculated at checkout';
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = cart.length === 0;
    }

    // Render Items
    if (cart.length === 0) {
      if (cartEmptyState) cartEmptyState.style.display = 'block';
      const existingItems = cartItemsList.querySelectorAll('.cart-item-row');
      existingItems.forEach(el => el.remove());
    } else {
      if (cartEmptyState) cartEmptyState.style.display = 'none';
      const existingItems = cartItemsList.querySelectorAll('.cart-item-row');
      existingItems.forEach(el => el.remove());

      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
          <img src="${item.thumb}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
            <div class="cart-item-controls">
              <button class="stepper-btn decrease-btn" data-sku="${item.sku}" aria-label="Decrease quantity">−</button>
              <span class="stepper-count">${item.qty}</span>
              <button class="stepper-btn increase-btn" data-sku="${item.sku}" aria-label="Increase quantity">+</button>
              <button class="remove-item-btn" data-sku="${item.sku}">Remove</button>
            </div>
          </div>
        `;
        cartItemsList.appendChild(row);
      });

      // Stepper events
      cartItemsList.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const sku = btn.dataset.sku;
          const found = cart.find(i => i.sku === sku);
          if (found) {
            found.qty += 1;
            renderCart();
          }
        });
      });

      cartItemsList.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const sku = btn.dataset.sku;
          const found = cart.find(i => i.sku === sku);
          if (found) {
            found.qty -= 1;
            if (found.qty <= 0) {
              cart = cart.filter(i => i.sku !== sku);
            }
            renderCart();
          }
        });
      });

      cartItemsList.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const sku = btn.dataset.sku;
          cart = cart.filter(i => i.sku !== sku);
          renderCart();
        });
      });
    }
  }

  function addToCart({ sku, name, price, thumb }) {
    const existing = cart.find(i => i.sku === sku);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        sku,
        name,
        price: parseFloat(price),
        qty: 1,
        thumb: thumb || 'assets/01_yuzu_card.webp'
      });
    }
    renderCart();
    openCart();
  }

  // Hook all "+ ADD" and "SHOP ↗" buttons across the page
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart({
        sku: btn.dataset.sku,
        name: btn.dataset.name,
        price: btn.dataset.price,
        thumb: btn.dataset.thumb
      });
    });
  });

  // Simulated Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      const randomOrder = 'KULT-' + Math.floor(1000 + Math.random() * 9000);
      if (orderNumber) orderNumber.textContent = `#${randomOrder}`;
      if (checkoutSuccessOverlay) checkoutSuccessOverlay.style.display = 'flex';
      cart = [];
      renderCart();
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      if (checkoutSuccessOverlay) checkoutSuccessOverlay.style.display = 'none';
      closeCart();
    });
  }

  /* ==========================================================================
     11. FAQ ACCORDION INTERACTIVITY
     ========================================================================== */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.accordion-header');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          const otherIcon = otherItem.querySelector('.accordion-icon');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      item.classList.toggle('active', !isOpen);
      header.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      const icon = item.querySelector('.accordion-icon');
      if (icon) icon.textContent = !isOpen ? '−' : '+';
    });
  });

  /* ==========================================================================
     12. INITIALIZATION
     ========================================================================== */
  renderCart();
  setAnatomySpot('01');
  setMixologyServe('1730');
  setVenue('warsaw');

});
