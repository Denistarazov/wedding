// Eyebrow — section label displayed above headings
//
// align = 'left' (default) | 'center'
// tone  = 'default' (muted ink colour)
//         'light'   (muted light colour — for dark-background sections)
//
// No style prop. All visual variants are semantic props.

function Eyebrow({ children, number, align = 'left', tone = 'default' }) {
  const color = tone === 'light' ? 'rgba(245,241,234,0.6)' : 'var(--muted)';
  const justify = align === 'center' ? 'center' : 'flex-start';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: justify, gap: 14,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
      letterSpacing: '0.2em', textTransform: 'uppercase', color,
    }}>
      {number && <span style={{ opacity: 0.6 }}>{number}</span>}
      <span style={{ width: 24, height: 1, background: 'currentColor', opacity: 0.4 }} />
      <span>{children}</span>
    </div>
  );
}
