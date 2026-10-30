/**
 * TOUCHÉ — INTERACTION CONTROLLER & TWO-WAY BOOKING ENGINE
 * Direction: Marea Spa Editorial Wellness
 * Performance: Native 144fps (Zero wheel hijacking, 0ms latency)
 */

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    ritual: 'deep-tissue', // 'relaxation' | 'deep-tissue' | 'hot-stone' | 'kobido'
    duration: 90,          // 60 | 90 | 120
    pressure: 3,           // 1 .. 5
    tensionZone: 'neck',   // 'neck' | 'shoulders' | 'lumbar' | 'nervous'
    oil: 'cedar-bergamot', // 'cedar-bergamot' | 'lavender-neroli' | 'ginger-rosemary' | 'pure-almond'
    sound: 'ambient-52hz', // 'ambient-52hz' | 'pure-silence' | 'rain-forest'
    district: 'Mokotów',
    price: 440
  };

  // --- METRIC & CONTENT DICTIONARIES ---
  const ritualsMeta = {
    'relaxation': {
      name: 'Dotyk Ukojenia',
      fullTitle: 'Dotyk Ukojenia (Masaż Relaksacyjny)',
      prices: { 60: 320, 90: 400, 120: 520 },
      durations: { 60: '60 MIN', 90: '90 MIN', 120: '120 MIN' }
    },
    'deep-tissue': {
      name: 'Głębszy Rytm',
      fullTitle: 'Głębszy Rytm (Deep Tissue & Powięzi)',
      prices: { 60: 360, 90: 440, 120: 560 },
      durations: { 60: '60 MIN', 90: '90 MIN', 120: '120 MIN' }
    },
    'hot-stone': {
      name: 'Ciepły Bazalt',
      fullTitle: 'Ciepły Bazalt (Gorące Kamienie)',
      prices: { 60: 380, 90: 460, 120: 580 },
      durations: { 60: '60 MIN', 90: '90 MIN', 120: '120 MIN' }
    },
    'kobido': {
      name: 'Harmonia Twarzy & Szyi',
      fullTitle: 'Harmonia Twarzy (Japoński Kobido)',
      prices: { 60: 340, 90: 390, 120: 540 },
      durations: { 60: '60 MIN', 90: '75 MIN', 120: '120 MIN' }
    }
  };

  const zonesMeta = {
    'neck': {
      title: 'Praca z Karkiem, Potylicą i Żuchwą',
      depth: 'Warstwa powięzi głębokiej & mięsień czworoboczny',
      cadence: '14 powolnych chwytów / min',
      temp: '38.5°C (podgrzewacz ceramiczny)',
      suggestedRitual: 'Głębszy Rytm (Deep Tissue)',
      suggestedRitualKey: 'deep-tissue',
      description: 'Sesja skupia się na rozklejeniu zrostów mięśniowo-powięziowych karku, dekompresji połączenia głowowo-szyjnego oraz rozluźnieniu żwaczy.'
    },
    'shoulders': {
      title: 'Praca z Barkami i Między Łopatkami',
      depth: 'Mięśnie równoległoboczne, dźwigacz łopatki, najszerszy grzbietu',
      cadence: '12 zrównoważonych rozcierań / min',
      temp: '38.5°C (podgrzewacz ceramiczny)',
      suggestedRitual: 'Głębszy Rytm (Deep Tissue)',
      suggestedRitualKey: 'deep-tissue',
      description: 'Głęboka mobilizacja łopatek, uwolnienie zablokowanego oddechu klatki piersiowej i redukcja chronicznego uczucia ciężaru na plecach.'
    },
    'lumbar': {
      title: 'Praca z Odcinkiem Lędźwiowym i Miednicą',
      depth: 'Powięź piersiowo-lędźwiowa, pośladki, biodrowo-lędźwiowy',
      cadence: '10 powolnych rozgrzewających trakcji / min',
      temp: '39.0°C (olej i kamienie wulkaniczne)',
      suggestedRitual: 'Ciepły Bazalt (Gorące Kamienie)',
      suggestedRitualKey: 'hot-stone',
      description: 'Ciepło kamieni bazaltowych w połączeniu z rotacjami miednicy usuwa uczucie zacięcia i przywraca swobodny ruch w dolnym kręgosłupie.'
    },
    'nervous': {
      title: 'Pełne Wyciszenie Układu Nerwowego',
      depth: 'Receptory powierzchowne, drenaż limfatyczny, nerw błędny',
      cadence: '8 otulających, rytmicznych muśnięć / min',
      temp: '38.0°C (kojący olej migdałowy)',
      suggestedRitual: 'Dotyk Ukojenia (Relaks)',
      suggestedRitualKey: 'relaxation',
      description: 'Minimalizacja bodźców zewnętrznych. Długie, hipnotyzujące ruchy całego ciała przełączające układ nerwowy w tryb głębokiej regeneracji parasympatycznej.'
    }
  };

  const pressuresMeta = {
    1: 'Poziom 1 / 5 — Subtelny drenaż',
    2: 'Poziom 2 / 5 — Otulający, relaksacyjny',
    3: 'Poziom 3 / 5 — Umiarkowany, zbalansowany',
    4: 'Poziom 4 / 5 — Głęboki (Deep Tissue)',
    5: 'Poziom 5 / 5 — Intensywna praca powięziowa'
  };

  const oilsMeta = {
    'cedar-bergamot': 'Cedr Atlaski, Bergamotka & Słodki Migdał',
    'lavender-neroli': 'Dzika Lawenda z Prowansji & Kwiat Neroli',
    'ginger-rosemary': 'Biały Imbir, Rozmaryn & Jojoba',
    'pure-almond': 'Czysty Olej Migdałowy (Bezzapachowy)'
  };

  const soundsMeta = {
    'ambient-52hz': 'Ambient 52 Hz (Sakamoto / Eno)',
    'pure-silence': 'Cisza absolutna (Tylko oddech)',
    'rain-forest': 'Analogowy szum deszczu i lasu'
  };

  const districtsMeta = {
    'Mokotów': 'Standardowy czas dotarcia terapeuty: 45–60 minut. Bezpłatny dojazd w obrębie całej dzielnicy.',
    'Śródmieście / Powiśle': 'Standardowy czas dotarcia: 30–45 minut. Ścisłe centrum Warszawy, dojazd pod każdy adres.',
    'Żoliborz': 'Standardowy czas dotarcia: 40–55 minut. Cicha enklawa, transport mobilnego stołu pod same drzwi.',
    'Wola': 'Standardowy czas dotarcia: 35–50 minut. Apartamentowce i osiedla, obsługa portierni i wind.',
    'Saska Kępa': 'Standardowy czas dotarcia: 35–50 minut. Prawa strona Wisły z bezpłatnym dojazdem.',
    'Wilanów': 'Standardowy czas dotarcia: 45–60 minut. Miasteczko Wilanów i okolice pałacowe.',
    'Ursynów': 'Standardowy czas dotarcia: 45–60 minut. Szybki dojazd południową obwodnicą.',
    'Ochota': 'Standardowy czas dotarcia: 35–50 minut. Okolice Filtrów, Szczęśliwic i Włodarzewskiej.'
  };

  // --- DOM CACHE ---
  const bookingRitualSelect = document.getElementById('bookingRitualSelect');
  const bookingDurationSelect = document.getElementById('bookingDurationSelect');
  const bookingPressureSelect = document.getElementById('bookingPressureSelect');
  const bookingOilSelect = document.getElementById('bookingOilSelect');
  const bookingDistrictInput = document.getElementById('bookingDistrictInput');
  const bookingDateInput = document.getElementById('bookingDateInput');

  // Live Summary Pass Elements
  const passRitualName = document.getElementById('passRitualName');
  const passDurationAndPrice = document.getElementById('passDurationAndPrice');
  const passPressureAndZone = document.getElementById('passPressureAndZone');
  const passSensory = document.getElementById('passSensory');
  const passDistrict = document.getElementById('passDistrict');

  // Sticky Bar Elements
  const stickyRitualBar = document.getElementById('stickyRitualBar');
  const stickyBarTitle = document.getElementById('stickyBarTitle');
  const stickyBarPrice = document.getElementById('stickyBarPrice');

  // Spec Card Elements
  const specTitle = document.getElementById('specTitle');
  const specDepth = document.getElementById('specDepth');
  const specCadence = document.getElementById('specCadence');
  const specTemp = document.getElementById('specTemp');
  const specSuggestedRitual = document.getElementById('specSuggestedRitual');
  const specDescription = document.getElementById('specDescription');
  const pressureBadgeLabel = document.getElementById('pressureBadgeLabel');

  // Sensory Formula Bar
  const activeSensoryFormula = document.getElementById('activeSensoryFormula');

  // District Elements
  const districtName = document.getElementById('districtName');
  const districtDetails = document.getElementById('districtDetails');

  // --- CORE RECALCULATION & SYNC ENGINE ---
  function updateStateAndUI() {
    // Current price based on active ritual and duration
    const meta = ritualsMeta[state.ritual];
    state.price = meta.prices[state.duration] || meta.prices[90];
    const durationLabel = meta.durations[state.duration] || `${state.duration} MIN`;

    // 1. Update Menu Cards dynamic pricing
    document.querySelectorAll('.ritual-card').forEach(card => {
      const cardRitual = card.getAttribute('data-ritual-id');
      const cMeta = ritualsMeta[cardRitual];
      if (cMeta) {
        const slotDur = card.querySelector('[data-slot="duration"]');
        const slotPrice = card.querySelector('[data-slot="price"]');
        if (slotDur) slotDur.textContent = cMeta.durations[state.duration] || `${state.duration} MIN`;
        if (slotPrice) slotPrice.textContent = `${cMeta.prices[state.duration]} PLN`;
      }
      if (cardRitual === state.ritual) {
        card.style.borderColor = 'var(--color-coral)';
      } else {
        card.style.borderColor = 'var(--border-light)';
      }
    });

    // 2. Sync Form Selects
    if (bookingRitualSelect && bookingRitualSelect.value !== state.ritual) {
      bookingRitualSelect.value = state.ritual;
    }
    if (bookingDurationSelect && parseInt(bookingDurationSelect.value, 10) !== state.duration) {
      bookingDurationSelect.value = String(state.duration);
    }
    if (bookingPressureSelect && parseInt(bookingPressureSelect.value, 10) !== state.pressure) {
      bookingPressureSelect.value = String(state.pressure);
    }
    if (bookingOilSelect && bookingOilSelect.value !== state.oil) {
      bookingOilSelect.value = state.oil;
    }
    if (bookingDistrictInput && bookingDistrictInput.value !== state.district) {
      bookingDistrictInput.value = state.district;
    }

    // 3. Update Live Summary Pass
    if (passRitualName) passRitualName.textContent = meta.fullTitle;
    if (passDurationAndPrice) passDurationAndPrice.textContent = `${durationLabel} · ${state.price} PLN (Dojazd w cenie)`;
    
    const zoneName = zonesMeta[state.tensionZone] ? zonesMeta[state.tensionZone].title.replace('Praca z ', '') : 'Kark i Potylica';
    if (passPressureAndZone) passPressureAndZone.textContent = `Poziom ${state.pressure}/5 · ${zoneName}`;

    const oilShort = oilsMeta[state.oil] ? oilsMeta[state.oil].split('&')[0].trim() : 'Cedr Atlaski';
    const soundShort = soundsMeta[state.sound] ? soundsMeta[state.sound].split('(')[0].trim() : 'Ambient 52 Hz';
    if (passSensory) passSensory.textContent = `${oilShort} · ${soundShort}`;
    if (passDistrict) passDistrict.textContent = state.district;

    // 4. Update Sticky Bar
    if (stickyBarTitle) stickyBarTitle.textContent = meta.name;
    if (stickyBarPrice) stickyBarPrice.textContent = `${durationLabel} · ${state.price} PLN`;

    // 5. Update Sensory Formula Pill
    if (activeSensoryFormula) {
      activeSensoryFormula.textContent = `${oilShort} · ${soundShort}`;
    }
  }

  // --- INITIALIZE DATE FIELD TO TOMORROW ---
  if (bookingDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    bookingDateInput.value = `${yyyy}-${mm}-${dd}`;
    bookingDateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // --- DURATION FILTER TABS (CHAPTER 3) ---
  const durationPills = document.querySelectorAll('.duration-pill');
  durationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      durationPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      const durVal = parseInt(pill.getAttribute('data-duration'), 10);
      state.duration = durVal;
      updateStateAndUI();
    });
  });

  // --- QUICK RITUAL PILLS IN HERO BAR (CHAPTER 1) ---
  const quickPills = document.querySelectorAll('.quick-pill');
  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetRitual = pill.getAttribute('data-quick-ritual');
      if (ritualsMeta[targetRitual]) {
        state.ritual = targetRitual;
        updateStateAndUI();

        const menuSection = document.getElementById('menu');
        if (menuSection) {
          menuSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // --- RITUAL CARD BUTTONS (CHAPTER 3) ---
  const cardSelectBtns = document.querySelectorAll('[data-select-ritual]');
  cardSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedRitual = btn.getAttribute('data-select-ritual');
      if (ritualsMeta[selectedRitual]) {
        state.ritual = selectedRitual;
        updateStateAndUI();

        const bookingSection = document.getElementById('rezerwacja');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // --- TENSION ZONE SELECTION (CHAPTER 4) ---
  const zoneCards = document.querySelectorAll('.zone-card');
  zoneCards.forEach(card => {
    card.addEventListener('click', () => {
      zoneCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-checked', 'true');

      const zoneKey = card.getAttribute('data-zone');
      state.tensionZone = zoneKey;

      const zMeta = zonesMeta[zoneKey];
      if (zMeta) {
        if (specTitle) specTitle.textContent = zMeta.title;
        if (specDepth) specDepth.textContent = zMeta.depth;
        if (specCadence) specCadence.textContent = zMeta.cadence;
        if (specTemp) specTemp.textContent = zMeta.temp;
        if (specSuggestedRitual) specSuggestedRitual.textContent = zMeta.suggestedRitual;
        if (specDescription) specDescription.textContent = zMeta.description;
      }
      updateStateAndUI();
    });
  });

  // --- PRESSURE BUTTONS (CHAPTER 4) ---
  const pressureButtons = document.querySelectorAll('.pressure-btn');
  pressureButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      pressureButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const pVal = parseInt(btn.getAttribute('data-pressure'), 10);
      state.pressure = pVal;
      if (pressureBadgeLabel) {
        pressureBadgeLabel.textContent = pressuresMeta[pVal];
      }
      updateStateAndUI();
    });
  });

  // Apply Config Button in Spec Card
  const applyConfigBtn = document.getElementById('applyConfigBtn');
  if (applyConfigBtn) {
    applyConfigBtn.addEventListener('click', () => {
      const zMeta = zonesMeta[state.tensionZone];
      if (zMeta && zMeta.suggestedRitualKey) {
        state.ritual = zMeta.suggestedRitualKey;
      }
      updateStateAndUI();
      const bookingSection = document.getElementById('rezerwacja');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- APOTHECARY OILS & SOUNDS (CHAPTER 5) ---
  const oilRadios = document.querySelectorAll('input[name="oilChoice"]');
  oilRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.sensory-option').forEach(opt => opt.classList.remove('active'));
      radio.closest('.sensory-option').classList.add('active');
      state.oil = radio.value;
      updateStateAndUI();
    });
  });

  const acousticPills = document.querySelectorAll('.acoustic-pill');
  acousticPills.forEach(pill => {
    pill.addEventListener('click', () => {
      acousticPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-checked', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-checked', 'true');
      state.sound = pill.getAttribute('data-sound');
      updateStateAndUI();
    });
  });

  // --- DISTRICT SELECTOR (CHAPTER 7) ---
  const districtPills = document.querySelectorAll('.district-pill');
  districtPills.forEach(pill => {
    pill.addEventListener('click', () => {
      districtPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const dist = pill.getAttribute('data-district');
      state.district = dist;

      if (districtName) districtName.textContent = dist;
      if (districtDetails) districtDetails.textContent = districtsMeta[dist] || 'Bezpłatny dojazd w obrębie Warszawy.';
      updateStateAndUI();
    });
  });

  const districtSyncBtn = document.getElementById('districtSyncBtn');
  if (districtSyncBtn) {
    districtSyncBtn.addEventListener('click', () => {
      updateStateAndUI();
      const bookingSection = document.getElementById('rezerwacja');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- FORM SELECTS TWO-WAY BINDING (CHAPTER 8) ---
  if (bookingRitualSelect) {
    bookingRitualSelect.addEventListener('change', (e) => {
      state.ritual = e.target.value;
      updateStateAndUI();
    });
  }

  if (bookingDurationSelect) {
    bookingDurationSelect.addEventListener('change', (e) => {
      state.duration = parseInt(e.target.value, 10);
      durationPills.forEach(p => {
        if (parseInt(p.getAttribute('data-duration'), 10) === state.duration) {
          p.classList.add('active');
          p.setAttribute('aria-selected', 'true');
        } else {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        }
      });
      updateStateAndUI();
    });
  }

  if (bookingPressureSelect) {
    bookingPressureSelect.addEventListener('change', (e) => {
      state.pressure = parseInt(e.target.value, 10);
      pressureButtons.forEach(b => {
        if (parseInt(b.getAttribute('data-pressure'), 10) === state.pressure) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      if (pressureBadgeLabel) {
        pressureBadgeLabel.textContent = pressuresMeta[state.pressure];
      }
      updateStateAndUI();
    });
  }

  if (bookingOilSelect) {
    bookingOilSelect.addEventListener('change', (e) => {
      state.oil = e.target.value;
      oilRadios.forEach(r => {
        if (r.value === state.oil) {
          r.checked = true;
          document.querySelectorAll('.sensory-option').forEach(opt => opt.classList.remove('active'));
          r.closest('.sensory-option').classList.add('active');
        }
      });
      updateStateAndUI();
    });
  }

  if (bookingDistrictInput) {
    bookingDistrictInput.addEventListener('input', (e) => {
      state.district = e.target.value;
      if (passDistrict) passDistrict.textContent = state.district || 'Warszawa';
    });
  }

  // --- FORM SUBMISSION & CONFIRMATION ---
  const bookingForm = document.getElementById('bookingForm');
  const bookingConfirmation = document.getElementById('bookingConfirmation');
  const confirmationSummary = document.getElementById('confirmationSummary');
  const newBookingBtn = document.getElementById('newBookingBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingNameInput').value.trim();
      const phone = document.getElementById('bookingPhoneInput').value.trim();
      const email = document.getElementById('bookingEmailInput').value.trim();
      const date = document.getElementById('bookingDateInput').value;
      const timeSelect = document.getElementById('bookingTimeSelect');
      const timeLabel = timeSelect.options[timeSelect.selectedIndex].text;
      const district = document.getElementById('bookingDistrictInput').value.trim();

      if (!name || !phone || !email || !district) {
        alert('Prosimy o wypełnienie wszystkich wymaganych pól.');
        return;
      }

      const meta = ritualsMeta[state.ritual];
      const code = '#TOUCHE-' + Math.floor(1000 + Math.random() * 9000);
      const codeElem = document.getElementById('confirmationCode');
      if (codeElem) codeElem.textContent = code;

      if (confirmationSummary) {
        confirmationSummary.innerHTML = `
          <p><strong>Gość:</strong> ${name} · ${phone} · ${email}</p>
          <p><strong>Rytuał:</strong> ${meta.fullTitle} (${state.duration} min)</p>
          <p><strong>Inwestycja:</strong> ${state.price} PLN (płatność po masażu)</p>
          <p><strong>Termin:</strong> ${date} · ${timeLabel}</p>
          <p><strong>Adres wizyty:</strong> ${district}</p>
          <p><strong>Olejek & Siła:</strong> ${oilsMeta[state.oil]} · Siła: ${state.pressure}/5</p>
        `;
      }

      bookingForm.style.display = 'none';
      if (bookingConfirmation) {
        bookingConfirmation.style.display = 'block';
        bookingConfirmation.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (newBookingBtn) {
    newBookingBtn.addEventListener('click', () => {
      if (bookingConfirmation) bookingConfirmation.style.display = 'none';
      if (bookingForm) {
        bookingForm.reset();
        bookingForm.style.display = 'flex';
      }
      updateStateAndUI();
    });
  }

  // --- STICKY RITUAL BAR SCROLL LISTENER (NATIVE, PASSIVE) ---
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 500) {
      if (stickyRitualBar && !stickyRitualBar.classList.contains('visible')) {
        stickyRitualBar.classList.add('visible');
        stickyRitualBar.setAttribute('aria-hidden', 'false');
      }
    } else {
      if (stickyRitualBar && stickyRitualBar.classList.contains('visible')) {
        stickyRitualBar.classList.remove('visible');
        stickyRitualBar.setAttribute('aria-hidden', 'true');
      }
    }
  }, { passive: true });

  // Initial render on boot
  updateStateAndUI();

})();
