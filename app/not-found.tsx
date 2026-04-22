import Link from "next/link";

export default function NotFound() {
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
          404
        </p>
        <h1 className="serif" style={{ margin: "18px 0 0", fontSize: "clamp(54px, 12vw, 132px)", fontStyle: "italic", lineHeight: 0.9, fontWeight: 400 }}>
          Не найдено.
        </h1>
        <p style={{ margin: "22px auto 0", color: "var(--ink-2)", lineHeight: 1.65 }}>
          Такой страницы нет или ссылка устарела.
        </p>
        <Link
          className="btn"
          href="/"
          style={{
            marginTop: 28,
            display: "inline-flex",
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
          На главную
        </Link>
      </section>
    </main>
  );
}
