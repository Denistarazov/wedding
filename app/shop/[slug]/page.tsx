import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";
import { catalogProducts, formatRub, getCatalogProduct } from "@/lib/catalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) return {};

  return {
    title: `${product.title} | denisixone`,
    description: product.short,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.short,
      images: [product.image],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: product.title,
    description: product.description,
    provider: { "@type": "Organization", name: "denisixone" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_APP_URL || "https://weddingbuy.ru"}/shop/${product.slug}`,
    },
  };

  return (
    <CommerceShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow={product.category} title={product.title}>
        <p>{product.description}</p>
      </PageHero>
      <section className="commerce-admin-grid">
        <Image src={product.image} alt={product.title} width={980} height={760} style={{ width: "100%", borderRadius: 8, objectFit: "cover" }} />
        <div className="commerce-card">
          <div className="commerce-card-body">
            <div className="commerce-price serif">{formatRub(product.price)}</div>
            <p>Срок: {product.timeline}</p>
            <h2 className="serif" style={{ marginTop: 28 }}>Что входит</h2>
            <ul>
              {product.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h2 className="serif" style={{ marginTop: 28 }}>Акценты</h2>
            <ul>
              {product.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 26 }}>
              <Link className="commerce-button" href={`/order/${product.slug}`}>
                Оформить заказ
              </Link>
              <Link className="commerce-button secondary" href="/templates">
                Смотреть демо
              </Link>
            </div>
          </div>
        </div>
      </section>
    </CommerceShell>
  );
}
