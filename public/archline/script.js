/**
 * ARCHLINE — Interactive Studio Architecture & Engineering Logic
 * Norm Architects Aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSwitcher();
  initCompareSlider();
  initCalculator();
  initQualityAccordion();
  initMaterialSelector();
  initBookingForm();
});

/* ==========================================================================
   1. Hero Project Switcher
   ========================================================================== */
function initHeroSwitcher() {
  const switchers = document.querySelectorAll('.switcher-btn');
  const heroImg = document.getElementById('heroImg');
  const heroSourceWebp = document.getElementById('heroSourceWebp');

  if (!switchers.length || !heroImg) return;

  switchers.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchers.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const imgBase = btn.dataset.img;
      if (imgBase) {
        heroImg.style.opacity = '0.4';
        setTimeout(() => {
          if (heroSourceWebp) {
            heroSourceWebp.srcset = `assets/${imgBase}.webp`;
          }
          heroImg.src = `assets/${imgBase}.jpg`;
          heroImg.style.opacity = '1';
        }, 200);
      }
    });
  });
}

/* ==========================================================================
   2. Draggable Before / After Structural Comparison Slider
   ========================================================================== */
function initCompareSlider() {
  const frame = document.querySelector('.compare-frame');
  const clip = document.getElementById('compareClip');
  const handle = document.getElementById('compareHandle');
  const monoCards = document.querySelectorAll('.mono-card');

  if (!frame || !clip || !handle) return;

  let isDragging = false;

  function setSliderPosition(percentage) {
    const clamped = Math.max(0, Math.min(100, percentage));
    clip.style.width = `${clamped}%`;
    handle.style.left = `${clamped}%`;
    handle.setAttribute('aria-valuenow', Math.round(clamped));
  }

  function handleMove(clientX) {
    const rect = frame.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const pct = (offsetX / rect.width) * 100;
    setSliderPosition(pct);
  }

  // Pointer & Mouse Events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  frame.addEventListener('click', (e) => {
    handleMove(e.clientX);
  });

  // Touch Events for Mobile
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  }, { passive: true });

  // Keyboard accessibility
  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
    if (e.key === 'ArrowLeft') {
      setSliderPosition(current - 5);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setSliderPosition(current + 5);
      e.preventDefault();
    }
  });

  // Residence Monograph Switcher
  monoCards.forEach((card) => {
    card.addEventListener('click', () => {
      monoCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      const afterImg = card.dataset.after;
      const beforeImg = card.dataset.before;

      const afterElem = frame.querySelector('.compare-after');
      const beforeElem = clip.querySelector('.compare-before');

      if (afterElem && afterImg) {
        afterElem.src = `assets/${afterImg}.jpg`;
      }
      if (beforeElem && beforeImg) {
        beforeElem.src = `assets/${beforeImg}.jpg`;
      }
    });
  });
}

/* ==========================================================================
   3. Turnkey Budget & Timeline Calculator
   ========================================================================== */
function initCalculator() {
  const areaInput = document.getElementById('areaInput');
  const areaDisplay = document.getElementById('areaDisplay');
  const condBtns = document.querySelectorAll('.cond-btn');
  const tierRadios = document.querySelectorAll('input[name="standardTier"]');
  const tierCards = document.querySelectorAll('.tier-card');

  const addonKitchen = document.getElementById('addonKitchen');
  const addonWardrobe = document.getElementById('addonWardrobe');
  const addonCladding = document.getElementById('addonCladding');

  const rowBuild = document.getElementById('rowBuild');
  const rowJoinery = document.getElementById('rowJoinery');
  const rowStone = document.getElementById('rowStone');
  const rowSupervision = document.getElementById('rowSupervision');
  const totalBudgetDisplay = document.getElementById('totalBudgetDisplay');
  const timelineDisplay = document.getElementById('timelineDisplay');

  const btnTransferToBrief = document.getElementById('btnTransferToBrief');
  const formArea = document.getElementById('formArea');
  const formTier = document.getElementById('formTier');
  const formBudgetEst = document.getElementById('formBudgetEst');

  if (!areaInput || !totalBudgetDisplay) return;

  let currentCondition = 'dev'; // 'dev' or 'reno'
  let currentTier = 'bespoke'; // 'calm', 'bespoke', 'monolith'

  const tierRates = {
    calm: 4200,
    bespoke: 6500,
    monolith: 9800
  };

  function formatPLN(num) {
    return Math.round(num).toLocaleString('pl-PL') + ' zł';
  }

  function recalculate() {
    const area = parseFloat(areaInput.value) || 118;
    areaDisplay.textContent = `${area} m²`;

    const conditionFactor = currentCondition === 'reno' ? 1.35 : 1.0;
    const baseRate = tierRates[currentTier] || 6500;

    let addonsSum = 0;
    let customJoineryAddon = 0;
    if (addonKitchen && addonKitchen.checked) {
      addonsSum += 48000;
      customJoineryAddon += 38000;
    }
    if (addonWardrobe && addonWardrobe.checked) {
      addonsSum += 34000;
      customJoineryAddon += 34000;
    }
    if (addonCladding && addonCladding.checked) {
      addonsSum += 28000;
      customJoineryAddon += 28000;
    }

    const baseCost = area * baseRate * conditionFactor;
    const totalCost = baseCost + addonsSum;

    // 4 Itemized Pillars
    const buildPart = totalCost * 0.38;
    const joineryPart = totalCost * 0.28 + (customJoineryAddon * 0.3);
    const stonePart = totalCost * 0.22;
    const supervisionPart = totalCost - (buildPart + joineryPart + stonePart);

    if (rowBuild) rowBuild.textContent = formatPLN(buildPart);
    if (rowJoinery) rowJoinery.textContent = formatPLN(joineryPart);
    if (rowStone) rowStone.textContent = formatPLN(stonePart);
    if (rowSupervision) rowSupervision.textContent = formatPLN(supervisionPart);
    if (totalBudgetDisplay) totalBudgetDisplay.textContent = formatPLN(totalCost);

    // Timeline calculation
    let weeks = Math.round(12 + (area - 45) * 0.05);
    if (currentCondition === 'reno') weeks += 3;
    if (currentTier === 'monolith') weeks += 4;
    else if (currentTier === 'bespoke') weeks += 2;
    if (timelineDisplay) {
      timelineDisplay.textContent = `Przewidywany czas: ${weeks} tygodni (ze stolarką)`;
    }

    // Hydrate booking form
    if (formArea) formArea.value = area;
    if (formTier) formTier.value = currentTier;
    if (formBudgetEst) formBudgetEst.value = formatPLN(totalCost);
  }

  areaInput.addEventListener('input', recalculate);

  condBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      condBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      currentCondition = btn.dataset.condition;
      recalculate();
    });
  });

  tierRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      tierCards.forEach((c) => c.classList.remove('active'));
      const parentCard = radio.closest('.tier-card');
      if (parentCard) parentCard.classList.add('active');
      currentTier = radio.value;
      recalculate();
    });
  });

  [addonKitchen, addonWardrobe, addonCladding].forEach((chk) => {
    if (chk) chk.addEventListener('change', recalculate);
  });

  if (btnTransferToBrief) {
    btnTransferToBrief.addEventListener('click', () => {
      recalculate();
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        const nameField = document.getElementById('formName');
        if (nameField) {
          setTimeout(() => nameField.focus(), 500);
        }
      }
    });
  }

  // Initial calculation
  recalculate();
}

/* ==========================================================================
   4. Quality Control Ledger (Accordion)
   ========================================================================== */
function initQualityAccordion() {
  const gates = document.querySelectorAll('.gate-item');
  if (!gates.length) return;

  gates.forEach((item) => {
    const head = item.querySelector('.gate-head');
    if (!head) return;

    head.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');
      gates.forEach((g) => {
        g.classList.remove('active');
        const h = g.querySelector('.gate-head');
        if (h) h.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyActive) {
        item.classList.add('active');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   5. Tactile Material Selector
   ========================================================================== */
function initMaterialSelector() {
  const matCards = document.querySelectorAll('.mat-card');
  if (!matCards.length) return;

  matCards.forEach((card) => {
    card.addEventListener('click', () => {
      matCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

/* ==========================================================================
   6. Turnkey Brief & Site Inspection Booking Form
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('turnkeyBookingForm');
  const statusBox = document.getElementById('formStatusBox');
  const submitBtn = document.getElementById('btnSubmitForm');
  const dateInput = document.getElementById('formDate');

  if (dateInput) {
    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  if (!form || !statusBox || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'REZERWACJA W TOKU...';

    setTimeout(() => {
      submitBtn.textContent = 'WIZJA ZAREZERWOWANA ✓';
      submitBtn.style.backgroundColor = 'var(--accent-bronze)';
      statusBox.style.display = 'block';
      statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 600);
  });
}
