// Button — primary interactive element
//
// variant = 'primary' | 'secondary' | 'ghost'
// size    = 'sm' | 'md' | 'lg'
// tone    = 'default' (ink/bg palette)
//           'light'   (inverted — for use on dark backgrounds)
//
// className is allowed ONLY for responsive/semantic layout classes
// (e.g. 'nav-mobile-toggle'). Never for cosmetics.
// No style prop — all visual variants are expressed through tone + variant.

function Button({ children, to, onClick, type = 'button', variant = 'primary', size = 'md', tone = 'default', disabled, loading, className, ...rest }) {
  const sizeMap = {
    sm: { fontSize: 11, padding: '8px 14px' },
    md: { fontSize: 12, padding: '14px 22px' },
    lg: { fontSize: 13, padding: '18px 28px' },
  };
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontFamily: "'JetBrains Mono', monospace", fontSize: sizeMap[size]?.fontSize ?? 12,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: sizeMap[size]?.padding ?? '14px 22px',
    borderRadius: 999, cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent', whiteSpace: 'nowrap',
    transition: 'transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease), background var(--t-fast) var(--ease), color var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease)',
  };
  const colours = {
    default: {
      primary:   { background: 'var(--ink)', color: 'var(--bg)' },
      secondary: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--ink)' },
      ghost:     { background: 'transparent', color: 'var(--ink)' },
    },
    light: {
      primary:   { background: 'var(--bg)', color: 'var(--ink)' },
      secondary: { background: 'transparent', color: 'var(--bg)', borderColor: 'var(--bg)' },
      ghost:     { background: 'transparent', color: 'var(--bg)' },
    },
  };
  const finalStyle = { ...base, ...colours[tone][variant] };
  const cls = ['btn', className].filter(Boolean).join(' ');
  const content = loading ? (
    <>
      <span className="sr-only">Загрузка</span>
      <span aria-hidden="true" style={{
        width: 12, height: 12, border: '1.5px solid currentColor',
        borderTopColor: 'transparent', borderRadius: '50%',
        display: 'inline-block', animation: 'spin 0.7s linear infinite',
      }} />
      {children}
    </>
  ) : children;
  if (to && !disabled) {
    return <Link to={to} className={cls} style={finalStyle} {...rest}>{content}</Link>;
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading || undefined}
      className={cls}
      style={finalStyle}
      {...rest}
    >{content}</button>
  );
}
