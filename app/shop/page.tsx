import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";
import { catalogProducts, formatRub } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Каталог шаблонов и дизайн-пакетов | denisixone",
  description: "Готовые свадебные шаблоны и дизайн-пакеты под ключ с оплатой через ЮKassa.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <CommerceShell>
      <PageHero eyebrow="Каталог" title="Шаблоны и дизайн-пакеты.">
        <p>Достаточно выбрать одну услугу, оставить контакт и перейти к безопасной оплате через ЮKassa.</p>
      </PageHero>
      <section className="commerce-grid" aria-label="Услуги">
        {catalogProducts.map((product) => (
          <article className="commerce-card" key={product.slug}>
            <Image src={product.image} alt={product.title} width={920} height={640} style={{ width: "100%", height: 260, objectFit: "cover" }} />
            <div className="commerce-card-body">
              <p className="commerce-eyebrow">{product.category}</p>
              <h2 className="serif">{product.title}</h2>
              <div className="commerce-price serif">{formatRub(product.price)}</div>
              <p>{product.short}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
                <Link className="commerce-button" href={`/order/${product.slug}`}>
                  Купить
                </Link>
                <Link className="commerce-button secondary" href={`/shop/${product.slug}`}>
                  Подробнее
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </CommerceShell>
  );
}
