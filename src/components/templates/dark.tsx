'use client';

import { useState } from 'react';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';

export function TemplateDark() {
  const t = TEMPLATES.find((x) => x.slug === 'dark')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());
  const [dot, setDot] = useState(0);

  const sections = ['Главная', 'История', 'Программа', 'Детали', 'RSVP'];

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Cormorant Garamond', Georgia, serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <DemoBar t={t} theme="dark" />

      {/* Dot nav */}
      <nav aria-label="Навигация" style={{ position: 'fixed', right: 'clamp(16px, 2.5vw, 32px)', top: '50%', transform: 'translateY(-50%)', zIndex: 50, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sections.map((label, i) => (
          <button key={label} onClick={() => { setDot(i); document.getElementById(`dark-s${i}`)?.scrollIntoView({ behavior: 'smooth' }); }}
            aria-label={label}
            style={{ width: 8, height: 8, borderRadius: '50%', border: `1px solid ${P.accent}`, background: dot === i ? P.accent : 'transparent', cursor: 'pointer', padding: 0, transition: 'background 300ms' }} />
        ))}
      </nav>

      {/* 0 — Hero */}
      <section id="dark-s0" onMouseEnter={() => setDot(0)} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', position: 'relative', borderBottom: `1px solid ${P.ink2}22` }}>
        {/* Gold ornament line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)` }} />

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.35em', color: P.accent, marginBottom: 40, textTransform: 'uppercase' }}>{t.dateMono}</div>

        <div style={{ fontSize: 'clamp(10px, 1.2vw, 13px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: P.ink2, marginBottom: 20 }}>Приглашают на свадьбу</div>
        <h1 style={{ fontSize: 'clamp(60px, 13vw, 180px)', fontWeight: 300, letterSpacing: '-0.04em', lineHeight: 0.88, margin: 0, fontStyle: 'italic' }}>
          {a}<br /><span style={{ color: P.accent, fontSize: '0.55em', fontStyle: 'normal', letterSpacing: '0.1em' }}>&amp;</span><br />{b}
        </h1>

        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink2 }}>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${P.ink2}44)` }} />
          {t.venue} · {t.city}
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${P.ink2}44, transparent)` }} />
        </div>

        {/* Countdown */}
        <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
          {[['Дней', cd.days], ['Часов', cd.hours], ['Минут', cd.minutes], ['Секунд', cd.seconds]].map(([k, v]) => (
            <div key={k as string} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 300, fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: P.accent }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.ink2, marginTop: 8 }}>{k}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)` }} />
      </section>

      {/* 1 — Story */}
      <section id="dark-s1" onMouseEnter={() => setDot(1)} style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 8vw, 120px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 80px)', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.accent, marginBottom: 24, textTransform: 'uppercase' }}>I · История</div>
          {t.story.map((s, i) => (
            <div key={i} style={{ marginTop: i > 0 ? 36 : 0 }}>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', margin: '0 0 14px', lineHeight: 1.1 }}>{s.heading}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, margin: 0, color: P.ink2 }}>{s.body}</p>
            </div>
          ))}
          <blockquote style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${P.accent}33`, fontStyle: 'italic', fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 300, lineHeight: 1.4, color: P.ink }}>
            «{t.quote.text}»
            <footer style={{ marginTop: 12, fontStyle: 'normal', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: P.accent }}>— {t.quote.author}</footer>
          </blockquote>
        </div>
        <div>
          <AssetImage src="/assets/images/dark-cinematic-couple.png" alt={`${a} и ${b}`} ratio="3/4" style={{ border: `1px solid ${P.accent}22` }} />
        </div>
      </section>

      {/* 2 — Programme */}
      <section id="dark-s2" onMouseEnter={() => setDot(2)} style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 8vw, 120px)', borderTop: `1px solid ${P.ink2}22`, borderBottom: `1px solid ${P.ink2}22` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.accent, marginBottom: 40, textTransform: 'uppercase' }}>II · Программа</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {t.program.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 32, padding: '24px 0', borderBottom: `1px solid ${P.ink2}18` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: P.accent, fontVariantNumeric: 'tabular-nums' }}>{p.time}</div>
              <div>
                <div style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', fontStyle: 'italic', fontWeight: 300 }}>{p.title}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginTop: 6, color: P.ink2 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — Details */}
      <section id="dark-s3" onMouseEnter={() => setDot(3)} style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 8vw, 120px)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.accent, marginBottom: 40, textTransform: 'uppercase' }}>III · Детали</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
          {[['Дресс-код', t.details.dressCode], ['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer]].map(([k, v]) => (
            <div key={k as string} style={{ padding: 28, border: `1px solid ${P.accent}22`, background: P.bg2 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.accent, marginBottom: 10 }}>{k}</div>
              <div style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 300, lineHeight: 1.5, color: P.ink }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 — RSVP */}
      <section id="dark-s4" onMouseEnter={() => setDot(4)} style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 8vw, 120px)', textAlign: 'center', borderTop: `1px solid ${P.ink2}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)` }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.accent, marginBottom: 24, textTransform: 'uppercase' }}>IV · R.S.V.P.</div>
        <h2 style={{ fontSize: 'clamp(40px, 7vw, 100px)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 12px' }}>Ответьте до</h2>
        <div style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', color: P.accent, marginBottom: 48 }}>{t.rsvpDeadline}</div>

        {rsvp.sent ? (
          <div style={{ padding: 32, border: `1px solid ${P.accent}44`, maxWidth: 480, margin: '0 auto', fontStyle: 'italic', fontSize: 18, color: P.ink2 }}>
            Получено. До встречи, {rsvp.state.name || 'гость'}.
          </div>
        ) : (
          <form onSubmit={rsvp.submit} style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <DarkField label="Имя" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} ink2={P.ink2} accent={P.accent} />
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink2, marginBottom: 12, textAlign: 'left' }}>Присутствие</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[['yes', 'Буду'], ['no', 'Не смогу']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => rsvp.update('attending', v)}
                    style={{ flex: 1, padding: '14px 20px', background: rsvp.state.attending === v ? P.accent : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.accent}44`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontStyle: 'italic', transition: 'all 250ms' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" style={{ padding: '18px 32px', background: 'transparent', color: P.accent, border: `1px solid ${P.accent}`, fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", transition: 'all 250ms' }}>
              Отправить ответ →
            </button>
          </form>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)` }} />
      </section>

      <footer style={{ padding: '28px clamp(20px, 8vw, 120px)', display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', color: P.ink2 }}>
        <span>{t.name} · denisixone</span><span>{t.dateMono}</span>
      </footer>
    </div>
  );
}

function DarkField({ label, value, onChange, required, ink, ink2, accent }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; ink: string; ink2: string; accent: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ink2 }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${accent}44`, padding: '12px 0', fontFamily: 'inherit', fontSize: 18, color: ink, outline: 'none', fontStyle: 'italic' }} />
    </label>
  );
}
