/* ==========================================================================
   FreshClean Flagship Interactive Logic
   CleanCo Staggered Entrance & Interactive Systems
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    serviceType: 'standard', // 'standard', 'deep', 'renovation'
    area: 50,
    rooms: 2,
    bathrooms: 1,
    frequency: 'weekly', // 'weekly' (-20%), 'biweekly' (-15%), 'once' (0%)
    addons: {
      windows: false, // +120
      oven: false,    // +60
      fridge: false,  // +50
      steam: false    // +160
    },
    date: 'Jutro (10:00)',
    slot: '08:00 - 12:00'
  };

  const rates = {
    standard: { base: 140, perM2: 2.2, roomRate: 20, bathRate: 35 },
    deep: { base: 220, perM2: 3.5, roomRate: 35, bathRate: 50 },
    renovation: { base: 320, perM2: 5.0, roomRate: 50, bathRate: 70 }
  };

  const addonPrices = {
    windows: 120,
    oven: 60,
    fridge: 50,
    steam: 160
  };

  function calculatePrice() {
    const r = rates[state.serviceType];
    let subtotal = r.base + (state.area * r.perM2) + (state.rooms * r.roomRate) + (state.bathrooms * r.bathRate);
    
    // Addons
    Object.keys(state.addons).forEach(k => {
      if (state.addons[k]) subtotal += addonPrices[k];
    });

    // Discount
    let discount = 0;
    if (state.frequency === 'weekly') discount = 0.20;
    else if (state.frequency === 'biweekly') discount = 0.15;

    const total = Math.round(subtotal * (1 - discount));
    const estHours = Math.max(2.5, Math.round((subtotal / 70) * 10) / 10);
    const crewSize = state.area > 110 || state.serviceType === 'renovation' ? 2 : 1;

    return { total, subtotal, discountPercent: Math.round(discount * 100), estHours, crewSize };
  }

  function updateHeroUI() {
    const { total, estHours, crewSize } = calculatePrice();
    
    // Update labels
    const areaOut = document.getElementById('heroAreaVal');
    if (areaOut) areaOut.textContent = `${state.area} m²`;

    const roomsOut = document.getElementById('heroRoomsVal');
    if (roomsOut) roomsOut.textContent = state.rooms;

    const bathOut = document.getElementById('heroBathVal');
    if (bathOut) bathOut.textContent = state.bathrooms;

    const priceOut = document.getElementById('heroPriceVal');
    if (priceOut) priceOut.textContent = `${total} PLN`;

    const metaOut = document.getElementById('heroMetaVal');
    if (metaOut) metaOut.textContent = `~${estHours} godz. · ${crewSize} ${crewSize > 1 ? 'specjalistów' : 'specjalista'}`;

    // Sync Chapter 06 Form if present
    syncBookingForm(total, estHours, crewSize);
  }

  function syncBookingForm(total, estHours, crewSize) {
    const summaryType = document.getElementById('sumServiceType');
    if (summaryType) {
      const names = { standard: 'Standard Eco', deep: 'Generalne Gruntowne', renovation: 'Po remoncie' };
      summaryType.textContent = names[state.serviceType];
    }
    const summaryArea = document.getElementById('sumArea');
    if (summaryArea) summaryArea.textContent = `${state.area} m² (${state.rooms} pok., ${state.bathrooms} łaz.)`;

    const summaryFreq = document.getElementById('sumFrequency');
    if (summaryFreq) {
      const freqs = { weekly: 'Co tydzień (-20%)', biweekly: 'Co 2 tygodnie (-15%)', once: 'Jednorazowo (0%)' };
      summaryFreq.textContent = freqs[state.frequency];
    }

    const summaryTotal = document.getElementById('sumTotal');
    if (summaryTotal) summaryTotal.textContent = `${total} PLN`;

    const summaryHours = document.getElementById('sumHours');
    if (summaryHours) summaryHours.textContent = `Orientacyjny czas: ok. ${estHours} godz.`;
  }

  // Bind Hero Type Tabs
  const typeBtns = document.querySelectorAll('.fc-type-btn');
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.serviceType = btn.dataset.type;
      updateHeroUI();
    });
  });

  // Bind Area Slider
  const areaSlider = document.getElementById('heroAreaSlider');
  if (areaSlider) {
    areaSlider.addEventListener('input', (e) => {
      state.area = parseInt(e.target.value, 10);
      updateHeroUI();
    });
  }

  // Steppers
  const roomMinus = document.getElementById('roomMinus');
  const roomPlus = document.getElementById('roomPlus');
  if (roomMinus && roomPlus) {
    roomMinus.addEventListener('click', () => {
      if (state.rooms > 1) { state.rooms--; updateHeroUI(); }
    });
    roomPlus.addEventListener('click', () => {
      if (state.rooms < 8) { state.rooms++; updateHeroUI(); }
    });
  }

  const bathMinus = document.getElementById('bathMinus');
  const bathPlus = document.getElementById('bathPlus');
  if (bathMinus && bathPlus) {
    bathMinus.addEventListener('click', () => {
      if (state.bathrooms > 1) { state.bathrooms--; updateHeroUI(); }
    });
    bathPlus.addEventListener('click', () => {
      if (state.bathrooms < 5) { state.bathrooms++; updateHeroUI(); }
    });
  }

  // Frequency buttons
  const freqBtns = document.querySelectorAll('.fc-freq-btn');
  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.frequency = btn.dataset.freq;
      updateHeroUI();
    });
  });

  // Booking Form Addons
  const addonChecks = document.querySelectorAll('.fc-addon-checkbox');
  addonChecks.forEach(ch => {
    ch.addEventListener('change', (e) => {
      state.addons[e.target.name] = e.target.checked;
      updateHeroUI();
    });
  });

  // Scope Tabs Switcher (CleanCo Bento Panels)
  const scopeTabs = document.querySelectorAll('.fc-scope-tab-btn');
  const scopeGrids = document.querySelectorAll('.fc-scope-panel');
  scopeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scopeTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      scopeGrids.forEach(g => {
        g.style.display = 'none';
        g.classList.remove('active-panel');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.getElementById(`scope-${tab.dataset.target}`);
      if (target) {
        target.style.display = 'grid';
        target.classList.add('active-panel');
      }
    });
  });

  // Draggable Before/After Comparison Slider
  const slider = document.getElementById('baSlider');
  const overlay = document.getElementById('baOverlay');
  const handle = document.getElementById('baHandle');

  if (slider && overlay && handle) {
    let isDragging = false;

    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      const percentage = pos * 100;
      overlay.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      handle.style.left = `${percentage}%`;
    };

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Date selection pills in form
  const datePills = document.querySelectorAll('.fc-date-pill');
  datePills.forEach(pill => {
    pill.addEventListener('click', () => {
      datePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.date = pill.dataset.date;
      const sumDate = document.getElementById('sumDate');
      if (sumDate) sumDate.textContent = state.date;
    });
  });

  // Slot buttons in form
  const slotBtns = document.querySelectorAll('.fc-slot-btn');
  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.slot = btn.dataset.slot;
      const sumSlot = document.getElementById('sumSlot');
      if (sumSlot) sumSlot.textContent = state.slot;
    });
  });

  // CleanCo-Style Entrance Reveals via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-init');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  // Booking Form Submission & Modal
  const bookingForm = document.getElementById('fcBookingForm');
  const modal = document.getElementById('fcModal');
  const closeModal = document.getElementById('fcCloseModal');

  if (bookingForm && modal) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('fcClientName').value || 'Kliencie';
      const modalMsg = document.getElementById('modalDetails');
      const { total } = calculatePrice();
      if (modalMsg) {
        modalMsg.innerHTML = `Dziękujemy, <strong>${clientName}</strong>!<br>Rezerwacja na termin <strong>${state.date} (${state.slot})</strong> została zarejestrowana.<br>Koszt orientacyjny: <strong>${total} PLN</strong>.<br>Nasz koordynator skontaktuje się telefonicznie w ciągu 15 minut.`;
      }
      modal.classList.add('active');
    });
  }

  if (closeModal && modal) {
    closeModal.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Initialize UI
  updateHeroUI();
});
