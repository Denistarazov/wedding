export type ProductKind = "template" | "design-package";

export type CatalogProduct = {
  slug: string;
  title: string;
  kind: ProductKind;
  category: string;
  price: number;
  short: string;
  description: string;
  image: string;
  highlights: string[];
  deliverables: string[];
  timeline: string;
};

export const catalogProducts: CatalogProduct[] = [
  {
    slug: "wedding-template",
    title: "Готовый свадебный шаблон",
    kind: "template",
    category: "Шаблоны",
    price: 4000,
    short: "Любой из 9 готовых дизайнов с вашими фото, текстами и RSVP.",
    description:
      "Быстрый запуск сайта-приглашения на базе готового дизайна. Подходит, если нужен красивый результат без долгого кастомного производства.",
    image: "/assets/images/editorial-hero-lake-como.webp",
    highlights: ["9 визуальных направлений", "RSVP-форма", "Адаптация под пару", "Публикация сайта"],
    deliverables: ["Главная страница приглашения", "Программа и детали", "Форма RSVP", "Инструкция по рассылке"],
    timeline: "5 рабочих дней",
  },
  {
    slug: "design-package",
    title: "Дизайн-пакет под ключ",
    kind: "design-package",
    category: "Дизайн-пакеты",
    price: 9000,
    short: "Индивидуальная концепция, структура, тексты и визуальная сборка под вашу свадьбу.",
    description:
      "Для пар, которым нужен уникальный сайт с авторским визуальным направлением, кастомной типографикой и более глубоким сторителлингом.",
    image: "/assets/images/dark-luxe-hero-paris.webp",
    highlights: ["Дизайн с нуля", "Копирайтинг и сценарий", "Расширенные блоки", "Поддержка до релиза"],
    deliverables: ["Авторская концепция", "Сайт-приглашение", "Интерактивные блоки", "Финальная публикация"],
    timeline: "2-4 недели",
  },
];

export function formatRub(amount: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCatalogProduct(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}
