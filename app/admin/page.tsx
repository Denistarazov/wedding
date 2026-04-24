import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/auth";
import { catalogProducts, formatRub } from "@/lib/catalog";
import { getDb, hasDatabaseUrl } from "@/lib/db";
import { AdminProductForm, AdminStatusSelect } from "@/components/commerce/admin-dashboard";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Админ-панель | denisixone",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  if (!hasDatabaseUrl()) {
    return (
      <CommerceShell>
        <PageHero eyebrow="Админ" title="Нужно подключить базу.">
          <p>Добавьте DATABASE_URL от Neon/Supabase, выполните миграции и seed. После этого появятся товары, заказы и заявки.</p>
        </PageHero>
      </CommerceShell>
    );
  }

  const db = getDb();
  for (const product of catalogProducts) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        slug: product.slug,
        title: product.title,
        type: product.kind === "template" ? "TEMPLATE" : "DESIGN_PACKAGE",
        price: product.price * 100,
        currency: "RUB",
        short: product.short,
        description: product.description,
        image: product.image,
      },
    });
  }

  const [products, orders, leads, paidOrders] = await Promise.all([
    db.product.findMany({ orderBy: { updatedAt: "desc" } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, include: { product: true, payments: { take: 1, orderBy: { createdAt: "desc" } } }, take: 30 }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
    db.order.findMany({ where: { status: "PAID" } }),
  ]);

  const revenue = paidOrders.reduce((sum, order) => sum + order.amount / 100, 0);
  const popular = products
    .map((product) => ({
      title: product.title,
      count: orders.filter((order) => order.productId === product.id).length,
    }))
    .sort((a, b) => b.count - a.count)[0];

  return (
    <CommerceShell>
      <PageHero eyebrow="Админ" title="Панель владельца.">
        <p>Товары, заявки, заказы, статусы и базовая статистика. Покупатели оформляют заказ без аккаунта.</p>
      </PageHero>

      <section className="commerce-stats" aria-label="Статистика">
        <div className="commerce-stat"><span>Заказы</span><strong>{orders.length}</strong></div>
        <div className="commerce-stat"><span>Заявки</span><strong>{leads.length}</strong></div>
        <div className="commerce-stat"><span>Выручка</span><strong>{formatRub(revenue)}</strong></div>
        <div className="commerce-stat"><span>Популярное</span><strong>{popular?.title || "нет"}</strong></div>
      </section>

      <div className="commerce-admin-grid">
        <AdminProductForm products={products} />
        <section className="commerce-card">
          <div className="commerce-card-body">
            <h2 className="serif">Заказы</h2>
            <table className="commerce-table">
              <thead><tr><th>№</th><th>Клиент</th><th>Услуга</th><th>Статус</th><th>Сумма</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}<br />{order.contact}</td>
                    <td>{order.product.title}</td>
                    <td><AdminStatusSelect id={order.id} status={order.status} endpoint="/api/admin/orders" /></td>
                    <td>{formatRub(order.amount / 100)}</td>
                  </tr>
                ))}
                {!orders.length ? <tr><td colSpan={5}>Пока нет заказов.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="commerce-card" style={{ marginTop: 24 }}>
        <div className="commerce-card-body">
          <h2 className="serif">Заявки</h2>
          <table className="commerce-table">
            <thead><tr><th>Контакт</th><th>Тип</th><th>Сообщение</th><th>Статус</th></tr></thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}<br />{lead.contact}</td>
                  <td>{lead.type}</td>
                  <td>{lead.message || "—"}</td>
                  <td><AdminStatusSelect id={lead.id} status={lead.status} endpoint="/api/admin/leads" /></td>
                </tr>
              ))}
              {!leads.length ? <tr><td colSpan={4}>Пока нет заявок.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </CommerceShell>
  );
}
