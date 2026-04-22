// FaqItem — single accordion row in the FAQ section
//
// Props: question, answer, open (boolean), onToggle, index
// All visual state (animation, open/closed) is self-contained.
// Caller provides only data and open state — no visual props.

function FaqItem({ question, answer, open, onToggle, index }) {
  const panelId = `faq-panel-${index}`;
  const btnId = `faq-btn-${index}`;
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <dt>
        <button
          id={btnId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          style={{
            width: '100%', textAlign: 'left',
            background: 'transparent', border: 0, cursor: 'pointer',
            padding: '28px 0', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', gap: 16,
            fontFamily: 'inherit', color: 'inherit',
            transition: 'opacity var(--t-fast) var(--ease)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <span className="serif" style={{
            fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 400, letterSpacing: '-0.01em',
          }}>{question}</span>
          <span aria-hidden="true" style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 18,
            transition: 'transform 0.25s var(--ease)',
            transform: open ? 'rotate(45deg)' : 'none', flexShrink: 0,
          }}>+</span>
        </button>
      </dt>
      <dd
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        hidden={!open}
        style={{
          margin: 0,
          maxHeight: open ? 400 : 0, opacity: open ? 1 : 0, overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.25s ease, padding 0.25s',
          padding: open ? '0 0 28px 0' : '0',
        }}
      >
        <p style={{ margin: 0, fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 720 }}>{answer}</p>
      </dd>
    </div>
  );
}
