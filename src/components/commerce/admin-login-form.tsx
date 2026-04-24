"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setError("");
    setLoading(true);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: formData.get("password") }),
    });
    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload?.error || "Не удалось войти");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form action={submit} className="commerce-form" style={{ maxWidth: 480 }}>
      <div className="commerce-form-heading">
        <p>Владелец</p>
        <h2 className="serif">Вход в админку</h2>
      </div>
      <label>
        <span>Пароль администратора</span>
        <input name="password" type="password" required autoComplete="current-password" />
      </label>
      <button className="commerce-button" disabled={loading} type="submit">
        {loading ? "Проверяем..." : "Войти"}
      </button>
      {error ? <p className="commerce-alert error">{error}</p> : null}
    </form>
  );
}
