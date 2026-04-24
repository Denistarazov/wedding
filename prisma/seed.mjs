import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "wedding-template",
    title: "Готовый свадебный шаблон",
    type: "TEMPLATE",
    price: 400000,
    currency: "RUB",
    short: "Любой из 9 готовых дизайнов с вашими фото, текстами и RSVP.",
    description:
      "Быстрый запуск сайта-приглашения на базе готового дизайна. Подходит, если нужен красивый результат без долгого кастомного производства.",
    image: "/assets/images/editorial-hero-lake-como.webp",
  },
  {
    slug: "design-package",
    title: "Дизайн-пакет под ключ",
    type: "DESIGN_PACKAGE",
    price: 900000,
    currency: "RUB",
    short: "Индивидуальная концепция, структура, тексты и визуальная сборка под вашу свадьбу.",
    description:
      "Для пар, которым нужен уникальный сайт с авторским визуальным направлением, кастомной типографикой и более глубоким сторителлингом.",
    image: "/assets/images/dark-luxe-hero-paris.webp",
  },
];

for (const category of [
  { slug: "templates", name: "Шаблоны", description: "Готовые свадебные сайты" },
  { slug: "design-packages", name: "Дизайн-пакеты", description: "Индивидуальный дизайн под ключ" },
]) {
  await prisma.category.upsert({
    where: { slug: category.slug },
    update: category,
    create: category,
  });
}

for (const product of products) {
  await prisma.product.upsert({
    where: { slug: product.slug },
    update: product,
    create: product,
  });
}

await prisma.siteSetting.upsert({
  where: { key: "brand" },
  update: { value: { name: "denisixone", domain: "weddingbuy.ru", locale: "ru-RU" } },
  create: { key: "brand", value: { name: "denisixone", domain: "weddingbuy.ru", locale: "ru-RU" } },
});

await prisma.$disconnect();
