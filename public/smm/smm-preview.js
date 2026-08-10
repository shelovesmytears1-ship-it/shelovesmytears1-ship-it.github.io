const cueData = [
  ['Premisa przed formatem', 'Najpierw zapisz, co ma zmienić się w głowie odbiorcy. Dopiero potem wybierz rolkę, karuzelę albo post.'],
  ['Format jest zmienną', 'Ten sam pomysł można przetestować w kilku nośnikach. Nie myl opakowania z hipotezą.'],
  ['Sygnał wymaga kontekstu', 'Jedna liczba bez jakości reakcji i punktu odniesienia nie prowadzi do rozsądnej decyzji.']
];

document.querySelectorAll('[data-cue]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-cue]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('on', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    const cue = cueData[Number(button.dataset.cue)];
    document.querySelector('#cueTitle').textContent = cue[0];
    document.querySelector('#cueText').textContent = cue[1];
  });
});

const plans = {
  attention: {
    title: 'Test zatrzymania na konkretnym problemie.',
    hypothesis: 'Jeśli zaczniemy od rozpoznawalnego napięcia, właściwi odbiorcy częściej zatrzymają materiał.',
    signal: 'utrzymanie uwagi w pierwszej części materiału'
  },
  intent: {
    title: 'Test przejścia od treści do następnego kroku.',
    hypothesis: 'Jeśli pokażemy decyzję i jej koszt, odbiorcy z intencją częściej sprawdzą ofertę lub profil.',
    signal: 'jakościowe przejścia do profilu lub strony'
  },
  trust: {
    title: 'Test materiału, do którego warto wrócić.',
    hypothesis: 'Jeśli zamkniemy użyteczny proces w jednym materiale, odbiorcy częściej zapiszą go i wrócą.',
    signal: 'zapisy, powroty i pytania pogłębiające'
  }
};

const formats = {
  instagram: '3 krótkie wideo · 2 karuzele · 1 post odpowiedzi',
  tiktok: '5 krótkich wideo · 2 warianty otwarcia · 1 odpowiedź wideo',
  linkedin: '3 posty analityczne · 1 dokument · 2 odpowiedzi eksperckie'
};

let currentText = '';
document.querySelector('#testForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const plan = plans[data.get('goal')];
  const format = formats[data.get('channel')];
  const card = document.querySelector('#testCard');
  card.querySelector('h3').textContent = plan.title;
  const values = card.querySelectorAll('dd');
  values[0].textContent = plan.hypothesis;
  values[1].textContent = format;
  values[2].textContent = plan.signal;
  values[3].textContent = 'skaluj premisę, zmień wykonanie albo zamknij test';
  currentText = `SMM Vanguard — karta testu (symulacja)\n${plan.title}\nHipoteza: ${plan.hypothesis}\nFormaty: ${format}\nSygnał: ${plan.signal}\nDecyzja, dzień 14: skaluj / iteruj / stop`;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelector('#copyCard').addEventListener('click', async () => {
  if (!currentText) document.querySelector('#testForm').requestSubmit();
  const text = currentText || 'Wygeneruj kartę i spróbuj ponownie.';
  try {
    await navigator.clipboard.writeText(text);
    showToast('Karta skopiowana.');
  } catch {
    showToast('Nie udało się skopiować. Zaznacz treść ręcznie.');
  }
});

// The three review days are stacked in one cell, so the log sheet reserves its
// longest entry once and switching day never moves the section below it.
const logButtons = [...document.querySelectorAll('[data-day]')];
const logEntries = [...document.querySelectorAll('.log-entry')];

logButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    logButtons.forEach((item, n) => {
      item.classList.toggle('active', n === index);
      item.setAttribute('aria-pressed', String(n === index));
    });
    logEntries.forEach((entry, n) => entry.classList.toggle('is-active', n === index));
  });
});

document.querySelectorAll('.curr-list button').forEach((button) => {
  button.addEventListener('click', () => {
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.curr-list button').forEach((item) => {
      item.setAttribute('aria-expanded', 'false');
      item.nextElementSibling.hidden = true;
    });
    if (!wasOpen) {
      button.setAttribute('aria-expanded', 'true');
      button.nextElementSibling.hidden = false;
    }
  });
});

const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('#siteNav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  siteNav.dataset.open = String(open);
});
siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  siteNav.dataset.open = 'false';
}));

document.querySelector('#applyForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#applyStatus').textContent = 'Szkic zgłoszenia gotowy lokalnie. W tej wersji nic nie zostało wysłane.';
});

function showToast(text) {
  const toast = document.querySelector('#toast');
  toast.textContent = text;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2400);
}
const signalCells = [...document.querySelectorAll('.timecode span')];
document.querySelectorAll('[data-cue]').forEach((button) => button.addEventListener('click', () => {
  signalCells.forEach((cell, index) => cell.classList.toggle('is-active', index === Number(button.dataset.cue)));
}));
signalCells[0]?.classList.add('is-active');
