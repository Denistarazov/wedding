
// ===== src/shared.jsx =====
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


// ===== src/placeholders.jsx =====
// SVG placeholder generators — monochrome, subtle textures, always labeled when helpful

function Placeholder({ label, ratio = '4/5', variant = 'stripes', fg = '#8a7a5a', bg = '#ede4d0', style, ...rest }) {
  const pid = 'p' + Math.random().toString(36).slice(2, 8);
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
    <div style={{
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

Object.assign(window, { Placeholder, Portrait });


// ===== src/templates-data.jsx =====
// The 9 template descriptors — used by portfolio grid, /templates index, and demo router

const TEMPLATES = [
  {
    slug: 'editorial',
    name: 'Aurelia',
    style: 'Editorial Magazine',
    styleRu: 'Editorial',
    tagline: 'Vogue-inspired serif, монохромные фото на разлёт',
    couple: 'Алиса & Григорий',
    date: '14.09.2026',
    venue: 'Villa Erba, Como',
    accent: '#f5f1ea',
    ink: '#2a2418',
    previewBg: '#f5f1ea',
  },
  {
    slug: 'swiss',
    name: 'Grid-14',
    style: 'Minimal Swiss',
    styleRu: 'Swiss / минимал',
    tagline: 'Сетка 12 колонок, Helvetica, типографика первична',
    couple: 'Mira & Leo',
    date: '07.06.2026',
    venue: 'Zürich, CH',
    accent: '#ffffff',
    ink: '#111111',
    previewBg: '#ffffff',
  },
  {
    slug: 'garden',
    name: 'Verbena',
    style: 'Garden Botanical',
    styleRu: 'Ботанический',
    tagline: 'Акварельные флора-элементы, soft sage, ручные штрихи',
    couple: 'Ella & Matteo',
    date: '22.05.2026',
    venue: 'Tuscany villa, IT',
    accent: '#eef2e6',
    ink: '#2d3a26',
    previewBg: '#eef2e6',
  },
  {
    slug: 'dark',
    name: 'Noctis',
    style: 'Dark Luxe',
    styleRu: 'Dark luxe',
    tagline: 'Чёрный + золото, cinematic crop, late-night wedding',
    couple: 'Sofia & Max',
    date: '30.11.2026',
    venue: 'Palais, Paris',
    accent: '#d4b87a',
    ink: '#0d0b08',
    previewBg: '#0d0b08',
  },
  {
    slug: 'brutalist',
    name: 'Konkret',
    style: 'Brutalist Type',
    styleRu: 'Бруталист',
    tagline: 'Гигантские буквы, жёсткая сетка, никаких украшений',
    couple: 'IRA × JAN',
    date: '03/08/26',
    venue: 'Berlin Kreuzberg',
    accent: '#ff3b1f',
    ink: '#000000',
    previewBg: '#eae4d8',
  },
  {
    slug: 'letterpress',
    name: 'Maisonneuve',
    style: 'Vintage Letterpress',
    styleRu: 'Letterpress',
    tagline: 'Тиснение, старая бумага, классическая композиция',
    couple: 'Eleanor & Theodore',
    date: 'June XIV, MMXXVI',
    venue: 'Orléans, France',
    accent: '#c9a878',
    ink: '#3a2a1a',
    previewBg: '#ebe1cc',
  },
  {
    slug: 'wabisabi',
    name: 'Kumo',
    style: 'Japanese Wabi-Sabi',
    styleRu: 'Wabi-sabi',
    tagline: 'Тушь, пустота, асимметрия, Noto Serif JP',
    couple: 'Yuki & Ren',
    date: '2026.04.11',
    venue: 'Kyoto, 京都',
    accent: '#d85a3b',
    ink: '#1a1814',
    previewBg: '#f2ede4',
  },
  {
    slug: 'polaroid',
    name: 'Super-8',
    style: 'Polaroid / Film',
    styleRu: 'Polaroid',
    tagline: 'Рассыпанные поляроиды, скотч, ручной скрипт',
    couple: 'Dasha & Kirill',
    date: '18.07.2026',
    venue: 'Montenegro coast',
    accent: '#e8d4a8',
    ink: '#2a2418',
    previewBg: '#f0ebe0',
  },
  {
    slug: 'artdeco',
    name: 'Palais',
    style: 'Art Deco',
    styleRu: 'Art Deco',
    tagline: 'Geometric, Gatsby, metallic, Cinzel',
    couple: 'Vera & Nikolai',
    date: 'XII · XII · MMXXVI',
    venue: 'Monaco',
    accent: '#b8975a',
    ink: '#0f0f18',
    previewBg: '#0f0f18',
  },
];

Object.assign(window, { TEMPLATES });


// ===== src/home.jsx =====
// Home page

function Home() {
  return (
    <div>
      <TopNav />
      <Hero />
      <Value />
      <Portfolio />
      <Process />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section style={{ padding: '100px 40px 140px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative' }}>
        <Eyebrow number="(01)">Wedding website design · 2026</Eyebrow>

        <h1 className="serif" style={{
          fontSize: 'clamp(64px, 10vw, 164px)',
          lineHeight: 0.92, letterSpacing: '-0.035em',
          margin: '36px 0 0', fontWeight: 400,
          textWrap: 'balance',
        }}>
          Сайт-приглашение,<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>который гости</span><br/>
          дочитают до конца.
        </h1>

        <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'end' }}>
          <p style={{ fontSize: 20, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 560, margin: 0, textWrap: 'pretty' }}>
            9 готовых дизайнов и кастомные проекты под ключ.
            RSVP, программа, карта, история пары — всё, что нужно,
            собрано в одном сайте. Типографика, отступы, темп —
            как у студии, а не как у конструктора.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button to="/templates" size="lg">Смотреть 9 дизайнов →</Button>
            <Button to="/contact" variant="secondary" size="lg">Связаться</Button>
          </div>
        </div>

        {/* marquee-ish meta row */}
        <div style={{
          marginTop: 100, paddingTop: 28, borderTop: '1px solid var(--line)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)',
        }}>
          <HeroMeta k="Срок" v="от 5 дней" />
          <HeroMeta k="От" v="€ 290" />
          <HeroMeta k="Домен" v="ваш .wedding / .love" />
          <HeroMeta k="Языки" v="RU · EN · +1" />
        </div>
      </div>

      {/* decorative label in corner */}
      <div style={{
        position: 'absolute', top: 80, right: 40, fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: '0.25em', color: 'var(--muted)',
        writingMode: 'vertical-rl', textOrientation: 'mixed',
      }}>
        · Canvas Studio · Est. 2023 ·
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
    <section style={{ padding: '80px 40px', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start' }}>
          <div>
            <Eyebrow number="(02)">Что вы получаете</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em', margin: '24px 0 0', fontWeight: 400 }}>
              Два пути.<br/><span style={{ fontStyle: 'italic' }}>Один результат.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <ValueCard
              n="A"
              title="Готовый дизайн"
              price="€ 290 — 490"
              bullets={[
                '9 уникальных шаблонов',
                'Ваши фото, имена, даты',
                'RSVP + Google Sheets',
                'Свой домен',
                'Деплой за 5 дней',
              ]}
            />
            <ValueCard
              n="B"
              title="Кастомный проект"
              price="от € 1 200"
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
    <div style={{
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
      <Button to={highlight ? '/contact' : '/templates'} variant={highlight ? 'secondary' : 'primary'} style={highlight ? { borderColor: 'var(--bg)', color: 'var(--bg)' } : {}}>
        {highlight ? 'Запросить кастом' : 'Посмотреть дизайны'} →
      </Button>
    </div>
  );
}

function Portfolio() {
  const [hover, setHover] = useState(null);
  return (
    <section style={{ padding: '140px 40px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <Eyebrow number="(03)">Портфолио · 9 дизайнов</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 0', fontWeight: 400 }}>
              Девять разных<br/><span style={{ fontStyle: 'italic' }}>миров</span>.
            </h2>
          </div>
          <Link to="/templates" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: '1px solid currentColor', paddingBottom: 4 }}>
            Все с фильтрами →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {TEMPLATES.map((t, i) => (
            <TemplateCard key={t.slug} t={t} idx={i} hovered={hover === t.slug} onHover={() => setHover(t.slug)} onLeave={() => setHover(null)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TemplateCard({ t, idx, hovered, onHover, onLeave }) {
  return (
    <Link
      to={`/templates/${t.slug}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ display: 'block', cursor: 'pointer' }}
    >
      <div style={{
        position: 'relative', aspectRatio: '4/5', overflow: 'hidden',
        background: t.previewBg, transition: 'transform 0.5s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}>
        <TemplatePreview template={t} />
        <div style={{
          position: 'absolute', top: 16, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: t.slug === 'dark' || t.slug === 'artdeco' ? 'rgba(255,255,255,0.8)' : 'rgba(42,36,24,0.6)',
        }}>
          <span>№ 0{idx + 1}</span>
          <span>{t.styleRu}</span>
        </div>
      </div>
      <div style={{ padding: '18px 2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div className="serif" style={{ fontSize: 24, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{t.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{t.tagline}</div>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          opacity: hovered ? 1 : 0.4, transition: 'opacity 0.2s',
        }}>→</div>
      </div>
    </Link>
  );
}

// Mini preview card — each template gets a distinctive hand-drawn thumb.
function TemplatePreview({ template: t }) {
  const dark = t.slug === 'dark' || t.slug === 'artdeco';
  const fg = dark ? '#ffffff' : t.ink;

  const previews = {
    editorial: (
      <div style={{ padding: '18% 14%', color: fg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1, letterSpacing: '-0.03em' }}>Алиса<br/>& Григорий</div>
        <div style={{ width: 24, height: 1, background: fg, opacity: 0.5, margin: '18px 0' }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em' }}>14 · IX · MMXXVI</div>
      </div>
    ),
    swiss: (
      <div style={{ padding: 20, height: '100%', color: fg, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: 9 }}>
        <div style={{ gridColumn: '1 / 6', gridRow: '1 / 2', fontWeight: 500, fontSize: 10 }}>MIRA · LEO</div>
        <div style={{ gridColumn: '8 / 13', gridRow: '1 / 2', textAlign: 'right', opacity: 0.6 }}>07.06.26</div>
        <div style={{ gridColumn: '1 / 13', gridRow: '3 / 7', border: '1px solid ' + fg, opacity: 0.3 }} />
        <div style={{ gridColumn: '1 / 7', gridRow: '4 / 6', fontFamily: 'Inter', fontWeight: 300, fontSize: 22, letterSpacing: '-0.02em', alignSelf: 'center' }}>mira<br/>leo</div>
        <div style={{ gridColumn: '1 / 4', gridRow: '8 / 9', opacity: 0.7, fontSize: 8 }}>ZÜRICH / CH</div>
      </div>
    ),
    garden: (
      <div style={{ padding: '14% 10%', color: fg, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 10, left: 10, width: 50, opacity: 0.5 }}>
          <path d="M20 80 Q30 40, 50 30 Q70 40, 80 80" stroke={fg} fill="none" strokeWidth="0.6" />
          <circle cx="50" cy="30" r="5" fill="none" stroke={fg} strokeWidth="0.5" />
          <circle cx="35" cy="55" r="3.5" fill="none" stroke={fg} strokeWidth="0.5" />
          <circle cx="65" cy="55" r="3.5" fill="none" stroke={fg} strokeWidth="0.5" />
        </svg>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', bottom: 10, right: 10, width: 50, opacity: 0.5, transform: 'rotate(160deg)' }}>
          <path d="M20 80 Q30 40, 50 30 Q70 40, 80 80" stroke={fg} fill="none" strokeWidth="0.6" />
          <circle cx="50" cy="30" r="5" fill="none" stroke={fg} strokeWidth="0.5" />
        </svg>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4.5vw, 48px)', fontStyle: 'italic', fontWeight: 300, textAlign: 'center', lineHeight: 1 }}>Ella<br/>&<br/>Matteo</div>
      </div>
    ),
    dark: (
      <div style={{ padding: '14% 10%', color: '#d4b87a', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.35em', opacity: 0.7 }}>— 30.XI.26 —</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(28px, 5vw, 52px)', margin: '14px 0', letterSpacing: '0.02em', lineHeight: 1 }}>Sofia<br/>&<br/>Max</div>
        <div style={{ width: 30, height: 0.5, background: '#d4b87a', opacity: 0.5 }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.3em', marginTop: 14, opacity: 0.6 }}>PARIS · NOCTURNE</div>
      </div>
    ),
    brutalist: (
      <div style={{ padding: 16, color: '#000', background: '#eae4d8', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 0.85, letterSpacing: '-0.05em' }}>IRA<br/>×<br/>JAN</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
          <span>03/08/26</span>
          <span style={{ background: '#ff3b1f', color: '#fff', padding: '2px 6px' }}>BER</span>
        </div>
      </div>
    ),
    letterpress: (
      <div style={{ padding: '18% 14%', color: '#3a2a1a', height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(0deg, rgba(201,168,120,0.15), transparent), #ebe1cc' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', opacity: 0.7 }}>AT HOME</div>
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 400, margin: '14px 0 6px', lineHeight: 1.1 }}>
          Mr. Theodore<br/>&<br/>Ms. Eleanor
        </div>
        <div style={{ width: 40, height: 0.5, background: '#3a2a1a', opacity: 0.4, margin: '6px 0' }} />
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11 }}>June the Fourteenth</div>
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11 }}>MMXXVI</div>
      </div>
    ),
    wabisabi: (
      <div style={{ padding: 20, color: '#1a1814', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15%', left: '15%', fontFamily: "'Noto Serif JP', serif", fontSize: 28, fontWeight: 300 }}>結</div>
        <div style={{ position: 'absolute', top: '44%', left: '32%', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 300, letterSpacing: '0.1em' }}>Yuki — Ren</div>
        <div style={{ position: 'absolute', bottom: '18%', right: '16%', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textAlign: 'right' }}>2026.04.11<br/>京都</div>
        <div style={{ position: 'absolute', bottom: '30%', left: '18%', width: 40, height: 0.5, background: '#d85a3b' }} />
      </div>
    ),
    polaroid: (
      <div style={{ padding: 18, color: '#2a2418', height: '100%', background: '#f0ebe0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '14%', left: '10%', width: '44%', aspectRatio: '1', background: '#fff', padding: 6, paddingBottom: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)', transform: 'rotate(-6deg)' }}>
          <Placeholder ratio="1/1" variant="stripes" fg="#8a7a5a" bg="#e5dcc8" style={{ height: '100%' }} />
        </div>
        <div style={{ position: 'absolute', top: '34%', right: '8%', width: '40%', aspectRatio: '1', background: '#fff', padding: 6, paddingBottom: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)', transform: 'rotate(8deg)' }}>
          <Placeholder ratio="1/1" variant="dots" fg="#8a7a5a" bg="#e5dcc8" style={{ height: '100%' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', left: 0, right: 0, textAlign: 'center', fontFamily: "'Caveat', cursive", fontSize: 'clamp(28px, 4.5vw, 40px)' }}>Dasha & Kirill</div>
      </div>
    ),
    artdeco: (
      <div style={{ padding: 20, color: '#b8975a', background: '#0f0f18', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 14, width: 'calc(100% - 28px)', height: 'calc(100% - 28px)' }}>
          <rect x="4" y="4" width="92" height="92" fill="none" stroke="#b8975a" strokeWidth="0.4" />
          <path d="M50 6 L58 12 L50 18 L42 12 Z" fill="#b8975a" opacity="0.6" />
          <path d="M50 94 L58 88 L50 82 L42 88 Z" fill="#b8975a" opacity="0.6" />
        </svg>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px, 3.2vw, 28px)', letterSpacing: '0.2em', textAlign: 'center', lineHeight: 1.3 }}>VERA<br/><span style={{ fontSize: '0.7em', opacity: 0.7 }}>&</span><br/>NIKOLAI</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.4em', marginTop: 18 }}>XII · XII · MMXXVI</div>
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
    { n: '05', title: 'Деплой', body: 'Публикуем на своём домене (.wedding, .love) или на вашем. RSVP начинают сыпаться.' },
  ];
  return (
    <section id="process" style={{ padding: '140px 40px', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <Eyebrow number="(04)">Процесс</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 80px', fontWeight: 400 }}>
          Пять шагов <span style={{ fontStyle: 'italic' }}>до рассылки</span>.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ borderTop: '1px solid var(--ink)', paddingTop: 22, position: 'relative' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', color: 'var(--muted)' }}>STEP {s.n}</div>
              <div className="serif" style={{ fontSize: 28, fontWeight: 400, margin: '14px 0 12px', letterSpacing: '-0.01em' }}>{s.title}</div>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: 'Essential', price: '€ 290', desc: 'Любой из 9 шаблонов', bullets: ['Ваши фото и тексты', 'RSVP-форма', 'Поддомен canvas.wedding', 'Один язык', 'Доставка 5 дней'] },
    { name: 'Studio', price: '€ 490', desc: 'Шаблон + кастомизация', bullets: ['Всё из Essential', 'Свой домен', '2 языка', 'Индивидуальные цвета и шрифты', 'Карта + программа', 'Google Sheets RSVP'], popular: true },
    { name: 'Bespoke', price: 'от € 1 200', desc: 'Дизайн с нуля', bullets: ['Арт-директор + копирайтер', 'Анимации и сценарий прокрутки', 'Интеграции (CRM, платежи)', '3+ языка', 'Брендинг сопут. материалов', 'Срок 2–4 недели'] },
  ];
  return (
    <section id="pricing" style={{ padding: '140px 40px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 40, marginBottom: 60 }}>
          <div>
            <Eyebrow number="(05)">Цены</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 0', fontWeight: 400 }}>
              Прозрачно.<br/><span style={{ fontStyle: 'italic' }}>Без пакетов-сюрпризов</span>.
            </h2>
          </div>
          <p style={{ maxWidth: 380, color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Цены указаны за сайт. Хостинг, SSL и домен первого уровня — включены в первый год.
            Правки после публикации — 20 € / правка или подписка 9 € / мес.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
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
    <div style={{
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
        to={t.name === 'Bespoke' ? '/contact' : '/templates'}
        variant={pop ? 'secondary' : 'primary'}
        style={pop ? { borderColor: 'var(--bg)', color: 'var(--bg)' } : {}}
      >
        {t.name === 'Bespoke' ? 'Обсудить проект' : 'Выбрать шаблон'} →
      </Button>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: 'Сколько времени занимает весь процесс?', a: 'Готовый шаблон — 5 рабочих дней от получения контента. Кастомный проект — от 2 до 4 недель в зависимости от объёма.' },
    { q: 'Можно ли поменять шрифты и цвета в шаблоне?', a: 'Да, в тарифе Studio. В Essential — только ваши контент-поля. В Bespoke правим всё вплоть до сетки.' },
    { q: 'Как работает RSVP и куда приходят ответы?', a: 'По умолчанию — в Google Sheets, куда у вас есть полный доступ. По запросу можем подключить Notion, Airtable или вебхук.' },
    { q: 'Нужен ли свой домен?', a: 'Нет. В Essential мы даём красивый поддомен canvas.wedding/yournames. Начиная со Studio — любой ваш домен (покупаем и настраиваем при необходимости).' },
    { q: 'Что с мультиязычностью?', a: 'RU, EN — включены в Studio. Третий язык — +50 €. Bespoke — без ограничений.' },
    { q: 'Фотосессия нужна?', a: 'Не обязательна. У нас есть шаблоны, которые красиво работают без фото — только типографика и иллюстрации. Мы также работаем с вашим фотографом до или после свадьбы.' },
  ];
  return (
    <section id="faq" style={{ padding: '140px 40px', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Eyebrow number="(06)">Вопросы</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 60px', fontWeight: 400 }}>
          Часто <span style={{ fontStyle: 'italic' }}>спрашивают</span>.
        </h2>
        <div style={{ borderTop: '1px solid var(--ink)' }}>
          {items.map((it, i) => {
            const o = open === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                <button
                  onClick={() => setOpen(o ? -1 : i)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'transparent', border: 0, cursor: 'pointer',
                    padding: '28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontFamily: 'inherit', color: 'inherit',
                  }}
                >
                  <span className="serif" style={{ fontSize: 24, fontWeight: 400, letterSpacing: '-0.01em' }}>{it.q}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, transition: 'transform 0.25s', transform: o ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                <div style={{
                  maxHeight: o ? 200 : 0, opacity: o ? 1 : 0, overflow: 'hidden',
                  transition: 'max-height 0.35s ease, opacity 0.25s ease, padding 0.25s',
                  padding: o ? '0 0 28px 0' : '0',
                }}>
                  <p style={{ margin: 0, fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 720 }}>{it.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ padding: '140px 40px', background: 'var(--ink)', color: 'var(--bg)' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', textAlign: 'center' }}>
        <Eyebrow number="(07)" style={{ color: 'rgba(245,241,234,0.6)', justifyContent: 'center' }}>Готовы?</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(64px, 10vw, 180px)', lineHeight: 0.92, letterSpacing: '-0.04em', margin: '36px 0', fontWeight: 400, textWrap: 'balance' }}>
          Давайте соберём<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>ваш сайт.</span>
        </h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/templates" size="lg" variant="secondary" style={{ borderColor: 'var(--bg)', color: 'var(--bg)' }}>Выбрать дизайн</Button>
          <Button to="/contact" size="lg" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>Оставить заявку →</Button>
        </div>
        <p style={{ marginTop: 40, color: 'rgba(245,241,234,0.55)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          · Ответим за 2–3 часа в рабочее время ·
        </p>
      </div>
    </section>
  );
}

Object.assign(window, { Home, TemplatePreview });


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
      <section style={{ padding: '80px 40px 40px' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>
          <Eyebrow>Portfolio · 09 works</Eyebrow>
          <h1 className="serif" style={{
            fontSize: 'clamp(56px, 9vw, 148px)', lineHeight: 0.92, letterSpacing: '-0.035em',
            margin: '24px 0 0', fontWeight: 400,
          }}>
            Все <span style={{ fontStyle: 'italic' }}>дизайны</span>.
          </h1>
          <p style={{ marginTop: 28, maxWidth: 560, color: 'var(--ink-2)', fontSize: 18, lineHeight: 1.55 }}>
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
        background: 'rgba(245,241,234,0.85)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1360, margin: '0 auto', padding: '14px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginRight: 8 }}>Стиль</span>
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  background: filter === s ? 'var(--ink)' : 'transparent',
                  color: filter === s ? 'var(--bg)' : 'var(--ink)',
                  border: '1px solid ' + (filter === s ? 'var(--ink)' : 'var(--line)'),
                  borderRadius: 999, padding: '6px 14px',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {s === 'all' ? 'Все 09' : s}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['grid', 'list'].map((v) => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? 'var(--ink)' : 'transparent',
                color: view === v ? 'var(--bg)' : 'var(--ink)',
                border: '1px solid ' + (view === v ? 'var(--ink)' : 'var(--line)'),
                padding: '6px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              }}>{v === 'grid' ? '⊞ Сетка' : '≡ Список'}</button>
            ))}
          </div>
        </div>
      </div>

      <section style={{ padding: '60px 40px 0' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>
          {view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {filtered.map((t, i) => (
                <TemplateCardIndex key={t.slug} t={t} idx={TEMPLATES.indexOf(t)} />
              ))}
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {filtered.map((t, i) => (
                <TemplateRow key={t.slug} t={t} idx={TEMPLATES.indexOf(t)} />
              ))}
            </div>
          )}
          {filtered.length === 0 && (
            <p style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>Ничего не найдено. Сбросьте фильтр.</p>
          )}
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </div>
  );
}

function TemplateCardIndex({ t, idx }) {
  return (
    <Link to={`/templates/${t.slug}`} style={{ display: 'block' }}>
      <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: t.previewBg, transition: 'transform 0.4s' }}>
        <TemplatePreview template={t} />
        <div style={{
          position: 'absolute', top: 16, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: t.slug === 'dark' || t.slug === 'artdeco' ? 'rgba(255,255,255,0.8)' : 'rgba(42,36,24,0.6)',
        }}>
          <span>№ 0{idx + 1}</span>
          <span>{t.styleRu}</span>
        </div>
      </div>
      <div style={{ padding: '20px 2px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="serif" style={{ fontSize: 26, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{t.name}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em' }}>VIEW →</div>
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>{t.tagline}</div>
      </div>
    </Link>
  );
}

function TemplateRow({ t, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={`/templates/${t.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 120px 40px', gap: 20, alignItems: 'center',
        padding: '28px 0', borderBottom: '1px solid var(--line)', cursor: 'pointer',
        background: hov ? 'rgba(42,36,24,0.03)' : 'transparent', transition: 'background 0.2s',
        padding: '28px 12px',
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em' }}>№ 0{idx + 1}</div>
      <div className="serif" style={{ fontSize: 28, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{t.name}</div>
      <div style={{ fontSize: 14 }}>{t.styleRu}</div>
      <div style={{ fontSize: 14, color: 'var(--muted)' }}>{t.couple}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted)' }}>{t.date}</div>
      <div style={{ textAlign: 'right', fontSize: 18, opacity: hov ? 1 : 0.4, transform: hov ? 'translateX(4px)' : 'none', transition: 'all 0.25s' }}>→</div>
    </Link>
  );
}

Object.assign(window, { TemplatesIndex });


// ===== src/contact.jsx =====
// /contact page

function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', type: 'Готовый', message: '' });
  const [sent, setSent] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div>
        <TopNav />
        <section style={{ padding: '160px 40px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <Eyebrow style={{ justifyContent: 'center' }}>Заявка принята</Eyebrow>
            <h1 className="serif" style={{ fontSize: 'clamp(56px, 9vw, 148px)', lineHeight: 0.92, letterSpacing: '-0.035em', margin: '24px 0 0', fontWeight: 400 }}>
              <span style={{ fontStyle: 'italic' }}>Спасибо</span>,<br/>{form.name || 'гость'}.
            </h1>
            <p style={{ marginTop: 32, maxWidth: 540, margin: '32px auto 0', color: 'var(--ink-2)', fontSize: 18, lineHeight: 1.55 }}>
              Мы получили заявку и напишем на {form.contact || 'указанный контакт'} в ближайшие 2–3 часа.
            </p>
            <div style={{ marginTop: 40 }}>
              <Button to="/templates">← Вернуться к дизайнам</Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <TopNav />
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }}>
          <div>
            <Eyebrow>Связаться</Eyebrow>
            <h1 className="serif" style={{
              fontSize: 'clamp(56px, 8vw, 128px)', lineHeight: 0.92, letterSpacing: '-0.035em',
              margin: '24px 0 0', fontWeight: 400,
            }}>
              Напишите<br/><span style={{ fontStyle: 'italic' }}>нам</span>.
            </h1>
            <p style={{ marginTop: 32, color: 'var(--ink-2)', fontSize: 18, lineHeight: 1.55, maxWidth: 400 }}>
              Чем подробнее расскажете о свадьбе — тем лучше мы подберём формат. Или просто напишите «хочу сайт» — разберёмся вместе.
            </p>

            <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 28 }}>
              <ContactLine label="Email" v="hello@canvas.wedding" />
              <ContactLine label="Telegram" v="@canvas_wedding" />
              <ContactLine label="Часы" v="Пн–Сб · 10:00 — 20:00 GMT+4" />
              <ContactLine label="Ответ" v="В течение 2–3 часов" />
            </div>
          </div>

          <form onSubmit={submit} style={{
            background: 'var(--bg-2)', padding: 40, borderRadius: 4,
            display: 'flex', flexDirection: 'column', gap: 28, border: '1px solid var(--line)',
          }}>
            <Field label="Как вас зовут" value={form.name} onChange={(v) => update('name', v)} required />
            <Field label="Email или Telegram" value={form.contact} onChange={(v) => update('contact', v)} required placeholder="@you · you@mail.com" />

            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Тип проекта</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Готовый', 'Studio', 'Кастом', 'Не знаю'].map((t) => (
                  <button type="button" key={t} onClick={() => update('type', t)} style={{
                    background: form.type === t ? 'var(--ink)' : 'transparent',
                    color: form.type === t ? 'var(--bg)' : 'var(--ink)',
                    border: '1px solid ' + (form.type === t ? 'var(--ink)' : 'var(--line)'),
                    borderRadius: 999, padding: '8px 16px',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            <Field label="О свадьбе" multiline value={form.message} onChange={(v) => update('message', v)} placeholder="Даты, стиль, примерное кол-во гостей, язык…" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--line)' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
                Отправляя, вы принимаете оферту.
              </div>
              <Button onClick={() => {}} size="lg">Отправить заявку →</Button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, multiline, required, placeholder }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        {required && <span style={{ opacity: 0.5 }}>требуется</span>}
      </div>
      {multiline ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
          rows={5}
          style={{
            width: '100%', background: 'transparent', border: 0, borderBottom: '1px solid var(--line)',
            padding: '10px 0', fontFamily: 'inherit', fontSize: 18, color: 'var(--ink)', outline: 'none',
            resize: 'vertical',
          }}
        />
      ) : (
        <input
          value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
          style={{
            width: '100%', background: 'transparent', border: 0, borderBottom: '1px solid var(--line)',
            padding: '10px 0', fontFamily: 'inherit', fontSize: 18, color: 'var(--ink)', outline: 'none',
          }}
        />
      )}
    </label>
  );
}

function ContactLine({ label, v }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</div>
      <div className="serif" style={{ fontSize: 26, marginTop: 8, letterSpacing: '-0.01em' }}>{v}</div>
    </div>
  );
}

Object.assign(window, { Contact });


// ===== src/template-shell.jsx =====
// Shared utilities used by individual template demos:
// - Countdown hook
// - RSVP form (each template styles its own visually, but the state logic here)
// - Demo chrome (floating "this is a demo" bar with CTA back to main site)

function useCountdown(targetIso) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const target = new Date(targetIso).getTime();
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
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 200,
          background: dark ? 'rgba(20,16,10,0.8)' : 'rgba(245,241,234,0.85)',
          backdropFilter: 'blur(12px)',
          color: dark ? '#f5f1ea' : '#2a2418',
          border: dark ? '1px solid rgba(245,241,234,0.2)' : '1px solid rgba(42,36,24,0.15)',
          borderRadius: 999, padding: '8px 14px', cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}
      >Canvas · {t.name} ↓</button>
    );
  }
  return (
    <div style={{
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
      <Link
        to="/contact"
        style={{
          background: dark ? '#f5f1ea' : '#2a2418',
          color: dark ? '#2a2418' : '#f5f1ea',
          padding: '8px 16px', borderRadius: 999, marginLeft: 8,
        }}
      >Заказать такой →</Link>
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

Object.assign(window, { useCountdown, DemoBar, useRsvp });


// ===== src/template-editorial.jsx =====
// 01 · Editorial — Vogue magazine feel: giant serif wordmark, full-bleed portrait, drop caps, pull quotes

function TemplateEditorial() {
  const t = TEMPLATES.find((x) => x.slug === 'editorial');
  const cd = useCountdown('2026-09-14T16:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{
      background: '#f5f1ea', color: '#2a2418', fontFamily: "'Fraunces', Georgia, serif",
      minHeight: '100vh',
    }}>
      <DemoBar t={t} />

      {/* Masthead */}
      <header style={{
        padding: '28px 40px', borderBottom: '1px solid #2a2418',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
      }}>
        <span>Vol. I · № 14</span>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontStyle: 'italic', letterSpacing: '-0.02em', textTransform: 'none' }}>A · &amp; · G</span>
        <span>Como, Italy — Autumn MMXXVI</span>
      </header>

      {/* Hero */}
      <section style={{ padding: '100px 40px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.7 }}>— SAVE THE DATE —</div>
        <h1 style={{
          fontSize: 'clamp(96px, 18vw, 280px)', lineHeight: 0.88,
          fontWeight: 300, margin: '36px 0 0', letterSpacing: '-0.045em',
        }}>
          <span style={{ fontStyle: 'italic' }}>Алиса</span>
        </h1>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(18px, 2.5vw, 32px)', fontStyle: 'italic', opacity: 0.8, margin: '-0.3em 0 0' }}>&amp;</div>
        <h1 style={{
          fontSize: 'clamp(96px, 18vw, 280px)', lineHeight: 0.88,
          fontWeight: 400, margin: 0, letterSpacing: '-0.045em',
        }}>Григорий</h1>
        <div style={{ marginTop: 40, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.3em' }}>
          14 · IX · MMXXVI  ·  VILLA ERBA  ·  LAGO DI COMO
        </div>
      </section>

      {/* Full-bleed photo */}
      <section style={{ padding: '40px 40px' }}>
        <Placeholder label="hero · vogue couple portrait · 16:9 · shot on film" ratio="16/9" fg="#6b5d4a" bg="#e5dcc8" variant="stripes" />
      </section>

      {/* Countdown */}
      <section style={{ padding: '60px 40px', textAlign: 'center', borderTop: '1px solid #2a2418', borderBottom: '1px solid #2a2418' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.6, marginBottom: 24 }}>DAYS UNTIL</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[['days', 'дней', cd.days], ['hours', 'часов', cd.hours], ['minutes', 'минут', cd.minutes], ['seconds', 'секунд', cd.seconds]].map(([k, ru, v]) => (
            <div key={k}>
              <div style={{ fontSize: 'clamp(56px, 8vw, 112px)', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.6, marginTop: 6 }}>{ru}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story with drop cap */}
      <section style={{ padding: '120px 40px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 }}>ONE · THE STORY</div>
            <h2 style={{ fontSize: 56, fontWeight: 400, margin: '20px 0 0', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
              Как <span style={{ fontStyle: 'italic' }}>это</span><br/>случилось
            </h2>
          </div>
          <div style={{ columnCount: 2, columnGap: 40, fontSize: 17, lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <span style={{ float: 'left', fontSize: 84, lineHeight: 0.85, paddingRight: 12, paddingTop: 6, fontStyle: 'italic', fontWeight: 400 }}>А</span>
              лиса и Григорий познакомились на выставке в Венеции в октябре две тысячи двадцать третьего года.
              Он стоял у работы Агнес Мартин и делал вид, что понимает, зачем художнице минимум сорок восемь одинаковых линий.
              Она подошла и сказала: «Это не сорок восемь, а сорок девять.»
            </p>
            <p>
              С тех пор — три года, две страны, один переезд и бесконечные разговоры о том, какой должна быть свадьба.
              В итоге — вилла на озере, ужин на террасе, сто двадцать гостей и никаких шатров. Мы счастливы, что вы будете там.
            </p>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#ede7dc' }}>
        <p style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.01em', maxWidth: 1000, margin: '0 auto', textWrap: 'balance' }}>
          «Мы не хотели ни шатров, ни сюрпризов, ни тамады. Только семью, озеро и длинный стол с белым льном.»
        </p>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', marginTop: 24, opacity: 0.6 }}>— А. &amp; Г.</div>
      </section>

      {/* Details — three-column editorial block */}
      <section style={{ padding: '120px 40px', maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 }}>TWO · THE DAY</div>
        <h2 style={{ fontSize: 72, fontWeight: 400, margin: '20px 0 60px', letterSpacing: '-0.025em' }}>Программа <span style={{ fontStyle: 'italic' }}>дня</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {[
            ['16:00', 'Церемония', 'Terrazza del Lago — welcome aperitivo уже с 15:30'],
            ['18:30', 'Ужин', 'Длинный стол под оливами · шеф Лука Марчелли'],
            ['21:00', 'Танцы', 'DJ Винцент до двух ночи · трансфер до отеля'],
          ].map(([time, title, body]) => (
            <div key={title} style={{ borderTop: '1px solid #2a2418', paddingTop: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.14em', opacity: 0.6 }}>{time}</div>
              <div style={{ fontSize: 32, fontWeight: 400, margin: '16px 0 12px', letterSpacing: '-0.01em' }}>{title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.55, opacity: 0.75, fontFamily: 'Inter, sans-serif' }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '120px 40px', background: '#2a2418', color: '#f5f1ea' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.6 }}>THREE · R.S.V.P.</div>
          <h2 style={{ fontSize: 'clamp(56px, 8vw, 112px)', fontWeight: 400, margin: '24px 0 0', letterSpacing: '-0.035em', lineHeight: 0.95 }}>
            Дайте <span style={{ fontStyle: 'italic' }}>знать</span>.
          </h2>
          <p style={{ marginTop: 24, fontSize: 17, opacity: 0.75, lineHeight: 1.55, fontFamily: 'Inter, sans-serif' }}>
            Ответьте, пожалуйста, до 14 августа 2026 года.
          </p>
          <EditorialRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: '40px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', opacity: 0.6, textTransform: 'uppercase', background: '#2a2418', color: '#f5f1ea' }}>
        · Made with Canvas · hello@canvas.wedding ·
      </footer>
    </div>
  );
}

function EditorialRSVP({ rsvp }) {
  if (rsvp.sent) {
    return <div style={{ marginTop: 40, padding: 32, border: '1px solid rgba(245,241,234,0.3)', fontStyle: 'italic', fontSize: 22 }}>Благодарим, {rsvp.state.name}. Мы ждём вас 14 сентября.</div>;
  }
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left', fontFamily: 'Inter, sans-serif' }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(245,241,234,0.3)', color: '#f5f1ea', fontSize: 24, fontFamily: "'Fraunces', serif", padding: '8px 0', outline: 'none' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {[['yes', 'Буду'], ['no', 'Не смогу']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? '#f5f1ea' : 'transparent', color: rsvp.state.attending === v ? '#2a2418' : '#f5f1ea', border: '1px solid rgba(245,241,234,0.3)', cursor: 'pointer', fontFamily: "'Fraunces', serif", fontSize: 18, fontStyle: v === 'yes' ? 'italic' : 'normal' }}>{l}</button>
        ))}
      </div>
      <input placeholder="Диетарные пожелания (необязательно)" value={rsvp.state.dietary} onChange={(e) => rsvp.update('dietary', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(245,241,234,0.3)', color: '#f5f1ea', fontSize: 16, padding: '8px 0', outline: 'none' }} />
      <button type="submit" style={{ marginTop: 12, padding: 20, background: '#f5f1ea', color: '#2a2418', border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Отправить ответ →</button>
    </form>
  );
}

Object.assign(window, { TemplateEditorial });


// ===== src/template-swiss.jsx =====
// 02 · Swiss — 12-col grid, Helvetica, meta everywhere, no decoration

function TemplateSwiss() {
  const t = TEMPLATES.find((x) => x.slug === 'swiss');
  const cd = useCountdown('2026-06-07T15:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'Inter', Helvetica, Arial, sans-serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Top meta grid */}
      <header style={{
        padding: 24, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16,
        borderBottom: '1px solid #111', fontSize: 11, letterSpacing: '0.02em',
      }}>
        <div style={{ gridColumn: '1 / 3' }}>Mira · Leo</div>
        <div style={{ gridColumn: '3 / 5' }}>07.06.2026</div>
        <div style={{ gridColumn: '5 / 7' }}>Zürich, CH</div>
        <div style={{ gridColumn: '7 / 9', textAlign: 'right' }}>47.3769° N</div>
        <div style={{ gridColumn: '9 / 11', textAlign: 'right' }}>8.5417° E</div>
        <div style={{ gridColumn: '11 / 13', textAlign: 'right' }}>ML-2026-0607</div>
      </header>

      {/* Hero — giant reserved name block, minimal */}
      <section style={{ padding: '40px 24px 120px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <div style={{ gridColumn: '1 / 13', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #111' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.02em' }}>00 / Invitation</span>
          <span style={{ fontSize: 11 }}>Ref. ML-2026-0607</span>
        </div>
        <div style={{ gridColumn: '1 / 9', marginTop: 60 }}>
          <div style={{ fontSize: 'clamp(96px, 18vw, 260px)', lineHeight: 0.85, fontWeight: 300, letterSpacing: '-0.045em' }}>
            mira<br/>leo.
          </div>
        </div>
        <div style={{ gridColumn: '9 / 13', marginTop: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 12 }}>
          <div style={{ fontSize: 12, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            You are warmly invited<br/>to the wedding of<br/>
            <span style={{ fontWeight: 500 }}>Mira Koller<br/>and Leo Engstrøm</span><br/>
            on the seventh of June<br/>two thousand twenty-six<br/>
            at fifteen hundred hours<br/>
            Villa Wesendonck, Zürich
          </div>
        </div>
        <div style={{ gridColumn: '1 / 13', display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #111', fontSize: 11 }}>
          <span>MK · LE</span><span>01 of 09</span><span>→ R.S.V.P.</span>
        </div>
      </section>

      {/* Countdown grid */}
      <section style={{ padding: 24, borderTop: '1px solid #111', borderBottom: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <div style={{ gridColumn: '1 / 4', fontSize: 11, letterSpacing: '0.02em' }}>01 / Countdown</div>
        {[['D', cd.days], ['H', cd.hours], ['M', cd.minutes], ['S', cd.seconds]].map(([k, v], i) => (
          <div key={k} style={{ gridColumn: `span 2`, textAlign: i === 0 ? 'left' : 'left' }}>
            <div style={{ fontSize: 64, fontWeight: 300, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
            <div style={{ fontSize: 11 }}>{k}</div>
          </div>
        ))}
      </section>

      {/* Info sections — each one tiny header + body, grid-aligned */}
      <Block n="02" label="Ceremony">
        <Row k="Time" v="15:00 — 16:00 (CET)" />
        <Row k="Venue" v="Villa Wesendonck · Gablerstrasse 15, Zürich" />
        <Row k="Dress" v="Formal · warm tones preferred" />
        <Row k="Language" v="DE · EN" />
      </Block>
      <Block n="03" label="Reception">
        <Row k="Time" v="17:30 — 00:00" />
        <Row k="Venue" v="Restaurant Kunsthaus, 2nd floor" />
        <Row k="Menu" v="Tasting · 5 courses · vegetarian option" />
        <Row k="Music" v="String quartet → DJ SVEN RASCH" />
      </Block>
      <Block n="04" label="Travel">
        <Row k="Airport" v="ZRH · 18 min by train" />
        <Row k="Hotel block" v="Storchen Zürich · use code MIRALEO2026" />
        <Row k="Shuttle" v="16:45 from hotel lobby" />
      </Block>

      {/* Portrait — minimal, single image, meta alongside */}
      <section style={{ padding: 24, borderTop: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <div style={{ gridColumn: '1 / 4', fontSize: 11, letterSpacing: '0.02em' }}>05 / Figure 01</div>
        <div style={{ gridColumn: '4 / 10' }}>
          <Placeholder label="couple · figure 01" ratio="3/2" fg="#888" bg="#f2f2f2" variant="grid" />
        </div>
        <div style={{ gridColumn: '10 / 13', fontSize: 11, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Figure 01<br/>Mira &amp; Leo<br/>Photographed by<br/>Anna Bühler<br/>Zürich, 2026
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: 24, borderTop: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <div style={{ gridColumn: '1 / 4', fontSize: 11, letterSpacing: '0.02em' }}>06 / R.S.V.P.</div>
        <div style={{ gridColumn: '4 / 13' }}>
          <div style={{ fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.035em', marginBottom: 40 }}>
            Please respond<br/>by 10 May 2026.
          </div>
          <SwissRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: 24, borderTop: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16, fontSize: 11 }}>
        <div style={{ gridColumn: '1 / 5' }}>ML-2026-0607 · Canvas Studio</div>
        <div style={{ gridColumn: '5 / 9', textAlign: 'center' }}>Mira Koller · Leo Engstrøm</div>
        <div style={{ gridColumn: '9 / 13', textAlign: 'right' }}>07.06.2026 · ZRH</div>
      </footer>
    </div>
  );
}

function Block({ n, label, children }) {
  return (
    <section style={{ padding: 24, borderTop: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
      <div style={{ gridColumn: '1 / 4', fontSize: 11, letterSpacing: '0.02em' }}>{n} / {label}</div>
      <div style={{ gridColumn: '4 / 13', display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </section>
  );
}
function Row({ k, v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, fontSize: 15, paddingBottom: 10, borderBottom: '1px solid #eee' }}>
      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}

function SwissRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ padding: 24, border: '1px solid #111', fontSize: 14 }}>Received. Thank you, {rsvp.state.name}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, fontSize: 14 }}>
      <SwissField label="Name" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required />
      <SwissField label="Guests" type="number" value={rsvp.state.guests} onChange={(v) => rsvp.update('guests', v)} />
      <div style={{ gridColumn: '1 / 3' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: 10 }}>Attending</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['yes', 'YES / will attend'], ['no', 'NO / regretfully decline']].map(([v, l]) => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="radio" checked={rsvp.state.attending === v} onChange={() => rsvp.update('attending', v)} /> {l}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" style={{ gridColumn: '1 / 3', padding: 18, background: '#111', color: '#fff', border: 0, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Submit response →</button>
    </form>
  );
}
function SwissField({ label, value, onChange, type = 'text', required }) {
  return (
    <label>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: 10 }}>{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ width: '100%', padding: 12, border: '1px solid #111', background: '#fff', fontFamily: 'inherit', fontSize: 14, outline: 'none' }} />
    </label>
  );
}

Object.assign(window, { TemplateSwiss });


// ===== src/template-garden.jsx =====
// 03 · Garden botanical — soft sage, illustrated florals, Cormorant italic, ornament-framed

function TemplateGarden() {
  const t = TEMPLATES.find((x) => x.slug === 'garden');
  const cd = useCountdown('2026-05-22T17:00:00');
  const rsvp = useRsvp();

  return (
    <div style={{ background: '#eef2e6', color: '#2d3a26', fontFamily: "'Cormorant Garamond', serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Hero with botanical ornaments */}
      <section style={{ padding: '100px 40px 80px', position: 'relative', textAlign: 'center' }}>
        <BotanicalOrnament style={{ position: 'absolute', top: 20, left: 40, width: 200, opacity: 0.5 }} />
        <BotanicalOrnament style={{ position: 'absolute', top: 40, right: 40, width: 200, opacity: 0.5, transform: 'scaleX(-1)' }} />

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.65 }}>
          — With joy, we invite you —
        </div>
        <div style={{ marginTop: 40, fontSize: 'clamp(64px, 10vw, 140px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em' }}>
          Ella
        </div>
        <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, margin: '-0.2em 0', letterSpacing: '0.2em' }}>&amp;</div>
        <div style={{ fontSize: 'clamp(64px, 10vw, 140px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em' }}>
          Matteo
        </div>
        <div style={{ marginTop: 60, fontSize: 20, letterSpacing: '0.1em' }}>
          22 · MAY · 2026
        </div>
        <div style={{ fontSize: 15, letterSpacing: '0.25em', marginTop: 8, opacity: 0.7 }}>
          TUSCANY · ITALY
        </div>

        <div style={{ margin: '60px auto 0', width: 200, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 0.5, background: '#2d3a26', opacity: 0.4 }} />
          <svg viewBox="0 0 20 20" style={{ width: 14 }}><circle cx="10" cy="10" r="2" fill="#2d3a26" /></svg>
          <div style={{ flex: 1, height: 0.5, background: '#2d3a26', opacity: 0.4 }} />
        </div>
      </section>

      {/* Narrative + illustration */}
      <section style={{ padding: '80px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <BotanicalOrnament style={{ width: 90, opacity: 0.5, marginBottom: 20 }} />
            <h2 style={{ fontSize: 48, fontStyle: 'italic', fontWeight: 300, margin: 0, lineHeight: 1 }}>Наша история</h2>
            <p style={{ marginTop: 28, fontSize: 19, lineHeight: 1.65, fontFamily: 'EB Garamond, serif' }}>
              Мы встретились в мастерской флориста на окраине Флоренции — она покупала пионы, а он привёз ветки оливы.
              Три года спустя — та же мастерская, те же пионы и тот же оливковый лист в свадебном букете.
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.65, fontFamily: 'EB Garamond, serif' }}>
              Хотим разделить этот день с самыми близкими людьми в старом villa под оливами.
            </p>
          </div>
          <div>
            <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
              <Placeholder label="couple · garden · olive grove" ratio="3/4" fg="#5a6a4a" bg="#d9e2c8" variant="dots" style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Details in leaf-framed cards */}
      <section style={{ padding: '80px 40px', background: '#e5ecd8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontStyle: 'italic', fontWeight: 300, margin: 0, lineHeight: 1 }}>Программа дня</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 60 }}>
            {[
              ['17:00', 'Церемония', 'Под оливковым деревом во дворе villa'],
              ['19:00', 'Ужин', 'Длинный стол с flora-декором'],
              ['21:30', 'Танцы', 'Живая музыка и светлячки'],
            ].map(([time, title, body]) => (
              <div key={title} style={{ padding: 32, textAlign: 'center' }}>
                <BotanicalOrnament style={{ width: 60, opacity: 0.5, margin: '0 auto 16px' }} />
                <div style={{ fontSize: 14, letterSpacing: '0.25em', opacity: 0.7 }}>{time}</div>
                <div style={{ fontSize: 32, fontStyle: 'italic', margin: '10px 0 8px', fontWeight: 300 }}>{title}</div>
                <div style={{ fontSize: 16, fontFamily: 'EB Garamond, serif', lineHeight: 1.5, opacity: 0.8 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, letterSpacing: '0.3em', opacity: 0.65 }}>COUNTING THE DAYS</div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[['дней', cd.days], ['часов', cd.hours], ['минут', cd.minutes]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 96, fontStyle: 'italic', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              <div style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.65, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '100px 40px', background: '#2d3a26', color: '#eef2e6' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <BotanicalOrnament style={{ width: 120, opacity: 0.6, margin: '0 auto 20px' }} stroke="#eef2e6" />
          <h2 style={{ fontSize: 'clamp(48px, 7vw, 88px)', fontStyle: 'italic', fontWeight: 300, margin: 0, lineHeight: 1 }}>Пожалуйста,<br/>ответьте</h2>
          <p style={{ marginTop: 24, fontSize: 17, opacity: 0.8, fontFamily: 'EB Garamond, serif', lineHeight: 1.5 }}>До первого мая 2026 года.</p>
          <GardenRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 16, opacity: 0.7, background: '#2d3a26', color: '#eef2e6' }}>
        With love, Ella &amp; Matteo · May the twenty-second, two thousand twenty-six
      </footer>
    </div>
  );
}

function BotanicalOrnament({ style, stroke = '#2d3a26' }) {
  return (
    <svg viewBox="0 0 200 100" style={style}>
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

function GardenRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 32, fontStyle: 'italic', fontSize: 22 }}>Мы так рады, {rsvp.state.name}. Ждём вас среди олив.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(238,242,230,0.4)', color: '#eef2e6', fontSize: 26, fontStyle: 'italic', padding: '10px 0', outline: 'none' }} />
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {[['yes', 'С радостью'], ['no', 'К сожалению, нет']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? '#eef2e6' : 'transparent', color: rsvp.state.attending === v ? '#2d3a26' : '#eef2e6', border: '1px solid rgba(238,242,230,0.4)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 18, fontStyle: 'italic' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 12, padding: 18, background: '#eef2e6', color: '#2d3a26', border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Отправить →</button>
    </form>
  );
}

Object.assign(window, { TemplateGarden });


// ===== src/template-dark.jsx =====
// 04 · Dark luxe — black/gold, cinematic hero crop, Cormorant italic, serif numbers

function TemplateDark() {
  const t = TEMPLATES.find((x) => x.slug === 'dark');
  const cd = useCountdown('2026-11-30T19:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#0d0b08', color: '#d4b87a', fontFamily: "'Cormorant Garamond', serif", minHeight: '100vh' }}>
      <DemoBar t={t} theme="dark" />

      {/* Hero — cinematic full-bleed */}
      <section style={{ height: '100vh', minHeight: 700, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,11,8,0) 0%, rgba(13,11,8,0.3) 50%, rgba(13,11,8,0.95) 100%)' }} />
        <Placeholder label="cinematic · sofia &amp; max · nocturne" ratio="16/9" fg="#d4b87a" bg="#1a1612" variant="stripes" style={{ position: 'absolute', inset: 0, height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,11,8,0.55) 0%, rgba(13,11,8,0.2) 50%, rgba(13,11,8,0.95) 100%)' }} />

        <div style={{ position: 'absolute', top: 40, left: 0, right: 0, padding: '0 40px', display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.7 }}>
          <span>PARIS · MMXXVI</span><span>— NOCTURNE —</span><span>№ 001 / 001</span>
        </div>

        <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.4em', marginBottom: 32, opacity: 0.75 }}>— 30 · XI · MMXXVI —</div>
          <div style={{ fontSize: 'clamp(80px, 14vw, 200px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '0.01em' }}>Sofia</div>
          <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', margin: '-0.2em 0', fontStyle: 'italic', opacity: 0.7 }}>&amp;</div>
          <div style={{ fontSize: 'clamp(80px, 14vw, 200px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '0.01em' }}>Max</div>
        </div>

        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', opacity: 0.5 }}>↓ SCROLL</div>
      </section>

      {/* Invitation text */}
      <section style={{ padding: '140px 40px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <p style={{ fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 1.4, fontWeight: 300, fontStyle: 'italic', margin: 0, color: '#e8d4a8' }}>
          В ночь, когда Париж гаснет, а зал заливает свечной свет — мы приглашаем вас быть рядом.
        </p>
        <div style={{ marginTop: 60, width: 40, height: 0.5, background: '#d4b87a', margin: '60px auto 0', opacity: 0.5 }} />
      </section>

      {/* Countdown — big serif numerals */}
      <section style={{ padding: '80px 40px', textAlign: 'center', borderTop: '1px solid rgba(212,184,122,0.15)', borderBottom: '1px solid rgba(212,184,122,0.15)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55 }}>TILL WE MEET</div>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 80px)', flexWrap: 'wrap' }}>
          {[['days', cd.days], ['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 'clamp(72px, 10vw, 140px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: '#e8d4a8' }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 10, opacity: 0.55 }}>{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Program — alternating left/right with thin dividers */}
      <section style={{ padding: '120px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55 }}>PROGRAMME</div>
          <h2 style={{ fontSize: 'clamp(48px, 6vw, 88px)', fontStyle: 'italic', fontWeight: 300, margin: '20px 0 0', lineHeight: 1 }}>Сценарий вечера</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            ['19:00', 'Welcome champagne', 'Grand Salon · Palais'],
            ['20:00', 'Ceremony', 'Candlelit Nave'],
            ['21:30', 'Dinner by Bertrand', 'La Salle · Chef Bertrand Guéneron'],
            ['23:00', 'First dance', 'Ballroom'],
            ['00:00', 'Midnight toast', 'Terrace overlooking Seine'],
            ['03:00', 'End of service', 'Last shuttle'],
          ].map(([time, title, place], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 40, padding: '28px 0', borderBottom: '1px solid rgba(212,184,122,0.2)', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.15em', opacity: 0.65 }}>{time}</div>
              <div style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 300 }}>{title}</div>
              <div style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6 }}>{place}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section style={{ padding: '100px 40px', background: '#11100b', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55 }}>DRESS CODE</div>
        <h2 style={{ fontSize: 'clamp(56px, 8vw, 120px)', fontStyle: 'italic', fontWeight: 300, margin: '20px 0 0', lineHeight: 1, letterSpacing: '0.02em' }}>Black Tie,<br/>nocturne.</h2>
        <p style={{ marginTop: 24, maxWidth: 500, margin: '24px auto 0', fontSize: 17, lineHeight: 1.5, opacity: 0.75, fontStyle: 'italic' }}>
          Глубокие цвета, бархат, длинные платья. Без белого — для нас этот цвет только у невесты.
        </p>
      </section>

      {/* RSVP */}
      <section style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55 }}>R · S · V · P</div>
          <h2 style={{ fontSize: 'clamp(64px, 9vw, 140px)', fontStyle: 'italic', fontWeight: 300, margin: '20px 0 0', lineHeight: 0.95 }}>Будем<br/>ждать.</h2>
          <DarkRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.4, borderTop: '1px solid rgba(212,184,122,0.15)' }}>
        S · M · MMXXVI · PARIS
      </footer>
    </div>
  );
}

function DarkRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 40, fontStyle: 'italic', fontSize: 24, color: '#e8d4a8' }}>Ваш ответ получен, {rsvp.state.name}. До встречи.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <input required placeholder="Your name" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(212,184,122,0.3)', color: '#e8d4a8', fontSize: 28, fontStyle: 'italic', padding: '12px 0', outline: 'none', textAlign: 'center', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 12 }}>
        {[['yes', 'Accept'], ['no', 'Decline']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 18, background: rsvp.state.attending === v ? '#d4b87a' : 'transparent', color: rsvp.state.attending === v ? '#0d0b08' : '#d4b87a', border: '1px solid rgba(212,184,122,0.4)', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 12, padding: 18, background: '#d4b87a', color: '#0d0b08', border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer' }}>Confirm →</button>
    </form>
  );
}

Object.assign(window, { TemplateDark });


// ===== src/template-brutalist.jsx =====
// 05 · Brutalist — massive Archivo Black, red accent, raw grid, no decoration

function TemplateBrutalist() {
  const t = TEMPLATES.find((x) => x.slug === 'brutalist');
  const cd = useCountdown('2026-08-03T14:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#eae4d8', color: '#000', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Hero */}
      <section style={{ padding: '32px 24px', borderBottom: '2px solid #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500 }}>
          <span>IRA × JAN — WEDDING DOCUMENT v.1.0</span>
          <span style={{ background: '#ff3b1f', color: '#fff', padding: '2px 8px' }}>BER / 03.08.26</span>
        </div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(120px, 24vw, 360px)', lineHeight: 0.82, letterSpacing: '-0.06em', marginTop: 40 }}>
          IRA
        </div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(80px, 14vw, 220px)', lineHeight: 0.82, letterSpacing: '-0.05em', color: '#ff3b1f', margin: '0.1em 0' }}>
          ×
        </div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(120px, 24vw, 360px)', lineHeight: 0.82, letterSpacing: '-0.06em', textAlign: 'right' }}>
          JAN
        </div>
      </section>

      {/* Facts row */}
      <section style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderBottom: '2px solid #000' }}>
        {[['DATE', '03.08.2026'], ['TIME', '14:00 CET'], ['PLACE', 'KREUZBERG, BERLIN'], ['CODE', 'COLOR ALLOWED']].map(([k, v]) => (
          <div key={k} style={{ borderRight: '1px solid #000', padding: '0 20px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>{k}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(20px, 2.6vw, 34px)', letterSpacing: '-0.02em', marginTop: 8 }}>{v}</div>
          </div>
        ))}
      </section>

      {/* Manifesto */}
      <section style={{ padding: '80px 24px', borderBottom: '2px solid #000' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            § 01<br/>MANIFESTO
          </div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(32px, 4vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.035em' }}>
            WE'RE GETTING MARRIED.<br/>
            <span style={{ color: '#ff3b1f' }}>NO</span> DRESS CODE.<br/>
            <span style={{ color: '#ff3b1f' }}>NO</span> SEATING CHART.<br/>
            <span style={{ color: '#ff3b1f' }}>NO</span> PRESENT LIST.<br/>
            <span style={{ color: '#ff3b1f' }}>YES</span> TO YOU.
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '40px 24px', borderBottom: '2px solid #000', background: '#000', color: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[['DAYS', cd.days], ['HOURS', cd.hours], ['MINUTES', cd.minutes], ['SECONDS', cd.seconds]].map(([k, v], i) => (
            <div key={k} style={{ padding: 20, borderRight: i < 3 ? '1px solid #333' : 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', opacity: 0.6 }}>{k}</div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em', marginTop: 6 }}>{String(v).padStart(2, '0')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programme table */}
      <section style={{ padding: '80px 24px', borderBottom: '2px solid #000' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>§ 02 PROGRAMME</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(18px, 2.5vw, 28px)', letterSpacing: '-0.02em' }}>
          <tbody>
            {[
              ['14:00', 'CEREMONY', 'COURTYARD, GROUND FLOOR'],
              ['15:30', 'STREET FOOD', 'YARD · 12 VENDORS'],
              ['18:00', 'DINNER', 'BASEMENT LEVEL'],
              ['20:30', 'BAND: KRAUTFUNK', 'STAGE A'],
              ['23:00', 'DJ: LUCA LÖWENZAHN', 'STAGE B UNTIL LATE'],
            ].map(([time, title, place], i) => (
              <tr key={i} style={{ borderTop: '2px solid #000' }}>
                <td style={{ padding: '20px 0', width: 120 }}>{time}</td>
                <td style={{ padding: '20px 0' }}>{title}</td>
                <td style={{ padding: '20px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, textAlign: 'right', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* RSVP */}
      <section style={{ padding: '80px 24px', background: '#ff3b1f', color: '#000' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>§ 03 RSVP FORM</div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(56px, 9vw, 140px)', lineHeight: 0.88, letterSpacing: '-0.05em', marginBottom: 40 }}>
          TELL US<br/>YES OR NO.
        </div>
        <BrutalistRSVP rsvp={rsvp} />
      </section>

      <footer style={{ padding: 20, background: '#000', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, display: 'flex', justifyContent: 'space-between', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span>IRA × JAN · 03.08.26 · BER</span>
        <span>DOC v.1.0 · PRINTED ON WEB</span>
      </footer>
    </div>
  );
}

function BrutalistRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 48, letterSpacing: '-0.03em' }}>GOT IT, {rsvp.state.name.toUpperCase()}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, maxWidth: 900 }}>
      <input required placeholder="NAME" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ gridColumn: 'span 2', padding: 18, background: '#000', color: '#fff', border: 0, fontFamily: "'Archivo Black', sans-serif", fontSize: 18, letterSpacing: '-0.02em', outline: 'none' }} />
      <button type="button" onClick={() => rsvp.update('attending', 'yes')}
        style={{ padding: 18, background: rsvp.state.attending === 'yes' ? '#000' : 'transparent', color: rsvp.state.attending === 'yes' ? '#ff3b1f' : '#000', border: '2px solid #000', cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: 18 }}>YES</button>
      <button type="button" onClick={() => rsvp.update('attending', 'no')}
        style={{ padding: 18, background: rsvp.state.attending === 'no' ? '#000' : 'transparent', color: rsvp.state.attending === 'no' ? '#ff3b1f' : '#000', border: '2px solid #000', borderLeft: 0, cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: 18 }}>NO</button>
      <button type="submit" style={{ gridColumn: 'span 4', padding: 22, background: '#000', color: '#ff3b1f', border: 0, fontFamily: "'Archivo Black', sans-serif", fontSize: 24, letterSpacing: '-0.02em', cursor: 'pointer', marginTop: 8 }}>SUBMIT →</button>
    </form>
  );
}

Object.assign(window, { TemplateBrutalist });


// ===== src/template-letterpress.jsx =====
// 06 · Letterpress — aged paper, centered classical, EB Garamond, ornaments

function TemplateLetterpress() {
  const t = TEMPLATES.find((x) => x.slug === 'letterpress');
  const cd = useCountdown('2026-06-14T13:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{
      background: '#ebe1cc', color: '#3a2a1a', fontFamily: "'EB Garamond', Georgia, serif", minHeight: '100vh',
      backgroundImage: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(201,168,120,0.08) 100%)',
    }}>
      <DemoBar t={t} />

      <section style={{ padding: '100px 40px', maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <FleurOrnament style={{ width: 80, opacity: 0.5, margin: '0 auto 40px' }} />

        <div style={{ fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.65 }}>— We kindly request the honour of your presence —</div>

        <div style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', margin: '60px 0 14px', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.1 }}>
          at the marriage of
        </div>

        <div style={{ fontSize: 'clamp(60px, 9vw, 124px)', margin: 0, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1 }}>
          Eleanor
        </div>
        <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontStyle: 'italic', margin: '10px 0' }}>&amp;</div>
        <div style={{ fontSize: 'clamp(60px, 9vw, 124px)', margin: 0, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1 }}>
          Theodore
        </div>

        <FleurOrnament style={{ width: 80, opacity: 0.5, margin: '48px auto', transform: 'rotate(180deg)' }} />

        <div style={{ fontSize: 20, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
          on the <span style={{ fontStyle: 'italic' }}>fourteenth day of June</span><br/>
          in the year of our Lord<br/>
          <span style={{ fontSize: 28, fontStyle: 'italic' }}>two thousand twenty-six</span><br/>
          at one o'clock in the afternoon
        </div>

        <div style={{ margin: '48px auto 0', display: 'flex', alignItems: 'center', gap: 14, maxWidth: 240 }}>
          <div style={{ flex: 1, height: 0.5, background: '#3a2a1a', opacity: 0.4 }} />
          <div style={{ fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.6 }}>et</div>
          <div style={{ flex: 1, height: 0.5, background: '#3a2a1a', opacity: 0.4 }} />
        </div>

        <div style={{ marginTop: 36, fontSize: 22, fontStyle: 'italic', letterSpacing: '0.05em' }}>
          Église Saint-Aignan<br/>Orléans, France
        </div>
      </section>

      {/* Program card */}
      <section style={{ padding: '80px 40px', maxWidth: 820, margin: '0 auto' }}>
        <div style={{ border: '1.5px double #3a2a1a', padding: 40, textAlign: 'center' }}>
          <FleurOrnament style={{ width: 40, opacity: 0.6, margin: '0 auto 16px' }} />
          <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.65 }}>Ordre du Jour</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 36 }}>
            {[
              ['I', 'Thirteen o\'clock', 'Cérémonie'],
              ['II', 'Fourteen o\'clock', 'Vin d\'honneur sous les tilleuls'],
              ['III', 'Sixteen o\'clock', 'Déjeuner au château'],
              ['IV', 'Twenty-one o\'clock', 'Bal champêtre'],
            ].map(([num, time, title]) => (
              <div key={num} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 20, alignItems: 'baseline', paddingBottom: 14, borderBottom: '1px dotted rgba(58,42,26,0.3)' }}>
                <div style={{ fontStyle: 'italic', fontSize: 22 }}>{num}.</div>
                <div style={{ fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7 }}>{time}</div>
                <div style={{ fontSize: 22, fontStyle: 'italic', textAlign: 'right' }}>{title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.6 }}>— and the time till then —</div>
        <div style={{ marginTop: 32, fontSize: 'clamp(32px, 4.5vw, 56px)', fontStyle: 'italic' }}>
          <span style={{ fontSize: 'clamp(72px, 10vw, 120px)', fontStyle: 'normal' }}>{cd.days}</span> days, {cd.hours} hours &amp; {cd.minutes} minutes
        </div>
      </section>

      {/* RSVP card */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: 40, border: '1.5px double #3a2a1a', textAlign: 'center', background: 'rgba(255,255,255,0.25)' }}>
          <FleurOrnament style={{ width: 40, opacity: 0.6, margin: '0 auto 16px' }} />
          <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.65 }}>The Favour of a Reply</div>
          <h2 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontStyle: 'italic', fontWeight: 400, margin: '24px 0 0', lineHeight: 1 }}>
            is requested before<br/>the First of May
          </h2>
          <LetterpressRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.6 }}>
        · Printed · Orléans · MMXXVI ·
      </footer>
    </div>
  );
}

function FleurOrnament({ style }) {
  return (
    <svg viewBox="0 0 100 40" style={style}>
      <g stroke="#3a2a1a" fill="none" strokeWidth="0.7">
        <path d="M50 20 Q30 5, 10 20 Q30 35, 50 20 Q70 5, 90 20 Q70 35, 50 20" />
        <circle cx="50" cy="20" r="2" fill="#3a2a1a" />
        <line x1="50" y1="4" x2="50" y2="10" />
        <line x1="50" y1="30" x2="50" y2="36" />
      </g>
    </svg>
  );
}

function LetterpressRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 32, fontStyle: 'italic', fontSize: 22 }}>Gratitude, {rsvp.state.name}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input required placeholder="Your name" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid #3a2a1a', color: '#3a2a1a', fontSize: 22, fontStyle: 'italic', padding: '8px 0', outline: 'none', textAlign: 'center', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {[['yes', 'With pleasure'], ['no', 'Regrets only']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 14, background: rsvp.state.attending === v ? '#3a2a1a' : 'transparent', color: rsvp.state.attending === v ? '#ebe1cc' : '#3a2a1a', border: '1px solid #3a2a1a', cursor: 'pointer', fontFamily: 'inherit', fontStyle: 'italic', fontSize: 18 }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ padding: 14, background: '#3a2a1a', color: '#ebe1cc', border: 0, fontFamily: 'inherit', fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 8 }}>Post Reply</button>
    </form>
  );
}

Object.assign(window, { TemplateLetterpress });


// ===== src/template-wabisabi.jsx =====
// 07 · Wabi-sabi — lots of white, asymmetric placements, ink-brush, Japanese hint

function TemplateWabiSabi() {
  const t = TEMPLATES.find((x) => x.slug === 'wabisabi');
  const cd = useCountdown('2026-04-11T15:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#f2ede4', color: '#1a1814', fontFamily: "'Noto Serif JP', 'Cormorant Garamond', serif", minHeight: '100vh', overflow: 'hidden' }}>
      <DemoBar t={t} />

      {/* Hero — asymmetric with huge empty space */}
      <section style={{ minHeight: '90vh', position: 'relative', padding: '120px 40px 80px' }}>
        <div style={{ position: 'absolute', top: '18%', left: '8%', fontFamily: "'Noto Serif JP', serif", fontSize: 'clamp(120px, 18vw, 260px)', fontWeight: 300, color: '#1a1814', lineHeight: 1 }}>結</div>

        <InkCircle style={{ position: 'absolute', top: '12%', right: '10%', width: 160, opacity: 0.7 }} />

        <div style={{ position: 'absolute', top: '48%', left: '28%', maxWidth: 520 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 6vw, 76px)', fontStyle: 'italic', fontWeight: 300, letterSpacing: '0.08em', lineHeight: 1.1 }}>
            Yuki<br/>—<br/>Ren
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '8%', right: '10%', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.25em', textAlign: 'right' }}>
          2026<span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>04<span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>11<br/>
          <span style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 16, letterSpacing: '0.1em' }}>京都 · Kyoto</span>
        </div>

        <div style={{ position: 'absolute', bottom: '20%', left: '12%', width: 70, height: 0.8, background: '#d85a3b' }} />
      </section>

      {/* Poem */}
      <section style={{ padding: '140px 40px', maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <InkCircle style={{ position: 'absolute', top: 40, left: 40, width: 60, opacity: 0.4 }} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(22px, 2.8vw, 32px)', lineHeight: 1.7, fontWeight: 300, paddingLeft: '20%' }}>
          Мы собираемся в Киото,<br/>
          когда сакура <span style={{ color: '#d85a3b' }}>только распускается</span>,<br/>
          в старом доме с бумажными стенами,<br/>
          и хотим, чтобы вы были рядом.
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', marginTop: 40, paddingLeft: '20%', opacity: 0.5 }}>— Y &amp; R</div>
      </section>

      {/* Program — asymmetric list with ink accents */}
      <section style={{ padding: '80px 40px 120px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 60, fontWeight: 300, marginBottom: 48 }}>式次第 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic', opacity: 0.6, marginLeft: 16 }}>— programme</span></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            ['15:00', '式', 'Ceremony', 'Kennin-ji temple, private garden'],
            ['17:00', '宴', 'Kaiseki dinner', 'Hosted by chef Kenji Tanaka'],
            ['20:00', '茶', 'Tea ceremony', 'Matcha &amp; wagashi'],
            ['21:30', '夜', 'Late music', 'Shamisen &amp; slow DJ'],
          ].map(([time, ja, en, desc], i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '80px 100px 1fr 1fr', gap: 40,
              padding: '32px 0', borderBottom: i < 3 ? '1px solid rgba(26,24,20,0.15)' : 0,
              alignItems: 'baseline',
              paddingLeft: i % 2 === 0 ? 0 : 60,
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.15em', opacity: 0.6 }}>{time}</div>
              <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 32, fontWeight: 300, color: '#d85a3b' }}>{ja}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontStyle: 'italic', fontWeight: 300, letterSpacing: '0.05em' }} dangerouslySetInnerHTML={{ __html: en }} />
              <div style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', opacity: 0.7, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '80px 40px', textAlign: 'center', position: 'relative' }}>
        <InkCircle style={{ position: 'absolute', top: 20, right: '30%', width: 120, opacity: 0.3 }} />
        <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 120, fontWeight: 300, lineHeight: 1 }}>{cd.days}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontStyle: 'italic', marginTop: 10, opacity: 0.7 }}>days remain</div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '120px 40px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 64, fontWeight: 300 }}>返信 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', opacity: 0.6, marginLeft: 10 }}>— reply</span></div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, marginTop: 16, opacity: 0.75 }}>before 11 March 2026</p>
        <WabiRSVP rsvp={rsvp} />
      </section>

      <footer style={{ padding: 40, display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', opacity: 0.5 }}>
        <span>YUKI · REN</span><span>京都 · 2026</span>
      </footer>
    </div>
  );
}

function InkCircle({ style }) {
  return (
    <svg viewBox="0 0 100 100" style={style}>
      <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1814" strokeWidth="2.5" strokeDasharray="200 40 80 20" strokeLinecap="round" transform="rotate(-12 50 50)" />
    </svg>
  );
}

function WabiRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 24, color: '#d85a3b' }}>ありがとう, {rsvp.state.name}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <input required placeholder="Your name" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid #1a1814', color: '#1a1814', fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', padding: '10px 0', outline: 'none' }} />
      <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
        {[['yes', '出席 · attending'], ['no', '欠席 · regret']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 20, background: rsvp.state.attending === v ? '#1a1814' : 'transparent', color: rsvp.state.attending === v ? '#f2ede4' : '#1a1814', border: '1px solid #1a1814', cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: 'italic' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 12, padding: 16, background: '#d85a3b', color: '#f2ede4', border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer' }}>送信 · send</button>
    </form>
  );
}

Object.assign(window, { TemplateWabiSabi });


// ===== src/template-polaroid.jsx =====
// 08 · Polaroid — rotated photo cards, tape, handwritten Caveat, scrapbook

function TemplatePolaroid() {
  const t = TEMPLATES.find((x) => x.slug === 'polaroid');
  const cd = useCountdown('2026-07-18T17:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#f0ebe0', color: '#2a2418', fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <DemoBar t={t} />

      {/* Hero — scattered polaroids */}
      <section style={{ padding: '80px 40px 120px', position: 'relative', minHeight: 800 }}>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(80px, 14vw, 200px)', lineHeight: 0.9, color: '#2a2418', fontWeight: 500 }}>
            Dasha &amp; Kirill
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.25em', opacity: 0.6, marginTop: 16 }}>
            MONTENEGRO · SUMMER · 2026
          </div>
        </div>

        {/* Scattered polaroids */}
        <PolaroidCard rotate={-8} top="8%" left="4%" size={180} label="montenegro, 2024" variant="stripes" />
        <PolaroidCard rotate={6} top="12%" right="6%" size={200} label="our first dive" variant="dots" />
        <PolaroidCard rotate={-4} bottom="10%" left="10%" size={170} label="proposal night" variant="cross" />
        <PolaroidCard rotate={10} bottom="6%" right="12%" size={190} label="engagement party" variant="grid" />
        <PolaroidCard rotate={-12} bottom="30%" left="42%" size={160} label="sveti stefan" variant="dots" tape />
      </section>

      {/* Date card */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', background: '#fff', padding: '28px 44px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          transform: 'rotate(-2deg)', border: '1px solid rgba(42,36,24,0.1)',
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.6 }}>SAVE THE DATE</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 72, lineHeight: 1, margin: '12px 0 4px', fontWeight: 500 }}>18 July</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, letterSpacing: '0.3em' }}>2026</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, marginTop: 10, opacity: 0.7 }}>Sveti Stefan, beach</div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '80px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <PolaroidCard rotate={-5} top="0" left="0" size={280} label="how it started · 2021" variant="stripes" tape relative />
          </div>
          <div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 56, lineHeight: 1 }}>Как всё началось</div>
            <p style={{ fontSize: 17, lineHeight: 1.7, marginTop: 20 }}>
              Мы встретились на каяке где-то между двумя островами в Адриатике. У Даши сломалось весло, у Кирилла было запасное.
              С тех пор мы путешествуем, ныряем, спорим про лучший греческий йогурт, и вот — решили, что хотим этого ещё надолго.
            </p>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 28, marginTop: 16, color: '#8a6a4a' }}>— приходите к нам на пляж, будет хорошо! —</p>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 48, color: '#8a6a4a' }}>осталось</div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[['дней', cd.days], ['часов', cd.hours], ['минут', cd.minutes]].map(([l, v]) => (
            <div key={l} style={{ background: '#fff', padding: '20px 28px', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', transform: `rotate(${Math.random() * 6 - 3}deg)`, minWidth: 120 }}>
              <div style={{ fontSize: 72, fontFamily: "'Caveat', cursive", lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', opacity: 0.6, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programme — handwritten list on notebook paper */}
      <section style={{ padding: '80px 40px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          background: '#fefcf5', padding: 48, transform: 'rotate(-0.5deg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.08)', border: '1px solid rgba(42,36,24,0.1)',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 34px, rgba(42,36,24,0.06) 34px, rgba(42,36,24,0.06) 35px)',
        }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 56, color: '#2a2418', lineHeight: 1.1 }}>план дня ↓</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', fontFamily: "'Caveat', cursive", fontSize: 28, lineHeight: 34 + 'px' }}>
            {[
              '17:00 — встреча на пляже',
              '17:30 — церемония (босиком!)',
              '18:30 — просекко + закат',
              '20:00 — ужин, длинный стол',
              '22:00 — музыка до утра',
              '05:00 — плавание тем, кто дожил',
            ].map((l) => (<li key={l} style={{ height: 35 }}>{l}</li>))}
          </ul>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '120px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(72px, 10vw, 140px)', lineHeight: 1 }}>скажи да :)</div>
        <p style={{ fontSize: 16, opacity: 0.7, marginTop: 12 }}>до 1 июня 2026 · потом будет поздно ловить трансфер</p>
        <PolaroidRSVP rsvp={rsvp} />
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontFamily: "'Caveat', cursive", fontSize: 28, opacity: 0.6 }}>
        с любовью, Даша + Кирилл
      </footer>
    </div>
  );
}

function PolaroidCard({ rotate = 0, top, left, right, bottom, size = 180, label, variant = 'stripes', tape = false, relative = false }) {
  return (
    <div style={{
      position: relative ? 'relative' : 'absolute', top, left, right, bottom,
      width: size, background: '#fff', padding: 10, paddingBottom: 32,
      boxShadow: '0 10px 28px rgba(0,0,0,0.15)', transform: `rotate(${rotate}deg)`,
      border: '1px solid rgba(42,36,24,0.08)',
    }}>
      {tape && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(-4deg)', width: 60, height: 18, background: 'rgba(200,180,140,0.55)', border: '1px solid rgba(160,140,100,0.3)' }} />}
      <Placeholder ratio="1/1" variant={variant} fg="#8a6a4a" bg="#e5dcc8" />
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, textAlign: 'center', marginTop: 6, color: '#2a2418' }}>{label}</div>
    </div>
  );
}

function PolaroidRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 40, fontFamily: "'Caveat', cursive", fontSize: 48 }}>ура! увидимся, {rsvp.state.name} ☺</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 40, maxWidth: 500, margin: '40px auto 0', display: 'flex', flexDirection: 'column', gap: 20, background: '#fff', padding: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transform: 'rotate(-1deg)' }}>
      <input required placeholder="твоё имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px dashed rgba(42,36,24,0.3)', padding: '8px 0', fontFamily: "'Caveat', cursive", fontSize: 28, outline: 'none' }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['yes', 'приду!'], ['no', 'не смогу']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 14, background: rsvp.state.attending === v ? '#2a2418' : '#f0ebe0', color: rsvp.state.attending === v ? '#f0ebe0' : '#2a2418', border: '1px solid #2a2418', cursor: 'pointer', fontFamily: "'Caveat', cursive", fontSize: 24 }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ padding: 14, background: '#e8d4a8', color: '#2a2418', border: '1px solid #2a2418', fontFamily: "'Caveat', cursive", fontSize: 28, cursor: 'pointer' }}>отправить →</button>
    </form>
  );
}

Object.assign(window, { TemplatePolaroid });


// ===== src/template-artdeco.jsx =====
// 09 · Art Deco — Cinzel, geometric frames, gold on dark, symmetrical

function TemplateArtDeco() {
  const t = TEMPLATES.find((x) => x.slug === 'artdeco');
  const cd = useCountdown('2026-12-12T19:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#0f0f18', color: '#b8975a', fontFamily: "'Cinzel', serif", minHeight: '100vh' }}>
      <DemoBar t={t} theme="dark" />

      {/* Hero with deco frame */}
      <section style={{ padding: '60px 40px', position: 'relative' }}>
        <DecoFrame>
          <div style={{ padding: '80px 40px', textAlign: 'center' }}>
            <DecoDivider />
            <div style={{ fontSize: 13, letterSpacing: '0.5em', marginTop: 36, opacity: 0.8 }}>
              THE CELEBRATION OF THE MARRIAGE
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.5em', marginTop: 10, opacity: 0.6 }}>— OF —</div>

            <div style={{ fontSize: 'clamp(56px, 9vw, 128px)', marginTop: 40, letterSpacing: '0.15em', fontWeight: 400, lineHeight: 1.1 }}>
              VERA
            </div>
            <div style={{ fontSize: 'clamp(24px, 3vw, 40px)', margin: '20px 0', fontWeight: 400, letterSpacing: '0.4em', opacity: 0.7 }}>&amp;</div>
            <div style={{ fontSize: 'clamp(56px, 9vw, 128px)', letterSpacing: '0.15em', fontWeight: 400, lineHeight: 1.1 }}>
              NIKOLAI
            </div>

            <DecoDivider style={{ marginTop: 48 }} />

            <div style={{ fontSize: 14, letterSpacing: '0.4em', marginTop: 36 }}>
              XII · DECEMBER · MMXXVI
            </div>
            <div style={{ fontSize: 12, letterSpacing: '0.4em', marginTop: 12, opacity: 0.7 }}>
              PRINCIPALITY OF MONACO
            </div>
          </div>
        </DecoFrame>
      </section>

      {/* Countdown */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#15151f' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.5em', opacity: 0.6 }}>— UNTIL THE EVENING —</div>
        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 5vw, 80px)', flexWrap: 'wrap' }}>
          {[['DAYS', cd.days], ['HOURS', cd.hours], ['MIN', cd.minutes], ['SEC', cd.seconds]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 'clamp(56px, 8vw, 120px)', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.4em', marginTop: 14, opacity: 0.6 }}>{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programme */}
      <section style={{ padding: '100px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <DecoDivider />
          <div style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '0.25em', marginTop: 32 }}>PROGRAMME</div>
        </div>
        <div>
          {[
            ['XVI', '16:00', 'RECEPTION', 'Hôtel de Paris · Grand Foyer'],
            ['XVII', '17:30', 'CEREMONY', 'Salle Empire'],
            ['XIX', '19:00', 'DINNER', 'Le Louis XV · Chef Ducasse'],
            ['XXII', '22:00', 'ORCHESTRA', 'Chamber Jazz Ensemble'],
            ['XXIV', '00:00', 'MIDNIGHT', 'Champagne &amp; pyrotechnics'],
          ].map(([rn, time, title, place], i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '60px 80px 1fr 1fr', gap: 20,
              padding: '28px 0', borderTop: '1px solid rgba(184,151,90,0.3)',
              alignItems: 'baseline',
            }}>
              <div style={{ fontSize: 20, letterSpacing: '0.1em', opacity: 0.7 }}>{rn}</div>
              <div style={{ fontSize: 13, letterSpacing: '0.2em' }}>{time}</div>
              <div style={{ fontSize: 22, letterSpacing: '0.15em' }}>{title}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16, textAlign: 'right', opacity: 0.75 }} dangerouslySetInnerHTML={{ __html: place }} />
            </div>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#15151f' }}>
        <DecoDivider />
        <div style={{ fontSize: 11, letterSpacing: '0.5em', marginTop: 36, opacity: 0.7 }}>— ATTIRE —</div>
        <div style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.2em', marginTop: 24 }}>BLACK TIE</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, marginTop: 20, opacity: 0.75 }}>
          Long gowns · dinner jackets · Art Deco welcome
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <DecoFrame padding="40px 32px">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, letterSpacing: '0.5em', opacity: 0.7 }}>— R · S · V · P —</div>
              <div style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '0.15em', marginTop: 24 }}>THE FAVOUR</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, marginTop: 10, opacity: 0.8 }}>of your reply by 1 November 2026</div>
              <ArtDecoRSVP rsvp={rsvp} />
            </div>
          </DecoFrame>
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontSize: 10, letterSpacing: '0.5em', opacity: 0.5 }}>
        V · N · MMXXVI · MONACO
      </footer>
    </div>
  );
}

function DecoFrame({ children, padding }) {
  return (
    <div style={{ position: 'relative', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 24, border: '1px solid #b8975a', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 32, border: '0.5px solid rgba(184,151,90,0.5)', pointerEvents: 'none' }} />
      {/* corner diamonds */}
      {[[24, 24], [24, 'auto'], ['auto', 24], ['auto', 'auto']].map(([top, left], i) => {
        const pos = { top: 24, left: 24 };
        if (i === 1) { delete pos.left; pos.right = 24; }
        if (i === 2) { delete pos.top; pos.bottom = 24; }
        if (i === 3) { delete pos.top; delete pos.left; pos.right = 24; pos.bottom = 24; }
        return (
          <svg key={i} viewBox="0 0 20 20" style={{ position: 'absolute', ...pos, width: 20, height: 20, transform: 'translate(-50%, -50%)' }}>
            <path d="M10 0 L14 10 L10 20 L6 10 Z" fill="#b8975a" />
          </svg>
        );
      })}
      <div style={{ padding: padding || 0 }}>{children}</div>
    </div>
  );
}

function DecoDivider({ style }) {
  return (
    <svg viewBox="0 0 200 20" style={{ width: 240, display: 'block', margin: '0 auto', ...style }}>
      <line x1="10" y1="10" x2="80" y2="10" stroke="#b8975a" strokeWidth="0.5" />
      <line x1="120" y1="10" x2="190" y2="10" stroke="#b8975a" strokeWidth="0.5" />
      <path d="M100 2 L108 10 L100 18 L92 10 Z" fill="none" stroke="#b8975a" strokeWidth="0.8" />
      <circle cx="100" cy="10" r="1.5" fill="#b8975a" />
    </svg>
  );
}

function ArtDecoRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22 }}>Thank you, {rsvp.state.name}. We await you.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input required placeholder="NAME" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid #b8975a', color: '#b8975a', fontSize: 18, padding: '10px 0', outline: 'none', textAlign: 'center', fontFamily: 'inherit', letterSpacing: '0.25em' }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['yes', 'ACCEPT'], ['no', 'DECLINE']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? '#b8975a' : 'transparent', color: rsvp.state.attending === v ? '#0f0f18' : '#b8975a', border: '1px solid #b8975a', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.3em' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 12, padding: 14, background: 'transparent', color: '#b8975a', border: '1px solid #b8975a', fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.35em', cursor: 'pointer' }}>CONFIRM ♦</button>
    </form>
  );
}

Object.assign(window, { TemplateArtDeco });


// ===== src/app.jsx =====
// Root app — routes

function App() {
  const route = useRoute();

  // /templates/[slug]
  if (route.startsWith('/templates/')) {
    const slug = route.slice('/templates/'.length);
    const map = {
      editorial: TemplateEditorial, swiss: TemplateSwiss, garden: TemplateGarden,
      dark: TemplateDark, brutalist: TemplateBrutalist, letterpress: TemplateLetterpress,
      wabisabi: TemplateWabiSabi, polaroid: TemplatePolaroid, artdeco: TemplateArtDeco,
    };
    const Tmpl = map[slug];
    if (Tmpl) return <Tmpl />;
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

