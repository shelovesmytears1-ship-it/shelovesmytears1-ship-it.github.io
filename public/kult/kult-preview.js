(() => {
  const button = document.querySelector('[data-menu-button]');
  const navigation = document.querySelector('[data-navigation]');
  const label = document.querySelector('[data-menu-label]');

  if (!button || !navigation || !label) return;

  const setMenu = (open) => {
    button.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    label.textContent = open ? 'Close' : 'Menu';
  };

  button.addEventListener('click', () => {
    setMenu(button.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      button.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  const tabs = [...document.querySelectorAll('[data-poster-tab]')];
  const posters = [...document.querySelectorAll('[data-poster]')];

  const selectPoster = (nextTab) => {
    const posterName = nextTab.dataset.posterTab;

    tabs.forEach((tab) => {
      const active = tab === nextTab;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    posters.forEach((poster) => {
      poster.hidden = poster.dataset.poster !== posterName;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPoster(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      selectPoster(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  });

  const form = document.querySelector('[data-notify-form]');
  const status = document.querySelector('[data-notify-status]');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.elements.email;

    if (!input.validity.valid) {
      status.textContent = 'Enter a valid email address to test the demo state.';
      status.dataset.state = 'error';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }

    input.removeAttribute('aria-invalid');
    status.textContent = 'Demo complete. Nothing was stored or sent.';
    status.dataset.state = 'success';
    form.reset();
  });
})();
