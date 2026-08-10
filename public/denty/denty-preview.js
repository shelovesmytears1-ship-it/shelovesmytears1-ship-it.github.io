(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const navigation = document.querySelector('[data-navigation]');
  const menuLabel = document.querySelector('[data-menu-label]');

  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    navigation?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (menuLabel) menuLabel.textContent = open ? 'Zamknij' : 'Menu';
  };

  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation?.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  const tabs = [...document.querySelectorAll('[data-journey-tab]')];
  const title = document.querySelector('[data-journey-title]');
  const copy = document.querySelector('[data-journey-copy]');
  const status = document.querySelector('[data-journey-status]');
  const number = document.querySelector('[data-journey-number]');

  const selectTab = (tab, index) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    title.textContent = tab.dataset.title;
    copy.textContent = tab.dataset.copy;
    status.textContent = tab.dataset.status;
    number.textContent = String(index + 1).padStart(2, '0');
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab, index));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      selectTab(tabs[next], next);
      tabs[next].focus();
    });
  });

  const form = document.querySelector('[data-demo-form]');
  const formStatus = document.querySelector('[data-demo-status]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.elements.email;
    if (!email.validity.valid) {
      email.setAttribute('aria-invalid', 'true');
      formStatus.textContent = 'Wpisz poprawny adres e-mail, aby uruchomić stan demonstracyjny.';
      formStatus.dataset.state = 'error';
      email.focus();
      return;
    }
    email.removeAttribute('aria-invalid');
    formStatus.textContent = 'Demo uruchomione. Żadne dane nie zostały zapisane ani wysłane.';
    formStatus.dataset.state = 'success';
    form.reset();
  });

  const messageButtons = [...document.querySelectorAll('[data-message]')];
  const messageStatus = document.querySelector('#messageStatus');
  messageButtons.forEach((button) => button.addEventListener('click', () => {
    messageButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const outcomes = {
      'TAK': 'Stan demonstracyjny: termin potwierdzony.',
      'ZMIEŃ': 'Stan demonstracyjny: recepcja otrzyma zadanie kontaktu.',
      'ZREZYGNUJ': 'Stan demonstracyjny: kontakt zatrzymany, bez kolejnej wiadomości.'
    };
    messageStatus.textContent = outcomes[button.dataset.message];
  }));
})();
