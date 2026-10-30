/**
 * DENTY OS — Interactive Practice OS Engine
 * Powers the Sunbeam-style interactive hero stage, dental arch planner,
 * ROI calculator, micro-UI widgets, and live demo booking.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Hero Stage Tab Switching (Sunbeam Tabs + OS Icon Sidebar)
  const allTabs = document.querySelectorAll('.sunbeam-tab, .stage-tab-btn, .os-nav-btn');
  const stagePanels = document.querySelectorAll('.stage-panel');

  allTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      if (!targetId) return;

      allTabs.forEach(t => {
        if (t.getAttribute('data-tab') === targetId) {
          t.classList.add('active');
          if (t.hasAttribute('aria-selected')) t.setAttribute('aria-selected', 'true');
        } else {
          t.classList.remove('active');
          if (t.hasAttribute('aria-selected')) t.setAttribute('aria-selected', 'false');
        }
      });

      stagePanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  
  // 0. FAQ Accordion Smooth Grid Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-q');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      item.classList.toggle('active', !isCurrentlyActive);
    });
  });


  // 1b. Tab 2 Anatomical Tooth Selector & Palette Modes
  const toothCells = document.querySelectorAll('.tooth-cell');
  const activeToothIndicator = document.querySelector('.arch-chip-active strong');
  const rvgMarker = document.querySelector('.rvg-marker');

  const toothData = {
    '18': { name: '18 • Górny Prawy Mądrości', diag: 'K00.1 Ząb zatrzymany', proc: 'Ekstrakcja dłutowanie', price: '450 PLN', rvg: 'Ząb 18 [Zatrzym.]' },
    '17': { name: '17 • Górny Prawy Trzonowiec', diag: 'K02.1 Próchnica powierzchni żującej', proc: 'Wypełnienie kompozytowe', price: '320 PLN', rvg: 'Ząb 17 [Caries]' },
    '16': { name: '16 • Górny Prawy Trzonowiec', diag: 'K02.1 Próchnica głęboka MOD', proc: 'Rekonstrukcja estetyczna Empress', price: '420 PLN', rvg: 'Ząb 16 [MOD]' },
    '14': { name: '14 • Górny Prawy Przedtrzonowiec', diag: 'K04.0 Zapalenie miazgi', proc: 'Endodoncja pod mikroskopem', price: '950 PLN', rvg: 'Ząb 14 [Endo]' },
    '11': { name: '11 • Górny Prawy Siekacz', diag: 'K03.8 Złamanie korony zęba', proc: 'Korona pełnoceramiczna E.max', price: '1 800 PLN', rvg: 'Ząb 11 [Korona]' },
    '21': { name: '21 • Górny Lewy Siekacz', diag: 'K03.8 Estetyka licówki', proc: 'Korona pełnoceramiczna E.max', price: '1 800 PLN', rvg: 'Ząb 21 [Korona]' },
    '24': { name: '24 • Górny Lewy Przedtrzonowiec', diag: 'K08.1 Brak zawiązka zęba', proc: 'Implantacja Straumann BLX', price: '3 900 PLN', rvg: 'Ząb 24 [Implant]' },
    '27': { name: '27 • Górny Lewy Trzonowiec', diag: 'K02.0 Próchnica szkliwa', proc: 'Infiltracja Icon / Flow', price: '280 PLN', rvg: 'Ząb 27 [Ubytek]' },
    '48': { name: '48 • Dolny Prawy Mądrości', diag: 'K01.1 Ząb zatrzymany w kości', proc: 'Odontectomia chirurgiczna', price: '500 PLN', rvg: 'Ząb 48 [Ekstrakcja]' },
    '47': { name: '47 • Dolny Prawy Trzonowiec', diag: 'K08.1 Filar mostu protetycznego', proc: 'Most cyrkonowy 3-punktowy', price: '3 200 PLN', rvg: 'Ząb 47 [Most]' },
    '46': { name: '46 • Dolny Prawy Trzonowiec', diag: 'K02.1 Ubytek klasy I', proc: 'Wypełnienie estetyczne', price: '350 PLN', rvg: 'Ząb 46 [Wypełn.]' },
    '36': { name: '36 • Dolny Lewy Trzonowiec', diag: 'K04.1 Martwica miazgi', proc: 'Powtórne leczenie kanałowe', price: '1 200 PLN', rvg: 'Ząb 36 [Endo]' }
  };

  toothCells.forEach(cell => {
    cell.addEventListener('click', () => {
      toothCells.forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      const toothNr = cell.getAttribute('data-tooth') || cell.querySelector('.tooth-nr')?.textContent.trim();
      if (toothNr) {
        if (activeToothIndicator) activeToothIndicator.textContent = `${toothNr} (Trzonowiec)`;
        const data = toothData[toothNr] || {
          name: `${toothNr} • Ząb anatomiczny`,
          diag: 'Zdrowa struktura tkanek',
          proc: 'Kontrola okresowa + fluoryzacja',
          price: '150 PLN',
          rvg: `Ząb ${toothNr} [Zdrowy]`
        };
        const rows = document.querySelectorAll('.edm-details-box .edm-row .edm-v');
        if (rows.length >= 3) {
          rows[0].textContent = data.name;
          rows[1].textContent = data.diag;
          rows[2].textContent = data.proc;
        }
        const priceEl = document.querySelector('.edm-details-box strong[style*="0D7A5F"]') || document.querySelectorAll('.edm-details-box strong.edm-v')[1];
        if (priceEl) priceEl.textContent = data.price;
        if (rvgMarker) rvgMarker.textContent = data.rvg;
      }
    });
  });

  // Palette mode buttons toggle
  document.querySelectorAll('.palette-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.palette-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Billing and Analytics filter pills toggle
  document.querySelectorAll('.billing-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.billing-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.querySelectorAll('.analytics-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.analytics-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });


  // 2. Schedule Chair Selector (All chairs vs Single chair detailed view)
  const chairPills = document.querySelectorAll('.chair-pill-btn');
  const chairCols = document.querySelectorAll('.chair-column');
  const scheduleColsContainer = document.querySelector('.schedule-columns');

  function selectChairView(targetChair) {
    chairPills.forEach(p => {
      if (p.getAttribute('data-chair') === targetChair) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    if (targetChair === 'all') {
      if (scheduleColsContainer) scheduleColsContainer.classList.remove('single-chair-mode');
      chairCols.forEach(col => {
        col.style.display = 'flex';
      });
    } else {
      if (scheduleColsContainer) scheduleColsContainer.classList.add('single-chair-mode');
      chairCols.forEach(col => {
        if (col.getAttribute('data-chair') === targetChair) {
          col.style.display = 'flex';
        } else {
          col.style.display = 'none';
        }
      });
    }
  }

  chairPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetChair = pill.getAttribute('data-chair') || 'all';
      selectChairView(targetChair);
    });
  });

  document.querySelectorAll('[data-show-all-chairs]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      selectChairView('all');
    });
  });


  // 3. Interactive Dental Arch & Treatment Planner (Chapter 03)
  const jawTeeth = document.querySelectorAll('.jaw-tooth-unit');
  const activeToothNumEl = document.getElementById('active-tooth-num');
  const procedureSelect = document.getElementById('procedure-select');
  const applyProcBtn = document.getElementById('apply-procedure-btn');
  const planItemsList = document.getElementById('plan-items-list');
  const planTotalPriceEl = document.getElementById('plan-total-price');
  const planTotalTimeEl = document.getElementById('plan-total-time');
  const downloadPdfBtn = document.getElementById('download-pdf-btn');

  let activeTooth = '16';
  const procedures = {
    comp: { name: 'Rekonstrukcja kompozytowa Enamel', price: 380, time: 45 },
    endo: { name: 'Endodoncja mikroskopowa (2 kanały)', price: 1100, time: 90 },
    crown: { name: 'Korona pełnoceramiczna E.max CAD/CAM', price: 2200, time: 60 },
    implant: { name: 'Implant tytanowy Straumann BLX', price: 3900, time: 60 },
    gbt: { name: 'Protokół Higienizacyjny GBT EMS', price: 350, time: 45 }
  };

  // State of planned procedures per tooth
  const plannedProcedures = {
    '16': { key: 'comp', name: 'Rekonstrukcja kompozytowa Enamel', price: 380, time: 45 },
    '14': { key: 'endo', name: 'Endodoncja mikroskopowa (2 kanały)', price: 1100, time: 90 },
    '11': { key: 'crown', name: 'Korona pełnoceramiczna E.max CAD/CAM', price: 2200, time: 60 }
  };

  function updatePlanUI() {
    if (!planItemsList) return;
    let total = 0;
    let totalMinutes = 0;
    planItemsList.innerHTML = '';

    const keys = Object.keys(plannedProcedures);
    if (keys.length === 0) {
      planItemsList.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:12px;text-align:center;">Kliknij ząb na diagramie, aby dodać zabieg.</div>';
    } else {
      keys.forEach(tooth => {
        const item = plannedProcedures[tooth];
        total += item.price;
        totalMinutes += item.time;

        const row = document.createElement('div');
        row.className = 'plan-item-row';
        row.innerHTML = `
          <div>
            <strong>Ząb ${tooth}</strong>: ${item.name}
            <div style="font-size:11px;color:var(--text-muted);">${item.time} min w fotelu</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <span style="font-weight:700;color:var(--text-ink);">${item.price.toLocaleString('pl-PL')} PLN</span>
            <button data-remove="${tooth}" style="background:none;border:none;cursor:pointer;color:var(--status-rose);font-size:14px;padding:2px 6px;">✕</button>
          </div>
        `;
        planItemsList.appendChild(row);
      });
    }

    planTotalPriceEl.textContent = `${total.toLocaleString('pl-PL')} PLN`;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    planTotalTimeEl.textContent = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;

    // Highlight teeth with procedures
    jawTeeth.forEach(t => {
      const num = t.getAttribute('data-tooth');
      if (plannedProcedures[num]) {
        t.classList.add('has-procedure');
      } else {
        t.classList.remove('has-procedure');
      }
    });

    // Wire remove buttons
    document.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tNum = e.target.getAttribute('data-remove');
        delete plannedProcedures[tNum];
        updatePlanUI();
      });
    });
  }

  jawTeeth.forEach(t => {
    t.addEventListener('click', () => {
      jawTeeth.forEach(item => item.classList.remove('active'));
      t.classList.add('active');
      activeTooth = t.getAttribute('data-tooth');
      activeToothNumEl.textContent = activeTooth;

      if (plannedProcedures[activeTooth]) {
        procedureSelect.value = plannedProcedures[activeTooth].key;
      }
    });
  });

  if (applyProcBtn) {
    applyProcBtn.addEventListener('click', () => {
      const selectedKey = procedureSelect.value;
      if (procedures[selectedKey]) {
        plannedProcedures[activeTooth] = {
          key: selectedKey,
          ...procedures[selectedKey]
        };
        updatePlanUI();
      }
    });
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      const total = planTotalPriceEl.textContent;
      alert(`Generowanie cyfrowego kosztorysu PDF dla Pacjenta (Suma: ${total}).\nGotowy do podpisu biometrycznego na tablecie w fotelu!`);
    });
  }

  updatePlanUI();

    // 4. Luxury SaaS ROI Calculator Logic
  const chairsInput = document.getElementById('calc-chairs');
  const priceInput = document.getElementById('calc-price');
  const missedInput = document.getElementById('calc-missed');

  const valChairsEl = document.getElementById('val-chairs');
  const valPriceEl = document.getElementById('val-price');
  const valMissedEl = document.getElementById('val-missed');

  const roiMonthlyEl = document.getElementById('roi-monthly');
  const roiAnnualEl = document.getElementById('roi-annual');
  const presetChips = document.querySelectorAll('.calc-preset-chip');

  function calculateLuxuryROI() {
    if (!chairsInput || !priceInput || !missedInput) return;

    const chairs = +chairsInput.value;
    const price = +priceInput.value;
    const missed = +missedInput.value;

    if (valChairsEl) valChairsEl.textContent = `${chairs} ${chairs === 1 ? 'fotel' : chairs < 5 ? 'fotele' : 'foteli'}`;
    if (valPriceEl) valPriceEl.textContent = `${price} zł`;
    if (valMissedEl) valMissedEl.textContent = `${missed} ${missed === 1 ? 'wizyta' : missed < 5 ? 'wizyty' : 'wizyt'}`;

    // Formula specified:
    // recoveredPerWeek = missed * 0.85 (or 0.88)
    // monthlyRecovered = Math.round(recoveredPerWeek * 4.33 * price)
    // annualRecovered = Math.round(monthlyRecovered * 12)
    const recoveredPerWeek = missed * 0.85;
    const monthlyRecovered = Math.round(recoveredPerWeek * 4.33 * price);
    const annualRecovered = Math.round(monthlyRecovered * 12);

    if (roiMonthlyEl) roiMonthlyEl.textContent = `+${monthlyRecovered.toLocaleString('pl-PL')} zł`;
    if (roiAnnualEl) roiAnnualEl.textContent = `+${annualRecovered.toLocaleString('pl-PL')} zł`;
  }

  if (chairsInput) chairsInput.addEventListener('input', calculateLuxuryROI);
  if (priceInput) priceInput.addEventListener('input', calculateLuxuryROI);
  if (missedInput) missedInput.addEventListener('input', calculateLuxuryROI);

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const preset = chip.getAttribute('data-preset');
      if (preset === 'small') {
        chairsInput.value = 2;
        priceInput.value = 300;
        missedInput.value = 4;
      } else if (preset === 'medium') {
        chairsInput.value = 4;
        priceInput.value = 400;
        missedInput.value = 10;
      } else if (preset === 'large') {
        chairsInput.value = 8;
        priceInput.value = 500;
        missedInput.value = 20;
      }
      calculateLuxuryROI();
    });
  });

  calculateLuxuryROI();


// 5. Pricing Monthly / Annual Toggle (Chapter 05)
  const toggleMonthlyBtn = document.getElementById('pricing-monthly-btn');
  const toggleAnnualBtn = document.getElementById('pricing-annual-btn');
  const priceValues = document.querySelectorAll('.price-val');
  const pricePeriods = document.querySelectorAll('.price-period');

  const pricingTiers = {
    monthly: ['299', '699', '1 299'],
    annual: ['239', '559', '1 039']
  };

  if (toggleMonthlyBtn && toggleAnnualBtn) {
    toggleMonthlyBtn.addEventListener('click', () => {
      toggleMonthlyBtn.classList.add('active');
      toggleAnnualBtn.classList.remove('active');
      priceValues.forEach((el, index) => {
        el.textContent = `${pricingTiers.monthly[index]} PLN`;
      });
      pricePeriods.forEach(p => p.textContent = '/ miesiąc');
    });

    toggleAnnualBtn.addEventListener('click', () => {
      toggleAnnualBtn.classList.add('active');
      toggleMonthlyBtn.classList.remove('active');
      priceValues.forEach((el, index) => {
        el.textContent = `${pricingTiers.annual[index]} PLN`;
      });
      pricePeriods.forEach(p => p.textContent = '/ miesiąc (faktura roczna, -20%)');
    });
  }

  // 6. Bento Simulator: 1-Click SMS Rescue
  const simBtn = document.getElementById('sim-sms-btn');
  const simStatusEl = document.getElementById('sim-sms-status');
  if (simBtn && simStatusEl) {
    simBtn.addEventListener('click', () => {
      simBtn.disabled = true;
      simStatusEl.innerHTML = '<span style="color:var(--status-amber);">⚡ Wykryto odwołanie wizyty o 14:00 (Dr Nowicka)...</span>';
      
      setTimeout(() => {
        simStatusEl.innerHTML = '<span style="color:var(--status-purple);">✉️ Autopilot wysłał SMS do 3 pacjentów z kolejki...</span>';
      }, 1000);

      setTimeout(() => {
        simStatusEl.innerHTML = '<span style="color:var(--status-emerald);font-weight:700;">✅ Pacjent Tomasz B. potwierdził wizytę (czas reakcji: 4 min). Fotel zapełniony!</span>';
        simBtn.disabled = false;
      }, 2400);
    });
  }

  // 7. Live Demo Booking Modal (Clean Scroll Lock Recovery on X, Backdrop, Escape)
  const demoModal = document.getElementById('demo-modal');
  const openModalBtns = document.querySelectorAll('[data-open-demo]');
  const closeModalBtns = document.querySelectorAll('#modal-close-btn, #modal-close, [data-close-modal], .modal-close-btn');
  const demoForm = document.getElementById('demo-booking-form') || document.getElementById('demo-form');

  function openDemoModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!demoModal) return;
    demoModal.classList.add('open');
    demoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeDemoModal() {
    if (!demoModal) return;
    demoModal.classList.remove('open');
    demoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', openDemoModal);
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDemoModal();
    });
  });

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeDemoModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && demoModal && demoModal.classList.contains('open')) {
      closeDemoModal();
    }
  });

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Dziękujemy! Twój indywidualny dostęp demonstracyjny do Denty OS został aktywowany. Koordynator wdrożeń skontaktuje się w ciągu 15 minut.');
      closeDemoModal();
    });
  }
});
