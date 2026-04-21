# denisixone — свадебные приглашения-сайты

Single-file React-приложение: лендинг студии + 9 уникальных шаблонов свадебных приглашений.

## Стек

- Один `index.html` — весь сайт (HTML + CSS + JSX)
- React 18 + Babel-standalone (через CDN, без сборки)
- Hash-based router
- Статический хостинг на Vercel

## Запуск

Открыть `index.html` двойным кликом, либо:

```bash
npx serve .
```

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

URL для каждого: `/templates/<slug>` (hash-роутинг: `#/templates/editorial`).
