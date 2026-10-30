/**
 * PREZFULL Atelier — Complete Interactive Engine & Motion Choreography
 * Gate G3 to G5: Full Prototype
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Category Showcase Data (Screen 2)
  // --------------------------------------------------------------------------
  const CATEGORY_DATA = {
    'commercial': {
      title: 'Commercial',
      desc: 'Double-height timber and travertine atrium engineered for acoustics, natural daylight, and calm spatial flow.',
      btnText: 'View More'
    },
    'apartment-complex': {
      title: 'Pavilion Horyzont',
      desc: 'Cantilevered precast concrete and warm oak louvers forming a monolithic urban landmark.',
      btnText: 'View More'
    },
    'apartments': {
      title: 'Courtyard Residences',
      desc: 'Twilight reflection courtyard balancing warm 2700K interior glow with raw architectural concrete.',
      btnText: 'View More'
    },
    'offices': {
      title: 'Tactile Joinery',
      desc: 'Millimeter-precise junctions where board-formed concrete meets quarter-sawn oak and bronze.',
      btnText: 'View More'
    },
    'houses': {
      title: 'Structural Blueprint',
      desc: 'Complete BIM axonometric coordination, elevations, and floorplate engineering.',
      btnText: 'View More'
    }
  };

  // --------------------------------------------------------------------------
  // Tectonic Layer Blueprint Specs (Screen 4)
  // --------------------------------------------------------------------------
  const LAYER_SPECS = {
    'roof': {
      name: 'LAYER 01 SPECIFICATION',
      text: 'Post-tensioned 320mm reinforced concrete slab with 4.2m monolithic cantilever overhang. U-value: 0.12 W/(m²K) with integrated concealed stormwater siphon drainage.'
    },
    'envelope': {
      name: 'LAYER 02 SPECIFICATION',
      text: 'Triple-glazed argon-filled curtain wall enveloped by motorized vertical European oak louvers that adjust dynamically with solar azimuth.'
    },
    'core': {
      name: 'LAYER 03 SPECIFICATION',
      text: 'Grade-bearing raft foundation with 14 geothermal closed-loop ground probes sunk 120m into bedrock for passive cooling and seasonal heat storage.'
    }
  };

  // --------------------------------------------------------------------------
  // Typology Rates & Constants (Screen 4 Estimator)
  // --------------------------------------------------------------------------
  const TYPOLOGY_RATES = {
    'private-residence': {
      name: 'Private Residence',
      basePerM2: 2800,
      baseMonths: 14,
      baseSheets: 60
    },
    'commercial-atelier': {
      name: 'Commercial Atelier',
      basePerM2: 2400,
      baseMonths: 12,
      baseSheets: 75
    },
    'adaptive-heritage': {
      name: 'Adaptive Heritage',
      basePerM2: 3100,
      baseMonths: 18,
      baseSheets: 90
    }
  };

  // State
  let currentTypology = 'private-residence';
  let currentArea = 460;
  let currentBudgetFormatted = '€1,220,000 – €1,410,000';

  // --------------------------------------------------------------------------
  // 1. Lead Motion Spike: Digital Dissolve Sky Grid (Screen 1)
  // --------------------------------------------------------------------------
  function initPixelDissolveSpike() {
    const grid = document.getElementById('pixelDissolveGrid');
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      grid.style.display = 'none';
      return;
    }

    const totalBlocks = 12 * 4;
    const blocks = [];

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < totalBlocks; i++) {
      const block = document.createElement('div');
      block.className = 'pixel-block';
      fragment.appendChild(block);
      blocks.push(block);
    }
    grid.appendChild(fragment);

    requestAnimationFrame(() => {
      blocks.forEach((block) => {
        const randomDelay = Math.floor(Math.random() * 420) + 40;
        setTimeout(() => {
          block.classList.add('dissolved');
        }, randomDelay);
      });

      setTimeout(() => {
        grid.style.display = 'none';
      }, 850);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Interactive 5-Category Showcase Controller (Screen 2)
  // --------------------------------------------------------------------------
  function initShowcaseTabs() {
    const tabs = document.querySelectorAll('.pill-tab');
    const panes = document.querySelectorAll('.showcase-pane');
    const featureCard = document.getElementById('floatingFeatureCard');
    const cardTitle = document.getElementById('featureCardTitle');
    const cardDesc = document.getElementById('featureCardDesc');

    if (!tabs.length || !panes.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        if (!category || !CATEGORY_DATA[category]) return;

        tabs.forEach((t) => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panes.forEach((pane) => {
          const isTarget = pane.getAttribute('data-category') === category;
          pane.classList.toggle('active', isTarget);
        });

        if (featureCard && cardTitle && cardDesc) {
          featureCard.classList.add('updating');
          setTimeout(() => {
            cardTitle.textContent = CATEGORY_DATA[category].title;
            cardDesc.textContent = CATEGORY_DATA[category].desc;
            featureCard.classList.remove('updating');
          }, 140);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Monograph Preset Buttons (Screen 3 -> Screen 4 Sync)
  // --------------------------------------------------------------------------
  function initMonographButtons() {
    const buttons = document.querySelectorAll('.monograph-action-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        const area = parseInt(btn.getAttribute('data-area'), 10);

        if (preset && TYPOLOGY_RATES[preset]) {
          currentTypology = preset;
          document.querySelectorAll('.typology-pill').forEach((pill) => {
            const isMatch = pill.getAttribute('data-typology') === preset;
            pill.classList.toggle('active', isMatch);
            pill.setAttribute('aria-checked', isMatch ? 'true' : 'false');
          });
        }

        if (area && !isNaN(area)) {
          currentArea = area;
          const slider = document.getElementById('areaSlider');
          if (slider) slider.value = area;
          const readout = document.getElementById('areaReadout');
          if (readout) readout.textContent = area;
          updatePresetChipHighlight(area);
        }

        calculateEstimator();

        const estimatorSection = document.getElementById('estimator');
        if (estimatorSection) {
          estimatorSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Tectonic Layer Switcher (Screen 4 Blueprint)
  // --------------------------------------------------------------------------
  function initTectonicTabs() {
    const layerTabs = document.querySelectorAll('.layer-tab');
    const specHead = document.querySelector('.spec-head');
    const specText = document.getElementById('blueprintSpecText');

    layerTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const layerKey = tab.getAttribute('data-layer');
        if (!layerKey || !LAYER_SPECS[layerKey]) return;

        layerTabs.forEach((t) => {
          const isAct = t === tab;
          t.classList.toggle('active', isAct);
          t.setAttribute('aria-selected', isAct ? 'true' : 'false');
        });

        if (specHead) specHead.textContent = LAYER_SPECS[layerKey].name;
        if (specText) specText.textContent = LAYER_SPECS[layerKey].text;
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Interactive Scope Estimator Calculations (Screen 4)
  // --------------------------------------------------------------------------
  function updatePresetChipHighlight(area) {
    document.querySelectorAll('.chip-btn').forEach((chip) => {
      const chipArea = parseInt(chip.getAttribute('data-preset-area'), 10);
      chip.classList.toggle('active', chipArea === area);
    });
  }

  function calculateEstimator() {
    const rateData = TYPOLOGY_RATES[currentTypology] || TYPOLOGY_RATES['private-residence'];
    
    // Check stage checkboxes
    const stage4Checked = document.getElementById('stage4') ? document.getElementById('stage4').checked : true;
    const stage5Checked = document.getElementById('stage5') ? document.getElementById('stage5').checked : true;

    let stageMultiplier = 1.0;
    if (stage4Checked) stageMultiplier += 0.18;
    if (stage5Checked) stageMultiplier += 0.14;

    const baseCost = currentArea * rateData.basePerM2 * stageMultiplier;
    const lowCost = Math.round((baseCost * 0.95) / 10000) * 10000;
    const highCost = Math.round((baseCost * 1.10) / 10000) * 10000;

    const formatCurrency = (num) => '€' + num.toLocaleString('en-US');
    currentBudgetFormatted = `${formatCurrency(lowCost)} – ${formatCurrency(highCost)}`;

    // Calculate months timeline
    const areaScale = currentArea / 460;
    const lowMonths = Math.max(10, Math.round(rateData.baseMonths * Math.sqrt(areaScale)));
    const highMonths = lowMonths + 3;
    const timelineFormatted = `${lowMonths} – ${highMonths} Months`;

    // Calculate execution sheets
    const sheetsCount = Math.round(rateData.baseSheets * Math.pow(areaScale, 0.7));
    const sheetsFormatted = `${sheetsCount} Execution Sheets · BIM LOD 400`;

    // Update DOM readouts
    const budgetEl = document.getElementById('budgetOutput');
    const timelineEl = document.getElementById('timelineOutput');
    const sheetsEl = document.getElementById('sheetsOutput');

    if (budgetEl) budgetEl.textContent = currentBudgetFormatted;
    if (timelineEl) timelineEl.textContent = timelineFormatted;
    if (sheetsEl) sheetsEl.textContent = sheetsFormatted;

    // Update Brief form budget preview if exists
    const briefBudgetInput = document.getElementById('briefBudget');
    if (briefBudgetInput) {
      briefBudgetInput.value = currentBudgetFormatted;
    }

    // Update synced scope banner text
    const syncedScopeText = document.getElementById('syncedScopeText');
    if (syncedScopeText) {
      const stagesStr = `Stages 01–${stage5Checked ? '05' : stage4Checked ? '04' : '03'}`;
      syncedScopeText.textContent = `${rateData.name} · ${currentArea} m² · ${stagesStr}`;
    }
  }

  function initEstimator() {
    // 1. Typology Pills
    const pills = document.querySelectorAll('.typology-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const typology = pill.getAttribute('data-typology');
        if (!typology || !TYPOLOGY_RATES[typology]) return;

        currentTypology = typology;
        pills.forEach((p) => {
          const isAct = p === pill;
          p.classList.toggle('active', isAct);
          p.setAttribute('aria-checked', isAct ? 'true' : 'false');
        });

        // Also sync brief typology select
        const briefSelect = document.getElementById('briefTypology');
        if (briefSelect) {
          briefSelect.value = typology;
        }

        calculateEstimator();
      });
    });

    // 2. Area Slider
    const slider = document.getElementById('areaSlider');
    const readout = document.getElementById('areaReadout');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        currentArea = val;
        if (readout) readout.textContent = val;
        updatePresetChipHighlight(val);
        calculateEstimator();

        // Also sync brief area input
        const briefAreaInput = document.getElementById('briefArea');
        if (briefAreaInput) briefAreaInput.value = val;
      });
    }

    // 3. Preset Chips
    const chips = document.querySelectorAll('.chip-btn');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const areaVal = parseInt(chip.getAttribute('data-preset-area'), 10);
        if (isNaN(areaVal)) return;

        currentArea = areaVal;
        if (slider) slider.value = areaVal;
        if (readout) readout.textContent = areaVal;
        updatePresetChipHighlight(areaVal);
        calculateEstimator();

        const briefAreaInput = document.getElementById('briefArea');
        if (briefAreaInput) briefAreaInput.value = areaVal;
      });
    });

    // 4. Scope Checkboxes
    const cbStage4 = document.getElementById('stage4');
    const cbStage5 = document.getElementById('stage5');
    if (cbStage4) cbStage4.addEventListener('change', calculateEstimator);
    if (cbStage5) cbStage5.addEventListener('change', calculateEstimator);

    // 5. Apply to Brief Button
    const applyBtn = document.getElementById('applyToBriefBtn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        // Sync values to Screen 6 Form
        const briefTypology = document.getElementById('briefTypology');
        const briefArea = document.getElementById('briefArea');
        const briefBudget = document.getElementById('briefBudget');

        if (briefTypology) briefTypology.value = currentTypology;
        if (briefArea) briefArea.value = currentArea;
        if (briefBudget) briefBudget.value = currentBudgetFormatted;

        calculateEstimator();

        // Smooth scroll to Contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Initial calculation
    calculateEstimator();
  }

  // --------------------------------------------------------------------------
  // 6. Commission Brief Form (Screen 6)
  // --------------------------------------------------------------------------
  function initBriefForm() {
    const form = document.getElementById('commissionForm');
    const successBox = document.getElementById('briefSuccessState');
    const summaryBox = document.getElementById('receiptSummaryBox');
    const resetBtn = document.getElementById('receiptResetBtn');
    const briefArea = document.getElementById('briefArea');
    const briefTypology = document.getElementById('briefTypology');

    // Sync input changes from form back to estimator
    if (briefArea) {
      briefArea.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 100 && val <= 5000) {
          currentArea = val;
          const slider = document.getElementById('areaSlider');
          if (slider && val >= 160 && val <= 1400) slider.value = val;
          const readout = document.getElementById('areaReadout');
          if (readout) readout.textContent = val;
          calculateEstimator();
        }
      });
    }

    if (briefTypology) {
      briefTypology.addEventListener('change', (e) => {
        currentTypology = e.target.value;
        document.querySelectorAll('.typology-pill').forEach((p) => {
          const isAct = p.getAttribute('data-typology') === currentTypology;
          p.classList.toggle('active', isAct);
          p.setAttribute('aria-checked', isAct ? 'true' : 'false');
        });
        calculateEstimator();
      });
    }

    if (!form || !successBox) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = (document.getElementById('briefName')?.value || '').trim();
      const email = (document.getElementById('briefEmail')?.value || '').trim();
      const location = (document.getElementById('briefLocation')?.value || '').trim();
      const typologyVal = document.getElementById('briefTypology')?.value || currentTypology;
      const areaVal = document.getElementById('briefArea')?.value || currentArea;
      const budgetVal = document.getElementById('briefBudget')?.value || currentBudgetFormatted;
      const notes = (document.getElementById('briefNotes')?.value || '').trim();

      if (!name || !email || !location) {
        alert('Please fill in all required fields marked with *');
        return;
      }

      const typologyLabel = TYPOLOGY_RATES[typologyVal]?.name || typologyVal;
      const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      if (summaryBox) {
        summaryBox.innerHTML = `
          <div><strong>Applicant:</strong> ${name} &lt;${email}&gt;</div>
          <div><strong>Location:</strong> ${location}</div>
          <div><strong>Program:</strong> ${typologyLabel} · ${areaVal} m²</div>
          <div><strong>Budget Band:</strong> ${budgetVal}</div>
          <div><strong>Logged At:</strong> ${now} · Warsaw HQ Intake</div>
          ${notes ? `<div><strong>Notes:</strong> ${notes}</div>` : ''}
        `;
      }

      form.style.display = 'none';
      successBox.style.display = 'block';
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        calculateEstimator();
        successBox.style.display = 'none';
        form.style.display = 'flex';
      });
    }
  }

  // --------------------------------------------------------------------------
  // 7. Gate G5 Motion Choreography: Expressive Scroll Text Reveals & Parallax
  // --------------------------------------------------------------------------
  function initScrollReveals() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Automatically wire fine-grained text & UI elements for staggered scroll emergence
    const staggerGroups = [
      { parent: '.hero-text-col', children: '.h1-line-1, .h1-line-2, .hero-subcopy, .hero-cta-action', step: 110 },
      { parent: '.director-row', children: '.director-card, .manifesto-quote-col', step: 140 },
      { parent: '.manifesto-showcase-section', children: '.showcase-stage, .floating-feature-card, .pill-tab, .back-to-top-circle', step: 70 },
      { parent: '#works .section-header-row', children: '.section-kicker, .section-title, .section-lead', step: 100 },
      { parent: '.monograph-item:nth-of-type(1)', children: '.monograph-visual, .monograph-meta, .monograph-title, .monograph-thesis, .ledger-row, .monograph-action-btn', step: 75 },
      { parent: '.monograph-item:nth-of-type(2)', children: '.monograph-visual, .monograph-meta, .monograph-title, .monograph-thesis, .ledger-row, .monograph-action-btn', step: 75 },
      { parent: '.monograph-item:nth-of-type(3)', children: '.monograph-visual, .monograph-meta, .monograph-title, .monograph-thesis, .ledger-row, .monograph-action-btn', step: 75 },
      { parent: '#estimator .section-header-row', children: '.section-kicker, .section-title, .section-lead', step: 100 },
      { parent: '.estimator-workspace', children: '.blueprint-board, .estimator-control-group, .estimator-output-panel', step: 95 },
      { parent: '#materials .section-header-row', children: '.section-kicker, .section-title, .section-lead', step: 100 },
      { parent: '.materials-grid', children: '.material-card', step: 140 },
      { parent: '.contact-grid', children: '.section-kicker, .section-title, .contact-lead, .commitment-item, .studio-block, .contact-form-col', step: 80 },
      { parent: '.site-footer', children: '.footer-brand-col, .footer-contact-col, .footer-action-col, .footer-bottom-row', step: 90 }
    ];

    staggerGroups.forEach(({ parent, children, step }) => {
      const parentEl = document.querySelector(parent);
      if (!parentEl) return;
      const nodes = parentEl.querySelectorAll(children);
      nodes.forEach((node, idx) => {
        if (!node.classList.contains('reveal-item')) {
          node.classList.add('scroll-reveal-el');
        }
        node.style.setProperty('--reveal-delay', `${idx * step}ms`);
      });
    });

    // Directional slide-in for split blueprint & contact columns
    const bpCol = document.querySelector('.blueprint-column');
    const estCol = document.querySelector('.estimator-controls-column');
    if (bpCol) bpCol.classList.add('scroll-from-left');
    if (estCol) estCol.classList.add('scroll-from-right');

    const allAnimated = document.querySelectorAll('.reveal-item, .scroll-reveal-el, .scroll-from-left, .scroll-from-right');
    const blackLines = document.querySelectorAll('.black-line');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      allAnimated.forEach((el) => el.classList.add('revealed'));
      blackLines.forEach((l) => l.classList.add('revealed'));
      return;
    }

    // Bi-directional observer: reveals as you scroll down, resets below viewport fold so scrolling back down replays the motion
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // If a parent container intersected, reveal all child animated elements inside it
          const children = entry.target.querySelectorAll('.scroll-reveal-el, .scroll-from-left, .scroll-from-right, .reveal-item');
          children.forEach(child => child.classList.add('revealed'));
        } else if (entry.boundingClientRect.top > window.innerHeight * 0.96) {
          entry.target.classList.remove('revealed');
        }
      });
    }, {
      rootMargin: '0px 0px 60px 0px',
      threshold: 0.02
    });

    allAnimated.forEach((el) => observer.observe(el));

    // Major parent sections/containers to cascade child elements reliably
    const parentContainers = document.querySelectorAll('.monograph-item, .estimator-workspace, .estimator-grid, .manifesto-showcase-section, .showcase-stage, .floating-feature-card, .showcase-tabs-nav, .materials-grid, .contact-grid, .site-footer');
    parentContainers.forEach((container) => observer.observe(container));

    blackLines.forEach((line) => {
      line.classList.add('reveal-line');
      observer.observe(line);
    });

    // Continuous Scroll-Driven Text Scrubbing via requestAnimationFrame
    const manifestoPara = document.querySelector('.manifesto-paragraph');

    let ticking = false;
    function updateScrollMotion() {
      const vh = window.innerHeight || 900;

      // Scroll-linked opacity/vertical scrub on Chief Architect Manifesto
      if (manifestoPara) {
        const rect = manifestoPara.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (vh * 0.88 - rect.top) / (vh * 0.42)));
        manifestoPara.style.opacity = (0.25 + 0.75 * progress).toFixed(3);
        manifestoPara.style.transform = `translate3d(0, ${((1 - progress) * 24).toFixed(1)}px, 0)`;
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollMotion);
        ticking = true;
      }
    }, { passive: true });

    updateScrollMotion();
  }

  // --------------------------------------------------------------------------
  // 8. Back to Top Buttons
  // --------------------------------------------------------------------------
  function initBackToTop() {
    const btns = [
      document.getElementById('backToTopBtn'),
      document.getElementById('footerBackToTop')
    ];

    btns.forEach((btn) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. Mobile Navigation Drawer Toggle
  // --------------------------------------------------------------------------
  function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isExpanded);
      drawer.classList.toggle('open', !isExpanded);
      drawer.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // --------------------------------------------------------------------------
  // Bootstrap Engine on DOM ready
  // --------------------------------------------------------------------------
  function bootstrap() {
    initPixelDissolveSpike();
    initShowcaseTabs();
    initMonographButtons();
    initTectonicTabs();
    initEstimator();
    initBriefForm();
    initScrollReveals();
    initBackToTop();
    initMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

})();
