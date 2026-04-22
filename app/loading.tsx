export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      style={{
        minHeight: "100vh",
        padding: "96px var(--pad-x)",
        background: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
          Загрузка
        </div>
        <div
          className="skeleton"
          style={{ width: "min(680px, 100%)", height: 56, marginTop: 28, borderRadius: 4 }}
        />
        <div
          className="skeleton"
          style={{ width: "min(420px, 78%)", height: 18, marginTop: 24, borderRadius: 4 }}
        />
      </div>
    </main>
  );
}
