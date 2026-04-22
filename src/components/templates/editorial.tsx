'use client';

import { useState, useEffect } from 'react';
import { TEMPLATES } from '../templates-data';
import { AssetImage } from '../placeholders';
import { useCountdown, DemoBar, useRsvp } from '../template-shell';
import { Button } from '../shared';

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = (h.scrollHeight - h.clientHeight) || 1;
      setP(Math.min(1, Math.max(0, h.scrollTop / max)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return p;
}

export function TemplateEditorial() {
  const t = TEMPLATES.find((x) => x.slug === 'editorial')!;
  const cd = useCountdown(t.dateIso);
  const rsvp = useRsvp();
  const progress = useScrollProgress();
  const P = t.palette;
  const [a, b] = t.couple.split('&').map((s) => s.trim());

  const chapters = [
    { id: 'cover', label: 'Обложка' },
    { id: 'story', label: 'I · История' },
    { id: 'quote', label: 'Цитата' },
    { id: 'day', label: 'II · День' },
    { id: 'details', label: 'III · Детали' },
    { id: 'rsvp', label: 'IV · R.S.V.P.' },
  ];

  return (
    <div style={{ background: P.bg, color: P.ink, fontFamily: "'Fraunces', Georgia, serif", minHeight: '100vh' }}>
      <DemoBar t={t} />
      <div aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 60, background: 'transparent', pointerEvents: 'none' }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: P.ink, transition: 'width 80ms linear' }} />
      </div>
      <header style={{ padding: '28px clamp(20px, 4vw, 40px)', borderBottom: `1px solid ${P.ink}`, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'baseline', gap: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        <span>Vol. I · № {t.dateMono.split(' ')[0]}</span>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontStyle: 'italic', letterSpacing: '-0.02em', textTransform: 'none', whiteSpace: 'nowrap' }}>{a} · &amp; · {b}</span>
        <span style={{ textAlign: 'right' }}>{t.city} — Autumn MMXXVI</span>
      </header>

      {/* TOC */}
      <nav aria-label="Содержание" style={{ position: 'fixed', top: '50%', right: 'clamp(12px, 2vw, 28px)', transform: 'translateY(-50%)', zIndex: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {chapters.map((ch) => (
          <a key={ch.id} href={`#${ch.id}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: P.ink, opacity: 0.45, textDecoration: 'none', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>{ch.label}</a>
        ))}
      </nav>

      {/* Cover */}
      <section id="cover" style={{ padding: 'clamp(60px, 9vw, 100px) clamp(20px, 4vw, 40px) 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.7 }}>— SAVE THE DATE —</div>
        <h1 style={{ fontSize: 'clamp(72px, 18vw, 280px)', lineHeight: 0.88, fontWeight: 300, margin: '36px 0 0', letterSpacing: '-0.045em' }}><span style={{ fontStyle: 'italic' }}>{a}</span></h1>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(18px, 2.5vw, 32px)', fontStyle: 'italic', opacity: 0.8, margin: '-0.3em 0 0' }}>&amp;</div>
        <h1 style={{ fontSize: 'clamp(72px, 18vw, 280px)', lineHeight: 0.88, fontWeight: 400, margin: 0, letterSpacing: '-0.045em' }}>{b}</h1>
        <div style={{ marginTop: 40, fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(10px, 1.3vw, 12px)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          {t.dateMono}  ·  {t.venue}  ·  {t.city}
        </div>
      </section>

      {/* Hero image */}
      <AssetImage src="/assets/images/editorial-hero-lake-como.png" alt={`${a} and ${b} at Lake Como`} ratio="16/9" style={{ margin: '0 clamp(20px, 4vw, 40px)' }} />

      {/* Story */}
      <section id="story" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px, 4vw, 60px)', alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.6, marginBottom: 20 }}>I · ИСТОРИЯ</div>
          {t.story.map((s, i) => (
            <div key={i} style={{ marginTop: i > 0 ? 28 : 0 }}>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', margin: '0 0 12px', lineHeight: 1.1 }}>{s.heading}</h2>
              <p style={{ fontSize: 'clamp(16px, 1.5vw, 19px)', lineHeight: 1.7, margin: 0, opacity: 0.9 }}>{s.body}</p>
            </div>
          ))}
        </div>
        <div>
          <AssetImage src="/assets/images/editorial-black-white-corridor.png" alt="" ratio="3/4" />
        </div>
      </section>

      {/* Pull quote */}
      <section id="quote" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', borderTop: `1px solid ${P.ink}`, borderBottom: `1px solid ${P.ink}`, textAlign: 'center' }}>
        <blockquote style={{ margin: 0, fontSize: 'clamp(22px, 3vw, 40px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.35, letterSpacing: '-0.01em', maxWidth: 900, marginInline: 'auto' }}>
          «{t.quote.text}»
          <footer style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontStyle: 'normal', letterSpacing: '0.25em', opacity: 0.65 }}>— {t.quote.author}</footer>
        </blockquote>
      </section>

      {/* Programme */}
      <section id="day" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.6, marginBottom: 36 }}>II · ДЕНЬ</div>
        <div>
          {t.program.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 32, padding: '22px 0', borderTop: `1px solid ${P.ink}44` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{p.time}</div>
              <div>
                <div style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontStyle: 'italic', fontWeight: 300 }}>{p.title}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginTop: 6, opacity: 0.65 }}>{p.place}{p.note ? ` · ${p.note}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Countdown + details + image */}
      <section id="details" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', background: P.ink, color: P.bg }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.55, marginBottom: 36 }}>III · ДЕТАЛИ</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px, 5vw, 60px)' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
              {[['D', cd.days], ['H', cd.hours], ['M', cd.minutes], ['S', cd.seconds]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{String(v).padStart(2, '0')}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', opacity: 0.55, marginTop: 4 }}>{k}</div>
                </div>
              ))}
            </div>
            <dl style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px 24px' }}>
              {[['Dress code', t.details.dressCode], ['Подарки', t.details.gift], ['Дети', t.details.kids], ['Трансфер', t.details.transfer]].map(([k, v]) => (
                <React.Fragment key={k as string}>
                  <dt style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.55 }}>{k}</dt>
                  <dd style={{ margin: 0, fontSize: 'clamp(14px, 1.4vw, 16px)', fontStyle: 'italic' }}>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
          <AssetImage src="/assets/images/editorial-table-detail.png" alt="" ratio="4/5" />
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 40px)', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.6, marginBottom: 24 }}>IV · R.S.V.P.</div>
        <h2 style={{ fontSize: 'clamp(44px, 8vw, 120px)', fontStyle: 'italic', fontWeight: 300, margin: '0 0 12px', lineHeight: 1 }}>Ответьте до<br/><span style={{ fontWeight: 400 }}>{t.rsvpDeadline}.</span></h2>
        {rsvp.sent ? (
          <div style={{ marginTop: 40, fontStyle: 'italic', fontSize: 22, opacity: 0.8 }}>Получено. Спасибо, {rsvp.state.name || 'друг'}.</div>
        ) : (
          <form onSubmit={rsvp.submit} style={{ marginTop: 40, maxWidth: 480, marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
              style={{ background: 'transparent', border: 0, borderBottom: `1px solid ${P.ink}`, padding: '12px 0', fontFamily: 'inherit', fontSize: 22, fontStyle: 'italic', outline: 'none', textAlign: 'center' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              {[['yes', 'Приду'], ['no', 'Не смогу']].map(([v, l]) => (
                <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
                  style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? P.ink : 'transparent', color: rsvp.state.attending === v ? P.bg : P.ink, border: `1px solid ${P.ink}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 18, fontStyle: 'italic' }}>{l}</button>
              ))}
            </div>
            <Button type="submit" size="lg">Отправить ответ →</Button>
          </form>
        )}
      </section>

      <footer style={{ padding: '40px clamp(20px, 4vw, 40px)', borderTop: `1px solid ${P.ink}`, display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', opacity: 0.55 }}>
        <span>{t.name} · denisixone</span>
        <span>{t.dateMono}</span>
      </footer>
    </div>
  );
}

import React from 'react';
