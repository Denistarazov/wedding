"use client";

import { useState } from "react";

type OrderFormProps = {
  productSlug: string;
  productTitle: string;
};

type SubmitState = {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
};

export function OrderForm({ productSlug, productTitle }: OrderFormProps) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function submit(formData: FormData) {
    setState({ status: "loading" });

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productSlug,
        customerName: formData.get("customerName"),
        contact: formData.get("contact"),
        message: formData.get("message"),
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setState({
        status: "error",
        message: payload?.error || "Не удалось создать заказ. Попробуйте ещё раз.",
      });
      return;
    }

    if (payload.confirmationUrl) {
      window.location.assign(payload.confirmationUrl);
      return;
    }

    setState({
      status: "success",
      message: `Заказ ${payload.orderNumber || ""} создан. Оплата пока не настроена.`,
    });
  }

  return (
    <form action={submit} className="commerce-form">
      <input type="hidden" name="productSlug" value={productSlug} />
      <div className="commerce-form-heading">
        <p>Оформление</p>
        <h2 className="serif">{productTitle}</h2>
      </div>
      <label>
        <span>Имя</span>
        <input name="customerName" required autoComplete="name" placeholder="Как к вам обращаться" />
      </label>
      <label>
        <span>Email или Telegram</span>
        <input name="contact" required autoComplete="email" inputMode="email" placeholder="@you или you@mail.ru" />
      </label>
      <label>
        <span>Комментарий</span>
        <textarea name="message" rows={5} placeholder="Ссылка на референсы, дата свадьбы, пожелания" />
      </label>
      <button className="commerce-button" disabled={state.status === "loading"} type="submit">
        {state.status === "loading" ? "Создаём заказ..." : "Перейти к оплате"}
      </button>
      {state.message ? (
        <p className={state.status === "error" ? "commerce-alert error" : "commerce-alert success"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
