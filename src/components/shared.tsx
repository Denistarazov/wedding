'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: unknown;
}

export interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: (e?: React.MouseEvent) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'light';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-label'?: string;
}

export interface EyebrowProps {
  children: React.ReactNode;
  number?: string;
  align?: 'left' | 'center';
  tone?: 'default' | 'light';
}

export interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  role?: string;
  'aria-selected'?: boolean;
  'aria-pressed'?: boolean;
  size?: 'sm' | 'md';
}

export interface ProcessStepProps {
  number: string;
  title: string;
  body: string;
}

export interface FaqItemProps {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}

export interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function scrollToRoute(route: string, smooth: boolean): void {
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

export function useRoute(): string {
  const pathname = usePathname() || '/';
  const [hash, setHash] = useState('');

  useEffect(() => {
    const syncHash = () => { setHash(window.location.hash || ''); };
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

  useEffect(() => { scrollToRoute(route, false); }, [route]);

  return route;
}

export function navigate(path: string): void {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('popstate'));
}

// ─── Link ─────────────────────────────────────────────────────────────────────

export function Link({ to, children, className, style, onClick, ...rest }: LinkProps) {
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

// ─── Reveal on scroll ─────────────────────────────────────────────────────────

export function useReveal(): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement>(null);
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

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export function Reveal({ children, delay = 0, y = 14, as = 'div', style, ...rest }: RevealProps) {
  const [ref, visible] = useReveal();
  return React.createElement(
    as,
    {
      ref,
      style: {
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.7s ${delay}s cubic-bezier(.2,.8,.2,1), transform 0.7s ${delay}s cubic-bezier(.2,.8,.2,1)`,
        ...style,
      },
      ...rest,
    },
    children,
  );
}

// ─── TopNav ───────────────────────────────────────────────────────────────────

export function TopNav({ dark = false }: { dark?: boolean }) {
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
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const bg = dark ? 'rgba(20,16,10,0.72)' : 'rgba(245,241,234,0.72)';
  const fg = dark ? '#f5f1ea' : '#2a2418';
  const line = dark ? 'rgba(245,241,234,0.1)' : 'rgba(42,36,24,0.1)';

  const navItems: [string, string][] = [
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

          <nav className="nav-desktop" aria-label="Главное меню" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
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

// ─── Footer ───────────────────────────────────────────────────────────────────

export function Footer() {
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

type FooterLink = [string, string, boolean?];

function FooterCol({ title, links }: { title: string; links: FooterLink[] }) {
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

// ─── Button ───────────────────────────────────────────────────────────────────

export function Button({
  children, to, onClick, type = 'button',
  variant = 'primary', size = 'md', tone = 'default',
  disabled, loading, className, ...rest
}: ButtonProps) {
  const sizeMap: Record<string, { fontSize: number; padding: string }> = {
    sm: { fontSize: 11, padding: '8px 14px' },
    md: { fontSize: 12, padding: '14px 22px' },
    lg: { fontSize: 13, padding: '18px 28px' },
  };
  const base: React.CSSProperties = {
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

  if (to && !disabled && !loading) {
    return <Link to={to} className={cls} style={finalStyle} {...(rest as Partial<LinkProps>)}>{content}</Link>;
  }
  return (
    <button
      type={type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled || loading}
      aria-disabled={disabled || loading || undefined}
      className={cls}
      style={finalStyle}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >{content}</button>
  );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────

export function Eyebrow({ children, number, align = 'left', tone = 'default' }: EyebrowProps) {
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

// ─── Chip ─────────────────────────────────────────────────────────────────────

export function Chip({ children, active, onClick, role, 'aria-selected': ariaSelected, 'aria-pressed': ariaPressed, size = 'md' }: ChipProps) {
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

// ─── ProcessStep ──────────────────────────────────────────────────────────────

export function ProcessStep({ number, title, body }: ProcessStepProps) {
  return (
    <li style={{ borderTop: '1px solid var(--ink)', paddingTop: 22 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', color: 'var(--muted)' }}>STEP {number}</div>
      <div className="serif" style={{ fontSize: 28, fontWeight: 400, margin: '14px 0 12px', letterSpacing: '-0.01em' }}>{title}</div>
      <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', margin: 0 }}>{body}</p>
    </li>
  );
}

// ─── FaqItem ──────────────────────────────────────────────────────────────────

export function FaqItem({ question, answer, open, onToggle, index }: FaqItemProps) {
  const panelId = `faq-panel-${index}`;
  const btnId = `faq-btn-${index}`;
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <dt>
        <button
          id={btnId} type="button" aria-expanded={open} aria-controls={panelId}
          onClick={onToggle}
          style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 0, cursor: 'pointer', padding: '28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, fontFamily: 'inherit', color: 'inherit', transition: 'opacity var(--t-fast) var(--ease)' }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <span className="serif" style={{ fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 400, letterSpacing: '-0.01em' }}>{question}</span>
          <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, transition: 'transform 0.25s var(--ease)', transform: open ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
        </button>
      </dt>
      <dd
        id={panelId} role="region" aria-labelledby={btnId} hidden={!open}
        style={{ margin: 0, maxHeight: open ? 400 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.35s ease, opacity 0.25s ease, padding 0.25s', padding: open ? '0 0 28px 0' : '0' }}
      >
        <p style={{ margin: 0, fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 720 }}>{answer}</p>
      </dd>
    </div>
  );
}

// ─── NavLink ──────────────────────────────────────────────────────────────────

export function NavLink({ to, children, onClick }: NavLinkProps) {
  return (
    <Link to={to} onClick={onClick} className="nav-link" style={{ fontSize: 14, opacity: 0.78 }}>
      {children}
    </Link>
  );
}

// Re-export Image so templates can use it without importing next/image directly
export { Image };
