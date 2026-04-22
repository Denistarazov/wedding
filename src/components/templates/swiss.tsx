'use client';

import React, { useState, useEffect } from 'react';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';
import { useCountdown, DemoBar, useRsvp, UseRsvpReturn } from '../template-shell';
import type { TemplateData } from '../templates-data';

export function TemplateSwiss() {
  const t = TEMPLATES.find((x) => x.slug === 'swiss')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim().toLowerCase());
  const [activeId, setActiveId] = useState('intro');

  useEffect(() => {
    const ids = ['intro', 'story', 'program', 'details', 'rsvp'];
    const els = ids.map((id) => document.getElementById('swiss-' + id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id.replace('swiss-', '')); });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const nav: [string, string][] = [['intro', '00 / Intro'], ['story', '01 / Story'], ['program', '02 / Programme'], ['details', '03 / Details'], ['rsvp', '04 / R.S.V.P.']];

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Inter', Helvetica, Arial, sans-serif", minHeight: '100vh' }}>
      <DemoBar t={t} />
      <div className="swiss-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
        <aside className="swiss-left" style={{ position: 'sticky', top: 0, height: '100vh', padding: 'clamp(24px, 3vw, 40px)', borderRight: `1px solid ${P.ink}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: P.bg, gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.02em' }}>
            <span>{t.coupleShort}</span><span>{t.dateMono}</span>
          </div>
          <div>
            <div style={{ fontSize: 'clamp(64px, 11vw, 164px)', lineHeight: 0.82, fontWeight: 300, letterSpacing: '-0.045em' }}>{a}<br/>{b}.</div>
            <div style={{ height: 1, background: P.ink, margin: '28px 0 16px' }} />
            <div style={{ fontSize: 12, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.venue}<br/>{t.city} · {t.dateLong}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.02em', marginBottom: 8 }}>Countdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, borderTop: `1px solid ${P.ink}`, paddingTop: 12 }}>
              {[['D', cd.days], ['H', cd.hours], ['M', cd.minutes], ['S', cd.seconds]].map(([k, v]) => (
                <div key={k as string}>
                  <div style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 300, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
                  <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>{k}</div>
                </div>
              ))}
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, letterSpacing: '0.04em' }}>
            {nav.map(([id, label]) => (
              <a key={id} href={`#swiss-${id}`} style={{ color: P.ink, textDecoration: 'none', opacity: activeId === id ? 1 : 0.4, fontWeight: activeId === id ? 500 : 400, transition: 'opacity 200ms' }}>
                <span style={{ color: activeId === id ? P.accent : 'currentColor' }}>{activeId === id ? '●' : '○'}</span> {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="swiss-right" style={{ padding: 'clamp(24px, 3vw, 40px)' }}>
          <section id="swiss-intro" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: `1px solid ${P.ink}`, paddingBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>00 / Invitation</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '20px 0 0' }}>
              Приглашаем Вас на свадьбу <span style={{ fontWeight: 500 }}>{t.couple}</span> — {t.dateLong.toLowerCase()}, {t.city}.
            </h2>
            <p style={{ marginTop: 32, fontSize: 15, lineHeight: 1.65, maxWidth: 520, opacity: 0.8 }}>
              Этот сайт — наше письмо. Слева — кто мы и когда. Справа — история, программа, ответ.
            </p>
            <AssetImage src="/assets/images/swiss-figure-portrait.png" alt={`${t.couple} portrait`} ratio="3/2" style={{ marginTop: 36, border: `1px solid ${P.ink}` }} />
          </section>

          <section id="swiss-story" style={{ padding: '60px 0', borderBottom: `1px solid ${P.ink}` }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>01 / Story</div>
            {t.story.map((s, i) => (
              <div key={i} style={{ marginTop: 28 }}>
                <h3 style={{ fontSize: 'clamp(22px, 2.8vw, 28px)', fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>{s.heading}</h3>
                <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, maxWidth: 560, opacity: 0.85 }}>{s.body}</p>
              </div>
            ))}
            <blockquote style={{ margin: '36px 0 0', padding: '20px 0 0', borderTop: `1px solid ${P.ink}`, fontSize: 'clamp(17px, 1.9vw, 22px)', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.4 }}>
              «{t.quote.text}» <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 12 }}>— {t.quote.author}</span>
            </blockquote>
          </section>

          <section id="swiss-program" style={{ padding: '60px 0', borderBottom: `1px solid ${P.ink}` }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>02 / Programme</div>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column' }}>
              {t.program.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 20, padding: '18px 0', borderTop: i === 0 ? 'none' : `1px solid ${P.ink2 || P.ink}33` }}>
                  <div style={{ fontSize: 15, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{p.time}</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 500 }}>{p.title}</div>
                    <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="swiss-details" style={{ padding: '60px 0', borderBottom: `1px solid ${P.ink}` }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>03 / Details</div>
            <dl style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '140px 1fr', gap: '14px 24px' }}>
              {[['Dress', t.details.dressCode], ['Gift', t.details.gift], ['Kids', t.details.kids], ['Transfer', t.details.transfer]].map(([k, v]) => (
                <React.Fragment key={k as string}>
                  <dt style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, paddingTop: 3 }}>{k}</dt>
                  <dd style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>

          <section id="swiss-rsvp" style={{ padding: '60px 0' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6 }}>04 / R.S.V.P.</div>
            <h2 style={{ fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.035em', margin: '16px 0 28px' }}>
              Ответьте до <span style={{ fontWeight: 500 }}>{t.rsvpDeadline}</span>.
            </h2>
            <SwissRSVP rsvp={rsvp} t={t} />
          </section>

          <footer style={{ padding: '40px 0 20px', borderTop: `1px solid ${P.ink}`, fontSize: 11, display: 'flex', justifyContent: 'space-between' }}>
            <span>{t.name} · denisixone</span><span>{t.dateMono} · {t.city}</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function SwissRSVP({ rsvp, t }: { rsvp: UseRsvpReturn; t: TemplateData }) {
  if (rsvp.sent) return <div style={{ padding: 24, border: `1px solid ${t.palette.ink}`, fontSize: 14 }}>Получено. Спасибо, {rsvp.state.name || 'друг'}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, fontSize: 14 }}>
      <SwissField label="Name" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required t={t} />
      <SwissField label="Guests" type="number" value={String(rsvp.state.guests)} onChange={(v) => rsvp.update('guests', Number(v))} t={t} />
      <div style={{ gridColumn: '1 / 3' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: 10 }}>Присутствие</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['yes', 'ДА / буду'], ['no', 'НЕТ / не смогу']].map(([v, l]) => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="radio" checked={rsvp.state.attending === v} onChange={() => rsvp.update('attending', v)} /> {l}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" style={{ gridColumn: '1 / 3', padding: 18, background: t.palette.ink, color: t.palette.bg, border: 0, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Submit response →</button>
    </form>
  );
}

function SwissField({ label, value, onChange, type = 'text', required, t }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; t: TemplateData }) {
  return (
    <label>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: 10 }}>{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ width: '100%', padding: 12, border: `1px solid ${t.palette.ink}`, background: t.palette.bg, fontFamily: 'inherit', fontSize: 14, color: t.palette.ink }} />
    </label>
  );
}
