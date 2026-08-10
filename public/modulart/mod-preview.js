const definitions = { living: ['LIVING', 32], night: ['NIGHT', 28], work: ['WORK', 14] };
let modules = ['living', 'night'];
const moduleStatus = document.querySelector('#moduleStatus');

function draw(message = '') {
  const box = document.querySelector('#modules');
  box.innerHTML = modules.map((module, index) => `<button type="button" data-remove-index="${index}" aria-label="Usuń moduł ${definitions[module][0]}"><span>${definitions[module][0]}</span><b>${definitions[module][1]} m²</b><small>usuń</small></button>`).join('');
  box.querySelectorAll('[data-remove-index]').forEach((button) => button.addEventListener('click', () => {
    if (modules.length === 1) { moduleStatus.textContent = 'Układ musi zawierać co najmniej jeden moduł.'; return; }
    modules.splice(Number(button.dataset.removeIndex), 1);
    draw('Moduł usunięty.');
  }));
  const area = modules.reduce((sum, module) => sum + definitions[module][1], 0);
  const low = Math.round(area * 9);
  const high = Math.round(area * 11.5);
  document.querySelector('#count').textContent = String(modules.length).padStart(2, '0');
  document.querySelector('#area').textContent = `${area} m²`;
  document.querySelector('#people').textContent = area < 45 ? '1–2 osoby' : area < 75 ? '2–4 osoby' : '3–5 osób';
  document.querySelector('#price').textContent = `${low}–${high} tys. zł`;
  document.querySelectorAll('[data-module]').forEach((button) => { button.disabled = modules.length >= 5; });
  moduleStatus.textContent = message || `Układ zawiera ${modules.length} moduły.`;
}

document.querySelectorAll('[data-module]').forEach((button) => button.addEventListener('click', () => {
  if (modules.length >= 5) { moduleStatus.textContent = 'Maksymalnie pięć modułów w demonstracji.'; return; }
  modules.push(button.dataset.module);
  draw('Moduł dodany do układu.');
}));
document.querySelector('#reset').addEventListener('click', () => { modules = ['living']; draw('Układ wyczyszczony do jednego modułu.'); });
document.querySelector('#readyForm').addEventListener('change', (event) => {
  const checked = event.currentTarget.querySelectorAll('input:checked').length;
  document.querySelector('#readyStatus').textContent = `${checked}/4 punktów gotowości. ${checked === 4 ? 'Można rozpocząć realne harmonogramowanie.' : 'Termin wymaga domknięcia danych wejściowych.'}`;
});
const menuButton = document.querySelector('[data-menu]');
const menu = document.querySelector('[data-nav]');
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!open)); menu.dataset.open = String(!open); });
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'false'); menu.dataset.open = 'false'; }));
document.querySelector('#contactForm').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#status').textContent = 'Zakres rozmowy przygotowany lokalnie. Dane nie zostały wysłane.'; });
draw();
