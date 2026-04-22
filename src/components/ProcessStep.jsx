// ProcessStep — numbered step card in the Process section
//
// Props: number (string '01'-'05'), title, body
// Fully self-contained visual card.
// Layout position (grid cell) is controlled by the parent ol.process-grid.

function ProcessStep({ number, title, body }) {
  return (
    <li style={{ borderTop: '1px solid var(--ink)', paddingTop: 22 }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.14em', color: 'var(--muted)',
      }}>STEP {number}</div>
      <div className="serif" style={{
        fontSize: 28, fontWeight: 400, margin: '14px 0 12px', letterSpacing: '-0.01em',
      }}>{title}</div>
      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', margin: 0 }}>{body}</p>
    </li>
  );
}
