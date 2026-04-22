'use client';

import { useState, useRef, useEffect } from 'react';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';

/* Tiny SVG illustrations — botanical doodles */
function Berries({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 40" fill="none" style={{ width: 56, opacity: 0.55, ...style }}>
      <circle cx="14" cy="22" r="8" fill="currentColor" opacity=".7" />
      <circle cx="30" cy="16" r="9" fill="currentColor" opacity=".8" />
      <circle cx="48" cy="20" r="8" fill="currentColor" opacity=".65" />
      <circle cx="64" cy="14" r="7" fill="currentColor" opacity=".75" />
      <path d="M14 14 C14 8 22 4 30 7 M30 7 C35 2 44 4 48 12 M48 12 C52 6 60 6 64 7" stroke="currentColor" strokeWidth="1.5" fill="none" opacity=".4" />
    </svg>
  );
}

function Sprig({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 80" fill="none" style={{ width: 28, opacity: 0.4, ...style }}>
      <line x1="20" y1="80" x2="20" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="20" cy="32" rx="12" ry="8" fill="currentColor" opacity=".5" transform="rotate(-25 20 32)" />
      <ellipse cx="20" cy="52" rx="10" ry="7" fill="currentColor" opacity=".4" transform="rotate(20 20 52)" />
      <ellipse cx="20" cy="20" rx="8" ry="6" fill="currentColor" opacity=".55" transform="rotate(-10 20 20)" />
    </svg>
  );
}

function useFadeIn(ref: React.RefObject<HTMLElement | null>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return v;
}

function Appear({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useFadeIn(ref as React.RefObject<HTMLElement | null>);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(20px)', transition: `opacity 800ms ${delay}ms ease, transform 800ms ${delay}ms ease` }}>
      {children}
    </div>
  );
}

export function TemplateCottage() {
  const t = TEMPLATES.find((x) => x.slug === 'cottage')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Lora', 'Palatino Linotype', Georgia, serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(60px, 10vw, 120px) clamp(20px, 6vw, 80px)', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative corner sprigs */}
        {[
          { top: 32, left: 32, rotate: 0 }, { top: 32, right: 32, rotate: '180deg' },
          { bottom: 32, left: 32, rotate: '-90deg' }, { bottom: 32, right: 32, rotate: '90deg' },
        ].map((pos, i) => (
          <div key={i} aria-hidden="true" style={{ position: 'absolute', color: P.ink2, ...pos as React.CSSProperties }}>
            <Sprig style={{ transform: `rotate(${pos.rotate ?? 0})` }} />
          </div>
        ))}

        <Appear>
          <div style={{ color: P.ink2, marginBottom: 20 }}>
            <Berries />
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink2, marginBottom: 20 }}>Приглашаем вас</div>
          <h1 style={{ fontSize: 'clamp(52px, 11vw, 148px)', fontWeight: 400, fontStyle: 'italic', lineHeight: 0.9, margin: 0, letterSpacing: '-0.02em' }}>{a}</h1>
          <div style={{ fontSize: 'clamp(22px, 4vw, 52px)', color: P.accent, margin: '6px 0', fontStyle: 'italic' }}>&amp;</div>
          <h1 style={{ fontSize: 'clamp(52px, 11vw, 148px)', fontWeight: 400, fontStyle: 'italic', lineHeight: 0.9, margin: '0 0 28px', letterSpacing: '-0.02em' }}>{b}</h1>
          <div style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', color: P.ink2, letterSpacing: '0.06em', lineHeight: 1.8 }}>
            {t.dateLong}<br />{t.venue} · {t.city}
          </div>
        </Appear>

        {/* Countdown */}
        <Appear delay={200}>
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(16px, 2.5vw, 32px)', borderTop: `1px solid ${P.accent}44`, paddingTop: 28, minWidth: 300 }}>
            {[['Дней', cd.days], ['Часов', cd.hours], ['Минут', cd.minutes], ['Секунд', cd.seconds]].map(([k, v]) => (
              <div key={k as string} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: P.accent }}>{String(v).padStart(2, '0')}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.ink2, marginTop: 6 }}>{k}</div>
              </div>
            ))}
          </div>
        </Appear>
      </section>

      {/* Photo */}
      <AssetImage src="/assets/images/cottage-summer-garden.png" alt={`${a} и ${b}`} ratio="21/9" style={{ margin: '0 clamp(16px, 3vw, 40px)', border: `4px solid ${P.paper ?? '#fff'}`, boxShadow: '0 8px 40px rgba(61,44,30,0.12)' }} />

      {/* Story */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Appear>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <Berries style={{ width: 72 }} />
              <blockquote style={{ margin: '16px 0 0', fontSize: 'clamp(18px, 2.2vw, 26px)', fontStyle: 'italic', lineHeight: 1.55, fontWeight: 300, color: P.ink }}>
                «{t.quote.text}»
                <footer style={{ marginTop: 12, fontStyle: 'normal', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.ink2 }}>— {t.quote.author}</footer>
              </blockquote>
            </div>
          </Appear>

          {t.story.map((s, i) => (
            <Appear key={i} delay={i * 120}>
              <div style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 48px' : '48px 1fr', gap: 20, marginBottom: 40, alignItems: 'start' }}>
                {i % 2 !== 0 && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 6, color: P.accent }}><Sprig /></div>}
                <div>
                  <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 400, fontStyle: 'italic', margin: '0 0 12px', letterSpacing: '-0.01em' }}>{s.heading}</h2>
                  <p style={{ fontSize: 16, lineHeight: 1.8, margin: 0, color: P.ink, opacity: 0.88 }}>{s.body}</p>
                </div>
                {i % 2 === 0 && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 6, color: P.accent }}><Sprig /></div>}
              </div>
            </Appear>
          ))}
        </div>
      </section>

      {/* Programme card */}
      <section style={{ padding: '0 clamp(20px, 6vw, 80px) clamp(60px, 8vw, 100px)' }}>
        <Appear>
          <div style={{ maxWidth: 640, margin: '0 auto', background: P.paper ?? '#fffbf2', border: `1px solid ${P.accent}44`, padding: 'clamp(28px, 4vw, 52px)', boxShadow: '0 4px 32px rgba(61,44,30,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Berries style={{ width: 56, display: 'inline-block' }} />
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 400, fontStyle: 'italic', margin: '12px 0 0' }}>Наш день</h2>
            </div>
            {t.program.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 20, padding: '14px 0', borderBottom: i < t.program.length - 1 ? `1px solid ${P.accent}33` : 'none' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: P.accent, paddingTop: 2 }}>{p.time}</div>
                <div>
                  <div style={{ fontSize: 17, fontStyle: 'italic' }}>{p.title}</div>
                  <div style={{ fontSize: 13, color: P.ink2, marginTop: 2 }}>{p.place}{p.note ? ` — ${p.note}` : ''}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${P.accent}44`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
              {[['Стиль', t.details.dressCode], ['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer]].map(([k, v]) => (
                <div key={k as string}>
                  <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: P.ink2, marginBottom: 4 }}>{k as string}</div>
                  <div style={{ fontSize: 14, fontStyle: 'italic', lineHeight: 1.4 }}>{v as string}</div>
                </div>
              ))}
            </div>
          </div>
        </Appear>
      </section>

      {/* RSVP */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 6vw, 80px) clamp(80px, 10vw, 120px)', textAlign: 'center' }}>
        <Appear>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ color: P.accent, marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Berries /></div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontStyle: 'italic', fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Ответьте до</h2>
            <div style={{ fontSize: 16, color: P.ink2, marginBottom: 36 }}>{t.rsvpDeadline}</div>

            {rsvp.sent ? (
              <div style={{ padding: 28, border: `1px solid ${P.accent}55`, fontStyle: 'italic', fontSize: 17, color: P.ink2 }}>
                Спасибо, {rsvp.state.name || 'дорогой гость'}. Ждём вас!
              </div>
            ) : (
              <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <CottageField label="Ваше имя" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} ink2={P.ink2} accent={P.accent} />
                <div>
                  <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: P.ink2, marginBottom: 12 }}>Присутствие</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[['yes', 'Буду с радостью ♡'], ['no', 'К сожалению, нет']].map(([v, l]) => (
                      <button key={v} type="button" onClick={() => rsvp.update('attending', v)}
                        style={{ flex: 1, padding: '12px 14px', background: rsvp.state.attending === v ? P.accent : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.accent}66`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontStyle: 'italic', transition: 'all 200ms' }}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" style={{ padding: '14px 28px', background: P.ink, color: P.bg, border: 0, fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Отправить
                </button>
              </form>
            )}
          </div>
        </Appear>
      </section>

      <footer style={{ padding: '28px clamp(20px, 6vw, 80px)', borderTop: `1px solid ${P.accent}44`, display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.1em', color: P.ink2 }}>
        <span>{t.name} · denisixone</span><span>{t.dateMono} · {t.city}</span>
      </footer>
    </div>
  );
}

function CottageField({ label, value, onChange, required, ink, ink2, accent }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; ink: string; ink2: string; accent: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
      <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: ink2 }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${accent}66`, padding: '10px 0', fontFamily: 'inherit', fontSize: 17, color: ink, outline: 'none', fontStyle: 'italic' }} />
    </label>
  );
}
