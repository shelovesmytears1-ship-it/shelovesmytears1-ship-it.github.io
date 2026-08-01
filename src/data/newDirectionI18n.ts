import type { Lang } from '../i18n/ui';

export const newDirectionLanguages = ['pl', 'ru', 'en', 'ua'] as const satisfies readonly Lang[];

type Step = { title: string; text: string; result?: string; tags?: string[] };

type NewDirectionCopy = {
  layout: {
    skip: string;
    nav: { work: string; method: string; about: string; contact: string; talk: string; menu: string };
    mainNavigation: string;
    mobileNavigation: string;
    languageLabel: string;
    footer: string;
  };
  home: {
    meta: string;
    location: string;
    heroTitle: string;
    heroAccent: string;
    heroTail: string;
    heroBody: string;
    heroCta: string;
    introMeta: string;
    intro: string;
    facts: string[];
    workMeta: string;
    workTitle: string;
    workAccent: string;
    workBody: string;
    openProject: string;
    allWork: string;
    processMeta: string;
    processTitle: string;
    processAccent: string;
    steps: Step[];
    aboutMeta: string;
    aboutBody: string;
    aboutLink: string;
    contactMeta: string;
    contactTitle: string;
    contactAccent: string;
    contactBody: string;
    contactCta: string;
  };
  work: { title: string; accent: string; lede: string; listLabel: string };
  method: { title: string; accent: string; lede: string; listLabel: string; resultLabel: string; visualNote: string; phases: Step[]; ctaMeta: string; ctaTitle: string; ctaAccent: string; ctaButton: string };
  about: { availability: string; name: string; role: string; lede: string; label: string; essayTitle: string; essayAccent: string; paragraphs: string[]; servicesMeta: string; servicesTitle: string; servicesAccent: string; services: { n: string; title: string; text: string }[]; stackMeta: string; stackTitle: string; stackAccent: string; stack: { label: string; value: string }[]; cta: string };
  contact: { title: string; titleLine: string; accent: string; lede: string; honeypot: string; name: string; channel: string; type: string; options: string[]; message: string; messagePlaceholder: string; submit: string; quickest: string; response: string };
  case: { allWork: string; openSite: string; coverAlt: string; context: string; nextAction: string; backToWork: string; similarProject: string };
  legal: {
    privacyNav: string;
    impressumNav: string;
    privacy: { title: string; updated: string; lead: string; sections: { h: string; html: string }[] };
    impressum: { title: string; meta: string; sections: { h: string; html: string }[] };
  };
};

const copy: Record<Lang, NewDirectionCopy> = {
  pl: {
    layout: {
      skip: 'Przejdź do treści',
      nav: { work: 'Prace', method: 'Proces', about: 'O mnie', contact: 'Kontakt', talk: 'Porozmawiajmy', menu: 'Menu' },
      mainNavigation: 'Główna nawigacja', mobileNavigation: 'Menu mobilne', languageLabel: 'Język',
      footer: 'Niezależny frontend developer',
    },
    home: {
      meta: 'NIEZALEŻNY DEVELOPER', location: 'GDAŃSK · PL / REMOTE',
      heroTitle: 'Projektuję i tworzę strony,', heroAccent: 'które pracują', heroTail: 'na markę.', heroBody: 'Od pierwszej rozmowy do wdrożenia. Bez pośredników, bez przekazywania projektu między zespołami.', heroCta: 'Opowiedz o projekcie',
      introMeta: '01 — PODEJŚCIE', intro: 'Nie jestem agencją. Prowadzę projekt osobiście — z dbałością o kierunek wizualny, kod i to, co dzieje się po publikacji.', facts: ['Strategia strony', 'Interfejs i frontend', 'Wdrożenie i jakość'],
      workMeta: '02 — WYBRANE PRACE', workTitle: 'Mniej projektów.', workAccent: 'Więcej charakteru.', workBody: 'Każda praca ma własny kontekst, odbiorców i język wizualny.', openProject: 'Otwórz projekt', allWork: 'Zobacz wszystkie prace',
      processMeta: '03 — PROCES', processTitle: 'Jasny proces.', processAccent: 'Bez domysłów.',
      steps: [
        { title: 'Rozmowa', text: 'Ustalamy cel, odbiorców i zakres. Zanim powstanie pierwszy ekran.' },
        { title: 'Kierunek', text: 'Układ, treść i wygląd pracują razem, a nie są trzema osobnymi etapami.' },
        { title: 'Budowa', text: 'Responsywny frontend, szybkie ładowanie, dostępność i wszystkie stany interfejsu.' },
        { title: 'Start', text: 'Testy, wdrożenie i przekazanie strony gotowej do realnej pracy.' },
      ],
      aboutMeta: '04 — O MNIE', aboutBody: 'Samodzielny frontend developer. Pomagam firmom zamienić pomysł, usługę albo produkt w stronę, którą łatwo zrozumieć i chce się otworzyć.', aboutLink: 'Więcej o moim podejściu',
      contactMeta: '05 — KONTAKT', contactTitle: 'Masz projekt?', contactAccent: 'Porozmawiajmy.', contactBody: 'Napisz kilka zdań o zadaniu. Odpowiadam osobiście — z pytaniami albo wstępnym kierunkiem.', contactCta: 'Wypełnij brief',
    },
    work: { title: 'Wybrane', accent: 'projekty.', lede: 'Różne branże, jedna zasada: strona musi jasno komunikować wartość i dobrze działać w prawdziwym użyciu.', listLabel: 'Lista projektów' },
    method: {
      title: 'Jasny proces.', accent: 'Bez domysłów.', lede: 'Prowadzę projekt osobiście i pokazuję kolejne decyzje po drodze — tak, aby finał nie był niespodzianką.', listLabel: 'Etapy pracy', resultLabel: 'Na wyjściu', visualNote: 'Decyzje są widoczne od pierwszej wiadomości do uruchomienia.', ctaMeta: 'NA POCZĄTEK WYSTARCZY KRÓTKA ROZMOWA', ctaTitle: 'Masz zadanie?', ctaAccent: 'Ustalmy kierunek.', ctaButton: 'Przejdź do briefu',
      phases: [
        { title: 'Rozmowa', text: 'Zaczynam od celu, odbiorców i ograniczeń. Dobry projekt nie powstaje od wyboru koloru.', result: 'Brief, widełki wyceny i harmonogram.', tags: ['Brief', 'Wycena', 'Harmonogram'] },
        { title: 'Kierunek', text: 'Układ, treść i ton wizualny ustawiam zanim zacznie się właściwa budowa.', result: 'Jedna zatwierdzona ścieżka wizualna i struktura strony.', tags: ['Moodboard', 'Architektura', 'Kierunek'] },
        { title: 'Projektowanie i kod', text: 'Tworzę interfejs responsywny, dostępny i tak lekki, jak wymaga tego zadanie.', result: 'Działający, responsywny interfejs gotowy do testów.', tags: ['Kod źródłowy', 'Repozytorium', 'RWD'] },
        { title: 'Kontrola jakości', text: 'Sprawdzam stronę na realnych szerokościach, klawiaturą i pod kątem szybkości.', result: 'Lista poprawek i sprawdzona wersja do publikacji.', tags: ['Raport wydajności', 'A11y', 'Testy'] },
        { title: 'Wdrożenie', text: 'Konfiguruję domenę, hosting i podstawy SEO. Strona jest gotowa do pracy, nie tylko do pokazania.', result: 'Działająca strona podpięta do domeny.', tags: ['Hosting', 'Domena', 'SEO'] },
      ],
    },
    about: {
      availability: 'Przyjmuję projekty na jesień 2026', name: 'Daniil Menshov', role: 'niezależny frontend developer z Gdańska',
      lede: 'Zatrudniasz jedną osobę zamiast łańcucha podwykonawców — i dostajesz stronę, za którą ktoś realnie odpowiada.', label: 'JEDNA OSOBA\nJEDEN ODPOWIEDZIALNY KONTAKT', essayTitle: 'Projekt nie ginie\nmiędzy', essayAccent: 'rolami.',
      paragraphs: ['Nazywam się Daniil Menshov. Jestem niezależnym frontend developerem z Gdańska i prowadzę projekt w całości — od pierwszej rozmowy do publikacji. Dzięki temu strona powstaje szybciej i pozostaje spójna: odpowiada za nią jedna osoba.', 'Nie przekazuję strony od stratega do designera, potem do developera i project managera. Rozmawiasz ze mną, a ja odpowiadam za kierunek, wykonanie i szczegóły wdrożenia — nic nie ginie na styku ról.', 'Najlepiej czuję się w projektach, w których strona ma konkretną rolę: wyjaśnić produkt, uporządkować ofertę, zbudować zaufanie albo pomóc klientowi wykonać następny krok.'],
      servicesMeta: 'USŁUGI', servicesTitle: 'Trzy formaty', servicesAccent: 'pracy.', services: [
        { n: '01', title: 'Landing page', text: 'Strona jednoekranowa z jednym jasnym celem: wyjaśnić produkt i skłonić do działania. Szybki start.' },
        { n: '02', title: 'Strona wielostronicowa', text: 'Strona firmy lub produktu: struktura, sekcje, czytelna nawigacja. Aby wyjaśnić ofertę i zbudować zaufanie.' },
        { n: '03', title: 'Sklep / e-commerce', text: 'Katalog, karty produktów, koszyk. Schludna witryna, która wygodnie działa w realnym użyciu.' },
      ],
      stackMeta: 'NARZĘDZIA', stackTitle: 'Technologia jako', stackAccent: 'narzędzie.', stack: [
        { label: 'Frontend', value: 'HTML · CSS · JavaScript · TypeScript' }, { label: 'Frameworki', value: 'Astro · Next.js · Tailwind' }, { label: 'Animacja', value: 'CSS motion · WebGL' }, { label: 'Jakość', value: 'Dostępność · Szybkość · SEO' },
      ], cta: 'Opowiedz o projekcie',
    },
    contact: { title: 'Opowiedz', titleLine: 'o', accent: 'projekcie.', lede: 'Kilka konkretnych zdań wystarczy na start. Odpowiadam osobiście z pytaniami albo wstępnym kierunkiem.', honeypot: 'Nie wypełniaj', name: 'Imię', channel: 'Telegram lub email', type: 'Typ projektu', options: ['Landing page', 'Strona wielostronicowa', 'Sklep / e-commerce', 'Osobista marka', 'Inne'], message: 'O projekcie', messagePlaceholder: 'Cel strony, branża, co ma się zmienić...', submit: 'Wyślij brief', quickest: 'NAJSZYBSZY KONTAKT', response: 'Odpowiadam w ciągu 24 godzin w dni robocze.' },
    case: { allWork: 'Wszystkie prace', openSite: 'Otwórz stronę', coverAlt: 'Widok strony', context: 'KONTEKST / DECYZJE / EFEKT', nextAction: 'Następna akcja', backToWork: 'Wróć do prac', similarProject: 'Masz podobny projekt?' },
    legal: {
      privacyNav: 'Polityka prywatności', impressumNav: 'Impressum',
      privacy: {
        title: 'Polityka prywatności', updated: 'Ostatnia aktualizacja: lipiec 2026',
        lead: '<p>Niniejsza Polityka prywatności wyjaśnia, w jaki sposób Twoje dane osobowe są zbierane, wykorzystywane i chronione podczas korzystania z witryny <strong>overflow-web.pl</strong>.</p><p>Jako niezależny frontend developer z siedzibą w UE (Gdańsk, Polska) dbam o ochronę Twojej prywatności i przestrzegam Ogólnego rozporządzenia o ochronie danych (RODO).</p>',
        sections: [
          { h: '1. Zbieranie i wykorzystanie danych', html: '<p>To statyczna witryna-portfolio, domyślnie przyjazna prywatności.</p><ul><li><strong>Brak analityki:</strong> nie używam Google Analytics, Meta Pixel ani żadnych ukrytych skryptów śledzących.</li><li><strong>Brak reklam:</strong> Twoje dane nigdy nie są sprzedawane ani wykorzystywane do marketingu.</li></ul>' },
          { h: '2. Formularz kontaktowy', html: '<p>Po wysłaniu formularza podane dane — imię, kanał kontaktu (Telegram lub email), typ projektu i treść wiadomości — są przekazywane przez funkcję serwerową Netlify do mojego konta Telegram wyłącznie po to, abym mógł odpowiedzieć na Twoje zapytanie. W dostarczeniu wiadomości uczestniczą usługi Netlify i Telegram.</p><p>Ukryte pole antyspamowe („honeypot”) pomaga blokować boty. Zamiast formularza możesz zawsze napisać do mnie bezpośrednio emailem lub przez Telegram.</p>' },
          { h: '3. Pliki cookie i pamięć lokalna', html: '<p>Ta witryna nie używa śledzących plików cookie. Korzysta jedynie z <strong>Local Storage</strong> przeglądarki, aby zapamiętać jedno ustawienie interfejsu:</p><ul><li><code>overflow-theme</code> — czy wybrano tryb jasny czy ciemny. Ta wartość nigdy nie opuszcza Twojej przeglądarki i nie jest dostępna dla mnie ani osób trzecich.</li></ul>' },
          { h: '4. Kontakt bezpośredni', html: '<p>Jeśli skontaktujesz się ze mną emailem (<a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a>) lub przez Telegram (<a href="https://t.me/zzxvaracaa" target="_blank" rel="noopener">@zzxvaracaa</a>), dobrowolnie podane dane wykorzystam wyłącznie do komunikacji i odpowiedzi na Twoje zapytanie. Nie udostępnię ich osobom trzecim bez Twojej zgody.</p>' },
          { h: '5. Logi serwera', html: '<p>Mój dostawca hostingu może automatycznie zapisywać standardowe logi dostępu do serwera w celach bezpieczeństwa i wydajności. Mogą one tymczasowo zawierać Twój adres IP, typ przeglądarki i znacznik czasu wizyty. Odbywa się to na podstawie prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f RODO).</p>' },
          { h: '6. Twoje prawa', html: '<p>Zgodnie z RODO masz prawo żądać dostępu do swoich danych osobowych, ich sprostowania lub usunięcia. Aby skorzystać z tych praw, napisz na <a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a>.</p>' },
        ],
      },
      impressum: {
        title: 'Impressum', meta: 'Informacje prawne zgodne z europejskimi wymogami przejrzystości',
        sections: [
          { h: 'Usługodawca', html: '<p><strong>Daniil Menshov</strong><br />Działający jako <strong>overflow</strong><br />Niezależny frontend developer<br />Gdańsk, Polska</p>' },
          { h: 'Kontakt', html: '<p>Email: <a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a><br />Telegram: <a href="https://t.me/zzxvaracaa" target="_blank" rel="noopener">@zzxvaracaa</a></p>' },
          { h: 'Zastrzeżenie', html: '<p>Treść tej witryny została przygotowana z najwyższą możliwą starannością. Nie mogę jednak zagwarantować dokładności, kompletności ani aktualności treści. Jako usługodawca odpowiadam za własne treści zgodnie z ogólnymi przepisami prawa.</p>' },
          { h: 'Prawa autorskie', html: '<p>Projekt, kod i treści opublikowane w tej witrynie są chronione prawem autorskim. Każde użycie, powielanie lub rozpowszechnianie niedozwolone wprost przez prawo autorskie wymaga mojej uprzedniej pisemnej zgody.</p>' },
          { h: 'Rozwiązywanie sporów', html: '<p>Komisja Europejska udostępnia <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">platformę internetowego rozstrzygania sporów (ODR)</a>. Nie jestem zobowiązany do udziału w postępowaniach przed polubownym sądem konsumenckim i nie uczestniczę w nich dobrowolnie.</p>' },
        ],
      },
    },
  },
  ru: {
    layout: { skip: 'Перейти к содержанию', nav: { work: 'Работы', method: 'Процесс', about: 'Обо мне', contact: 'Контакт', talk: 'Обсудить проект', menu: 'Меню' }, mainNavigation: 'Основная навигация', mobileNavigation: 'Мобильное меню', languageLabel: 'Язык', footer: 'Независимый frontend-разработчик' },
    home: {
      meta: 'НЕЗАВИСИМЫЙ РАЗРАБОТЧИК', location: 'ГДАНЬСК · PL / REMOTE',
      heroTitle: 'Проектирую и создаю сайты,', heroAccent: 'которые работают', heroTail: 'на бренд.', heroBody: 'От первого разговора до запуска. Без посредников и передачи проекта между командами.', heroCta: 'Рассказать о проекте',
      introMeta: '01 — ПОДХОД', intro: 'Я не агентство. Веду проект лично — с вниманием к визуальному направлению, коду и тому, что происходит после публикации.', facts: ['Стратегия сайта', 'Интерфейс и frontend', 'Запуск и качество'],
      workMeta: '02 — ИЗБРАННЫЕ РАБОТЫ', workTitle: 'Меньше проектов.', workAccent: 'Больше характера.', workBody: 'У каждой работы свой контекст, аудитория и визуальный язык.', openProject: 'Открыть проект', allWork: 'Все работы',
      processMeta: '03 — ПРОЦЕСС', processTitle: 'Ясный процесс.', processAccent: 'Без догадок.',
      steps: [
        { title: 'Разговор', text: 'Определяем цель, аудиторию и границы задачи — до первого экрана.' },
        { title: 'Направление', text: 'Структура, текст и визуал работают вместе, а не как три отдельных этапа.' },
        { title: 'Разработка', text: 'Адаптивный frontend, быстрая загрузка, доступность и все состояния интерфейса.' },
        { title: 'Запуск', text: 'Тестирование, внедрение и передача сайта, готового к реальной работе.' },
      ],
      aboutMeta: '04 — ОБО МНЕ', aboutBody: 'Самостоятельный frontend-разработчик. Помогаю бизнесу превратить идею, услугу или продукт в сайт, который легко понять и хочется открыть.', aboutLink: 'Подробнее о подходе',
      contactMeta: '05 — КОНТАКТ', contactTitle: 'Есть проект?', contactAccent: 'Обсудим.', contactBody: 'Напиши несколько строк о задаче. Отвечу лично — вопросами или первым направлением.', contactCta: 'Заполнить бриф',
    },
    work: { title: 'Избранные', accent: 'проекты.', lede: 'Разные ниши, один принцип: сайт должен ясно объяснять ценность и хорошо работать в реальном использовании.', listLabel: 'Список проектов' },
    method: {
      title: 'Ясный процесс.', accent: 'Без догадок.', lede: 'Веду проект лично и показываю решения по ходу работы — чтобы финал не оказался сюрпризом.', listLabel: 'Этапы работы', resultLabel: 'На выходе', visualNote: 'Решения остаются видимыми от первого сообщения до запуска.', ctaMeta: 'ДЛЯ НАЧАЛА ДОСТАТОЧНО КОРОТКОГО РАЗГОВОРА', ctaTitle: 'Есть задача?', ctaAccent: 'Определим направление.', ctaButton: 'Перейти к брифу',
      phases: [
        { title: 'Разговор', text: 'Начинаю с цели, аудитории и ограничений. Хороший проект не начинается с выбора цвета.', result: 'Бриф, диапазон оценки и график.', tags: ['Бриф', 'Оценка', 'График'] },
        { title: 'Направление', text: 'Структуру, текст и визуальный тон определяю до начала непосредственной разработки.', result: 'Одно утверждённое визуальное направление и структура сайта.', tags: ['Мудборд', 'Структура', 'Визуал'] },
        { title: 'Дизайн и код', text: 'Делаю адаптивный, доступный интерфейс ровно такой сложности, какая нужна задаче.', result: 'Рабочий адаптивный интерфейс, готовый к проверке.', tags: ['Исходный код', 'Репозиторий', 'Адаптив'] },
        { title: 'Контроль качества', text: 'Проверяю сайт на реальных ширинах, с клавиатурой и по скорости.', result: 'Список правок и проверенная версия для публикации.', tags: ['Отчет скорости', 'Доступность', 'Тесты'] },
        { title: 'Запуск', text: 'Настраиваю домен, хостинг и базовое SEO. Сайт готов работать, а не только выглядеть.', result: 'Рабочий сайт, подключённый к домену.', tags: ['Хостинг', 'Домен', 'SEO'] },
      ],
    },
    about: {
      availability: 'Беру проекты на осень 2026', name: 'Даниил Меньшов', role: 'независимый frontend-разработчик из Гданьска',
      lede: 'Нанимаешь одного человека вместо цепочки подрядчиков — и получаешь сайт, за который кто-то реально отвечает.', label: 'ОДИН ЧЕЛОВЕК\nОДИН ОТВЕТСТВЕННЫЙ КОНТАКТ', essayTitle: 'Проект не теряется\nмежду', essayAccent: 'ролями.',
      paragraphs: ['Меня зовут Даниил Меньшов. Я независимый frontend-разработчик из Гданьска и веду проект целиком — от первого разговора до публикации. Поэтому сайт выходит быстрее и остаётся цельным: за него отвечает один человек.', 'Я не передаю сайт от стратега дизайнеру, потом разработчику и менеджеру. Ты общаешься со мной, а я отвечаю за направление, реализацию и детали запуска — ничего не теряется на стыке ролей.', 'Лучше всего работаю с проектами, где у сайта есть ясная роль: объяснить продукт, упорядочить предложение, вызвать доверие или помочь клиенту сделать следующий шаг.'],
      servicesMeta: 'УСЛУГИ', servicesTitle: 'Три формата', servicesAccent: 'работы.', services: [
        { n: '01', title: 'Лендинг', text: 'Одностраничный сайт с одной ясной целью: объяснить продукт и подтолкнуть к действию. Быстрый запуск.' },
        { n: '02', title: 'Многостраничный сайт', text: 'Сайт компании или продукта: структура, разделы, понятная навигация. Чтобы объяснить оффер и вызвать доверие.' },
        { n: '03', title: 'Магазин / e-commerce', text: 'Каталог, карточки товаров, корзина. Аккуратная витрина, которая удобно работает в реальном использовании.' },
      ],
      stackMeta: 'ИНСТРУМЕНТЫ', stackTitle: 'Технологии — это', stackAccent: 'инструмент.', stack: [
        { label: 'Frontend', value: 'HTML · CSS · JavaScript · TypeScript' }, { label: 'Фреймворки', value: 'Astro · Next.js · Tailwind' }, { label: 'Анимация', value: 'CSS motion · WebGL' }, { label: 'Качество', value: 'Доступность · Скорость · SEO' },
      ], cta: 'Рассказать о проекте',
    },
    contact: { title: 'Расскажи', titleLine: 'о', accent: 'проекте.', lede: 'Для начала достаточно нескольких конкретных строк. Отвечу лично — с вопросами или первым направлением.', honeypot: 'Не заполняйте', name: 'Имя', channel: 'Telegram или email', type: 'Тип проекта', options: ['Лендинг', 'Многостраничный сайт', 'Магазин / e-commerce', 'Личный бренд', 'Другое'], message: 'О проекте', messagePlaceholder: 'Цель сайта, ниша, что должно измениться...', submit: 'Отправить бриф', quickest: 'САМЫЙ БЫСТРЫЙ КОНТАКТ', response: 'Отвечаю в течение 24 часов в рабочие дни.' },
    case: { allWork: 'Все работы', openSite: 'Открыть сайт', coverAlt: 'Вид сайта', context: 'КОНТЕКСТ / РЕШЕНИЯ / РЕЗУЛЬТАТ', nextAction: 'Следующее действие', backToWork: 'Вернуться к работам', similarProject: 'Похожий проект?' },
    legal: {
      privacyNav: 'Политика конфиденциальности', impressumNav: 'Правовая информация',
      privacy: {
        title: 'Политика конфиденциальности', updated: 'Последнее обновление: июль 2026',
        lead: '<p>Эта Политика конфиденциальности объясняет, как собираются, используются и защищаются твои персональные данные при посещении сайта <strong>overflow-web.pl</strong>.</p><p>Как независимый frontend-разработчик, находящийся в ЕС (Гданьск, Польша), я забочусь о защите твоей приватности и соблюдаю Общий регламент по защите данных (GDPR).</p>',
        sections: [
          { h: '1. Сбор и использование данных', html: '<p>Это статический сайт-портфолио, дружественный к приватности по умолчанию.</p><ul><li><strong>Без аналитики:</strong> я не использую Google Analytics, Meta Pixel и любые скрытые сторонние скрипты слежения.</li><li><strong>Без рекламы:</strong> твои данные никогда не продаются и не используются для маркетинга.</li></ul>' },
          { h: '2. Форма обратной связи', html: '<p>После отправки формы введённые данные — имя, канал связи (Telegram или email), тип проекта и текст сообщения — передаются через серверную функцию Netlify в мой аккаунт Telegram исключительно для того, чтобы я мог ответить на твой запрос. В доставке сообщения участвуют сервисы Netlify и Telegram.</p><p>Скрытое антиспам-поле («honeypot») помогает блокировать ботов. Вместо формы ты всегда можешь написать мне напрямую по email или в Telegram.</p>' },
          { h: '3. Cookie и локальное хранилище', html: '<p>Сайт не использует отслеживающие cookie. Используется только <strong>Local Storage</strong> браузера, чтобы запомнить одну настройку интерфейса:</p><ul><li><code>overflow-theme</code> — выбрал ли ты светлую или тёмную тему. Это значение никогда не покидает твой браузер и недоступно ни мне, ни третьим лицам.</li></ul>' },
          { h: '4. Прямая связь', html: '<p>Если ты связываешься со мной по email (<a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a>) или в Telegram (<a href="https://t.me/zzxvaracaa" target="_blank" rel="noopener">@zzxvaracaa</a>), добровольно предоставленные данные я использую только для общения и ответа на твой запрос. Я не передаю их третьим лицам без твоего согласия.</p>' },
          { h: '5. Логи сервера', html: '<p>Мой хостинг-провайдер может автоматически записывать стандартные логи доступа к серверу в целях безопасности и производительности. Они могут временно содержать твой IP-адрес, тип браузера и время визита. Обработка ведётся на основании законного интереса (ст. 6(1)(f) GDPR).</p>' },
          { h: '6. Твои права', html: '<p>Согласно GDPR ты имеешь право запросить доступ к своим персональным данным, их исправление или удаление. Чтобы воспользоваться этими правами, напиши на <a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a>.</p>' },
        ],
      },
      impressum: {
        title: 'Правовая информация', meta: 'Правовая информация в соответствии с европейскими требованиями прозрачности',
        sections: [
          { h: 'Поставщик услуг', html: '<p><strong>Даниил Меньшов</strong><br />Работает под именем <strong>overflow</strong><br />Независимый frontend-разработчик<br />Гданьск, Польша</p>' },
          { h: 'Контакт', html: '<p>Email: <a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a><br />Telegram: <a href="https://t.me/zzxvaracaa" target="_blank" rel="noopener">@zzxvaracaa</a></p>' },
          { h: 'Отказ от ответственности', html: '<p>Содержимое этого сайта подготовлено с максимально возможной тщательностью. Тем не менее я не могу гарантировать точность, полноту и актуальность материалов. Как поставщик услуг я отвечаю за собственный контент в соответствии с общими нормами права.</p>' },
          { h: 'Авторские права', html: '<p>Дизайн, код и материалы, опубликованные на этом сайте, защищены авторским правом. Любое использование, воспроизведение или распространение, прямо не разрешённое законом об авторском праве, требует моего предварительного письменного согласия.</p>' },
          { h: 'Разрешение споров', html: '<p>Европейская комиссия предоставляет <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">платформу онлайн-урегулирования споров (ODR)</a>. Я не обязан участвовать в разбирательствах перед потребительским арбитражем и не делаю это добровольно.</p>' },
        ],
      },
    },
  },
  en: {
    layout: { skip: 'Skip to content', nav: { work: 'Work', method: 'Process', about: 'About', contact: 'Contact', talk: 'Let’s talk', menu: 'Menu' }, mainNavigation: 'Main navigation', mobileNavigation: 'Mobile navigation', languageLabel: 'Language', footer: 'Independent frontend developer' },
    home: {
      meta: 'INDEPENDENT DEVELOPER', location: 'GDAŃSK · PL / REMOTE',
      heroTitle: 'I design and build websites', heroAccent: 'that work', heroTail: 'for your business.', heroBody: 'From the first conversation to launch. No middlemen and no handoffs between teams.', heroCta: 'Tell me about your project',
      introMeta: '01 — APPROACH', intro: 'I’m not an agency. I lead each project personally, paying attention to the visual direction, the code, and what happens after launch.', facts: ['Website strategy', 'Interface and frontend', 'Launch and quality'],
      workMeta: '02 — SELECTED WORK', workTitle: 'Fewer projects.', workAccent: 'More character.', workBody: 'Every project has its own context, audience and visual language.', openProject: 'Open project', allWork: 'View all work',
      processMeta: '03 — PROCESS', processTitle: 'A clear process.', processAccent: 'No guesswork.',
      steps: [
        { title: 'Conversation', text: 'We define the goal, audience and scope before the first screen exists.' },
        { title: 'Direction', text: 'Structure, copy and visual tone work together—not as three separate stages.' },
        { title: 'Build', text: 'Responsive frontend, fast loading, accessibility and every interface state.' },
        { title: 'Launch', text: 'Testing, deployment and a handover of a site ready for real work.' },
      ],
      aboutMeta: '04 — ABOUT', aboutBody: 'An independent frontend developer. I help businesses turn an idea, service or product into a website that is easy to understand and worth opening.', aboutLink: 'More about my approach',
      contactMeta: '05 — CONTACT', contactTitle: 'Have a project?', contactAccent: 'Let’s talk.', contactBody: 'Send a few lines about the task. I’ll reply personally—with questions or an initial direction.', contactCta: 'Fill in the brief',
    },
    work: { title: 'Selected', accent: 'projects.', lede: 'Different industries, one principle: a site should communicate value clearly and work well in real use.', listLabel: 'Project list' },
    method: {
      title: 'A clear process.', accent: 'No guesswork.', lede: 'I lead the project personally and share decisions along the way, so the final result is never a surprise.', listLabel: 'Work stages', resultLabel: 'Output', visualNote: 'Decisions stay visible from the first message to launch.', ctaMeta: 'A SHORT CONVERSATION IS ENOUGH TO START', ctaTitle: 'Have a task?', ctaAccent: 'Let’s define the direction.', ctaButton: 'Go to the brief',
      phases: [
        { title: 'Conversation', text: 'I start with the goal, audience and constraints. A good project does not begin with picking a colour.', result: 'A brief, estimate range and timeline.', tags: ['Brief', 'Estimate', 'Timeline'] },
        { title: 'Direction', text: 'I set the structure, copy and visual tone before the actual build starts.', result: 'One approved visual direction and page structure.', tags: ['Moodboard', 'Structure', 'Visuals'] },
        { title: 'Design and code', text: 'I create a responsive, accessible interface with precisely the complexity the task needs.', result: 'A working responsive interface ready for testing.', tags: ['Source code', 'Repository', 'Responsive'] },
        { title: 'Quality assurance', text: 'I check the site at real viewport widths, with a keyboard, and for speed.', result: 'A fix list and a release candidate ready to publish.', tags: ['Speed report', 'Accessibility', 'Testing'] },
        { title: 'Launch', text: 'I configure the domain, hosting and SEO basics. The site is ready to work, not merely to be shown.', result: 'A live site connected to its domain.', tags: ['Hosting', 'Domain', 'SEO'] },
      ],
    },
    about: {
      availability: 'Taking on projects for autumn 2026', name: 'Daniil Menshov', role: 'an independent frontend developer based in Gdańsk',
      lede: 'You hire one person instead of a chain of contractors — and get a website someone is truly accountable for.', label: 'ONE PERSON\nONE RESPONSIBLE CONTACT', essayTitle: 'A project does not get lost\nbetween', essayAccent: 'roles.',
      paragraphs: ['My name is Daniil Menshov. I am an independent frontend developer based in Gdańsk, and I run the whole project — from the first conversation to launch. That means the site ships faster and stays coherent: one person is accountable for it.', 'I do not pass a website from strategist to designer, then to developer and project manager. You speak with me, and I take responsibility for direction, execution and launch details — nothing gets lost between roles.', 'I work best on projects where a website has a clear role: explain a product, organise an offer, build trust or help a customer take the next step.'],
      servicesMeta: 'SERVICES', servicesTitle: 'Three formats', servicesAccent: 'of work.', services: [
        { n: '01', title: 'Landing page', text: 'A one-screen site with a single clear goal: explain the product and prompt action. Fast to launch.' },
        { n: '02', title: 'Multi-page website', text: 'A company or product site: structure, sections, clear navigation. To explain the offer and build trust.' },
        { n: '03', title: 'Shop / e-commerce', text: 'Catalogue, product cards, cart. A tidy storefront that works comfortably in real use.' },
      ],
      stackMeta: 'TOOLS', stackTitle: 'Technology is a', stackAccent: 'tool.', stack: [
        { label: 'Frontend', value: 'HTML · CSS · JavaScript · TypeScript' }, { label: 'Frameworks', value: 'Astro · Next.js · Tailwind' }, { label: 'Motion', value: 'CSS motion · WebGL' }, { label: 'Quality', value: 'Accessibility · Speed · SEO' },
      ], cta: 'Tell me about your project',
    },
    contact: { title: 'Tell me', titleLine: 'about the', accent: 'project.', lede: 'A few specific sentences are enough to start. I’ll reply personally, with questions or an initial direction.', honeypot: 'Do not fill in', name: 'Name', channel: 'Telegram or email', type: 'Project type', options: ['Landing page', 'Multi-page website', 'Shop / e-commerce', 'Personal brand', 'Other'], message: 'About the project', messagePlaceholder: 'Site goal, industry, what should change...', submit: 'Send brief', quickest: 'QUICKEST CONTACT', response: 'I reply within 24 hours on business days.' },
    case: { allWork: 'All work', openSite: 'Open website', coverAlt: 'Website view', context: 'CONTEXT / DECISIONS / OUTCOME', nextAction: 'Next action', backToWork: 'Back to work', similarProject: 'Have a similar project?' },
    legal: {
      privacyNav: 'Privacy Policy', impressumNav: 'Impressum',
      privacy: {
        title: 'Privacy Policy', updated: 'Last updated: July 2026',
        lead: '<p>This Privacy Policy explains how your personal data is collected, used and protected when you visit <strong>overflow-web.pl</strong>.</p><p>As an independent frontend developer based in the EU (Gdańsk, Poland), I am committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR).</p>',
        sections: [
          { h: '1. Data collection and usage', html: '<p>This is a static portfolio website, privacy-friendly by default.</p><ul><li><strong>No analytics:</strong> I do not use Google Analytics, Meta Pixel or any hidden third-party tracking scripts.</li><li><strong>No advertising:</strong> your data is never sold or used for marketing.</li></ul>' },
          { h: '2. Contact form', html: '<p>When you submit the form, the data you enter — your name, contact channel (Telegram or email), project type and message — is sent through a Netlify server function to my Telegram account solely so that I can reply to your enquiry. Netlify and Telegram take part in delivering the message.</p><p>A hidden anti-spam field (“honeypot”) helps block automated bots. Instead of the form you can always contact me directly by email or Telegram.</p>' },
          { h: '3. Cookies and local storage', html: '<p>This website uses no tracking cookies. It only uses your browser’s <strong>Local Storage</strong> to remember one interface preference:</p><ul><li><code>overflow-theme</code> — whether you selected light or dark mode. This value never leaves your browser and is not accessible to me or any third party.</li></ul>' },
          { h: '4. Contacting me directly', html: '<p>If you contact me by email (<a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a>) or Telegram (<a href="https://t.me/zzxvaracaa" target="_blank" rel="noopener">@zzxvaracaa</a>), the data you voluntarily provide is used solely to communicate with you and answer your enquiry. I will not share it with third parties without your consent.</p>' },
          { h: '5. Server logs', html: '<p>My hosting provider may automatically record standard server access logs for security and performance. These may temporarily contain your IP address, browser type and the timestamp of your visit. This is processed on the basis of legitimate interest (Art. 6(1)(f) GDPR).</p>' },
          { h: '6. Your rights', html: '<p>Under the GDPR you have the right to request access to, correction of, or deletion of any personal data I hold. To exercise these rights, email <a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a>.</p>' },
        ],
      },
      impressum: {
        title: 'Impressum', meta: 'Legal information in accordance with European transparency requirements',
        sections: [
          { h: 'Service provider', html: '<p><strong>Daniil Menshov</strong><br />Operating as <strong>overflow</strong><br />Independent frontend developer<br />Gdańsk, Poland</p>' },
          { h: 'Contact', html: '<p>Email: <a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a><br />Telegram: <a href="https://t.me/zzxvaracaa" target="_blank" rel="noopener">@zzxvaracaa</a></p>' },
          { h: 'Disclaimer', html: '<p>The content of this website has been created with the greatest possible care. However, I cannot guarantee the accuracy, completeness or timeliness of the content. As a service provider, I am responsible for my own content in accordance with general law.</p>' },
          { h: 'Copyright', html: '<p>The design, code and content published on this website are protected by copyright. Any use, reproduction or distribution not expressly permitted by copyright law requires my prior written consent.</p>' },
          { h: 'Dispute resolution', html: '<p>The European Commission provides an <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">Online Dispute Resolution (ODR) platform</a>. I am not obliged to participate in dispute resolution proceedings before a consumer arbitration board and do not do so voluntarily.</p>' },
        ],
      },
    },
  },
  ua: {
    layout: { skip: 'Перейти до вмісту', nav: { work: 'Роботи', method: 'Процес', about: 'Про мене', contact: 'Контакт', talk: 'Обговорити проєкт', menu: 'Меню' }, mainNavigation: 'Основна навігація', mobileNavigation: 'Мобільне меню', languageLabel: 'Мова', footer: 'Незалежний frontend-розробник' },
    home: {
      meta: 'НЕЗАЛЕЖНИЙ РОЗРОБНИК', location: 'ГДАНСЬК · PL / REMOTE',
      heroTitle: 'Проєктую й створюю сайти,', heroAccent: 'які працюють', heroTail: 'на бренд.', heroBody: 'Від першої розмови до запуску. Без посередників і передачі проєкту між командами.', heroCta: 'Розповісти про проєкт',
      introMeta: '01 — ПІДХІД', intro: 'Я не агенція. Веду проєкт особисто — з увагою до візуального напрямку, коду і того, що відбувається після публікації.', facts: ['Стратегія сайту', 'Інтерфейс і frontend', 'Запуск і якість'],
      workMeta: '02 — ВИБРАНІ РОБОТИ', workTitle: 'Менше проєктів.', workAccent: 'Більше характеру.', workBody: 'Кожна робота має власний контекст, аудиторію та візуальну мову.', openProject: 'Відкрити проєкт', allWork: 'Усі роботи',
      processMeta: '03 — ПРОЦЕС', processTitle: 'Зрозумілий процес.', processAccent: 'Без здогадок.',
      steps: [
        { title: 'Розмова', text: 'Визначаємо мету, аудиторію та межі завдання ще до першого екрана.' },
        { title: 'Напрямок', text: 'Структура, текст і візуал працюють разом, а не як три окремі етапи.' },
        { title: 'Розробка', text: 'Адаптивний frontend, швидке завантаження, доступність і всі стани інтерфейсу.' },
        { title: 'Запуск', text: 'Тестування, впровадження та передача сайту, готового до реальної роботи.' },
      ],
      aboutMeta: '04 — ПРО МЕНЕ', aboutBody: 'Самостійний frontend-розробник. Допомагаю бізнесу перетворити ідею, послугу або продукт на сайт, який легко зрозуміти та хочеться відкрити.', aboutLink: 'Більше про мій підхід',
      contactMeta: '05 — КОНТАКТ', contactTitle: 'Є проєкт?', contactAccent: 'Обговорімо.', contactBody: 'Напиши кілька рядків про завдання. Відповім особисто — з питаннями або першим напрямком.', contactCta: 'Заповнити бриф',
    },
    work: { title: 'Вибрані', accent: 'проєкти.', lede: 'Різні ніші, один принцип: сайт має зрозуміло пояснювати цінність і добре працювати у реальному використанні.', listLabel: 'Список проєктів' },
    method: {
      title: 'Зрозумілий процес.', accent: 'Без здогадок.', lede: 'Веду проєкт особисто й показую рішення в процесі, щоб фінал не став несподіванкою.', listLabel: 'Етапи роботи', resultLabel: 'Результат', visualNote: 'Рішення залишаються видимими від першого повідомлення до запуску.', ctaMeta: 'ДЛЯ ПОЧАТКУ ДОСТАТНЬО КОРОТКОЇ РОЗМОВИ', ctaTitle: 'Є завдання?', ctaAccent: 'Визначимо напрямок.', ctaButton: 'Перейти до брифу',
      phases: [
        { title: 'Розмова', text: 'Починаю з мети, аудиторії та обмежень. Хороший проєкт не починається з вибору кольору.', result: 'Бриф, діапазон оцінки та графік.', tags: ['Бриф', 'Оцінка', 'Графік'] },
        { title: 'Напрямок', text: 'Структуру, текст і візуальний тон визначаю до початку безпосередньої розробки.', result: 'Один затверджений візуальний напрямок і структура сайту.', tags: ['Мудборд', 'Структура', 'Візуал'] },
        { title: 'Дизайн і код', text: 'Створюю адаптивний, доступний інтерфейс рівно тієї складності, яку потребує завдання.', result: 'Робочий адаптивний інтерфейс, готовий до перевірки.', tags: ['Вихідний код', 'Репозиторій', 'Адаптив'] },
        { title: 'Контроль якості', text: 'Перевіряю сайт на реальних ширинах, клавіатурою та за швидкістю.', result: 'Список правок і перевірена версія для публікації.', tags: ['Звіт швидкості', 'Доступність', 'Тести'] },
        { title: 'Запуск', text: 'Налаштовую домен, хостинг і базове SEO. Сайт готовий працювати, а не лише виглядати.', result: 'Робочий сайт, підключений до домену.', tags: ['Хостинг', 'Домен', 'SEO'] },
      ],
    },
    about: {
      availability: 'Беру проєкти на осінь 2026', name: 'Данііл Меньшов', role: 'незалежний frontend-розробник із Гданська',
      lede: 'Наймаєш одну людину замість ланцюжка підрядників — і отримуєш сайт, за який хтось реально відповідає.', label: 'ОДНА ЛЮДИНА\nОДИН ВІДПОВІДАЛЬНИЙ КОНТАКТ', essayTitle: 'Проєкт не губиться\nміж', essayAccent: 'ролями.',
      paragraphs: ['Мене звати Данііл Меньшов. Я незалежний frontend-розробник із Гданська і веду проєкт цілком — від першої розмови до публікації. Тому сайт виходить швидше й лишається цілісним: за нього відповідає одна людина.', 'Я не передаю сайт від стратега до дизайнера, потім до розробника й менеджера. Ти спілкуєшся зі мною, а я відповідаю за напрямок, реалізацію та деталі запуску — ніщо не губиться на стику ролей.', 'Найкраще працюю з проєктами, де сайт має конкретну роль: пояснити продукт, упорядкувати пропозицію, побудувати довіру або допомогти клієнту зробити наступний крок.'],
      servicesMeta: 'ПОСЛУГИ', servicesTitle: 'Три формати', servicesAccent: 'роботи.', services: [
        { n: '01', title: 'Лендінг', text: 'Односторінковий сайт з однією ясною метою: пояснити продукт і підштовхнути до дії. Швидкий запуск.' },
        { n: '02', title: 'Багатосторінковий сайт', text: 'Сайт компанії або продукту: структура, розділи, зрозуміла навігація. Щоб пояснити оффер і побудувати довіру.' },
        { n: '03', title: 'Магазин / e-commerce', text: 'Каталог, картки товарів, кошик. Охайна вітрина, що зручно працює в реальному використанні.' },
      ],
      stackMeta: 'ІНСТРУМЕНТИ', stackTitle: 'Технології — це', stackAccent: 'інструмент.', stack: [
        { label: 'Frontend', value: 'HTML · CSS · JavaScript · TypeScript' }, { label: 'Фреймворки', value: 'Astro · Next.js · Tailwind' }, { label: 'Анімація', value: 'CSS motion · WebGL' }, { label: 'Якість', value: 'Доступність · Швидкість · SEO' },
      ], cta: 'Розповісти про проєкт',
    },
    contact: { title: 'Розкажи', titleLine: 'про', accent: 'проєкт.', lede: 'Для початку досить кількох конкретних речень. Відповім особисто — із питаннями або першим напрямком.', honeypot: 'Не заповнюйте', name: 'Ім’я', channel: 'Telegram або email', type: 'Тип проєкту', options: ['Лендінг', 'Багатосторінковий сайт', 'Магазин / e-commerce', 'Особистий бренд', 'Інше'], message: 'Про проєкт', messagePlaceholder: 'Мета сайту, ніша, що має змінитися...', submit: 'Надіслати бриф', quickest: 'НАЙШВИДШИЙ КОНТАКТ', response: 'Відповідаю протягом 24 годин у робочі дні.' },
    case: { allWork: 'Усі роботи', openSite: 'Відкрити сайт', coverAlt: 'Вигляд сайту', context: 'КОНТЕКСТ / РІШЕННЯ / РЕЗУЛЬТАТ', nextAction: 'Наступна дія', backToWork: 'Повернутися до робіт', similarProject: 'Маєш схожий проєкт?' },
    legal: {
      privacyNav: 'Політика конфіденційності', impressumNav: 'Правова інформація',
      privacy: {
        title: 'Політика конфіденційності', updated: 'Останнє оновлення: липень 2026',
        lead: '<p>Ця Політика конфіденційності пояснює, як збираються, використовуються та захищаються твої персональні дані під час відвідування сайту <strong>overflow-web.pl</strong>.</p><p>Як незалежний frontend-розробник, що перебуває в ЄС (Гданськ, Польща), я дбаю про захист твоєї приватності й дотримуюсь Загального регламенту про захист даних (GDPR).</p>',
        sections: [
          { h: '1. Збір і використання даних', html: '<p>Це статичний сайт-портфоліо, дружній до приватності за замовчуванням.</p><ul><li><strong>Без аналітики:</strong> я не використовую Google Analytics, Meta Pixel чи будь-які приховані сторонні скрипти стеження.</li><li><strong>Без реклами:</strong> твої дані ніколи не продаються й не використовуються для маркетингу.</li></ul>' },
          { h: '2. Форма зворотного зв’язку', html: '<p>Після надсилання форми введені дані — ім’я, канал зв’язку (Telegram або email), тип проєкту й текст повідомлення — передаються через серверну функцію Netlify до мого акаунта Telegram виключно для того, щоб я міг відповісти на твій запит. У доставці повідомлення беруть участь сервіси Netlify і Telegram.</p><p>Приховане антиспам-поле («honeypot») допомагає блокувати ботів. Замість форми ти завжди можеш написати мені напряму на email або в Telegram.</p>' },
          { h: '3. Cookie та локальне сховище', html: '<p>Сайт не використовує відстежувальні cookie. Використовується лише <strong>Local Storage</strong> браузера, щоб запам’ятати одне налаштування інтерфейсу:</p><ul><li><code>overflow-theme</code> — обрав ти світлу чи темну тему. Це значення ніколи не залишає твій браузер і недоступне ні мені, ні третім особам.</li></ul>' },
          { h: '4. Прямий зв’язок', html: '<p>Якщо ти зв’язуєшся зі мною електронною поштою (<a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a>) або в Telegram (<a href="https://t.me/zzxvaracaa" target="_blank" rel="noopener">@zzxvaracaa</a>), добровільно надані дані я використовую лише для спілкування та відповіді на твій запит. Я не передаю їх третім особам без твоєї згоди.</p>' },
          { h: '5. Логи сервера', html: '<p>Мій хостинг-провайдер може автоматично записувати стандартні логи доступу до сервера з метою безпеки та продуктивності. Вони можуть тимчасово містити твою IP-адресу, тип браузера й час відвідування. Обробка здійснюється на підставі законного інтересу (ст. 6(1)(f) GDPR).</p>' },
          { h: '6. Твої права', html: '<p>Згідно з GDPR ти маєш право запитати доступ до своїх персональних даних, їх виправлення або видалення. Щоб скористатися цими правами, напиши на <a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a>.</p>' },
        ],
      },
      impressum: {
        title: 'Правова інформація', meta: 'Правова інформація відповідно до європейських вимог прозорості',
        sections: [
          { h: 'Постачальник послуг', html: '<p><strong>Данііл Меньшов</strong><br />Працює під назвою <strong>overflow</strong><br />Незалежний frontend-розробник<br />Гданськ, Польща</p>' },
          { h: 'Контакт', html: '<p>Email: <a href="mailto:overflow.web1@gmail.com">overflow.web1@gmail.com</a><br />Telegram: <a href="https://t.me/zzxvaracaa" target="_blank" rel="noopener">@zzxvaracaa</a></p>' },
          { h: 'Відмова від відповідальності', html: '<p>Вміст цього сайту підготовлено з максимально можливою ретельністю. Проте я не можу гарантувати точність, повноту та актуальність матеріалів. Як постачальник послуг я відповідаю за власний контент згідно із загальними нормами права.</p>' },
          { h: 'Авторські права', html: '<p>Дизайн, код і матеріали, опубліковані на цьому сайті, захищені авторським правом. Будь-яке використання, відтворення чи поширення, прямо не дозволене законом про авторське право, потребує моєї попередньої письмової згоди.</p>' },
          { h: 'Вирішення спорів', html: '<p>Європейська комісія надає <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">платформу онлайн-вирішення спорів (ODR)</a>. Я не зобов’язаний брати участь у розглядах перед споживчим арбітражем і не роблю це добровільно.</p>' },
        ],
      },
    },
  },
};

export function getNewDirectionCopy(lang: Lang): NewDirectionCopy {
  return copy[lang] ?? copy.pl;
}

export function newDirectionPath(lang: Lang, path = ''): string {
  const suffix = path.replace(/^\/+|\/+$/g, '');
  const prefix = lang === 'pl' ? '/new' : `/${lang}/new`;
  return suffix ? `${prefix}/${suffix}/` : `${prefix}/`;
}
