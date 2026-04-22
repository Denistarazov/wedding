// Shared components, router, utilities

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Router ─────────────────────────────────────────────────────────────────

// For /#<id> routes we render Home and then scroll to the element with that id.
function scrollToRoute(route, smooth) {
  if (route.startsWith('/#')) {
    const id = route.slice(2);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    }));
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');
  useEffect(() => {
    const initial = window.location.hash.slice(1) || '/';
    if (initial.startsWith('/#')) scrollToRoute(initial, false);

    const onHash = () => {
      const newRoute = window.location.hash.slice(1) || '/';
      setRoute(newRoute);
      scrollToRoute(newRoute, true);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

function navigate(path) {
  const current = window.location.hash.slice(1) || '/';
  if (current === path && path.startsWith('/#')) {
    const id = path.slice(2);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  window.location.hash = path;
}

// Router primitive — like <a> but for hash-based routes.
// Accepts className and style because it is a primitive (not a composed component).
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

// ─── Animation ──────────────────────────────────────────────────────────────

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

function Reveal({ children, delay = 0, y = 14, as = 'div', ...rest }) {
  const [ref, visible] = useReveal();
  const Tag = as;
  return (
    <Tag
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.7s ${delay}s cubic-bezier(.2,.8,.2,1), transform 0.7s ${delay}s cubic-bezier(.2,.8,.2,1)`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ─── Navigation shell ────────────────────────────────────────────────────────

// Global top nav — shown on marketing pages, NOT on /templates/[slug]
function TopNav({ dark = false }) {
  const [open, setOpen] = useState(false);
  const route = useRoute();

  useEffect(() => { setOpen(false); }, [route]);
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const bg   = dark ? 'rgba(20,16,10,0.72)' : 'rgba(245,241,234,0.72)';
  const fg   = dark ? '#f5f1ea' : '#2a2418';
  const line = dark ? 'rgba(245,241,234,0.1)' : 'rgba(42,36,24,0.1)';

  const navItems = [
    ['/templates', 'Дизайны'],
    ['/#process',  'Процесс'],
    ['/#pricing',  'Цены'],
    ['/#faq',      'FAQ'],
  ];

  return (
    <React.Fragment>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(14px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(14px) saturate(1.2)',
        background: bg, color: fg,
        borderBottom: `1px solid ${line}`,
      }}>
        <div style={{
          maxWidth: 'var(--max-w)', margin: '0 auto',
          padding: '14px var(--pad-x)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>
          <Link to="/" aria-label="denisixone — на главную" style={{
            display: 'flex', alignItems: 'baseline', gap: 10,
            fontFamily: "'Fraunces', serif",
          }}>
            <span style={{ fontSize: 22, fontStyle: 'italic', letterSpacing: '-0.01em' }}>denisixone</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.55, letterSpacing: '0.2em' }}>— СВАДЬБЫ/2026</span>
          </Link>

          <nav className="nav-desktop" aria-label="Главное меню" style={{
            display: 'flex', gap: 32, alignItems: 'center',
          }}>
            {navItems.map(([href, label]) => (
              <NavLink key={href} to={href}>{label}</NavLink>
            ))}
            <Button to="/contact" variant="secondary" size="md" tone={dark ? 'light' : 'default'}>
              Связаться →
            </Button>
          </nav>

          <Button
            className="nav-mobile-toggle"
            variant="secondary"
            tone={dark ? 'light' : 'default'}
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Закрыть' : 'Меню'}
          </Button>
        </div>
      </header>

      {/* Drawer is a sibling of <header> — avoids backdrop-filter containing block */}
      <div
        id="nav-drawer"
        className="nav-drawer"
        data-open={open}
        role="dialog"
        aria-modal={open}
        aria-label="Мобильное меню"
        hidden={!open}
        style={{ background: dark ? '#14100a' : 'var(--bg)', color: fg }}
      >
        {navItems.map(([href, label]) => (
          <Link key={href} to={href} onClick={() => setOpen(false)}>{label}</Link>
        ))}
        <div style={{ marginTop: 32 }}>
          <Button to="/contact" tone={dark ? 'light' : 'default'} onClick={() => setOpen(false)}>
            Связаться →
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--line)',
      padding: 'clamp(56px, 9vw, 80px) var(--pad-x) 40px',
      marginTop: 'clamp(80px, 12vw, 120px)',
    }}>
      <div className="footer-grid" style={{
        maxWidth: 'var(--max-w)', margin: '0 auto',
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60,
      }}>
        <div>
          <div className="serif" style={{
            fontSize: 'clamp(36px, 5vw, 48px)', fontStyle: 'italic',
            letterSpacing: '-0.02em', lineHeight: 1,
          }}>denisixone</div>
          <p style={{ marginTop: 24, maxWidth: 360, color: 'var(--muted)', lineHeight: 1.65, fontSize: 14 }}>
            Свадебные сайты-приглашения, которые приятно получать и удобно рассылать.
            Готовые дизайны и кастом под ключ.
          </p>
        </div>
        <FooterCol title="Продукт" links={[['Все дизайны', '/templates'], ['Процесс', '/#process'], ['Цены', '/#pricing'], ['FAQ', '/#faq']]} />
        <FooterCol title="Контакты" links={[
          ['Форма заявки', '/contact'],
          ['den484411@gmail.com', 'mailto:den484411@gmail.com', true],
          ['@denisixone', 'https://t.me/denisixone', true],
        ]} />
        <FooterCol title="Легал" links={[['Оферта', '/'], ['Приватность', '/'], ['© denisixone 2026', '/']]} />
      </div>
      <div className="footer-bottom" style={{
        maxWidth: 'var(--max-w)', margin: '60px auto 0', paddingTop: 24,
        borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        <span>Made in Perm · Serving worldwide</span>
        <span>V.2026.04</span>
      </div>
    </footer>
  );
}

// FooterCol styles its own children — Link primitives with fontSize 14 are internal.
function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 20,
      }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(([label, href, external]) => (
          <li key={label}>
            {external ? (
              <a
                href={href}
                rel="noopener noreferrer"
                target={href.startsWith('http') ? '_blank' : undefined}
                className="nav-link"
                style={{ fontSize: 14 }}
              >{label}</a>
            ) : (
              <Link to={href} className="nav-link" style={{ fontSize: 14 }}>{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

Object.assign(window, {
  useRoute, navigate, Link, useReveal, Reveal,
  TopNav, Footer, Button, Eyebrow, Chip, ProcessStep, FaqItem, NavLink,
});
