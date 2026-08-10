const rituals = {
  soft: ['Dotyk Ukojenia', 'Płynny, delikatny rytm i spokojne tempo. Bez rozmowy poza krótkim ustaleniem komfortu.'],
  medium: ['Równowaga', 'Średnia intensywność i spokojny rytm z większą uwagą dla wybranych obszarów.'],
  deep: ['Głębszy Rytm', 'Wyraźniejszy ucisk w granicach komfortu. Usługa pozostaje relaksacyjna, nie terapeutyczna.']
};

let ritualCopy = 'Dotyk Ukojenia, 60 min, w ciszy, 260 zł';
const ritualForm = document.querySelector('#ritualForm');
ritualForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const ritual = rituals[data.get('pressure')];
  const duration = data.get('duration');
  const mood = data.get('mood') === 'quiet' ? 'w ciszy' : 'ze spokojną muzyką';
  const price = duration === '90' ? '340 zł' : '260 zł';
  document.querySelector('#ritualTitle').textContent = `${ritual[0]} · ${duration} min`;
  document.querySelector('#ritualText').textContent = `${ritual[1]} Atmosfera: ${mood}.`;
  document.querySelector('#ritualPrice').textContent = `${price} · portfolio demo`;
  ritualCopy = `${ritual[0]}, ${duration} min, ${mood}, ${price}`;
});

document.querySelector('#copyRitual').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(`Touché — karta demo\n${ritualCopy}`);
    button.textContent = 'Karta skopiowana';
  } catch {
    button.textContent = 'Kopiowanie niedostępne';
  }
  window.setTimeout(() => { button.textContent = 'Kopiuj kartę'; }, 2200);
});

const spaceInputs = document.querySelectorAll('#spaceForm input');
spaceInputs.forEach((input) => input.addEventListener('change', () => {
  const ready = [...spaceInputs].filter((item) => item.checked).length;
  document.querySelector('#spaceStatus').textContent = ready === 4
    ? 'Przestrzeń gotowa. Zostało potwierdzenie adresu i terminu.'
    : `Przestrzeń: ${ready} z 4 punktów gotowe.`;
}));

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

document.querySelector('#bookingForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#status').textContent = 'Zapytanie przygotowane lokalnie. Termin nie został zarezerwowany.';
});
