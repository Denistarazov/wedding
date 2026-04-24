"use client";

import { useState } from "react";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        contact: formData.get("contact"),
        type: formData.get("type"),
        message: formData.get("message"),
        source: "contact_form",
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error || "Не удалось отправить заявку.");
      return;
    }

    setStatus("success");
    setMessage("Заявка отправлена. Владелец увидит её в админке.");
  }

  return (
    <form action={submit} className="commerce-form">
      <div className="commerce-form-heading">
        <p>Заявка</p>
        <h2 className="serif">Обсудить проект</h2>
      </div>
      <label>
        <span>Имя</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        <span>Email или Telegram</span>
        <input name="contact" required autoComplete="email" inputMode="email" />
      </label>
      <label>
        <span>Тип</span>
        <select name="type" defaultValue="Шаблон">
          <option>Шаблон</option>
          <option>Дизайн-пакет</option>
          <option>Не знаю</option>
        </select>
      </label>
      <label>
        <span>Комментарий</span>
        <textarea name="message" rows={5} />
      </label>
      <button className="commerce-button" disabled={status === "loading"} type="submit">
        {status === "loading" ? "Отправляем..." : "Отправить заявку"}
      </button>
      {message ? (
        <p className={status === "error" ? "commerce-alert error" : "commerce-alert success"} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
