const verdicts = {
  attention: {
    id: 'F-01',
    title: 'Перевірити відповідність реклами першому екрану',
    copy: 'Порівняйте обіцянку в оголошенні з першою дією воронки. Розрив часто виникає ще до бота: людина приходить по одному, а бачить інше.',
    check: 'креативи · офер · перший екран · джерела',
    progress: '10%'
  },
  promise: {
    id: 'F-02',
    title: 'Перевірити ціну першої дії для людини',
    copy: 'Якщо перший крок просить забагато даних або не пояснює наступний результат, інтерес закінчується до розмови.',
    check: 'перший CTA · очікування · форма · мобільний шлях',
    progress: '38%'
  },
  dialogue: {
    id: 'F-03',
    title: 'Розібрати розмову по повідомленнях',
    copy: 'Однакова серія для всіх стирає контекст. Потрібно побачити, де питання, темп або тон перестають відповідати наміру людини.',
    check: 'гілки · питання · паузи · причини виходу',
    progress: '67%'
  },
  handoff: {
    id: 'F-04',
    title: 'Перевірити передачу контексту в продаж',
    copy: 'Заявка може бути якісною, але менеджер починає розмову з нуля. Перевірте, які відповіді та очікування доходять у CRM і хто реагує.',
    check: 'поля CRM · SLA · власник · перша відповідь',
    progress: '92%'
  }
};

const nodes = [...document.querySelectorAll('[data-node]')];
const progress = document.querySelector('[data-route-progress]');
const idNode = document.querySelector('[data-verdict-id]');
const titleNode = document.querySelector('[data-verdict-title]');
const copyNode = document.querySelector('[data-verdict-copy]');
const checkNode = document.querySelector('[data-verdict-check]');

function setVerdict(key) {
  const verdict = verdicts[key];
  nodes.forEach((node) => node.classList.toggle('is-active', node.dataset.node === key));
  progress.style.width = verdict.progress;
  progress.style.height = verdict.progress;
  idNode.textContent = verdict.id;
  titleNode.textContent = verdict.title;
  copyNode.textContent = verdict.copy;
  checkNode.textContent = verdict.check;
}

nodes.forEach((node) => node.addEventListener('click', () => {
  document.querySelector(`input[name="symptom"][value="${node.dataset.node}"]`).checked = true;
  setVerdict(node.dataset.node);
}));

document.querySelector('[data-diagnostic-form]').addEventListener('change', (event) => {
  if (event.target.name === 'symptom') setVerdict(event.target.value);
});

const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const form = document.querySelector('[data-form]');
const message = document.querySelector('[data-form-message]');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  message.className = 'form-message';
  const missing = [...form.querySelectorAll('[required]')].find((field) => !field.value.trim());
  if (missing) {
    missing.setAttribute('aria-invalid', 'true');
    message.classList.add('error');
    message.textContent = 'Заповніть ім’я та контакт, щоб завершити демо.';
    missing.focus();
    return;
  }
  [...form.querySelectorAll('[aria-invalid]')].forEach((field) => field.removeAttribute('aria-invalid'));
  message.classList.add('success');
  message.textContent = 'Демо завершено — дані не надсилалися і не зберігалися.';
  form.reset();
});

setVerdict('attention');
