'use client';

import { useState, useEffect } from 'react';
import { Link, Button } from './shared';
import type { TemplateData } from './templates-data';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RsvpState {
  name: string;
  attending: 'yes' | 'no';
  guests: number;
  dietary: string;
}

export interface UseRsvpReturn {
  state: RsvpState;
  update: (key: keyof RsvpState, value: string | number) => void;
  submit: (e?: React.FormEvent) => void;
  sent: boolean;
}

// ─── useCountdown ─────────────────────────────────────────────────────────────

export function useCountdown(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(target);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  const d = Math.max(0, target - now);
  return {
    days:    Math.floor(d / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((d / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((d / (1000 * 60)) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

// ─── DemoBar ──────────────────────────────────────────────────────────────────

export function DemoBar({ t, theme = 'light' }: { t: TemplateData; theme?: 'light' | 'dark' }) {
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

// ─── useRsvp ──────────────────────────────────────────────────────────────────

export function useRsvp(): UseRsvpReturn {
  const [state, setState] = useState<RsvpState>({ name: '', attending: 'yes', guests: 1, dietary: '' });
  const [sent, setSent] = useState(false);
  const update = (k: keyof RsvpState, v: string | number) => setState((s) => ({ ...s, [k]: v }));
  const submit = (e?: React.FormEvent) => { e?.preventDefault?.(); setSent(true); };
  return { state, update, submit, sent };
}
