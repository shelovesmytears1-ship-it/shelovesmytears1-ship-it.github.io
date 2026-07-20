# DEPLOY.md — overflow portfolio v3

Полная инструкция деплоя портфолио + 15 проектов на GitHub Pages.

Цель: каждый кейс на сайте имеет рабочий **«Live site →»** линк.

> **Структура (обновлено).** Все 15 демо-сайтов теперь лежат в `sites/<Бренд>/` внутри папки проекта — имя папки = бренд кейса: Denty, Wavemetrics, Draft, Prezfull, Orlov, INTERSPACE, Essence, Dzherelo, DISPERSIA, ARCHLINE, FreshClean, Prawnik, ModulArt, Vanguard, Touche. Каждый сайт — отдельный git-репозиторий со своим GitHub Pages (remote сохраняется при переносе). Деплой всех 15 одной командой `.\deploy-all.ps1` из корня проекта. Studio-system и старые портфолио вынесены из проекта в `Desktop\обучение системы\`. Пути в таблице ниже — исторические (до реорганизации); актуальные пути см. в `deploy-all.ps1`.

---

## Что куда деплоится

| Проект | Где исходники | Куда деплоим | Why |
|---|---|---|---|
| **portfolio-v3** | `portfolio-v3/` | Netlify → overflow-web.pl | Astro multipage, нужен build + custom domain |
| **Denty** | `CRM стамотология/denty-landing_1.html` | GitHub Pages | single-file HTML |
| **Draft** | `Productivity-стартап/index.html` | GitHub Pages | single-file HTML |
| **Wavemetrics** | `Аналитика для музыкантов/Wavemetrics/` | **SKIP** | только ассеты, нет site\'а |
| **Prezfull** | `jules_session.../index.html` + css | GitHub Pages | static |
| **Orlov** | `Продюсер автоворонок/index.html` + css | GitHub Pages | static |
| **INTERSPACE** | `музей лендос/index-v2.html` + css | GitHub Pages | static + WebGL |
| **Essence** | `уход за кожей/index.html` + assets | GitHub Pages | static |
| **Джерело** | `чай/index.html` + assets | GitHub Pages | static |
| **DISPERSIA** | `многостраничник/` | Netlify | Astro multipage, нужен build |

**Итого:** 7 проектов на GitHub Pages + 2 на Netlify (portfolio + DISPERSIA).
Wavemetrics остаётся без live URL до того как накодим реальный сайт.

---

## Перед стартом

Нужно от тебя:

1. **GitHub username** — для команд ниже
2. **Netlify account** (бесплатный) — для портфолио и DISPERSIA
3. **Доступ к домену overflow-web.pl** — для финального DNS-связывания

---

## Шаг 1 — GitHub репозитории

Для каждого из 7 single-page проектов:

```bash
# Пример для Denty. Повтори для каждого:
cd "CRM стамотология"
git init
git add denty-landing_1.html
# Переименуй для GitHub Pages — index.html обязателен
git mv denty-landing_1.html index.html
git commit -m "initial commit: Denty concept landing"

# Создай репо через gh CLI (или вручную на github.com)
gh repo create <username>/denty-landing --public --source=. --push

# Включи GitHub Pages
gh api -X POST /repos/<username>/denty-landing/pages \
  -f source[branch]=main -f source[path]=/
```

URL станет: `https://<username>.github.io/denty-landing/`

**Имена репозиториев** (предлагаю):

| Проект | Repo name |
|---|---|
| Denty | `denty-landing` |
| Draft | `draft-landing` |
| Prezfull | `prezfull-architecture` |
| Orlov | `orlov-funnels` |
| INTERSPACE | `interspace-exhibition` |
| Essence | `essence-skincare` |
| Джерело | `dzherelo-tea` |
| DISPERSIA | `dispersia-fashion` |
| Portfolio | `overflow-portfolio` |

---

## Шаг 2 — Astro проекты (DISPERSIA + portfolio)

Эти не работают на GitHub Pages напрямую (нужен build). Деплоим через Netlify:

```bash
# Для portfolio-v3
cd portfolio-v3
git init
git add .
git commit -m "initial commit: portfolio v3"
gh repo create <username>/overflow-portfolio --public --source=. --push

# Затем на netlify.com:
# 1. New site from Git
# 2. Connect GitHub, выбери overflow-portfolio
# 3. Build command: npm run build
# 4. Publish directory: dist
# 5. Deploy
```

Аналогично для DISPERSIA (`многостраничник/` → отдельный Netlify сайт).

---

## Шаг 3 — Custom domain (portfolio только)

После деплоя на Netlify:

1. Netlify UI → Domain settings → Add custom domain
2. Введи `overflow-web.pl`
3. Netlify скажет какие DNS-записи добавить у твоего регистратора домена
4. Добавь A-record и CNAME как указано
5. SSL автоматически после propagation (10-30 минут)

---

## Шаг 4 — Обновить siteUrl в case studies

После деплоя каждого проекта — добавь URL в frontmatter:

```yaml
# portfolio-v3/src/content/cases/denty.md
siteUrl: https://<username>.github.io/denty-landing/
```

Карточка автоматически покажет **«Live site →»** ссылку.

После всех обновлений — пересобери и задеплой portfolio:

```bash
cd portfolio-v3
git add src/content/cases/
git commit -m "add live siteUrl to all case studies"
git push
# Netlify авто-deployит из push
```

---

## Шаг 5 — Verify

После деплоя проверь каждый URL вручную:

- ✅ Открывается без 404
- ✅ Все assets грузятся (images, CSS, JS)
- ✅ HTTPS работает
- ✅ Mobile rendering норм

Если что-то ломается на GitHub Pages — проверь:
- `index.html` в корне репо (не в подпапке)
- Все asset paths **relative** (`./styles.css` not `/styles.css`)
- Все ссылки относительные

---

## Опционально — netlify.toml в portfolio-v3

Уже создан. Включает:
- Build config (npm run build, publish dist)
- Локализованные 404 redirects
- Security headers
- Cache-Control для статики

---

## Чек-лист готовности к deploy

- [ ] GitHub username получен
- [ ] gh CLI установлен (`gh --version`)
- [ ] Netlify account готов
- [ ] DNS access у overflow-web.pl
- [ ] portfolio-v3 build проходит локально (`npm run build`)
- [ ] Все 9 проектов с asset paths проверены на relative (не absolute)

---

## Когда понадобится Wavemetrics

Wavemetrics сейчас без site\'а — только assets и 3D mockup. Опции:

1. **Quick:** статичная страница 1-on-1 с hero image + краткое описание. 1 час работы.
2. **Real:** функциональный demo с реальной аналитикой (Astro project с mock data). 4-8 часов.

Пока siteUrl у Wavemetrics остаётся пустой — кейс показывается с decision log но без «Live site →» ссылки.
