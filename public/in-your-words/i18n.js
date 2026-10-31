(() => {
  const supported = ['pl', 'ru', 'en'];
  const requested = new URLSearchParams(location.search).get('lang');
  const language = supported.includes(requested) ? requested : 'pl';
  const dictionary = window.SITE_TRANSLATIONS?.[language] || {};
  const t = (value) => dictionary[value] ?? value;
  window.siteI18n = { language, t };
  document.documentElement.lang = language;

  // Translate before the motion scripts split headings into animated words.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement?.closest('script, style, [data-no-translate]')
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const key = node.nodeValue.trim();
    if (key && dictionary[key]) node.nodeValue = node.nodeValue.replace(key, dictionary[key]);
  }
  document.querySelectorAll('[aria-label], [alt], [placeholder], [title]').forEach(element => {
    for (const attribute of ['aria-label', 'alt', 'placeholder', 'title']) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, t(element.getAttribute(attribute)));
    }
  });
  document.title = t(document.title);
  const description = document.querySelector('meta[name="description"]');
  description.content = t(description.content);

  document.querySelectorAll('[data-translation-one], [data-translation-two], [data-phrase-translation]').forEach(element => {
    element.lang = language;
    // English examples stay in English; avoid repeating the same sentence underneath.
    element.hidden = language === 'en';
  });

  const labels = { pl: 'Wybierz język', ru: 'Выбрать язык', en: 'Choose language' };
  document.querySelector('.language-switcher').setAttribute('aria-label', labels[language]);
  document.querySelectorAll('[data-language]').forEach(link => {
    const target = new URL(location.href);
    target.searchParams.set('lang', link.dataset.language);
    link.href = target.href;
    if (link.dataset.language === language) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });

  const validation = {
    pl: { required: 'Uzupełnij to pole.', email: 'Wpisz poprawny adres e-mail.', short: 'Napisz co najmniej 8 znaków.' },
    ru: { required: 'Заполните это поле.', email: 'Введите корректный адрес электронной почты.', short: 'Напишите не менее 8 символов.' },
    en: { required: 'Please fill in this field.', email: 'Enter a valid email address.', short: 'Please enter at least 8 characters.' }
  }[language];
  document.querySelectorAll('#contact-form input, #contact-form textarea').forEach(field => {
    field.addEventListener('input', () => field.setCustomValidity(''));
    field.addEventListener('invalid', () => {
      field.setCustomValidity('');
      if (field.validity.valueMissing) field.setCustomValidity(validation.required);
      else if (field.validity.typeMismatch) field.setCustomValidity(validation.email);
      else if (field.validity.tooShort) field.setCustomValidity(validation.short);
    });
  });
})();
