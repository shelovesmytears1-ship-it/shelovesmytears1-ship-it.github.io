const scenarios = {
  release: {
    code: 'REL / 02',
    confidence: 'PEWNOŚĆ: ŚREDNIA',
    value: '64%',
    title: 'Retencja wersji B utrzymuje się po 72 h.',
    evidence: [
      ['yes', '2 źródła pokazują ten sam kierunek'],
      ['yes', 'grupa testowa ma porównywalny rozmiar'],
      ['no', 'brakuje sygnału organicznego po 7 dniach']
    ],
    action: 'Puść narrację B jeszcze raz — bez zwiększania budżetu.',
    text: 'Ten test rozdzieli efekt kreacji od efektu wydatku i można go zatrzymać po 72 godzinach.',
    steps: [['TERAZ', 'wyrównaj grupę i budżet'], ['PO 72 H', 'porównaj powroty'], ['DECYZJA', 'skaluj tylko po utrzymaniu retencji']]
  },
  tour: {
    code: 'TOUR / 01',
    confidence: 'PEWNOŚĆ: WYSOKA',
    value: '81%',
    title: 'Poznań łączy powroty, zapisy i rosnącą listę.',
    evidence: [
      ['yes', '3 świeże źródła są zgodne'],
      ['yes', 'lista oczekujących przekroczyła próg testu'],
      ['no', 'brakuje porównania z drugim terminem']
    ],
    action: 'Sprawdź format 150 miejsc przed rezerwacją większej sali.',
    text: 'Mały format weryfikuje intencję zakupu bez długiego zobowiązania produkcyjnego.',
    steps: [['TERAZ', 'otwórz dwa terminy'], ['PO 7 DNIACH', 'porównaj depozyty'], ['DECYZJA', 'rezerwuj po przekroczeniu progu']]
  },
  community: {
    code: 'COM / 03',
    confidence: 'PEWNOŚĆ: ŚREDNIA',
    value: '58%',
    title: '186 osób wraca regularnie mimo mniejszego zasięgu.',
    evidence: [
      ['yes', 'powrót w trzech kolejnych materiałach'],
      ['yes', 'zapisy na zamkniętą sesję Q&A'],
      ['no', 'nie znamy retencji po spotkaniu']
    ],
    action: 'Zaproś grupę do małego formatu zamiast kupować zasięg.',
    text: 'Sesja pozwoli sprawdzić jakość relacji i temat kolejnego materiału bez rozszerzania kampanii.',
    steps: [['TERAZ', 'wyślij 186 zaproszeń'], ['PO SESJI', 'zmierz powrót i pytania'], ['DECYZJA', 'powtórz tylko przy retencji']]
  }
};

const tabs = [...document.querySelectorAll('[data-mode]')];
const nodes = {
  code: document.querySelector('#evidenceCode'),
  confidence: document.querySelector('#confidence'),
  title: document.querySelector('#evidenceTitle'),
  evidence: document.querySelector('#evidenceList'),
  scale: document.querySelector('.confidence-scale span'),
  action: document.querySelector('#actionTitle'),
  text: document.querySelector('#actionText'),
  steps: document.querySelector('#actionList')
};

let activeMode = 'release';

function renderScenario(mode) {
  const data = scenarios[mode];
  activeMode = mode;
  tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.mode === mode)));
  nodes.code.textContent = data.code;
  nodes.confidence.textContent = data.confidence;
  nodes.title.textContent = data.title;
  nodes.evidence.innerHTML = data.evidence.map(([state, text]) => `<li><i class="${state}"></i>${text}</li>`).join('');
  nodes.scale.style.setProperty('--confidence', data.value);
  nodes.scale.parentElement.setAttribute('aria-label', `Pewność ${parseInt(data.value, 10)} na 100`);
  nodes.action.textContent = data.action;
  nodes.text.textContent = data.text;
  nodes.steps.innerHTML = data.steps.map(([when, step]) => `<li><b>${when}</b>${step}</li>`).join('');
}

tabs.forEach((tab) => tab.addEventListener('click', () => renderScenario(tab.dataset.mode)));

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

document.querySelector('#copyAction').addEventListener('click', async () => {
  const data = scenarios[activeMode];
  const brief = `${data.code}\n${data.action}\n${data.text}\n${data.steps.map(([when, step]) => `${when}: ${step}`).join('\n')}`;
  try {
    await navigator.clipboard.writeText(brief);
    showToast('Brief decyzji skopiowany.');
  } catch {
    showToast('Przeglądarka zablokowała schowek. Zaznacz treść ręcznie.');
  }
});

document.querySelector('#disconnectDemo').addEventListener('click', (event) => {
  event.currentTarget.disabled = true;
  event.currentTarget.textContent = 'Źródło odłączone';
  document.querySelector('#disconnectStatus').textContent = 'Symulacja: dostęp do Ticketing usunięty. Historyczne dane pozostają oznaczone jako nieaktywne.';
});

document.querySelector('#demoForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const fields = [...form.querySelectorAll('[required]')];
  fields.forEach((field) => field.classList.toggle('field-error', !field.validity.valid));
  const status = document.querySelector('#formStatus');
  if (!form.checkValidity()) {
    status.textContent = 'Uzupełnij trzy pola — wtedy przygotujemy lokalny scenariusz.';
    fields.find((field) => !field.validity.valid)?.focus();
    return;
  }
  status.textContent = 'Scenariusz gotowy lokalnie. Nic nie zostało wysłane.';
  showToast('Lokalne demo przygotowane.');
});

renderScenario('release');
