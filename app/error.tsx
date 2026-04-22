"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "80px var(--pad-x)",
        background: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      <section style={{ maxWidth: 560, textAlign: "center" }}>
        <p className="mono" style={{ margin: 0, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          Ошибка
        </p>
        <h1 className="serif" style={{ margin: "18px 0 0", fontSize: "clamp(40px, 8vw, 82px)", lineHeight: 0.96, fontWeight: 400 }}>
          Что-то пошло не так.
        </h1>
        <p style={{ margin: "22px auto 0", color: "var(--ink-2)", lineHeight: 1.65 }}>
          Попробуйте обновить страницу. Если ошибка повторится, вернитесь на главную.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 28 }}>
          <button
            className="btn"
            type="button"
            onClick={reset}
            style={{
              border: "1px solid var(--ink)",
              borderRadius: 999,
              background: "var(--ink)",
              color: "var(--bg)",
              padding: "14px 22px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Повторить
          </button>
          <Link
            className="btn"
            href="/"
            style={{
              border: "1px solid var(--ink)",
              borderRadius: 999,
              color: "var(--ink)",
              padding: "14px 22px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            На главную
          </Link>
        </div>
      </section>
    </main>
  );
}
