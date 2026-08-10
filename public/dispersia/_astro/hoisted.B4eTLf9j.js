const L=new IntersectionObserver(t=>t.forEach(n=>{n.isIntersecting&&(n.target.classList.add("visible"),L.unobserve(n.target))}),{threshold:.12});document.querySelectorAll(".reveal").forEach(t=>L.observe(t));const S=document.getElementById("site-header"),h=()=>{S?.classList.toggle("scrolled",window.scrollY>40)};window.addEventListener("scroll",h,{passive:!0});h();const l=document.getElementById("h-burger"),r=document.getElementById("h-mobile-menu");l?.addEventListener("click",()=>{const t=r?.classList.toggle("open");l.setAttribute("aria-expanded",String(t)),r?.setAttribute("aria-hidden",String(!t))});r?.querySelectorAll("a").forEach(t=>t.addEventListener("click",()=>{r.classList.remove("open"),l?.setAttribute("aria-expanded","false")}));["cart-open-btn","cart-open-btn-mobile"].forEach(t=>{document.getElementById(t)?.addEventListener("click",()=>{window.dispatchEvent(new CustomEvent("dispersia:cart-open"))})});const w="dispersia-cart";function u(){try{return JSON.parse(localStorage.getItem(w)??"[]")}catch{return[]}}function q(t){localStorage.setItem(w,JSON.stringify(t))}function E(t,n){return t.toLocaleString("pl-PL").replace(/\s/g," ")+" "+n}const I=document.getElementById("cart-drawer"),v=document.getElementById("cart-overlay"),m=document.getElementById("cart-items"),p=document.getElementById("cart-empty"),f=document.getElementById("cart-footer"),C=document.getElementById("cart-total-val"),B=document.getElementById("cart-i18n"),$=B.dataset.remove??"Remove",b=B.dataset.currency??"zł";function z(){I.classList.add("open"),v.classList.add("active"),document.body.style.overflow="hidden"}function g(){I.classList.remove("open"),v.classList.remove("active"),document.body.style.overflow=""}v.addEventListener("click",g);document.getElementById("cart-close-btn")?.addEventListener("click",g);document.getElementById("cart-continue-btn")?.addEventListener("click",g);function y(){const t=u(),n=t.reduce((e,c)=>e+c.price*c.qty,0);t.length===0?(m.innerHTML="",p.classList.add("visible"),f.classList.remove("visible")):(p.classList.remove("visible"),f.classList.add("visible"),C.textContent=E(n,b),m.innerHTML=t.map(e=>`
      <li class="cd-item" data-id="${e.id}" data-size="${e.size}">
        <div class="cd-item-img-wrap">
          <img src="${e.img}" alt="${e.name}" width="72" height="96" loading="lazy" />
        </div>
        <div class="cd-item-info">
          <p class="cd-item-name">${e.name}</p>
          <p class="cd-item-meta">${e.size}</p>
          <div class="cd-item-row">
            <div class="cd-qty-ctrl">
              <button class="cd-qty-btn" data-action="dec" aria-label="Decrease">−</button>
              <span class="cd-qty-num">${e.qty}</span>
              <button class="cd-qty-btn" data-action="inc" aria-label="Increase">+</button>
            </div>
            <p class="cd-item-price">${E(e.price*e.qty,b)}</p>
          </div>
          <button class="cd-remove" data-action="remove">${$}</button>
        </div>
      </li>
    `).join("")),A(t)}function A(t){const n=t.reduce((e,c)=>e+c.qty,0);document.querySelectorAll("[data-cart-count]").forEach(e=>{e.textContent=n>0?String(n):"",e.classList.toggle("has-items",n>0)})}m.addEventListener("click",t=>{const n=t.target.closest("[data-action]");if(!n)return;const e=n.closest(".cd-item"),c=e.dataset.id,o=e.dataset.size,d=n.dataset.action;let a=u();if(d==="remove")a=a.filter(s=>!(s.id===c&&s.size===o));else if(d==="inc"){const s=a.find(i=>i.id===c&&i.size===o);s&&(s.qty=Math.min(s.qty+1,10))}else if(d==="dec"){const s=a.find(i=>i.id===c&&i.size===o);s&&(s.qty--,s.qty<1&&(a=a.filter(i=>!(i.id===c&&i.size===o))))}q(a),y()});window.addEventListener("dispersia:add-to-cart",t=>{const{id:n,name:e,price:c,img:o,size:d}=t.detail;let a=u();const s=a.find(i=>i.id===n&&i.size===d);s?s.qty=Math.min(s.qty+1,10):a.push({id:n,name:e,price:c,img:o,size:d,qty:1}),q(a),y(),z()});window.addEventListener("dispersia:cart-open",z);y();
