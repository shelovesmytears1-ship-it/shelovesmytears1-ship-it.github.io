const samples = {
  decision: {
    type: 'Decision', time: 'Source 00:37', owner: 'Maya', output: 'Backlog draft',
    title: 'Simplify onboarding: show one useful example before configuration',
    note: 'Suggested from one sentence. Review surrounding context before confirming.'
  },
  commitment: {
    type: 'Commitment', time: 'Source 01:18', owner: 'Jon', output: 'Backlog draft',
    title: 'Rewrite the first-run template by Thursday',
    note: 'The dependency on research content is part of the source and should remain in the task context.'
  },
  question: {
    type: 'Open question', time: 'Source 02:41', owner: 'Unassigned', output: 'Research question',
    title: 'Is dashboard complexity or missing example content causing the drop-off?',
    note: 'This is a question, not a decision. Confirming it should create research work, not a product commitment.'
  }
};

const state = { active: 'decision', confirmed: 1 };
const lines = [...document.querySelectorAll('[data-line]')];
const typeNode = document.querySelector('[data-editor-type]');
const timeNode = document.querySelector('[data-editor-time]');
const titleNode = document.querySelector('[data-editor-title]');
const ownerNode = document.querySelector('[data-owner]');
const outputNode = document.querySelector('[data-output]');
const sourceNote = document.querySelector('[data-source-note]');
const list = document.querySelector('[data-confirmed-list]');
const count = document.querySelector('[data-count]');
const empty = document.querySelector('[data-empty]');

function loadSample(key) {
  state.active = key;
  const sample = samples[key];
  lines.forEach(line => {
    const active = line.dataset.line === key;
    line.classList.toggle('is-active', active);
    line.setAttribute('aria-pressed', String(active));
    const mark = line.querySelector('.mark');
    mark.classList.toggle('mark-decision', active);
  });
  typeNode.textContent = sample.type;
  timeNode.textContent = sample.time;
  titleNode.value = sample.title;
  ownerNode.value = sample.owner;
  outputNode.value = sample.output;
  sourceNote.textContent = sample.note;
}

lines.forEach(line => line.addEventListener('click', () => loadSample(line.dataset.line)));

function updateCount() {
  state.confirmed = list.children.length;
  count.textContent = `${state.confirmed} ${state.confirmed === 1 ? 'item' : 'items'}`;
  empty.hidden = state.confirmed !== 0;
}

document.querySelector('[data-confirm]').addEventListener('click', event => {
  const confirmButton = event.currentTarget;
  const title = titleNode.value.trim();
  if (!title) {
    titleNode.setAttribute('aria-invalid', 'true');
    sourceNote.textContent = 'Add a clear title before confirming this item.';
    titleNode.focus();
    return;
  }
  titleNode.removeAttribute('aria-invalid');
  const sample = samples[state.active];
  const duplicate = [...list.querySelectorAll('strong')].some(node => node.textContent === title);
  if (duplicate) {
    sourceNote.textContent = 'This exact item is already in the confirmed rail. Edit the title or choose another source line.';
    return;
  }
  const article = document.createElement('article');
  article.className = 'confirmed-slip is-new';
  const meta = document.createElement('span');
  meta.textContent = `${sample.type} · ${sample.time.toLowerCase()}`;
  const strong = document.createElement('strong');
  strong.textContent = title;
  const small = document.createElement('small');
  small.textContent = `Owner: ${ownerNode.value} · ${outputNode.value}`;
  article.append(meta, strong, small);
  list.prepend(article);
  updateCount();
  sourceNote.textContent = 'Confirmed locally. The item kept its source type and timestamp.';
  confirmButton.textContent = 'Confirmed';
  confirmButton.disabled = true;
  window.setTimeout(() => {
    if (!confirmButton.isConnected) return;
    confirmButton.textContent = 'Confirm item';
    confirmButton.disabled = false;
  }, 1000);
});

document.querySelector('[data-reject]').addEventListener('click', () => {
  const key = state.active;
  sourceNote.textContent = `Suggestion rejected. The ${samples[key].time.toLowerCase()} source line stays in the transcript.`;
  titleNode.value = '';
  titleNode.focus();
});

const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
menu.addEventListener('click', event => {
  if (event.target.closest('a')) {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

const form = document.querySelector('[data-form]');
const formMessage = document.querySelector('[data-form-message]');
form.addEventListener('submit', event => {
  event.preventDefault();
  const email = form.elements.email;
  formMessage.className = 'form-message';
  if (!email.validity.valid) {
    email.setAttribute('aria-invalid', 'true');
    formMessage.classList.add('is-error');
    formMessage.textContent = 'Enter a complete email address, for example you@team.com.';
    email.focus();
    return;
  }
  email.removeAttribute('aria-invalid');
  formMessage.classList.add('is-success');
  formMessage.textContent = 'Demo complete — nothing was sent or stored.';
  form.reset();
});

updateCount();

const exportButton = document.querySelector('[data-copy-export]');
const exportStatus = document.querySelector('[data-export-status]');
exportButton?.addEventListener('click', async () => {
  const reviewedItem = 'Build example-first onboarding\nOwner: Maya\nSource: Onboarding review · 00:37';
  try {
    await navigator.clipboard.writeText(reviewedItem);
    exportStatus.textContent = 'Reviewed item copied with its source.';
  } catch {
    exportStatus.textContent = 'Clipboard blocked. Select the reviewed fields manually.';
  }
});
