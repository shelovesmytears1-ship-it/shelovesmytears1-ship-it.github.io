/* ============================================
   FRESHCLEAN — Interactive Logic
   Calculator Wizard · Form Validation
   Scroll Animations · Mobile Menu
   ============================================ */

(function () {
  'use strict';

  /* ----- PRICING DATA ----- */
  const PRICING = {
    'regularne': 10,
    'generalne': 18,
    'po-remoncie': 25,
    'biurowe': 8
  };

  const TYPE_LABELS = {
    'regularne': 'Sprzątanie regularne',
    'generalne': 'Sprzątanie generalne',
    'po-remoncie': 'Po remoncie',
    'biurowe': 'Sprzątanie biur'
  };

  const AREA_MIN = 20;
  const AREA_MAX = 300;
  const AREA_STEP = 5;


  /* ==========================================
     1. MOBILE MENU
     ========================================== */
  const navBurger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  function toggleMenu() {
    const isOpen = document.body.classList.toggle('menu-open');
    navBurger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    navBurger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  navBurger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Close menu on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
      navBurger.focus();
    }
  });


  /* ==========================================
     2. NAV SCROLL SHADOW
     ========================================== */
  var navWrapper = document.getElementById('nav');
  var lastScrollY = 0;

  function handleNavScroll() {
    var scrollY = window.scrollY;
    if (scrollY > 20) {
      navWrapper.classList.add('scrolled');
    } else {
      navWrapper.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  /* ==========================================
     3. CALCULATOR WIZARD
     ========================================== */
  var currentStep = 1;
  var selectedType = null;
  var area = 50;
  var selectedExtras = [];

  /* DOM references */
  var wizard = document.getElementById('calc-wizard');
  var panels = wizard.querySelectorAll('.calc-panel');
  var progSteps = [
    document.getElementById('prog-step-1'),
    document.getElementById('prog-step-2'),
    document.getElementById('prog-step-3')
  ];
  var progLines = [
    document.getElementById('prog-line-1'),
    document.getElementById('prog-line-2')
  ];

  /* Step 1: Type cards */
  var typeCards = wizard.querySelectorAll('.calc-type-card');
  var nextBtn1 = document.getElementById('calc-next-1');

  typeCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var type = card.dataset.type;
      selectedType = type;

      /* Update UI */
      typeCards.forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      card.querySelector('input').checked = true;

      /* Enable next button */
      nextBtn1.disabled = false;

      /* Update price preview for step 2 */
      updatePricePreview();
    });
  });

  nextBtn1.addEventListener('click', function () {
    if (selectedType) goToStep(2);
  });

  /* Step 2: Area input */
  var areaInput = document.getElementById('area-input');
  var areaMinus = document.getElementById('area-minus');
  var areaPlus = document.getElementById('area-plus');
  var presetBtns = wizard.querySelectorAll('.calc-preset-btn');
  var pricePreview = document.getElementById('price-preview');

  function clampArea(val) {
    return Math.max(AREA_MIN, Math.min(AREA_MAX, val));
  }

  function setArea(val) {
    area = clampArea(val);
    areaInput.value = area;
    updatePresetHighlight();
    updatePricePreview();
  }

  function updatePresetHighlight() {
    presetBtns.forEach(function (btn) {
      var btnArea = parseInt(btn.dataset.area, 10);
      btn.classList.toggle('active', btnArea === area);
    });
  }

  function updatePricePreview() {
    if (!selectedType) return;
    var cost = PRICING[selectedType] * area;
    pricePreview.textContent = cost.toLocaleString('pl-PL') + ' zł';
  }

  areaMinus.addEventListener('click', function () {
    setArea(area - AREA_STEP);
  });

  areaPlus.addEventListener('click', function () {
    setArea(area + AREA_STEP);
  });

  areaInput.addEventListener('input', function () {
    var val = parseInt(areaInput.value, 10);
    if (!isNaN(val)) {
      area = clampArea(val);
      updatePresetHighlight();
      updatePricePreview();
    }
  });

  areaInput.addEventListener('blur', function () {
    areaInput.value = area;
  });

  presetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setArea(parseInt(btn.dataset.area, 10));
    });
  });

  document.getElementById('calc-back-2').addEventListener('click', function () {
    goToStep(1);
  });
  document.getElementById('calc-next-2').addEventListener('click', function () {
    goToStep(3);
  });

  /* Step 3: Extras */
  var extraCards = wizard.querySelectorAll('.calc-extra-card');

  extraCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      card.classList.toggle('checked', checkbox.checked);

      /* Rebuild selected extras array */
      selectedExtras = [];
      extraCards.forEach(function (c) {
        if (c.querySelector('input').checked) {
          selectedExtras.push({
            name: c.dataset.extra,
            price: parseInt(c.dataset.price, 10)
          });
        }
      });
    });
  });

  document.getElementById('calc-back-3').addEventListener('click', function () {
    goToStep(2);
  });

  document.getElementById('calc-submit').addEventListener('click', function () {
    showResult();
  });

  /* Restart */
  document.getElementById('calc-restart').addEventListener('click', function () {
    resetCalculator();
  });

  /* Order button: pre-fill contact form service type */
  document.getElementById('result-order-btn').addEventListener('click', function () {
    var serviceSelect = document.getElementById('form-service');
    if (selectedType && serviceSelect) {
      serviceSelect.value = selectedType;
    }
  });


  /* ----- Calculator Navigation ----- */
  function goToStep(step) {
    currentStep = step;

    /* Update panels */
    panels.forEach(function (p) { p.classList.remove('active'); });
    var targetId = 'calc-step-' + step;
    var targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    /* Update progress indicators */
    progSteps.forEach(function (ps, i) {
      var stepNum = i + 1;
      ps.classList.remove('active', 'completed');
      if (stepNum === step) {
        ps.classList.add('active');
      } else if (stepNum < step) {
        ps.classList.add('completed');
      }
    });

    progLines.forEach(function (pl, i) {
      var lineAfterStep = i + 1;
      pl.classList.toggle('active', lineAfterStep < step);
    });

    /* Update price preview when entering step 2 */
    if (step === 2) {
      updatePricePreview();
    }
  }

  function showResult() {
    currentStep = 4;

    panels.forEach(function (p) { p.classList.remove('active'); });
    document.getElementById('calc-result').classList.add('active');

    /* Mark all progress steps completed */
    progSteps.forEach(function (ps) {
      ps.classList.remove('active');
      ps.classList.add('completed');
    });
    progLines.forEach(function (pl) { pl.classList.add('active'); });

    /* Calculate total */
    var baseCost = PRICING[selectedType] * area;
    var extrasTotal = selectedExtras.reduce(function (sum, e) { return sum + e.price; }, 0);
    var total = baseCost + extrasTotal;

    /* Animate the price counter */
    var priceEl = document.getElementById('result-price');
    animateCounter(priceEl, total);

    /* Set breakdown text */
    var breakdownParts = [TYPE_LABELS[selectedType], area + ' m²'];
    if (selectedExtras.length > 0) {
      breakdownParts.push(selectedExtras.length + ' ' + pluralize(selectedExtras.length, 'usługa dodatkowa', 'usługi dodatkowe', 'usług dodatkowych'));
    }
    document.getElementById('result-breakdown').textContent = breakdownParts.join(' · ');
  }

  function resetCalculator() {
    currentStep = 1;
    selectedType = null;
    area = 50;
    selectedExtras = [];

    /* Reset UI */
    typeCards.forEach(function (c) {
      c.classList.remove('selected');
      c.querySelector('input').checked = false;
    });
    nextBtn1.disabled = true;
    setArea(50);
    extraCards.forEach(function (c) {
      c.classList.remove('checked');
      c.querySelector('input').checked = false;
    });

    goToStep(1);
  }


  /* ----- Animated counter ----- */
  function animateCounter(element, target) {
    var duration = 800;
    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      /* Ease-out cubic */
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      element.textContent = current.toLocaleString('pl-PL');
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }


  /* ----- Polish pluralization helper ----- */
  function pluralize(count, one, few, many) {
    if (count === 1) return one;
    var mod10 = count % 10;
    var mod100 = count % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }


  /* ==========================================
     4. CONTACT FORM VALIDATION
     ========================================== */
  var contactForm = document.getElementById('contact-form');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateForm()) {
      showFormSuccess();
    }
  });

  function validateForm() {
    var isValid = true;

    /* Name: required, min 2 characters */
    var nameInput = document.getElementById('form-name');
    var nameGroup = document.getElementById('fg-name');
    if (nameInput.value.trim().length < 2) {
      nameGroup.classList.add('has-error');
      nameInput.classList.add('error');
      isValid = false;
    } else {
      nameGroup.classList.remove('has-error');
      nameInput.classList.remove('error');
    }

    /* Phone: required, Polish format */
    var phoneInput = document.getElementById('form-phone');
    var phoneGroup = document.getElementById('fg-phone');
    var phoneValue = phoneInput.value.replace(/[\s\-()]/g, '');
    var phoneRegex = /^(\+48)?\d{9}$/;
    if (!phoneRegex.test(phoneValue)) {
      phoneGroup.classList.add('has-error');
      phoneInput.classList.add('error');
      isValid = false;
    } else {
      phoneGroup.classList.remove('has-error');
      phoneInput.classList.remove('error');
    }

    /* Service: required */
    var serviceSelect = document.getElementById('form-service');
    var serviceGroup = document.getElementById('fg-service');
    if (!serviceSelect.value) {
      serviceGroup.classList.add('has-error');
      serviceSelect.classList.add('error');
      isValid = false;
    } else {
      serviceGroup.classList.remove('has-error');
      serviceSelect.classList.remove('error');
    }

    return isValid;
  }

  /* Clear errors on input */
  var formInputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
  formInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      var group = input.closest('.form-group');
      if (group) {
        group.classList.remove('has-error');
        input.classList.remove('error');
      }
    });
  });

  function showFormSuccess() {
    var formParent = contactForm.parentElement;

    contactForm.style.display = 'none';

    var successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML =
      '<div class="form-success-icon">' +
        '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
      '</div>' +
      '<h3>Dziękujemy za zgłoszenie!</h3>' +
      '<p>Oddzwonimy w ciągu 15 minut i ustalimy szczegóły.</p>';

    formParent.appendChild(successDiv);

    /* Reset form after 6 seconds (for demo/portfolio) */
    setTimeout(function () {
      formParent.removeChild(successDiv);
      contactForm.style.display = '';
      contactForm.reset();
      /* Clear all error states */
      contactForm.querySelectorAll('.form-group').forEach(function (g) {
        g.classList.remove('has-error');
      });
      contactForm.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });
    }, 6000);
  }


  /* ==========================================
     5. SCROLL ANIMATIONS (IntersectionObserver)
     ========================================== */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      /* Fallback: just show everything */
      document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '-40px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollAnimations();


  /* ==========================================
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();

        /* Close mobile menu if open */
        closeMenu();

        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        /* Update URL hash without jumping */
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      }
    });
  });

})();
