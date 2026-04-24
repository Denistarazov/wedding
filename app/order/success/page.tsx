import Link from "next/link";
import type { Metadata } from "next";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";

export const metadata: Metadata = {
  title: "Заказ принят | denisixone",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;

  return (
    <CommerceShell>
      <PageHero eyebrow="Готово" title="Оплата обрабатывается.">
        <p>
          {params.order ? `Заказ ${params.order} создан. ` : ""}
          ЮKassa пришлёт финальный статус через webhook, после чего заказ станет оплаченным в админке.
        </p>
      </PageHero>
      <Link className="commerce-button" href="/shop">
        Вернуться в каталог
      </Link>
    </CommerceShell>
  );
}
