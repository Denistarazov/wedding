// @ts-nocheck
'use client';
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// ===== src/shared.jsx =====
// Shared components, router, utilities

const { useState, useEffect, useRef, useMemo } = React;
const browserGlobal = typeof window !== 'undefined' ? window : {};

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
  const pathname = usePathname() || '/';
  const [hash, setHash] = useState('');

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash || '');
    };
    syncHash();
    window.addEventListener('popstate', syncHash);
    window.addEventListener('hashchange', syncHash);
    return () => {
      window.removeEventListener('popstate', syncHash);
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);

  const route = useMemo(() => {
    if (hash.startsWith('#/')) return hash.slice(1);
    if (pathname === '/' && hash.length > 1) return '/' + hash;
    return pathname;
  }, [hash, pathname]);

  useEffect(() => {
    scrollToRoute(route, false);
  }, [route]);

  return route;
}

function navigate(path) {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}
function Link({ to, children, className, style, onClick, ...rest }) {
  return (
    <a
      href={to}
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
  const [open, setOpen] = useState(false);
  const route = useRoute();

  // close drawer on route change
  useEffect(() => { setOpen(false); }, [route]);

  // lock body scroll when drawer open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const bg = dark ? 'rgba(20,16,10,0.72)' : 'rgba(245,241,234,0.72)';
  const fg = dark ? '#f5f1ea' : '#2a2418';
  const line = dark ? 'rgba(245,241,234,0.1)' : 'rgba(42,36,24,0.1)';

  const navItems = [
    ['/shop', 'Магазин'],
    ['/templates', 'Дизайны'],
    ['/#process', 'Процесс'],
    ['/#pricing', 'Цены'],
    ['/#faq', 'FAQ'],
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
          <Link to="/" aria-label="denisixone — на главную" className="brand-link" style={{
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

      {/* Drawer is a sibling of <header> — cannot be trapped by header's backdrop-filter containing block */}
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
          <p style={{
            marginTop: 24, maxWidth: 360,
            color: 'var(--muted)', lineHeight: 1.65, fontSize: 14,
          }}>
            Свадебные сайты-приглашения, которые приятно получать и удобно рассылать.
            Готовые дизайны и кастом под ключ.
          </p>
        </div>
        <FooterCol title="Продукт" links={[['Магазин', '/shop'], ['Все дизайны', '/templates'], ['Процесс', '/#process'], ['Цены', '/#pricing'], ['FAQ', '/#faq']]} />
        <FooterCol title="Контакты" links={[
          ['Форма заявки', '/contact'],
          ['den484411@gmail.com', 'mailto:den484411@gmail.com', true],
          ['@denisixone', 'https://t.me/denisixone', true],
        ]} />
        <FooterCol title="Легал" links={[['Оферта', '/terms'], ['Приватность', '/privacy'], ['© denisixone 2026', '/']]} />
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
function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 20,
      }}>{title}</div>
      <ul style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {links.map(([label, href, external]) => (
          <li key={label}>
            {external ? (
              <a
                href={href}
                rel="noopener noreferrer"
                target={href.startsWith('http') ? '_blank' : undefined}
                className="nav-link text-link"
                style={{ fontSize: 14 }}
              >{label}</a>
            ) : (
              <Link to={href} className="nav-link text-link" style={{ fontSize: 14 }}>{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
// Primary button
// variant = 'primary' | 'secondary' | 'ghost'
// size    = 'md' | 'lg'
// tone    = 'default' (ink/bg palette) | 'light' (inverted — for use on dark backgrounds)
// className is allowed only for responsive/semantic classes (e.g. nav-mobile-toggle), never for cosmetics
function Button({ children, to, onClick, type = 'button', variant = 'primary', size = 'md', tone = 'default', disabled, loading, className, ...rest }) {
  const sizeMap = { sm: { fontSize: 11, padding: '8px 14px' }, md: { fontSize: 12, padding: '14px 22px' }, lg: { fontSize: 13, padding: '18px 28px' } };
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    fontFamily: "'JetBrains Mono', monospace", fontSize: sizeMap[size]?.fontSize ?? 12,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: sizeMap[size]?.padding ?? '14px 22px',
    borderRadius: 999, cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1px solid transparent', whiteSpace: 'nowrap',
    transition: 'transform var(--t-fast) var(--ease), box-shadow var(--t-fast) var(--ease), background var(--t-fast) var(--ease), color var(--t-fast) var(--ease), border-color var(--t-fast) var(--ease)',
  };
  // Two complete colour sets — no overrides needed from outside
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
  if (to && !disabled && !loading) {
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

// Section eyebrow label
// align = 'left' (default) | 'center'
// tone  = 'default' (muted ink) | 'light' (muted on dark bg)
function Eyebrow({ children, number, align = 'left', tone = 'default' }) {
  const color = tone === 'light' ? 'rgba(245,241,234,0.6)' : 'var(--muted)';
  const justify = align === 'center' ? 'center' : 'flex-start';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: justify, gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color }}>
      {number && <span style={{ opacity: 0.6 }}>{number}</span>}
      <span style={{ width: 24, height: 1, background: 'currentColor', opacity: 0.4 }} />
      <span>{children}</span>
    </div>
  );
}

// Pill toggle / filter chip
// active = boolean
// Visually self-contained — caller provides only semantic intent (active, onClick, role)
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

// Numbered process step card
// Fully self-contained visual card — layout position controlled by parent grid
function ProcessStep({ number, title, body }) {
  return (
    <li style={{ borderTop: '1px solid var(--ink)', paddingTop: 22 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', color: 'var(--muted)' }}>STEP {number}</div>
      <div className="serif" style={{ fontSize: 28, fontWeight: 400, margin: '14px 0 12px', letterSpacing: '-0.01em' }}>{title}</div>
      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', margin: 0 }}>{body}</p>
    </li>
  );
}

// FAQ accordion item
// All visual state (open/closed animation) is self-contained — caller passes only data + open state
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
          <span className="serif" style={{ fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 400, letterSpacing: '-0.01em' }}>{question}</span>
          <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, transition: 'transform 0.25s var(--ease)', transform: open ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
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

// Navigation text link — for use inside header/footer nav lists
// Encapsulates: underline hover effect, reduced opacity, consistent font size
// Caller controls only destination (to) and click handler (onClick)
function NavLink({ to, children, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="nav-link" style={{ fontSize: 14, opacity: 0.78 }}>
      {children}
    </Link>
  );
}

Object.assign(browserGlobal, {
  useRoute, navigate, Link, useReveal, Reveal,
  TopNav, Footer, Button, Eyebrow, Chip, ProcessStep, FaqItem, NavLink,
});


// ===== src/placeholders.jsx =====
// SVG placeholder generators — monochrome, subtle textures, always labeled when helpful

function Placeholder({ label, ratio = '4/5', variant = 'stripes', fg = '#8a7a5a', bg = '#ede4d0', style, ...rest }) {
  const pid = 'p' + React.useId().replace(/:/g, '');
  const patterns = {
    stripes: (
      <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke={fg} strokeWidth="0.6" opacity="0.35" />
      </pattern>
    ),
    dots: (
      <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="0.8" fill={fg} opacity="0.4" />
      </pattern>
    ),
    grid: (
      <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke={fg} strokeWidth="0.4" opacity="0.35" />
      </pattern>
    ),
    cross: (
      <pattern id={pid} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <line x1="0" y1="7" x2="14" y2="7" stroke={fg} strokeWidth="0.5" opacity="0.3" />
        <line x1="7" y1="0" x2="7" y2="14" stroke={fg} strokeWidth="0.5" opacity="0.3" />
      </pattern>
    ),
  };
  return (
    <div style={{
      position: 'relative', aspectRatio: ratio, background: bg,
      overflow: 'hidden', ...style,
    }} {...rest}>
      <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <defs>{patterns[variant]}</defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: fg, opacity: 0.75, textAlign: 'center', padding: 16,
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

// Fancier portrait placeholder — silhouette-free, just chroma & frame
function Portrait({ label = 'portrait', ratio = '4/5', fg, bg, frame = false, style }) {
  return (
    <div className="letterpress-shell" style={{
      position: 'relative', aspectRatio: ratio, overflow: 'hidden',
      background: bg || '#e5dcc8',
      ...style,
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${bg || '#e5dcc8'} 0%, ${fg || '#c9b890'} 100%)` }} />
      {frame && <div style={{ position: 'absolute', inset: 10, border: `1px solid ${fg || '#8a7a5a'}`, opacity: 0.6 }} />}
      <Placeholder label={label} ratio={ratio} variant="stripes" fg={fg} bg="transparent" style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

function AssetImage({ src, alt = '', ratio = '4/5', fit = 'cover', position = 'center', sizes = '(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 720px', style, imgStyle, ...rest }) {
  return (
    <div style={{ position: 'relative', aspectRatio: ratio, overflow: 'hidden', ...style }} {...rest}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{
          objectFit: fit,
          objectPosition: position,
          ...imgStyle,
        }}
      />
    </div>
  );
}

function PreviewThumbImage({ src, alt = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ display: 'block', width: '100%', aspectRatio: '1 / 1', objectFit: 'cover' }}
    />
  );
}

Object.assign(browserGlobal, { Placeholder, Portrait, AssetImage, PreviewThumbImage });


// ===== src/templates-data.jsx =====
// The 9 template descriptors — used by portfolio grid, /templates index, and demo router

const TEMPLATES = [
  {
    slug: 'editorial',
    name: 'Aurelia',
    style: 'Editorial Magazine',
    styleRu: 'Editorial',
    structure: 'Многополосный журнал с прогресс-баром чтения',
    tagline: 'Vogue-inspired serif, монохромные фото на разлёт, колонки и буквицы',
    couple: 'Алиса & Григорий',
    coupleShort: 'A · G',
    date: '14.09.2026',
    dateIso: '2026-09-14T16:00:00',
    dateLong: 'Четырнадцатого сентября 2026 года',
    dateMono: '14 · IX · MMXXVI',
    venue: 'Вилла Абрамцево',
    city: 'Подмосковье',
    rsvpDeadline: '14 августа 2026',
    palette: { bg: '#f5f1ea', bg2: '#ede7dc', ink: '#2a2418', ink2: '#6b5d4a', accent: '#a8896b', paper: '#ffffff' },
    accent: '#f5f1ea', ink: '#2a2418', previewBg: '#f5f1ea',
    quote: { text: 'Мы не хотели ни шатров, ни сюрпризов, ни тамады. Только семью, озеро и длинный стол с белым льном.', author: 'А. & Г.' },
    story: [
      { heading: 'Как это случилось', body: 'Алиса и Григорий познакомились на выставке в Венеции в октябре две тысячи двадцать третьего года. Он стоял у работы Агнес Мартин и делал вид, что понимает, зачем художнице минимум сорок восемь одинаковых линий. Она подошла и сказала: «Это не сорок восемь, а сорок девять.»' },
      { heading: 'Три года спустя', body: 'С тех пор — три года, две страны, один переезд и бесконечные разговоры о том, какой должна быть свадьба. В итоге — вилла на озере, ужин на террасе, сто двадцать гостей и никаких шатров.' },
    ],
    program: [
      { time: '16:00', title: 'Церемония', place: 'Terrazza del Lago', note: 'welcome aperitivo с 15:30' },
      { time: '18:30', title: 'Ужин', place: 'Длинный стол под оливами', note: 'шеф Лука Марчелли' },
      { time: '21:00', title: 'Танцы', place: 'Sala delle Muse', note: 'DJ Винцент до 02:00' },
    ],
    details: { dressCode: 'Cocktail attire, no white', gift: 'Ваше присутствие — лучший подарок', kids: 'Дети приветствуются до 21:00', transfer: 'Трансфер от отеля "Абрамцево" в 15:00' },
  },
  {
    slug: 'swiss',
    name: 'Grid-14',
    style: 'Minimal Swiss',
    styleRu: 'Swiss / минимал',
    structure: 'Split-screen: левая половина закреплена, правая скроллится',
    tagline: 'Сетка 12 колонок, Helvetica, типографика первична, максимум воздуха',
    couple: 'Мира & Лев',
    coupleShort: 'MIRA · LEV',
    date: '07.06.2026',
    dateIso: '2026-06-07T15:00:00',
    dateLong: '07 июня 2026',
    dateMono: '07.06.2026',
    venue: 'Депо. Москва',
    city: 'Москва',
    rsvpDeadline: '10 мая 2026',
    palette: { bg: '#ffffff', bg2: '#f3f3f3', ink: '#111111', ink2: '#555555', accent: '#ff0040', paper: '#fafafa' },
    accent: '#ffffff', ink: '#111111', previewBg: '#ffffff',
    quote: { text: 'Ясная линия. Короткое слово. Длинный стол. Всё.', author: 'M · L' },
    story: [
      { heading: '01 / Знакомство', body: '2021, типографская мастерская в Берлине. Мира искала шрифт, Лев — повод задержаться. Нашли и то и другое.' },
      { heading: '02 / Решение', body: 'Через 3 года совместных проектов решили: свадьба — как хороший плакат. Без лишнего.' },
    ],
    program: [
      { time: '15:00', title: 'Регистрация', place: 'Депо · Площадь 2' },
      { time: '16:30', title: 'Фото-сессия', place: 'Атриум' },
      { time: '18:00', title: 'Ужин', place: 'Main Hall' },
      { time: '22:00', title: 'Сет', place: 'Loft Floor' },
    ],
    details: { dressCode: 'Black / White / Grey', gift: 'No gifts please', kids: 'Adults only', transfer: 'Метро "Белорусская", 7 минут пешком' },
  },
  {
    slug: 'garden',
    name: 'Verbena',
    style: 'Garden Botanical',
    styleRu: 'Ботанический',
    structure: 'Центральная карточка с раскрывающимися секциями',
    tagline: 'Лавандовая палитра, акварель, soft sage, ручные штрихи',
    couple: 'Эмма & Матвей',
    coupleShort: 'E & M',
    date: '22.05.2026',
    dateIso: '2026-05-22T17:00:00',
    dateLong: 'Двадцать второго мая 2026',
    dateMono: '22 · 05 · 26',
    venue: 'Усадьба «Сиреневый сад»',
    city: 'Суздаль',
    rsvpDeadline: '22 апреля 2026',
    palette: { bg: '#eef2e6', bg2: '#e2e8d3', ink: '#2d3a26', ink2: '#5a6b4c', accent: '#a8b890', paper: '#f7faf0' },
    accent: '#eef2e6', ink: '#2d3a26', previewBg: '#eef2e6',
    quote: { text: 'Мы выбрали май — чтобы сирень успела распуститься, а вы — доехать.', author: 'Эмма' },
    story: [
      { heading: 'Прованс в Суздале', body: 'Мы долго думали, как совместить русскую усадьбу и нашу любовь к Провансу. Ответ оказался простым: лаванда растёт везде, где её посадить.' },
      { heading: 'Только свои', body: 'Сорок гостей, длинный стол в саду, домашние пироги, и никакой эстрады. Только живой квартет и сверчки.' },
    ],
    program: [
      { time: '17:00', title: 'Церемония в саду', place: 'Под старой яблоней' },
      { time: '18:00', title: 'Welcome-лимонад', place: 'Веранда' },
      { time: '19:00', title: 'Ужин', place: 'Оранжерея' },
      { time: '21:30', title: 'Костёр', place: 'Луг за домом' },
    ],
    details: { dressCode: 'Garden party · пастель, избегайте каблуков', gift: 'Живые цветы приветствуются', kids: 'Дети — да, няня будет', transfer: 'Автобус от Москвы в 12:00' },
  },
  {
    slug: 'dark',
    name: 'Noctis',
    style: 'Dark Luxe',
    styleRu: 'Dark luxe',
    structure: 'Полноэкранные секции с pin-скроллом и точечной навигацией',
    tagline: 'Чёрный + золото, кинематографичная композиция, поздний вечер',
    couple: 'София & Максим',
    coupleShort: 'S · M',
    date: '30.11.2026',
    dateIso: '2026-11-30T19:00:00',
    dateLong: 'Тридцатое ноября 2026',
    dateMono: '30.XI.MMXXVI',
    venue: 'Михайловский замок',
    city: 'Санкт-Петербург',
    rsvpDeadline: '30 октября 2026',
    palette: { bg: '#0d0b08', bg2: '#15110a', ink: '#f5f1ea', ink2: '#a89a7a', accent: '#d4b87a', paper: '#1a1510' },
    accent: '#d4b87a', ink: '#0d0b08', previewBg: '#0d0b08',
    quote: { text: 'Самая длинная ночь в году — та, которая превращается в рассвет вдвоём.', author: 'S · M' },
    story: [
      { heading: 'Ноябрь, Петербург', body: 'Мы выбрали самую тёмную ночь — потому что хороший свет виден только там, где есть чему темнеть. И потому что зимний Петербург невыразимо красив.' },
      { heading: 'Только близкие', body: 'Шестьдесят свечей, сорок гостей, три тоста и одно обещание. Мы хотим запомнить не торжество, а лица.' },
    ],
    program: [
      { time: '19:00', title: 'Коктейли', place: 'Белый зал' },
      { time: '20:00', title: 'Церемония', place: 'Парадная лестница' },
      { time: '21:00', title: 'Ужин', place: 'Георгиевский зал' },
      { time: '23:30', title: 'After', place: 'Подвал · джаз-квартет' },
    ],
    details: { dressCode: 'Black tie', gift: 'Wine list — ссылка в RSVP', kids: 'Only 16+', transfer: 'Трансфер от "Астории" в 18:30' },
  },
  {
    slug: 'brutalist',
    name: 'Konkret',
    style: 'Brutalist Type',
    styleRu: 'Бруталист',
    structure: 'Горизонтальный snap-scroll между блоками',
    tagline: 'Гигантские буквы, жёсткая сетка, никаких украшений, контраст',
    couple: 'ИРА × ЯН',
    coupleShort: 'IRA × YAN',
    date: '03/08/26',
    dateIso: '2026-08-03T14:00:00',
    dateLong: '03.08.2026',
    dateMono: '03/08/26',
    venue: 'ЛОФТ №4',
    city: 'Екатеринбург',
    rsvpDeadline: '20.07.26',
    palette: { bg: '#eae4d8', bg2: '#ffffff', ink: '#000000', ink2: '#444444', accent: '#ff3b1f', paper: '#f5f0e4' },
    accent: '#ff3b1f', ink: '#000000', previewBg: '#eae4d8',
    quote: { text: 'НЕ СВАДЬБА. СБОРКА.', author: '—' },
    story: [
      { heading: '01. ФАКТЫ', body: 'ИРА — архитектор. ЯН — звукорежиссёр. ВСТРЕТИЛИСЬ НА СТРОЙКЕ ТЕАТРА. ПОЖЕНИЛИСЬ ТАМ ЖЕ — ТЕПЕРЬ УЖЕ В ЛОФТЕ.' },
      { heading: '02. ПОВЕСТКА', body: 'БЕТОН. ЗВУК. ЕДА. ЛЮДИ. КОНЕЦ.' },
    ],
    program: [
      { time: '14:00', title: 'ВХОД', place: 'ВОРОТА 4' },
      { time: '15:00', title: 'РЕГИСТРАЦИЯ', place: 'ЭТАЖ 1' },
      { time: '17:00', title: 'УЖИН', place: 'ЦЕХ' },
      { time: '21:00', title: 'СЕТ', place: 'СЦЕНА' },
    ],
    details: { dressCode: 'ОДЕНЬТЕ ТО, В ЧЁМ НЕ ЖАЛКО', gift: 'НЕ НАДО', kids: '18+', transfer: 'ТРАМВАЙ 15 ДО "ВИЗ"' },
  },
  {
    slug: 'letterpress',
    name: 'Maisonneuve',
    style: 'Vintage Letterpress',
    styleRu: 'Letterpress / book-fold',
    structure: 'Книжный разворот: 3 страницы с листанием',
    tagline: 'Тиснение, старая бумага, классическая композиция, ручной труд',
    couple: 'Элеонора & Фёдор',
    coupleShort: 'E & F',
    date: '14.06.2026',
    dateIso: '2026-06-14T13:00:00',
    dateLong: 'Четырнадцатого июня MMXXVI года',
    dateMono: 'XIV · VI · MMXXVI',
    venue: 'Усадьба Карабиха',
    city: 'Ярославль',
    rsvpDeadline: '14 мая 2026',
    palette: { bg: '#ebe1cc', bg2: '#dfd4b8', ink: '#3a2a1a', ink2: '#6b5a3f', accent: '#c9a878', paper: '#f2e9d0' },
    accent: '#c9a878', ink: '#3a2a1a', previewBg: '#ebe1cc',
    quote: { text: 'Имеем честь пригласить Вас разделить с нами день, о котором мы мечтали тихо, долго и очень вдвоём.', author: 'Г-жа Элеонора и Г-н Фёдор' },
    story: [
      { heading: 'О знакомстве', body: 'Мы встретились в библиотеке иностранной литературы в среду. Он искал Борхеса, она — тишины. Нашли друг друга.' },
      { heading: 'О семье', body: 'Три поколения наших семей будут за одним столом. Двадцать шесть кузенов. Один прадед, который помнит довоенный Ярославль.' },
    ],
    program: [
      { time: '13:00', title: 'Венчание', place: 'Храм Спаса на Городу' },
      { time: '15:00', title: 'Чай с вареньем', place: 'Веранда усадьбы' },
      { time: '17:00', title: 'Званый ужин', place: 'Каминный зал' },
      { time: '21:00', title: 'Вальсы', place: 'Паркетная гостиная' },
    ],
    details: { dressCode: 'Classic formal · длинное платье, костюм-тройка', gift: 'Книги — всегда хорошо', kids: 'С удовольствием', transfer: 'Электричка Москва-Ярославль 07:05' },
  },
  {
    slug: 'wabisabi',
    name: 'Kumo',
    style: 'Japanese Wabi-Sabi',
    styleRu: 'Wabi-sabi / parallax',
    structure: 'Сторителлинг с параллаксом и медленным проявлением каллиграфии',
    tagline: 'Тушь, пустота, асимметрия, Noto Serif JP, сакура и туман',
    couple: 'Юлия & Роман',
    coupleShort: '結',
    date: '11.04.2026',
    dateIso: '2026-04-11T15:00:00',
    dateLong: 'Одиннадцатое апреля 2026',
    dateMono: '2026.04.11',
    venue: 'Мыс Тобизина',
    city: 'Владивосток',
    rsvpDeadline: '11 марта 2026',
    palette: { bg: '#f2ede4', bg2: '#e8dfd0', ink: '#1a1814', ink2: '#5c5550', accent: '#d85a3b', paper: '#fbf6ec' },
    accent: '#d85a3b', ink: '#1a1814', previewBg: '#f2ede4',
    quote: { text: '一期一会 — один раз, одна встреча. Всё остальное — надстройка.', author: '結 · Musubi' },
    story: [
      { heading: 'Случайность', body: 'Мы встретились в одной сакуровой аллее в Киото в марте 2022. У Юлии был поломанный зонт, у Романа — лишний. Поделились. Не расстались.' },
      { heading: 'Возвращение', body: 'Четыре года спустя — Владивосток, где сопки падают в море. Тихо. Сто человек. Вишня. Сакэ.' },
    ],
    program: [
      { time: '15:00', title: '茶 · Чайная церемония', place: 'Павильон у воды' },
      { time: '16:00', title: '式 · Церемония', place: 'Обрыв над бухтой' },
      { time: '18:00', title: '宴 · Пир', place: 'Длинный стол с видом на Японское море' },
      { time: '21:00', title: '月 · Луна', place: 'Прогулка по берегу' },
    ],
    details: { dressCode: 'Linen, нейтральные тона', gift: 'Origami приветствуется', kids: 'Да', transfer: 'Трансфер из Владивостока в 13:00' },
  },
  {
    slug: 'polaroid',
    name: 'Super-8',
    style: 'Polaroid / Film',
    styleRu: 'Polaroid / timeline',
    structure: 'Вертикальный timeline дня с карточками-поляроидами',
    tagline: 'Рассыпанные поляроиды, скотч, ручной скрипт, тёплые плёночные тона',
    couple: 'Даша & Кирилл',
    coupleShort: 'D & K',
    date: '18.07.2026',
    dateIso: '2026-07-18T17:00:00',
    dateLong: '18 июля 2026',
    dateMono: '18.07.2026',
    venue: 'Дикий пляж · Сочи',
    city: 'Сочи',
    rsvpDeadline: '01 июля 2026',
    palette: { bg: '#f0ebe0', bg2: '#e5dcc8', ink: '#2a2418', ink2: '#6b5d4a', accent: '#e8d4a8', paper: '#ffffff' },
    accent: '#e8d4a8', ink: '#2a2418', previewBg: '#f0ebe0',
    quote: { text: 'Поставили камеру на таймер в 2019 — до сих пор не успели снять её со штатива.', author: 'Д & К' },
    story: [
      { heading: 'Одно лето', body: 'Мы познакомились в июле 2019 на даче у общего друга. Четыре дня подряд играли в бадминтон и спорили о том, кто лучше фотографирует закат.' },
      { heading: 'Семь лет и триста плёнок', body: 'С тех пор — 47 поездок, 312 отснятых плёнок, 2 кота и одно обещание. Сегодня — последний кадр этой главы.' },
    ],
    program: [
      { time: '10:00', title: 'Morning coffee', place: 'Веранда нашего дома', note: 'для самых близких' },
      { time: '15:00', title: 'Welcome drinks', place: 'У моря' },
      { time: '17:00', title: 'Церемония', place: 'На кромке воды', note: 'босиком, если хотите' },
      { time: '19:00', title: 'Ужин у костра', place: 'Длинный стол на песке' },
      { time: '22:00', title: 'Танцы до волн', place: 'Плёночный проектор, сет до 03:00' },
    ],
    details: { dressCode: 'Summer casual · лён, хлопок, без туфель', gift: 'Плёнка 35мм — идеально', kids: 'Обязательно', transfer: 'Встречаем в аэропорту Сочи' },
  },
  {
    slug: 'artdeco',
    name: 'Palais',
    style: 'Art Deco',
    styleRu: 'Art Deco / tabs',
    structure: 'Мини-сайт с табами и якорной навигацией',
    tagline: 'Geometric, Gatsby, metallic, Cinzel — строгая симметрия и золото',
    couple: 'Вера & Николай',
    coupleShort: 'V · N',
    date: '12.12.2026',
    dateIso: '2026-12-12T19:00:00',
    dateLong: 'Двенадцатое декабря 2026',
    dateMono: 'XII · XII · MMXXVI',
    venue: 'Красная Поляна',
    city: 'Сочи',
    rsvpDeadline: '12 ноября 2026',
    palette: { bg: '#0f0f18', bg2: '#18182a', ink: '#f5f1ea', ink2: '#9e9080', accent: '#b8975a', paper: '#1a1a2c' },
    accent: '#b8975a', ink: '#0f0f18', previewBg: '#0f0f18',
    quote: { text: 'Зима, золото, горы. Остальное — обстоятельства.', author: 'V · N' },
    story: [
      { heading: 'Опера, 2019', body: 'Вера пела в хоре, Николай сидел в третьем ряду с ошибочным билетом. После спектакля извинился. Через год пригласил на "Риголетто" — но уже с правильным билетом.' },
      { heading: 'Горы и голос', body: 'Сегодня мы соединяем две наши страсти — высоту и сцену. Камерный хор выступит для вас прямо на балконе отеля, с видом на Аибгу.' },
    ],
    program: [
      { time: '19:00', title: 'Welcome', place: 'Palace Lobby · шампанское' },
      { time: '20:00', title: 'Церемония', place: 'Ballroom · с живым оркестром' },
      { time: '21:00', title: 'Gala Dinner', place: 'Grand Hall' },
      { time: '23:00', title: 'Opera Suite', place: 'After-вечеринка до 04:00' },
    ],
    details: { dressCode: 'White tie · gold accents welcome', gift: 'Wish list на сайте отеля', kids: 'Adults only', transfer: 'Трансфер от аэропорта Сочи включён' },
  },
  {
    slug: 'bauhaus',
    name: 'Struk',
    style: 'Bauhaus / Constructivist',
    styleRu: 'Bauhaus / конструктивизм',
    structure: 'Вертикальный скролл с чередующимися цветными блоками и геометрией',
    tagline: 'Первичные цвета, жёсткая сетка, гротеск, без украшений',
    couple: 'Женя & Артём',
    coupleShort: 'Ж · А',
    date: '22.08.2026',
    dateIso: '2026-08-22T15:00:00',
    dateLong: '22 августа 2026',
    dateMono: '22.08.2026',
    venue: 'Музей Гаража современного искусства',
    city: 'Москва',
    rsvpDeadline: '01 августа 2026',
    palette: { bg: '#f2f0e8', bg2: '#e8e4d8', ink: '#0a0a0a', ink2: '#444444', accent: '#d63b2f', paper: '#ffffff', red: '#d63b2f', blue: '#1d4f8c', yellow: '#f5c400' },
    accent: '#d63b2f', ink: '#0a0a0a', previewBg: '#f2f0e8',
    quote: { text: 'Форма следует функции. Мы следуем чувству.', author: 'Ж · А' },
    story: [
      { heading: 'Типографика', body: 'Женя преподаёт шрифтовой дизайн в Вышке, Артём — архитектор с берлинским дипломом. Познакомились на воркшопе по сетке в 2022 году, когда не сошлись во мнениях о ширине модуля.' },
      { heading: 'Конструкция', body: 'Три года компромиссов и споров о пропорциях привели к единственному логичному решению — построить что-то вместе. Навсегда.' },
    ],
    program: [
      { time: '15:00', title: 'Регистрация', place: 'Атриум · Гараж' },
      { time: '17:00', title: 'Церемония', place: 'Зал А · красный блок' },
      { time: '19:00', title: 'Ужин', place: 'Парковая терраса' },
      { time: '22:00', title: 'Вечеринка', place: 'Basement · до последнего' },
    ],
    details: { dressCode: 'Primary colors only · no grey', gift: 'Книги об архитектуре или деньги на Bauhaus-trip', kids: 'Дети с 15:00 до 20:00', transfer: 'Метро «Парк культуры» · 5 мин пешком' },
  },
  {
    slug: 'celestial',
    name: 'Solstice',
    style: 'Celestial / Stargazer',
    styleRu: 'Celestial / звёзды',
    structure: 'Тёмные snap-scroll секции с SVG-созвездиями и луной',
    tagline: 'Индиго, золото, звёздное небо, фазы луны, italic serif',
    couple: 'Ника & Даниил',
    coupleShort: 'Н · Д',
    date: '21.06.2026',
    dateIso: '2026-06-21T22:00:00',
    dateLong: '21 июня 2026',
    dateMono: '21.06.2026',
    venue: 'Крымская астрофизическая обсерватория',
    city: 'Крым',
    rsvpDeadline: '01 июня 2026',
    palette: { bg: '#060714', bg2: '#0f1035', ink: '#e8e4f5', ink2: '#9990c5', accent: '#c9a84c', paper: '#0f1035' },
    accent: '#c9a84c', ink: '#060714', previewBg: '#060714',
    quote: { text: 'Мы встретились под небом, которое не знает расстояний.', author: 'Н · Д' },
    story: [
      { heading: 'Первое созвездие', body: 'Ника и Даниил познакомились в 2021 на ночной экскурсии по Алтаю. Он показывал ей Персеиды. Она уже нашла их сама, но промолчала.' },
      { heading: 'Летнее солнцестояние', body: 'Мы выбрали 21 июня не случайно — самую длинную ночь в году. Под этим же небом, где однажды начали смотреть в одну сторону.' },
    ],
    program: [
      { time: '20:00', title: 'Встреча гостей', place: 'Главный купол' },
      { time: '22:00', title: 'Церемония', place: 'Под открытым небом' },
      { time: '23:30', title: 'Ужин', place: 'Панорамная терраса' },
      { time: '01:00', title: 'Наблюдение звёзд', place: 'Телескоп открыт для гостей' },
    ],
    details: { dressCode: 'Dark tones · midnight blue, gold, black', gift: 'Звезда в каталоге или ваше тепло', kids: 'Дети старше 10 лет', transfer: 'Автобус от Симферополя в 18:30' },
  },
  {
    slug: 'mediterranean',
    name: 'Riva',
    style: 'Mediterranean / Coastal',
    styleRu: 'Средиземноморье',
    structure: 'Светлые открытки-карточки, терракота, лазурь, летний бриз',
    tagline: 'Белёные стены, терракота, олива, морской воздух — летнее счастье',
    couple: 'Катя & Антон',
    coupleShort: 'К · А',
    date: '05.09.2026',
    dateIso: '2026-09-05T18:00:00',
    dateLong: '5 сентября 2026',
    dateMono: '05.09.2026',
    venue: 'Вилла Монтенегро · Будва',
    city: 'Черногория',
    rsvpDeadline: '15 августа 2026',
    palette: { bg: '#fefcf7', bg2: '#f5ede0', ink: '#1a1a14', ink2: '#5a4e3a', accent: '#c9622a', sea: '#3a7cba', sage: '#687d5f', paper: '#fff9f0' },
    accent: '#c9622a', ink: '#1a1a14', previewBg: '#fefcf7',
    quote: { text: 'Море не спрашивает, зачем. Оно просто приходит.', author: 'К · А' },
    story: [
      { heading: 'Хорватия, 2022', body: 'Катя и Антон встретились на паруснике у Сплита в августе 2022. Он был шкипером, она — случайным пассажиром с неправильным билетом. Четыре дня перехода хватило на всё остальное.' },
      { heading: 'Три года у воды', body: 'С тех пор — каждое лето вдоль побережья. Дубровник, Котор, Будва. В этот раз — последняя остановка и первый якорь.' },
    ],
    program: [
      { time: '17:00', title: 'Aperitivo', place: 'Терраса у бассейна' },
      { time: '18:30', title: 'Церемония', place: 'Сад с видом на море' },
      { time: '20:00', title: 'Ужин', place: 'Длинный стол под оливами' },
      { time: '23:00', title: 'Танцы', place: 'До рассвета · у воды' },
    ],
    details: { dressCode: 'Mediterranean summer · белый, терракота, лён', gift: 'Ваше присутствие дороже всего', kids: 'Только взрослые', transfer: 'Трансфер от аэропорта Тиват включён' },
  },
];

Object.assign(browserGlobal, { TEMPLATES });


// ===== src/home.jsx =====
// Home page

function Home() {
  return (
    <div>
      <TopNav />
      <main id="main">
        <Hero />
        <Value />
        <Portfolio />
        <Process />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-section" style={{
      padding: 'clamp(52px, 8vw, 88px) var(--pad-x) clamp(68px, 9vw, 104px)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="hero-inner" style={{ maxWidth: 'var(--max-w)', margin: '0 auto', position: 'relative' }}>
        <Eyebrow number="(01)">Свадебные сайты · 2026</Eyebrow>

        <h1 className="serif page-title" style={{
          fontSize: 'clamp(48px, 7.2vw, 108px)',
          lineHeight: 0.92, letterSpacing: '-0.035em',
          margin: '36px 0 0', fontWeight: 400,
          textWrap: 'balance',
        }}>
          Сайт-приглашение, <br/>
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>который гости</span><br/>
          {' '}дочитают до конца.
        </h1>

        <div className="grid-2-mobile-1" style={{
          marginTop: 'clamp(40px, 6vw, 60px)',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr',
          gap: 'clamp(32px, 6vw, 80px)', alignItems: 'end',
        }}>
          <p style={{
            fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.55,
            color: 'var(--ink-2)', maxWidth: 560, margin: 0, textWrap: 'pretty',
          }}>
            9 готовых дизайнов и кастомные проекты под ключ.
            RSVP, программа, карта, история пары — всё, что нужно,
            собрано в одном сайте. Типографика, отступы, темп —
            как у студии, а не как у конструктора.
          </p>
          <div className="hero-cta-row" style={{
            display: 'flex', gap: 14, flexWrap: 'wrap',
            justifyContent: 'flex-end', alignItems: 'center',
          }}>
            <Button to="/templates" size="lg">Смотреть 9 дизайнов →</Button>
            <Button to="/contact" variant="secondary" size="lg">Связаться</Button>
          </div>
        </div>

        {/* meta row */}
        <div className="hero-meta-grid" style={{
          marginTop: 'clamp(44px, 7vw, 76px)', paddingTop: 24,
          borderTop: '1px solid var(--line)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)',
        }}>
          <HeroMeta k="Срок" v="от 5 дней" />
          <HeroMeta k="От" v="4 000 ₽" />
          <HeroMeta k="Хостинг" v="Render · бесплатно" />
          <HeroMeta k="Языки" v="RU · EN · +1" />
        </div>
      </div>

      {/* decorative label in corner */}
      <div className="hero-deco-vertical" aria-hidden="true" style={{
        position: 'absolute', top: 80, right: 40,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: '0.25em', color: 'var(--muted)',
        writingMode: 'vertical-rl', textOrientation: 'mixed',
      }}>
        · denisixone · Est. 2024 ·
      </div>
    </section>
  );
}

function HeroMeta({ k, v }) {
  return (
    <div>
      <div style={{ opacity: 0.55 }}>{k}</div>
      <div style={{ color: 'var(--ink)', marginTop: 6, fontSize: 13 }}>{v}</div>
    </div>
  );
}

function Value() {
  return (
    <section style={{
      padding: 'var(--section-y-sm) var(--pad-x)',
      background: 'var(--bg-2)',
    }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div className="grid-2-mobile-1" style={{
          display: 'grid', gridTemplateColumns: '1fr 2fr',
          gap: 'clamp(32px, 6vw, 60px)', alignItems: 'start',
        }}>
          <div>
            <Eyebrow number="(02)">Что вы получаете</Eyebrow>
            <h2 className="serif" style={{
              fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1,
              letterSpacing: '-0.02em', margin: '24px 0 0', fontWeight: 400,
            }}>
              Два пути.<br/><span style={{ fontStyle: 'italic' }}>Один результат.</span>
            </h2>
          </div>
          <div className="grid-2-mobile-1" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(20px, 3vw, 40px)',
          }}>
            <ValueCard
              n="I"
              title="Готовый дизайн"
              price="4 000 ₽"
              bullets={[
                '9 уникальных шаблонов',
                'Ваши фото, имена, даты',
                'RSVP + Google Sheets',
                'Бесплатный хостинг на Render',
                'Деплой за 5 дней',
              ]}
            />
            <ValueCard
              n="II"
              title="Кастомный проект"
              price="9 000 ₽"
              bullets={[
                'Дизайн с нуля под пару',
                'Арт-директор + копирайтер',
                'Анимации, сценарий прокрутки',
                'Интеграции под запрос',
                'Срок 2–4 недели',
              ]}
              highlight
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueCard({ n, title, price, bullets, highlight }) {
  return (
    <div className="value-card" style={{
      background: highlight ? 'var(--ink)' : 'var(--bg)',
      color: highlight ? 'var(--bg)' : 'var(--ink)',
      padding: 36, borderRadius: 4,
      border: '1px solid ' + (highlight ? 'var(--ink)' : 'var(--line)'),
      display: 'flex', flexDirection: 'column', gap: 24, minHeight: 340,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="serif" style={{ fontSize: 48, fontStyle: 'italic', fontWeight: 300, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>{price}</div>
      </div>
      <h3 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {bullets.map((b) => (
          <li key={b} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.5 }}>
            <span style={{ opacity: 0.5, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, marginTop: 4 }}>◦</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Button to={highlight ? '/order/design-package' : '/order/wedding-template'} variant={highlight ? 'secondary' : 'primary'} tone={highlight ? 'light' : 'default'}>
        {highlight ? 'Купить дизайн-пакет' : 'Купить шаблон'} →
      </Button>
    </div>
  );
}

function Portfolio() {
  return (
    <section style={{ padding: 'var(--section-y) var(--pad-x)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'end', marginBottom: 'clamp(40px, 6vw, 60px)',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <Eyebrow number="(03)">Портфолио · 9 дизайнов</Eyebrow>
            <h2 className="serif" style={{
              fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.98,
              letterSpacing: '-0.025em', margin: '20px 0 0', fontWeight: 400,
            }}>
              Девять разных<br/><span style={{ fontStyle: 'italic' }}>миров</span>.
            </h2>
          </div>
          <NavLink to="/templates">Все с фильтрами →</NavLink>
        </div>

        <div className="grid-3" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(18px, 2vw, 24px)',
        }}>
          {TEMPLATES.map((t, i) => (
            <TemplateCard key={t.slug} t={t} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TemplateCard({ t, idx }) {
  return (
    <Link
      to={`/templates/${t.slug}`}
      aria-label={`Открыть шаблон ${t.name} — ${t.styleRu}`}
      style={{ display: 'block', cursor: 'pointer' }}
    >
      <div className="tpl-card" style={{
        position: 'relative', aspectRatio: '4/5', overflow: 'hidden',
        background: t.previewBg,
      }}>
        <TemplatePreview template={t} />
        <div style={{
          position: 'absolute', top: 16, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: t.slug === 'dark' || t.slug === 'artdeco'
            ? 'rgba(255,255,255,0.8)' : 'rgba(42,36,24,0.6)',
        }}>
          <span>№ 0{idx + 1}</span>
          <span>{t.styleRu}</span>
        </div>
      </div>
      <div style={{
        padding: '18px 2px 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div className="template-card-copy">
          <div className="serif" style={{
            fontSize: 24, fontStyle: 'italic', letterSpacing: '-0.01em',
          }}>{t.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{t.tagline}</div>
        </div>
        <div aria-hidden="true" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          opacity: 0.4, transition: 'opacity 0.2s, transform 0.2s',
        }}>→</div>
      </div>
    </Link>
  );
}

// Mini preview card — each thumb hints at the structure (layout/nav) of the template.
function TemplatePreview({ template: t }) {
  const P = t.palette || {};
  const fg = P.ink || t.ink || '#111';
  const bg = P.bg || t.previewBg || '#fff';
  const accent = P.accent || t.accent || '#888';
  const [a, b] = (t.couple || '').split(/\s*[&×]\s*/).map((s) => s.trim());

  const previews = {
    // Aurelia — editorial magazine: masthead bar + column hints + reading-progress sliver
    editorial: (
      <div style={{ padding: '16% 14% 14%', color: fg, height: '100%', background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, height: 2, width: '38%', background: accent }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.3em', opacity: 0.65, display: 'flex', justifyContent: 'space-between' }}>
          <span>AURELIA · N°01</span><span>p. 1 — 5</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(26px, 4.4vw, 46px)', lineHeight: 1, letterSpacing: '-0.03em' }}>{a}<br/>& {b}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ height: 1, background: fg, opacity: 0.25 }} />
            ))}
          </div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.25em' }}>{t.dateMono}</div>
      </div>
    ),
    // Grid-14 — split-screen: sticky-left pane + scrolling-right pane
    swiss: (
      <div style={{ height: '100%', color: fg, background: bg, display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ padding: 14, borderRight: `1px solid ${fg}22`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.04em' }}>{a.toLowerCase()}<br/>{b.toLowerCase()}</div>
          <div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 7, opacity: i === 1 ? 1 : 0.45, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: i === 1 ? fg : 'transparent', border: `1px solid ${fg}` }} />
                0{i + 1}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
          {[0.85, 0.55, 0.9, 0.4, 0.7].map((w, i) => (
            <div key={i} style={{ height: 4, width: `${w * 100}%`, background: fg, opacity: 0.45 - i * 0.06 }} />
          ))}
        </div>
      </div>
    ),
    // Verbena — centered card with corner ornaments on watercolor field
    garden: (
      <div style={{ padding: 18, color: fg, height: '100%', position: 'relative', background: `radial-gradient(ellipse at center, ${bg} 0%, ${P.bg2 || bg} 100%)`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 10, left: 10, width: 38, opacity: 0.55 }}>
          <path d="M10 70 Q30 20, 70 10" stroke={accent} fill="none" strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="70" cy="10" r="3" fill={accent} opacity="0.6" />
        </svg>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', bottom: 10, right: 10, width: 38, opacity: 0.55, transform: 'rotate(180deg)' }}>
          <path d="M10 70 Q30 20, 70 10" stroke={accent} fill="none" strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="70" cy="10" r="3" fill={accent} opacity="0.6" />
        </svg>
        <div style={{ border: `0.5px solid ${fg}44`, padding: '18px 22px', textAlign: 'center', background: `${bg}cc`, maxWidth: '76%' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.3em', opacity: 0.6 }}>VERBENA</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px, 3.4vw, 32px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.05, margin: '6px 0' }}>{a}<br/><span style={{ color: accent }}>&</span><br/>{b}</div>
        </div>
      </div>
    ),
    // Noctis — dark pin-scroll: dot nav + slide indicator
    dark: (
      <div style={{ padding: 14, color: accent, background: bg, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.35em', opacity: 0.7 }}>— {t.dateMono} —</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(22px, 4.2vw, 40px)', margin: '10px 0', lineHeight: 1 }}>{a}<br/>&<br/>{b}</div>
        <div style={{ width: 24, height: 0.5, background: accent, opacity: 0.55 }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.3em', marginTop: 10, opacity: 0.6 }}>NOCTIS · {t.city.toUpperCase()}</div>
        {/* dot nav right */}
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === 2 ? accent : 'transparent', border: `1px solid ${accent}`, opacity: i === 2 ? 1 : 0.45 }} />
          ))}
        </div>
      </div>
    ),
    // Konkret — horizontal snap: arrows ← 01/06 →
    brutalist: (
      <div style={{ padding: 14, color: fg, background: bg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: "'Archivo Black', sans-serif", position: 'relative' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.2em', display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
          <span>DOCUMENT v.1.0</span><span style={{ background: accent, color: '#fff', padding: '1px 5px' }}>{t.city.slice(0, 3).toUpperCase()}</span>
        </div>
        <div style={{ fontSize: 'clamp(32px, 6.4vw, 74px)', lineHeight: 0.82, letterSpacing: '-0.05em' }}>
          {a.toUpperCase()}<br/><span style={{ color: accent }}>×</span><br/>{b.toUpperCase()}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.15em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ opacity: 0.5 }}>← 01 / 06 →</span><span>{t.dateMono}</span>
        </div>
      </div>
    ),
    // Maisonneuve — book-fold: two pages with spine shadow + page indicator
    letterpress: (
      <div style={{ padding: 14, color: fg, height: '100%', background: `radial-gradient(ellipse at center, ${bg} 0%, ${P.bg2 || bg} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ background: P.paper || '#fff', width: '82%', height: '68%', display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', boxShadow: `0 8px 18px ${fg}22, inset 0 0 0 1px ${fg}22` }}>
          <div style={{ padding: 10, textAlign: 'center', fontFamily: "'EB Garamond', serif" }}>
            <div style={{ fontSize: 7, letterSpacing: '0.3em', opacity: 0.6 }}>Приглашение</div>
            <div style={{ fontSize: 16, fontStyle: 'italic', marginTop: 6, lineHeight: 1 }}>{a}<br/>&<br/>{b}</div>
          </div>
          <div style={{ padding: 10, textAlign: 'center', fontFamily: "'EB Garamond', serif", borderLeft: `0.5px solid ${fg}33` }}>
            <div style={{ fontSize: 7, letterSpacing: '0.3em', opacity: 0.6 }}>когда</div>
            <div style={{ fontSize: 11, fontStyle: 'italic', marginTop: 10, lineHeight: 1.3 }}>{t.dateMono}</div>
            <div style={{ fontSize: 9, marginTop: 8, opacity: 0.7 }}>{t.city}</div>
          </div>
          {/* spine shadow */}
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 8, transform: 'translateX(-50%)', background: `linear-gradient(90deg, transparent, ${fg}30, transparent)` }} />
        </div>
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 3, alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (<span key={i} style={{ width: i === 0 ? 12 : 4, height: 4, borderRadius: 2, background: i === 0 ? fg : `${fg}44` }} />))}
        </div>
      </div>
    ),
    // Kumo — parallax: big kanji + asymmetric text
    wabisabi: (
      <div style={{ padding: 16, color: fg, background: bg, height: '100%', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '2%', left: '-8%', fontFamily: "'Noto Serif JP', serif", fontSize: 110, fontWeight: 300, opacity: 0.09, lineHeight: 1 }}>雲</div>
        <div style={{ position: 'absolute', top: '18%', left: '18%', fontFamily: "'Noto Serif JP', serif", fontSize: 22, fontWeight: 300, color: accent }}>{t.coupleShort}</div>
        <div style={{ position: 'absolute', top: '44%', left: '26%', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 2.8vw, 24px)', fontWeight: 300, letterSpacing: '0.08em', fontStyle: 'italic' }}>{a}<br/><span style={{ color: accent }}>—</span><br/>{b}</div>
        <div style={{ position: 'absolute', bottom: '14%', right: '12%', fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.25em', textAlign: 'right' }}>{t.dateMono}<br/>{t.city}</div>
        <div style={{ position: 'absolute', bottom: '28%', left: '18%', width: 30, height: 0.8, background: accent }} />
      </div>
    ),
    // Super-8 — vertical timeline: spine + dots with program markers
    polaroid: (
      <div style={{ padding: 16, color: fg, height: '100%', background: bg, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.3em', opacity: 0.6, display: 'flex', justifyContent: 'space-between' }}>
          <span>SUPER-8 · REEL 01</span><span>● REC</span>
        </div>
        {/* timeline spine with dots + polaroid */}
        <div style={{ position: 'relative', flex: 1, margin: '12px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 24, position: 'relative', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, transform: 'translateX(-50%)', background: `repeating-linear-gradient(to bottom, ${fg} 0 2px, transparent 2px 4px)` }} />
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: bg, border: `1px solid ${fg}`, position: 'relative', zIndex: 1 }} />
            ))}
          </div>
          <div style={{ flex: 1, transform: 'rotate(-3deg)', background: P.paper || '#fff', padding: 4, paddingBottom: 10, boxShadow: `0 4px 10px ${fg}22`, border: `1px solid ${fg}15` }}>
            <PreviewThumbImage src="/assets/images/polaroid-montenegro-coast.webp" alt="" />
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 10, textAlign: 'center', marginTop: 2 }}>{t.dateMono}</div>
          </div>
        </div>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(22px, 3.6vw, 30px)', textAlign: 'center', lineHeight: 1 }}>{a} + {b}</div>
      </div>
    ),
    // Palais — mini-site with tabs: side nav + content panel
    artdeco: (
      <div style={{ color: accent, background: bg, height: '100%', display: 'grid', gridTemplateColumns: '38% 62%', fontFamily: "'Cinzel', serif", position: 'relative' }}>
        <div style={{ padding: '14px 8px', borderRight: `1px solid ${accent}33`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <svg viewBox="0 0 60 60" style={{ width: 28, height: 28 }} aria-hidden="true">
            <path d="M30 4 L56 30 L30 56 L4 30 Z" fill="none" stroke={accent} strokeWidth="1.2" />
            <text x="30" y="36" textAnchor="middle" fontSize="12" fill={accent} fontFamily="Cinzel, serif">{t.coupleShort}</text>
          </svg>
          {[['I', 'HOME'], ['II', 'ИСТ'], ['III', 'ПРО'], ['IV', 'ДЕТ']].map(([r, l], i) => (
            <div key={r} style={{ width: '100%', padding: '3px 6px', fontSize: 7, letterSpacing: '0.25em', background: i === 0 ? accent : 'transparent', color: i === 0 ? bg : accent, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.65 }}>{r}</span><span>{l}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 8, border: `0.5px solid ${accent}66`, pointerEvents: 'none' }} />
          <div style={{ fontSize: 8, letterSpacing: '0.4em', opacity: 0.75 }}>— OF —</div>
          <div style={{ fontSize: 'clamp(14px, 2.6vw, 22px)', letterSpacing: '0.18em', margin: '6px 0', lineHeight: 1.1 }}>{a.toUpperCase()}<br/><span style={{ opacity: 0.6, fontSize: '0.7em' }}>&</span><br/>{b.toUpperCase()}</div>
          <div style={{ fontSize: 7, letterSpacing: '0.35em', marginTop: 6 }}>{t.dateMono}</div>
        </div>
      </div>
    ),
    // Struk — Bauhaus: colored grid blocks + bold geometry
    bauhaus: (() => {
      const red = P.red || '#d63b2f';
      const blue = P.blue || '#1d4f8c';
      const yellow = P.yellow || '#f5c400';
      return (
        <div style={{ height: '100%', display: 'grid', gridTemplateRows: '55% 45%', fontFamily: "'Inter', sans-serif" }}>
          <div style={{ background: red, display: 'grid', gridTemplateColumns: '1fr 1fr', color: '#fff' }}>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 900, fontSize: 7, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.8 }}>STRUK</div>
              <div style={{ fontWeight: 900, fontSize: 'clamp(20px, 4.5vw, 36px)', lineHeight: 0.85, letterSpacing: '-0.04em' }}>{a}<br/>&amp;<br/>{b}</div>
            </div>
            <div style={{ background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: yellow }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '40% 60%' }}>
            <div style={{ background: blue, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ fontWeight: 900, fontSize: 7, color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t.dateMono}</div>
            </div>
            <div style={{ background: yellow, padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 7, color: '#0a0a0a', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7 }}>{t.venue.split('·')[0].trim()}</div>
            </div>
          </div>
        </div>
      );
    })(),
    // Solstice — Celestial: dark indigo + gold stars SVG
    celestial: (
      <div style={{ height: '100%', background: bg, color: P.accent || '#c9a84c', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 16 }}>
        {/* star dots */}
        {[[12, 18], [72, 8], [48, 32], [28, 56], [82, 44], [60, 68], [18, 72], [90, 20], [40, 14]].map(([x, y], i) => (
          <div key={i} aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: i % 3 === 0 ? 2 : 1.5, height: i % 3 === 0 ? 2 : 1.5, borderRadius: '50%', background: P.accent || '#c9a84c', opacity: i % 2 === 0 ? 0.9 : 0.5 }} />
        ))}
        {/* moon crescent */}
        <svg viewBox="0 0 40 40" style={{ width: 28, height: 28, marginBottom: 10 }} aria-hidden="true">
          <path d="M20 4 A16 16 0 1 0 20 36 A10 10 0 1 1 20 4Z" fill={P.accent || '#c9a84c'} />
        </svg>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 3vw, 22px)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.1 }}>{a}<br/><span style={{ fontSize: '0.6em', opacity: 0.6 }}>&amp;</span><br/>{b}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.3em', opacity: 0.6, marginTop: 10 }}>{t.dateMono}</div>
      </div>
    ),
    // Riva — Mediterranean: warm card with terracotta stripe + arch
    mediterranean: (
      <div style={{ height: '100%', background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: P.accent || '#c9622a', height: 6 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative' }}>
          {/* arch shape */}
          <svg viewBox="0 0 80 90" style={{ position: 'absolute', top: 8, right: 12, width: 40, height: 45, opacity: 0.12 }} aria-hidden="true">
            <path d="M5 90 L5 40 Q5 5 40 5 Q75 5 75 40 L75 90Z" fill={P.accent || '#c9622a'} />
          </svg>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.25em', color: P.accent || '#c9622a', textTransform: 'uppercase', marginBottom: 8 }}>Riva</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(18px, 3.5vw, 26px)', textAlign: 'center', color: fg, lineHeight: 1.15 }}>{a}<br/><span style={{ fontSize: '0.55em', opacity: 0.5 }}>&</span><br/>{b}</div>
          <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.18em', color: fg, opacity: 0.5 }}>{t.dateMono}</div>
          <div style={{ marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 6, letterSpacing: '0.12em', color: P.accent || '#c9622a', opacity: 0.8 }}>{t.city.toUpperCase()}</div>
        </div>
        <div style={{ background: P.sea || '#3a7cba', height: 8, opacity: 0.7 }} />
      </div>
    ),
  };

  return previews[t.slug] || null;
}

function Process() {
  const steps = [
    { n: '01', title: 'Заявка', body: 'Отправляете форму или пишете в Telegram. Обычно отвечаем за 2–3 часа.' },
    { n: '02', title: 'Выбор дизайна', body: 'Вы выбираете готовый шаблон или мы обсуждаем кастомную концепцию.' },
    { n: '03', title: 'Контент', body: 'Присылаете фото, имена, даты, историю. Шаблон — Google-форма, кастом — Notion-бриф.' },
    { n: '04', title: 'Сборка', body: 'Вы получаете ссылку на preview. Правите текст и фото прямо в интерфейсе.' },
    { n: '05', title: 'Деплой', body: 'Публикуем бесплатно на Render — получаете ссылку вида yournames.onrender.com. RSVP начинают сыпаться.' },
  ];
  return (
    <section id="process" style={{
      padding: 'var(--section-y) var(--pad-x)', background: 'var(--bg-2)',
    }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <Eyebrow number="(04)">Процесс</Eyebrow>
        <h2 className="serif" style={{
          fontSize: 'clamp(38px, 5vw, 72px)', lineHeight: 0.98,
          letterSpacing: '-0.025em',
          margin: '20px 0 clamp(48px, 8vw, 80px)', fontWeight: 400,
        }}>
          Пять шагов <span style={{ fontStyle: 'italic' }}>до рассылки</span>.
        </h2>
        <ol className="process-grid" style={{
          listStyle: 'none', padding: 0, margin: 0,
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28,
        }}>
          {steps.map((s) => (
            <ProcessStep key={s.n} number={s.n} title={s.title} body={s.body} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: 'Шаблон', price: '4 000 ₽', desc: 'Любой из 9 готовых дизайнов', bullets: ['Ваши фото и тексты', 'RSVP-форма', 'Хостинг Render (бесплатно)', 'Один язык', 'Доставка 5 дней'], popular: true },
    { name: 'Кастом', price: '9 000 ₽', desc: 'Дизайн с нуля под пару', bullets: ['Арт-директор + копирайтер', 'Уникальный layout и типографика', 'Анимации и сценарий прокрутки', 'Хостинг Render + 2 языка', 'Срок 2–4 недели'] },
  ];
  return (
    <section id="pricing" style={{ padding: 'var(--section-y) var(--pad-x)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'end', flexWrap: 'wrap', gap: 40,
          marginBottom: 'clamp(40px, 6vw, 60px)',
        }}>
          <div>
            <Eyebrow number="(05)">Цены</Eyebrow>
            <h2 className="serif" style={{
              fontSize: 'clamp(38px, 5vw, 72px)', lineHeight: 0.98,
              letterSpacing: '-0.025em', margin: '20px 0 0', fontWeight: 400,
            }}>
              Прозрачно.<br/><span style={{ fontStyle: 'italic' }}>Без пакетов-сюрпризов</span>.
            </h2>
          </div>
          <p style={{
            maxWidth: 380, color: 'var(--muted)', fontSize: 14,
            lineHeight: 1.6, margin: 0,
          }}>
            Цены указаны за сайт. Хостинг на Render — бесплатно, SSL включён.
            Правки после публикации — 500 ₽ за правку.
          </p>
        </div>
        <div className="pricing-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24, maxWidth: 900, margin: '0 auto',
        }}>
          {tiers.map((t) => (
            <PriceCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PriceCard({ t }) {
  const pop = t.popular;
  return (
    <div className="price-card" style={{
      padding: 32, borderRadius: 4,
      background: pop ? 'var(--ink)' : 'transparent',
      color: pop ? 'var(--bg)' : 'var(--ink)',
      border: '1px solid ' + (pop ? 'var(--ink)' : 'var(--line)'),
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>{t.name}</h3>
        {pop && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'var(--bg)', color: 'var(--ink)', padding: '4px 10px', borderRadius: 999 }}>Популярно</span>}
      </div>
      <div className="serif" style={{ fontSize: 48, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1 }}>{t.price}</div>
      <div style={{ fontSize: 14, opacity: 0.7 }}>{t.desc}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {t.bullets.map((b) => (
          <li key={b} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ opacity: 0.5, marginTop: 2 }}>—</span><span>{b}</span>
          </li>
        ))}
      </ul>
      <Button
        to={t.name === 'Кастом' ? '/order/design-package' : '/order/wedding-template'}
        variant={pop ? 'secondary' : 'primary'}
        tone={pop ? 'light' : 'default'}
      >
        {t.name === 'Кастом' ? 'Купить дизайн-пакет' : 'Купить шаблон'} →
      </Button>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: 'Сколько времени занимает весь процесс?', a: 'Готовый шаблон — 5 рабочих дней от получения контента. Кастомный проект — от 2 до 4 недель в зависимости от объёма.' },
    { q: 'Можно ли поменять шрифты и цвета в шаблоне?', a: 'В тарифе Шаблон меняем только контент-поля. В тарифе Кастом правим всё вплоть до сетки, шрифтов и цветов.' },
    { q: 'Как работает RSVP и куда приходят ответы?', a: 'По умолчанию — в Google Sheets, куда у вас есть полный доступ. По запросу можем подключить Notion, Airtable или вебхук.' },
    { q: 'Где размещается сайт?', a: 'Все сайты публикуются на Render — это бесплатный хостинг с автоматическим SSL. Вы получаете адрес вида yournames.onrender.com — без оплаты домена и хостинга.' },
    { q: 'Что с мультиязычностью?', a: 'RU — в базе. EN и любой дополнительный язык — включены в тариф Кастом.' },
    { q: 'Фотосессия нужна?', a: 'Не обязательна. У нас есть шаблоны, которые красиво работают без фото — только типографика и иллюстрации. Мы также работаем с вашим фотографом до или после свадьбы.' },
  ];
  return (
    <section id="faq" style={{
      padding: 'var(--section-y) var(--pad-x)', background: 'var(--bg-2)',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Eyebrow number="(06)">Вопросы</Eyebrow>
        <h2 className="serif" style={{
          fontSize: 'clamp(38px, 5vw, 72px)', lineHeight: 0.98,
          letterSpacing: '-0.025em',
          margin: '20px 0 clamp(40px, 6vw, 60px)', fontWeight: 400,
        }}>
          Часто <span style={{ fontStyle: 'italic' }}>спрашивают</span>.
        </h2>
        <dl style={{ borderTop: '1px solid var(--ink)', margin: 0 }}>
          {items.map((it, i) => (
            <FaqItem
              key={i}
              index={i}
              question={it.q}
              answer={it.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{
      padding: 'var(--section-y) var(--pad-x)',
      background: 'var(--ink)', color: 'var(--bg)',
    }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', textAlign: 'center' }}>
        <Eyebrow number="(07)" tone="light" align="center">Готовы?</Eyebrow>
        <h2 className="serif" style={{
          fontSize: 'clamp(44px, 9vw, 128px)', lineHeight: 0.96,
          letterSpacing: '-0.04em', margin: '36px 0',
          fontWeight: 400, textWrap: 'balance',
        }}>
          Давайте соберём<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>ваш сайт.</span>
        </h2>
        <div style={{
          display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <Button to="/templates" size="lg" variant="secondary" tone="light">
            Выбрать дизайн
          </Button>
          <Button to="/contact" size="lg" tone="light">
            Оставить заявку →
          </Button>
        </div>
        <p style={{
          marginTop: 40, color: 'rgba(245,241,234,0.55)', fontSize: 13,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          · Ответим за 2–3 часа в рабочее время ·
        </p>
      </div>
    </section>
  );
}

Object.assign(browserGlobal, { Home, TemplatePreview, TemplateCard });


// ===== src/templates-index.jsx =====
// /templates index page — filterable grid

function TemplatesIndex() {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid'); // grid | list

  const styles = ['all', 'Editorial', 'Swiss', 'Ботанический', 'Dark luxe', 'Бруталист', 'Letterpress', 'Wabi-sabi', 'Polaroid', 'Art Deco'];
  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.styleRu === filter);

  return (
    <div>
      <TopNav />
      <main id="main">
        <section style={{ padding: 'clamp(48px, 7vw, 72px) var(--pad-x) 36px' }}>
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            <Eyebrow>Portfolio · 09 works</Eyebrow>
            <h1 className="serif page-title" style={{
              fontSize: 'clamp(48px, 7.2vw, 108px)', lineHeight: 0.96,
              letterSpacing: '-0.035em', margin: '24px 0 0', fontWeight: 400,
            }}>
              Все <span style={{ fontStyle: 'italic' }}>дизайны</span>.
            </h1>
            <p style={{
              marginTop: 28, maxWidth: 560, color: 'var(--ink-2)',
              fontSize: 'clamp(16px, 1.4vw, 18px)', lineHeight: 1.55,
            }}>
              Девять продуманных от начала до конца миров.
              Каждый можно открыть как полноценное демо
              с реальными данными вымышленной пары.
            </p>
          </div>
        </section>

        {/* sticky filter bar */}
        <div style={{
          position: 'sticky', top: 58, zIndex: 10,
          borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
          background: 'rgba(245,241,234,0.85)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        }}>
          <div className="filter-bar" style={{
            maxWidth: 'var(--max-w)', margin: '0 auto',
            padding: '14px var(--pad-x)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 20, flexWrap: 'wrap',
          }}>
            <div role="tablist" aria-label="Фильтр по стилю" style={{
              display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--muted)', marginRight: 8,
              }}>Стиль</span>
              {styles.map((s) => (
                <Chip
                  key={s}
                  role="tab"
                  aria-selected={filter === s}
                  active={filter === s}
                  onClick={() => setFilter(s)}
                >
                  {s === 'all' ? 'Все 09' : s}
                </Chip>
              ))}
            </div>
            <div role="group" aria-label="Вид отображения" style={{ display: 'flex', gap: 4 }}>
              {['grid', 'list'].map((v) => (
                <Chip
                  key={v}
                  aria-pressed={view === v}
                  active={view === v}
                  onClick={() => setView(v)}
                >
                  {v === 'grid' ? '⊞ Сетка' : '≡ Список'}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <section style={{ padding: 'clamp(40px, 6vw, 60px) var(--pad-x) 0' }}>
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            {view === 'grid' ? (
              <div className="grid-3" style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(18px, 2vw, 28px)',
              }}>
                {filtered.map((t) => (
                  <TemplateCard key={t.slug} t={t} idx={TEMPLATES.indexOf(t)} />
                ))}
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--line)' }}>
                {filtered.map((t) => (
                  <TemplateRow key={t.slug} t={t} idx={TEMPLATES.indexOf(t)} />
                ))}
              </div>
            )}
            {filtered.length === 0 && (
              <div style={{
                padding: 60, textAlign: 'center', color: 'var(--muted)',
              }}>
                <p style={{ marginBottom: 16 }}>Ничего не найдено.</p>
                <Button onClick={() => setFilter('all')} variant="secondary">
                  Сбросить фильтр
                </Button>
              </div>
            )}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

// TemplateCardIndex removed — TemplateCard (from home.jsx section) is now used everywhere

function TemplateRow({ t, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={`/templates/${t.slug}`}
      aria-label={`${t.name} — ${t.styleRu}, ${t.couple}, ${t.date}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="templates-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr 1fr 1fr 120px 40px',
        gap: 20, alignItems: 'center',
        padding: '28px 12px',
        borderBottom: '1px solid var(--line)', cursor: 'pointer',
        background: hov ? 'rgba(42,36,24,0.04)' : 'transparent',
        transition: 'background 0.2s var(--ease)',
      }}
    >
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: 'var(--muted)', letterSpacing: '0.14em',
      }}>№ 0{idx + 1}</div>
      <div className="serif" style={{
        fontSize: 28, fontStyle: 'italic', letterSpacing: '-0.01em',
      }}>{t.name}</div>
      <div style={{ fontSize: 14 }}>{t.styleRu}</div>
      <div style={{ fontSize: 14, color: 'var(--muted)' }}>{t.couple}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.12em', color: 'var(--muted)',
      }}>{t.date}</div>
      <div aria-hidden="true" style={{
        textAlign: 'right', fontSize: 18,
        opacity: hov ? 1 : 0.4,
        transform: hov ? 'translateX(4px)' : 'none',
        transition: 'all 0.25s var(--ease)',
      }}>→</div>
    </Link>
  );
}

Object.assign(browserGlobal, { TemplatesIndex });


// ===== src/contact.jsx =====
// /contact page

function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', type: 'Готовый', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Укажите имя';
    if (!form.contact.trim()) {
      e.contact = 'Email или Telegram обязателен';
    } else {
      const c = form.contact.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
      const isTg = /^@?[a-zA-Z0-9_]{3,}$/.test(c);
      if (!isEmail && !isTg) e.contact = 'Похоже, не email и не telegram';
    }
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    setTouched({ name: true, contact: true });
    if (Object.keys(v).length) {
      // focus first error
      const first = Object.keys(v)[0];
      const el = document.getElementById(`field-${first}`);
      el?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          contact: form.contact,
          type: form.type,
          message: form.message,
          source: 'legacy_contact_page',
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrors({ contact: payload.error || 'Не удалось отправить заявку' });
        return;
      }
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    const safeName = form.name.trim() || 'гость';
    const safeContact = form.contact.trim() || 'указанный контакт';
    return (
      <div>
        <TopNav />
        <main id="main">
          <section style={{
            padding: 'clamp(80px, 14vw, 160px) var(--pad-x)',
            minHeight: '70vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center',
          }}>
            <div role="status" aria-live="polite">
              <Eyebrow align="center">Заявка принята</Eyebrow>
              <h1 className="serif" style={{
                fontSize: 'clamp(44px, 8vw, 112px)', lineHeight: 0.96,
                letterSpacing: '-0.035em', margin: '24px 0 0', fontWeight: 400,
              }}>
                <span style={{ fontStyle: 'italic' }}>Спасибо</span>,<br/>{safeName}.
              </h1>
              <p style={{
                maxWidth: 540, margin: '32px auto 0',
                color: 'var(--ink-2)', fontSize: 'clamp(16px, 1.6vw, 18px)', lineHeight: 1.55,
              }}>
                Мы получили заявку и напишем на {safeContact} в ближайшие 2–3 часа.
              </p>
              <div style={{ marginTop: 40 }}>
                <Button to="/templates">← Вернуться к дизайнам</Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <TopNav />
      <main id="main">
        <section style={{ padding: 'clamp(48px, 8vw, 80px) var(--pad-x)' }}>
          <div className="contact-grid" style={{
            maxWidth: 'var(--max-w)', margin: '0 auto',
            display: 'grid', gridTemplateColumns: '1fr 1.2fr',
            gap: 'clamp(40px, 6vw, 80px)',
          }}>
            <div>
              <Eyebrow>Связаться</Eyebrow>
              <h1 className="serif" style={{
                fontSize: 'clamp(42px, 7vw, 104px)', lineHeight: 0.96,
                letterSpacing: '-0.035em', margin: '24px 0 0', fontWeight: 400,
              }}>
                Напишите<br/><span style={{ fontStyle: 'italic' }}>нам</span>.
              </h1>
              <p style={{
                marginTop: 32, color: 'var(--ink-2)',
                fontSize: 'clamp(16px, 1.6vw, 18px)', lineHeight: 1.55, maxWidth: 400,
              }}>
                Чем подробнее расскажете о свадьбе — тем лучше мы подберём формат.
                Или просто напишите «хочу сайт» — разберёмся вместе.
              </p>

              <div style={{
                marginTop: 'clamp(32px, 6vw, 60px)',
                display: 'flex', flexDirection: 'column', gap: 28,
              }}>
                <ContactLine label="Email" v="den484411@gmail.com" href="mailto:den484411@gmail.com" />
                <ContactLine label="Telegram" v="@denisixone" href="https://t.me/denisixone" external />
                <ContactLine label="Часы" v="Пн–Сб · 10:00 — 20:00 GMT+4" />
                <ContactLine label="Ответ" v="В течение 2–3 часов" />
              </div>
            </div>

            <form onSubmit={submit} noValidate aria-label="Форма заявки" style={{
              background: 'var(--bg-2)',
              padding: 'clamp(24px, 4vw, 40px)',
              borderRadius: 'var(--r-sm)',
              display: 'flex', flexDirection: 'column', gap: 28,
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <Field
                id="name" inputRef={nameRef}
                label="Как вас зовут" value={form.name}
                onChange={(v) => update('name', v)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                required
                error={touched.name && errors.name}
                autoComplete="name"
              />
              <Field
                id="contact"
                label="Email или Telegram" value={form.contact}
                onChange={(v) => update('contact', v)}
                onBlur={() => setTouched((t) => ({ ...t, contact: true }))}
                required placeholder="@you · you@mail.com"
                error={touched.contact && errors.contact}
                autoComplete="email"
                inputMode="email"
              />

              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--muted)', marginBottom: 12, padding: 0,
                }}>Тип проекта</legend>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Готовый', 'Studio', 'Кастом', 'Не знаю'].map((t) => (
                    <Chip
                      key={t}
                      aria-pressed={form.type === t}
                      active={form.type === t}
                      onClick={() => update('type', t)}
                    >{t}</Chip>
                  ))}
                </div>
              </fieldset>

              <Field
                id="message"
                label="О свадьбе" multiline
                value={form.message} onChange={(v) => update('message', v)}
                placeholder="Даты, стиль, примерное кол-во гостей, язык…"
              />

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 14, borderTop: '1px solid var(--line)',
                gap: 16, flexWrap: 'wrap',
              }}>
                <div style={{
                  fontSize: 12, color: 'var(--muted)',
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em',
                }}>
                  Отправляя, вы принимаете оферту.
                </div>
                <Button type="submit" size="lg" loading={submitting} disabled={submitting}>
                  {submitting ? 'Отправка…' : 'Отправить заявку →'}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ id, label, value, onChange, onBlur, multiline, required, placeholder, error, inputRef, autoComplete, inputMode }) {
  const fieldId = `field-${id}`;
  const errorId = `${fieldId}-error`;
  const commonProps = {
    id: fieldId,
    value, onBlur,
    onChange: (e) => onChange(e.target.value),
    required,
    placeholder,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    autoComplete,
    inputMode,
  };
  const inputStyle = {
    width: '100%', background: 'transparent', border: 0,
    borderBottom: `1px solid ${error ? '#c0392b' : 'var(--line)'}`,
    padding: '10px 0', fontFamily: 'inherit',
    fontSize: 'clamp(16px, 1.6vw, 18px)',
    color: 'var(--ink)', outline: 'none',
  };
  return (
    <div>
      <label htmlFor={fieldId} style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 10,
      }}>
        <span>{label}</span>
        {required && <span style={{ opacity: 0.5 }}>требуется</span>}
      </label>
      {multiline ? (
        <textarea
          {...commonProps} ref={inputRef} rows={5}
          className="field-textarea"
          style={{ ...inputStyle, resize: 'vertical', minHeight: 96 }}
        />
      ) : (
        <input
          {...commonProps} ref={inputRef}
          className="field-input"
          style={inputStyle}
        />
      )}
      {error && (
        <div
          id={errorId}
          role="alert"
          style={{
            marginTop: 8, fontSize: 12, color: '#c0392b',
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em',
          }}
        >{error}</div>
      )}
    </div>
  );
}

function ContactLine({ label, v, href, external }) {
  const valueStyle = {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(20px, 2.2vw, 26px)', marginTop: 8,
    letterSpacing: '-0.01em',
  };
  return (
    <div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--muted)',
      }}>{label}</div>
      {href ? (
        <a
          href={href}
          rel="noopener noreferrer"
          target={external ? '_blank' : undefined}
          className="nav-link text-link"
          style={valueStyle}
        >{v}</a>
      ) : (
        <div style={valueStyle}>{v}</div>
      )}
    </div>
  );
}

Object.assign(browserGlobal, { Contact });


// ===== src/template-shell.jsx =====
// Shared utilities used by individual template demos:
// - Countdown hook
// - RSVP form (each template styles its own visually, but the state logic here)
// - Demo chrome (floating "this is a demo" bar with CTA back to main site)

function useCountdown(targetIso) {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(target);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  const d = Math.max(0, target - now);
  const days = Math.floor(d / (1000 * 60 * 60 * 24));
  const hours = Math.floor((d / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((d / (1000 * 60)) % 60);
  const seconds = Math.floor((d / 1000) % 60);
  return { days, hours, minutes, seconds };
}

// Floating demo-chrome bar (top). Shows this is a template preview + returns to /templates.
function DemoBar({ t, theme = 'light' }) {
  const [open, setOpen] = useState(true);
  const dark = theme === 'dark';
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="demo-bar"
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 200,
          background: dark ? 'rgba(20,16,10,0.8)' : 'rgba(245,241,234,0.85)',
          backdropFilter: 'blur(12px)',
          color: dark ? '#f5f1ea' : '#2a2418',
          border: dark ? '1px solid rgba(245,241,234,0.2)' : '1px solid rgba(42,36,24,0.15)',
          borderRadius: 999, padding: '8px 14px', cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}
      >denisixone · {t.name} ↓</button>
    );
  }
  return (
    <div className="demo-bar" style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
      background: dark ? 'rgba(15,12,8,0.85)' : 'rgba(245,241,234,0.92)',
      backdropFilter: 'blur(14px)',
      color: dark ? '#f5f1ea' : '#2a2418',
      border: dark ? '1px solid rgba(245,241,234,0.18)' : '1px solid rgba(42,36,24,0.12)',
      borderRadius: 999, padding: '8px 8px 8px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      maxWidth: 'calc(100vw - 32px)',
    }}>
      <Link to="/templates" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.7 }}>
        ← Все дизайны
      </Link>
      <span style={{ opacity: 0.3 }}>|</span>
      <span style={{ opacity: 0.85 }}>
        <span style={{ fontStyle: 'italic', fontFamily: "'Fraunces', serif", textTransform: 'none', letterSpacing: 0, fontSize: 14 }}>{t.name}</span>
        <span style={{ marginLeft: 10, opacity: 0.55 }}>· {t.styleRu}</span>
      </span>
      <Button to="/contact" size="sm" tone={dark ? 'light' : 'default'}>
        Заказать такой →
      </Button>
      <button
        onClick={() => setOpen(false)}
        style={{ background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer', fontSize: 14, opacity: 0.5, padding: '0 6px' }}
        aria-label="collapse"
      >×</button>
    </div>
  );
}

// Minimal generic RSVP logic — each template wraps in its own visuals
function useRsvp() {
  const [state, setState] = useState({ name: '', attending: 'yes', guests: 1, dietary: '' });
  const [sent, setSent] = useState(false);
  const update = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const submit = (e) => { e?.preventDefault?.(); setSent(true); };
  return { state, update, submit, sent };
}

Object.assign(browserGlobal, { useCountdown, DemoBar, useRsvp });


// ===== src/template-editorial.jsx =====
// 01 · Aurelia — Editorial magazine: reading progress bar, TOC, multi-column chapters, pull quotes

// Scroll-progress hook (used by Editorial "reading bar")
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      setP(Math.min(1, Math.max(0, h.scrollTop / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return p;
}

function TemplateEditorial() {
  const t = TEMPLATES.find((x) => x.slug === 'editorial');
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const progress = useScrollProgress();
  const P = t.palette;
  const couple = t.couple.split('&').map((s) => s.trim());
  const [a, b] = couple;

  const chapters = [
    { id: 'cover', label: 'Обложка' },
    { id: 'story', label: 'I · История' },
    { id: 'quote', label: 'Цитата' },
    { id: 'day', label: 'II · День' },
    { id: 'details', label: 'III · Детали' },
    { id: 'rsvp', label: 'IV · R.S.V.P.' },
  ];

  return (
    <div style={{
      background: P.bg, color: P.ink, fontFamily: "'Fraunces', Georgia, serif",
      minHeight: '100vh',
    }}>
      <DemoBar t={t} />

      {/* Reading progress bar */}
      <div aria-hidden="true" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 60,
        background: 'transparent', pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%', width: `${progress * 100}%`,
          background: P.ink, transition: 'width 80ms linear',
        }} />
      </div>

      {/* Masthead */}
      <header style={{
        padding: '28px clamp(20px, 4vw, 40px)', borderBottom: `1px solid ${P.ink}`,
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'baseline', gap: 20,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
      }}>
        <span>Vol. I · № {t.dateMono.split(' ')[0]}</span>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontStyle: 'italic', letterSpacing: '-0.02em', textTransform: 'none', whiteSpace: 'nowrap' }}>{a} · &amp; · {b}</span>
        <span style={{ textAlign: 'right' }}>{t.city} — Autumn MMXXVI</span>
      </header>

      {/* Cover */}
      <section id="cover" style={{ padding: 'clamp(60px, 9vw, 100px) clamp(20px, 4vw, 40px) 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.7 }}>— SAVE THE DATE —</div>
        <h1 style={{
          fontSize: 'clamp(72px, 18vw, 280px)', lineHeight: 0.88,
          fontWeight: 300, margin: '36px 0 0', letterSpacing: '-0.045em',
        }}>
          <span style={{ fontStyle: 'italic' }}>{a}</span>
        </h1>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(18px, 2.5vw, 32px)', fontStyle: 'italic', opacity: 0.8, margin: '-0.3em 0 0' }}>&amp;</div>
        <h1 style={{
          fontSize: 'clamp(72px, 18vw, 280px)', lineHeight: 0.88,
          fontWeight: 400, margin: 0, letterSpacing: '-0.045em',
        }}>{b}</h1>
        <div style={{ marginTop: 40, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1.3vw, 12px)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          {t.dateMono}  ·  {t.venue}  ·  {t.city}
        </div>
      </section>

      {/* Full-bleed photo */}
      <section style={{ padding: '40px clamp(20px, 4vw, 40px)' }}>
        <AssetImage src="/assets/images/editorial-hero-lake-como.webp" alt={`${a} and ${b} at Lake Como`} ratio="16/9" />
      </section>

      {/* Countdown */}
      <section style={{ padding: '60px clamp(20px, 4vw, 40px)', textAlign: 'center', borderTop: `1px solid ${P.ink}`, borderBottom: `1px solid ${P.ink}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.6, marginBottom: 24 }}>ДО СВАДЬБЫ</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 4vw, 40px)', flexWrap: 'wrap' }}>
          {[['days', 'дней', cd.days], ['hours', 'часов', cd.hours], ['minutes', 'минут', cd.minutes], ['seconds', 'секунд', cd.seconds]].map(([k, ru, v]) => (
            <div key={k}>
              <div style={{ fontSize: 'clamp(48px, 8vw, 112px)', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.6, marginTop: 6 }}>{ru}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Table of contents — editorial style */}
      <section style={{ padding: '80px clamp(20px, 4vw, 40px) 0', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.6, marginBottom: 20 }}>CONTENTS</div>
        <ol style={{
          listStyle: 'none', padding: 0, margin: 0,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16,
          borderTop: `1px solid ${P.ink}`, paddingTop: 16,
        }}>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a href={`#${c.id}`} style={{ display: 'flex', gap: 10, alignItems: 'baseline', color: P.ink, textDecoration: 'none', fontSize: 13 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.5 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontStyle: 'italic' }}>{c.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* Story — multi-col with drop caps */}
      <section id="story" style={{ padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 40px)', maxWidth: 1160, margin: '0 auto' }}>
        <div className="grid-2-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 }}>I · THE STORY</div>
            <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 400, margin: '20px 0 0', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
              {t.story[0].heading.split(' ').slice(0, -1).join(' ')} <span style={{ fontStyle: 'italic' }}>{t.story[0].heading.split(' ').slice(-1)[0]}</span>
            </h2>
          </div>
          <div>
            {t.story.map((s, i) => {
              const first = s.body.slice(0, 1);
              const rest = s.body.slice(1);
              return (
                <div key={i} style={{ marginBottom: 36 }}>
                  <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', opacity: 0.5, fontWeight: 400, textTransform: 'uppercase', margin: 0 }}>§ {i + 1} · {s.heading}</h3>
                  <p style={{ margin: '12px 0 0', fontSize: 'clamp(16px, 1.4vw, 18px)', lineHeight: 1.65, columnCount: i === 0 ? 2 : 1, columnGap: 36 }}>
                    {i === 0 && <span style={{ float: 'left', fontSize: 'clamp(64px, 9vw, 92px)', lineHeight: 0.85, paddingRight: 12, paddingTop: 6, fontStyle: 'italic', fontWeight: 400 }}>{first}</span>}
                    {i === 0 ? rest : s.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section id="quote" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', textAlign: 'center', background: P.bg2 }}>
        <p style={{ fontSize: 'clamp(26px, 4vw, 56px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.01em', maxWidth: 1000, margin: '0 auto', textWrap: 'balance' }}>
          «{t.quote.text}»
        </p>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', marginTop: 24, opacity: 0.6 }}>— {t.quote.author}</div>
      </section>

      {/* Programme — three-column editorial block */}
      <section id="day" style={{ padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 40px)', maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 }}>II · THE DAY</div>
        <h2 style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 400, margin: '20px 0 60px', letterSpacing: '-0.025em' }}>Программа <span style={{ fontStyle: 'italic' }}>дня</span></h2>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(3, t.program.length)}, 1fr)`, gap: 40 }}>
          {t.program.map((p) => (
            <div key={p.title} style={{ borderTop: `1px solid ${P.ink}`, paddingTop: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.14em', opacity: 0.6 }}>{p.time}</div>
              <div style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 400, margin: '16px 0 12px', letterSpacing: '-0.01em' }}>{p.title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.55, opacity: 0.85, fontFamily: 'Inter, sans-serif' }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Details — inset columns */}
      <section id="details" style={{ padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 40px)', background: P.bg2 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 }}>III · DETAILS</div>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 400, margin: '20px 0 40px', letterSpacing: '-0.02em' }}>Примечания <span style={{ fontStyle: 'italic' }}>к странице</span></h2>
          <dl className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32, margin: 0 }}>
            {[['Dress code', t.details.dressCode], ['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer]].map(([k, v]) => (
              <div key={k}>
                <dt style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55 }}>{k}</dt>
                <dd style={{ margin: '10px 0 0', fontSize: 17, fontStyle: 'italic', lineHeight: 1.5 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{ padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 40px)', background: P.ink, color: P.bg }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.6 }}>IV · R.S.V.P.</div>
          <h2 style={{ fontSize: 'clamp(48px, 8vw, 112px)', fontWeight: 400, margin: '24px 0 0', letterSpacing: '-0.035em', lineHeight: 0.95 }}>
            Дайте <span style={{ fontStyle: 'italic' }}>знать</span>.
          </h2>
          <p style={{ marginTop: 24, fontSize: 17, opacity: 0.75, lineHeight: 1.55, fontFamily: 'Inter, sans-serif' }}>
            Ответьте, пожалуйста, до {t.rsvpDeadline}.
          </p>
          <EditorialRSVP rsvp={rsvp} t={t} />
        </div>
      </section>

      <footer style={{ padding: '40px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', opacity: 0.6, textTransform: 'uppercase', background: P.ink, color: P.bg }}>
        · Сделано в denisixone · {t.name} · Colophon ·
      </footer>
    </div>
  );
}

function EditorialRSVP({ rsvp, t }) {
  if (rsvp.sent) {
    return <div style={{ marginTop: 40, padding: 32, border: '1px solid rgba(245,241,234,0.3)', fontStyle: 'italic', fontSize: 22 }}>Благодарим, {rsvp.state.name || 'друг'}. Мы ждём вас {t.dateLong.toLowerCase()}.</div>;
  }
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left', fontFamily: 'Inter, sans-serif' }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(245,241,234,0.3)', color: t.palette.bg, fontSize: 24, fontFamily: "'Fraunces', serif", padding: '8px 0' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {[['yes', 'Буду'], ['no', 'Не смогу']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? t.palette.bg : 'transparent', color: rsvp.state.attending === v ? t.palette.ink : t.palette.bg, border: '1px solid rgba(245,241,234,0.3)', cursor: 'pointer', fontFamily: "'Fraunces', serif", fontSize: 18, fontStyle: v === 'yes' ? 'italic' : 'normal' }}>{l}</button>
        ))}
      </div>
      <input placeholder="Диетарные пожелания (необязательно)" value={rsvp.state.dietary} onChange={(e) => rsvp.update('dietary', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(245,241,234,0.3)', color: t.palette.bg, fontSize: 16, padding: '8px 0' }} />
      <button type="submit" style={{ marginTop: 12, padding: 20, background: t.palette.bg, color: t.palette.ink, border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Отправить ответ →</button>
    </form>
  );
}

Object.assign(browserGlobal, { TemplateEditorial, useScrollProgress });


// ===== src/template-swiss.jsx =====
// 02 · Grid-14 — Split-screen: left sticky pane (identity), right scrolling pane (chapters)

function TemplateSwiss() {
  const t = TEMPLATES.find((x) => x.slug === 'swiss');
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim().toLowerCase());
  const [activeId, setActiveId] = useState('intro');

  useEffect(() => {
    const ids = ['intro', 'story', 'program', 'details', 'rsvp'];
    const els = ids.map((id) => document.getElementById('swiss-' + id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActiveId(e.target.id.replace('swiss-', ''));
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const nav = [
    ['intro', '00 / Intro'],
    ['story', '01 / Story'],
    ['program', '02 / Programme'],
    ['details', '03 / Details'],
    ['rsvp', '04 / R.S.V.P.'],
  ];

  return (
    <div style={{
      background: P.bg, color: P.ink,
      fontFamily: "'Inter', Helvetica, Arial, sans-serif",
      minHeight: '100vh',
    }}>
      <DemoBar t={t} />

      <div className="swiss-split" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh',
      }}>
        {/* LEFT · sticky identity */}
        <aside className="swiss-left" style={{
          position: 'sticky', top: 0, height: '100vh',
          padding: 'clamp(24px, 3vw, 40px)',
          borderRight: `1px solid ${P.ink}`,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          background: P.bg, gap: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.02em' }}>
            <span>{t.coupleShort}</span>
            <span>{t.dateMono}</span>
          </div>

          <div>
            <div style={{
              fontSize: 'clamp(64px, 11vw, 164px)', lineHeight: 0.82,
              fontWeight: 300, letterSpacing: '-0.045em',
            }}>
              {a}<br/>{b}.
            </div>
            <div style={{ height: 1, background: P.ink, margin: '28px 0 16px' }} />
            <div style={{ fontSize: 12, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t.venue}<br/>{t.city} · {t.dateLong}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.02em', marginBottom: 8 }}>Countdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, borderTop: `1px solid ${P.ink}`, paddingTop: 12 }}>
              {[['D', cd.days], ['H', cd.hours], ['M', cd.minutes], ['S', cd.seconds]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
                  <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>{k}</div>
                </div>
              ))}
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, letterSpacing: '0.04em' }}>
            {nav.map(([id, label]) => (
              <a key={id} href={`#swiss-${id}`} style={{
                color: P.ink, textDecoration: 'none',
                opacity: activeId === id ? 1 : 0.4,
                fontWeight: activeId === id ? 500 : 400,
                transition: 'opacity 200ms',
              }}>
                <span style={{ color: activeId === id ? P.accent : 'currentColor' }}>{activeId === id ? '●' : '○'}</span> {label}
              </a>
            ))}
          </nav>
        </aside>

        {/* RIGHT · scrolling content */}
        <div className="swiss-right" style={{ padding: 'clamp(24px, 3vw, 40px)' }}>
          <section id="swiss-intro" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: `1px solid ${P.ink}`, paddingBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>00 / Invitation</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '20px 0 0' }}>
              Приглашаем Вас на свадьбу <span style={{ fontWeight: 500 }}>{t.couple}</span> — {t.dateLong.toLowerCase()}, {t.city}.
            </h2>
            <p style={{ marginTop: 32, fontSize: 15, lineHeight: 1.65, maxWidth: 520, opacity: 0.8 }}>
              Этот сайт — наше письмо. Слева — кто мы и когда. Справа — история, программа, ответ.
            </p>
            <AssetImage src="/assets/images/swiss-figure-portrait.webp" alt={`${t.couple} portrait`} ratio="3/2" style={{ marginTop: 36, border: `1px solid ${P.ink}` }} />
          </section>

          <section id="swiss-story" style={{ padding: '60px 0', borderBottom: `1px solid ${P.ink}` }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>01 / Story</div>
            {t.story.map((s, i) => (
              <div key={i} style={{ marginTop: 28 }}>
                <h3 style={{ fontSize: 'clamp(22px, 2.8vw, 28px)', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>{s.heading}</h3>
                <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, maxWidth: 560, opacity: 0.85 }}>{s.body}</p>
              </div>
            ))}
            <blockquote style={{ margin: '36px 0 0', padding: '20px 0 0', borderTop: `1px solid ${P.ink}`, fontSize: 'clamp(17px, 1.9vw, 22px)', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.4 }}>
              «{t.quote.text}» <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 12 }}>— {t.quote.author}</span>
            </blockquote>
          </section>

          <section id="swiss-program" style={{ padding: '60px 0', borderBottom: `1px solid ${P.ink}` }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>02 / Programme</div>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' }}>
              {t.program.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 20, padding: '18px 0', borderTop: i === 0 ? 'none' : `1px solid ${P.ink2}33` }}>
                  <div style={{ fontSize: 15, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{p.time}</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 500 }}>{p.title}</div>
                    <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="swiss-details" style={{ padding: '60px 0', borderBottom: `1px solid ${P.ink}` }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>03 / Details</div>
            <dl style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '140px 1fr', gap: '14px 24px' }}>
              {[['Dress', t.details.dressCode], ['Gift', t.details.gift], ['Kids', t.details.kids], ['Transfer', t.details.transfer]].map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, paddingTop: 3 }}>{k}</dt>
                  <dd style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>

          <section id="swiss-rsvp" style={{ padding: '60px 0' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>04 / R.S.V.P.</div>
            <h2 style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.035em', margin: '16px 0 28px' }}>
              Ответьте до <span style={{ fontWeight: 500 }}>{t.rsvpDeadline}</span>.
            </h2>
            <SwissRSVP rsvp={rsvp} t={t} />
          </section>

          <footer style={{ padding: '40px 0 20px', borderTop: `1px solid ${P.ink}`, fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
            <span>{t.name} · denisixone</span>
            <span>{t.dateMono} · {t.city}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function SwissRSVP({ rsvp, t }) {
  if (rsvp.sent) return <div style={{ padding: 24, border: `1px solid ${t.palette.ink}`, fontSize: 14 }}>Получено. Спасибо, {rsvp.state.name || 'друг'}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, fontSize: 14 }}>
      <SwissField label="Name" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required t={t} />
      <SwissField label="Guests" type="number" value={rsvp.state.guests} onChange={(v) => rsvp.update('guests', v)} t={t} />
      <div style={{ gridColumn: '1 / 3' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: 10 }}>Присутствие</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['yes', 'ДА / буду'], ['no', 'НЕТ / не смогу']].map(([v, l]) => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="radio" checked={rsvp.state.attending === v} onChange={() => rsvp.update('attending', v)} /> {l}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" style={{ gridColumn: '1 / 3', padding: 18, background: t.palette.ink, color: t.palette.bg, border: 0, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Submit response →</button>
    </form>
  );
}
function SwissField({ label, value, onChange, type = 'text', required, t }) {
  return (
    <label>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: 10 }}>{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ width: '100%', padding: 12, border: `1px solid ${t.palette.ink}`, background: t.palette.bg, fontFamily: 'inherit', fontSize: 14, color: t.palette.ink }} />
    </label>
  );
}

Object.assign(browserGlobal, { TemplateSwiss });


// ===== src/template-garden.jsx =====
// 03 · Verbena — Centered card with expanding/fold-out sections (accordion)

function TemplateGarden() {
  const t = TEMPLATES.find((x) => x.slug === 'garden');
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());
  const [open, setOpen] = useState(new Set(['story']));

  const toggle = (id) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sections = [
    {
      id: 'story', label: 'Наша история', hint: 'раскрыть →',
      body: (
        <>
          {t.story.map((s, i) => (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 20 }}>
              <h3 style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 400, margin: 0 }}>{s.heading}</h3>
              <p style={{ marginTop: 10, fontSize: 17, lineHeight: 1.65, fontFamily: "'EB Garamond', serif" }}>{s.body}</p>
            </div>
          ))}
        </>
      ),
    },
    {
      id: 'program', label: 'Программа дня', hint: `${t.program.length} этапов →`,
      body: (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {t.program.map((p, i) => (
            <li key={i} style={{ display: 'flex', gap: 16, padding: '16px 0', borderTop: i === 0 ? 'none' : `1px solid ${P.ink}22` }}>
              <div style={{ width: 60, fontSize: 14, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', paddingTop: 3, flexShrink: 0 }}>{p.time}</div>
              <div>
                <div style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 400 }}>{p.title}</div>
                <div style={{ fontSize: 14, fontFamily: "'EB Garamond', serif", marginTop: 2, opacity: 0.8 }}>{p.place}{p.note ? ` — ${p.note}` : ''}</div>
              </div>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'details', label: 'Полезное', hint: 'dress code & прочее →',
      body: (
        <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {[['Dress code', t.details.dressCode], ['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer]].map(([k, v]) => (
            <div key={k} style={{ paddingBottom: 12, borderBottom: `1px dotted ${P.ink}44` }}>
              <dt style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6 }}>{k}</dt>
              <dd style={{ margin: '6px 0 0', fontSize: 16, fontStyle: 'italic', fontFamily: "'EB Garamond', serif" }}>{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: 'rsvp', label: 'R.S.V.P.', hint: `до ${t.rsvpDeadline} →`,
      body: <GardenRSVP rsvp={rsvp} t={t} />,
    },
  ];

  return (
    <div style={{
      background: `radial-gradient(ellipse at top, ${P.bg2} 0%, ${P.bg} 60%)`,
      minHeight: '100vh', color: P.ink,
      fontFamily: "'Cormorant Garamond', serif",
      padding: 'clamp(40px, 6vw, 80px) clamp(16px, 3vw, 40px) 80px',
    }}>
      <DemoBar t={t} />

      {/* Ambient botanical decorations around the page edge */}
      <BotanicalOrnament style={{ position: 'fixed', top: 60, left: 20, width: 160, opacity: 0.3, pointerEvents: 'none' }} />
      <BotanicalOrnament style={{ position: 'fixed', bottom: 20, right: 20, width: 180, opacity: 0.25, pointerEvents: 'none', transform: 'scale(-1,-1)' }} />

      {/* Centered card */}
      <article style={{
        maxWidth: 680, margin: '0 auto',
        background: P.paper,
        boxShadow: '0 40px 80px rgba(45,58,38,0.12), 0 8px 24px rgba(45,58,38,0.06)',
        padding: 'clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)',
        position: 'relative',
        borderRadius: 2,
      }}>
        {/* Decorative frame corners */}
        <svg aria-hidden="true" viewBox="0 0 40 40" style={{ position: 'absolute', top: 14, left: 14, width: 28, opacity: 0.5 }}>
          <path d="M2 14 L2 2 L14 2" fill="none" stroke={P.accent} strokeWidth="1" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 40 40" style={{ position: 'absolute', top: 14, right: 14, width: 28, opacity: 0.5, transform: 'scaleX(-1)' }}>
          <path d="M2 14 L2 2 L14 2" fill="none" stroke={P.accent} strokeWidth="1" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 40 40" style={{ position: 'absolute', bottom: 14, left: 14, width: 28, opacity: 0.5, transform: 'scaleY(-1)' }}>
          <path d="M2 14 L2 2 L14 2" fill="none" stroke={P.accent} strokeWidth="1" />
        </svg>
        <svg aria-hidden="true" viewBox="0 0 40 40" style={{ position: 'absolute', bottom: 14, right: 14, width: 28, opacity: 0.5, transform: 'scale(-1,-1)' }}>
          <path d="M2 14 L2 2 L14 2" fill="none" stroke={P.accent} strokeWidth="1" />
        </svg>

        {/* Front of the card */}
        <div style={{ textAlign: 'center', paddingTop: 16 }}>
          <BotanicalOrnament style={{ width: 120, opacity: 0.55, margin: '0 auto 20px' }} stroke={P.ink} />
          <AssetImage src="/assets/images/garden-olive-grove-couple.webp" alt={`${t.couple} in an olive grove`} ratio="3/4" style={{ maxWidth: 260, margin: '0 auto 28px', borderRadius: 999 }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.65 }}>
            — With joy we invite you —
          </div>
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 'clamp(44px, 8vw, 80px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em' }}>{a}</div>
            <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 400, margin: '6px 0', letterSpacing: '0.2em', opacity: 0.7 }}>&amp;</div>
            <div style={{ fontSize: 'clamp(44px, 8vw, 80px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em' }}>{b}</div>
          </div>
          <div style={{ marginTop: 32, fontSize: 15, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            {t.dateMono}
          </div>
          <div style={{ fontSize: 13, letterSpacing: '0.28em', marginTop: 6, opacity: 0.7, textTransform: 'uppercase' }}>
            {t.venue} · {t.city}
          </div>

          {/* Countdown band */}
          <div style={{ margin: '36px -24px 0', padding: '20px 0', background: P.bg2 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', opacity: 0.6, textTransform: 'uppercase' }}>до свадьбы</div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 24 }}>
              {[['дней', cd.days], ['часов', cd.hours], ['минут', cd.minutes]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.65, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <blockquote style={{ margin: '32px 0 0', fontSize: 18, fontStyle: 'italic', lineHeight: 1.45, opacity: 0.85, textWrap: 'balance' }}>
            «{t.quote.text}»
          </blockquote>
        </div>

        {/* Fold-out sections */}
        <div style={{ marginTop: 40, borderTop: `1px solid ${P.ink}33` }}>
          {sections.map((s) => {
            const isOpen = open.has(s.id);
            const panelId = `garden-panel-${s.id}`;
            const btnId = `garden-btn-${s.id}`;
            return (
              <div key={s.id} style={{ borderBottom: `1px solid ${P.ink}22` }}>
                <h3 style={{ margin: 0 }}>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(s.id)}
                    style={{
                      width: '100%', textAlign: 'left', background: 'transparent', border: 0,
                      padding: '22px 0', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit',
                      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontStyle: 'italic', fontWeight: 400 }}>
                      <span style={{ opacity: 0.4, fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginRight: 10, fontStyle: 'normal', letterSpacing: '0.1em' }}>{sections.indexOf(s) + 1 < 10 ? '0' + (sections.indexOf(s) + 1) : sections.indexOf(s) + 1}</span>
                      {s.label}
                    </span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      letterSpacing: '0.1em', opacity: isOpen ? 0 : 0.55,
                      transition: 'opacity 200ms',
                    }}>{s.hint}</span>
                    <span aria-hidden="true" style={{
                      fontSize: 20, transition: 'transform 300ms var(--ease, cubic-bezier(.2,.8,.2,1))',
                      transform: isOpen ? 'rotate(45deg)' : 'none', color: P.accent,
                    }}>+</span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  hidden={!isOpen}
                  style={{
                    padding: isOpen ? '0 0 28px 0' : 0,
                    maxHeight: isOpen ? 1200 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 400ms ease, opacity 300ms ease, padding 300ms',
                  }}
                >
                  {s.body}
                </div>
              </div>
            );
          })}
        </div>

        {/* Signature */}
        <div style={{ marginTop: 40, textAlign: 'center', fontSize: 16, fontStyle: 'italic', opacity: 0.7 }}>
          С любовью, {t.couple}
        </div>
      </article>

      <footer style={{ marginTop: 40, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', opacity: 0.5, textTransform: 'uppercase' }}>
        {t.name} · Verbena series · denisixone
      </footer>
    </div>
  );
}

function BotanicalOrnament({ style, stroke = '#2d3a26' }) {
  return (
    <svg viewBox="0 0 200 100" style={style} aria-hidden="true">
      <g stroke={stroke} fill="none" strokeWidth="0.8">
        <path d="M10 50 Q60 20, 100 50 T190 50" opacity="0.6" />
        <g opacity="0.8">
          {[30, 60, 90, 120, 150].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${45 + (i % 2) * 6})`}>
              <ellipse cx="0" cy="-5" rx="3" ry="6" transform="rotate(-20)" />
              <ellipse cx="0" cy="5" rx="3" ry="6" transform="rotate(20)" />
              <circle cx="0" cy="0" r="1.5" fill={stroke} />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

function GardenRSVP({ rsvp, t }) {
  const P = t.palette;
  if (rsvp.sent) return <div style={{ padding: 20, background: P.bg2, fontStyle: 'italic', fontSize: 18, textAlign: 'center' }}>Так рады, {rsvp.state.name || 'друг'}. Ждём вас среди сирени.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${P.ink}44`, color: P.ink, fontSize: 22, fontStyle: 'italic', padding: '10px 0', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['yes', 'С радостью'], ['no', 'К сожалению, нет']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 14, background: rsvp.state.attending === v ? P.ink : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.ink}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 16, fontStyle: 'italic' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ padding: 16, background: P.ink, color: P.bg, border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Отправить →</button>
    </form>
  );
}

Object.assign(browserGlobal, { TemplateGarden });


// ===== src/template-dark.jsx =====
// 04 · Noctis — Fullscreen pin-scroll sections with dot navigation (Y scroll-snap)

function TemplateDark() {
  const t = TEMPLATES.find((x) => x.slug === 'dark');
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);

  const slides = [
    { id: 'cover', label: 'Обложка' },
    { id: 'invite', label: 'Приглашение' },
    { id: 'story', label: 'История' },
    { id: 'count', label: 'Countdown' },
    { id: 'program', label: 'Вечер' },
    { id: 'dress', label: 'Dress code' },
    { id: 'rsvp', label: 'R.S.V.P.' },
  ];

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const sections = el.querySelectorAll('[data-slide]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number(e.target.dataset.slide));
      });
    }, { root: el, threshold: 0.5 });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = el.querySelector(`[data-slide="${i}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const slideStyle = {
    minHeight: '100vh', scrollSnapAlign: 'start',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 80px)',
    position: 'relative',
  };

  const kicker = { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55, textTransform: 'uppercase' };

  return (
    <div style={{ background: P.bg, color: P.accent, fontFamily: "'Cormorant Garamond', serif" }}>
      <DemoBar t={t} theme="dark" />

      {/* Dot navigation */}
      <nav aria-label="Разделы" className="noctis-dots" style={{
        position: 'fixed', right: 'clamp(14px, 2vw, 28px)', top: '50%', transform: 'translateY(-50%)', zIndex: 40,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {slides.map((s, i) => (
          <button key={s.id} type="button"
            onClick={() => goTo(i)}
            aria-label={`Перейти: ${s.label}`}
            aria-current={active === i}
            style={{
              width: 10, height: 10, borderRadius: '50%',
              border: `1px solid ${P.accent}`,
              background: active === i ? P.accent : 'transparent',
              cursor: 'pointer', padding: 0,
              transition: 'background 200ms, transform 200ms',
              transform: active === i ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </nav>

      <div ref={scrollerRef} style={{
        height: '100vh', overflowY: 'auto', scrollSnapType: 'y mandatory',
      }}>
        {/* SLIDE 0: Cover */}
        <section data-slide="0" style={{ ...slideStyle, textAlign: 'center', overflow: 'hidden' }}>
          <AssetImage src="/assets/images/dark-luxe-hero-paris.webp" alt={`${a} and ${b} in Paris`} ratio="16/9" style={{ position: 'absolute', inset: 0, height: '100%', opacity: 0.5 }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${P.bg}99 0%, ${P.bg}33 50%, ${P.bg} 100%)` }} />
          <div style={{ position: 'absolute', top: 40, left: 0, right: 0, padding: '0 clamp(24px, 5vw, 80px)', display: 'flex', justifyContent: 'space-between', ...kicker }}>
            <span>{t.city} · MMXXVI</span>
            <span>— NOCTURNE —</span>
            <span>№ 001 / 001</span>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ ...kicker, marginBottom: 24 }}>— {t.dateMono} —</div>
            <div style={{ fontSize: 'clamp(72px, 14vw, 200px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '0.01em' }}>{a}</div>
            <div style={{ fontSize: 'clamp(22px, 3vw, 36px)', margin: '-0.2em 0', fontStyle: 'italic', opacity: 0.7 }}>&amp;</div>
            <div style={{ fontSize: 'clamp(72px, 14vw, 200px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '0.01em' }}>{b}</div>
          </div>
          <button type="button" onClick={() => goTo(1)} style={{
            position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center',
            ...kicker, background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer',
          }}>↓ Scroll</button>
        </section>

        {/* SLIDE 1: Invitation */}
        <section data-slide="1" style={{ ...slideStyle, textAlign: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: 820 }}>
            <div style={kicker}>Invitation</div>
            <p style={{ marginTop: 28, fontSize: 'clamp(22px, 3vw, 40px)', lineHeight: 1.35, fontWeight: 300, fontStyle: 'italic', color: '#e8d4a8' }}>
              В {t.dateLong.toLowerCase()} в {t.city} — мы зажигаем свечи и приглашаем вас быть рядом.
            </p>
            <div style={{ width: 40, height: 0.5, background: P.accent, margin: '48px auto 0', opacity: 0.5 }} />
            <blockquote style={{ margin: '24px auto 0', fontSize: 18, fontStyle: 'italic', opacity: 0.8, maxWidth: 640 }}>
              «{t.quote.text}»<br/><span style={{ fontSize: 12, opacity: 0.6, letterSpacing: '0.2em' }}>— {t.quote.author}</span>
            </blockquote>
          </div>
        </section>

        {/* SLIDE 2: Story */}
        <section data-slide="2" style={{ ...slideStyle, alignItems: 'center' }}>
          <div style={{ maxWidth: 840, width: '100%', margin: '0 auto' }}>
            <div style={kicker}>Мы · вдвоём</div>
            <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontStyle: 'italic', fontWeight: 300, margin: '20px 0 32px', lineHeight: 1 }}>Наша история</h2>
            {t.story.map((s, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : 28, borderTop: i === 0 ? 'none' : `1px solid ${P.accent}22`, paddingTop: i === 0 ? 0 : 24 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', opacity: 0.55 }}>§ {i + 1}</div>
                <h3 style={{ fontSize: 'clamp(22px, 2.8vw, 28px)', fontStyle: 'italic', fontWeight: 300, margin: '6px 0 12px' }}>{s.heading}</h3>
                <p style={{ fontSize: 17, lineHeight: 1.65, color: '#e8d4a8', opacity: 0.9, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SLIDE 3: Countdown */}
        <section data-slide="3" style={{ ...slideStyle, textAlign: 'center', background: P.bg2, alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 1000 }}>
            <div style={kicker}>До встречи</div>
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(16px, 3vw, 40px)' }}>
              {[['days', cd.days], ['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 'clamp(48px, 10vw, 140px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: '#e8d4a8' }}>{String(v).padStart(2, '0')}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 10, opacity: 0.55 }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 4: Program */}
        <section data-slide="4" style={{ ...slideStyle, alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 960 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={kicker}>Программа</div>
              <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontStyle: 'italic', fontWeight: 300, margin: '16px 0 0', lineHeight: 1 }}>Сценарий вечера</h2>
            </div>
            <div>
              {t.program.map((p, i) => (
                <div key={i} className="grid-dark-row" style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 'clamp(20px, 3vw, 40px)', padding: '22px 0', borderBottom: `1px solid ${P.accent}22`, alignItems: 'baseline' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.15em', opacity: 0.7 }}>{p.time}</div>
                  <div style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontStyle: 'italic', fontWeight: 300 }}>{p.title}</div>
                  <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SLIDE 5: Dress code + details */}
        <section data-slide="5" style={{ ...slideStyle, background: P.bg2, textAlign: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: 700 }}>
            <div style={kicker}>Dress code</div>
            <h2 style={{ fontSize: 'clamp(48px, 8vw, 112px)', fontStyle: 'italic', fontWeight: 300, margin: '16px 0 0', lineHeight: 1, letterSpacing: '0.02em' }}>{t.details.dressCode.split(' ')[0]},<br/><span style={{ opacity: 0.7 }}>nocturne.</span></h2>
            <p style={{ marginTop: 24, fontSize: 17, lineHeight: 1.55, opacity: 0.8, fontStyle: 'italic' }}>
              {t.details.dressCode}. Без белого — для нас этот цвет только у невесты.
            </p>
            <dl style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, textAlign: 'left' }}>
              {[['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer], ['Финал', '03:00 — последний трансфер']].map(([k, v]) => (
                <div key={k} style={{ borderTop: `1px solid ${P.accent}44`, paddingTop: 12 }}>
                  <dt style={{ ...kicker, marginBottom: 6 }}>{k}</dt>
                  <dd style={{ margin: 0, fontSize: 15, fontStyle: 'italic' }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* SLIDE 6: RSVP */}
        <section data-slide="6" style={{ ...slideStyle, textAlign: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: 600, width: '100%' }}>
            <div style={kicker}>R · S · V · P</div>
            <h2 style={{ fontSize: 'clamp(52px, 9vw, 128px)', fontStyle: 'italic', fontWeight: 300, margin: '16px 0 0', lineHeight: 0.95 }}>Будем<br/>ждать.</h2>
            <p style={{ marginTop: 16, opacity: 0.75, fontStyle: 'italic' }}>Пожалуйста, ответьте до {t.rsvpDeadline}.</p>
            <DarkRSVP rsvp={rsvp} t={t} />
            <footer style={{ marginTop: 60, ...kicker, opacity: 0.4 }}>
              {t.coupleShort} · {t.dateMono} · {t.city}
            </footer>
          </div>
        </section>
      </div>
    </div>
  );
}

function DarkRSVP({ rsvp, t }) {
  const P = t.palette;
  if (rsvp.sent) return <div style={{ marginTop: 40, fontStyle: 'italic', fontSize: 22, color: '#e8d4a8' }}>Ваш ответ получен, {rsvp.state.name || 'друг'}. До встречи.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${P.accent}66`, color: '#e8d4a8', fontSize: 24, fontStyle: 'italic', padding: '12px 0', textAlign: 'center', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['yes', 'Принять'], ['no', 'Отклонить']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? P.accent : 'transparent', color: rsvp.state.attending === v ? P.bg : P.accent, border: `1px solid ${P.accent}66`, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ padding: 16, background: P.accent, color: P.bg, border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer' }}>Confirm →</button>
    </form>
  );
}

Object.assign(browserGlobal, { TemplateDark });


// ===== src/template-brutalist.jsx =====
// 05 · Konkret — Horizontal snap-scroll between blocks (Archivo Black, red accent)

function TemplateBrutalist() {
  const t = TEMPLATES.find((x) => x.slug === 'brutalist');
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const scroller = useRef(null);
  const [idx, setIdx] = useState(0);
  const [cName, xSign, yName] = t.couple.split(/ × | x | X /i).length === 2
    ? [t.couple.split(/ × | x | X /i)[0], '×', t.couple.split(/ × | x | X /i)[1]]
    : [t.couple.split('&')[0]?.trim() || t.couple, '&', t.couple.split('&')[1]?.trim() || ''];

  const slides = [
    { id: 'cover', w: '100vw' },
    { id: 'facts', w: '100vw' },
    { id: 'manifest', w: '100vw' },
    { id: 'count', w: '100vw' },
    { id: 'program', w: '100vw' },
    { id: 'rsvp', w: '100vw' },
  ];

  // Track active slide via IntersectionObserver on scroller
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const items = el.querySelectorAll('[data-hblock]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setIdx(Number(e.target.dataset.hblock));
      });
    }, { root: el, threshold: 0.6 });
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  const go = React.useCallback((dir) => {
    const el = scroller.current;
    if (!el) return;
    const next = Math.max(0, Math.min(slides.length - 1, idx + dir));
    const target = el.querySelector(`[data-hblock="${next}"]`);
    if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, [idx, slides.length]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const block = {
    flex: '0 0 100vw', height: '100vh',
    scrollSnapAlign: 'start', scrollSnapStop: 'always',
    padding: 'clamp(24px, 3vw, 40px)',
    borderRight: '2px solid #000',
    display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden',
  };
  const kick = { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' };

  return (
    <div className="brut-wrap" style={{
      background: P.bg,
      color: P.ink,
      fontFamily: "'Inter', sans-serif",
      height: '100vh',
      overflow: 'hidden',
      backgroundImage: `linear-gradient(${P.bg}e6, ${P.bg}e6), url(/assets/images/brutalist-urban-poster-texture.webp)`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
    }}>
      <DemoBar t={t} />

      {/* Top status bar */}
      <div className="brut-topbar" style={{
        position: 'fixed', top: 64, left: 0, right: 0, zIndex: 30,
        padding: '10px 20px', display: 'flex', justifyContent: 'space-between',
        background: P.ink, color: P.bg, ...kick,
      }}>
        <span>{t.name.toUpperCase()} — ДОКУМЕНТ v.1.0</span>
        <span style={{ background: P.accent, color: '#fff', padding: '2px 8px' }}>{t.city.toUpperCase()} / {t.dateMono}</span>
      </div>

      {/* Bottom nav */}
      <div className="brut-botnav" style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 30,
        display: 'flex', gap: 10, alignItems: 'center', background: P.ink, color: P.bg, padding: '10px 14px',
      }}>
        <button type="button" onClick={() => go(-1)} aria-label="Назад" disabled={idx === 0} style={{ background: 'transparent', border: `2px solid ${P.bg}`, color: P.bg, fontFamily: "'Archivo Black', sans-serif", width: 40, height: 40, cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}>←</button>
        <div style={{ ...kick, minWidth: 80, textAlign: 'center' }}>{String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
        <button type="button" onClick={() => go(1)} aria-label="Вперёд" disabled={idx === slides.length - 1} style={{ background: P.accent, border: `2px solid ${P.accent}`, color: '#fff', fontFamily: "'Archivo Black', sans-serif", width: 40, height: 40, cursor: idx === slides.length - 1 ? 'default' : 'pointer', opacity: idx === slides.length - 1 ? 0.5 : 1 }}>→</button>
      </div>

      {/* Horizontal scroller */}
      <div ref={scroller} className="hsnap" style={{
        display: 'flex', height: '100vh',
        overflowX: 'auto', overflowY: 'hidden',
        scrollSnapType: 'x mandatory',
        paddingTop: 52,
      }}>
        {/* 0 COVER */}
        <section data-hblock="0" style={{ ...block, justifyContent: 'space-between' }}>
          <div style={{ ...kick }}>§ 00 / COVER</div>
          <div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(80px, 18vw, 260px)', lineHeight: 0.82, letterSpacing: '-0.06em' }}>{cName.toUpperCase()}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(56px, 12vw, 180px)', lineHeight: 0.82, letterSpacing: '-0.05em', color: P.accent }}>{xSign}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(80px, 18vw, 260px)', lineHeight: 0.82, letterSpacing: '-0.06em', textAlign: 'right' }}>{yName.toUpperCase()}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...kick }}>
            <span>→ SCROLL / USE ARROWS</span><span>{t.dateMono}</span>
          </div>
        </section>

        {/* 1 FACTS */}
        <section data-hblock="1" style={{ ...block, justifyContent: 'center' }}>
          <div style={kick}>§ 01 / ФАКТЫ</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, marginTop: 32, border: '2px solid #000' }}>
            {[['ДАТА', t.dateMono], ['ВРЕМЯ', t.program[0]?.time || '14:00'], ['МЕСТО', t.venue], ['ГОРОД', t.city], ['ДРЕССКОД', t.details.dressCode], ['ВОЗРАСТ', t.details.kids]].map(([k, v], i) => (
              <div key={k} style={{ borderRight: i % 2 === 0 ? '2px solid #000' : 0, borderBottom: i < 4 ? '2px solid #000' : 0, padding: '20px 24px' }}>
                <div style={{ ...kick, fontSize: 10, opacity: 0.6 }}>{k}</div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(22px, 3vw, 36px)', letterSpacing: '-0.02em', marginTop: 8 }}>{v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2 MANIFEST */}
        <section data-hblock="2" style={{ ...block, background: P.bg2, justifyContent: 'center' }}>
          <div style={{ ...kick, marginBottom: 28 }}>§ 02 / МАНИФЕСТ</div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(32px, 5.5vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.035em' }}>
            МЫ ЖЕНИМСЯ.<br/>
            <span style={{ color: P.accent }}>НЕТ</span> ДРЕССКОДУ.<br/>
            <span style={{ color: P.accent }}>НЕТ</span> РАССАДКЕ.<br/>
            <span style={{ color: P.accent }}>НЕТ</span> ПОДАРКАМ.<br/>
            <span style={{ color: P.accent }}>ДА</span> — ВАМ.
          </div>
          <div style={{ marginTop: 32, fontSize: 14, fontStyle: 'italic', maxWidth: 560, opacity: 0.8 }}>{t.story[0].body}</div>
        </section>

        {/* 3 COUNTDOWN */}
        <section data-hblock="3" style={{ ...block, background: P.ink, color: P.bg, justifyContent: 'center' }}>
          <div style={{ ...kick, opacity: 0.7 }}>§ 03 / COUNTDOWN</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, marginTop: 24, border: `2px solid ${P.bg}` }}>
            {[['ДНИ', cd.days], ['ЧАСЫ', cd.hours], ['МИНУТЫ', cd.minutes], ['СЕКУНДЫ', cd.seconds]].map(([k, v], i) => (
              <div key={k} style={{ padding: 28, borderRight: i % 2 === 0 ? `2px solid ${P.bg}` : 0, borderBottom: i < 2 ? `2px solid ${P.bg}` : 0 }}>
                <div style={{ ...kick, fontSize: 10, opacity: 0.7 }}>{k}</div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(56px, 10vw, 136px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em', marginTop: 6 }}>{String(v).padStart(2, '0')}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4 PROGRAMME */}
        <section data-hblock="4" style={{ ...block, justifyContent: 'flex-start', overflowY: 'auto' }}>
          <div style={{ ...kick, marginBottom: 24 }}>§ 04 / ПРОГРАММА</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(16px, 2vw, 24px)', letterSpacing: '-0.02em' }}>
            <tbody>
              {t.program.map((p, i) => (
                <tr key={i} style={{ borderTop: '2px solid #000' }}>
                  <td style={{ padding: '18px 0', width: 110 }}>{p.time}</td>
                  <td style={{ padding: '18px 0' }}>{p.title.toUpperCase()}</td>
                  <td style={{ padding: '18px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: 'right', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.place}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #000' }} />
            </tbody>
          </table>
        </section>

        {/* 5 RSVP */}
        <section data-hblock="5" style={{ ...block, background: P.accent, color: '#000', justifyContent: 'center' }}>
          <div style={{ ...kick }}>§ 05 / RSVP</div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(44px, 9vw, 120px)', lineHeight: 0.88, letterSpacing: '-0.05em', margin: '16px 0 24px' }}>
            ДА<br/>ИЛИ НЕТ?
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginBottom: 20 }}>ОТВЕТЬТЕ ДО {t.rsvpDeadline.toUpperCase()}</div>
          <BrutalistRSVP rsvp={rsvp} t={t} />
        </section>
      </div>
    </div>
  );
}

function BrutalistRSVP({ rsvp, t }) {
  const P = t.palette;
  if (rsvp.sent) return <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 40, letterSpacing: '-0.03em' }}>ПОЛУЧЕНО. {(rsvp.state.name || 'ДРУГ').toUpperCase()}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, maxWidth: 900 }}>
      <input required placeholder="ИМЯ" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ gridColumn: 'span 2', padding: 18, background: '#000', color: '#fff', border: 0, fontFamily: "'Archivo Black', sans-serif", fontSize: 18, letterSpacing: '-0.02em' }} />
      <button type="button" onClick={() => rsvp.update('attending', 'yes')}
        style={{ padding: 18, background: rsvp.state.attending === 'yes' ? '#000' : 'transparent', color: rsvp.state.attending === 'yes' ? P.accent : '#000', border: '2px solid #000', cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: 18 }}>ДА</button>
      <button type="button" onClick={() => rsvp.update('attending', 'no')}
        style={{ padding: 18, background: rsvp.state.attending === 'no' ? '#000' : 'transparent', color: rsvp.state.attending === 'no' ? P.accent : '#000', border: '2px solid #000', borderLeft: 0, cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: 18 }}>НЕТ</button>
      <button type="submit" style={{ gridColumn: 'span 4', padding: 22, background: '#000', color: P.accent, border: 0, fontFamily: "'Archivo Black', sans-serif", fontSize: 22, letterSpacing: '-0.02em', cursor: 'pointer', marginTop: 8 }}>SUBMIT →</button>
    </form>
  );
}

Object.assign(browserGlobal, { TemplateBrutalist });


// ===== src/template-letterpress.jsx =====
// 06 · Letterpress — aged paper, centered classical, EB Garamond, ornaments

function TemplateLetterpress() {
  const t = TEMPLATES.find((x) => x.slug === 'letterpress');
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const [page, setPage] = React.useState(0);
  const TOTAL = 3;
  const touch = React.useRef({ x: 0 });

  const go = React.useCallback((dir) => setPage((p) => Math.max(0, Math.min(TOTAL - 1, p + dir))), []);
  const paperTexture = `radial-gradient(ellipse at center, rgba(255,255,255,0.28), rgba(201,168,120,0.08)), url(/assets/images/letterpress-paper-texture.webp)`;

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const onStart = (e) => { touch.current.x = e.touches[0].clientX; };
  const onEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.x;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  return (
    <div style={{
      background: P.bg, color: P.ink, fontFamily: "'EB Garamond', Georgia, serif",
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      backgroundImage: paperTexture,
      backgroundSize: 'cover',
    }} onTouchStart={onStart} onTouchEnd={onEnd}>
      <DemoBar t={t} />

      {/* Top caption */}
      <div className="book-caption" style={{ position: 'fixed', top: 68, left: 0, right: 0, textAlign: 'center', zIndex: 40, pointerEvents: 'none' }}>
        <span style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.55 }}>
          ex libris — {t.city} — MMXXVI
        </span>
      </div>

      {/* Spreads container */}
      <div className="book-container" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 60px 140px' }}>
        {[0, 1, 2].map((i) => (
          <article key={i} className="book-spread" aria-hidden={page !== i}
            style={{
              display: page === i ? 'grid' : 'none',
              gridTemplateColumns: '1fr 1fr',
              width: '100%', maxWidth: 1120, minHeight: '68vh',
              background: P.paper,
              boxShadow: `0 40px 80px rgba(58,42,26,0.25), inset 0 0 0 1px rgba(58,42,26,0.12)`,
              position: 'relative',
              animation: 'fadeIn 480ms ease',
            }}>
            {/* Book spine shadow down the middle */}
            <div className="book-spine" aria-hidden="true" style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%', width: 28, transform: 'translateX(-50%)',
              background: 'linear-gradient(to right, transparent, rgba(58,42,26,0.16) 45%, rgba(58,42,26,0.22) 50%, rgba(58,42,26,0.16) 55%, transparent)',
              pointerEvents: 'none', zIndex: 1,
            }} />
            {i === 0 && <LetterpressSpread1 t={t} a={a} b={b} P={P} />}
            {i === 1 && <LetterpressSpread2 t={t} P={P} cd={cd} />}
            {i === 2 && <LetterpressSpread3 t={t} P={P} rsvp={rsvp} />}
          </article>
        ))}
      </div>

      {/* Arrow buttons */}
      <button className="book-arrow" aria-label="Предыдущая страница" onClick={() => go(-1)} disabled={page === 0}
        style={{ position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)', width: 52, height: 52,
          borderRadius: '50%', border: `1px solid ${P.ink}`, background: P.paper, color: P.ink, cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.25 : 1, fontSize: 26, lineHeight: 1, zIndex: 50, fontFamily: 'inherit' }}>‹</button>
      <button className="book-arrow" aria-label="Следующая страница" onClick={() => go(1)} disabled={page === TOTAL - 1}
        style={{ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', width: 52, height: 52,
          borderRadius: '50%', border: `1px solid ${P.ink}`, background: P.paper, color: P.ink, cursor: page === TOTAL - 1 ? 'default' : 'pointer', opacity: page === TOTAL - 1 ? 0.25 : 1, fontSize: 26, lineHeight: 1, zIndex: 50, fontFamily: 'inherit' }}>›</button>

      {/* Page indicator */}
      <div className="book-indicator" style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, alignItems: 'center', zIndex: 50, background: P.paper, padding: '10px 18px', borderRadius: 999, border: `1px solid ${P.ink}33` }}>
        {[0, 1, 2].map((i) => (
          <button key={i} onClick={() => setPage(i)} aria-label={`Страница ${i + 1}`} aria-current={page === i}
            style={{ width: page === i ? 28 : 10, height: 10, borderRadius: 5, border: 0, background: page === i ? P.ink : `${P.ink}33`, cursor: 'pointer', transition: 'all 280ms ease', padding: 0 }} />
        ))}
        <div style={{ marginLeft: 6, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.65 }}>стр. {page + 1} / {TOTAL}</div>
      </div>
    </div>
  );
}

function LetterpressSpread1({ t, a, b, P }) {
  return (
    <>
      <div style={{ padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <FleurOrnament color={P.ink} style={{ width: 80, opacity: 0.55, margin: '0 auto 28px' }} />
        <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.6 }}>— Приглашение —</div>
        <div style={{ fontSize: 'clamp(22px, 2.6vw, 34px)', fontStyle: 'italic', margin: '32px 0 8px', opacity: 0.8 }}>в честь бракосочетания</div>
        <div style={{ fontSize: 'clamp(44px, 6.5vw, 84px)', margin: 0, lineHeight: 1 }}>{a}</div>
        <div style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontStyle: 'italic', margin: '10px 0', opacity: 0.7 }}>&amp;</div>
        <div style={{ fontSize: 'clamp(44px, 6.5vw, 84px)', margin: 0, lineHeight: 1 }}>{b}</div>
        <FleurOrnament color={P.ink} style={{ width: 80, opacity: 0.55, margin: '36px auto 0', transform: 'rotate(180deg)' }} />
      </div>
      <div style={{ padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.6 }}>— когда &amp; где —</div>
        <div style={{ margin: '32px 0' }}>
          <div className="letterpress-date-long" style={{ fontSize: 22, fontStyle: 'italic', lineHeight: 1.5 }}>{t.dateLong}</div>
          <div className="letterpress-date-mono" style={{ fontSize: 28, margin: '18px 0 10px', letterSpacing: '0.14em' }}>{t.dateMono}</div>
          <div style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.6 }}>в час пополудни</div>
        </div>
        <div style={{ margin: '12px auto', display: 'flex', alignItems: 'center', gap: 14, maxWidth: 220 }}>
          <div style={{ flex: 1, height: 0.5, background: P.ink, opacity: 0.4 }} />
          <div style={{ fontSize: 11, letterSpacing: '0.3em', opacity: 0.55 }}>et</div>
          <div style={{ flex: 1, height: 0.5, background: P.ink, opacity: 0.4 }} />
        </div>
        <div style={{ fontSize: 26, fontStyle: 'italic', lineHeight: 1.4, marginTop: 12 }}>
          {t.venue}<br />
          <span style={{ fontSize: 16, opacity: 0.7, fontStyle: 'normal', letterSpacing: '0.25em', textTransform: 'uppercase' }}>{t.city}</span>
        </div>
      </div>
    </>
  );
}

function LetterpressSpread2({ t, P, cd }) {
  return (
    <>
      <div style={{ padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <FleurOrnament color={P.ink} style={{ width: 56, opacity: 0.5, marginBottom: 20 }} />
        <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.6 }}>— Глава I —</div>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, fontStyle: 'italic', margin: '10px 0 24px', lineHeight: 1.1 }}>Наша история</h2>
        {t.story.map((s, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.65, marginBottom: 6 }}>{s.heading}</div>
            <p style={{ fontSize: 16, lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </div>
        ))}
        <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px dotted ${P.ink}66`, fontStyle: 'italic', fontSize: 14, opacity: 0.78, lineHeight: 1.6 }}>
          «{t.quote.text}»
          <div style={{ marginTop: 6, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.7 }}>— {t.quote.author}</div>
        </div>
      </div>
      <div style={{ padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <FleurOrnament color={P.ink} style={{ width: 56, opacity: 0.5, marginBottom: 20, marginLeft: 'auto' }} />
        <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.6, textAlign: 'right' }}>— Глава II —</div>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, fontStyle: 'italic', margin: '10px 0 24px', lineHeight: 1.1, textAlign: 'right' }}>Программа</h2>
        <div>
          {t.program.map((p, i) => {
            const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][i] || String(i + 1);
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '38px 1fr auto', gap: 14, alignItems: 'baseline', padding: '12px 0', borderBottom: `1px dotted ${P.ink}66` }}>
                <div style={{ fontStyle: 'italic', fontSize: 20, opacity: 0.55 }}>{roman}.</div>
                <div>
                  <div style={{ fontSize: 19, fontStyle: 'italic' }}>{p.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>{p.place}</div>
                </div>
                <div style={{ fontSize: 13, letterSpacing: '0.14em', opacity: 0.78 }}>{p.time}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 22, padding: '14px 18px', background: P.bg2, textAlign: 'center', fontStyle: 'italic', fontSize: 15, border: `0.5px solid ${P.ink}33` }}>
          До свадьбы — <span style={{ fontStyle: 'normal', fontSize: 26 }}>{cd.days}</span> <span style={{ opacity: 0.75 }}>дней</span>
        </div>
      </div>
    </>
  );
}

function LetterpressSpread3({ t, P, rsvp }) {
  return (
    <>
      <div style={{ padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
        <FleurOrnament color={P.ink} style={{ width: 56, opacity: 0.5, marginBottom: 20 }} />
        <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.6 }}>— Подробности —</div>
        <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', fontWeight: 400, fontStyle: 'italic', margin: '10px 0 24px', lineHeight: 1.1 }}>Для гостей</h2>
        <dl style={{ margin: 0 }}>
          {[
            ['Дресс-код', t.details.dressCode],
            ['Подарки', t.details.gift],
            ['Дети', t.details.kids],
            ['Трансфер', t.details.transfer],
          ].map(([label, val]) => (
            <React.Fragment key={label}>
              <dt style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginTop: 14 }}>{label}</dt>
              <dd style={{ margin: '4px 0 0', fontSize: 16, fontStyle: 'italic', lineHeight: 1.55 }}>{val}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
      <div style={{ padding: '56px 52px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <FleurOrnament color={P.ink} style={{ width: 56, opacity: 0.55, margin: '0 auto 16px' }} />
        <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.65 }}>— Ответ —</div>
        <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', fontStyle: 'italic', fontWeight: 400, margin: '12px 0 4px', lineHeight: 1.15 }}>
          Будем рады ответу<br />до {t.rsvpDeadline}
        </h2>
        <LetterpressRSVP rsvp={rsvp} t={t} />
        <div style={{ marginTop: 32, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>
          · Отпечатано · {t.city} · MMXXVI ·
        </div>
      </div>
    </>
  );
}

function FleurOrnament({ style, color }) {
  const c = color || '#3a2a1a';
  return (
    <svg viewBox="0 0 100 40" style={style}>
      <g stroke={c} fill="none" strokeWidth="0.7">
        <path d="M50 20 Q30 5, 10 20 Q30 35, 50 20 Q70 5, 90 20 Q70 35, 50 20" />
        <circle cx="50" cy="20" r="2" fill={c} />
        <line x1="50" y1="4" x2="50" y2="10" />
        <line x1="50" y1="30" x2="50" y2="36" />
      </g>
    </svg>
  );
}

function LetterpressRSVP({ rsvp, t }) {
  const P = t.palette;
  if (rsvp.sent) return <div style={{ marginTop: 28, fontStyle: 'italic', fontSize: 22 }}>Благодарим, {rsvp.state.name}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${P.ink}`, color: P.ink, fontSize: 20, fontStyle: 'italic', padding: '8px 0', outline: 'none', textAlign: 'center', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {[['yes', 'С удовольствием'], ['no', 'К сожалению, нет']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 12, background: rsvp.state.attending === v ? P.ink : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.ink}`, cursor: 'pointer', fontFamily: 'inherit', fontStyle: 'italic', fontSize: 15 }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ padding: 13, background: P.accent, color: P.ink, border: 0, fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 6, fontWeight: 600 }}>Отправить ответ</button>
    </form>
  );
}

Object.assign(browserGlobal, { TemplateLetterpress });


// ===== src/template-wabisabi.jsx =====
// 07 · Wabi-sabi — lots of white, asymmetric placements, ink-brush, Japanese hint

function TemplateWabiSabi() {
  const t = TEMPLATES.find((x) => x.slug === 'wabisabi');
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const [scrollY, setScrollY] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false; });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, []);

  const heroY = scrollY * -0.35;

  return (
    <div style={{
      background: P.bg, color: P.ink,
      fontFamily: "'Noto Serif JP', 'Cormorant Garamond', serif",
      minHeight: '100vh', position: 'relative', overflowX: 'hidden',
    }}>
      <DemoBar t={t} />

      {/* Fixed parallax backdrop — drifting sakura glow */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 50% 40% at ${20 + Math.sin(scrollY * 0.002) * 20}% ${30 + Math.cos(scrollY * 0.0015) * 20}%, rgba(216,90,59,0.08), transparent 55%), radial-gradient(ellipse 40% 30% at 75% 80%, rgba(216,90,59,0.05), transparent 55%)`,
        transition: 'background 100ms linear',
      }} />

      {/* HERO — giant 雲 ink-wash + couple */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 32px 80px', zIndex: 1 }}>
        <AssetImage
          src="/assets/images/wabisabi-ink-washi-bg.webp"
          alt=""
          ratio="auto"
          sizes="100vw"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', aspectRatio: 'auto', opacity: 0.45 }}
          imgStyle={{ filter: 'saturate(0.75)' }}
        />
        <BrushChar char="雲" color={P.ink} style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, calc(-50% + ${heroY}px))`,
          width: 'min(72vh, 72vw)', opacity: mounted ? 0.1 : 0,
          transition: 'opacity 2600ms ease 200ms',
          willChange: 'transform, opacity',
        }} />
        <div style={{ position: 'relative', textAlign: 'center', zIndex: 2,
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1800ms ease 400ms, transform 1800ms cubic-bezier(0.2, 0.8, 0.2, 1) 400ms' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.55em', textTransform: 'uppercase', opacity: 0.55, fontFamily: "'JetBrains Mono', monospace" }}>雲 · облако · cloud</div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(48px, 8vw, 120px)',
            fontStyle: 'italic', fontWeight: 300,
            lineHeight: 1.05, letterSpacing: '0.04em',
            margin: '36px 0 12px',
          }}>
            {a}<br />
            <span style={{ color: P.accent, fontSize: 'clamp(20px, 3vw, 34px)', letterSpacing: '0.4em', opacity: 0.85, display: 'inline-block', margin: '10px 0' }}>—</span><br />
            {b}
          </h1>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: '0.32em', marginTop: 28, opacity: 0.7 }}>
            {t.dateMono} · {t.city}
          </div>
        </div>
        {/* scroll hint fades as you scroll */}
        <div style={{ position: 'absolute', bottom: 48, left: '50%',
          transform: `translateX(-50%) translateY(${Math.min(scrollY * 0.6, 60)}px)`,
          fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase',
          opacity: Math.max(0, 0.55 - scrollY * 0.003),
          fontFamily: "'JetBrains Mono', monospace",
        }}>↓ история</div>
      </section>

      {/* ACT 0 — poem/quote with parallax-drifting kanji */}
      <section style={{ padding: '30vh 32px', maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <BrushChar char="一" color={P.accent} style={{
          position: 'absolute', top: '8%', left: '4%', width: 170,
          opacity: 0.25,
          transform: `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.01}deg)`,
        }} />
        <WabiReveal>
          <blockquote style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(22px, 3vw, 34px)',
            fontStyle: 'italic', fontWeight: 300,
            lineHeight: 1.7, paddingLeft: '16%', margin: 0,
          }}>
            «{t.quote.text}»
            <footer style={{ marginTop: 22, fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', opacity: 0.55, fontStyle: 'normal', fontFamily: "'JetBrains Mono', monospace" }}>— {t.quote.author}</footer>
          </blockquote>
        </WabiReveal>
      </section>

      {/* ACT 1 — story chapters, alternating sides */}
      <section style={{ padding: '10vh 32px 20vh', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <WabiReveal>
          <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 'clamp(44px, 8vw, 92px)', fontWeight: 300, marginBottom: 56, paddingLeft: '8%' }}>
            物 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', opacity: 0.55, marginLeft: 12 }}>— история</span>
          </div>
        </WabiReveal>
        {t.story.map((s, i) => (
          <WabiStoryBlock key={i} story={s} index={i} P={P} total={t.story.length} />
        ))}
      </section>

      {/* ACT 2 — program, staggered indent */}
      <section style={{ padding: '18vh 32px 20vh', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <BrushChar char="式" color={P.ink} style={{
          position: 'absolute', top: '8%', right: '-4%', width: 380,
          opacity: 0.08,
          transform: `translateY(${(scrollY - 1800) * 0.12}px)`,
        }} />
        <WabiReveal>
          <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 'clamp(44px, 8vw, 92px)', fontWeight: 300, marginBottom: 48, textAlign: 'right', paddingRight: '6%' }}>
            式 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', opacity: 0.55 }}>— программа</span>
          </div>
        </WabiReveal>
        <div>
          {t.program.map((p, i) => (
            <WabiReveal key={i} delay={i * 140}>
              <div className="wabi-program-row" style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr',
                gap: 40, padding: '26px 0',
                borderBottom: i < t.program.length - 1 ? `1px solid ${P.ink}22` : 0,
                paddingLeft: `${4 + i * 6}%`,
                alignItems: 'baseline',
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.22em', opacity: 0.6 }}>{p.time}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px, 2.4vw, 28px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.25 }}>{p.title}</div>
                <div style={{ fontSize: 14, opacity: 0.65, lineHeight: 1.5 }}>{p.place}</div>
              </div>
            </WabiReveal>
          ))}
        </div>
      </section>

      {/* Countdown — 時 */}
      <section style={{ padding: '15vh 32px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <BrushChar char="時" color={P.accent} style={{
          position: 'absolute', top: '5%', left: '50%', width: 280,
          opacity: 0.14,
          transform: `translate(-50%, ${(scrollY - 2800) * -0.1}px)`,
        }} />
        <WabiReveal>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(96px, 14vw, 180px)', fontWeight: 300, lineHeight: 1, fontStyle: 'italic', position: 'relative' }}>{cd.days}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', marginTop: 10, opacity: 0.7 }}>дней до встречи</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', marginTop: 18, opacity: 0.5 }}>{cd.hours}h · {cd.minutes}m · {cd.seconds}s</div>
        </WabiReveal>
      </section>

      {/* ACT 3 — details */}
      <section style={{ padding: '15vh 32px', maxWidth: 800, margin: '0 auto', zIndex: 1, position: 'relative' }}>
        <WabiReveal>
          <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300, marginBottom: 32 }}>
            細 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: 'italic', opacity: 0.55, marginLeft: 10 }}>— детали</span>
          </div>
        </WabiReveal>
        <WabiReveal delay={200}>
          <dl className="grid-2-mobile-1" style={{ margin: 0, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '22px 40px' }}>
            {[
              ['Дресс-код', t.details.dressCode],
              ['Подарки', t.details.gift],
              ['Дети', t.details.kids],
              ['Трансфер', t.details.transfer],
            ].map(([label, val]) => (
              <React.Fragment key={label}>
                <dt style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', opacity: 0.55, paddingTop: 5 }}>{label}</dt>
                <dd style={{ margin: 0, fontSize: 17, fontStyle: 'italic', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.55 }}>{val}</dd>
              </React.Fragment>
            ))}
          </dl>
        </WabiReveal>
      </section>

      {/* RSVP — 返 */}
      <section style={{ padding: '20vh 32px', maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <BrushChar char="返" color={P.ink} style={{
          position: 'absolute', top: 0, right: '-6%', width: 220, opacity: 0.08,
          transform: `translateY(${(scrollY - 4200) * -0.08}px)`,
        }} />
        <WabiReveal>
          <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 300 }}>
            返 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', opacity: 0.55, marginLeft: 10 }}>— ответ</span>
          </div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, marginTop: 14, opacity: 0.75 }}>до {t.rsvpDeadline}</p>
          <WabiRSVP rsvp={rsvp} t={t} />
        </WabiReveal>
      </section>

      <footer style={{ padding: '40px 32px', display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.22em', opacity: 0.5, flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1 }}>
        <span>{a.toUpperCase()} · {b.toUpperCase()}</span>
        <span>{t.city} · {t.dateMono}</span>
      </footer>
    </div>
  );
}

// Intersection-based slow reveal
function WabiReveal({ children, delay = 0 }) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); obs.disconnect(); }
    }, { threshold: 0.18 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0)' : 'translateY(26px)',
      transition: `opacity 1600ms ease ${delay}ms, transform 1600ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
      willChange: 'transform, opacity',
    }}>{children}</div>
  );
}

function WabiStoryBlock({ story, index, P }) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.24 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const isEven = index % 2 === 0;
  const chars = ['花', '月', '風', '水', '心'];
  return (
    <div ref={ref} className="grid-2-mobile-1" style={{
      marginBottom: '16vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 1800ms ease, transform 1800ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    }}>
      <div style={{ order: isEven ? 1 : 2, paddingLeft: isEven ? '8%' : 0 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.32em', opacity: 0.55, marginBottom: 10 }}>章 {String(index + 1).padStart(2, '0')}</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 44px)', fontStyle: 'italic', fontWeight: 300, margin: '0 0 18px', lineHeight: 1.15 }}>{story.heading}</h3>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, lineHeight: 1.75, margin: 0, opacity: 0.88 }}>{story.body}</p>
      </div>
      <div style={{ order: isEven ? 2 : 1, display: 'flex', alignItems: 'center', justifyContent: isEven ? 'center' : 'flex-start', paddingRight: isEven ? 0 : '8%' }}>
        <BrushChar char={chars[index] || '心'} color={P.accent} style={{
          width: 'min(60%, 240px)',
          opacity: inView ? 0.78 : 0,
          transform: inView ? 'scale(1) rotate(0deg)' : 'scale(0.92) rotate(-4deg)',
          transition: 'opacity 2400ms ease 400ms, transform 2400ms cubic-bezier(0.2, 0.8, 0.2, 1) 400ms',
        }} />
      </div>
    </div>
  );
}

// Large brush-painted CJK character
function BrushChar({ char, color, style }) {
  return (
    <div style={style}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <text x="50" y="82" textAnchor="middle" fontSize="92"
          fontFamily="'Noto Serif JP', 'Yu Mincho', serif"
          fontWeight="300"
          fill={color}>{char}</text>
      </svg>
    </div>
  );
}

function WabiRSVP({ rsvp, t }) {
  const P = t.palette;
  if (rsvp.sent) return <div style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 24, color: P.accent }}>ありがとう, {rsvp.state.name}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 22 }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${P.ink}`, color: P.ink, fontSize: 26, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', padding: '10px 0', outline: 'none' }} />
      <div style={{ display: 'flex', gap: 18, marginTop: 6, flexWrap: 'wrap' }}>
        {[['yes', '出席 · буду'], ['no', '欠席 · не смогу']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: '1 1 180px', padding: 18, background: rsvp.state.attending === v ? P.ink : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.ink}`, cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: 'italic' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 10, padding: 16, background: P.accent, color: P.bg, border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', cursor: 'pointer' }}>送信 · отправить</button>
    </form>
  );
}

Object.assign(browserGlobal, { TemplateWabiSabi });


// ===== src/template-polaroid.jsx =====
// 08 · Polaroid — rotated photo cards, tape, handwritten Caveat, scrapbook

function TemplatePolaroid() {
  const t = TEMPLATES.find((x) => x.slug === 'polaroid');
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const [progress, setProgress] = React.useState(0);
  const timelineRef = React.useRef(null);

  // Scroll progress along the timeline spine
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (timelineRef.current) {
          const r = timelineRef.current.getBoundingClientRect();
          const vh = window.innerHeight;
          const total = r.height + vh * 0.6;
          const passed = Math.min(Math.max(vh * 0.5 - r.top, 0), total);
          setProgress(Math.min(1, passed / total));
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const variants = ['stripes', 'dots', 'cross', 'grid'];
  const tilts = [-3, 4, -5, 3, -2, 5];
  const labels = ['first frame', 'golden hour', 'vows', 'table 01', 'dance floor', 'the last roll'];
  const images = [
    '/assets/images/polaroid-montenegro-coast.webp',
    '/assets/images/polaroid-dive.webp',
    '/assets/images/polaroid-proposal-night.webp',
    '/assets/images/polaroid-engagement-party.webp',
    '/assets/images/polaroid-sveti-stefan-sunset.webp',
    '/assets/images/polaroid-beach-dinner.webp',
  ];

  return (
    <div style={{
      background: P.bg, color: P.ink,
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh', overflowX: 'hidden', position: 'relative',
    }}>
      <DemoBar t={t} />

      {/* Film-strip masthead */}
      <div style={{
        borderBottom: `1px solid ${P.ink}22`,
        background: P.ink, color: P.bg,
        padding: '68px 24px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
        gap: 16, flexWrap: 'wrap',
      }}>
        <span>Super-8 · reel 01</span>
        <span>{t.dateMono} · {t.city}</span>
        <span>● REC</span>
      </div>

      {/* Hero */}
      <section style={{ padding: '80px 28px 60px', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.35em', opacity: 0.55 }}>— a super-8 reel of one day —</div>
        <h1 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 'clamp(72px, 13vw, 180px)',
          fontWeight: 500, lineHeight: 0.95,
          margin: '24px 0 6px',
        }}>{a} <span style={{ opacity: 0.5 }}>+</span> {b}</h1>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(22px, 3vw, 36px)', opacity: 0.7 }}>{t.dateLong} · {t.venue}</div>

        {/* 3 scattered polaroids at top */}
        <div style={{ position: 'relative', height: 60, marginTop: 40 }}>
          <PolaroidCard rotate={-8} top={-10} left="6%" size={140} label="2019, сначала" src="/assets/images/polaroid-montenegro-coast.webp" />
          <PolaroidCard rotate={6} top={-20} right="8%" size={150} label="наш кот знает" src="/assets/images/polaroid-dive.webp" tape />
          <PolaroidCard rotate={-3} top={10} left="44%" size={130} label="лето, везде" src="/assets/images/polaroid-proposal-night.webp" />
        </div>
      </section>

      {/* Story strip */}
      <section style={{ padding: '140px 28px 60px', maxWidth: 900, margin: '0 auto' }}>
        <div className="grid-2-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ position: 'relative', minHeight: 320 }}>
            <PolaroidCard rotate={-4} top={0} left={20} size={260} label="как всё началось" src="/assets/images/polaroid-beach-dinner.webp" tape relative />
          </div>
          <div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(44px, 6vw, 68px)', lineHeight: 1, color: P.ink2 }}>{t.story[0].heading}</div>
            <p style={{ fontSize: 16, lineHeight: 1.75, marginTop: 18 }}>{t.story[0].body}</p>
            <div style={{ marginTop: 20, padding: '14px 16px', background: P.accent, fontFamily: "'Caveat', cursive", fontSize: 22, transform: 'rotate(-0.5deg)', display: 'inline-block' }}>
              {t.story[1].heading}: {t.story[1].body}
            </div>
          </div>
        </div>
      </section>

      {/* Countdown card */}
      <section style={{ padding: '20px 28px 80px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 36, color: P.ink2 }}>до последнего кадра осталось</div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[['дней', cd.days, -3], ['часов', cd.hours, 2], ['минут', cd.minutes, -2]].map(([l, v, rot]) => (
            <div key={l} style={{ background: P.paper, padding: '18px 28px', boxShadow: '0 8px 20px rgba(0,0,0,0.09)', transform: `rotate(${rot}deg)`, minWidth: 110, border: `1px solid ${P.ink}15` }}>
              <div style={{ fontSize: 64, fontFamily: "'Caveat', cursive", lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', opacity: 0.6, marginTop: 4, textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE — vertical spine with alternating polaroid cards */}
      <section style={{ padding: '60px 28px 80px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.4em', opacity: 0.55, textTransform: 'uppercase' }}>— the reel of the day —</div>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(54px, 8vw, 88px)', margin: '8px 0 0', lineHeight: 1 }}>Программа</h2>
        </div>

        <div ref={timelineRef} className="poly-timeline" style={{ maxWidth: 980, margin: '0 auto', position: 'relative', paddingBottom: 40 }}>
          {/* Spine (desktop) */}
          <div aria-hidden="true" className="poly-spine" style={{
            position: 'absolute', top: 0, bottom: 0, left: '50%', width: 3, transform: 'translateX(-50%)',
            background: `repeating-linear-gradient(to bottom, ${P.ink} 0, ${P.ink} 6px, transparent 6px, transparent 12px)`,
            opacity: 0.35,
          }} />
          {/* Scroll progress on spine */}
          <div aria-hidden="true" className="poly-spine-fill" style={{
            position: 'absolute', top: 0, left: '50%', width: 3, transform: 'translateX(-50%)',
            height: `${progress * 100}%`,
            background: P.ink2, transition: 'height 80ms linear',
          }} />

          {t.program.map((p, i) => (
            <PolyTimelineRow key={i} p={p} i={i} total={t.program.length} P={P}
              variant={variants[i % variants.length]}
              tilt={tilts[i % tilts.length]}
              label={labels[i] || `scene ${i + 1}`}
              src={images[i % images.length]} />
          ))}
        </div>
      </section>

      {/* Details — sticker cluster */}
      <section style={{ padding: '80px 28px', maxWidth: 880, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(46px, 6vw, 64px)', margin: 0, lineHeight: 1 }}>для гостей</h2>
        </div>
        <div className="grid-2-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {[
            ['Dress code', t.details.dressCode, -2, P.accent],
            ['Подарки', t.details.gift, 1.5, P.paper],
            ['Дети', t.details.kids, -1.5, P.paper],
            ['Трансфер', t.details.transfer, 2, P.accent],
          ].map(([label, val, rot, bg]) => (
            <div key={label} style={{ background: bg, padding: '20px 22px', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', transform: `rotate(${rot}deg)`, border: `1px solid ${P.ink}15` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.65, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 26, marginTop: 4, lineHeight: 1.25 }}>{val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '100px 28px 80px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(64px, 10vw, 130px)', lineHeight: 1 }}>скажи «да» :)</div>
        <p style={{ fontFamily: "'Caveat', cursive", fontSize: 24, opacity: 0.7, marginTop: 6 }}>до {t.rsvpDeadline} · потом поздно ловить трансфер</p>
        <PolaroidRSVP rsvp={rsvp} t={t} />
      </section>

      <footer style={{ padding: '40px 28px', textAlign: 'center', fontFamily: "'Caveat', cursive", fontSize: 24, opacity: 0.6, borderTop: `1px dashed ${P.ink}33` }}>
        с любовью · {a} + {b} · {t.city}
      </footer>
    </div>
  );
}

function PolyTimelineRow({ p, i, total, P, variant, tilt, label, src }) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } }, { threshold: 0.22 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const isLeft = i % 2 === 0;
  return (
    <div ref={ref} className="poly-row" style={{
      display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 12,
      alignItems: 'center', minHeight: 240,
      marginBottom: i === total - 1 ? 0 : 48,
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 900ms ease ${i * 80}ms, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 80}ms`,
    }}>
      {/* Left side */}
      <div className="poly-side-left" style={{ justifySelf: 'end', maxWidth: 360, textAlign: 'right' }}>
        {isLeft ? (
          <div style={{ display: 'inline-block', textAlign: 'left' }}>
            <PolaroidCard rotate={tilt} size={220} label={label} variant={variant} src={src} relative tape={i === 0} />
          </div>
        ) : (
          <div style={{ padding: '8px 4px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.3em', opacity: 0.65 }}>{p.time}</div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(30px, 3.4vw, 42px)', margin: '4px 0 4px', lineHeight: 1.1 }}>{p.title}</div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>{p.place}</div>
            {p.note && <div style={{ marginTop: 8, display: 'inline-block', padding: '4px 10px', background: P.accent, fontFamily: "'Caveat', cursive", fontSize: 18, transform: `rotate(${tilt * -0.5}deg)` }}>{p.note}</div>}
          </div>
        )}
      </div>

      {/* Spine marker */}
      <div className="poly-dot" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: P.bg, border: `2px solid ${P.ink}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.05em',
          position: 'relative', zIndex: 2,
        }}>{String(i + 1).padStart(2, '0')}</div>
      </div>

      {/* Right side */}
      <div className="poly-side-right" style={{ maxWidth: 360 }}>
        {isLeft ? (
          <div style={{ padding: '8px 4px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.3em', opacity: 0.65 }}>{p.time}</div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(30px, 3.4vw, 42px)', margin: '4px 0 4px', lineHeight: 1.1 }}>{p.title}</div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>{p.place}</div>
            {p.note && <div style={{ marginTop: 8, display: 'inline-block', padding: '4px 10px', background: P.accent, fontFamily: "'Caveat', cursive", fontSize: 18, transform: `rotate(${tilt * 0.5}deg)` }}>{p.note}</div>}
          </div>
        ) : (
          <PolaroidCard rotate={tilt} size={220} label={label} variant={variant} src={src} relative tape={i === 1} />
        )}
      </div>
    </div>
  );
}

function PolaroidCard({ rotate = 0, top, left, right, bottom, size = 180, label, variant = 'stripes', src, tape = false, relative = false }) {
  return (
    <div style={{
      position: relative ? 'relative' : 'absolute', top, left, right, bottom,
      width: size, background: '#fff', padding: 10, paddingBottom: 32,
      boxShadow: '0 10px 28px rgba(0,0,0,0.15)', transform: `rotate(${rotate}deg)`,
      border: '1px solid rgba(42,36,24,0.08)',
    }}>
      {tape && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(-4deg)', width: 60, height: 18, background: 'rgba(200,180,140,0.55)', border: '1px solid rgba(160,140,100,0.3)' }} />}
      {src ? <AssetImage src={src} alt={label} ratio="1/1" /> : <Placeholder ratio="1/1" variant={variant} fg="#8a6a4a" bg="#e5dcc8" />}
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, textAlign: 'center', marginTop: 6, color: '#2a2418' }}>{label}</div>
    </div>
  );
}

function PolaroidRSVP({ rsvp, t }) {
  const P = t.palette;
  if (rsvp.sent) return <div style={{ marginTop: 40, fontFamily: "'Caveat', cursive", fontSize: 44 }}>ура! увидимся, {rsvp.state.name} ☺</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 32, maxWidth: 500, margin: '32px auto 0', display: 'flex', flexDirection: 'column', gap: 18, background: P.paper, padding: 28, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transform: 'rotate(-1deg)', border: `1px solid ${P.ink}15` }}>
      <input required placeholder="твоё имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: `1px dashed ${P.ink}55`, padding: '8px 0', fontFamily: "'Caveat', cursive", fontSize: 26, outline: 'none', color: P.ink }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['yes', 'приду!'], ['no', 'не смогу']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 13, background: rsvp.state.attending === v ? P.ink : P.bg, color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.ink}`, cursor: 'pointer', fontFamily: "'Caveat', cursive", fontSize: 22 }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ padding: 13, background: P.accent, color: P.ink, border: `1px solid ${P.ink}`, fontFamily: "'Caveat', cursive", fontSize: 26, cursor: 'pointer' }}>отправить →</button>
    </form>
  );
}

Object.assign(browserGlobal, { TemplatePolaroid });


// ===== src/template-artdeco.jsx =====
// 09 · Art Deco — Cinzel, geometric frames, gold on dark, symmetrical

function TemplateArtDeco() {
  const t = TEMPLATES.find((x) => x.slug === 'artdeco');
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const TABS = React.useMemo(() => [
    { id: 'deco-home', label: 'HOME', roman: 'I' },
    { id: 'deco-story', label: 'ИСТОРИЯ', roman: 'II' },
    { id: 'deco-program', label: 'ПРОГРАММА', roman: 'III' },
    { id: 'deco-details', label: 'ДЕТАЛИ', roman: 'IV' },
    { id: 'deco-rsvp', label: 'ОТВЕТ', roman: 'V' },
  ], []);
  const [active, setActive] = React.useState('deco-home');

  React.useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    TABS.forEach((tab) => { const el = document.getElementById(tab.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [TABS]);

  const goTo = (id) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="deco-shell" style={{
      background: P.bg, color: P.accent, fontFamily: "'Cinzel', serif",
      minHeight: '100vh',
      display: 'grid', gridTemplateColumns: '240px 1fr',
      backgroundImage: `linear-gradient(${P.bg}d9, ${P.bg}f2), url(/assets/images/artdeco-gold-geometric-bg.webp)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <DemoBar t={t} theme="dark" />

      {/* SIDE TABS */}
      <aside className="deco-tabs" style={{
        position: 'sticky', top: 0, height: '100vh',
        borderRight: `1px solid ${P.accent}33`,
        display: 'flex', flexDirection: 'column',
        padding: '80px 0 36px', background: P.bg, zIndex: 20,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32, padding: '0 20px' }}>
          <svg viewBox="0 0 60 60" style={{ width: 56, height: 56, margin: '0 auto', display: 'block' }} aria-hidden="true">
            <path d="M30 4 L56 30 L30 56 L4 30 Z" fill="none" stroke={P.accent} strokeWidth="1" />
            <path d="M30 14 L46 30 L30 46 L14 30 Z" fill="none" stroke={P.accent} strokeWidth="0.5" opacity="0.65" />
            <text x="30" y="34.5" textAnchor="middle" fontSize="11" fill={P.accent} fontFamily="Cinzel, serif" letterSpacing="0.1em">{t.coupleShort}</text>
          </svg>
          <div style={{ fontSize: 9, letterSpacing: '0.4em', marginTop: 12, opacity: 0.65 }}>PALAIS · MMXXVI</div>
        </div>

        <nav role="tablist" aria-label="Разделы приглашения" style={{ display: 'flex', flexDirection: 'column' }}>
          {TABS.map((tab, i) => (
            <button key={tab.id} role="tab" onClick={() => goTo(tab.id)}
              aria-current={active === tab.id}
              aria-selected={active === tab.id}
              style={{
                background: active === tab.id ? P.accent : 'transparent',
                color: active === tab.id ? P.bg : P.accent,
                border: 0, padding: '14px 22px',
                fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.35em',
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                borderTop: i === 0 ? `0.5px solid ${P.accent}22` : 0,
                borderBottom: `0.5px solid ${P.accent}22`,
                transition: 'all 240ms ease',
              }}>
              <span style={{ fontSize: 9, opacity: active === tab.id ? 0.85 : 0.55, minWidth: 14 }}>{tab.roman}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '0 16px', textAlign: 'center' }}>
          <DecoDivider color={P.accent} style={{ width: 160 }} />
          <div style={{ fontSize: 9, letterSpacing: '0.35em', marginTop: 14, opacity: 0.6 }}>{t.dateMono}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 12, marginTop: 4, opacity: 0.7 }}>{t.city}</div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="deco-main">
        {/* HOME */}
        <section id="deco-home" className="deco-section" style={{ padding: '60px 40px 80px', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%' }}>
            <DecoFrame color={P.accent}>
              <div className="deco-cover-inner" style={{ padding: '60px 28px', textAlign: 'center' }}>
                <DecoDivider color={P.accent} />
                <div style={{ fontSize: 11, letterSpacing: '0.5em', marginTop: 26, opacity: 0.8 }}>— THE CELEBRATION OF THE MARRIAGE —</div>
                <div style={{ fontSize: 10, letterSpacing: '0.5em', marginTop: 8, opacity: 0.55 }}>OF</div>
                <div style={{ fontSize: 'clamp(44px, 7.5vw, 112px)', marginTop: 30, letterSpacing: '0.14em', fontWeight: 400, lineHeight: 1.05 }}>
                  {a.toUpperCase()}
                </div>
                <div style={{ fontSize: 'clamp(20px, 2.4vw, 32px)', margin: '14px 0', letterSpacing: '0.4em', opacity: 0.7 }}>&amp;</div>
                <div style={{ fontSize: 'clamp(44px, 7.5vw, 112px)', letterSpacing: '0.14em', fontWeight: 400, lineHeight: 1.05 }}>
                  {b.toUpperCase()}
                </div>
                <DecoDivider color={P.accent} style={{ marginTop: 36 }} />
                <div style={{ fontSize: 13, letterSpacing: '0.4em', marginTop: 24 }}>{t.dateMono}</div>
                <div style={{ fontSize: 11, letterSpacing: '0.4em', marginTop: 8, opacity: 0.72 }}>{t.venue.toUpperCase()} · {t.city.toUpperCase()}</div>
              </div>
            </DecoFrame>

            {/* Countdown */}
            <div style={{ marginTop: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.5em', opacity: 0.6 }}>— UNTIL THE EVENING —</div>
              <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 'clamp(16px, 4vw, 56px)', flexWrap: 'wrap' }}>
                {[['DAYS', cd.days], ['HRS', cd.hours], ['MIN', cd.minutes], ['SEC', cd.seconds]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 'clamp(40px, 5.5vw, 80px)', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
                    <div style={{ fontSize: 9, letterSpacing: '0.4em', marginTop: 10, opacity: 0.55 }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section id="deco-story" className="deco-section" style={{ padding: '80px 40px', borderTop: `0.5px solid ${P.accent}33` }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <DecoHeading roman="II" label="ИСТОРИЯ" color={P.accent} />
            <div style={{ marginTop: 40 }}>
              {t.story.map((s, i) => (
                <div key={i} style={{ marginTop: i === 0 ? 0 : 28, paddingTop: i === 0 ? 0 : 22, borderTop: i === 0 ? 0 : `0.5px solid ${P.accent}22` }}>
                  <div style={{ fontSize: 11, letterSpacing: '0.4em', opacity: 0.65 }}>{String(i + 1).padStart(2, '0')} · {s.heading.toUpperCase()}</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, lineHeight: 1.65, marginTop: 10, fontWeight: 400 }}>{s.body}</p>
                </div>
              ))}
            </div>
            <blockquote style={{ marginTop: 44, paddingTop: 26, borderTop: `1px solid ${P.accent}44`, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(22px, 2.4vw, 28px)', textAlign: 'center', lineHeight: 1.5, margin: '44px 0 0' }}>
              «{t.quote.text}»
              <footer style={{ fontFamily: "'Cinzel', serif", fontStyle: 'normal', fontSize: 10, letterSpacing: '0.4em', marginTop: 18, opacity: 0.6 }}>— {t.quote.author}</footer>
            </blockquote>
          </div>
        </section>

        {/* PROGRAM */}
        <section id="deco-program" className="deco-section" style={{ padding: '80px 40px', background: P.bg2, borderTop: `0.5px solid ${P.accent}33` }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <DecoHeading roman="III" label="ПРОГРАММА" color={P.accent} />
            <div style={{ marginTop: 40 }}>
              {t.program.map((p, i) => {
                const roman = ['I', 'II', 'III', 'IV', 'V', 'VI'][i] || String(i + 1);
                return (
                  <div key={i} className="deco-row" style={{
                    display: 'grid', gridTemplateColumns: '60px 80px 1fr 1fr', gap: 18,
                    padding: '22px 0', borderTop: `1px solid ${P.accent}33`,
                    alignItems: 'baseline',
                  }}>
                    <div style={{ fontSize: 18, letterSpacing: '0.1em', opacity: 0.65 }}>{roman}</div>
                    <div style={{ fontSize: 12, letterSpacing: '0.2em' }}>{p.time}</div>
                    <div style={{ fontSize: 'clamp(17px, 1.9vw, 21px)', letterSpacing: '0.18em' }}>{p.title.toUpperCase()}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 15, textAlign: 'right', opacity: 0.72 }}>{p.place}</div>
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${P.accent}33`, height: 1 }} />
            </div>
          </div>
        </section>

        {/* DETAILS */}
        <section id="deco-details" className="deco-section" style={{ padding: '80px 40px', borderTop: `0.5px solid ${P.accent}33` }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <DecoHeading roman="IV" label="ДЕТАЛИ" color={P.accent} />
            <dl className="grid-2-mobile-1" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px 36px', padding: '28px 0', borderTop: `1px solid ${P.accent}33`, borderBottom: `1px solid ${P.accent}33` }}>
              {[
                ['DRESS CODE', t.details.dressCode],
                ['ПОДАРКИ', t.details.gift],
                ['ДЕТИ', t.details.kids],
                ['ТРАНСФЕР', t.details.transfer],
              ].map(([label, val]) => (
                <div key={label}>
                  <dt style={{ fontSize: 10, letterSpacing: '0.4em', opacity: 0.7 }}>{label}</dt>
                  <dd style={{ margin: '10px 0 0', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 19, lineHeight: 1.4 }}>{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* RSVP */}
        <section id="deco-rsvp" className="deco-section" style={{ padding: '80px 40px 120px', background: P.bg2, borderTop: `0.5px solid ${P.accent}33` }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <DecoFrame color={P.accent}>
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.5em', opacity: 0.7 }}>— R · S · V · P —</div>
                <div style={{ fontSize: 'clamp(30px, 4vw, 48px)', letterSpacing: '0.18em', marginTop: 18 }}>THE FAVOUR</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 18, marginTop: 8, opacity: 0.85 }}>of your reply by {t.rsvpDeadline}</div>
                <ArtDecoRSVP rsvp={rsvp} t={t} />
              </div>
            </DecoFrame>
          </div>
        </section>

        <footer style={{ padding: 40, textAlign: 'center', fontSize: 10, letterSpacing: '0.5em', opacity: 0.5, borderTop: `0.5px solid ${P.accent}33` }}>
          {t.coupleShort} · MMXXVI · {t.city.toUpperCase()}
        </footer>
      </main>
    </div>
  );
}

function DecoHeading({ roman, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.5em', opacity: 0.6 }}>— {roman} —</div>
      <div style={{ fontSize: 'clamp(32px, 4.4vw, 52px)', letterSpacing: '0.22em', marginTop: 12 }}>{label}</div>
      <DecoDivider color={color} style={{ marginTop: 18 }} />
    </div>
  );
}

function DecoFrame({ children, padding, color }) {
  const c = color || '#b8975a';
  return (
    <div style={{ position: 'relative', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 24, border: `1px solid ${c}`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 32, border: `0.5px solid ${c}88`, pointerEvents: 'none' }} />
      {/* corner diamonds */}
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([rx, ry], i) => {
        const pos = {};
        if (rx === 0) pos.left = 24; else pos.right = 24;
        if (ry === 0) pos.top = 24; else pos.bottom = 24;
        return (
          <svg key={i} viewBox="0 0 20 20" style={{ position: 'absolute', ...pos, width: 20, height: 20, transform: 'translate(-50%, -50%)' }} aria-hidden="true">
            <path d="M10 0 L14 10 L10 20 L6 10 Z" fill={c} />
          </svg>
        );
      })}
      <div style={{ padding: padding || 0 }}>{children}</div>
    </div>
  );
}

function DecoDivider({ style, color }) {
  const c = color || '#b8975a';
  return (
    <svg viewBox="0 0 200 20" style={{ width: 240, display: 'block', margin: '0 auto', ...style }} aria-hidden="true">
      <line x1="10" y1="10" x2="80" y2="10" stroke={c} strokeWidth="0.5" />
      <line x1="120" y1="10" x2="190" y2="10" stroke={c} strokeWidth="0.5" />
      <path d="M100 2 L108 10 L100 18 L92 10 Z" fill="none" stroke={c} strokeWidth="0.8" />
      <circle cx="100" cy="10" r="1.5" fill={c} />
    </svg>
  );
}

function ArtDecoRSVP({ rsvp, t }) {
  const P = t.palette;
  if (rsvp.sent) return <div style={{ marginTop: 28, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20 }}>Thank you, {rsvp.state.name}. We await you.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input required placeholder="NAME" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${P.accent}`, color: P.accent, fontSize: 16, padding: '10px 0', outline: 'none', textAlign: 'center', fontFamily: 'inherit', letterSpacing: '0.3em' }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['yes', 'ACCEPT'], ['no', 'DECLINE']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 14, background: rsvp.state.attending === v ? P.accent : 'transparent', color: rsvp.state.attending === v ? P.bg : P.accent, border: `1px solid ${P.accent}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.32em' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 10, padding: 13, background: 'transparent', color: P.accent, border: `1px solid ${P.accent}`, fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.35em', cursor: 'pointer' }}>CONFIRM ♦</button>
    </form>
  );
}

Object.assign(browserGlobal, { TemplateArtDeco });


// ===== src/template-bauhaus.jsx =====
// 10 · Struk — Bauhaus/Constructivist: vertical colored blocks, left sidebar nav

function TemplateBauhaus() {
  const t = TEMPLATES.find((x) => x.slug === 'bauhaus');
  return <div style={{ padding: 80, fontFamily: 'sans-serif', fontSize: 24 }}>BAUHAUS: {t ? t.name : 'NOT FOUND'}</div>;
}

function BauhausRSVP() { return null; }
Object.assign(browserGlobal, { TemplateBauhaus });


// ===== src/template-celestial.jsx =====
// 11 · Solstice — Dark snap-scroll with SVG constellations and gold accents

const STARS = [[8,12],[15,28],[22,8],[35,42],[48,15],[52,68],[61,32],[70,10],[78,55],[85,22],[90,38],[28,72],[42,85],[68,78],[55,5],[5,60],[94,65],[38,18]];

function Constellation({ style }) {
  return (
    <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} aria-hidden="true">
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 1.2 : 0.7} fill="#c9a84c" opacity={i % 3 === 0 ? 0.9 : 0.4} />
      ))}
      {[[0,4],[4,7],[7,2],[2,10],[10,14],[14,8],[8,16]].map(([a, b], i) => (
        <line key={i} x1={STARS[a][0]} y1={STARS[a][1]} x2={STARS[b][0]} y2={STARS[b][1]} stroke="#c9a84c" strokeWidth="0.3" opacity="0.25" />
      ))}
    </svg>
  );
}

function MoonSVG({ color, size = 56 }) {
  return (
    <svg viewBox="0 0 56 56" style={{ width: size, height: size }} aria-hidden="true">
      <circle cx="28" cy="28" r="24" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M28 6 A22 22 0 1 0 28 50 A14 14 0 1 1 28 6Z" fill={color} />
    </svg>
  );
}

function TemplateCelestial() {
  const t = TEMPLATES.find((x) => x.slug === 'celestial');
  return <div style={{ padding: 80, fontFamily: 'sans-serif', fontSize: 24, background: '#060714', color: '#c9a84c' }}>CELESTIAL: {t ? t.name : 'NOT FOUND'}</div>;
}

function CelestialRSVP() { return null; }
Object.assign(browserGlobal, { TemplateCelestial });


// ===== src/template-mediterranean.jsx =====
// 12 · Riva — Mediterranean coastal: light airy cards, terracotta, arch motifs

function TemplateMediterranean() {
  const t = TEMPLATES.find((x) => x.slug === 'mediterranean');
  return <div style={{ padding: 80, fontFamily: 'sans-serif', fontSize: 24, background: '#fefcf7', color: '#c9622a' }}>MEDITERRANEAN: {t ? t.name : 'NOT FOUND'}</div>;
}

function RivaRSVP() { return null; }
Object.assign(browserGlobal, { TemplateMediterranean });


// ===== src/app.jsx =====
// Root app — routes

function App() {
  const route = useRoute();
  if (typeof window !== 'undefined') console.log('[App] route:', JSON.stringify(route));

  // /templates/[slug]
  if (route.startsWith('/templates/')) {
    const slug = route.slice('/templates/'.length);
    if (typeof window !== 'undefined') console.log('[App] slug:', JSON.stringify(slug));
    if (slug === 'editorial') return <TemplateEditorial />;
    if (slug === 'swiss') return <TemplateSwiss />;
    if (slug === 'garden') return <TemplateGarden />;
    if (slug === 'dark') return <TemplateDark />;
    if (slug === 'brutalist') return <TemplateBrutalist />;
    if (slug === 'letterpress') return <TemplateLetterpress />;
    if (slug === 'wabisabi') return <TemplateWabiSabi />;
    if (slug === 'polaroid') return <TemplatePolaroid />;
    if (slug === 'artdeco') return <TemplateArtDeco />;
    if (slug === 'bauhaus') return <TemplateBauhaus />;
    if (slug === 'celestial') return <TemplateCelestial />;
    if (slug === 'mediterranean') return <TemplateMediterranean />;
    return <NotFound />;
  }

  if (route === '/templates') return <TemplatesIndex />;
  if (route === '/contact') return <Contact />;
  if (route === '/' || route === '' || route.startsWith('/#')) return <Home />;
  return <NotFound />;
}

function NotFound() {
  return (
    <div>
      <TopNav />
      <section style={{ padding: '160px 40px', textAlign: 'center', minHeight: '60vh' }}>
        <div className="serif" style={{ fontSize: 160, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1 }}>404</div>
        <p style={{ marginTop: 20, fontSize: 18, color: 'var(--muted)' }}>Страница не найдена.</p>
        <div style={{ marginTop: 24 }}><Button to="/">← На главную</Button></div>
      </section>
      <Footer />
    </div>
  );
}

export default function WeddingApp() {
  return <App />;
}
