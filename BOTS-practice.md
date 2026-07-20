# Telegram-боты — практика (6 проектов)

Каждый блок ниже — **готовый промпт для нейросети** (Claude / ChatGPT / Cursor). Копируешь промпт целиком, кидаешь — она собирает рабочего бота. Делай в порядке от простого к сложному: **1 → 2 → 3 → 4 → 5 → 6**. Каждого бота — в отдельной папке, например `Desktop\Overflow Portfolio\bots-practice\<имя>\` (рядом с проектом, но не внутри `sites/`).

## Перед стартом (один раз)

- **Node 20+** установлен.
- **Токен бота** — напиши [@BotFather](https://t.me/BotFather) → `/newbot` → получишь `BOT_TOKEN`. Для каждого практического бота заведи отдельного.
- **Свой chat_id** — узнаешь из бота №1 (он по `/start` его пришлёт). Это `OWNER_CHAT_ID`.
- Аккаунты по мере надобности (всё бесплатно/тест):
  - **Supabase** (база для записи/магазина) — supabase.com
  - **OpenAI** или **Anthropic** (для FAQ-бота) — ключ API
  - **Stripe** в режиме **TEST** (для оплат) — провайдер-токен берётся у BotFather
- Общий стек у всех: **TypeScript + [grammY](https://grammy.dev)**. На разработке — long polling (`bot.start()`), запуск локально. В прод — webhook (см. «Деплой» внизу).

---

## 1. Бот уведомлений — `notify-bot`  · пункт «Уведомления»

**Что делает:** ловит события (отправка формы на сайте, заказ, оплата) по HTTP и мгновенно шлёт тебе в Telegram. Самый лёгкий, но реально полезный.
**Что выучишь:** базовый бот, HTTP-эндпоинт, отправка сообщений, вебхуки.

```text
Сделай Telegram-бота на TypeScript + grammY (Node 20+). Структура: package.json (scripts: "dev": tsx watch src/index.ts), src/index.ts, .env, README. Токен из process.env через dotenv, long polling, обработка ошибок, graceful shutdown, комментарии на русском.

Это бот-уведомитель. Функции:
1) Команда /start отвечает пользователю его chat_id (чтобы я узнал свой OWNER_CHAT_ID).
2) Подними лёгкий HTTP-сервер (Hono) с эндпоинтом POST /notify, принимающим JSON {title, text, level?}. По запросу бот шлёт сообщение на OWNER_CHAT_ID (из .env): жирный title, ниже text, эмодзи по level (info ℹ️ / success ✅ / warn ⚠️).
3) Защити /notify: заголовок X-Token должен совпадать с NOTIFY_SECRET из .env, иначе 401.
4) Бонус: эндпоинт POST /stripe-webhook, принимает событие Stripe checkout.session.completed (TEST) и шлёт «💰 Оплата: <сумма> <валюта>» на OWNER_CHAT_ID.

.env: BOT_TOKEN, OWNER_CHAT_ID, NOTIFY_SECRET, STRIPE_WEBHOOK_SECRET.
В README — команды запуска и пример curl для проверки /notify.
```

**Готово, когда:** `curl` на `/notify` пингует тебя в Telegram; тестовый Stripe-ивент шлёт уведомление.

---

## 2. Лид-бот — `lead-bot`  · пункт «Заявки и лиды»

**Что делает:** короткий диалог (имя → контакт → задача), отправляет лид тебе в личку + строкой в Google-таблицу.
**Что выучишь:** диалоги (conversations), валидация, запись во внешнюю таблицу.

```text
Сделай Telegram-бота на TypeScript + grammY + плагин @grammyjs/conversations (Node 20+). Стандартная структура (package.json, src/index.ts, .env, README), токен из dotenv, long polling, ошибки, комментарии на русском.

Это лид-бот для сбора заявок. Поток:
- /start → приветствие + inline-кнопка «Оставить заявку».
- Диалог из 3 шагов: 1) имя, 2) контакт (@ник, телефон или почта), 3) что нужно (свободный текст). Пустые ответы переспрашивай. Команда /cancel прерывает.
- В конце покажи сводку заявки и кнопки «Отправить» / «Заново».
- При «Отправить»: (а) пошли мне на OWNER_CHAT_ID сообщение с лидом; (б) сделай POST на GOOGLE_SHEET_WEBHOOK с JSON {name, contact, need, date} — это Google Apps Script, добавляющий строку в таблицу. Подтверди пользователю: «Спасибо, свяжусь в течение дня».

.env: BOT_TOKEN, OWNER_CHAT_ID, GOOGLE_SHEET_WEBHOOK.
В README — как сделать Google Apps Script веб-приложение (функция doPost пишет строку в Google Sheet) и получить его URL.
```

**Готово, когда:** пройдя диалог, видишь новую строку в таблице и сообщение себе.

---

## 3. FAQ-бот — `faq-bot`  · пункт «Авто-ответы и FAQ»

**Что делает:** отвечает на вопросы по твоему FAQ через нейросеть; если ответа нет — зовёт человека (пересылает тебе).
**Что выучишь:** подключение LLM API, системный промпт, эскалация.

```text
Сделай Telegram-бота на TypeScript + grammY + openai SDK (Node 20+). Стандартная структура, dotenv, long polling, ошибки, комментарии на русском.

Это FAQ-бот поддержки. В коде вынеси FAQ выдуманного бизнеса в константу (8–12 пар вопрос–ответ). Логика:
- На любое текстовое сообщение вызывай модель gpt-4o-mini с системным промптом: «Ты бот поддержки <бизнес>. Отвечай коротко и дружелюбно ТОЛЬКО по FAQ ниже. Если ответа в FAQ нет — не выдумывай, скажи, что переключаешь на человека. FAQ: <вставь FAQ>». Ответ модели пошли пользователю.
- Если модель сигналит, что не знает (или команда /human) — перешли вопрос мне на OWNER_CHAT_ID и скажи пользователю: «Передал человеку, скоро ответят».
- Простой rate-limit: не чаще 1 запроса в 2 секунды на пользователя.

.env: BOT_TOKEN, OPENAI_API_KEY, OWNER_CHAT_ID.
В README — где взять OPENAI_API_KEY и как заменить FAQ.
```

**Готово, когда:** вопросы из FAQ получают ответ; вопрос не по теме → «переключаю на человека» + форвард тебе.

---

## 4. Бот записи и напоминаний — `booking-bot`  · пункт «Запись и напоминания»

**Что делает:** клиент выбирает услугу и время в боте, запись летит в базу, за час до визита приходит напоминание. Работает и по ссылке с сайта (deep link). Самый «жирный» проект.
**Что выучишь:** база данных (Supabase), inline-меню, расписание (cron), deep links сайт→бот.

```text
Сделай Telegram-бота на TypeScript + grammY + @supabase/supabase-js + node-cron (Node 20+). Стандартная структура, dotenv, long polling, ошибки, комментарии на русском.

Это бот записи (пример: барбершоп).
База Supabase, таблица bookings(id uuid pk default gen_random_uuid(), tg_user_id int8, tg_username text, service text, slot timestamptz, status text default 'active', reminded bool default false, created_at timestamptz default now()).
Услуги — массив в конфиге (название, длительность, цена).

Поток:
- /start ИЛИ deep link t.me/<bot>?start=<service> (распарси payload и сразу подставь услугу).
- Выбор услуги (inline-кнопки) → выбор даты (ближайшие 7 дней) → выбор времени из свободных слотов (занятые проверь в БД) → спросить имя → подтверждение → запись в Supabase → «Готово, ждём вас <дата, время>».
- /my — показать свои активные записи + кнопка «Отменить» (status='canceled').
- node-cron каждые 5 минут: найди active-записи, до которых ~1 час и reminded=false → пошли напоминание в бота этому пользователю, поставь reminded=true.
- О каждой новой записи уведоми меня на OWNER_CHAT_ID.

.env: BOT_TOKEN, SUPABASE_URL, SUPABASE_KEY, OWNER_CHAT_ID.
В README — SQL для создания таблицы и пример deep-link-кнопки для статичного сайта.
```

**Готово, когда:** можешь записаться, запись видна в Supabase, приходит напоминание; ссылка с сайта подставляет услугу.

---

## 5. Шоп-бот с оплатой — `shop-bot`  · пункт «Мини-магазин с оплатой»

**Что делает:** каталог → корзина → оплата картой прямо в Telegram (Stripe TEST).
**Что выучишь:** Telegram Payments (sendInvoice, pre_checkout, successful_payment), Stripe в тест-режиме.

```text
Сделай Telegram-бота на TypeScript + grammY (Node 20+). Стандартная структура, dotenv, long polling, ошибки, комментарии на русском.

Это шоп-бот с оплатой через Telegram Payments (провайдер Stripe, режим TEST).
Каталог — массив из 4 товаров в конфиге: {id, name, description, price (в минимальных единицах, напр. центах), photoUrl}.

Поток:
- /shop → список товаров (для каждого фото/название/цена и inline-кнопка «В корзину»).
- /cart → показать корзину и кнопки «Оформить» / «Очистить».
- «Оформить» → bot.api.sendInvoice с позициями (LabeledPrice), валюта из конфига, PAYMENT_PROVIDER_TOKEN из .env.
- Обработай pre_checkout_query → answerPreCheckoutQuery(true).
- На message:successful_payment → «Оплачено, спасибо! Заказ #<id>», очисти корзину, уведоми меня на OWNER_CHAT_ID о заказе.
- Корзину храни в памяти по user_id (для практики достаточно).

.env: BOT_TOKEN, PAYMENT_PROVIDER_TOKEN, OWNER_CHAT_ID.
В README — как у BotFather получить TEST provider token (Bot Settings → Payments → Stripe TEST) и тестовая карта 4242 4242 4242 4242 (любой будущий срок, любой CVC).
```

**Готово, когда:** проходишь оплату тестовой картой, получаешь подтверждение, тебе падает заказ.

---

## 6. Telegram Mini App — `miniapp`  · пункт «Telegram Mini App»

**Что делает:** веб-страница (твоя стихия!) открывается внутри Telegram + бэкенд. Тут фронтенд — это ты, бот лишь открывает приложение.
**Что выучишь:** Telegram WebApp SDK, тема Telegram, проверка `initData` на бэкенде.

```text
Сделай Telegram Mini App из трёх частей (TypeScript, Node 20+):

(А) Бот на grammY: команда /start с inline-кнопкой web_app, открывающей мой URL (WEBAPP_URL); плюс эта же ссылка как menu button.

(Б) Веб-страница (index.html + script.js, без фреймворков — или Astro): подключи https://telegram.org/js/telegram-web-app.js, используй window.Telegram.WebApp — expand(), themeParams (подгони цвета под тему Telegram), MainButton. UI — простая форма записи: услуга (select), дата/время, имя. По нажатию MainButton отправь данные на бэкенд POST /api/book вместе с Telegram.WebApp.initData; после успешного ответа вызови Telegram.WebApp.close().

(В) Бэкенд на Hono: эндпоинт POST /api/book — СНАЧАЛА валидируй initData (HMAC-SHA256 по официальному алгоритму Telegram с BOT_TOKEN), достань пользователя, сохрани запись (в память или Supabase), верни {ok:true}. Невалидный initData → 401.

.env: BOT_TOKEN, WEBAPP_URL.
В README — как локально поднять https (ngrok или cloudflared) и привязать URL к боту у BotFather (/setmenubutton), и код проверки initData.
```

**Готово, когда:** из бота открывается Mini App, форма отправляет запись, бэкенд проверил `initData` и сохранил.

---

## Деплой ботов (коротко)

- **Разработка:** запускай локально на long polling — ничего хостить не надо.
- **Прод (всегда онлайн):** **Railway** или **Render** (просто `git push`) — нужны ботам №4 (node-cron) и тем, где постоянный процесс. Или дешёвый **VPS**.
- **Прод (webhook, serverless):** **Cloudflare Workers** — отлично для №1, 2, 3, 5 (без постоянного процесса). Для №4 крон вынеси в Cloudflare Cron Triggers или Supabase cron.
- Токены и ключи — только в переменных окружения хоста, **никогда не в коде** и не в git.

> Сделаешь по одному боту на пункт — и все 6 плашек на странице `/bots` станут честными.
