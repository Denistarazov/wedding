# denisixone — свадебные приглашения-сайты

Next.js-приложение: лендинг студии + 9 уникальных шаблонов свадебных приглашений.

## Стек

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- App Router, маршруты вида `/templates/<slug>`

## Запуск

```bash
npm install
npm run db:generate
npm run dev
```

Проверка production-сборки:

```bash
npm run lint
npm run typecheck
npm run build
```

`index.html` оставлен как legacy-исходник предыдущей single-file версии.

## Production-функции

- `/shop` — каталог: свадебный шаблон и дизайн-пакет.
- `/shop/<slug>` — SEO-страница услуги со schema.org Service/Offer.
- `/order/<slug>` — оформление одной услуги без аккаунта.
- `/api/orders` — создание заказа и платежа ЮKassa, если заданы env.
- `/api/leads` — форма заявки с серверной валидацией и rate limit.
- `/api/webhooks/yookassa` — webhook ЮKassa с защитой от повторной обработки.
- `/admin` — админ-панель владельца: товары, заявки, заказы, статусы, статистика.
- `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml` — legal и SEO.

## Переменные окружения

Скопируйте `.env.example` в `.env.local` для локальной разработки и заведите такие же переменные в Vercel:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.ru
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require
ADMIN_PASSWORD=change-this-long-password
ADMIN_SESSION_SECRET=change-this-random-session-secret
YOOKASSA_SHOP_ID=000000
YOOKASSA_SECRET_KEY=test_xxxxxxxxxxxxxxxxxxxxx
```

## База данных

Рекомендуемый вариант в бюджете до 1000 ₽/мес: Vercel Hobby + Neon Free Postgres.

```bash
npm run db:generate
npm run db:dev      # локально с доступной DATABASE_URL
npm run db:migrate  # production/CI
npm run db:seed
```

## ЮKassa

1. Создайте магазин в ЮKassa и получите тестовые `YOOKASSA_SHOP_ID` и `YOOKASSA_SECRET_KEY`.
2. В Vercel добавьте env для Preview и Production.
3. В кабинете ЮKassa добавьте webhook:
   `https://your-domain.ru/api/webhooks/yookassa`
4. Для теста оформите заказ на `/order/wedding-template`.

## Деплой

Проект уже связан с Vercel через `.vercel/project.json`.

```bash
npm run lint
npm run typecheck
npm run build
npx vercel deploy --yes
npx vercel deploy --prod --yes
```

Перед production-деплоем настройте `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` в Vercel Project Settings.

## Деплой на VPS в РФ

Для российского VPS используйте Docker Compose: приложение Next.js + Postgres на одном сервере.

1. Создайте VPS с Ubuntu 24.04, минимум 1 CPU / 2 GB RAM / 20 GB NVMe.
2. Установите Docker:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

3. Скопируйте проект на сервер и создайте `.env.production` из `.env.production.example`.
4. Запустите:

```bash
docker compose up -d --build
docker compose exec app npm run db:migrate
docker compose exec app npm run db:seed
```

5. Настройте Nginx по примеру `nginx.conf.example`, затем выпустите HTTPS:

```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d example.ru -d www.example.ru
```

Webhook ЮKassa для VPS:

```text
https://example.ru/api/webhooks/yookassa
```

## Домен

Для домена в зоне `.ru` покупка обычно удобнее через REG.RU, Timeweb Domains, Beget, RU-CENTER или Selectel. После покупки добавьте домен в Vercel Project → Domains и пропишите DNS:

- `A` для apex-домена на `76.76.21.21`;
- `CNAME` для `www` на `cname.vercel-dns.com`.

Vercel сам выпустит HTTPS-сертификат после корректного DNS.

## 9 шаблонов — 9 уникальных структур

| slug | имя | структура |
|------|-----|-----------|
| editorial | Aurelia | editorial magazine + reading progress |
| swiss | Grid-14 | split-screen (sticky-left + scrolling-right) |
| garden | Verbena | центральная карточка с аккордеон-секциями |
| dark | Noctis | fullscreen pin-scroll + dot-nav |
| brutalist | Konkret | горизонтальный snap-scroll |
| letterpress | Maisonneuve | книжный разворот (3 спреда) |
| wabisabi | Kumo | параллакс-сторителлинг + калиграфия |
| polaroid | Super-8 | вертикальный timeline дня |
| artdeco | Palais | мини-сайт с sticky-табами |

URL для каждого: `/templates/<slug>`, например `/templates/editorial`.
