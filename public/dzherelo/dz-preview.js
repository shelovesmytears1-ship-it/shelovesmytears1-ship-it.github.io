// Titles, notes, photos and origins all live in the DOM as stacked states, so a
// tea change only moves .is-active and the session keeps its geometry. The late
// steep sentence stays in flow (hidden, not removed) for the same reason.
const teas = [
  { key: 'puer', temp: '90', time: '8' },
  { key: 'rock', temp: '95', time: '10' },
  { key: 'white', temp: '85', time: '12' },
  { key: 'red', temp: '90', time: '9' }
];

let current = 0;
const steep = document.querySelector('#steep');
const teaNote = document.querySelector('#teaNote');
const teaLayers = [
  [...document.querySelectorAll('.tea-frame')],
  [...document.querySelectorAll('#teaTitle span')],
  [...teaNote.children],
  [...document.querySelectorAll('#teaOrigin span')]
];

function render() {
  const tea = teas[current];
  const infusion = Number(steep.value);
  teaLayers.forEach((layer) => layer.forEach((el, n) => el.classList.toggle('is-active', n === current)));
  teaNote.classList.toggle('late', infusion > 2);
  document.querySelector('#temp').textContent = `${tea.temp}°C`;
  document.querySelector('#time').textContent = `${Number(tea.time) + (infusion - 1) * 3} с`;
  document.querySelector('#steepCount').textContent = `ПРОЛИВ 0${infusion} / 05`;
}

document.querySelectorAll('[data-tea]').forEach((button, index) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-tea]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    current = index;
    render();
  });
});

steep.addEventListener('input', render);

const menuButton = document.querySelector('[data-menu]');
const menu = document.querySelector('[data-nav]');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu.dataset.open = String(!open);
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menu.dataset.open = 'false';
  }));
}

document.querySelector('#requestForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#status').textContent = 'Запит підготовлено локально. Дані не надіслано.';
});
