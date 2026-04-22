'use client';

import { useState } from 'react';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';

type Tab = 'welcome' | 'story' | 'day' | 'rsvp';

const TAB_LABELS: Record<Tab, string> = {
  welcome: 'I · ПРИГЛАШЕНИЕ',
  story:   'II · ИСТОРИЯ',
  day:     'III · ПРОГРАММА',
  rsvp:    'IV · R.S.V.P.',
};

export function TemplateArtDeco() {
  const t = TEMPLATES.find((x) => x.slug === 'artdeco')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [tab, setTab] = useState<Tab>('welcome');
  const [a, b] = t.couple.split('&').map((s) => s.trim());

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Cinzel', 'Trajan Pro', 'Times New Roman', serif", minHeight: '100vh' }}>
      <DemoBar t={t} theme="dark" />

      {/* Header with geometric Art Deco ornaments */}
      <header style={{ textAlign: 'center', padding: 'clamp(48px, 7vw, 80px) clamp(20px, 5vw, 60px) 0', position: 'relative' }}>
        {/* Top gold line */}
        <ArtDecoRule accent={P.accent} />
        <div style={{ marginTop: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.4em', color: P.accent, textTransform: 'uppercase' }}>{t.dateMono}</div>
        <h1 style={{ fontSize: 'clamp(48px, 9vw, 130px)', fontWeight: 400, letterSpacing: '0.12em', lineHeight: 0.92, margin: '24px 0 0', textTransform: 'uppercase' }}>
          {a}
        </h1>
        <div style={{ fontSize: 'clamp(18px, 2.5vw, 32px)', color: P.accent, letterSpacing: '0.3em', margin: '8px 0', fontFamily: "'JetBrains Mono', monospace" }}>
          ◆ &amp; ◆
        </div>
        <h1 style={{ fontSize: 'clamp(48px, 9vw, 130px)', fontWeight: 400, letterSpacing: '0.12em', lineHeight: 0.92, margin: '0 0 24px', textTransform: 'uppercase' }}>
          {b}
        </h1>
        <ArtDecoRule accent={P.accent} />
        <div style={{ marginTop: 16, fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.ink2, fontFamily: "'JetBrains Mono', monospace" }}>
          {t.venue} · {t.city}
        </div>

        {/* Countdown strip */}
        <div style={{ marginTop: 32, display: 'inline-grid', gridTemplateColumns: 'repeat(4, 80px)', gap: 0, border: `1px solid ${P.accent}44` }}>
          {[['D', cd.days], ['H', cd.hours], ['M', cd.minutes], ['S', cd.seconds]].map(([k, v], i) => (
            <div key={k as string} style={{ padding: '14px 0', borderRight: i < 3 ? `1px solid ${P.accent}44` : 'none', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', fontWeight: 400, fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: P.accent }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', color: P.ink2, marginTop: 4 }}>{k}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Tab navigation */}
      <nav aria-label="Разделы" style={{ marginTop: 40, display: 'flex', justifyContent: 'center', borderBottom: `1px solid ${P.accent}33` }}>
        {(Object.keys(TAB_LABELS) as Tab[]).map((t_) => (
          <button key={t_} onClick={() => setTab(t_)}
            style={{ padding: '14px clamp(12px, 2vw, 28px)', background: 'none', border: 0, borderBottom: tab === t_ ? `2px solid ${P.accent}` : '2px solid transparent', color: tab === t_ ? P.accent : P.ink2, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(9px, 1.2vw, 11px)', letterSpacing: '0.22em', textTransform: 'uppercase', transition: 'all 200ms', whiteSpace: 'nowrap' }}>
            {TAB_LABELS[t_]}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <main style={{ padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)', maxWidth: 900, margin: '0 auto' }}>

        {/* I — Welcome */}
        {tab === 'welcome' && (
          <div style={{ textAlign: 'center' }}>
            <ArtDecoRule accent={P.accent} />
            <p style={{ margin: '32px auto', maxWidth: 620, fontSize: 'clamp(16px, 1.8vw, 20px)', lineHeight: 1.75, fontStyle: 'italic', color: P.ink2, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              «{t.quote.text}»
            </p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: P.accent, marginBottom: 32 }}>— {t.quote.author}</div>
            <ArtDecoRule accent={P.accent} />

            <div style={{ margin: '48px auto', maxWidth: 560 }}>
              <AssetImage src="/assets/images/artdeco-gold-hall.png" alt="Красная поляна" ratio="16/9" style={{ border: `1px solid ${P.accent}33` }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, marginTop: 40, border: `1px solid ${P.accent}33` }}>
              {[['Дата', t.dateLong], ['Место', `${t.venue}, ${t.city}`], ['Дресс-код', t.details.dressCode], ['RSVP до', t.rsvpDeadline]].map(([k, v]) => (
                <div key={k as string} style={{ padding: 'clamp(16px, 2vw, 28px)', borderRight: k === 'Дата' || k === 'Дресс-код' ? `1px solid ${P.accent}22` : 'none', borderBottom: k === 'Дата' || k === 'Место' ? `1px solid ${P.accent}22` : 'none' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.accent, marginBottom: 8 }}>{k}</div>
                  <div style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', lineHeight: 1.4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* II — Story */}
        {tab === 'story' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <ArtDecoRule accent={P.accent} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.accent, margin: '16px 0' }}>ИСТОРИЯ</div>
              <ArtDecoRule accent={P.accent} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 60px)', alignItems: 'start' }}>
              <div>
                {t.story.map((s, i) => (
                  <div key={i} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: i < t.story.length - 1 ? `1px solid ${P.accent}22` : 'none' }}>
                    <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 400, letterSpacing: '0.06em', margin: '0 0 16px', color: P.accent }}>{s.heading}</h2>
                    <p style={{ fontSize: 15, lineHeight: 1.8, margin: 0, color: P.ink2, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}>{s.body}</p>
                  </div>
                ))}
              </div>
              <div>
                <AssetImage src="/assets/images/artdeco-mountain-hotel.png" alt="Красная Поляна" ratio="3/4" style={{ border: `1px solid ${P.accent}33` }} />
              </div>
            </div>
          </div>
        )}

        {/* III — Day */}
        {tab === 'day' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <ArtDecoRule accent={P.accent} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', color: P.accent, margin: '16px 0' }}>ПРОГРАММА · {t.dateMono}</div>
              <ArtDecoRule accent={P.accent} />
            </div>
            {t.program.map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 40, padding: '24px 0', borderBottom: `1px solid ${P.accent}22` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: P.accent, fontVariantNumeric: 'tabular-nums', textAlign: 'right', paddingRight: 20, borderRight: `1px solid ${P.accent}44` }}>{p.time}</div>
                <div>
                  <div style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.title}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: P.ink2, marginTop: 6, letterSpacing: '0.1em' }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 40, padding: 28, border: `1px solid ${P.accent}33` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.25em', color: P.accent, marginBottom: 20 }}>ДЕТАЛИ</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 32px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {[['Дресс-код', t.details.dressCode], ['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer]].map(([k, v]) => (
                  <div key={k as string}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink2, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 15, fontStyle: 'italic', lineHeight: 1.4 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* IV — RSVP */}
        {tab === 'rsvp' && (
          <div style={{ textAlign: 'center' }}>
            <ArtDecoRule accent={P.accent} />
            <h2 style={{ fontSize: 'clamp(36px, 6vw, 88px)', fontWeight: 400, letterSpacing: '0.1em', margin: '24px 0 8px', textTransform: 'uppercase' }}>Répondez</h2>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.25em', color: P.ink2, marginBottom: 16 }}>S.V.P. · до {t.rsvpDeadline}</div>
            <ArtDecoRule accent={P.accent} />

            <div style={{ maxWidth: 480, margin: '40px auto 0' }}>
              {rsvp.sent ? (
                <div style={{ padding: 36, border: `1px solid ${P.accent}44`, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: 20, color: P.ink2 }}>
                  Nous vous remercions, {rsvp.state.name || 'cher invité'}.
                </div>
              ) : (
                <form onSubmit={rsvp.submit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <ArtDecoField label="Ваше имя" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} ink2={P.ink2} accent={P.accent} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.ink2, marginBottom: 12 }}>Подтверждение</div>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[['yes', 'С УДОВОЛЬСТВИЕМ'], ['no', 'К СОЖАЛЕНИЮ']].map(([v, l]) => (
                        <button key={v} type="button" onClick={() => rsvp.update('attending', v)}
                          style={{ flex: 1, padding: '14px 12px', background: rsvp.state.attending === v ? P.accent : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.accent}44`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(9px, 1.2vw, 11px)', letterSpacing: '0.15em', transition: 'all 200ms' }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" style={{ padding: '16px 32px', background: 'transparent', color: P.accent, border: `1px solid ${P.accent}`, fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 200ms' }}>
                    ОТПРАВИТЬ →
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <footer style={{ marginTop: 40, padding: '24px clamp(20px, 5vw, 60px)', borderTop: `1px solid ${P.accent}22`, display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', color: P.ink2 }}>
        <span>{t.name} · denisixone</span><span>{t.dateMono} · {t.city}</span>
      </footer>
    </div>
  );
}

function ArtDecoRule({ accent }: { accent: string }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, userSelect: 'none' }}>
      <div style={{ height: 1, width: 60, background: `linear-gradient(90deg, transparent, ${accent})` }} />
      <div style={{ width: 6, height: 6, border: `1px solid ${accent}`, transform: 'rotate(45deg)', flexShrink: 0 }} />
      <div style={{ width: 4, height: 4, background: accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
      <div style={{ width: 6, height: 6, border: `1px solid ${accent}`, transform: 'rotate(45deg)', flexShrink: 0 }} />
      <div style={{ height: 1, width: 60, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    </div>
  );
}

function ArtDecoField({ label, value, onChange, required, ink, ink2, accent }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; ink: string; ink2: string; accent: string;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: ink2 }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${accent}55`, padding: '12px 0', fontFamily: 'inherit', fontSize: 'clamp(18px, 2.5vw, 26px)', color: ink, outline: 'none', letterSpacing: '0.06em' }} />
    </label>
  );
}
