import type { Lang } from '../i18n/ui';

export const newDirectionLanguages = ['pl', 'ru', 'en', 'ua'] as const satisfies readonly Lang[];

type Step = { title: string; text: string };

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
  method: { title: string; accent: string; lede: string; listLabel: string; phases: Step[]; ctaMeta: string; ctaTitle: string; ctaAccent: string; ctaButton: string };
  about: { lede: string; label: string; essayTitle: string; essayAccent: string; paragraphs: string[]; stackMeta: string; stackTitle: string; stackAccent: string; stack: { label: string; value: string }[]; cta: string };
  contact: { title: string; titleLine: string; accent: string; lede: string; honeypot: string; name: string; channel: string; type: string; options: string[]; message: string; messagePlaceholder: string; submit: string; quickest: string; response: string };
  case: { allWork: string; openSite: string; coverAlt: string; context: string; nextAction: string; backToWork: string; similarProject: string };
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
      title: 'Jasny proces.', accent: 'Bez domysłów.', lede: 'Prowadzę projekt osobiście i pokazuję kolejne decyzje po drodze — tak, aby finał nie był niespodzianką.', listLabel: 'Etapy pracy', ctaMeta: 'NA POCZĄTEK WYSTARCZY KRÓTKA ROZMOWA', ctaTitle: 'Masz zadanie?', ctaAccent: 'Ustalmy kierunek.', ctaButton: 'Przejdź do briefu',
      phases: [
        { title: 'Rozmowa', text: 'Zaczynam od celu, odbiorców i ograniczeń. Dobry projekt nie powstaje od wyboru koloru.' },
        { title: 'Kierunek', text: 'Układ, treść i ton wizualny ustawiam zanim zacznie się właściwa budowa.' },
        { title: 'Projektowanie i kod', text: 'Tworzę interfejs responsywny, dostępny i tak lekki, jak wymaga tego zadanie.' },
        { title: 'Kontrola jakości', text: 'Sprawdzam stronę na realnych szerokościach, klawiaturą i pod kątem szybkości.' },
        { title: 'Wdrożenie', text: 'Konfiguruję domenę, hosting i podstawy SEO. Strona jest gotowa do pracy, nie tylko do pokazania.' },
      ],
    },
    about: {
      lede: 'Niezależny frontend developer z Gdańska. Pracuję zdalnie i prowadzę projekty od pierwszej rozmowy do publikacji.', label: 'JEDNA OSOBA\nJEDEN ODPOWIEDZIALNY KONTAKT', essayTitle: 'Projekt nie ginie\nmiędzy', essayAccent: 'rolami.',
      paragraphs: ['Nie przekazuję strony od stratega do designera, potem do developera i dalej do project managera. Rozmawiasz ze mną, a ja odpowiadam za kierunek, wykonanie i szczegóły wdrożenia.', 'Najlepiej czuję się w projektach, w których strona ma konkretną rolę: wyjaśnić produkt, uporządkować ofertę, zbudować zaufanie albo pomóc klientowi wykonać następny krok.'],
      stackMeta: 'NARZĘDZIA', stackTitle: 'Technologia jako', stackAccent: 'narzędzie.', stack: [
        { label: 'Frontend', value: 'HTML · CSS · JavaScript · TypeScript' }, { label: 'Frameworki', value: 'Astro · Next.js · Tailwind' }, { label: 'Animacja', value: 'CSS motion · WebGL' }, { label: 'Wdrożenie', value: 'Netlify · Vercel · GitHub Pages' },
      ], cta: 'Opowiedz o projekcie',
    },
    contact: { title: 'Opowiedz', titleLine: 'o', accent: 'projekcie.', lede: 'Kilka konkretnych zdań wystarczy na start. Odpowiadam osobiście z pytaniami albo wstępnym kierunkiem.', honeypot: 'Nie wypełniaj', name: 'Imię', channel: 'Telegram lub email', type: 'Typ projektu', options: ['Landing page', 'Strona wielostronicowa', 'Sklep / e-commerce', 'Osobista marka', 'Inne'], message: 'O projekcie', messagePlaceholder: 'Cel strony, branża, co ma się zmienić...', submit: 'Wyślij brief', quickest: 'NAJSZYBSZY KONTAKT', response: 'Odpowiadam w ciągu 24 godzin w dni robocze.' },
    case: { allWork: 'Wszystkie prace', openSite: 'Otwórz stronę', coverAlt: 'Widok strony', context: 'KONTEKST / DECYZJE / EFEKT', nextAction: 'Następna akcja', backToWork: 'Wróć do prac', similarProject: 'Masz podobny projekt?' },
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
      title: 'Ясный процесс.', accent: 'Без догадок.', lede: 'Веду проект лично и показываю решения по ходу работы — чтобы финал не оказался сюрпризом.', listLabel: 'Этапы работы', ctaMeta: 'ДЛЯ НАЧАЛА ДОСТАТОЧНО КОРОТКОГО РАЗГОВОРА', ctaTitle: 'Есть задача?', ctaAccent: 'Определим направление.', ctaButton: 'Перейти к брифу',
      phases: [
        { title: 'Разговор', text: 'Начинаю с цели, аудитории и ограничений. Хороший проект не начинается с выбора цвета.' },
        { title: 'Направление', text: 'Структуру, текст и визуальный тон определяю до начала непосредственной разработки.' },
        { title: 'Дизайн и код', text: 'Делаю адаптивный, доступный интерфейс ровно такой сложности, какая нужна задаче.' },
        { title: 'Контроль качества', text: 'Проверяю сайт на реальных ширинах, с клавиатурой и по скорости.' },
        { title: 'Запуск', text: 'Настраиваю домен, хостинг и базовое SEO. Сайт готов работать, а не только выглядеть.' },
      ],
    },
    about: {
      lede: 'Независимый frontend-разработчик из Гданьска. Работаю удалённо и веду проекты от первого разговора до публикации.', label: 'ОДИН ЧЕЛОВЕК\nОДИН ОТВЕТСТВЕННЫЙ КОНТАКТ', essayTitle: 'Проект не теряется\nмежду', essayAccent: 'ролями.',
      paragraphs: ['Я не передаю сайт от стратега дизайнеру, затем разработчику и менеджеру проекта. Ты общаешься со мной, а я отвечаю за направление, реализацию и детали запуска.', 'Лучше всего работаю с проектами, где у сайта есть ясная роль: объяснить продукт, упорядочить предложение, вызвать доверие или помочь клиенту сделать следующий шаг.'],
      stackMeta: 'ИНСТРУМЕНТЫ', stackTitle: 'Технологии — это', stackAccent: 'инструмент.', stack: [
        { label: 'Frontend', value: 'HTML · CSS · JavaScript · TypeScript' }, { label: 'Фреймворки', value: 'Astro · Next.js · Tailwind' }, { label: 'Анимация', value: 'CSS motion · WebGL' }, { label: 'Запуск', value: 'Netlify · Vercel · GitHub Pages' },
      ], cta: 'Рассказать о проекте',
    },
    contact: { title: 'Расскажи', titleLine: 'о', accent: 'проекте.', lede: 'Для начала достаточно нескольких конкретных строк. Отвечу лично — с вопросами или первым направлением.', honeypot: 'Не заполняйте', name: 'Имя', channel: 'Telegram или email', type: 'Тип проекта', options: ['Лендинг', 'Многостраничный сайт', 'Магазин / e-commerce', 'Личный бренд', 'Другое'], message: 'О проекте', messagePlaceholder: 'Цель сайта, ниша, что должно измениться...', submit: 'Отправить бриф', quickest: 'САМЫЙ БЫСТРЫЙ КОНТАКТ', response: 'Отвечаю в течение 24 часов в рабочие дни.' },
    case: { allWork: 'Все работы', openSite: 'Открыть сайт', coverAlt: 'Вид сайта', context: 'КОНТЕКСТ / РЕШЕНИЯ / РЕЗУЛЬТАТ', nextAction: 'Следующее действие', backToWork: 'Вернуться к работам', similarProject: 'Похожий проект?' },
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
      title: 'A clear process.', accent: 'No guesswork.', lede: 'I lead the project personally and share decisions along the way, so the final result is never a surprise.', listLabel: 'Work stages', ctaMeta: 'A SHORT CONVERSATION IS ENOUGH TO START', ctaTitle: 'Have a task?', ctaAccent: 'Let’s define the direction.', ctaButton: 'Go to the brief',
      phases: [
        { title: 'Conversation', text: 'I start with the goal, audience and constraints. A good project does not begin with picking a colour.' },
        { title: 'Direction', text: 'I set the structure, copy and visual tone before the actual build starts.' },
        { title: 'Design and code', text: 'I create a responsive, accessible interface with precisely the complexity the task needs.' },
        { title: 'Quality assurance', text: 'I check the site at real viewport widths, with a keyboard, and for speed.' },
        { title: 'Launch', text: 'I configure the domain, hosting and SEO basics. The site is ready to work, not merely to be shown.' },
      ],
    },
    about: {
      lede: 'An independent frontend developer based in Gdańsk. I work remotely and lead projects from the first conversation to publication.', label: 'ONE PERSON\nONE RESPONSIBLE CONTACT', essayTitle: 'A project does not get lost\nbetween', essayAccent: 'roles.',
      paragraphs: ['I do not pass a website from strategist to designer, then to developer and project manager. You speak with me, and I take responsibility for direction, execution and launch details.', 'I work best on projects where a website has a clear role: explain a product, organise an offer, build trust or help a customer take the next step.'],
      stackMeta: 'TOOLS', stackTitle: 'Technology is a', stackAccent: 'tool.', stack: [
        { label: 'Frontend', value: 'HTML · CSS · JavaScript · TypeScript' }, { label: 'Frameworks', value: 'Astro · Next.js · Tailwind' }, { label: 'Motion', value: 'CSS motion · WebGL' }, { label: 'Deployment', value: 'Netlify · Vercel · GitHub Pages' },
      ], cta: 'Tell me about your project',
    },
    contact: { title: 'Tell me', titleLine: 'about the', accent: 'project.', lede: 'A few specific sentences are enough to start. I’ll reply personally, with questions or an initial direction.', honeypot: 'Do not fill in', name: 'Name', channel: 'Telegram or email', type: 'Project type', options: ['Landing page', 'Multi-page website', 'Shop / e-commerce', 'Personal brand', 'Other'], message: 'About the project', messagePlaceholder: 'Site goal, industry, what should change...', submit: 'Send brief', quickest: 'QUICKEST CONTACT', response: 'I reply within 24 hours on business days.' },
    case: { allWork: 'All work', openSite: 'Open website', coverAlt: 'Website view', context: 'CONTEXT / DECISIONS / OUTCOME', nextAction: 'Next action', backToWork: 'Back to work', similarProject: 'Have a similar project?' },
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
      title: 'Зрозумілий процес.', accent: 'Без здогадок.', lede: 'Веду проєкт особисто й показую рішення в процесі, щоб фінал не став несподіванкою.', listLabel: 'Етапи роботи', ctaMeta: 'ДЛЯ ПОЧАТКУ ДОСТАТНЬО КОРОТКОЇ РОЗМОВИ', ctaTitle: 'Є завдання?', ctaAccent: 'Визначимо напрямок.', ctaButton: 'Перейти до брифу',
      phases: [
        { title: 'Розмова', text: 'Починаю з мети, аудиторії та обмежень. Хороший проєкт не починається з вибору кольору.' },
        { title: 'Напрямок', text: 'Структуру, текст і візуальний тон визначаю до початку безпосередньої розробки.' },
        { title: 'Дизайн і код', text: 'Створюю адаптивний, доступний інтерфейс рівно тієї складності, яку потребує завдання.' },
        { title: 'Контроль якості', text: 'Перевіряю сайт на реальних ширинах, клавіатурою та за швидкістю.' },
        { title: 'Запуск', text: 'Налаштовую домен, хостинг і базове SEO. Сайт готовий працювати, а не лише виглядати.' },
      ],
    },
    about: {
      lede: 'Незалежний frontend-розробник із Гданська. Працюю віддалено й веду проєкти від першої розмови до публікації.', label: 'ОДНА ЛЮДИНА\nОДИН ВІДПОВІДАЛЬНИЙ КОНТАКТ', essayTitle: 'Проєкт не губиться\nміж', essayAccent: 'ролями.',
      paragraphs: ['Я не передаю сайт від стратега до дизайнера, потім до розробника й менеджера проєкту. Ти спілкуєшся зі мною, а я відповідаю за напрямок, реалізацію та деталі запуску.', 'Найкраще працюю з проєктами, де сайт має конкретну роль: пояснити продукт, упорядкувати пропозицію, побудувати довіру або допомогти клієнту зробити наступний крок.'],
      stackMeta: 'ІНСТРУМЕНТИ', stackTitle: 'Технології — це', stackAccent: 'інструмент.', stack: [
        { label: 'Frontend', value: 'HTML · CSS · JavaScript · TypeScript' }, { label: 'Фреймворки', value: 'Astro · Next.js · Tailwind' }, { label: 'Анімація', value: 'CSS motion · WebGL' }, { label: 'Запуск', value: 'Netlify · Vercel · GitHub Pages' },
      ], cta: 'Розповісти про проєкт',
    },
    contact: { title: 'Розкажи', titleLine: 'про', accent: 'проєкт.', lede: 'Для початку досить кількох конкретних речень. Відповім особисто — із питаннями або першим напрямком.', honeypot: 'Не заповнюйте', name: 'Ім’я', channel: 'Telegram або email', type: 'Тип проєкту', options: ['Лендінг', 'Багатосторінковий сайт', 'Магазин / e-commerce', 'Особистий бренд', 'Інше'], message: 'Про проєкт', messagePlaceholder: 'Мета сайту, ніша, що має змінитися...', submit: 'Надіслати бриф', quickest: 'НАЙШВИДШИЙ КОНТАКТ', response: 'Відповідаю протягом 24 годин у робочі дні.' },
    case: { allWork: 'Усі роботи', openSite: 'Відкрити сайт', coverAlt: 'Вигляд сайту', context: 'КОНТЕКСТ / РІШЕННЯ / РЕЗУЛЬТАТ', nextAction: 'Наступна дія', backToWork: 'Повернутися до робіт', similarProject: 'Маєш схожий проєкт?' },
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
