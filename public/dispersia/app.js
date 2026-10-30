/* ==========================================================================
   DISPERSIA — INTERACTIVE ENGINE (AW26)
   Acne Studios Canon: Lookbook Filter, Proportion Calibrator, Seam Anatomy,
   Physics Lab, Atelier Fitting Booking & Demo Cart Drawer.
   ========================================================================== */

(function () {
  'use strict';

  // --- GARMENT DATABASE ---
  const LOOKBOOK_DATA = [
    {
      id: 'disp-01',
      code: '01 / OKRYCIE',
      name: 'Płaszcz Ciszy',
      category: 'okrycia',
      weight: '620 g/m²',
      composition: '100% Wełna Dziewicza (Biella)',
      price: 3450,
      image: 'assets/01_hero_runway_coat_left.webp',
      desc: 'Oversize trench z reglanowymi ramionami, ukrytą plisą guzikową i głębokimi kieszeniami sztorcowymi. Szwy kopertowe wykończone surowym jedwabiem.'
    },
    {
      id: 'disp-02',
      code: '02 / STRUKTURA',
      name: 'Marynarka Formy',
      category: 'struktura',
      weight: '480 g/m²',
      composition: '80% Wełna Czesankowa / 20% Jedwab',
      price: 2650,
      image: 'assets/02_hero_runway_silhouette_right.webp',
      desc: 'Dwurzędowy żakiet o architektonicznej linii ramion. Brak klejonek syntetycznych — konstrukcja oparta wyłącznie na włosiance i szwach stabilizujących.'
    },
    {
      id: 'disp-03',
      code: '03 / RUCH',
      name: 'Sukienka Ruchu',
      category: 'ruch',
      weight: '240 g/m²',
      composition: '65% Surowy Jedwab / 35% Len Organiczny',
      price: 1950,
      image: 'assets/03_piece_fluid_silk_dress.webp',
      desc: 'Asymetryczna sukienka z cięciami ukośnymi (bias cut), które dopasowują się do kinetki ciała. Czysty matowy chwyt i naturalna reakcja na wiatr.'
    },
    {
      id: 'disp-04',
      code: '04 / STRUKTURA',
      name: 'Spodnie Plisowane',
      category: 'struktura',
      weight: '380 g/m²',
      composition: '100% Bawełna Techniczna (Osaka)',
      price: 1450,
      image: 'assets/02_hero_runway_silhouette_right.webp',
      desc: 'Szeroka nogawka z głębokimi potrójnymi plisami skierowanymi do wewnątrz. Sztywny, graficzny spadek tworzący kolumnową sylwetkę w kroku.'
    },
    {
      id: 'disp-05',
      code: '05 / RUCH',
      name: 'Peleryna Geometrii',
      category: 'ruch',
      weight: '520 g/m²',
      composition: '90% Wełna Gotowana / 10% Kaszmir',
      price: 2950,
      image: 'assets/06_campaign_triptych_movement.webp',
      desc: 'Otwarte okrycie wierzchnie o kroju koła z wycięciami na ramiona. Monolityczna fala wełny tworząca dynamiczną bryłę w marszu.'
    },
    {
      id: 'disp-06',
      code: '06 / OKRYCIE',
      name: 'Kurtka Konstrukcyjna',
      category: 'okrycia',
      weight: '580 g/m²',
      composition: '100% Wełna z Merynosa / Skóra Cielęca',
      price: 3150,
      image: 'assets/01_hero_runway_coat_left.webp',
      desc: 'Krótka kurtka o ściętej talii z trójwymiarowym kołnierzem stójkowym. Szwy łączące wyłożone lamówką ze skóry nappa.'
    }
  ];

  // --- STATE ---
  let cart = [];
  let currentFilter = 'all';

  // --- DOM CACHE ---
  const cartTrigger = document.getElementById('cartTrigger');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartClose = document.getElementById('cartClose');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartCountBadges = document.querySelectorAll('[data-cart-count]');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const filterBtns = document.querySelectorAll('.filter-btn');
  const lookbookGrid = document.getElementById('lookbookGrid');

  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewClose = document.getElementById('quickViewClose');
  const qvImage = document.getElementById('qvImage');
  const qvName = document.getElementById('qvName');
  const qvCode = document.getElementById('qvCode');
  const qvWeight = document.getElementById('qvWeight');
  const qvPrice = document.getElementById('qvPrice');
  const qvDesc = document.getElementById('qvDesc');
  const qvComp = document.getElementById('qvComp');
  const qvAddBtn = document.getElementById('qvAddBtn');
  let qvActiveItem = null;

  // Calibrator DOM
  const calTabs = document.querySelectorAll('.cal-tab');
  const heightSlider = document.getElementById('heightSlider');
  const heightValDisplay = document.getElementById('heightValDisplay');
  const sizePillsCal = document.querySelectorAll('.cal-size-pill');
  const outEase = document.getElementById('outEase');
  const outAngle = document.getElementById('outAngle');
  const outSleeve = document.getElementById('outSleeve');
  const outCode = document.getElementById('outCode');
  const applySizeBtn = document.getElementById('applySizeBtn');

  // Anatomy DOM
  const anatomyPins = document.querySelectorAll('.anatomy-node-pin');
  const anatomyBtns = document.querySelectorAll('.anatomy-item-btn');
  const anatomyImage = document.getElementById('anatomyImage');

  // Showroom Booking Form
  const atelierCards = document.querySelectorAll('.atelier-card');
  const appointmentForm = document.getElementById('appointmentForm');
  const bookingCityInput = document.getElementById('bookingCityInput');

  // Hotspots
  const heroHotspots = document.querySelectorAll('.garment-hotspot');

  // --- INITIALIZE LOOKBOOK MATRIX ---
  function renderLookbook(filter = 'all') {
    if (!lookbookGrid) return;
    lookbookGrid.innerHTML = '';
    
    const items = filter === 'all' 
      ? LOOKBOOK_DATA 
      : LOOKBOOK_DATA.filter(it => it.category === filter);

    items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'garment-card';
      card.dataset.id = item.id;

      card.innerHTML = `
        <div class="garment-card-media">
          <img src="${item.image}" alt="${item.name}" loading="lazy" width="600" height="800">
          <div class="garment-badge-top">
            <span>${item.code}</span>
          </div>
          <button class="garment-quick-view-btn" data-action="quickview" data-id="${item.id}">Szczegóły kroju</button>
        </div>
        <div class="garment-card-info">
          <div>
            <div class="garment-meta-row">
              <span class="mono">${item.weight}</span>
              <span>Edycja Limitowana</span>
            </div>
            <h3 class="garment-name">${item.name}</h3>
            <p class="garment-specs-line">${item.composition}</p>
            <div class="garment-size-row" data-id="${item.id}">
              <button class="size-pill active" data-size="S">S</button>
              <button class="size-pill" data-size="M">M</button>
              <button class="size-pill" data-size="L">L</button>
            </div>
          </div>
          <div class="garment-bottom-row">
            <span class="garment-price mono">${item.price.toLocaleString('pl-PL')} PLN</span>
            <button class="add-to-cart-action" data-action="add" data-id="${item.id}">Dodaj do koszyka</button>
          </div>
        </div>
      `;

      // Size pill toggle inside card
      const sizePills = card.querySelectorAll('.size-pill');
      sizePills.forEach(sp => {
        sp.addEventListener('click', (e) => {
          e.stopPropagation();
          sizePills.forEach(p => p.classList.remove('active'));
          sp.classList.add('active');
        });
      });

      lookbookGrid.appendChild(card);
    });
  }

  // --- EVENT DELEGATION FOR LOOKBOOK GRID ---
  if (lookbookGrid) {
    lookbookGrid.addEventListener('click', (e) => {
      const qvTarget = e.target.closest('[data-action="quickview"]');
      if (qvTarget) {
        const id = qvTarget.dataset.id;
        openQuickView(id);
        return;
      }

      const addTarget = e.target.closest('[data-action="add"]');
      if (addTarget) {
        const id = addTarget.dataset.id;
        const card = addTarget.closest('.garment-card');
        const activeSizeEl = card ? card.querySelector('.size-pill.active') : null;
        const size = activeSizeEl ? activeSizeEl.dataset.size : 'M';
        addToCart(id, size);
      }
    });
  }

  // --- QUICK VIEW MODAL ---
  function openQuickView(id) {
    const item = LOOKBOOK_DATA.find(it => it.id === id);
    if (!item || !quickViewModal) return;
    qvActiveItem = item;

    qvImage.src = item.image;
    qvName.textContent = item.name;
    qvCode.textContent = item.code;
    qvWeight.textContent = item.weight;
    qvPrice.textContent = `${item.price.toLocaleString('pl-PL')} PLN`;
    qvDesc.textContent = item.desc;
    qvComp.textContent = item.composition;

    quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    if (!quickViewModal) return;
    quickViewModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (quickViewClose) quickViewClose.addEventListener('click', closeQuickView);
  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });
  }
  if (qvAddBtn) {
    qvAddBtn.addEventListener('click', () => {
      if (!qvActiveItem) return;
      addToCart(qvActiveItem.id, 'M');
      closeQuickView();
    });
  }

  // --- LOOKBOOK FILTER TABS ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      renderLookbook(filter);
    });
  });

  // --- CART DRAWER LOGIC ---
  function openCart() {
    if (!cartDrawer || !cartBackdrop) return;
    cartDrawer.classList.add('open');
    cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (!cartDrawer || !cartBackdrop) return;
    cartDrawer.classList.remove('open');
    cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  function addToCart(id, size = 'M') {
    const item = LOOKBOOK_DATA.find(it => it.id === id);
    if (!item) return;

    const existing = cart.find(ci => ci.id === id && ci.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        code: item.code,
        price: item.price,
        image: item.image,
        size: size,
        qty: 1
      });
    }

    updateCartUI();
    openCart();
  }

  function removeFromCart(id, size) {
    cart = cart.filter(ci => !(ci.id === id && ci.size === size));
    updateCartUI();
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
    });

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `<p class="cart-empty-state">Koszyk jest pusty.<br><small style="color:#999;font-size:11px;margin-top:8px;display:block;">Wybierz sylwetkę z lookbooka AW26</small></p>`;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '0 PLN';
      if (cartTotalEl) cartTotalEl.textContent = '0 PLN';
      return;
    }

    cartItemsList.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-meta mono">Rozmiar: ${item.size} · Ilość: ${item.qty}</span>
          <span class="cart-item-price mono">${itemTotal.toLocaleString('pl-PL')} PLN</span>
          <button class="cart-item-remove-btn" data-remove-id="${item.id}" data-remove-size="${item.size}">Usuń</button>
        </div>
      `;

      row.querySelector('.cart-item-remove-btn').addEventListener('click', () => {
        removeFromCart(item.id, item.size);
      });

      cartItemsList.appendChild(row);
    });

    if (cartSubtotalEl) cartSubtotalEl.textContent = `${subtotal.toLocaleString('pl-PL')} PLN`;
    if (cartTotalEl) cartTotalEl.textContent = `${subtotal.toLocaleString('pl-PL')} PLN`;
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Dodaj co najmniej jeden element do koszyka przed checkoutem.');
        return;
      }
      const refNumber = '#DISP-' + Math.floor(100000 + Math.random() * 900000);
      alert(`[DEMO CHECKOUT SUCCESS]\n\nZamówienie ${refNumber} zarejestrowane w atelier DISPERSIA!\nWybrane pozycje zostaną przygotowane do prywatnej przymiarki lub wysyłki kurierskiej.`);
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // --- CHAPTER 03: INTERACTIVE SILHOUETTE CALIBRATOR ---
  let calState = {
    silhouette: 'arch',
    height: 178,
    size: 'M'
  };

  const CAL_MATRIX = {
    arch: {
      title: 'Sylwetka 01 / Architektoniczna',
      easeBase: 12,
      angle: '8°',
      sleeveMod: '100%',
      prefix: 'DISP-SZ-A'
    },
    fluid: {
      title: 'Sylwetka 02 / Płynna',
      easeBase: 16,
      angle: '14°',
      sleeveMod: '102%',
      prefix: 'DISP-SZ-F'
    },
    oversize: {
      title: 'Sylwetka 03 / Oversize Monolit',
      easeBase: 24,
      angle: '22°',
      sleeveMod: '106%',
      prefix: 'DISP-SZ-O'
    }
  };

  function updateCalibrator() {
    const data = CAL_MATRIX[calState.silhouette];
    const sizeOffset = { XS: -4, S: -2, M: 0, L: 4, XL: 8 }[calState.size] || 0;
    const heightFactor = Math.round((calState.height - 170) * 0.15);
    const totalEase = data.easeBase + sizeOffset;

    if (outEase) outEase.textContent = `+${totalEase} cm`;
    if (outAngle) outAngle.textContent = data.angle;
    if (outSleeve) outSleeve.textContent = data.sleeveMod;
    if (outCode) outCode.textContent = `${data.prefix}-${calState.size}-${calState.height >= 182 ? 'LONG' : 'REG'}`;
    if (heightValDisplay) heightValDisplay.textContent = `${calState.height} CM`;
  }

  calTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      calTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      calState.silhouette = tab.dataset.sil;
      updateCalibrator();
    });
  });

  if (heightSlider) {
    heightSlider.addEventListener('input', (e) => {
      calState.height = parseInt(e.target.value, 10);
      updateCalibrator();
    });
  }

  sizePillsCal.forEach(pill => {
    pill.addEventListener('click', () => {
      sizePillsCal.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      calState.size = pill.dataset.size;
      updateCalibrator();
    });
  });

  if (applySizeBtn) {
    applySizeBtn.addEventListener('click', () => {
      addToCart('disp-01', calState.size);
    });
  }

  // --- CHAPTER 04: ANATOMICAL SEAM INSPECTOR ---
  const ANATOMY_SPECS = {
    1: {
      title: '01. Pływające ramię raglanowe',
      desc: 'Brak szwu szczytowego nad obojczykiem zapobiega załamywaniu się sylwetki w uniesieniu rąk. Linia opadania tworzy miękką, rzeźbiarską formę.',
      img: 'assets/01_hero_runway_coat_left.webp'
    },
    2: {
      title: '02. Podwójny splot wełny 620 g/m²',
      desc: 'Dwustronna wełna czesankowa z manufaktury w Bielli. Tkanina sama trzyma swój ciężar i profil pionowy bez konieczności stosowania syntetycznych klejonek.',
      img: 'assets/04_macro_wool_weave_texture.webp'
    },
    3: {
      title: '03. Ukryta plisa wiatrowa',
      desc: 'Zapięcie na naturalne rogowe guziki schowane pod podwójną warstwą wełny. Czysty, nienaruszony pionowy monolit od stójki po rąbek dołu.',
      img: 'assets/05_atelier_pattern_table.webp'
    },
    4: {
      title: '04. Szew kopertowy bez podszewki',
      desc: 'Wewnętrzne krawędzie wykończone lamówką z surowego jedwabiu habotai (French seam). Ubranie od wewnątrz prezentuje taką samą czystość jak na zewnątrz.',
      img: 'assets/05_atelier_pattern_table.webp'
    },
    5: {
      title: '05. Ręcznie formowany kołnierz stójkowy',
      desc: 'Trójwymiarowy profil kołnierza formowany parą pod kątem 75°. Zapewnia ochronę przed wiatrem i stabilne oparcie dla szala.',
      img: 'assets/01_hero_runway_coat_left.webp'
    }
  };

  function selectAnatomyNode(nodeId) {
    anatomyPins.forEach(p => p.classList.toggle('active', p.dataset.node === String(nodeId)));
    anatomyBtns.forEach(b => b.classList.toggle('active', b.dataset.node === String(nodeId)));

    const spec = ANATOMY_SPECS[nodeId];
    if (spec && anatomyImage) {
      anatomyImage.src = spec.img;
    }
  }

  anatomyPins.forEach(pin => {
    pin.addEventListener('click', () => {
      selectAnatomyNode(pin.dataset.node);
    });
  });

  anatomyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectAnatomyNode(btn.dataset.node);
    });
  });

  // --- CHAPTER 07: ATELIER SHOWROOM SWITCHER & BOOKING ---
  atelierCards.forEach(card => {
    card.addEventListener('click', () => {
      atelierCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      if (bookingCityInput) {
        bookingCityInput.value = card.dataset.city;
      }
    });
  });

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = bookingCityInput ? bookingCityInput.value : 'Warszawa';
      const name = document.getElementById('clientNameInput')?.value || 'Gość';
      alert(`[REZERWACJA POTWIERDZONA]\n\nDziękujemy, ${name}!\nZapraszamy do Atelier DISPERSIA (${city}).\nKonsultant skontaktuje się w ciągu 2 godzin w celu potwierdzenia wybranego terminu.`);
      appointmentForm.reset();
    });
  }

  // --- HERO HOTSPOTS CLICK ---
  heroHotspots.forEach(hs => {
    hs.addEventListener('click', () => {
      const targetId = hs.dataset.targetId || 'disp-01';
      openQuickView(targetId);
    });
  });

  // --- INIT ---
  renderLookbook('all');
  updateCalibrator();

})();
