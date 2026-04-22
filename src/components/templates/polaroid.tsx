'use client';

import { useCountdown, DemoBar, useRsvp } from '../template-shell';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';

export function TemplatePolaroid() {
  const t = TEMPLATES.find((x) => x.slug === 'polaroid')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());

  // Each program item gets a slight rotation for the "scattered" feel
  const rotations = [-2.8, 1.5, -1.2, 2.1, -3.0];

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Caveat', 'Segoe Script', cursive, sans-serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Hero */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', textAlign: 'center', position: 'relative' }}>
        {/* Film grain overlay illusion */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(42,36,24,0.015) 2px, rgba(42,36,24,0.015) 4px)', pointerEvents: 'none' }} />

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: P.ink2, marginBottom: 28 }}>FILM No. 001 · {t.dateMono}</div>

        {/* Main polaroid */}
        <div style={{ display: 'inline-block', background: '#fff', padding: '20px 20px 52px', boxShadow: '0 8px 40px rgba(42,36,24,0.18)', transform: 'rotate(-1.5deg)', maxWidth: 440, width: '100%' }}>
          <AssetImage src="/assets/images/polaroid-beach-golden-hour.png" alt={`${a} и ${b}`} ratio="1/1" />
          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 'clamp(22px, 3vw, 32px)', color: P.ink, fontWeight: 600 }}>
            {a} &amp; {b}
          </div>
        </div>

        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 360, margin: '48px auto 0' }}>
          {[['Дней', cd.days], ['Часов', cd.hours], ['Минут', cd.minutes], ['Секунд', cd.seconds]].map(([k, v]) => (
            <div key={k as string} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', color: P.ink2, marginTop: 4 }}>{k}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, fontSize: 'clamp(16px, 2vw, 22px)', color: P.ink2 }}>{t.venue} · {t.city}</div>
      </section>

      {/* Story — two polaroid cards */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: P.ink2, marginBottom: 32, textAlign: 'center' }}>НАША ИСТОРИЯ</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(20px, 3vw, 48px)', maxWidth: 720, margin: '0 auto', alignItems: 'start' }}>
          {t.story.map((s, i) => (
            <div key={i} style={{ background: '#fff', padding: '20px 20px 40px', boxShadow: '0 6px 28px rgba(42,36,24,0.14)', transform: `rotate(${i === 0 ? -1.8 : 2.2}deg)` }}>
              <div style={{ background: P.bg, height: 160, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                {i === 0 ? '🌊' : '📷'}
              </div>
              <h3 style={{ fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 600, margin: '0 0 8px' }}>{s.heading}</h3>
              <p style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6, margin: 0, color: P.ink2, fontStyle: 'italic' }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', margin: 'clamp(40px, 5vw, 60px) auto 0', maxWidth: 560, padding: '24px', borderTop: `2px solid ${P.ink2}33`, borderBottom: `2px solid ${P.ink2}33` }}>
          <div style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontStyle: 'italic', lineHeight: 1.5, color: P.ink }}>
            «{t.quote.text}»
          </div>
          <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.ink2, letterSpacing: '0.1em' }}>— {t.quote.author}</div>
        </div>
      </section>

      {/* Timeline — polaroid cards for each program item */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: P.ink2, marginBottom: 40, textAlign: 'center' }}>НАШ ДЕНЬ</div>
        <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
          {/* Vertical tape line */}
          <div aria-hidden="true" style={{ position: 'absolute', left: 60, top: 0, bottom: 0, width: 2, background: `${P.ink}14` }} />

          {t.program.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, marginBottom: 32, alignItems: 'center' }}>
              {/* Time label */}
              <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: P.ink, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-block', background: P.accent, padding: '4px 8px', marginRight: -12 }}>{p.time}</div>
              </div>
              {/* Polaroid card */}
              <div style={{ background: '#fff', padding: '14px 14px 32px', boxShadow: '0 4px 20px rgba(42,36,24,0.12)', transform: `rotate(${rotations[i] ?? 0}deg)`, position: 'relative' }}>
                {/* Tape strip */}
                <div aria-hidden="true" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 48, height: 20, background: `${P.accent}88`, opacity: 0.8 }} />
                <div style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.ink2 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Details strip */}
      <section style={{ padding: 'clamp(32px, 4vw, 60px) clamp(20px, 5vw, 60px)', background: P.ink2 + '18' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(16px, 2vw, 24px)', maxWidth: 640, margin: '0 auto' }}>
          {[['Стиль', t.details.dressCode, '👗'], ['Подарки', t.details.gift, '🎞'], ['Дети', t.details.kids, '🌊'], ['Трансфер', t.details.transfer, '✈️']].map(([k, v, icon]) => (
            <div key={k as string} style={{ background: '#fff', padding: 20, boxShadow: '0 2px 12px rgba(42,36,24,0.08)', transform: `rotate(${Math.random() > 0.5 ? 0.8 : -0.8}deg)` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink2, marginBottom: 6 }}>{k}</div>
              <div style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          {/* Big polaroid frame for RSVP */}
          <div style={{ background: '#fff', padding: '32px 28px 52px', boxShadow: '0 8px 40px rgba(42,36,24,0.16)', display: 'inline-block', width: '100%', transform: 'rotate(-0.5deg)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: P.ink2, marginBottom: 12 }}>R.S.V.P.</div>
            <div style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, marginBottom: 8 }}>Ответьте</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: P.ink2, marginBottom: 28 }}>до {t.rsvpDeadline}</div>

            {rsvp.sent ? (
              <div style={{ fontSize: 20, fontStyle: 'italic', color: P.ink2, padding: '20px 0' }}>
                Получено 📸<br />Ждём тебя, {rsvp.state.name || 'друг'}!
              </div>
            ) : (
              <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
                <PolaroidField label="Имя" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} ink2={P.ink2} />
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink2, marginBottom: 10 }}>Приду?</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[['yes', '✓ Буду!'], ['no', '✗ Не смогу']].map(([v, l]) => (
                      <button key={v} type="button" onClick={() => rsvp.update('attending', v)}
                        style={{ flex: 1, padding: '10px 12px', background: rsvp.state.attending === v ? P.ink : 'transparent', color: rsvp.state.attending === v ? '#fff' : P.ink, border: `2px solid ${P.ink}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 16, transition: 'all 150ms' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" style={{ padding: '14px 20px', background: P.ink, color: '#fff', border: 0, fontFamily: 'inherit', fontSize: 18, cursor: 'pointer', letterSpacing: '0.04em' }}>
                  Отправить →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer style={{ padding: '24px clamp(20px, 5vw, 60px)', borderTop: `1px solid ${P.ink}22`, display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: P.ink2 }}>
        <span>{t.name} · denisixone</span><span>{t.dateMono} · {t.city}</span>
      </footer>
    </div>
  );
}

function PolaroidField({ label, value, onChange, required, ink, ink2 }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; ink: string; ink2: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: ink2 }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ background: 'transparent', border: 0, borderBottom: `2px solid ${ink}`, padding: '8px 0', fontFamily: 'inherit', fontSize: 20, color: ink, outline: 'none' }} />
    </label>
  );
}
