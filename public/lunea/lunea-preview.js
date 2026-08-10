// Every state already exists in the DOM, stacked in one cell; switching only
// moves the .is-active flag, so the stage keeps its geometry between times.
const dayTabs = [...document.querySelectorAll('[data-day]')];
const dayLayers = [
  [...document.querySelectorAll('.day-frame')],
  [...document.querySelectorAll('.day-panel')],
  [...document.querySelectorAll('#dayCaption span')]
];

dayTabs.forEach((button, index) => {
  button.addEventListener('click', () => {
    dayTabs.forEach((item, n) => item.setAttribute('aria-pressed', String(n === index)));
    dayLayers.forEach((layer) => layer.forEach((el, n) => el.classList.toggle('is-active', n === index)));
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

document.querySelector('#briefForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  document.querySelector('#status').textContent = `Brief gotowy: ${data.get('date')}, ${data.get('guests')} gości, budżet ${data.get('budget')}. To demonstracja; dane nie zostały wysłane.`;
});
