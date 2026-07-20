/**
 * i18n for overflow portfolio v3.
 *
 * Master locale: RU. Production default: PL (no path prefix).
 *
 * Voice: a real solo developer talking — not an agency, studio or AI.
 * - First person, present tense, short sentences, plain words.
 * - Say it the way you'd say it out loud. Cut filler, cut polish.
 * - No marketing gloss, no "we", no studio-speak. Numbers over vague quantifiers.
 */

export const languages = {
  pl: 'Polski',
  ru: 'Русский',
  en: 'English',
  ua: 'Українська',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'pl';
export const masterLang: Lang = 'ru';

/* ──────────────────────────────────────────── RU master ─── */
const ru = {
  /* ─── Brand / identity ─── */
  'brand.name':            'overflow',
  'brand.tagline.short':   'Frontend разработка',

  /* ─── Nav ─── */
  'nav.method':            'Процесс',
  'nav.work':              'Работы',
  'nav.bots':              'Боты',
  'nav.about':             'Обо мне',
  'nav.contact':           'Контакт',

  /* ─── Common ─── */
  'common.read':           'Открыть проект →',
  'common.read.short':     'Открыть →',
  'common.visit':          'Открыть сайт →',
  'common.back.home':      'На главную →',

  /* ─── SEO / a11y ─── */
  'seo.home.title':        'overflow — Frontend-разработка под бизнес-задачи',
  'a11y.skip':             'К содержимому',

  /* ─── Hero (homepage) ─── */
  'hero.eyebrow':          'FRONTEND DEVELOPMENT · 2026',
  'hero.h1.line1':         'Разрабатываю сайты',
  'hero.h1.line2':         'под бизнес-задачи.',
  'hero.sub':              'Лендинги, многостраничники, небольшие магазины. Делаю один — от задачи до запуска. Чисто, быстро, без лишнего.',
  'hero.hook':             'Все работы ниже ↓',

  /* ─── Gallery (homepage) ─── */
  'gallery.eyebrow':       'РАБОТЫ',
  'gallery.intro.p1':      'Проекты в разных нишах. У каждого своя задача и своя аудитория.',
  'gallery.intro.p2':      'Открой любой — видно, как решал.',
  'gallery.see.all':       'Открыть все →',

  /* ─── About compact (homepage) ─── */
  'about.compact.eyebrow': 'ОБО МНЕ',
  'about.compact.h2':      'Daniil Menshov.',
  'about.compact.body.p1': 'Frontend-разработчик. Веду проект один — от первого разговора до сайта на боевом домене.',
  'about.compact.body.p2': 'Без агентских наценок, без передачи между людьми, без «это не моя зона».',
  'about.compact.cta':     'Подробнее →',

  /* ─── Contact teaser (homepage) ─── */
  'contact.teaser.eyebrow': 'РАБОТА',
  'contact.teaser.h2':      'Есть проект — расскажи.',
  'contact.teaser.sub':     'Напиши пару строк о задаче — отвечу за день: вопросами или прикидкой по срокам. Быстрее всего — в Telegram.',
  'contact.teaser.cta1':    'Заполнить бриф →',
  'contact.teaser.cta2':    'Открыть Telegram',
  'contact.teaser.cta3':    'overflow.web1@gmail.com',

  /* ─── Footer ─── */
  'footer.col.nav':         'Навигация',
  'footer.col.contact':     'Контакт',
  'footer.desc':            'Frontend-разработка для бизнеса. Лендинги, multipage, небольшие интернет-магазины.',
  'footer.contact.tg':      'Telegram',
  'footer.contact.mail':    'overflow.web1@gmail.com',
  'footer.contact.ig':      'Instagram @overflow.web',
  'footer.copy':            '© 2026 overflow',

  /* ─── /work page ─── */
  'work.eyebrow':           'РАБОТЫ',
  'work.h1':                'Избранные проекты.',
  'work.sub':               'Разные ниши — лендинги, multipage, e-commerce. У каждой свои ограничения. Открой любую — видно, как сделано.',
  'work.filter.all':        'Все',
  'work.filter.saas':       'B2B SaaS',
  'work.filter.ecom':       'E-commerce',
  'work.filter.services':   'Services',
  'work.filter.cultural':   'Cultural / Event',
  'work.filter.multipage':  'Multipage',

  /* ─── /method page (now "Процесс" — personal workflow) ─── */
  'method.eyebrow':         'ПРОЦЕСС · 10 ЭТАПОВ',
  'method.h1':              'Как я работаю.',
  'method.sub':              'Каждый сайт веду через десять шагов. Не жёсткий регламент, а порядок, который убирает большую часть проблем заранее.',
  'method.intro':           'Ниже — что делаю на каждом этапе и зачем. После брифа согласовываем каждый следующий шаг, чтобы итог не был сюрпризом.',
  'method.what':            'Что делаю',
  'method.how':             'Как именно',
  'method.failures':        'Что обычно ломается, если пропустить',
  'method.practice':        'На практике',
  'method.more':            'Подробнее',
  'method.cta.h':           'Есть проект?',
  'method.cta.body':        'Напиши пару строк о задаче — отвечу за день: вопросами или прикидкой по срокам.',
  'method.cta.btn':         'Заполнить бриф →',

  /* ─── /about page ─── */
  'about.eyebrow':          'ОБО МНЕ',
  'about.h1':               'Daniil Menshov.',
  'about.sub':              'Frontend-разработчик. Живу в Гданьске. Работаю один.',

  'about.s1.h':             'Bio',
  'about.s1.body':          'Сайты — мой фокус последние полтора года: лендинги, multipage, небольшие магазины. Веду проект целиком — от первого разговора до деплоя на боевой домен. Один, без передачи между людьми и «это не моя зона».',

  'about.s4.h':             'Как работаю',
  'about.s4.body':          'Сначала разбираюсь в нише и аудитории, потом структура и тексты, потом дизайн, потом код. На каждом шаге показываю и согласовываем. Никаких сюрпризов в конце.',

  'about.s5.h':             'Что не беру',
  'about.s5.body.b1':       'Проекты, где принесли готовый дизайн и хотят «просто закодить» без обсуждения. Без начального анализа результат хуже, чем мог бы быть.',
  'about.s5.body.b2':       'E-commerce больше 500 SKU — нужен другой стек и команда.',
  'about.s5.body.b3':       'Subcontracting для креативных агентств — они продают другое, и это будет компромисс для всех.',
  'about.s5.body.b4':       'Срочные задачи «нужно вчера». Качественный сайт требует времени на анализ и согласования.',

  'about.s6.h':             'Стек',
  'about.s6.body.intro':    'Инструменты, с которыми работаю.',
  'about.s6.lang.label':    'Языки',
  'about.s6.lang.value':    'HTML · CSS · JavaScript · TypeScript',
  'about.s6.fw.label':      'Фреймворки',
  'about.s6.fw.value':      'Astro · Next.js · Tailwind',
  'about.s6.anim.label':    'Анимация',
  'about.s6.anim.value':    'GSAP · CSS-анимации',
  'about.s6.deploy.label':  'Деплой и хостинг',
  'about.s6.deploy.value':  'GitHub Pages · Netlify · Vercel',
  'about.s6.outro':         'Стек — инструмент, не самоцель. Под каждый проект свой: лендингу не нужна тяжёлая SPA, магазину — лишний JavaScript.',

  'about.cta':              'Подходит — расскажи о проекте →',

  /* ─── /contact page ─── */
  'contact.eyebrow':        'КОНТАКТ',
  'contact.h1':             'Расскажи о проекте.',
  'contact.sub':            'Пять полей, 3-5 минут. Отвечу за день — вопросами или прикидкой по срокам и цене.',
  'contact.response':       'Ответ в течение 24 часов · пн-пт',

  'contact.form.name':      'Имя',
  'contact.form.contact':   'Telegram или email',
  'contact.form.niche':     'Ниша проекта',
  'contact.form.niche.saas':       'B2B SaaS',
  'contact.form.niche.ecom':       'E-commerce',
  'contact.form.niche.services':   'Услуги / Coaching',
  'contact.form.niche.personal':   'Personal brand',
  'contact.form.niche.cultural':   'Cultural / Event',
  'contact.form.niche.multipage':  'Multipage / Content site',
  'contact.form.niche.bot':        'Telegram-бот',
  'contact.form.niche.other':      'Другое',
  'contact.form.link':      'Текущий сайт (если есть)',
  'contact.form.desc':      'Опиши проект в 2-3 предложениях. Чем конкретнее — тем точнее ответ.',
  'contact.form.submit':    'Отправить бриф',
  'contact.form.note':      'Форма отправляется на email. Если срочно — Telegram.',

  'contact.alt.title':      'Прямые каналы',
  'contact.alt.tg':         'Telegram — самый быстрый',
  'contact.alt.mail':       'overflow.web1@gmail.com',
  'contact.alt.ig':         'Instagram @overflow.web',

  'contact.faq.title':      'FAQ',
  'contact.faq.q1':         'Как выглядит процесс?',
  'contact.faq.a1':         'Бриф → анализ задачи и конкурентов → 2-3 варианта концепции → утверждение направления → структура и тексты → дизайн → код → контроль качества → сдача. Согласование результата на каждом этапе.',
  'contact.faq.q2':         'Какие сроки?',
  'contact.faq.a2':         'Лендинг — 7-14 дней от подтверждённого брифа. Multipage — 3-4 недели. Полный аудит + переделка существующего — 5-10 дней в зависимости от масштаба.',
  'contact.faq.q3':         'Как выглядит оплата?',
  'contact.faq.a3':         'Без фиксированного прайса. Цена зависит от объёма и сложности — обсуждаем после твоего брифа и моего ответа. Стандартная схема — этапная: часть перед стартом, часть после сдачи.',
  'contact.faq.q4':         'Хостинг и домен?',
  'contact.faq.a4':         'Полная настройка в цене — домен, SSL, deployment, базовое SEO. Сайт после сдачи готов к запуску.',
  'contact.faq.q5':         'Что если потом нужно будет менять контент?',
  'contact.faq.a5':         'Два варианта: прямое редактирование в markdown/HTML файлах (с инструкцией) или лёгкий CMS (Decap, Sanity) — обсуждаем на этапе выбора стека.',
  'contact.faq.q6':         'Подойдёт ли мой проект?',
  'contact.faq.a6':         'Подходит, если проект коммерческий и есть понимание целевой аудитории. Не беру задачи «закодировать готовый дизайн без обсуждения» — нужен начальный анализ, иначе сайт получится хуже, чем мог бы быть.',

  /* ─── 404 ─── */
  'e404.h1':                '404. Здесь ничего нет.',
  'e404.sub':               'Эта страница не существует или была удалена.',
  'e404.cta.home':          'На главную →',
  'e404.cta.work':          'Все работы →',

  /* ─── /bots page (Telegram bots service) ─── */
  'bots.eyebrow':           'TELEGRAM-БОТЫ · 2026',
  'bots.h1':                'Делаю Telegram-ботов.',
  'bots.sub':               'Боты, которые принимают заявки, ведут запись и отвечают за тебя. Делаю сам — под твою задачу и твои инструменты.',
  'bots.hero.cta':          'Обсудить бота →',

  'bots.what.eyebrow':      'ЧТО СОБИРАЮ',
  'bots.what.h2':           'Что умеет бот.',
  'bots.cap1.h':            'Заявки и лиды',
  'bots.cap1.d':            'Бот собирает заявки прямо в чате и шлёт их тебе, в таблицу или CRM. Ничего не теряется.',
  'bots.cap2.h':            'Запись и напоминания',
  'bots.cap2.d':            'Клиент выбирает слот, бот подтверждает и напоминает перед визитом.',
  'bots.cap3.h':            'Авто-ответы и FAQ',
  'bots.cap3.d':            'Отвечает на частые вопросы круглосуточно, передаёт тебе только важное.',
  'bots.cap4.h':            'Уведомления',
  'bots.cap4.d':            'Заказы, оплаты, заявки — сразу в Telegram, без задержек.',
  'bots.cap5.h':            'Мини-магазин с оплатой',
  'bots.cap5.d':            'Каталог, корзина и оплата внутри бота. Заказ закрывается, не выходя из чата.',
  'bots.cap6.h':            'Telegram Mini App',
  'bots.cap6.d':            'Полноценное приложение внутри Telegram, когда простого бота мало.',

  'bots.how.eyebrow':       'КАК РАБОТАЮ',
  'bots.how.h2':            'Один, без агентства.',
  'bots.how.p1':            'Делаю сам — от сценария до запуска. Подключаю к тому, что у тебя уже есть: Google Sheets, CRM, платёжки.',
  'bots.how.p2':            'Разворачиваю на сервере, отдаю с короткой инструкцией. Дальше бот работает без меня — а я на связи.',

  'bots.steps.eyebrow':     'КАК ИДЁМ',
  'bots.step1.h':           'Задача',
  'bots.step1.d':           'Списываемся: что бот должен делать и куда складывать данные.',
  'bots.step2.h':           'Сборка',
  'bots.step2.d':           'Пишу сценарий и логику, подключаю интеграции, проверяю на реальных кейсах.',
  'bots.step3.h':           'Запуск',
  'bots.step3.d':           'Выкатываю, отдаю доступы и инструкцию. Правки по ходу — на связи.',

  'bots.cta.h':             'Нужен бот?',
  'bots.cta.body':          'Напиши пару строк о задаче — отвечу за день: вопросами или прикидкой по срокам.',
  'bots.cta.btn':           'Обсудить задачу →',

  /* ─── Case study labels (used in /work/[slug] template) ─── */
  'case.niche':             'Ниша',
  'case.year':              'Год',
  'case.region':            'Регион',
  'case.palette':           'Палитра',
  'case.tech':              'Стек',
  'case.site':              'Live site',
  'case.tagline':           'Tagline',
  'case.summary':           'Резюме',
  'case.back':              '← Все работы',
} as const;

/* ──────────────────────────────────────────── Type ─── */
type Dict = { [K in keyof typeof ru]?: string };

/* ──────────────────────────────────────────── PL (production default) ─── */
const pl: Dict = {
  /* Brand / identity */
  'brand.name':            'overflow',
  'brand.tagline.short':   'Frontend development',

  /* Nav */
  'nav.method':            'Proces',
  'nav.work':              'Prace',
  'nav.bots':              'Boty',
  'nav.about':             'O mnie',
  'nav.contact':           'Kontakt',

  /* Common */
  'common.read':           'Otwórz projekt →',
  'common.read.short':     'Otwórz →',
  'common.visit':          'Otwórz stronę →',
  'common.back.home':      'Na stronę główną →',

  /* ─── SEO / a11y ─── */
  'seo.home.title':        'overflow — Frontend development dla biznesu',
  'a11y.skip':             'Do treści',

  /* Hero */
  'hero.eyebrow':          'FRONTEND DEVELOPMENT · 2026',
  'hero.h1.line1':         'Tworzę strony',
  'hero.h1.line2':         'pod cele biznesowe.',
  'hero.sub':              'Lendingi, strony wielostronicowe, mniejsze sklepy. Robię sam — od zadania po uruchomienie. Czysto, szybko, bez zbędnych rzeczy.',
  'hero.hook':             'Wszystkie prace niżej ↓',

  /* Gallery */
  'gallery.eyebrow':       'PRACE',
  'gallery.intro.p1':      'Projekty w różnych niszach. Każdy ma własne zadanie i własnych odbiorców.',
  'gallery.intro.p2':      'Otwórz dowolny — widać, jak go rozwiązałem.',
  'gallery.see.all':       'Otwórz wszystkie →',

  /* About compact */
  'about.compact.eyebrow': 'O MNIE',
  'about.compact.h2':      'Daniil Menshov.',
  'about.compact.body.p1': 'Frontend developer. Prowadzę projekt sam — od pierwszej rozmowy po stronę na produkcyjnej domenie.',
  'about.compact.body.p2': 'Bez narzutów agencyjnych, bez przekazań między ludźmi, bez „to nie moja działka".',
  'about.compact.cta':     'Więcej →',

  /* Contact teaser */
  'contact.teaser.eyebrow': 'WSPÓŁPRACA',
  'contact.teaser.h2':      'Masz projekt — opowiedz.',
  'contact.teaser.sub':     'Napisz parę zdań o zadaniu — odpowiem w ciągu dnia: pytaniami albo szacunkiem terminu. Najszybciej — na Telegramie.',
  'contact.teaser.cta1':    'Wypełnij brief →',
  'contact.teaser.cta2':    'Otwórz Telegram',
  'contact.teaser.cta3':    'overflow.web1@gmail.com',

  /* Footer */
  'footer.col.nav':         'Nawigacja',
  'footer.col.contact':     'Kontakt',
  'footer.desc':            'Frontend development dla biznesu. Lendingi, multipage, mniejsze sklepy internetowe.',
  'footer.contact.tg':      'Telegram',
  'footer.contact.mail':    'overflow.web1@gmail.com',
  'footer.contact.ig':      'Instagram @overflow.web',
  'footer.copy':            '© 2026 overflow',

  /* /work */
  'work.eyebrow':           'PRACE',
  'work.h1':                'Wybrane projekty.',
  'work.sub':               'Różne nisze — lendingi, multipage, e-commerce. Każda ma własne ograniczenia. Otwórz dowolną — widać, jak zrobiona.',
  'work.filter.all':        'Wszystkie',
  'work.filter.saas':       'B2B SaaS',
  'work.filter.ecom':       'E-commerce',
  'work.filter.services':   'Usługi',
  'work.filter.cultural':   'Cultural / Event',
  'work.filter.multipage':  'Multipage',

  /* /method */
  'method.eyebrow':         'PROCES · 10 ETAPÓW',
  'method.h1':              'Jak pracuję.',
  'method.sub':             'Każdą stronę prowadzę przez dziesięć kroków. Nie sztywny regulamin, a kolejność, która usuwa większość problemów z wyprzedzeniem.',
  'method.intro':           'Poniżej — co robię na każdym etapie i po co. Po briefie ustalamy każdy kolejny krok, żeby wynik nie był niespodzianką.',
  'method.what':            'Co robię',
  'method.how':             'Jak dokładnie',
  'method.failures':        'Co zwykle się psuje, jeśli pominąć',
  'method.practice':        'W praktyce',
  'method.more':            'Więcej',
  'method.cta.h':           'Masz projekt?',
  'method.cta.body':        'Napisz parę zdań o zadaniu — odpowiem w ciągu dnia: pytaniami albo szacunkiem terminu.',
  'method.cta.btn':         'Wypełnij brief →',

  /* /about */
  'about.eyebrow':          'O MNIE',
  'about.h1':               'Daniil Menshov.',
  'about.sub':              'Frontend developer. Mieszkam w Gdańsku. Pracuję sam.',

  'about.s1.h':             'Bio',
  'about.s1.body':          'Strony to mój fokus od półtora roku: lendingi, multipage, mniejsze sklepy. Prowadzę projekt w całości — od pierwszej rozmowy po deploy na produkcyjnej domenie. Sam, bez przekazań między ludźmi i „to nie moja działka".',

  'about.s4.h':             'Jak pracuję',
  'about.s4.body':          'Najpierw rozumiem niszę i odbiorców, potem struktura i teksty, potem design, potem kod. Na każdym kroku pokazuję i ustalamy. Żadnych niespodzianek na końcu.',

  'about.s5.h':             'Czego nie biorę',
  'about.s5.body.b1':       'Projekty, gdzie przyniesiono gotowy design i chcą „po prostu zakodować" bez rozmowy. Bez początkowej analizy rezultat jest gorszy, niż mógłby być.',
  'about.s5.body.b2':       'E-commerce powyżej 500 SKU — potrzebny inny stack i zespół.',
  'about.s5.body.b3':       'Subcontracting dla agencji kreatywnych — sprzedają coś innego, i będzie to kompromis dla wszystkich.',
  'about.s5.body.b4':       'Zadania „na wczoraj". Dobra strona wymaga czasu na analizę i uzgodnienia.',

  'about.s6.h':             'Stack',
  'about.s6.body.intro':    'Narzędzia, z którymi pracuję.',
  'about.s6.lang.label':    'Języki',
  'about.s6.lang.value':    'HTML · CSS · JavaScript · TypeScript',
  'about.s6.fw.label':      'Frameworki',
  'about.s6.fw.value':      'Astro · Next.js · Tailwind',
  'about.s6.anim.label':    'Animacja',
  'about.s6.anim.value':    'GSAP · animacje CSS',
  'about.s6.deploy.label':  'Deploy i hosting',
  'about.s6.deploy.value':  'GitHub Pages · Netlify · Vercel',
  'about.s6.outro':         'Stack to narzędzie, nie cel. Pod każdy projekt inny: lendingowi nie trzeba ciężkiej SPA, sklepowi — zbędnego JavaScriptu.',

  'about.cta':              'Pasuje — opowiedz o projekcie →',

  /* /contact */
  'contact.eyebrow':        'KONTAKT',
  'contact.h1':             'Opowiedz o projekcie.',
  'contact.sub':            'Pięć pól, 3-5 minut. Odpowiem w ciągu dnia — pytaniami albo szacunkiem terminu i ceny.',
  'contact.response':       'Odpowiedź w ciągu 24 godzin · pn–pt',

  'contact.form.name':      'Imię',
  'contact.form.contact':   'Telegram lub email',
  'contact.form.niche':     'Nisza projektu',
  'contact.form.niche.saas':       'B2B SaaS',
  'contact.form.niche.ecom':       'E-commerce',
  'contact.form.niche.services':   'Usługi / Coaching',
  'contact.form.niche.personal':   'Personal brand',
  'contact.form.niche.cultural':   'Cultural / Event',
  'contact.form.niche.multipage':  'Multipage / Content site',
  'contact.form.niche.bot':        'Telegram-bot',
  'contact.form.niche.other':      'Inne',
  'contact.form.link':      'Aktualna strona (jeśli jest)',
  'contact.form.desc':      'Opisz projekt w 2-3 zdaniach. Im konkretniej — tym dokładniejsza odpowiedź.',
  'contact.form.submit':    'Wyślij brief',
  'contact.form.note':      'Formularz wysyła na email. Jeśli pilnie — Telegram.',

  'contact.alt.title':      'Bezpośrednie kanały',
  'contact.alt.tg':         'Telegram — najszybszy',
  'contact.alt.mail':       'overflow.web1@gmail.com',
  'contact.alt.ig':         'Instagram @overflow.web',

  'contact.faq.title':      'FAQ',
  'contact.faq.q1':         'Jak wygląda proces?',
  'contact.faq.a1':         'Brief → analiza zadania i konkurencji → 2-3 warianty koncepcji → potwierdzenie kierunku → struktura i teksty → design → kod → kontrola jakości → przekazanie. Akceptacja rezultatu na każdym etapie.',
  'contact.faq.q2':         'Jakie terminy?',
  'contact.faq.a2':         'Lending — 7-14 dni od potwierdzonego briefu. Multipage — 3-4 tygodnie. Pełny audyt + przebudowa istniejącej — 5-10 dni w zależności od skali.',
  'contact.faq.q3':         'Jak wygląda płatność?',
  'contact.faq.a3':         'Bez stałego cennika. Cena zależy od skali i złożoności — omawiamy po twoim briefie i mojej odpowiedzi. Standardowy schemat — etapowy: część przed startem, część po oddaniu.',
  'contact.faq.q4':         'Hosting i domena?',
  'contact.faq.a4':         'Pełna konfiguracja w cenie — domena, SSL, deployment, podstawowe SEO. Strona po przekazaniu gotowa do uruchomienia.',
  'contact.faq.q5':         'Co jeśli potem trzeba będzie zmienić treść?',
  'contact.faq.a5':         'Dwie opcje: bezpośrednia edycja w plikach markdown/HTML (z instrukcją) lub lekki CMS (Decap, Sanity) — omawiamy na etapie wyboru stacka.',
  'contact.faq.q6':         'Czy mój projekt pasuje?',
  'contact.faq.a6':         'Pasuje, jeśli projekt jest komercyjny i jest zrozumienie grupy odbiorców. Nie biorę zadań „zakoduj gotowy design bez rozmowy" — potrzebna jest początkowa analiza, bo inaczej strona wyjdzie gorzej, niż mogłaby.',

  /* 404 */
  'e404.h1':                '404. Tu nic nie ma.',
  'e404.sub':               'Ta strona nie istnieje lub została usunięta.',
  'e404.cta.home':          'Na stronę główną →',
  'e404.cta.work':          'Wszystkie prace →',

  /* ─── /bots page (Telegram bots service) ─── */
  'bots.eyebrow':           'TELEGRAM-BOTY · 2026',
  'bots.h1':                'Robię boty na Telegramie.',
  'bots.sub':               'Boty, które przyjmują zgłoszenia, prowadzą zapisy i odpowiadają za ciebie. Robię sam — pod twoje zadanie i twoje narzędzia.',
  'bots.hero.cta':          'Omówić bota →',

  'bots.what.eyebrow':      'CO ROBIĘ',
  'bots.what.h2':           'Co potrafi bot.',
  'bots.cap1.h':            'Zgłoszenia i leady',
  'bots.cap1.d':            'Bot zbiera zgłoszenia w czacie i wysyła je do ciebie, do arkusza albo CRM. Nic nie ginie.',
  'bots.cap2.h':            'Zapisy i przypomnienia',
  'bots.cap2.d':            'Klient wybiera termin, bot potwierdza i przypomina przed wizytą.',
  'bots.cap3.h':            'Auto-odpowiedzi i FAQ',
  'bots.cap3.d':            'Odpowiada na częste pytania całą dobę, przekazuje ci tylko to, co ważne.',
  'bots.cap4.h':            'Powiadomienia',
  'bots.cap4.d':            'Zamówienia, płatności, zgłoszenia — od razu na Telegramie, bez opóźnień.',
  'bots.cap5.h':            'Mini-sklep z płatnością',
  'bots.cap5.d':            'Katalog, koszyk i płatność w bocie. Zamówienie domyka się bez wychodzenia z czatu.',
  'bots.cap6.h':            'Telegram Mini App',
  'bots.cap6.d':            'Pełna aplikacja wewnątrz Telegrama, gdy zwykły bot to za mało.',

  'bots.how.eyebrow':       'JAK PRACUJĘ',
  'bots.how.h2':            'Sam, bez agencji.',
  'bots.how.p1':            'Robię sam — od scenariusza po uruchomienie. Podłączam do tego, co już masz: Google Sheets, CRM, bramki płatności.',
  'bots.how.p2':            'Stawiam na serwerze, oddaję z krótką instrukcją. Dalej bot działa beze mnie — a ja jestem na kontakcie.',

  'bots.steps.eyebrow':     'JAK TO IDZIE',
  'bots.step1.h':           'Zadanie',
  'bots.step1.d':           'Ustalamy: co bot ma robić i gdzie odkładać dane.',
  'bots.step2.h':           'Budowa',
  'bots.step2.d':           'Piszę scenariusz i logikę, podłączam integracje, sprawdzam na realnych przypadkach.',
  'bots.step3.h':           'Uruchomienie',
  'bots.step3.d':           'Wdrażam, przekazuję dostępy i instrukcję. Poprawki na bieżąco — jestem na kontakcie.',

  'bots.cta.h':             'Potrzebujesz bota?',
  'bots.cta.body':          'Napisz parę zdań o zadaniu — odpowiem w ciągu dnia: pytaniami albo szacunkiem terminu.',
  'bots.cta.btn':           'Omówić zadanie →',

  /* Case labels */
  'case.niche':             'Nisza',
  'case.year':              'Rok',
  'case.region':            'Region',
  'case.palette':           'Paleta',
  'case.tech':              'Stack',
  'case.site':              'Live site',
  'case.tagline':           'Tagline',
  'case.summary':           'Streszczenie',
  'case.back':              '← Wszystkie prace',
};

/* ──────────────────────────────────────────── EN ─── */
const en: Dict = {
  /* Brand / identity */
  'brand.name':            'overflow',
  'brand.tagline.short':   'Frontend development',

  /* Nav */
  'nav.method':            'Process',
  'nav.work':              'Work',
  'nav.bots':              'Bots',
  'nav.about':             'About',
  'nav.contact':           'Contact',

  /* Common */
  'common.read':           'Open project →',
  'common.read.short':     'Open →',
  'common.visit':          'Visit site →',
  'common.back.home':      'Back home →',

  /* ─── SEO / a11y ─── */
  'seo.home.title':        'overflow — Frontend development for business',
  'a11y.skip':             'Skip to content',

  /* Hero */
  'hero.eyebrow':          'FRONTEND DEVELOPMENT · 2026',
  'hero.h1.line1':         'I build websites',
  'hero.h1.line2':         'for business goals.',
  'hero.sub':              'Landings, multipage sites, small shops. I do it solo — from the brief to launch. Clean, fast, nothing extra.',
  'hero.hook':             'All work below ↓',

  /* Gallery */
  'gallery.eyebrow':       'WORK',
  'gallery.intro.p1':      'Projects across niches. Each has its own task and its own audience.',
  'gallery.intro.p2':      'Open any — you\'ll see how I solved it.',
  'gallery.see.all':       'Open all →',

  /* About compact */
  'about.compact.eyebrow': 'ABOUT',
  'about.compact.h2':      'Daniil Menshov.',
  'about.compact.body.p1': 'Frontend developer. I run the project solo — from the first conversation to the site on a live domain.',
  'about.compact.body.p2': 'No agency markup, no handoffs between people, no "not my job".',
  'about.compact.cta':     'More →',

  /* Contact teaser */
  'contact.teaser.eyebrow': 'WORK WITH ME',
  'contact.teaser.h2':      'Have a project — tell me.',
  'contact.teaser.sub':     'Drop a couple of lines about the task — I\'ll reply within a day: questions or a rough timeline. Fastest on Telegram.',
  'contact.teaser.cta1':    'Send a brief →',
  'contact.teaser.cta2':    'Open Telegram',
  'contact.teaser.cta3':    'overflow.web1@gmail.com',

  /* Footer */
  'footer.col.nav':         'Navigation',
  'footer.col.contact':     'Contact',
  'footer.desc':            'Frontend development for business. Landings, multipage, small e-commerce.',
  'footer.contact.tg':      'Telegram',
  'footer.contact.mail':    'overflow.web1@gmail.com',
  'footer.contact.ig':      'Instagram @overflow.web',
  'footer.copy':            '© 2026 overflow',

  /* /work */
  'work.eyebrow':           'WORK',
  'work.h1':                'Selected projects.',
  'work.sub':               'Different niches — landings, multipage, e-commerce. Each with its own constraints. Open any — you\'ll see how it\'s made.',
  'work.filter.all':        'All',
  'work.filter.saas':       'B2B SaaS',
  'work.filter.ecom':       'E-commerce',
  'work.filter.services':   'Services',
  'work.filter.cultural':   'Cultural / Event',
  'work.filter.multipage':  'Multipage',

  /* /method */
  'method.eyebrow':         'PROCESS · 10 STEPS',
  'method.h1':              'How I work.',
  'method.sub':             'I take every site through ten steps. Not a rigid rulebook — an order that removes most problems before they show up.',
  'method.intro':           'Below — what I do at each step and why. After the brief we sign off each next step, so the result isn\'t a surprise.',
  'method.what':            'What I do',
  'method.how':             'How exactly',
  'method.failures':        'What usually breaks if you skip this',
  'method.practice':        'In practice',
  'method.more':            'Details',
  'method.cta.h':           'Have a project?',
  'method.cta.body':        'Drop a couple of lines about the task — I\'ll reply within a day: questions or a rough timeline.',
  'method.cta.btn':         'Send a brief →',

  /* /about */
  'about.eyebrow':          'ABOUT',
  'about.h1':               'Daniil Menshov.',
  'about.sub':              'Frontend developer. Based in Gdańsk. I work alone.',

  'about.s1.h':             'Bio',
  'about.s1.body':          'Websites have been my focus for the last year and a half: landings, multipage, small shops. I run the project end to end — from the first conversation to deploy on a live domain. Solo, no handoffs between people and no "not my job".',

  'about.s4.h':             'How I work',
  'about.s4.body':          'First I dig into the niche and audience, then structure and copy, then design, then code. At every step I show it and we agree. No surprises at the end.',

  'about.s5.h':             'What I don\'t take',
  'about.s5.body.b1':       'Projects where someone brings finished design and wants it "just coded" without any discussion. Without initial analysis the result is worse than it could be.',
  'about.s5.body.b2':       'E-commerce above 500 SKU — needs a different stack and a team.',
  'about.s5.body.b3':       'Subcontracting for creative agencies — they sell a different thing, and it\'ll be a compromise for everyone.',
  'about.s5.body.b4':       'Rush "needed yesterday" briefs. A good site needs time for analysis and sign-offs.',

  'about.s6.h':             'Stack',
  'about.s6.body.intro':    'Tools I work with.',
  'about.s6.lang.label':    'Languages',
  'about.s6.lang.value':    'HTML · CSS · JavaScript · TypeScript',
  'about.s6.fw.label':      'Frameworks',
  'about.s6.fw.value':      'Astro · Next.js · Tailwind',
  'about.s6.anim.label':    'Animation',
  'about.s6.anim.value':    'GSAP · CSS animations',
  'about.s6.deploy.label':  'Deploy & hosting',
  'about.s6.deploy.value':  'GitHub Pages · Netlify · Vercel',
  'about.s6.outro':         'The stack is a tool, not the goal. Different for each project: a landing doesn\'t need a heavy SPA, a shop doesn\'t need extra JavaScript.',

  'about.cta':              'Sounds like a fit — tell me about it →',

  /* /contact */
  'contact.eyebrow':        'CONTACT',
  'contact.h1':             'Tell me about the project.',
  'contact.sub':            'Five fields, 3-5 minutes. I\'ll reply within a day — questions or a rough estimate of timing and cost.',
  'contact.response':       'Reply within 24 hours · Mon-Fri',

  'contact.form.name':      'Name',
  'contact.form.contact':   'Telegram or email',
  'contact.form.niche':     'Project niche',
  'contact.form.niche.saas':       'B2B SaaS',
  'contact.form.niche.ecom':       'E-commerce',
  'contact.form.niche.services':   'Services / Coaching',
  'contact.form.niche.personal':   'Personal brand',
  'contact.form.niche.cultural':   'Cultural / Event',
  'contact.form.niche.multipage':  'Multipage / Content site',
  'contact.form.niche.bot':        'Telegram bot',
  'contact.form.niche.other':      'Other',
  'contact.form.link':      'Current site (if any)',
  'contact.form.desc':      'Describe the project in 2-3 sentences. The more specific — the more accurate the reply.',
  'contact.form.submit':    'Send brief',
  'contact.form.note':      'Form sends to email. If urgent — Telegram.',

  'contact.alt.title':      'Direct channels',
  'contact.alt.tg':         'Telegram — fastest',
  'contact.alt.mail':       'overflow.web1@gmail.com',
  'contact.alt.ig':         'Instagram @overflow.web',

  'contact.faq.title':      'FAQ',
  'contact.faq.q1':         'What does the process look like?',
  'contact.faq.a1':         'Brief → analysis of the task and competitors → 2-3 concept variants → direction confirmed → structure and copy → design → code → QA → handoff. Sign-off at every step.',
  'contact.faq.q2':         'What about timelines?',
  'contact.faq.a2':         'Landing — 7-14 days from confirmed brief. Multipage — 3-4 weeks. Full audit + rebuild of existing — 5-10 days depending on scale.',
  'contact.faq.q3':         'What about payment?',
  'contact.faq.a3':         'No fixed price list. Price depends on scope and complexity — we discuss after your brief and my reply. Standard schema is staged: part before start, part after delivery.',
  'contact.faq.q4':         'Hosting and domain?',
  'contact.faq.a4':         'Full setup included — domain, SSL, deployment, basic SEO. Site is launch-ready after handoff.',
  'contact.faq.q5':         'What if I need to change content later?',
  'contact.faq.a5':         'Two options: direct edit in markdown/HTML files (with instructions), or a lightweight CMS (Decap, Sanity) — we decide at the stack selection step.',
  'contact.faq.q6':         'Will my project fit?',
  'contact.faq.a6':         'It fits if the project is commercial and you have a clear sense of the target audience. I don\'t take "just code this finished design without discussion" — initial analysis matters, otherwise the site ends up worse than it could be.',

  /* 404 */
  'e404.h1':                '404. Nothing here.',
  'e404.sub':               'This page doesn\'t exist or was removed.',
  'e404.cta.home':          'Back home →',
  'e404.cta.work':          'All work →',

  /* ─── /bots page (Telegram bots service) ─── */
  'bots.eyebrow':           'TELEGRAM BOTS · 2026',
  'bots.h1':                'I build Telegram bots.',
  'bots.sub':               'Bots that take leads, handle bookings and answer for you. I build them myself — around your task and your tools.',
  'bots.hero.cta':          'Discuss a bot →',

  'bots.what.eyebrow':      'WHAT I BUILD',
  'bots.what.h2':           'What a bot can do.',
  'bots.cap1.h':            'Leads & requests',
  'bots.cap1.d':            'The bot collects requests right in the chat and sends them to you, a sheet or a CRM. Nothing gets lost.',
  'bots.cap2.h':            'Booking & reminders',
  'bots.cap2.d':            'The client picks a slot, the bot confirms and reminds them before the visit.',
  'bots.cap3.h':            'Auto-replies & FAQ',
  'bots.cap3.d':            'Answers common questions around the clock, passes only what matters on to you.',
  'bots.cap4.h':            'Notifications',
  'bots.cap4.d':            'Orders, payments, requests — straight to Telegram, no delay.',
  'bots.cap5.h':            'Mini-shop with payments',
  'bots.cap5.d':            'Catalog, cart and payment inside the bot. The order closes without leaving the chat.',
  'bots.cap6.h':            'Telegram Mini App',
  'bots.cap6.d':            'A full app inside Telegram, when a simple bot is not enough.',

  'bots.how.eyebrow':       'HOW I WORK',
  'bots.how.h2':            'Solo, no agency.',
  'bots.how.p1':            'I build it myself — from the script to launch. I connect to what you already use: Google Sheets, CRM, payment gateways.',
  'bots.how.p2':            'I deploy it on a server and hand it over with a short manual. After that the bot runs without me — and I stay reachable.',

  'bots.steps.eyebrow':     'HOW IT GOES',
  'bots.step1.h':           'The task',
  'bots.step1.d':           'We talk it through: what the bot should do and where to put the data.',
  'bots.step2.h':           'The build',
  'bots.step2.d':           'I write the script and logic, wire up integrations, test on real cases.',
  'bots.step3.h':           'Launch',
  'bots.step3.d':           'I ship it, hand over access and a manual. Tweaks along the way — I am around.',

  'bots.cta.h':             'Need a bot?',
  'bots.cta.body':          'Send a couple of lines about the task — I will reply within a day: questions or a rough timeline.',
  'bots.cta.btn':           'Discuss the task →',

  /* Case labels */
  'case.niche':             'Niche',
  'case.year':              'Year',
  'case.region':            'Region',
  'case.palette':           'Palette',
  'case.tech':              'Stack',
  'case.site':              'Live site',
  'case.tagline':           'Tagline',
  'case.summary':           'Summary',
  'case.back':              '← All work',
};

/* ──────────────────────────────────────────── UA ─── */
const ua: Dict = {
  /* Brand / identity */
  'brand.name':            'overflow',
  'brand.tagline.short':   'Frontend розробка',

  /* Nav */
  'nav.method':            'Процес',
  'nav.work':              'Роботи',
  'nav.bots':              'Боти',
  'nav.about':             'Про мене',
  'nav.contact':           'Контакт',

  /* Common */
  'common.read':           'Відкрити проєкт →',
  'common.read.short':     'Відкрити →',
  'common.visit':          'Відкрити сайт →',
  'common.back.home':      'На головну →',

  /* ─── SEO / a11y ─── */
  'seo.home.title':        'overflow — Frontend-розробка під бізнес-задачі',
  'a11y.skip':             'До вмісту',

  /* Hero */
  'hero.eyebrow':          'FRONTEND DEVELOPMENT · 2026',
  'hero.h1.line1':         'Розробляю сайти',
  'hero.h1.line2':         'під бізнес-задачі.',
  'hero.sub':              'Лендинги, багатосторінкові сайти, невеликі магазини. Роблю сам — від задачі до запуску. Чисто, швидко, без зайвого.',
  'hero.hook':             'Усі роботи нижче ↓',

  /* Gallery */
  'gallery.eyebrow':       'РОБОТИ',
  'gallery.intro.p1':      'Проєкти в різних нішах. У кожного своя задача і своя аудиторія.',
  'gallery.intro.p2':      'Відкрий будь-який — видно, як вирішував.',
  'gallery.see.all':       'Відкрити всі →',

  /* About compact */
  'about.compact.eyebrow': 'ПРО МЕНЕ',
  'about.compact.h2':      'Daniil Menshov.',
  'about.compact.body.p1': 'Frontend-розробник. Веду проєкт сам — від першої розмови до сайту на бойовому домені.',
  'about.compact.body.p2': 'Без агентських націнок, без передач між людьми, без «це не моя зона».',
  'about.compact.cta':     'Детальніше →',

  /* Contact teaser */
  'contact.teaser.eyebrow': 'РОБОТА',
  'contact.teaser.h2':      'Є проєкт — розкажи.',
  'contact.teaser.sub':     'Напиши пару рядків про задачу — відповім за день: питаннями або прикидкою за термінами. Найшвидше — у Telegram.',
  'contact.teaser.cta1':    'Заповнити бриф →',
  'contact.teaser.cta2':    'Відкрити Telegram',
  'contact.teaser.cta3':    'overflow.web1@gmail.com',

  /* Footer */
  'footer.col.nav':         'Навігація',
  'footer.col.contact':     'Контакт',
  'footer.desc':            'Frontend-розробка для бізнесу. Лендинги, multipage, невеликі інтернет-магазини.',
  'footer.contact.tg':      'Telegram',
  'footer.contact.mail':    'overflow.web1@gmail.com',
  'footer.contact.ig':      'Instagram @overflow.web',
  'footer.copy':            '© 2026 overflow',

  /* /work */
  'work.eyebrow':           'РОБОТИ',
  'work.h1':                'Обрані проєкти.',
  'work.sub':               'Різні ніші — лендинги, multipage, e-commerce. У кожної свої обмеження. Відкрий будь-яку — видно, як зроблено.',
  'work.filter.all':        'Усі',
  'work.filter.saas':       'B2B SaaS',
  'work.filter.ecom':       'E-commerce',
  'work.filter.services':   'Послуги',
  'work.filter.cultural':   'Cultural / Event',
  'work.filter.multipage':  'Multipage',

  /* /method */
  'method.eyebrow':         'ПРОЦЕС · 10 ЕТАПІВ',
  'method.h1':              'Як я працюю.',
  'method.sub':             'Кожен сайт веду через десять кроків. Не жорсткий регламент, а порядок, який прибирає більшу частину проблем заздалегідь.',
  'method.intro':           'Нижче — що роблю на кожному етапі і навіщо. Після брифу погоджуємо кожен наступний крок, щоб результат не був сюрпризом.',
  'method.what':            'Що роблю',
  'method.how':             'Як саме',
  'method.failures':        'Що зазвичай ламається, якщо пропустити',
  'method.practice':        'На практиці',
  'method.more':            'Детальніше',
  'method.cta.h':           'Є проєкт?',
  'method.cta.body':        'Напиши пару рядків про задачу — відповім за день: питаннями або прикидкою за термінами.',
  'method.cta.btn':         'Заповнити бриф →',

  /* /about */
  'about.eyebrow':          'ПРО МЕНЕ',
  'about.h1':               'Daniil Menshov.',
  'about.sub':              'Frontend-розробник. Живу в Гданську. Працюю один.',

  'about.s1.h':             'Bio',
  'about.s1.body':          'Сайти — мій фокус останні півтора року: лендинги, multipage, невеликі магазини. Веду проєкт цілком — від першої розмови до деплою на бойовий домен. Сам, без передач між людьми і «це не моя зона».',

  'about.s4.h':             'Як працюю',
  'about.s4.body':          'Спершу розбираюся в ніші й аудиторії, потім структура й тексти, потім дизайн, потім код. На кожному кроці показую і погоджуємо. Жодних сюрпризів наприкінці.',

  'about.s5.h':             'Що не беру',
  'about.s5.body.b1':       'Проєкти, де принесли готовий дизайн і хочуть «просто закодити» без обговорення. Без початкового аналізу результат гірший, ніж міг би бути.',
  'about.s5.body.b2':       'E-commerce більше 500 SKU — потрібен інший стек і команда.',
  'about.s5.body.b3':       'Subcontracting для креативних агенцій — вони продають інше, і це буде компроміс для всіх.',
  'about.s5.body.b4':       'Термінові задачі «треба було вчора». Якісний сайт вимагає часу на аналіз і погодження.',

  'about.s6.h':             'Стек',
  'about.s6.body.intro':    'Інструменти, з якими працюю.',
  'about.s6.lang.label':    'Мови',
  'about.s6.lang.value':    'HTML · CSS · JavaScript · TypeScript',
  'about.s6.fw.label':      'Фреймворки',
  'about.s6.fw.value':      'Astro · Next.js · Tailwind',
  'about.s6.anim.label':    'Анімація',
  'about.s6.anim.value':    'GSAP · CSS-анімації',
  'about.s6.deploy.label':  'Деплой і хостинг',
  'about.s6.deploy.value':  'GitHub Pages · Netlify · Vercel',
  'about.s6.outro':         'Стек — інструмент, не самоціль. Під кожен проєкт свій: лендингу не потрібна важка SPA, магазину — зайвий JavaScript.',

  'about.cta':              'Підходить — розкажи про проєкт →',

  /* /contact */
  'contact.eyebrow':        'КОНТАКТ',
  'contact.h1':             'Розкажи про проєкт.',
  'contact.sub':            'П\'ять полів, 3-5 хвилин. Відповім за день — питаннями або прикидкою за термінами і ціною.',
  'contact.response':       'Відповідь протягом 24 годин · пн–пт',

  'contact.form.name':      'Ім\'я',
  'contact.form.contact':   'Telegram або email',
  'contact.form.niche':     'Ніша проєкту',
  'contact.form.niche.saas':       'B2B SaaS',
  'contact.form.niche.ecom':       'E-commerce',
  'contact.form.niche.services':   'Послуги / Coaching',
  'contact.form.niche.personal':   'Personal brand',
  'contact.form.niche.cultural':   'Cultural / Event',
  'contact.form.niche.multipage':  'Multipage / Content site',
  'contact.form.niche.bot':        'Telegram-бот',
  'contact.form.niche.other':      'Інше',
  'contact.form.link':      'Поточний сайт (якщо є)',
  'contact.form.desc':      'Опиши проєкт у 2-3 реченнях. Чим конкретніше — тим точніше відповідь.',
  'contact.form.submit':    'Відправити бриф',
  'contact.form.note':      'Форма відправляє на email. Якщо терміново — Telegram.',

  'contact.alt.title':      'Прямі канали',
  'contact.alt.tg':         'Telegram — найшвидший',
  'contact.alt.mail':       'overflow.web1@gmail.com',
  'contact.alt.ig':         'Instagram @overflow.web',

  'contact.faq.title':      'FAQ',
  'contact.faq.q1':         'Як виглядає процес?',
  'contact.faq.a1':         'Бриф → аналіз задачі і конкурентів → 2-3 варіанти концепції → затвердження напрямку → структура й тексти → дизайн → код → контроль якості → здача. Погодження результату на кожному етапі.',
  'contact.faq.q2':         'Які терміни?',
  'contact.faq.a2':         'Лендинг — 7-14 днів від підтвердженого брифу. Multipage — 3-4 тижні. Повний аудит + переробка існуючого — 5-10 днів залежно від масштабу.',
  'contact.faq.q3':         'Як виглядає оплата?',
  'contact.faq.a3':         'Без фіксованого прайсу. Ціна залежить від обсягу і складності — обговорюємо після твого брифу і моєї відповіді. Стандартна схема — поетапна: частина перед стартом, частина після здачі.',
  'contact.faq.q4':         'Хостинг і домен?',
  'contact.faq.a4':         'Повне налаштування у ціні — домен, SSL, deployment, базове SEO. Сайт після передачі готовий до запуску.',
  'contact.faq.q5':         'Що якщо потім треба буде змінювати контент?',
  'contact.faq.a5':         'Два варіанти: пряме редагування у markdown/HTML файлах (з інструкцією) або легкий CMS (Decap, Sanity) — обговорюємо на етапі вибору стека.',
  'contact.faq.q6':         'Чи підійде мій проєкт?',
  'contact.faq.a6':         'Підходить, якщо проєкт комерційний і є розуміння цільової аудиторії. Не беру задачі «закодити готовий дизайн без обговорення» — потрібен початковий аналіз, інакше сайт вийде гірше, ніж міг би.',

  /* 404 */
  'e404.h1':                '404. Тут нічого немає.',
  'e404.sub':               'Ця сторінка не існує або була видалена.',
  'e404.cta.home':          'На головну →',
  'e404.cta.work':          'Усі роботи →',

  /* ─── /bots page (Telegram bots service) ─── */
  'bots.eyebrow':           'TELEGRAM-БОТИ · 2026',
  'bots.h1':                'Роблю Telegram-ботів.',
  'bots.sub':               'Боти, які приймають заявки, ведуть запис і відповідають за тебе. Роблю сам — під твою задачу і твої інструменти.',
  'bots.hero.cta':          'Обговорити бота →',

  'bots.what.eyebrow':      'ЩО ЗБИРАЮ',
  'bots.what.h2':           'Що вміє бот.',
  'bots.cap1.h':            'Заявки і ліди',
  'bots.cap1.d':            'Бот збирає заявки прямо в чаті й надсилає їх тобі, у таблицю чи CRM. Нічого не губиться.',
  'bots.cap2.h':            'Запис і нагадування',
  'bots.cap2.d':            'Клієнт обирає слот, бот підтверджує і нагадує перед візитом.',
  'bots.cap3.h':            'Авто-відповіді і FAQ',
  'bots.cap3.d':            'Відповідає на часті питання цілодобово, передає тобі лише важливе.',
  'bots.cap4.h':            'Сповіщення',
  'bots.cap4.d':            'Замовлення, оплати, заявки — одразу в Telegram, без затримок.',
  'bots.cap5.h':            'Міні-магазин з оплатою',
  'bots.cap5.d':            'Каталог, кошик і оплата всередині бота. Замовлення закривається, не виходячи з чату.',
  'bots.cap6.h':            'Telegram Mini App',
  'bots.cap6.d':            'Повноцінний застосунок усередині Telegram, коли простого бота замало.',

  'bots.how.eyebrow':       'ЯК ПРАЦЮЮ',
  'bots.how.h2':            'Один, без агенції.',
  'bots.how.p1':            'Роблю сам — від сценарію до запуску. Підключаю до того, що в тебе вже є: Google Sheets, CRM, платіжки.',
  'bots.how.p2':            'Розгортаю на сервері, віддаю з короткою інструкцією. Далі бот працює без мене — а я на зв\'язку.',

  'bots.steps.eyebrow':     'ЯК ІДЕМО',
  'bots.step1.h':           'Задача',
  'bots.step1.d':           'Списуємося: що бот має робити і куди складати дані.',
  'bots.step2.h':           'Збірка',
  'bots.step2.d':           'Пишу сценарій і логіку, підключаю інтеграції, перевіряю на реальних кейсах.',
  'bots.step3.h':           'Запуск',
  'bots.step3.d':           'Викочую, віддаю доступи й інструкцію. Правки по ходу — на зв\'язку.',

  'bots.cta.h':             'Потрібен бот?',
  'bots.cta.body':          'Напиши пару рядків про задачу — відповім за день: питаннями або прикидкою за термінами.',
  'bots.cta.btn':           'Обговорити задачу →',

  /* Case labels */
  'case.niche':             'Ніша',
  'case.year':              'Рік',
  'case.region':            'Регіон',
  'case.palette':           'Палітра',
  'case.tech':              'Стек',
  'case.site':              'Live site',
  'case.tagline':           'Tagline',
  'case.summary':           'Резюме',
  'case.back':              '← Усі роботи',
};

const dicts: Record<Lang, Dict> = { pl, ru, en, ua };

export function useT(lang: Lang) {
  return (key: keyof typeof ru): string => {
    const d = dicts[lang];
    const v = d[key];
    if (v !== undefined) return v;
    const master = dicts[masterLang][key];
    if (master !== undefined) return master;
    return key as string;
  };
}

/** Astro's configured base URL (e.g. '/overflow-portfolio/' for GH Pages, '/' for root). */
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/** Prepend the Astro base path to an absolute asset path (e.g. /covers/x.png). */
export function withBase(path: string): string {
  if (!path || /^https?:\/\//.test(path)) return path;
  const clean = path.startsWith('/') ? path : '/' + path;
  return BASE + clean;
}

/** Build localized URL with base prefix. '/work' + lang 'en' → '/[base]/en/work' */
export function localePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : '/' + path;
  const localized = lang === defaultLang ? clean : `/${lang}${clean === '/' ? '' : clean}`;
  return BASE + localized;
}

/** Strip both base and locale prefix from a pathname (for switcher logic). */
function stripPrefixes(currentPath: string): string {
  let p = currentPath;
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || '/';
  return p.replace(/^\/(en|ru|ua)(?=\/|$)/, '') || '/';
}

/** Build language alternates for the language switcher in nav */
export function getAltLangs(currentLang: Lang, currentPath: string) {
  const stripped = stripPrefixes(currentPath);
  return (Object.keys(languages) as Lang[])
    .filter(l => l !== currentLang)
    .map(l => ({
      lang: l,
      label: l.toUpperCase(),
      href: localePath(stripped, l),
    }));
}

/** All locales (used to build language switcher with current locale highlighted) */
export function getAllLocales(currentLang: Lang, currentPath: string) {
  const stripped = stripPrefixes(currentPath);
  return (Object.keys(languages) as Lang[]).map(l => ({
    lang: l,
    label: l.toUpperCase(),
    href: localePath(stripped, l),
    active: l === currentLang,
  }));
}
