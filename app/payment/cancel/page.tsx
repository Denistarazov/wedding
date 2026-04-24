import Link from "next/link";
import type { Metadata } from "next";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";

export const metadata: Metadata = {
  title: "Оплата отменена | denisixone",
  robots: { index: false, follow: false },
};

export default function PaymentCancelPage() {
  return (
    <CommerceShell>
      <PageHero eyebrow="Оплата" title="Платёж не завершён.">
        <p>Можно вернуться в каталог и оформить заказ заново. Повторная обработка webhook защищена idempotency-записью.</p>
      </PageHero>
      <Link className="commerce-button" href="/shop">
        В каталог
      </Link>
    </CommerceShell>
  );
}
