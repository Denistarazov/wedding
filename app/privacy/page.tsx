import type { Metadata } from "next";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | denisixone",
  description: "Как weddingbuy.ru обрабатывает заявки, заказы и платежные данные.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <CommerceShell>
      <PageHero eyebrow="Документы" title="Политика конфиденциальности.">
        <p>Редакция для production-запуска. Перед масштабированием её стоит проверить с юристом под конкретное ИП/самозанятость.</p>
      </PageHero>
      <article className="commerce-card">
        <div className="commerce-card-body">
          <h2 className="serif">Какие данные собираем</h2>
          <p>Имя, email или Telegram, комментарий к заказу, выбранную услугу, сумму заказа и технические статусы платежей.</p>
          <h2 className="serif">Зачем</h2>
          <p>Чтобы обработать заявку, принять оплату, связаться с покупателем и выполнить услугу.</p>
          <h2 className="serif">Платежи</h2>
          <p>Платёжные реквизиты банковских карт обрабатывает ЮKassa. Сайт не хранит полные данные карт.</p>
          <h2 className="serif">Аналитика</h2>
          <p>Используется приватная продуктовая аналитика без продажи персональных данных третьим лицам.</p>
          <h2 className="serif">Удаление данных</h2>
          <p>Для удаления или уточнения данных напишите на den484411@gmail.com.</p>
        </div>
      </article>
    </CommerceShell>
  );
}
