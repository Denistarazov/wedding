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
npm run dev
```

Проверка production-сборки:

```bash
npm run build
```

`index.html` оставлен как legacy-исходник предыдущей single-file версии.

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
