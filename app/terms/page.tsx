import type { Metadata } from "next";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";

export const metadata: Metadata = {
  title: "Пользовательское соглашение | denisixone",
  description: "Условия покупки свадебных шаблонов и дизайн-пакетов.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <CommerceShell>
      <PageHero eyebrow="Документы" title="Пользовательское соглашение.">
        <p>Базовая оферта для продажи шаблонов и дизайн-пакетов в России. Юридические реквизиты нужно заменить перед релизом.</p>
      </PageHero>
      <article className="commerce-card">
        <div className="commerce-card-body">
          <h2 className="serif">Предмет</h2>
          <p>Исполнитель оказывает цифровые услуги: адаптация свадебного шаблона или разработка дизайн-пакета под ключ.</p>
          <h2 className="serif">Оплата</h2>
          <p>Оплата производится в рублях через ЮKassa. Заказ считается принятым после успешной оплаты.</p>
          <h2 className="serif">Сроки</h2>
          <p>Готовый шаблон выполняется ориентировочно за 5 рабочих дней, дизайн-пакет за 2-4 недели после получения материалов.</p>
          <h2 className="serif">Материалы клиента</h2>
          <p>Покупатель отвечает за права на переданные фото, тексты и иные материалы.</p>
          <h2 className="serif">Возвраты</h2>
          <p>Возврат по цифровым услугам обсуждается индивидуально до начала работ и зависит от фактически выполненного объёма.</p>
        </div>
      </article>
    </CommerceShell>
  );
}
