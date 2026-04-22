'use client';

import { useState } from 'react';
import { TEMPLATES } from '../templates-data';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';

/* Memphis palette — bright accent blocks */
const COLORS = ['#ff3f5e', '#ffca3a', '#6bcb77', '#4d96ff', '#ff6b6b', '#c77dff'];

function getColor(i: number) { return COLORS[i % COLORS.length]; }

function ZigZag({ color, bg }: { color: string; bg: string }) {
  const n = 12;
  const w = 100 / n;
  const pts = Array.from({ length: n + 1 }, (_, i) => `${i * w},${i % 2 === 0 ? 0 : 100}`).join(' ');
  return (
    <svg viewBox={`0 0 100 100`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 20 }}>
      <polyline points={pts} stroke={color} strokeWidth="6" fill="none" vectorEffect="non-scaling-stroke" />
      <rect width="100" height="100" fill={bg} />
      <polyline points={pts} stroke={color} strokeWidth="4" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Dots({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 20" style={{ width: 60, display: 'block', opacity: 0.6 }}>
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={6 + i * 12} cy="10" r="4" fill={color} />)}
    </svg>
  );
}

export function TemplateMemphis() {
  const t = TEMPLATES.find((x) => x.slug === 'memphis')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Space Grotesk', 'Arial Rounded MT Bold', Arial, sans-serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Hero — big colorful name blocks */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 3vw, 32px) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {/* Name block */}
          <div style={{ background: getColor(0), padding: 'clamp(28px, 4vw, 52px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', color: '#fff8' }}>Свадьба</div>
            <h1 style={{ fontSize: 'clamp(52px, 11vw, 140px)', fontWeight: 900, lineHeight: 0.88, margin: 0, letterSpacing: '-0.04em', color: '#fff' }}>{a}</h1>
          </div>
          {/* Ampersand block */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 8 }}>
            <div style={{ background: getColor(3), padding: 'clamp(20px, 3vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 'clamp(60px, 10vw, 120px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>&amp;</span>
            </div>
            <div style={{ background: getColor(1), padding: 'clamp(20px, 3vw, 40px)', display: 'flex', alignItems: 'flex-end' }}>
              <h1 style={{ fontSize: 'clamp(40px, 8vw, 100px)', fontWeight: 900, lineHeight: 0.88, margin: 0, letterSpacing: '-0.04em', color: P.ink }}>{b}</h1>
            </div>
          </div>
        </div>

        {/* Date + venue strip */}
        <div style={{ background: P.ink, color: P.bg, padding: 'clamp(14px, 2vw, 22px) clamp(16px, 3vw, 32px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(12px, 1.8vw, 16px)', fontWeight: 700, letterSpacing: '0.04em' }}>{t.dateMono}</div>
          <Dots color={getColor(0)} />
          <div style={{ fontSize: 'clamp(12px, 1.8vw, 16px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.venue} · {t.city}</div>
        </div>
      </section>

      {/* Countdown — colorful cells */}
      <section style={{ padding: '8px clamp(16px, 3vw, 32px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[['Дней', cd.days, 0], ['Часов', cd.hours, 2], ['Минут', cd.minutes, 3], ['Секунд', cd.seconds, 5]].map(([k, v, ci]) => (
            <div key={k as string} style={{ background: getColor(ci as number), padding: 'clamp(16px, 2.5vw, 28px) 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', fontWeight: 900, fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: '#fff' }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', opacity: 0.8, marginTop: 4 }}>{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story — asymmetric blocks */}
      <section style={{ padding: 'clamp(24px, 4vw, 40px) clamp(16px, 3vw, 32px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {t.story.map((s, i) => (
          <div key={i} style={{ background: i === 0 ? P.bg2 : getColor(4) + '22', border: `3px solid ${getColor(i + 1)}`, padding: 'clamp(20px, 3vw, 36px)' }}>
            <div style={{ width: 32, height: 6, background: getColor(i + 1), marginBottom: 16, borderRadius: 3 }} />
            <h2 style={{ fontSize: 'clamp(18px, 2.2vw, 26px)', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.01em' }}>{s.heading}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, color: P.ink2 }}>{s.body}</p>
          </div>
        ))}
      </section>

      {/* Quote — full-width accent strip */}
      <section style={{ margin: '8px clamp(16px, 3vw, 32px)', background: getColor(2), padding: 'clamp(24px, 4vw, 48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Dots color="#fff" />
          <blockquote style={{ margin: 0, flex: 1, minWidth: 200, fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.01em', color: '#fff' }}>
            «{t.quote.text}»
          </blockquote>
          <Dots color="#fff" />
        </div>
      </section>

      {/* Programme — bold table */}
      <section style={{ padding: 'clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 14, height: 14, background: getColor(0), borderRadius: '50%', flexShrink: 0 }} />
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Программа</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {t.program.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 0, background: i % 2 === 0 ? P.bg2 : P.bg }}>
              <div style={{ background: getColor(i), padding: 'clamp(12px, 2vw, 20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                {p.time}
              </div>
              <div style={{ padding: 'clamp(12px, 2vw, 20px)', borderBottom: `2px solid ${P.bg}` }}>
                <div style={{ fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 800 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: P.ink2, marginTop: 2 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details — colorful 2×2 grid */}
      <section style={{ padding: '0 clamp(16px, 3vw, 32px) clamp(24px, 4vw, 48px)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {[['Дресс-код', t.details.dressCode, 5], ['Подарки', t.details.gift, 0], ['Дети', t.details.kids, 2], ['Трансфер', t.details.transfer, 3]].map(([k, v, ci]) => (
          <div key={k as string} style={{ padding: 'clamp(16px, 2.5vw, 28px)', border: `3px solid ${getColor(ci as number)}` }}>
            <div style={{ width: 20, height: 20, background: getColor(ci as number), borderRadius: '50%', marginBottom: 10 }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: P.ink2, marginBottom: 6 }}>{k as string}</div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4 }}>{v as string}</div>
          </div>
        ))}
      </section>

      {/* RSVP */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 3vw, 32px)' }}>
        <div style={{ background: P.ink, color: P.bg, padding: 'clamp(28px, 4vw, 56px)', maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            {COLORS.slice(0, 5).map((c, i) => <div key={i} style={{ width: 14, height: 14, background: c, borderRadius: '50%', flexShrink: 0 }} />)}
          </div>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 900, margin: '12px 0 8px', letterSpacing: '-0.04em', lineHeight: 0.92 }}>R.S.V.P.</h2>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: P.bg, opacity: 0.55, marginBottom: 32, letterSpacing: '0.1em' }}>до {t.rsvpDeadline.toUpperCase()}</div>

          {rsvp.sent ? (
            <div style={{ padding: 24, border: `3px solid ${getColor(0)}`, color: getColor(0), fontSize: 20, fontWeight: 800 }}>
              YES! Ждём тебя, {rsvp.state.name || 'друг'}! 🎉
            </div>
          ) : (
            <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <MemphisInput label="Имя" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required bg={P.bg} ink={P.ink} accent={getColor(0)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[['yes', 'ДА, БУДУ! 🎊', 2], ['no', 'Не смогу 😢', 0]].map(([v, l, ci]) => (
                  <button key={v as string} type="button" onClick={() => rsvp.update('attending', v as string)}
                    style={{ padding: '14px 10px', background: rsvp.state.attending === v ? getColor(ci as number) : 'transparent', color: P.bg, border: `3px solid ${getColor(ci as number)}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(12px, 1.5vw, 15px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.01em', transition: 'background 150ms' }}>
                    {l}
                  </button>
                ))}
              </div>
              <button type="submit" style={{ padding: '18px 24px', background: getColor(0), color: '#fff', border: 0, fontFamily: 'inherit', fontSize: 'clamp(14px, 1.8vw, 18px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', cursor: 'pointer' }}>
                Отправить ответ →
              </button>
            </form>
          )}
        </div>
      </section>

      <div style={{ padding: '16px clamp(16px, 3vw, 32px)', display: 'flex', justifyContent: 'space-between', background: P.ink, color: P.bg, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em' }}>
        <span>{t.name.toUpperCase()} · DENISIXONE</span>
        <div style={{ display: 'flex', gap: 6 }}>{COLORS.slice(0, 4).map((c, i) => <div key={i} style={{ width: 10, height: 10, background: c, borderRadius: '50%' }} />)}</div>
        <span>{t.dateMono}</span>
      </div>
    </div>
  );
}

function MemphisInput({ label, value, onChange, required, bg, ink, accent }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; bg: string; ink: string; accent: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: bg, opacity: 0.55, marginBottom: 6 }}>{label}</div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ width: '100%', background: 'transparent', border: 0, borderBottom: `3px solid ${accent}`, padding: '10px 0', fontFamily: 'inherit', fontSize: 20, fontWeight: 700, color: bg, outline: 'none', boxSizing: 'border-box' }} />
    </div>
  );
}
