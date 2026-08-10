const serviceData = {
  regular: ['Sprzątanie regularne', 4.4, 3, ['kuchnia i łazienka', 'kurz z dostępnych powierzchni', 'podłogi i lustra', 'wyniesienie typowych odpadów']],
  deep: ['Sprzątanie generalne', 8.2, 6, ['zakres regularny', 'fronty i trudno dostępne miejsca', 'detale kuchni i łazienki', 'listwy, drzwi i punkty kontaktu']],
  office: ['Małe biuro', 5.2, 4, ['stanowiska i powierzchnie wspólne', 'kuchnia i sanitariaty', 'podłogi', 'typowe odpady biurowe']],
  renovation: ['Sprzątanie po remoncie', 10.5, 7, ['odkurzanie pyłu budowlanego', 'mycie powierzchni zmywalnych', 'okna bez trwałych zabrudzeń', 'końcowe mycie podłóg']]
};
let ticketText = '';
function calculateTicket() {
  const form = document.querySelector('#ticketForm');
  const formData = new FormData(form);
  const service = serviceData[formData.get('service')];
  const area = Number(document.querySelector('#area').value);
  const extras = formData.getAll('extra');
  const base = area * service[1] + extras.length * 45;
  const low = Math.round(base * .9 / 5) * 5;
  const high = Math.round(base * 1.12 / 5) * 5;
  const hours = Math.max(2, Math.round(area / 25 + service[2] + extras.length * .7));
  const extraNames = { windows: 'mycie okien', oven: 'czyszczenie piekarnika', fridge: 'czyszczenie lodówki' };
  document.querySelector('#areaOut').textContent = `${area} m²`;
  document.querySelector('#jobTitle').textContent = `${service[0]} / ${area} m²`;
  document.querySelector('#duration').textContent = `${hours}–${hours + 1} h`;
  document.querySelector('#price').textContent = `${low}–${high} zł`;
  document.querySelector('#crew').textContent = hours > 7 ? '2 osoby' : '1 osoba';
  document.querySelector('#includeList').innerHTML = service[3].concat(extras.map((item) => extraNames[item])).map((item) => `<li>${item}</li>`).join('');
  ticketText = `${service[0]}, ${area} m², ${low}–${high} zł, ${hours}–${hours + 1} h`;
}
document.querySelector('#ticketForm').addEventListener('input', calculateTicket);
document.querySelector('#copyTicket').addEventListener('click', async () => {
  const status = document.querySelector('#copyStatus');
  try { await navigator.clipboard.writeText(`FreshClean — karta demo\n${ticketText}`); status.textContent = 'Karta skopiowana lokalnie.'; }
  catch { status.textContent = 'Nie udało się skopiować. Zaznacz dane ręcznie.'; }
});
document.querySelector('#contactForm').addEventListener('submit', (event) => { event.preventDefault(); document.querySelector('#status').textContent = 'Zapytanie przygotowane lokalnie. Dane nie zostały wysłane.'; });
calculateTicket();
