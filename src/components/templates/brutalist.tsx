'use client';

import { useState, useEffect } from 'react';
import { TEMPLATES } from '../templates-data';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';

export function TemplateBrutalist() {
  const t = TEMPLATES.find((x) => x.slug === 'brutalist')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [tick, setTick] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const id = setInterval(() => setTick((x) => !x), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Space Grotesk', 'Arial Black', Arial, sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <DemoBar t={t} />

      {/* Header bar */}
      <div style={{ background: P.ink, color: P.bg, padding: '10px clamp(16px, 3vw, 32px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em' }}>
        <span>DENISIXONE · WEDDING STUDIO</span>
        <span style={{ color: P.accent }}>{t.dateMono}</span>
        <span>ШАБЛОН «{t.name.toUpperCase()}»</span>
      </div>

      {/* Hero — giant names */}
      <section style={{ padding: 'clamp(32px, 4vw, 60px) clamp(16px, 3vw, 32px)', borderBottom: `4px solid ${P.ink}`, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: -20, fontSize: 'clamp(200px, 30vw, 400px)', fontWeight: 900, lineHeight: 0.85, color: P.ink, opacity: 0.04, userSelect: 'none', pointerEvents: 'none' }}>
          {t.dateMono.split('/')[0]}
        </div>
        <h1 style={{ fontSize: 'clamp(72px, 16vw, 240px)', fontWeight: 900, lineHeight: 0.85, margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
          {t.couple.split('×')[0].trim()}
        </h1>
        <div style={{ fontSize: 'clamp(40px, 8vw, 120px)', fontWeight: 900, color: P.accent, lineHeight: 1, margin: 0 }}>×</div>
        <h1 style={{ fontSize: 'clamp(72px, 16vw, 240px)', fontWeight: 900, lineHeight: 0.85, margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
          {t.couple.split('×')[1]?.trim() ?? ''}
        </h1>
        <div style={{ marginTop: 32, display: 'flex', gap: 'clamp(16px, 3vw, 40px)', flexWrap: 'wrap', alignItems: 'baseline' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(14px, 2vw, 20px)', fontWeight: 700, letterSpacing: '0.02em' }}>{t.dateLong.toUpperCase()}</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(12px, 1.5vw, 16px)', color: P.ink2 }}>{t.venue.toUpperCase()} · {t.city.toUpperCase()}</div>
          <div style={{ color: P.accent, fontWeight: 900, fontSize: 'clamp(14px, 2vw, 20px)' }}>{tick ? '█' : ' '}</div>
        </div>
      </section>

      {/* Countdown — raw numbers */}
      <section style={{ padding: 'clamp(24px, 3vw, 40px) clamp(16px, 3vw, 32px)', background: P.ink, color: P.bg, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
        {[['D', cd.days, 'DAYS'], ['H', cd.hours, 'HRS'], ['M', cd.minutes, 'MIN'], ['S', cd.seconds, 'SEC']].map(([k, v, label], i) => (
          <div key={k as string} style={{ padding: 'clamp(16px, 2vw, 28px)', borderRight: i < 3 ? `2px solid ${P.bg}22` : 'none' }}>
            <div style={{ fontSize: 'clamp(48px, 8vw, 120px)', fontWeight: 900, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: P.accent }}>{String(v).padStart(2, '0')}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', marginTop: 4, opacity: 0.5 }}>{label as string}</div>
          </div>
        ))}
      </section>

      {/* Story — two columns, stark */}
      <section style={{ padding: 'clamp(40px, 5vw, 80px) clamp(16px, 3vw, 32px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: `4px solid ${P.ink}` }}>
        {t.story.map((s, i) => (
          <div key={i} style={{ padding: 'clamp(24px, 3vw, 40px)', borderRight: i === 0 ? `4px solid ${P.ink}` : 'none', borderLeft: i === 1 ? 'none' : 'none' }}>
            <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: '0 0 20px' }}>{s.heading}</h2>
            <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>{s.body}</p>
          </div>
        ))}
      </section>

      {/* Quote — full width, huge */}
      <section style={{ padding: 'clamp(40px, 5vw, 80px) clamp(16px, 3vw, 32px)', background: P.accent, borderBottom: `4px solid ${P.ink}` }}>
        <blockquote style={{ margin: 0, fontSize: 'clamp(28px, 5vw, 80px)', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.03em', color: P.bg }}>
          {t.quote.text}
        </blockquote>
      </section>

      {/* Programme — table-like */}
      <section style={{ padding: 'clamp(40px, 5vw, 80px) clamp(16px, 3vw, 32px)', borderBottom: `4px solid ${P.ink}` }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: '0 0 32px' }}>ПРОГРАММА</h2>
        {t.program.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 'clamp(16px, 2.5vw, 40px)', padding: '20px 0', borderTop: `2px solid ${P.ink}`, alignItems: 'baseline' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: P.accent }}>{p.time}</div>
            <div style={{ fontSize: 'clamp(20px, 2.8vw, 36px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{p.title}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textTransform: 'uppercase', color: P.ink2, textAlign: 'right' }}>{p.place}</div>
          </div>
        ))}
        <div style={{ borderTop: `2px solid ${P.ink}` }} />
      </section>

      {/* Details grid */}
      <section style={{ padding: 'clamp(40px, 5vw, 80px) clamp(16px, 3vw, 32px)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4, borderBottom: `4px solid ${P.ink}` }}>
        {[['ДРЕСС-КОД', t.details.dressCode], ['ПОДАРКИ', t.details.gift], ['ДЕТИ', t.details.kids], ['ТРАНСФЕР', t.details.transfer]].map(([k, v], i) => (
          <div key={k as string} style={{ padding: 'clamp(20px, 2.5vw, 32px)', background: i % 2 === 0 ? P.bg2 : P.bg, border: `2px solid ${P.ink}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: P.accent, marginBottom: 10 }}>{k as string}</div>
            <div style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', fontWeight: 700, textTransform: 'uppercase' }}>{v as string}</div>
          </div>
        ))}
      </section>

      {/* RSVP */}
      <section style={{ padding: 'clamp(40px, 5vw, 80px) clamp(16px, 3vw, 32px)' }}>
        <h2 style={{ fontSize: 'clamp(40px, 7vw, 100px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', margin: '0 0 8px' }}>R.S.V.P.</h2>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: '0.08em', color: P.ink2, marginBottom: 40 }}>ДО {t.rsvpDeadline.toUpperCase()}</div>

        {rsvp.sent ? (
          <div style={{ padding: 28, background: P.accent, color: P.bg, fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 900, textTransform: 'uppercase', maxWidth: 520 }}>
            ПРИНЯТО. {(rsvp.state.name || 'ТЫ').toUpperCase()}, ЖДЁМ.
          </div>
        ) : (
          <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 560 }}>
            <BrutalistInput label="ИМЯ" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} accent={P.accent} bg={P.bg} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: -2 }}>
              {[['yes', 'ДА / БУДУ'], ['no', 'НЕТ / НЕ СМОГУ']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => rsvp.update('attending', v)}
                  style={{ padding: '20px 16px', background: rsvp.state.attending === v ? P.accent : P.bg, color: rsvp.state.attending === v ? P.bg : P.ink, border: `2px solid ${P.ink}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', transition: 'background 150ms' }}>
                  {l}
                </button>
              ))}
            </div>
            <button type="submit" style={{ marginTop: -2, padding: '22px 28px', background: P.ink, color: P.bg, border: `2px solid ${P.ink}`, fontSize: 'clamp(14px, 1.8vw, 20px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em', cursor: 'pointer', fontFamily: 'inherit' }}>
              ОТПРАВИТЬ →
            </button>
          </form>
        )}
      </section>

      <div style={{ background: P.ink, color: P.bg, padding: '14px clamp(16px, 3vw, 32px)', display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em' }}>
        <span>{t.name.toUpperCase()} · DENISIXONE</span><span>{t.dateMono}</span>
      </div>
    </div>
  );
}

function BrutalistInput({ label, value, onChange, required, ink, accent, bg }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; ink: string; accent: string; bg: string;
}) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: accent, padding: '8px 0 4px', borderTop: `2px solid ${ink}`, borderLeft: `2px solid ${ink}`, borderRight: `2px solid ${ink}`, paddingLeft: 12 }}>{label}</div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ width: '100%', padding: '14px 12px', border: `2px solid ${ink}`, marginTop: -2, background: bg, fontFamily: 'inherit', fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 700, color: ink, outline: 'none', textTransform: 'uppercase', boxSizing: 'border-box' }} />
    </div>
  );
}
