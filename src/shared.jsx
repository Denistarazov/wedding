// Shared components, router, utilities

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Hash-based router
function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

function navigate(path) {
  window.location.hash = path;
}

function Link({ to, children, className, style, onClick, ...rest }) {
  return (
    <a
      href={'#' + to}
      className={className}
      style={style}
      onClick={(e) => { if (onClick) onClick(e); }}
      {...rest}
    >
      {children}
    </a>
  );
}

// Reveal on scroll
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, y = 14, as = 'div', style, ...rest }) {
  const [ref, visible] = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.7s ${delay}s cubic-bezier(.2,.8,.2,1), transform 0.7s ${delay}s cubic-bezier(.2,.8,.2,1)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Global top nav — shown on marketing pages, NOT on /templates/[slug]
function TopNav({ dark = false }) {
  const bg = dark ? 'rgba(20,16,10,0.7)' : 'rgba(245,241,234,0.7)';
  const fg = dark ? '#f5f1ea' : '#2a2418';
  const line = dark ? 'rgba(245,241,234,0.1)' : 'rgba(42,36,24,0.1)';
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(14px) saturate(1.2)',
      WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
      background: bg, color: fg,
      borderBottom: `1px solid ${line}`,
    }}>
      <div style={{
        maxWidth: 1360, margin: '0 auto', padding: '18px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: "'Fraunces', serif" }}>
          <span style={{ fontSize: 22, fontStyle: 'italic', letterSpacing: '-0.01em' }}>Canvas</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.55, letterSpacing: '0.2em' }}>— WEDDING/2026</span>
        </Link>
        <nav style={{ display: 'flex', gap: 36, alignItems: 'center', fontSize: 14 }}>
          <Link to="/templates" style={{ opacity: 0.75 }}>Дизайны</Link>
          <Link to="/#process" style={{ opacity: 0.75 }}>Процесс</Link>
          <Link to="/#pricing" style={{ opacity: 0.75 }}>Цены</Link>
          <Link to="/#faq" style={{ opacity: 0.75 }}>FAQ</Link>
          <Link to="/contact" style={{
            border: `1px solid ${fg}`, padding: '9px 18px', borderRadius: 999,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>Связаться →</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', padding: '80px 40px 40px', marginTop: 120 }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60 }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 1 }}>Canvas</div>
          <p style={{ marginTop: 24, maxWidth: 360, color: 'var(--muted)', lineHeight: 1.65, fontSize: 14 }}>
            Свадебные сайты-приглашения, которые приятно получать и удобно рассылать.
            Готовые дизайны и кастом под ключ.
          </p>
        </div>
        <FooterCol title="Продукт" links={[['Все дизайны', '/templates'], ['Процесс', '/#process'], ['Цены', '/#pricing'], ['FAQ', '/#faq']]} />
        <FooterCol title="Контакты" links={[['Форма заявки', '/contact'], ['hello@canvas.wedding', '/contact'], ['@canvas_wedding', '/contact']]} />
        <FooterCol title="Легал" links={[['Оферта', '/'], ['Приватность', '/'], ['© Canvas Studio 2026', '/']]} />
      </div>
      <div style={{
        maxWidth: 1360, margin: '60px auto 0', paddingTop: 24,
        borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        <span>Made in Tbilisi · Serving worldwide</span>
        <span>V.2026.04</span>
      </div>
    </footer>
  );
}
function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(([label, href]) => (
          <li key={label}><Link to={href} style={{ fontSize: 14 }}>{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

// Primary button
function Button({ children, to, onClick, variant = 'primary', size = 'md', style, ...rest }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    fontFamily: "'JetBrains Mono', monospace", fontSize: size === 'lg' ? 13 : 12,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: size === 'lg' ? '18px 28px' : '14px 22px',
    borderRadius: 999, cursor: 'pointer', border: '1px solid transparent',
    transition: 'all 0.2s ease', whiteSpace: 'nowrap',
  };
  const variants = {
    primary: { background: 'var(--ink)', color: 'var(--bg)' },
    secondary: { background: 'transparent', color: 'var(--ink)', borderColor: 'var(--ink)' },
    ghost: { background: 'transparent', color: 'var(--ink)' },
  };
  const finalStyle = { ...base, ...variants[variant], ...style };
  if (to) return <Link to={to} style={finalStyle} {...rest}>{children}</Link>;
  return <button onClick={onClick} style={finalStyle} {...rest}>{children}</button>;
}

// Section eyebrow
function Eyebrow({ children, number, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', ...style }}>
      {number && <span style={{ opacity: 0.6 }}>{number}</span>}
      <span style={{ width: 24, height: 1, background: 'currentColor', opacity: 0.4 }} />
      <span>{children}</span>
    </div>
  );
}

Object.assign(window, {
  useRoute, navigate, Link, useReveal, Reveal,
  TopNav, Footer, Button, Eyebrow,
});
