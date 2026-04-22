'use client';

import { useState, useEffect } from 'react';
import { TEMPLATES } from '../templates-data';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';

/* Glitch text — duplicates element via CSS pseudo trick using inline animation */
function Glitch({ text, color, size }: { text: string; color: string; size?: string }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 60), 80);
    return () => clearInterval(id);
  }, []);
  const active = frame < 3; // glitch fires ~4% of frames
  const offsets = ['-3px', '3px'];
  const glitchStyle: React.CSSProperties = active
    ? { textShadow: `${offsets[frame % 2]} 0 #00fff7, ${offsets[(frame + 1) % 2]} 0 ${color}`, letterSpacing: '-0.01em' }
    : {};
  return (
    <span style={{ fontSize: size, fontWeight: 900, color, transition: 'text-shadow 80ms', ...glitchStyle }}>
      {text}
    </span>
  );
}

function NeonGlow({ color, style }: { color: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden="true" style={{ height: 1, background: color, boxShadow: `0 0 8px 2px ${color}88, 0 0 24px 4px ${color}44`, ...style }} />
  );
}

export function TemplateNeon() {
  const t = TEMPLATES.find((x) => x.slug === 'neon')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());
  const cyan = '#00fff7';

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'JetBrains Mono', 'Courier New', monospace", minHeight: '100vh' }}>
      <DemoBar t={t} theme="dark" />

      {/* Scanline overlay */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,247,0.02) 3px, rgba(0,255,247,0.02) 4px)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.35em', color: P.ink2, marginBottom: 32 }}>
          {'> INITIALIZING WEDDING.EXE...'}
        </div>
        <NeonGlow color={P.accent} style={{ width: '80%', maxWidth: 600, marginBottom: 32 }} />

        <h1 style={{ fontSize: 'clamp(60px, 14vw, 200px)', fontWeight: 900, lineHeight: 0.88, margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
          <Glitch text={a} color={P.accent} size="1em" />
          <br />
          <span style={{ fontSize: '0.35em', color: cyan, letterSpacing: '0.2em' }}>×</span>
          <br />
          <Glitch text={b} color={cyan} size="1em" />
        </h1>

        <NeonGlow color={cyan} style={{ width: '80%', maxWidth: 600, marginTop: 32, marginBottom: 32 }} />

        <div style={{ fontSize: 11, letterSpacing: '0.2em', color: P.ink2 }}>
          {t.venue.toUpperCase()} · {t.city.toUpperCase()}
        </div>
        <div style={{ fontSize: 13, color: P.accent, marginTop: 8, letterSpacing: '0.15em' }}>{t.dateMono}</div>

        {/* Countdown */}
        <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, maxWidth: 480, width: '100%' }}>
          {[['DD', cd.days], ['HH', cd.hours], ['MM', cd.minutes], ['SS', cd.seconds]].map(([k, v], i) => (
            <div key={k as string} style={{ padding: 'clamp(12px, 2vw, 20px) 8px', border: `1px solid ${i % 2 === 0 ? P.accent : cyan}44`, background: P.bg2, textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: i % 2 === 0 ? P.accent : cyan, textShadow: `0 0 12px ${i % 2 === 0 ? P.accent : cyan}88` }}>
                {String(v).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 9, letterSpacing: '0.2em', color: P.ink2, marginTop: 6 }}>{k}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, fontSize: 10, color: P.ink2, letterSpacing: '0.2em' }}>
          {'[ scroll to load more ]'}
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', position: 'relative', zIndex: 2 }}>
        <NeonGlow color={P.accent} />
        <div style={{ maxWidth: 800, margin: '0 auto', paddingTop: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', color: P.accent, marginBottom: 32 }}>{'// STORY.LOG'}</div>
          {t.story.map((s, i) => (
            <div key={i} style={{ marginBottom: 40, display: 'grid', gridTemplateColumns: '24px 1fr', gap: 20, alignItems: 'start' }}>
              <div style={{ color: P.accent, fontSize: 18, lineHeight: 1.6, userSelect: 'none' }}>{'>'}</div>
              <div>
                <h2 style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 700, color: cyan, margin: '0 0 12px', letterSpacing: '0.04em' }}>{s.heading}</h2>
                <p style={{ fontSize: 14, lineHeight: 1.8, margin: 0, color: P.ink2 }}>{s.body}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 40, padding: '20px 24px', border: `1px solid ${P.accent}55`, background: P.bg2, fontSize: 'clamp(14px, 1.6vw, 18px)', fontStyle: 'italic', lineHeight: 1.6, color: P.ink }}>
            <span style={{ color: P.accent }}>{'/* '}</span>
            {t.quote.text}
            <span style={{ color: P.accent }}>{' */'}</span>
            <div style={{ marginTop: 8, fontSize: 10, letterSpacing: '0.15em', color: P.ink2 }}>— {t.quote.author}</div>
          </div>
        </div>
        <div style={{ marginTop: 48 }}><NeonGlow color={cyan} /></div>
      </section>

      {/* Programme */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', color: cyan, marginBottom: 32 }}>{'// SCHEDULE.JSON'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {t.program.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 24, padding: '18px 20px', background: i % 2 === 0 ? P.bg2 : 'transparent', border: `1px solid ${P.ink}18` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: P.accent, fontVariantNumeric: 'tabular-nums' }}>{p.time}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: P.ink }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: P.ink2, marginTop: 4 }}>{p.place}{p.note ? ` // ${p.note}` : ''}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {[['DRESS_CODE', t.details.dressCode], ['GIFT', t.details.gift], ['KIDS', t.details.kids], ['TRANSFER', t.details.transfer]].map(([k, v]) => (
              <div key={k as string} style={{ padding: '16px 20px', border: `1px solid ${P.ink}22`, background: P.bg2 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.2em', color: cyan, marginBottom: 6 }}>{k as string}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: P.ink }}>{v as string}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', position: 'relative', zIndex: 2 }}>
        <NeonGlow color={P.accent} />
        <div style={{ maxWidth: 480, margin: '48px auto 0', textAlign: 'center' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', color: P.accent, marginBottom: 16 }}>{'// RSVP.SEND()'}</div>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px', color: P.ink }}>
            <Glitch text="ОТВЕТ" color={P.accent} />
          </h2>
          <div style={{ fontSize: 12, color: P.ink2, marginBottom: 40, letterSpacing: '0.15em' }}>DEADLINE: {t.rsvpDeadline.toUpperCase()}</div>

          {rsvp.sent ? (
            <div style={{ padding: 28, border: `1px solid ${cyan}55`, background: P.bg2, color: cyan, fontSize: 14, letterSpacing: '0.1em' }}>
              {'> ACK received. See you there, '}{rsvp.state.name || 'user'}{'.'}
            </div>
          ) : (
            <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <NeonInput label="NAME" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} ink2={P.ink2} accent={P.accent} bg={P.bg2} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {[['yes', 'ACCEPT'], ['no', 'DECLINE']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => rsvp.update('attending', v)}
                    style={{ padding: '14px 10px', background: rsvp.state.attending === v ? (v === 'yes' ? P.accent : cyan) : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${v === 'yes' ? P.accent : cyan}55`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, transition: 'all 150ms', boxShadow: rsvp.state.attending === v ? `0 0 16px ${v === 'yes' ? P.accent : cyan}66` : 'none' }}>
                    {l}
                  </button>
                ))}
              </div>
              <button type="submit" style={{ padding: '16px 24px', background: 'transparent', color: P.accent, border: `1px solid ${P.accent}`, fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.25em', fontWeight: 700, cursor: 'pointer', boxShadow: `0 0 12px ${P.accent}44`, transition: 'box-shadow 200ms' }}>
                {'> SUBMIT ↵'}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer style={{ position: 'relative', zIndex: 2, padding: '20px clamp(20px, 5vw, 60px)', borderTop: `1px solid ${P.ink}22`, display: 'flex', justifyContent: 'space-between', fontSize: 9, letterSpacing: '0.15em', color: P.ink2 }}>
        <span>{t.name.toUpperCase()} · DENISIXONE</span><span>{t.dateMono}</span>
      </footer>
    </div>
  );
}

function NeonInput({ label, value, onChange, required, ink, ink2, accent, bg }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; ink: string; ink2: string; accent: string; bg: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '0.25em', color: ink2, marginBottom: 6, textAlign: 'left' }}>{label}</div>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ width: '100%', background: bg, border: `1px solid ${accent}44`, padding: '12px 16px', fontFamily: 'inherit', fontSize: 14, color: ink, outline: 'none', boxSizing: 'border-box', caretColor: accent }} />
    </div>
  );
}
