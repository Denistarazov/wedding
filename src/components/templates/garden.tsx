'use client';

import { useState } from 'react';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';
import type { TemplateData } from '../templates-data';

function Leaf({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" style={{ width: 40, opacity: 0.25, ...style }}>
      <path d="M30 78 C30 78 4 50 4 28 C4 14 16 4 30 4 C44 4 56 14 56 28 C56 50 30 78 30 78Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="30" y1="78" x2="30" y2="4" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

function Accordion({ title, children, ink, accent }: { title: string; children: React.ReactNode; ink: string; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${accent}66` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 0, padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: ink, fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em' }}>{title}</span>
        <span style={{ fontSize: 22, fontWeight: 300, transition: 'transform 250ms', transform: open ? 'rotate(45deg)' : 'none', color: accent }}>+</span>
      </button>
      {open && <div style={{ paddingBottom: 20, fontSize: 15, lineHeight: 1.7, color: ink, opacity: 0.85 }}>{children}</div>}
    </div>
  );
}

export function TemplateGarden() {
  const t = TEMPLATES.find((x) => x.slug === 'garden')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(60px, 10vw, 100px) clamp(20px, 5vw, 60px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 40, left: 40, color: P.ink2 }}><Leaf /></div>
        <div style={{ position: 'absolute', top: 40, right: 40, color: P.ink2, transform: 'scaleX(-1)' }}><Leaf /></div>
        <div style={{ position: 'absolute', bottom: 40, left: 60, color: P.ink2, transform: 'rotate(30deg)' }}><Leaf /></div>
        <div style={{ position: 'absolute', bottom: 40, right: 60, color: P.ink2, transform: 'rotate(-30deg) scaleX(-1)' }}><Leaf /></div>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.ink2, marginBottom: 28 }}>{t.dateMono}</div>
        <div style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', letterSpacing: '0.08em', textTransform: 'uppercase', color: P.accent, marginBottom: 16 }}>Свадьба</div>
        <h1 style={{ fontSize: 'clamp(56px, 12vw, 160px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 0.9, margin: '0 0 8px', fontStyle: 'italic' }}>{a}</h1>
        <div style={{ fontSize: 'clamp(24px, 4vw, 48px)', color: P.ink2, margin: '4px 0', fontStyle: 'italic' }}>&amp;</div>
        <h1 style={{ fontSize: 'clamp(56px, 12vw, 160px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 0.9, margin: '0 0 32px', fontStyle: 'italic' }}>{b}</h1>
        <div style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', letterSpacing: '0.06em', color: P.ink2, lineHeight: 1.6 }}>{t.venue} · {t.city}<br/>{t.dateLong}</div>

        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, borderTop: `1px solid ${P.accent}55`, paddingTop: 32, minWidth: 280, maxWidth: 400, width: '100%' }}>
          {[['Дней', cd.days], ['Часов', cd.hours], ['Минут', cd.minutes], ['Секунд', cd.seconds]].map(([k, v]) => (
            <div key={k as string} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.ink2, marginTop: 6 }}>{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo */}
      <AssetImage src="/assets/images/garden-lavender-field.png" alt={`${a} и ${b}`} ratio="21/9" style={{ margin: '0 clamp(20px, 4vw, 40px)' }} />

      {/* Story */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.ink2, marginBottom: 12 }}>История</div>
          <blockquote style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.45, margin: 0, color: P.ink }}>
            «{t.quote.text}»
            <footer style={{ marginTop: 12, fontSize: 13, fontStyle: 'normal', letterSpacing: '0.08em', color: P.ink2 }}>— {t.quote.author}</footer>
          </blockquote>
        </div>
        {t.story.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 60px' : '60px 1fr', gap: 24, marginBottom: 40, alignItems: 'start' }}>
            {i % 2 !== 0 && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, color: P.ink2 }}><Leaf /></div>}
            <div>
              <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.01em', margin: '0 0 12px' }}>{s.heading}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, margin: 0, color: P.ink, opacity: 0.85 }}>{s.body}</p>
            </div>
            {i % 2 === 0 && <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, color: P.ink2 }}><Leaf /></div>}
          </div>
        ))}
      </section>

      {/* Central card with accordion sections */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', background: P.paper || '#f7faf0', border: `1px solid ${P.accent}44`, padding: 'clamp(28px, 4vw, 52px)', boxShadow: '0 4px 32px rgba(45,58,38,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, color: P.ink2, marginBottom: 16 }}>
              <Leaf /><Leaf style={{ transform: 'scaleX(-1)' }} />
            </div>
            <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.ink2 }}>Детали дня</div>
          </div>

          <Accordion title="Программа" ink={P.ink} accent={P.accent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {t.program.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 16 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: P.ink2, paddingTop: 2 }}>{p.time}</div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: P.ink2, marginTop: 2 }}>{p.place}{p.note ? ` — ${p.note}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </Accordion>

          <Accordion title="Дресс-код" ink={P.ink} accent={P.accent}>
            <p style={{ margin: 0 }}>{t.details.dressCode}</p>
          </Accordion>

          <Accordion title="Подарки" ink={P.ink} accent={P.accent}>
            <p style={{ margin: 0 }}>{t.details.gift}</p>
          </Accordion>

          <Accordion title="Дети" ink={P.ink} accent={P.accent}>
            <p style={{ margin: 0 }}>{t.details.kids}</p>
          </Accordion>

          <Accordion title="Трансфер" ink={P.ink} accent={P.accent}>
            <p style={{ margin: 0 }}>{t.details.transfer}</p>
          </Accordion>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 60px)', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', color: P.ink2, marginBottom: 20 }}><Leaf /></div>
          <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.ink2, marginBottom: 16 }}>R.S.V.P.</div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontStyle: 'italic', fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Ответьте до</h2>
          <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: P.ink2, marginBottom: 32 }}>{t.rsvpDeadline}</div>

          {rsvp.sent ? (
            <div style={{ padding: 28, border: `1px solid ${P.accent}66`, fontSize: 16, fontStyle: 'italic', color: P.ink2 }}>
              Спасибо, {rsvp.state.name || 'дорогой гость'}. Мы вас ждём.
            </div>
          ) : (
            <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <GardenField label="Ваше имя" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} ink2={P.ink2} accent={P.accent} />
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: P.ink2, marginBottom: 12, textAlign: 'left' }}>Присутствие</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[['yes', 'Буду с радостью'], ['no', 'Не смогу']].map(([v, l]) => (
                    <button key={v} type="button" onClick={() => rsvp.update('attending', v)}
                      style={{ flex: 1, padding: '12px 16px', background: rsvp.state.attending === v ? P.ink : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.accent}66`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontStyle: 'italic', transition: 'all 200ms' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <GardenField label="Кол-во гостей" value={String(rsvp.state.guests)} onChange={(v) => rsvp.update('guests', Number(v))} type="number" ink={P.ink} ink2={P.ink2} accent={P.accent} />
              <button type="submit" style={{ padding: '16px 32px', background: P.ink, color: P.bg, border: 0, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                Отправить ответ
              </button>
            </form>
          )}
        </div>
      </section>

      <footer style={{ padding: '32px clamp(20px, 5vw, 60px)', borderTop: `1px solid ${P.accent}44`, display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.1em', color: P.ink2 }}>
        <span>{t.name} · denisixone</span><span>{t.dateMono} · {t.city}</span>
      </footer>
    </div>
  );
}

function GardenField({ label, value, onChange, type = 'text', required, ink, ink2, accent }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  required?: boolean; ink: string; ink2: string; accent: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
      <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: ink2 }}>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${accent}66`, padding: '10px 0', fontFamily: 'inherit', fontSize: 16, color: ink, outline: 'none', fontStyle: 'italic' }} />
    </label>
  );
}

import React from 'react';
