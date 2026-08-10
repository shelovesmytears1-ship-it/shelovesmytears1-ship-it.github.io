// All four views sit in the DOM stacked in one cell, so switching study only
// moves .is-active — the lab reserves its tallest state once and never jumps.
const viewButtons = [...document.querySelectorAll('[data-view]')];
const viewLayers = [
  [...document.querySelectorAll('.lab-frame')],
  [...document.querySelectorAll('#viewCode > span')],
  [...document.querySelectorAll('#viewTitle > span')],
  [...document.querySelectorAll('#viewText > span')],
  [...document.querySelectorAll('#viewDecision > span')]
];

viewButtons.forEach((button, index) => button.addEventListener('click', () => {
  viewButtons.forEach((item, n) => item.setAttribute('aria-selected', String(n === index)));
  viewLayers.forEach((layer) => layer.forEach((el, n) => el.classList.toggle('is-active', n === index)));
}));

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#mainNav');
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
});
navigation.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
});

document.querySelector('#contactForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#status');
  if (!form.checkValidity()) {
    status.textContent = 'Complete the project type, location and working budget to prepare the note.';
    form.querySelector(':invalid')?.focus();
    return;
  }
  status.textContent = 'Project note prepared locally. Nothing has been sent.';
});
