'use client';

import { useState } from 'react';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';

type Page = 'cover' | 'story' | 'invitation';

export function TemplateLetterpress() {
  const t = TEMPLATES.find((x) => x.slug === 'letterpress')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [page, setPage] = useState<Page>('cover');
  const [a, b] = t.couple.split('&').map((s) => s.trim());

  const pages: Page[] = ['cover', 'story', 'invitation'];
  const pageLabels: Record<Page, string> = { cover: 'I', story: 'II', invitation: 'III' };

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'IM Fell English', 'Garamond', 'Times New Roman', serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Book-style page container */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)' }}>

        {/* Page tabs — chapter markers */}
        <nav style={{ display: 'flex', gap: 0, marginBottom: 0, justifyContent: 'center' }}>
          {pages.map((p) => (
            <button key={p} onClick={() => setPage(p)}
              style={{ padding: '10px 28px', background: page === p ? P.paper || '#f2e9d0' : P.bg2, color: P.ink, border: `1px solid ${P.ink}66`, borderBottom: page === p ? `1px solid ${P.paper || '#f2e9d0'}` : `1px solid ${P.ink}66`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, letterSpacing: '0.08em', marginLeft: -1, zIndex: page === p ? 2 : 1, position: 'relative', transition: 'background 200ms' }}>
              {pageLabels[p]}
            </button>
          ))}
        </nav>

        {/* Page frame */}
        <div style={{ background: P.paper || '#f2e9d0', border: `1px solid ${P.ink}66`, padding: 'clamp(32px, 5vw, 64px)', minHeight: '70vh', position: 'relative', boxShadow: '4px 4px 0 rgba(58,42,26,0.08), 8px 8px 0 rgba(58,42,26,0.04)' }}>

          {/* Decorative corner rules */}
          {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
            <div key={`${v}-${h}`} aria-hidden="true" style={{ position: 'absolute', [v]: 16, [h]: 16, width: 24, height: 24, borderTop: v === 'top' ? `2px solid ${P.accent}` : 'none', borderBottom: v === 'bottom' ? `2px solid ${P.accent}` : 'none', borderLeft: h === 'left' ? `2px solid ${P.accent}` : 'none', borderRight: h === 'right' ? `2px solid ${P.accent}` : 'none' }} />
          ))}

          {/* PAGE I — Cover */}
          {page === 'cover' && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: P.ink2, marginBottom: 24 }}>
                Имеют честь известить
              </div>
              <OrnamentRule accent={P.accent} />
              <h1 style={{ fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 400, letterSpacing: '0.04em', margin: '24px 0 8px', lineHeight: 1.05 }}>{a}</h1>
              <div style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', fontStyle: 'italic', color: P.ink2, margin: '4px 0' }}>и</div>
              <h1 style={{ fontSize: 'clamp(36px, 6vw, 80px)', fontWeight: 400, letterSpacing: '0.04em', margin: '8px 0 24px', lineHeight: 1.05 }}>{b}</h1>
              <OrnamentRule accent={P.accent} />
              <div style={{ marginTop: 24, fontSize: 'clamp(14px, 1.5vw, 17px)', lineHeight: 1.8, letterSpacing: '0.04em', color: P.ink2 }}>
                о бракосочетании, имеющем состояться
              </div>
              <div style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', letterSpacing: '0.06em', marginTop: 8 }}>{t.dateLong}</div>
              <div style={{ fontSize: 14, color: P.ink2, marginTop: 8, letterSpacing: '0.04em' }}>{t.venue} · {t.city}</div>

              <div style={{ marginTop: 40, padding: '28px 0', borderTop: `1px solid ${P.accent}55`, borderBottom: `1px solid ${P.accent}55`, width: '100%', maxWidth: 400 }}>
                <div style={{ fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', color: P.ink2, marginBottom: 16 }}>До торжества</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {[['Дней', cd.days], ['Часов', cd.hours], ['Минут', cd.minutes], ['Сек', cd.seconds]].map(([k, v]) => (
                    <div key={k as string}>
                      <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
                      <div style={{ fontSize: 10, color: P.ink2, marginTop: 4, letterSpacing: '0.1em' }}>{k}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setPage('story')} style={{ marginTop: 32, background: 'transparent', border: `1px solid ${P.accent}`, padding: '10px 28px', color: P.ink, fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.12em', cursor: 'pointer' }}>
                Читать далее →
              </button>
            </div>
          )}

          {/* PAGE II — Story */}
          {page === 'story' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <OrnamentRule accent={P.accent} />
                <div style={{ margin: '12px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.ink2 }}>Глава вторая · История</div>
                <OrnamentRule accent={P.accent} />
              </div>
              {t.story.map((s, i) => (
                <div key={i} style={{ marginBottom: 36 }}>
                  <h2 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', margin: '0 0 16px', textAlign: 'center' }}>{s.heading}</h2>
                  <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.9, margin: 0, textAlign: 'justify', textIndent: '2em' }}>{s.body}</p>
                </div>
              ))}
              <div style={{ margin: '36px 0', textAlign: 'center' }}>
                <OrnamentRule accent={P.accent} />
                <blockquote style={{ margin: '20px 0', fontSize: 'clamp(15px, 1.6vw, 19px)', fontStyle: 'italic', lineHeight: 1.65, color: P.ink2 }}>
                  «{t.quote.text}»
                  <footer style={{ marginTop: 10, fontStyle: 'normal', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em' }}>— {t.quote.author}</footer>
                </blockquote>
                <OrnamentRule accent={P.accent} />
              </div>
              <div style={{ marginTop: 20 }}>
                <AssetImage src="/assets/images/letterpress-paper-texture.png" alt="Усадьба Карабиха" ratio="16/7" style={{ border: `1px solid ${P.ink}33` }} />
              </div>
              <div style={{ textAlign: 'right', marginTop: 24 }}>
                <button onClick={() => setPage('invitation')} style={{ background: 'transparent', border: `1px solid ${P.accent}`, padding: '10px 28px', color: P.ink, fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.12em', cursor: 'pointer' }}>
                  Приглашение →
                </button>
              </div>
            </div>
          )}

          {/* PAGE III — Invitation + RSVP */}
          {page === 'invitation' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <OrnamentRule accent={P.accent} />
                <div style={{ margin: '12px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: P.ink2 }}>Глава третья · Приглашение</div>
                <OrnamentRule accent={P.accent} />
              </div>

              {/* Programme */}
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', fontWeight: 400, fontStyle: 'italic', letterSpacing: '0.02em', margin: '0 0 20px', textAlign: 'center' }}>Порядок дня</h2>
                {t.program.map((p, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 20, padding: '14px 0', borderBottom: `1px solid ${P.accent}44` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: P.ink2 }}>{p.time}</div>
                    <div>
                      <div style={{ fontSize: 17, fontStyle: 'italic' }}>{p.title}</div>
                      <div style={{ fontSize: 13, color: P.ink2, marginTop: 2 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div style={{ marginBottom: 40, padding: 24, border: `1px solid ${P.accent}44`, background: P.bg2 }}>
                <h3 style={{ fontSize: 18, fontStyle: 'italic', margin: '0 0 16px', textAlign: 'center' }}>О торжестве</h3>
                {[['Дресс-код', t.details.dressCode], ['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer]].map(([k, v]) => (
                  <div key={k as string} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, marginBottom: 10 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: P.ink2, paddingTop: 2 }}>{k as string}</div>
                    <div style={{ fontSize: 15, fontStyle: 'italic' }}>{v as string}</div>
                  </div>
                ))}
              </div>

              {/* RSVP */}
              <div style={{ textAlign: 'center' }}>
                <OrnamentRule accent={P.accent} />
                <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontStyle: 'italic', margin: '20px 0 8px' }}>Благоволите ответить</h2>
                <div style={{ fontSize: 14, color: P.ink2, marginBottom: 28 }}>до {t.rsvpDeadline}</div>
                <OrnamentRule accent={P.accent} />
              </div>

              {rsvp.sent ? (
                <div style={{ marginTop: 28, padding: 24, border: `1px solid ${P.accent}55`, textAlign: 'center', fontSize: 16, fontStyle: 'italic', color: P.ink2 }}>
                  Ответ принят. Ждём Вас, {rsvp.state.name || 'уважаемый гость'}.
                </div>
              ) : (
                <form onSubmit={rsvp.submit} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <LetterpressField label="Ваше имя" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required ink={P.ink} ink2={P.ink2} accent={P.accent} bg={P.bg2} />
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink2, marginBottom: 10 }}>Ваш ответ</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {[['yes', 'С удовольствием приду'], ['no', 'К сожалению, не смогу']].map(([v, l]) => (
                        <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontStyle: 'italic', flex: 1 }}>
                          <input type="radio" name="attending" checked={rsvp.state.attending === v} onChange={() => rsvp.update('attending', v)} style={{ accentColor: P.accent }} /> {l}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button type="submit" style={{ alignSelf: 'center', padding: '12px 40px', background: P.ink, color: P.bg, border: 0, fontFamily: 'inherit', fontSize: 13, letterSpacing: '0.12em', cursor: 'pointer' }}>
                    Отправить ответ
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <footer style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: P.ink2 }}>
          <span>{t.name} · denisixone</span><span>{t.dateMono} · {t.city}</span>
        </footer>
      </div>
    </div>
  );
}

function OrnamentRule({ accent }: { accent: string }) {
  return (
    <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: accent, fontSize: 14, letterSpacing: '0.2em', userSelect: 'none' }}>
      ❧ · · · ❧
    </div>
  );
}

function LetterpressField({ label, value, onChange, required, ink, ink2, accent, bg }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; ink: string; ink2: string; accent: string; bg: string;
}) {
  void bg;
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ink2 }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${accent}66`, padding: '8px 0', fontFamily: 'inherit', fontSize: 17, color: ink, outline: 'none', fontStyle: 'italic' }} />
    </label>
  );
}
