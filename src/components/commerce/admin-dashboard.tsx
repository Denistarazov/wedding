"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  slug: string;
  title: string;
  type: "TEMPLATE" | "DESIGN_PACKAGE";
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  price: number;
  short: string;
  description: string;
  image?: string | null;
};

export function AdminProductForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Product | null>(products[0] || null);
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setMessage("");
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: formData.get("id") || undefined,
        slug: formData.get("slug"),
        title: formData.get("title"),
        type: formData.get("type"),
        status: formData.get("status"),
        price: Number(formData.get("price")),
        short: formData.get("short"),
        description: formData.get("description"),
        image: formData.get("image"),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload?.error || "Не удалось сохранить услугу");
      return;
    }

    setMessage("Услуга сохранена");
    router.refresh();
  }

  async function remove() {
    if (!selected) return;
    setMessage("");
    const response = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id }),
    });
    if (!response.ok) {
      setMessage("Не удалось удалить услугу");
      return;
    }
    setSelected(null);
    setMessage("Услуга удалена");
    router.refresh();
  }

  return (
    <section className="commerce-card">
      <div className="commerce-card-body">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          {products.map((product) => (
            <button className="commerce-button secondary" key={product.id} onClick={() => setSelected(product)} type="button">
              {product.title}
            </button>
          ))}
          <button className="commerce-button secondary" onClick={() => setSelected(null)} type="button">
            Новая
          </button>
        </div>
        <form action={submit} className="commerce-form">
          <input name="id" type="hidden" value={selected?.id || ""} />
          <label>
            <span>Slug</span>
            <input name="slug" required defaultValue={selected?.slug || ""} />
          </label>
          <label>
            <span>Название</span>
            <input name="title" required defaultValue={selected?.title || ""} />
          </label>
          <label>
            <span>Тип</span>
            <select name="type" defaultValue={selected?.type || "TEMPLATE"}>
              <option value="TEMPLATE">Шаблон</option>
              <option value="DESIGN_PACKAGE">Дизайн-пакет</option>
            </select>
          </label>
          <label>
            <span>Статус</span>
            <select name="status" defaultValue={selected?.status || "ACTIVE"}>
              <option value="DRAFT">Черновик</option>
              <option value="ACTIVE">Активна</option>
              <option value="ARCHIVED">Архив</option>
            </select>
          </label>
          <label>
            <span>Цена в копейках</span>
            <input name="price" required type="number" min="0" defaultValue={selected?.price || 400000} />
          </label>
          <label>
            <span>Короткое описание</span>
            <input name="short" required defaultValue={selected?.short || ""} />
          </label>
          <label>
            <span>Изображение</span>
            <input name="image" defaultValue={selected?.image || ""} />
          </label>
          <label>
            <span>Описание</span>
            <textarea name="description" required rows={5} defaultValue={selected?.description || ""} />
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="commerce-button" type="submit">Сохранить</button>
            {selected ? (
              <button className="commerce-button secondary" onClick={remove} type="button">
                Удалить
              </button>
            ) : null}
          </div>
          {message ? <p className={message.includes("Не удалось") ? "commerce-alert error" : "commerce-alert success"}>{message}</p> : null}
        </form>
      </div>
    </section>
  );
}

export function AdminStatusSelect({
  id,
  status,
  endpoint,
}: {
  id: string;
  status: string;
  endpoint: "/api/admin/orders" | "/api/admin/leads";
}) {
  const router = useRouter();

  async function update(nextStatus: string) {
    await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    router.refresh();
  }

  const options =
    endpoint === "/api/admin/orders"
      ? ["NEW", "PAYMENT_PENDING", "PAID", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
      : ["NEW", "CONTACTED", "WON", "LOST"];

  return (
    <select defaultValue={status} onChange={(event) => update(event.target.value)} aria-label="Изменить статус">
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}
