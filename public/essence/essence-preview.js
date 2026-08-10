document.querySelectorAll('.formula dt')[1].textContent='Skwalan';
const plans={
  tight:['Spokojne minimum dla uczucia suchości.',['łagodny krem + ochrona SPF','delikatne mycie + krem barierowy'],'Wprowadzaj po jednym produkcie i wykonaj próbę na małym obszarze.'],
  balanced:['Prosty rytuał podtrzymujący komfort.',['lekki krem + ochrona SPF','mycie + lekki krem'],'Nie zwiększaj liczby kroków, jeśli obecny rytuał działa i jest komfortowy.'],
  mixed:['Lekkie warstwy bez agresywnego odtłuszczania.',['lekka emulsja + ochrona SPF','łagodne mycie + lekki krem'],'Błyszczenie nie oznacza automatycznie potrzeby mocnego oczyszczania.']
};
let copy='';
document.querySelector('#ritualForm').onsubmit=event=>{
  event.preventDefault(); const data=new FormData(event.currentTarget),plan=plans[data.get('feel')],three=data.get('steps')==='three';
  const morning=three?`serum nawilżające + ${plan[1][0]}`:plan[1][0];
  const evening=three?plan[1][1].replace(' + ',' + serum nawilżające + '):plan[1][1];
  document.querySelector('#resultTitle').textContent=plan[0];
  document.querySelector('#resultList').innerHTML=`<li><b>RANO</b>${morning}</li><li><b>WIECZÓR</b>${evening}</li>`;
  const note=plan[2]+(data.get('scent')==='yes'?' Wybieraj warianty bez substancji zapachowych.':'');
  document.querySelector('#resultNote').textContent=note; copy=`${plan[0]}\nRANO: ${morning}\nWIECZÓR: ${evening}\n${note}`;
};
document.querySelector('#copyResult').onclick=async()=>{try{await navigator.clipboard.writeText(copy||'Ułóż rytuał, aby skopiować kartę.');show('Karta skopiowana.');}catch{show('Nie udało się skopiować.');}};
function show(text){const toast=document.querySelector('#toast');toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
const menuButton=document.querySelector('[data-menu]'),nav=document.querySelector('[data-nav]');
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
nav.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}});
