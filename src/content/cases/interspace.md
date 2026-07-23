---
title: INTERSPACE
tagline: Иммерсивная выставка современного искусства в NYC с editorial typography и async WebGL
niche: Cultural / Event
year: '2026'
palette: EDITORIAL-CREAM-GOLD
tier: 1
accent: '#C4A882'
bg: '#FAFAF8'
siteUrl: https://shelovesmytears1-ship-it.github.io/interspace-exhibition/
cover: /covers/interspace.jpg
screens:
  - src: /screens/interspace-m1.webp
    kind: phone
  - src: /screens/interspace-m2.webp
    kind: phone
  - src: /screens/interspace-m3.webp
    kind: phone
technologies:
  - HTML
  - CSS
  - GSAP
  - Three.js (async)
region:
  - NYC
  - Bilingual (RU + EN)
summary: Иммерсивная выставка современного искусства. Editorial typography + WebGL подгружается async — никакой блокировки рендера.
order: 6
translations:
  pl:
    tagline: Wystawa immersywna sztuki współczesnej w NYC z editorial typography i async WebGL
    summary: Wystawa immersywna sztuki współczesnej. Editorial typography + WebGL ładowany async — bez blokady renderu.
    body: |
      ## Kontekst

      Lending immersyjnej wystawy sztuki współczesnej w Nowym Jorku (Piąta Aleja, wrzesień-listopad 2026), dwujęzyczny RU+EN. Zwykłe strony galerii sprzedają listą nazwisk i suchym harmonogramem: pełnoekranowe wideo, tabela artystów, schowane bilety — i fatalny performance (WebGL w hero blokuje render, LCP 4-8 s na mobile). Ta wystawa sprzedaje się atmosferą, więc trzeba dać ją poczuć już na lendingu.

      ## Rozwiązanie

      WebGL ładuje się asynchronicznie, po pierwszym krytycznym renderze: pierwszy ekran (tekst + zdjęcia) działa natychmiast, a scena 3D dogrywa się niżej przy przewijaniu, gdy widz jest już wciągnięty — i performance, i efekt wow bez wyboru. Dwujęzyczność RU+EN od razu: rosyjskojęzyczna diaspora w NYC jest duża, a muzea zwykle ją ignorują. Paleta — kremowe tło i ciepłe złoto (premium bez przesady); motyw light/dark jednym kliknięciem, pod wieczorne oglądanie.

      ## Wynik

      Tekst i zdjęcia — ścieżka krytyczna, renderują się od razu; animacje i ciężka scena 3D podłączają się potem i nie blokują treści; jest fallbackowe tło dla starych przeglądarek i zatrzymanie ruchu przy reduced-motion. Strona sprzedaje atmosferę, a nie katalog: 3D przychodzi „w tle", bez ofiar w szybkości, a dwujęzyczność szanuje realną demografię miasta.
  en:
    tagline: Immersive contemporary art exhibition in NYC, with editorial typography and async WebGL
    summary: Immersive contemporary art exhibition. Editorial typography + async-loaded WebGL — no render blocking.
    body: |
      ## Context

      A landing for an immersive contemporary-art exhibition in New York (Fifth Avenue, September-November 2026), bilingual RU+EN. Typical gallery sites sell through artist lists and a dry schedule: fullscreen video, a names table, hidden tickets — and terrible performance (WebGL in the hero blocks the paint, a 4-8s LCP on mobile). This exhibition sells through atmosphere, so it had to be felt right on the landing.

      ## The solution

      WebGL loads asynchronously, after the first critical render: the first screen (text + photos) works instantly, and the 3D scene loads further down on scroll, once the visitor is engaged — both performance and the wow effect, no trade-off. Bilingual RU+EN out of the box: the Russian-speaking diaspora in NYC is large, and museums usually ignore it. Palette — cream background and warm gold (premium without overplaying); light/dark theme in one click, for evening browsing.

      ## The outcome

      Text and images are the critical path and render at once; animations and the heavy 3D scene attach afterwards without blocking content; there's a fallback background for old browsers and motion stops under reduced-motion. The site sells atmosphere, not a catalogue: the 3D arrives "in the background" with no hit to speed, and the bilingual setup respects the city's real demographics.
  ua:
    tagline: Імерсивна виставка сучасного мистецтва в NYC з editorial typography і async WebGL
    summary: Імерсивна виставка сучасного мистецтва. Editorial typography + WebGL підвантажується async — без блокування рендеру.
    body: |
      ## Контекст

      Лендинг імерсивної виставки сучасного мистецтва в Нью-Йорку (5-та авеню, вересень-листопад 2026), білінгва RU+EN. Звичайні сайти галерей продають списком художників і сухим розкладом: фуллскрин-відео, таблиця імен, заховані квитки — і жахливий perf (WebGL у hero блокує відмальовку, LCP 4-8 с на мобільному). Ця виставка продається атмосферою, отже її треба дати відчути прямо на лендингу.

      ## Рішення

      WebGL вантажиться асинхронно, після першого критичного рендеру: перший екран (текст + фото) працює миттєво, а 3D-сцена підтягується нижче по скролу, коли людина вже залучена — і performance, і wow без вибору. Білінгва RU+EN з коробки: російськомовна діаспора в NYC велика, а музеї її зазвичай ігнорують. Палітра — кремовий фон і тепле золото (premium без переграння); тема light/dark в один клік, під вечірній перегляд.

      ## Підсумок

      Текст і фото — критичний шлях, рендеряться одразу; анімації й важка 3D-сцена підключаються потім і не блокують контент; є fallback-фон для старих браузерів і стоп-рух при reduced-motion. Сайт продає атмосферу, а не каталог: 3D приходить «у фоні», без жертв у швидкості, а білінгва поважає реальну демографію міста.
---

## Контекст

Лендинг иммерсивной выставки современного искусства в Нью-Йорке (5-я авеню, сентябрь-ноябрь 2026), билингв RU+EN. Обычные сайты галерей продают списком художников и сухим расписанием: фуллскрин-видео, таблица имён, спрятанные билеты — и ужасный perf (WebGL в hero блокирует отрисовку, LCP 4-8 с на мобильном). Эта выставка продаётся атмосферой, значит её надо дать прочувствовать прямо на лендинге.

## Решение

WebGL грузится асинхронно, после первого критичного рендера: первый экран (текст + фото) работает мгновенно, а 3D-сцена подтягивается ниже по скроллу, когда человек уже вовлечён — и performance, и wow без выбора. Билингва RU+EN из коробки: русскоязычная диаспора в NYC большая, а музеи её обычно игнорируют. Палитра — кремовый фон и тёплое золото (premium без переигрывания); тема light/dark в один клик, под вечерний просмотр.

## Итог

Текст и фото — критический путь, рендерятся сразу; анимации и тяжёлая 3D-сцена подключаются после и не блокируют контент; есть fallback-фон для старых браузеров и стоп-движение при reduced-motion. Сайт продаёт атмосферу, а не каталог: 3D приходит «в фоне», без жертв в скорости, а билингва уважает реальную демографию города.
