/**
 * Personal workflow — 10 steps from brief to handover.
 * Used on /method page (renders as "Процесс / Process / Proces / Процес").
 *
 * Voice: first person, short, plain. A real solo dev who builds in code (no Figma),
 * not an agency or a studio. Say it the way you'd say it out loud.
 */

import type { Lang } from '../i18n/ui';

type Localized = Partial<Record<Lang, string>>;

export type MethodPhase = {
  num: string;
  name: Localized;
  what: Localized;
  /** Multi-line "how" — bullet points or short paragraph, joined by newlines */
  how?: Localized;
  /** Common failures — bullet list as a single string (newline-joined) */
  failures?: Localized;
};

/** Pick the right locale string with fallback chain: lang → ru → en → pl → ua → '' */
export function pickLocale(loc: Localized | undefined, lang: Lang): string {
  if (!loc) return '';
  return loc[lang] ?? loc.ru ?? loc.en ?? loc.pl ?? loc.ua ?? '';
}

export const phases: MethodPhase[] = [
  {
    num: '01',
    name: { ru: 'Бриф', pl: 'Brief', en: 'Brief', ua: 'Бриф' },
    what: {
      ru: 'Первый разговор. Узнаю задачу, аудиторию, бюджет, сроки. Чем точнее рамка — тем меньше переделок дальше.',
      pl: 'Pierwsza rozmowa. Poznaję zadanie, odbiorców, budżet, terminy. Im dokładniejsza ramka — tym mniej przeróbek później.',
      en: 'First conversation. I learn the task, the audience, the budget, the deadlines. The clearer the frame — the less rework later.',
      ua: 'Перша розмова. Дізнаюся задачу, аудиторію, бюджет, терміни. Чим точніша рамка — тим менше переробок далі.',
    },
    how: {
      ru: 'Короткая анкета или звонок на 30-40 минут.\nЦели конкретные, а не «больше клиентов».\nКто аудитория и что для неё важно.\nОграничения: бюджет, сроки, что нельзя менять.',
      pl: 'Krótka ankieta albo rozmowa na 30-40 minut.\nCele konkretne, nie „więcej klientów".\nKto jest odbiorcą i co dla niego ważne.\nOgraniczenia: budżet, terminy, czego nie wolno zmieniać.',
      en: 'A short questionnaire or a 30-40-minute call.\nGoals concrete, not "more clients".\nWho the audience is and what matters to them.\nConstraints: budget, deadlines, what can\'t change.',
      ua: 'Коротка анкета або дзвінок на 30-40 хвилин.\nЦілі конкретні, а не «більше клієнтів».\nХто аудиторія і що для неї важливо.\nОбмеження: бюджет, терміни, що не можна змінювати.',
    },
    failures: {
      ru: '«Сделай красиво» без объяснения для кого.\nЦели без числа и срока.\nСтарт без согласованного брифа — переделки гарантированы.',
      pl: '„Zrób ładnie" bez wyjaśnienia dla kogo.\nCele bez liczby i terminu.\nStart bez uzgodnionego briefu — przeróbki gwarantowane.',
      en: '"Make it nice" without saying for whom.\nGoals with no number or deadline.\nStarting without an agreed brief — rework guaranteed.',
      ua: '«Зроби красиво» без пояснення для кого.\nЦілі без числа і терміну.\nСтарт без узгодженого брифу — переробки гарантовані.',
    },
  },
  {
    num: '02',
    name: { ru: 'Изучение ниши', pl: 'Analiza niszy', en: 'Studying the niche', ua: 'Вивчення ніші' },
    what: {
      ru: 'Смотрю 5-7 сайтов конкурентов: что работает, чего не хватает. Куда никто не пошёл — туда можно нам.',
      pl: 'Oglądam 5-7 stron konkurencji: co działa, czego brakuje. Tam, gdzie nikt nie poszedł — możemy iść my.',
      en: 'I look at 5-7 competitor sites: what works, what\'s missing. Where no one has gone — that\'s where we can go.',
      ua: 'Дивлюся 5-7 сайтів конкурентів: що працює, чого бракує. Туди, куди ніхто не пішов — можемо йти ми.',
    },
    how: {
      ru: 'По каждому сайту: палитра, шрифты, структура hero, тон.\nЕсли 4 из 5 делают одно — в ту же сторону смысла нет.\nЧего никто не делает, но полезно — это возможность.',
      pl: 'Dla każdej strony: paleta, fonty, struktura hero, ton.\nJeśli 4 z 5 robi to samo — nie ma sensu biec tam samo.\nCzego nikt nie robi, a jest przydatne — to szansa.',
      en: 'For each site: palette, fonts, hero structure, tone.\nIf 4 of 5 do the same — no point running there too.\nWhat no one does but would help — that\'s the opening.',
      ua: 'Для кожного сайту: палітра, шрифти, структура hero, тон.\nЯкщо 4 з 5 роблять одне — бігти туди ж сенсу немає.\nЧого ніхто не робить, але корисно — це можливість.',
    },
    failures: {
      ru: '«Все сайты одинаковые» — обычно смотрел один.\nКопирую «красивое» у других — выходит как у всех.\nИгнорю что работает — повторяю чужие ошибки.',
      pl: '„Wszystkie strony takie same" — zwykle oglądałeś jedną.\nKopiuję „ładne" u innych — wychodzi jak u wszystkich.\nIgnoruję co działa — powtarzam cudze błędy.',
      en: '"All sites look the same" — usually you looked at one.\nCopying what\'s "nice" elsewhere — you end up like everyone.\nIgnoring what works — repeating others\' mistakes.',
      ua: '«Усі сайти однакові» — зазвичай дивився один.\nКопіюю «гарне» в інших — виходить як у всіх.\nІгнорую що працює — повторюю чужі помилки.',
    },
  },
  {
    num: '03',
    name: { ru: 'Концепция', pl: 'Koncepcja', en: 'Concept', ua: 'Концепція' },
    what: {
      ru: 'Решаю, как подать: тон, акцент, одно главное обещание. Одно направление, а не «понемногу из всего».',
      pl: 'Decyduję, jak to podać: ton, akcent, jedna główna obietnica. Jeden kierunek, a nie „po trochu ze wszystkiego".',
      en: 'I decide how to present it: tone, accent, one main promise. One direction, not "a bit of everything".',
      ua: 'Вирішую, як подати: тон, акцент, одна головна обіцянка. Один напрямок, а не «потроху з усього».',
    },
    how: {
      ru: 'Коротко формулирую: для кого, что обещаем, чем отличаемся.\nВыбираю одно направление, не смешиваю.\nФиксирую — потом сверяю с этим каждое решение.',
      pl: 'Krótko formułuję: dla kogo, co obiecujemy, czym się różnimy.\nWybieram jeden kierunek, nie mieszam.\nUtrwalam — potem sprawdzam z tym każdą decyzję.',
      en: 'I phrase it briefly: for whom, what we promise, how we differ.\nI pick one direction, no blending.\nLock it in — then check every decision against it.',
      ua: 'Коротко формулюю: для кого, що обіцяємо, чим відрізняємось.\nОбираю один напрямок, не змішую.\nФіксую — потім звіряю з цим кожне рішення.',
    },
    failures: {
      ru: '«Смешаем всё понемногу» — выйдет без характера.\nИдея только в голове — через неделю забыта.\nКонцепция для галочки — на вёрстке всё расползается.',
      pl: '„Połączmy wszystko po trochu" — wyjdzie bez charakteru.\nPomysł tylko w głowie — za tydzień zapomniany.\nKoncepcja dla picu — na etapie kodu wszystko się rozjeżdża.',
      en: '"Let\'s blend a bit of everything" — comes out with no character.\nThe idea only in your head — forgotten in a week.\nConcept for show — and it all falls apart in code.',
      ua: '«Змішаймо все потроху» — вийде без характеру.\nІдея лише в голові — за тиждень забута.\nКонцепція для галочки — на верстці все розповзається.',
    },
  },
  {
    num: '04',
    name: { ru: 'Структура', pl: 'Struktura', en: 'Structure', ua: 'Структура' },
    what: {
      ru: 'Какие страницы нужны, что на каждой, в каком порядке блоки. Тут видно — лендинг или многостраничник.',
      pl: 'Jakie strony, co na każdej, w jakiej kolejności bloki. Tu widać — lending czy multipage.',
      en: 'Which pages, what\'s on each, in what order the blocks go. Here you see — landing or multipage.',
      ua: 'Які сторінки, що на кожній, у якому порядку блоки. Тут видно — лендинг чи multipage.',
    },
    how: {
      ru: 'Каждая страница оправдывает себя. «Потому что у всех есть» — выкидываю.\nДля лендинга — логика блоков: привлечь → убедить → позвать.\nДля многостраничника — переходы и меню.',
      pl: 'Każda strona uzasadnia swój sens. „Bo wszyscy mają" — wyrzucam.\nDla lendingu — logika bloków: przyciągnąć → przekonać → zaprosić.\nDla multipage — przejścia i menu.',
      en: 'Every page earns its place. "Because everyone has it" — dropped.\nFor a landing — block logic: attract → convince → call to action.\nFor multipage — transitions and a menu.',
      ua: 'Кожна сторінка виправдовує себе. «Бо у всіх є» — викидаю.\nДля лендингу — логіка блоків: привернути → переконати → покликати.\nДля multipage — переходи і меню.',
    },
    failures: {
      ru: '«О нас», где нечего сказать.\nБлог без планов в него писать.\nКаталог на лендинге, который продаёт одну услугу.',
      pl: '„O nas", gdzie nie ma co powiedzieć.\nBlog bez planów pisania.\nKatalog na lendingu, który sprzedaje jedną usługę.',
      en: 'An "About" page with nothing to say.\nA blog with no plans to write for it.\nA catalog on a landing that sells one service.',
      ua: '«Про нас», де нема що сказати.\nБлог без планів у нього писати.\nКаталог на лендингу, що продає одну послугу.',
    },
  },
  {
    num: '05',
    name: { ru: 'Тексты', pl: 'Teksty', en: 'Copy', ua: 'Тексти' },
    what: {
      ru: 'Пишу копирайт до вёрстки. Сначала смысл — потом форма. Это сильно меняет качество.',
      pl: 'Piszę copy przed kodem. Najpierw sens — potem forma. To bardzo zmienia jakość.',
      en: 'I write the copy before the code. Meaning first — form after. It changes quality a lot.',
      ua: 'Пишу копірайт до верстки. Спершу зміст — потім форма. Це сильно змінює якість.',
    },
    how: {
      ru: 'Тон выбран заранее: спокойный, дружелюбный, технический.\nКаждый блок с целью: что понять или сделать.\nКнопки — конкретные глаголы, не «узнать больше».',
      pl: 'Ton wybrany wcześniej: spokojny, przyjazny, techniczny.\nKażdy blok z celem: co zrozumieć albo zrobić.\nPrzyciski — konkretne czasowniki, nie „dowiedz się więcej".',
      en: 'Tone chosen upfront: calm, friendly, technical.\nEvery block with a goal: what to understand or do.\nButtons — concrete verbs, not "learn more".',
      ua: 'Тон обраний заздалегідь: спокійний, дружній, технічний.\nКожен блок із метою: що зрозуміти або зробити.\nКнопки — конкретні дієслова, не «дізнатися більше».',
    },
    failures: {
      ru: 'Маркетинговая вода: «инновационное решение», «лучшее качество».\n«Потом перепишем» — значит никогда.\nВерстать на lorem ipsum — структура под несуществующий текст.',
      pl: 'Marketingowa woda: „innowacyjne rozwiązanie", „najwyższa jakość".\n„Potem przepiszemy" — znaczy nigdy.\nKodować na lorem ipsum — struktura pod nieistniejący tekst.',
      en: 'Marketing fluff: "innovative solution", "the highest quality".\n"We\'ll rewrite later" — means never.\nCoding on lorem ipsum — structure for text that doesn\'t exist.',
      ua: 'Маркетингова вода: «інноваційне рішення», «найкраща якість».\n«Потім перепишемо» — означає ніколи.\nВерстати на lorem ipsum — структура під неіснуючий текст.',
    },
  },
  {
    num: '06',
    name: { ru: 'Стиль', pl: 'Styl', en: 'Style', ua: 'Стиль' },
    what: {
      ru: 'Палитра, шрифты, базовые элементы — сразу в CSS-переменных. Один набор, из которого собирается весь сайт.',
      pl: 'Paleta, fonty, podstawowe elementy — od razu w zmiennych CSS. Jeden zestaw, z którego składa się cała strona.',
      en: 'Palette, fonts, base elements — straight into CSS variables. One set the whole site is built from.',
      ua: 'Палітра, шрифти, базові елементи — одразу у CSS-змінних. Один набір, з якого збирається весь сайт.',
    },
    how: {
      ru: 'Палитра: пара вариантов настроения, светлая и тёмная.\nШрифты: заголовки и текст, иногда моноширинный для чисел.\nКнопки, поля, карточки — в переменных, чтобы переиспользовать.',
      pl: 'Paleta: kilka wariantów nastroju, jasny i ciemny.\nFonty: nagłówki i tekst, czasem monospace dla liczb.\nPrzyciski, pola, karty — w zmiennych, żeby wielokrotnie użyć.',
      en: 'Palette: a couple of moods, light and dark.\nFonts: headings and body, sometimes monospace for numbers.\nButtons, fields, cards — in variables, so they\'re reusable.',
      ua: 'Палітра: пара варіантів настрою, світла і темна.\nШрифти: заголовки і текст, іноді моноширинний для чисел.\nКнопки, поля, картки — у змінних, щоб перевикористати.',
    },
    failures: {
      ru: 'Inter и чёрный по умолчанию — лень, а не решение.\nЦвета без проверки контраста — текст не читается.\nЭлементы «по ходу» — между страницами разнобой.',
      pl: 'Inter i czarny domyślnie — lenistwo, nie decyzja.\nKolory bez sprawdzenia kontrastu — tekst nieczytelny.\nElementy „w trakcie" — między stronami rozjazd.',
      en: 'Inter and black by default — lazy, not a decision.\nColors without a contrast check — text unreadable.\nElements "on the fly" — pages drift apart.',
      ua: 'Inter і чорний за замовчуванням — лінь, а не рішення.\nКольори без перевірки контрасту — текст не читається.\nЕлементи «по ходу» — між сторінками різнобій.',
    },
  },
  {
    num: '07',
    name: { ru: 'Ключевые экраны', pl: 'Kluczowe ekrany', en: 'Key screens', ua: 'Ключові екрани' },
    what: {
      ru: 'Макеты в Figma не рисую — сразу верстаю главные экраны в коде, десктоп и мобильный. Так раньше видно, как оно реально живёт.',
      pl: 'Makiet w Figmie nie rysuję — od razu koduję główne ekrany, desktop i mobile. Tak wcześniej widać, jak to naprawdę żyje.',
      en: 'I don\'t draw mockups in Figma — I code the main screens straight away, desktop and mobile. You see how it really behaves sooner.',
      ua: 'Макети у Figma не малюю — одразу верстаю головні екрани в коді, десктоп і мобільний. Так раніше видно, як воно реально живе.',
    },
    how: {
      ru: 'Сначала первый экран и 2-3 ключевых блока — на реальных текстах.\nПроверяю на длинных и коротких строках.\nПоказываю, собираю правки, докручиваю до согласия.',
      pl: 'Najpierw pierwszy ekran i 2-3 kluczowe bloki — na prawdziwych tekstach.\nSprawdzam na długich i krótkich liniach.\nPokazuję, zbieram poprawki, dopracowuję do zgody.',
      en: 'First the hero and 2-3 key blocks — on real copy.\nI check with long and short lines.\nShow, collect feedback, refine until we agree.',
      ua: 'Спершу перший екран і 2-3 ключові блоки — на реальних текстах.\nПеревіряю на довгих і коротких рядках.\nПоказую, збираю правки, доводжу до згоди.',
    },
    failures: {
      ru: 'Согласовать по картинке, которую потом не повторить в коде.\nТолько десктоп — на телефоне ломается.\nПоказ на одном устройстве — сюрприз на телефоне.',
      pl: 'Uzgadniać po obrazku, którego potem nie da się powtórzyć w kodzie.\nTylko desktop — na telefonie się sypie.\nPokaz na jednym urządzeniu — niespodzianka na telefonie.',
      en: 'Signing off on a picture you can\'t reproduce in code.\nDesktop only — it breaks on phone.\nDemo on one device — a surprise on the phone.',
      ua: 'Узгоджувати по картинці, яку потім не повторити в коді.\nТільки десктоп — на телефоні ламається.\nПоказ на одному пристрої — сюрприз на телефоні.',
    },
  },
  {
    num: '08',
    name: { ru: 'Разработка', pl: 'Programowanie', en: 'Development', ua: 'Розробка' },
    what: {
      ru: 'Добиваю остальные страницы по утверждённым экранам. Чистый код, оптимизация картинок, адаптив под всё.',
      pl: 'Dokańczam resztę stron według zatwierdzonych ekranów. Czysty kod, optymalizacja obrazków, responsywność na wszystko.',
      en: 'I finish the rest of the pages from the approved screens. Clean code, image optimization, responsive everywhere.',
      ua: 'Добиваю решту сторінок за затвердженими екранами. Чистий код, оптимізація зображень, адаптив під усе.',
    },
    how: {
      ru: 'Стек под задачу: статика, multipage, e-commerce — разные ответы.\nКартинки в WebP/AVIF, под размер экрана.\nКод компактный, без лишних библиотек.',
      pl: 'Stack pod zadanie: statyka, multipage, e-commerce — różne odpowiedzi.\nObrazki w WebP/AVIF, pod rozmiar ekranu.\nKod kompaktowy, bez zbędnych bibliotek.',
      en: 'Stack to fit the task: static, multipage, e-commerce — different answers.\nImages in WebP/AVIF, sized to the screen.\nCompact code, no extra libraries.',
      ua: 'Стек під задачу: статика, multipage, e-commerce — різні відповіді.\nЗображення в WebP/AVIF, під розмір екрана.\nКод компактний, без зайвих бібліотек.',
    },
    failures: {
      ru: 'Библиотеки «потому что популярные» — лишний вес.\n«Почти как на экране» = нет.\nАдаптив в последний момент — переделка вёрстки.',
      pl: 'Biblioteki „bo popularne" — zbędny ciężar.\n„Prawie jak na ekranie" = nie.\nResponsywność na koniec — przeróbka layoutu.',
      en: 'Libraries "because popular" — dead weight.\n"Almost like the screen" = no.\nResponsive at the last minute — layout redone.',
      ua: 'Бібліотеки «бо популярні» — зайва вага.\n«Майже як на екрані» = ні.\nАдаптив в останній момент — переробка верстки.',
    },
  },
  {
    num: '09',
    name: { ru: 'Контроль качества', pl: 'Kontrola jakości', en: 'Quality control', ua: 'Контроль якості' },
    what: {
      ru: 'Чек-лист перед сдачей: скорость, доступность, SEO-база, кроссбраузерность, формы.',
      pl: 'Checklista przed oddaniem: szybkość, dostępność, podstawy SEO, kompatybilność, formularze.',
      en: 'Checklist before handover: speed, accessibility, SEO basics, cross-browser, forms.',
      ua: 'Чек-лист перед здачею: швидкість, доступність, бази SEO, кросбраузерність, форми.',
    },
    how: {
      ru: 'Lighthouse на боевом домене, не на локалке. Ниже 90 — разбираюсь.\nChrome, Firefox, Safari — на телефоне и десктопе.\nТестовая заявка: проверяю, что сообщение доходит.\nКаждую ссылку кликаю.',
      pl: 'Lighthouse na produkcyjnej domenie, nie na localhost. Poniżej 90 — sprawdzam.\nChrome, Firefox, Safari — na telefonie i desktopie.\nTestowe zgłoszenie: sprawdzam, że wiadomość dochodzi.\nKażdy link klikam.',
      en: 'Lighthouse on the live domain, not localhost. Below 90 — I dig in.\nChrome, Firefox, Safari — on phone and desktop.\nA test submission: I check the message arrives.\nEvery link clicked.',
      ua: 'Lighthouse на бойовому домені, не на локалці. Нижче 90 — розбираюся.\nChrome, Firefox, Safari — на телефоні і десктопі.\nТестова заявка: перевіряю, що повідомлення доходить.\nКожне посилання клікаю.',
    },
    failures: {
      ru: '«В Chrome ок» вместо Safari — о баге узнаёшь от клиента.\nФорма не доходит — клиент не знает, что заявки теряются.\nLighthouse мерил на localhost — на проде другое.',
      pl: '„W Chrome ok" zamiast Safari — o bugu dowiesz się od klienta.\nFormularz nie dochodzi — klient nie wie, że zgłoszenia giną.\nLighthouse mierzony na localhost — na prod inaczej.',
      en: '"Works in Chrome" instead of Safari — you hear of the bug from the client.\nThe form doesn\'t arrive — the client doesn\'t know leads vanish.\nLighthouse measured on localhost — different on prod.',
      ua: '«У Chrome ок» замість Safari — про баг дізнаєшся від клієнта.\nФорма не доходить — клієнт не знає, що заявки губляться.\nLighthouse міряв на localhost — на проді інакше.',
    },
  },
  {
    num: '10',
    name: { ru: 'Сдача', pl: 'Przekazanie', en: 'Handover', ua: 'Здача' },
    what: {
      ru: 'Деплой на боевой домен, SSL, короткая инструкция как править тексты. Дальше сайт работает без меня.',
      pl: 'Deploy na produkcyjną domenę, SSL, krótka instrukcja jak edytować teksty. Dalej strona działa beze mnie.',
      en: 'Deploy to the live domain, SSL, a short manual on editing the text. After that the site runs without me.',
      ua: 'Деплой на бойовий домен, SSL, коротка інструкція як правити тексти. Далі сайт працює без мене.',
    },
    how: {
      ru: 'Домен и хостинг настраиваю сам, не оставляю клиенту.\nИнструкция: как поменять телефон, добавить новость, обновить картинку.\nПонадобится правка через полгода — на связи, без отдельного контракта.',
      pl: 'Domenę i hosting konfiguruję sam, nie zostawiam klientowi.\nInstrukcja: jak zmienić telefon, dodać newsa, podmienić obrazek.\nTrzeba poprawić za pół roku — jestem na kontakcie, bez osobnego kontraktu.',
      en: 'I set up the domain and hosting myself, I don\'t leave it to the client.\nA manual: how to change the phone, add a news item, swap an image.\nNeed a fix in six months — I\'m reachable, no separate contract.',
      ua: 'Домен і хостинг налаштовую сам, не залишаю клієнту.\nІнструкція: як змінити телефон, додати новину, замінити зображення.\nТреба правка за пів року — на зв\'язку, без окремого контракту.',
    },
    failures: {
      ru: 'Отдал «как есть» без инструкции — клиент боится трогать.\nЗабытый SSL — браузер пугает предупреждением.\nПропал сразу после сдачи — мелкий баг лежит неделями.',
      pl: 'Oddane „tak jak jest" bez instrukcji — klient boi się ruszać.\nZapomniany SSL — przeglądarka straszy ostrzeżeniem.\nZniknięcie zaraz po oddaniu — drobny bug leży tygodniami.',
      en: 'Handed over "as is" with no manual — the client is afraid to touch it.\nSSL forgotten — the browser scares with a warning.\nVanishing right after handover — a small bug sits for weeks.',
      ua: 'Віддав «як є» без інструкції — клієнт боїться чіпати.\nЗабутий SSL — браузер лякає попередженням.\nЗник одразу після здачі — дрібний баг лежить тижнями.',
    },
  },
];
