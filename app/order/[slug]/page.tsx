import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";
import { OrderForm } from "@/components/commerce/order-form";
import { catalogProducts, formatRub, getCatalogProduct } from "@/lib/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  return {
    title: product ? `Оформить заказ: ${product.title}` : "Оформить заказ",
    robots: { index: false, follow: false },
  };
}

export default async function OrderPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) notFound();

  return (
    <CommerceShell>
      <PageHero eyebrow="Заказ" title="Оформление без аккаунта.">
        <p>
          Вы оплачиваете одну выбранную услугу. После оплаты владелец видит заказ в админке и связывается с вами по
          указанному контакту.
        </p>
      </PageHero>
      <section className="commerce-admin-grid">
        <div className="commerce-card">
          <div className="commerce-card-body">
            <p className="commerce-eyebrow">{product.category}</p>
            <h2 className="serif">{product.title}</h2>
            <div className="commerce-price serif">{formatRub(product.price)}</div>
            <p>{product.short}</p>
            <p>Оплата: банковская карта через ЮKassa. Валюта: российский рубль.</p>
            <Link className="commerce-button secondary" href={`/shop/${product.slug}`}>
              Вернуться к описанию
            </Link>
          </div>
        </div>
        <OrderForm productSlug={product.slug} productTitle={product.title} />
      </section>
    </CommerceShell>
  );
}
