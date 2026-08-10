const rates = { base: 3300, plus: 4400, custom: 5900 };
let summary = '';

function estimate() {
  const area = Number(document.querySelector('#area').value);
  const level = new FormData(document.querySelector('#estimateForm')).get('level');
  const baths = Number(document.querySelector('#baths').value);
  const base = area * rates[level] + (baths - 1) * 28000;
  const low = Math.round(base * .9 / 1000);
  const high = Math.round(base * 1.12 / 1000);
  const names = { base: 'funkcjonalny', plus: 'rozszerzony', custom: 'indywidualny' };
  const bathLabel = baths === 1 ? '1 łazienka' : `${baths} łazienki`;
  document.querySelector('#areaOut').textContent = `${area} m²`;
  document.querySelector('#range').textContent = `${low}–${high} tys. zł`;
  summary = `${area} m², standard ${names[level]}, ${bathLabel}`;
  document.querySelector('#rangeNote').textContent = `Dla ${summary}.`;
}

document.querySelector('#estimateForm').addEventListener('input', estimate);
document.querySelector('#compareRange').addEventListener('input', (event) => {
  document.querySelector('#beforeLayer').style.width = `${event.target.value}%`;
});
document.querySelector('#copyEstimate').addEventListener('click', async () => {
  const status = document.querySelector('#copyStatus');
  try {
    await navigator.clipboard.writeText(`ARCHLINE — założenia orientacyjne\n${summary}\nPrzedział nie jest ofertą.`);
    status.textContent = 'Założenia skopiowane lokalnie.';
  } catch {
    status.textContent = 'Nie udało się skopiować. Zaznacz opis ręcznie.';
  }
});
document.querySelector('#contactForm').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#status').textContent = 'Zakres rozmowy przygotowany lokalnie. Dane nie zostały wysłane.';
});
estimate();
