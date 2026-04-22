'use client';

import { useState, useEffect, useRef } from 'react';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';

function useRevealOnScroll(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useRevealOnScroll(ref);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 900ms ${delay}ms ease, transform 900ms ${delay}ms ease` }}>
      {children}
    </div>
  );
}

export function TemplateWabisabi() {
  const t = TEMPLATES.find((x) => x.slug === 'wabisabi')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Noto Serif', 'Garamond', Georgia, serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Hero — asymmetric, lots of space */}
      <section style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 60px)', gap: 'clamp(40px, 6vw, 80px)' }}>
        <div>
          <FadeIn>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.ink2, marginBottom: 40 }}>{t.dateMono}</div>
            <div style={{ fontSize: 'clamp(72px, 14vw, 180px)', lineHeight: 1, color: P.accent, marginBottom: 32, fontWeight: 300 }}>結</div>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
              {a}<br />
              <span style={{ fontSize: '0.55em', color: P.ink2, fontStyle: 'italic' }}>и</span><br />
              {b}
            </h1>
            <div style={{ marginTop: 32, fontSize: 'clamp(13px, 1.4vw, 16px)', letterSpacing: '0.06em', color: P.ink2, lineHeight: 1.8 }}>
              {t.venue}<br />{t.city} · {t.dateLong}
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={200}>
          <AssetImage src="/assets/images/wabisabi-mist-cape.png" alt={`${t.city}`} ratio="3/4" style={{ filter: 'sepia(15%) contrast(0.92)' }} />
        </FadeIn>
      </section>

      {/* Ink brushstroke divider */}
      <div aria-hidden="true" style={{ padding: '0 clamp(24px, 5vw, 60px)', opacity: 0.12 }}>
        <svg viewBox="0 0 800 24" style={{ width: '100%', display: 'block' }}>
          <path d="M0 12 Q200 2 400 12 Q600 22 800 12" stroke={P.ink} strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Countdown — sparse */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 60px)', display: 'flex', justifyContent: 'center' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.ink2, marginBottom: 28 }}>一期一会</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(20px, 3vw, 40px)' }}>
              {[['日', cd.days], ['時', cd.hours], ['分', cd.minutes], ['秒', cd.seconds]].map(([k, v]) => (
                <div key={k as string} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 300, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
                  <div style={{ fontSize: 18, color: P.accent, marginTop: 6 }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Story */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 60px)', maxWidth: 780, margin: '0 auto' }}>
        {t.story.map((s, i) => (
          <FadeIn key={i} delay={i * 150}>
            <div style={{ marginBottom: 56, paddingLeft: i === 1 ? 'clamp(24px, 5vw, 80px)' : 0 }}>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.01em', margin: '0 0 16px', color: i === 1 ? P.accent : P.ink }}>{s.heading}</h2>
              <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.9, margin: 0, color: P.ink, opacity: 0.88 }}>{s.body}</p>
            </div>
          </FadeIn>
        ))}
        <FadeIn delay={300}>
          <blockquote style={{ margin: '0', padding: '32px 0', borderTop: `1px solid ${P.ink}22`, borderBottom: `1px solid ${P.ink}22`, textAlign: 'center', fontSize: 'clamp(17px, 2vw, 24px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.55, color: P.ink }}>
            «{t.quote.text}»
            <footer style={{ marginTop: 16, fontStyle: 'normal', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: P.ink2 }}>— {t.quote.author}</footer>
          </blockquote>
        </FadeIn>
      </section>

      {/* Programme */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 60px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'start' }}>
        <div>
          <FadeIn>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.ink2, marginBottom: 32 }}>式次第</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {t.program.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, padding: '20px 0', borderBottom: `1px solid ${P.ink}14` }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: P.accent, fontVariantNumeric: 'tabular-nums' }}>{p.time}</div>
                  <div>
                    <div style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', fontWeight: 400 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: P.ink2, marginTop: 4 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={200}>
          <AssetImage src="/assets/images/wabisabi-cherry-blossom.png" alt="Сакура" ratio="4/5" style={{ filter: 'sepia(10%)' }} />
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: 13, lineHeight: 1.5 }}>
            {[['Стиль', t.details.dressCode], ['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer]].map(([k, v]) => (
              <div key={k as string}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink2, marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 14 }}>{v}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* RSVP */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 60px)', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <FadeIn>
          <div style={{ fontSize: 'clamp(48px, 8vw, 100px)', color: P.accent, fontWeight: 300, lineHeight: 1, marginBottom: 16 }}>返</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.ink2, marginBottom: 8 }}>R.S.V.P.</div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', margin: '0 0 8px' }}>Ответьте до</h2>
          <div style={{ fontSize: 16, color: P.ink2, marginBottom: 40 }}>{t.rsvpDeadline}</div>

          {rsvp.sent ? (
            <div style={{ padding: 28, fontSize: 17, fontStyle: 'italic', color: P.ink2 }}>
              Получено. Спасибо, {rsvp.state.name || 'друг'}. До встречи.
            </div>
          ) : (
            <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <WabiField label="Ваше имя" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} ink2={P.ink2} accent={P.accent} />
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', color: P.ink2, marginBottom: 12, textAlign: 'left' }}>ПРИСУТСТВИЕ</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['yes', '◉ Буду'], ['no', '◎ Не смогу']].map(([v, l]) => (
                    <button key={v} type="button" onClick={() => rsvp.update('attending', v)}
                      style={{ flex: 1, padding: '12px 16px', background: rsvp.state.attending === v ? P.ink : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.ink}44`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontStyle: 'italic', transition: 'all 250ms' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" style={{ padding: '14px 28px', background: 'transparent', color: P.ink, border: `1px solid ${P.ink}`, fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.12em', cursor: 'pointer', fontStyle: 'italic' }}>
                Отправить
              </button>
            </form>
          )}
        </FadeIn>
      </section>

      <footer style={{ padding: '32px clamp(24px, 5vw, 60px)', borderTop: `1px solid ${P.ink}14`, display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', color: P.ink2 }}>
        <span>{t.name} · denisixone</span><span>{t.dateMono}</span>
      </footer>
    </div>
  );
}

function WabiField({ label, value, onChange, required, ink, ink2, accent }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; ink: string; ink2: string; accent: string;
}) {
  void accent;
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ink2 }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${ink}33`, padding: '10px 0', fontFamily: 'inherit', fontSize: 18, color: ink, outline: 'none', fontStyle: 'italic' }} />
    </label>
  );
}

import React from 'react';
