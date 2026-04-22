// Chip — pill toggle / filter button
//
// active = boolean — controls filled/outline visual state
// size   = 'sm' | 'md' (default)
//
// Caller provides only semantic intent: active state, click handler,
// ARIA role (tab / option / etc). No visual overrides from outside.

function Chip({ children, active, onClick, role, 'aria-selected': ariaSelected, 'aria-pressed': ariaPressed, size = 'md' }) {
  const pad = size === 'sm' ? '5px 12px' : '6px 14px';
  return (
    <button
      type="button"
      role={role}
      aria-selected={ariaSelected}
      aria-pressed={ariaPressed}
      onClick={onClick}
      className="chip"
      style={{
        background: active ? 'var(--ink)' : 'transparent',
        color: active ? 'var(--bg)' : 'var(--ink)',
        border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
        borderRadius: 999, padding: pad,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >{children}</button>
  );
}
