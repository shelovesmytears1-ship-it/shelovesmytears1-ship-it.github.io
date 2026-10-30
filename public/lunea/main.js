/*
  LUNEA Atelier — Interactive main.js
  Handles timeline switching, brief selection, and copy-to-clipboard according to INTERACTION_CONTRACT.md
*/

document.addEventListener('DOMContentLoaded', () => {
  // Timeline Data per COPY_PL.md
  const momentsData = {
    'moment-preparations': {
      time: '09:30',
      label: 'Przygotowania',
      caption: 'Spokojny początek dnia i czas na przygotowania.',
      imageWebp: 'assets/moment-preparations.webp',
      imageJpg: 'assets/moment-preparations.jpg'
    },
    'moment-ceremony': {
      time: '13:00',
      label: 'Ceremonia',
      caption: 'Ceremonia, wokół której układa się reszta dnia.',
      imageWebp: 'assets/moment-ceremony.webp',
      imageJpg: 'assets/moment-ceremony.jpg'
    },
    'moment-guests': {
      time: '15:00',
      label: 'Spotkanie gości',
      caption: 'Pierwsze spotkania i powitanie gości.',
      imageWebp: 'assets/moment-guests.webp',
      imageJpg: 'assets/moment-guests.jpg'
    },
    'moment-dinner': {
      time: '18:00',
      label: 'Kolacja',
      caption: 'Wspólny stół i rozmowy bez pośpiechu.',
      imageWebp: 'assets/moment-dinner.webp',
      imageJpg: 'assets/moment-dinner.jpg'
    },
    'moment-toasts-dance': {
      time: '20:30',
      label: 'Toasty i taniec',
      caption: 'Kilka słów, muzyka i początek tańca.',
      imageWebp: 'assets/moment-toasts-dance.webp',
      imageJpg: 'assets/moment-toasts-dance.jpg'
    },
    'moment-late-evening': {
      time: '22:30',
      label: 'Późny wieczór',
      caption: 'Ostatnie rozmowy i miękkie światło.',
      imageWebp: 'assets/moment-late-evening.webp',
      imageJpg: 'assets/moment-late-evening.jpg'
    }
  };

  let currentMomentId = 'moment-preparations';

  // State for brief
  const briefState = {
    date: '',
    noDate: false,
    guests: '',
    budget: '',
    isDirty: false,
    isGenerated: false,
    isCopied: false
  };

  // DOM Elements
  const timelineButtons = document.querySelectorAll('.timeline-btn');
  const imageContainer = document.getElementById('timelineImageContainer');
  const activeImage = document.getElementById('activeMomentImage');
  const activeSourceWebp = document.getElementById('activeSourceWebp');
  const activeSourceJpg = document.getElementById('activeSourceJpg');
  const timeBadge = document.getElementById('momentTimeBadge');
  const headingEl = document.getElementById('momentHeading');
  const captionEl = document.getElementById('momentCaption');
  const liveMomentDisplay = document.getElementById('summaryMomentVal');

  // Form Elements
  const dateInput = document.getElementById('weddingDate');
  const noDateCheckbox = document.getElementById('noDateCheckbox');
  const guestChips = document.querySelectorAll('#guestsChips .chip');
  const budgetChips = document.querySelectorAll('#budgetChips .chip');
  const generateBtn = document.getElementById('generateBriefBtn');
  const copyBtn = document.getElementById('copyBriefBtn');
  const summaryStatus = document.getElementById('summaryStatus');
  
  const sumDate = document.getElementById('sumDate');
  const sumGuests = document.getElementById('sumGuests');
  const sumBudget = document.getElementById('sumBudget');
  const sumMoment = document.getElementById('sumMoment') || document.getElementById('summaryMomentVal');
  const summaryTextarea = document.getElementById('summaryTextarea');

  // Timeline switching function
  function selectMoment(momentId) {
    if (!momentsData[momentId]) return;
    currentMomentId = momentId;
    const data = momentsData[momentId];

    // Update buttons state
    timelineButtons.forEach(btn => {
      const isSelected = btn.getAttribute('data-moment') === momentId;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    // Loading transition state per contract
    imageContainer.classList.add('loading');

    // Preload image
    const img = new Image();
    img.src = data.imageWebp;
    img.onload = () => {
      if (activeSourceWebp) activeSourceWebp.srcset = data.imageWebp;
      if (activeSourceJpg) activeSourceJpg.srcset = data.imageJpg;
      if (activeImage) {
        activeImage.src = data.imageWebp;
        activeImage.alt = `${data.time} ${data.label}`;
      }
      imageContainer.classList.remove('loading');
    };
    img.onerror = () => {
      // Fallback per contract
      activeImage.alt = 'Nie udało się wczytać kadru tego momentu.';
      imageContainer.classList.remove('loading');
    };

    // Update content pane
    timeBadge.textContent = data.time;
    headingEl.textContent = data.label;
    captionEl.textContent = data.caption;

    // Update Live Summary value if summary exists
    if (liveMomentDisplay) {
      liveMomentDisplay.textContent = `${data.time} · ${data.label}`;
    }

    markBriefDirty();
  }

  // Attach timeline button listeners
  timelineButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-moment');
      selectMoment(id);
    });
  });

  // Brief Form Listeners
  if (dateInput && noDateCheckbox) {
    dateInput.addEventListener('input', () => {
      if (dateInput.value) {
        noDateCheckbox.checked = false;
        briefState.noDate = false;
      }
      briefState.date = dateInput.value;
      markBriefDirty();
    });

    noDateCheckbox.addEventListener('change', () => {
      if (noDateCheckbox.checked) {
        dateInput.value = '';
        briefState.date = '';
        briefState.noDate = true;
      } else {
        briefState.noDate = false;
      }
      markBriefDirty();
    });
  }

  guestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      guestChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      briefState.guests = chip.getAttribute('data-value');
      markBriefDirty();
    });
  });

  budgetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      budgetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      briefState.budget = chip.getAttribute('data-value');
      markBriefDirty();
    });
  });

  function markBriefDirty() {
    if (briefState.isGenerated) {
      briefState.isDirty = true;
      summaryStatus.textContent = 'Zmieniono odpowiedzi. Odśwież podsumowanie przed kopiowaniem.';
      summaryStatus.className = 'summary-status dirty';
      copyBtn.textContent = 'Odśwież podsumowanie';
    }
  }

  // Generate / Refresh Brief
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      // Validate
      const formGroupDate = document.getElementById('formGroupDate');
      let isValid = true;

      if (!briefState.date && !briefState.noDate) {
        formGroupDate.classList.add('has-error');
        isValid = false;
        dateInput.focus();
      } else {
        formGroupDate.classList.remove('has-error');
      }

      if (!isValid) return;

      // Populate Summary Card
      sumDate.textContent = briefState.noDate ? 'Jeszcze nie wiem' : briefState.date;
      sumGuests.textContent = briefState.guests || 'Nie wybrano';
      sumBudget.textContent = briefState.budget || 'Nie wybrano';
      
      const currentMoment = momentsData[currentMomentId];
      sumMoment.textContent = `${currentMoment.time} — ${currentMoment.label}`;

      // Build textarea content
      const summaryText = [
        'LUNEA — LOKALNY BRIEF KONCEPCJI DNIA',
        `Data ślubu: ${briefState.noDate ? 'Jeszcze nie wiem' : briefState.date}`,
        `Szacowana liczba gości: ${briefState.guests || 'Nie wybrano'}`,
        `Orientacyjny budżet: ${briefState.budget || 'Nie wybrano'}`,
        `Wybrany moment: ${currentMoment.time} — ${currentMoment.label}`,
        '---',
        'Podsumowanie wygenerowane lokalnie.'
      ].join('\n');

      summaryTextarea.value = summaryText;

      briefState.isGenerated = true;
      briefState.isDirty = false;
      summaryStatus.textContent = 'Niezapisane. Nie wysłano.';
      summaryStatus.className = 'summary-status';
      copyBtn.textContent = 'Kopiuj do schowka';

      // Scroll to summary on mobile if needed
    });
  }

  // Copy Brief Button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!briefState.isGenerated || briefState.isDirty) {
        // If not generated or dirty, trigger generate first
        generateBtn.click();
        return;
      }

      const textToCopy = summaryTextarea.value;
      navigator.clipboard.writeText(textToCopy).then(() => {
        summaryStatus.textContent = 'Skopiowano. Brief nadal nie został wysłany.';
        summaryStatus.className = 'summary-status copied';
        copyBtn.textContent = 'Skopiowano pomyślnie ✓';
        setTimeout(() => {
          copyBtn.textContent = 'Kopiuj do schowka';
        }, 3000);
      }).catch(() => {
        // Fallback per contract
        summaryTextarea.select();
        summaryStatus.textContent = 'Nie udało się skopiować. Zaznacz tekst w polu poniżej i skopiuj go ręcznie.';
        summaryStatus.className = 'summary-status dirty';
      });
    });
  }
});
