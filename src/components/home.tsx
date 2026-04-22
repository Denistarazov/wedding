'use client';

import { useState } from 'react';
import { TopNav, Footer, Button, Eyebrow, ProcessStep, FaqItem, NavLink, Link } from './shared';
import { AssetImage, Placeholder } from './placeholders';
import { TEMPLATES, type TemplateData } from './templates-data';

// ─── Home ─────────────────────────────────────────────────────────────────────

export function Home() {
  return (
    <div>
      <TopNav />
      <main id="main">
        <Hero />
        <Value />
        <Portfolio />
        <Process />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-section" style={{ padding: 'clamp(52px, 8vw, 88px) var(--pad-x) clamp(68px, 9vw, 104px)', position: 'relative', overflow: 'hidden' }}>
      <div className="hero-inner" style={{ maxWidth: 'var(--max-w)', margin: '0 auto', position: 'relative' }}>
        <Eyebrow number="(01)">Свадебные сайты · 2026</Eyebrow>
        <h1 className="serif page-title" style={{ fontSize: 'clamp(48px, 7.2vw, 108px)', lineHeight: 0.92, letterSpacing: '-0.035em', margin: '36px 0 0', fontWeight: 400, textWrap: 'balance' } as React.CSSProperties}>
          Сайт-приглашение, <br/>
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>который гости</span><br/>
          {' '}дочитают до конца.
        </h1>
        <div className="grid-2-mobile-1" style={{ marginTop: 'clamp(40px, 6vw, 60px)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'clamp(32px, 6vw, 80px)', alignItems: 'end' }}>
          <p style={{ fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 560, margin: 0, textWrap: 'pretty' } as React.CSSProperties}>
            9 готовых дизайнов и кастомные проекты под ключ.
            RSVP, программа, карта, история пары — всё, что нужно,
            собрано в одном сайте. Типографика, отступы, темп —
            как у студии, а не как у конструктора.
          </p>
          <div className="hero-cta-row" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button to="/templates" size="lg">Смотреть 9 дизайнов →</Button>
            <Button to="/contact" variant="secondary" size="lg">Связаться</Button>
          </div>
        </div>
        <div className="hero-meta-grid" style={{ marginTop: 'clamp(44px, 7vw, 76px)', paddingTop: 24, borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          <HeroMeta k="Срок" v="от 5 дней" />
          <HeroMeta k="От" v="4 000 ₽" />
          <HeroMeta k="Хостинг" v="Render · бесплатно" />
          <HeroMeta k="Языки" v="RU · EN · +1" />
        </div>
      </div>
      <div className="hero-deco-vertical" aria-hidden="true" style={{ position: 'absolute', top: 80, right: 40, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', color: 'var(--muted)', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
        · denisixone · Est. 2024 ·
      </div>
    </section>
  );
}

function HeroMeta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div style={{ opacity: 0.55 }}>{k}</div>
      <div style={{ color: 'var(--ink)', marginTop: 6, fontSize: 13 }}>{v}</div>
    </div>
  );
}

function Value() {
  return (
    <section style={{ padding: 'var(--section-y-sm) var(--pad-x)', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div className="grid-2-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'clamp(32px, 6vw, 60px)', alignItems: 'start' }}>
          <div>
            <Eyebrow number="(02)">Что вы получаете</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em', margin: '24px 0 0', fontWeight: 400 }}>
              Два пути.<br/><span style={{ fontStyle: 'italic' }}>Один результат.</span>
            </h2>
          </div>
          <div className="grid-2-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(20px, 3vw, 40px)' }}>
            <ValueCard n="I" title="Готовый дизайн" price="4 000 ₽"
              bullets={['9 уникальных шаблонов','Ваши фото, имена, даты','RSVP + Google Sheets','Бесплатный хостинг на Render','Деплой за 5 дней']} />
            <ValueCard n="II" title="Кастомный проект" price="9 000 ₽"
              bullets={['Дизайн с нуля под пару','Арт-директор + копирайтер','Анимации, сценарий прокрутки','Интеграции под запрос','Срок 2–4 недели']}
              highlight />
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueCard({ n, title, price, bullets, highlight }: { n: string; title: string; price: string; bullets: string[]; highlight?: boolean }) {
  return (
    <div className="value-card" style={{ background: highlight ? 'var(--ink)' : 'var(--bg)', color: highlight ? 'var(--bg)' : 'var(--ink)', padding: 36, borderRadius: 4, border: '1px solid ' + (highlight ? 'var(--ink)' : 'var(--line)'), display: 'flex', flexDirection: 'column', gap: 24, minHeight: 340 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="serif" style={{ fontSize: 48, fontStyle: 'italic', fontWeight: 300, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>{price}</div>
      </div>
      <h3 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {bullets.map((b) => (
          <li key={b} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.5 }}>
            <span style={{ opacity: 0.5, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, marginTop: 4 }}>◦</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Button to={highlight ? '/contact' : '/templates'} variant={highlight ? 'secondary' : 'primary'} tone={highlight ? 'light' : 'default'}>
        {highlight ? 'Запросить кастом' : 'Посмотреть дизайны'} →
      </Button>
    </div>
  );
}

function Portfolio() {
  return (
    <section style={{ padding: 'var(--section-y) var(--pad-x)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 'clamp(40px, 6vw, 60px)', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <Eyebrow number="(03)">Портфолио · 9 дизайнов</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 0.98, letterSpacing: '-0.025em', margin: '20px 0 0', fontWeight: 400 }}>
              Девять разных<br/><span style={{ fontStyle: 'italic' }}>миров</span>.
            </h2>
          </div>
          <NavLink to="/templates">Все с фильтрами →</NavLink>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(18px, 2vw, 24px)' }}>
          {TEMPLATES.map((t, i) => <TemplateCard key={t.slug} t={t} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

export function TemplateCard({ t, idx }: { t: TemplateData; idx: number }) {
  return (
    <Link to={`/templates/${t.slug}`} aria-label={`Открыть шаблон ${t.name} — ${t.styleRu}`} style={{ display: 'block', cursor: 'pointer' }}>
      <div className="tpl-card" style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: t.previewBg }}>
        <TemplatePreview template={t} />
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.slug === 'dark' || t.slug === 'artdeco' ? 'rgba(255,255,255,0.8)' : 'rgba(42,36,24,0.6)' }}>
          <span>№ 0{idx + 1}</span>
          <span>{t.styleRu}</span>
        </div>
      </div>
      <div style={{ padding: '18px 2px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="template-card-copy">
          <div className="serif" style={{ fontSize: 24, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{t.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{t.tagline}</div>
        </div>
        <div aria-hidden="true" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, opacity: 0.4 }}>→</div>
      </div>
    </Link>
  );
}

export function TemplatePreview({ template: t }: { template: TemplateData }) {
  const P = t.palette;
  const fg = P.ink || t.ink || '#111';
  const bg = P.bg || t.previewBg || '#fff';
  const accent = P.accent || t.accent || '#888';
  const [a, b] = (t.couple || '').split(/\s*[&×]\s*/).map((s) => s.trim());

  const previews: Record<string, React.ReactNode> = {
    editorial: (
      <div style={{ padding: '16% 14% 14%', color: fg, height: '100%', background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, height: 2, width: '38%', background: accent }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.3em', opacity: 0.65, display: 'flex', justifyContent: 'space-between' }}>
          <span>AURELIA · N°01</span><span>p. 1 — 5</span>
        </div>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(26px, 4.4vw, 46px)', lineHeight: 1, letterSpacing: '-0.03em' }}>{a}<br/>& {b}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
            {[0, 1].map((i) => <div key={i} style={{ height: 1, background: fg, opacity: 0.25 }} />)}
          </div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.25em' }}>{t.dateMono}</div>
      </div>
    ),
    swiss: (
      <div style={{ height: '100%', color: fg, background: bg, display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ padding: 14, borderRight: `1px solid ${fg}22`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.04em' }}>{a.toLowerCase()}<br/>{b.toLowerCase()}</div>
          <div>{[0, 1, 2, 3].map((i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 7, opacity: i === 1 ? 1 : 0.45, marginTop: 2 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: i === 1 ? fg : 'transparent', border: `1px solid ${fg}` }} />0{i + 1}</div>))}</div>
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
          {[0.85, 0.55, 0.9, 0.4, 0.7].map((w, i) => <div key={i} style={{ height: 4, width: `${w * 100}%`, background: fg, opacity: 0.45 - i * 0.06 }} />)}
        </div>
      </div>
    ),
    garden: (
      <div style={{ padding: 18, color: fg, height: '100%', position: 'relative', background: `radial-gradient(ellipse at center, ${bg} 0%, ${P.bg2 || bg} 100%)`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 10, left: 10, width: 38, opacity: 0.55 }}><path d="M10 70 Q30 20, 70 10" stroke={accent} fill="none" strokeWidth="0.8" strokeLinecap="round" /><circle cx="70" cy="10" r="3" fill={accent} opacity="0.6" /></svg>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', bottom: 10, right: 10, width: 38, opacity: 0.55, transform: 'rotate(180deg)' }}><path d="M10 70 Q30 20, 70 10" stroke={accent} fill="none" strokeWidth="0.8" strokeLinecap="round" /><circle cx="70" cy="10" r="3" fill={accent} opacity="0.6" /></svg>
        <div style={{ border: `0.5px solid ${fg}44`, padding: '18px 22px', textAlign: 'center', background: `${bg}cc`, maxWidth: '76%' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.3em', opacity: 0.6 }}>VERBENA</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px, 3.4vw, 32px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.05, margin: '6px 0' }}>{a}<br/><span style={{ color: accent }}>&</span><br/>{b}</div>
        </div>
      </div>
    ),
    dark: (
      <div style={{ padding: 14, color: accent, background: bg, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.35em', opacity: 0.7 }}>— {t.dateMono} —</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(22px, 4.2vw, 40px)', margin: '10px 0', lineHeight: 1 }}>{a}<br/>&<br/>{b}</div>
        <div style={{ width: 24, height: 0.5, background: accent, opacity: 0.55 }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.3em', marginTop: 10, opacity: 0.6 }}>NOCTIS · {t.city.toUpperCase()}</div>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === 2 ? accent : 'transparent', border: `1px solid ${accent}`, opacity: i === 2 ? 1 : 0.45 }} />)}
        </div>
      </div>
    ),
    brutalist: (
      <div style={{ padding: 14, color: fg, background: bg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: "'Archivo Black', sans-serif", position: 'relative' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.2em', display: 'flex', justifyContent: 'space-between', opacity: 0.7 }}>
          <span>DOCUMENT v.1.0</span><span style={{ background: accent, color: '#fff', padding: '1px 5px' }}>{t.city.slice(0, 3).toUpperCase()}</span>
        </div>
        <div style={{ fontSize: 'clamp(32px, 6.4vw, 74px)', lineHeight: 0.82, letterSpacing: '-0.05em' }}>{a.toUpperCase()}<br/><span style={{ color: accent }}>×</span><br/>{b.toUpperCase()}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.15em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ opacity: 0.5 }}>← 01 / 06 →</span><span>{t.dateMono}</span>
        </div>
      </div>
    ),
    letterpress: (
      <div style={{ padding: 14, color: fg, height: '100%', background: `radial-gradient(ellipse at center, ${bg} 0%, ${P.bg2 || bg} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ background: P.paper || '#fff', width: '82%', height: '68%', display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative', boxShadow: `0 8px 18px ${fg}22, inset 0 0 0 1px ${fg}22` }}>
          <div style={{ padding: 10, textAlign: 'center', fontFamily: "'EB Garamond', serif" }}>
            <div style={{ fontSize: 7, letterSpacing: '0.3em', opacity: 0.6 }}>Приглашение</div>
            <div style={{ fontSize: 16, fontStyle: 'italic', marginTop: 6, lineHeight: 1 }}>{a}<br/>&<br/>{b}</div>
          </div>
          <div style={{ padding: 10, textAlign: 'center', fontFamily: "'EB Garamond', serif", borderLeft: `0.5px solid ${fg}33` }}>
            <div style={{ fontSize: 7, letterSpacing: '0.3em', opacity: 0.6 }}>когда</div>
            <div style={{ fontSize: 11, fontStyle: 'italic', marginTop: 10, lineHeight: 1.3 }}>{t.dateMono}</div>
            <div style={{ fontSize: 9, marginTop: 8, opacity: 0.7 }}>{t.city}</div>
          </div>
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 8, transform: 'translateX(-50%)', background: `linear-gradient(90deg, transparent, ${fg}30, transparent)` }} />
        </div>
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 3, alignItems: 'center' }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: i === 0 ? 12 : 4, height: 4, borderRadius: 2, background: i === 0 ? fg : `${fg}44` }} />)}
        </div>
      </div>
    ),
    wabisabi: (
      <div style={{ padding: 16, color: fg, background: bg, height: '100%', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '2%', left: '-8%', fontFamily: "'Noto Serif JP', serif", fontSize: 110, fontWeight: 300, opacity: 0.09, lineHeight: 1 }}>雲</div>
        <div style={{ position: 'absolute', top: '18%', left: '18%', fontFamily: "'Noto Serif JP', serif", fontSize: 22, fontWeight: 300, color: accent }}>{t.coupleShort}</div>
        <div style={{ position: 'absolute', top: '44%', left: '26%', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 2.8vw, 24px)', fontWeight: 300, letterSpacing: '0.08em', fontStyle: 'italic' }}>{a}<br/><span style={{ color: accent }}>—</span><br/>{b}</div>
        <div style={{ position: 'absolute', bottom: '14%', right: '12%', fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.25em', textAlign: 'right' }}>{t.dateMono}<br/>{t.city}</div>
        <div style={{ position: 'absolute', bottom: '28%', left: '18%', width: 30, height: 0.8, background: accent }} />
      </div>
    ),
    polaroid: (
      <div style={{ padding: 16, color: fg, height: '100%', background: bg, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: '0.3em', opacity: 0.6, display: 'flex', justifyContent: 'space-between' }}><span>SUPER-8 · REEL 01</span><span>● REC</span></div>
        <div style={{ position: 'relative', flex: 1, margin: '12px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 24, position: 'relative', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, transform: 'translateX(-50%)', background: `repeating-linear-gradient(to bottom, ${fg} 0 2px, transparent 2px 4px)` }} />
            {[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: bg, border: `1px solid ${fg}`, position: 'relative', zIndex: 1 }} />)}
          </div>
          <div style={{ flex: 1, transform: 'rotate(-3deg)', background: P.paper || '#fff', padding: 4, paddingBottom: 10, boxShadow: `0 4px 10px ${fg}22`, border: `1px solid ${fg}15` }}>
            <AssetImage src="/assets/images/polaroid-montenegro-coast.png" alt="" ratio="1/1" style={{ height: 'auto' }} />
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 10, textAlign: 'center', marginTop: 2 }}>{t.dateMono}</div>
          </div>
        </div>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(22px, 3.6vw, 30px)', textAlign: 'center', lineHeight: 1 }}>{a} + {b}</div>
      </div>
    ),
    artdeco: (
      <div style={{ color: accent, background: bg, height: '100%', display: 'grid', gridTemplateColumns: '38% 62%', fontFamily: "'Cinzel', serif", position: 'relative' }}>
        <div style={{ padding: '14px 8px', borderRight: `1px solid ${accent}33`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <svg viewBox="0 0 60 60" style={{ width: 28, height: 28 }} aria-hidden="true"><path d="M30 4 L56 30 L30 56 L4 30 Z" fill="none" stroke={accent} strokeWidth="1.2" /><text x="30" y="36" textAnchor="middle" fontSize="12" fill={accent} fontFamily="Cinzel, serif">{t.coupleShort}</text></svg>
          {[['I', 'HOME'], ['II', 'ИСТ'], ['III', 'ПРО'], ['IV', 'ДЕТ']].map(([r, l], i) => (
            <div key={r} style={{ width: '100%', padding: '3px 6px', fontSize: 7, letterSpacing: '0.25em', background: i === 0 ? accent : 'transparent', color: i === 0 ? bg : accent, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.65 }}>{r}</span><span>{l}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 8, border: `0.5px solid ${accent}66`, pointerEvents: 'none' }} />
          <div style={{ fontSize: 8, letterSpacing: '0.4em', opacity: 0.75 }}>— OF —</div>
          <div style={{ fontSize: 'clamp(14px, 2.6vw, 22px)', letterSpacing: '0.18em', margin: '6px 0', lineHeight: 1.1 }}>{a.toUpperCase()}<br/><span style={{ opacity: 0.6, fontSize: '0.7em' }}>&</span><br/>{b.toUpperCase()}</div>
          <div style={{ fontSize: 7, letterSpacing: '0.35em', marginTop: 6 }}>{t.dateMono}</div>
        </div>
      </div>
    ),
  };
  return previews[t.slug] || null;
}

function Process() {
  const steps = [
    { n: '01', title: 'Заявка', body: 'Отправляете форму или пишете в Telegram. Обычно отвечаем за 2–3 часа.' },
    { n: '02', title: 'Выбор дизайна', body: 'Вы выбираете готовый шаблон или мы обсуждаем кастомную концепцию.' },
    { n: '03', title: 'Контент', body: 'Присылаете фото, имена, даты, историю. Шаблон — Google-форма, кастом — Notion-бриф.' },
    { n: '04', title: 'Сборка', body: 'Вы получаете ссылку на preview. Правите текст и фото прямо в интерфейсе.' },
    { n: '05', title: 'Деплой', body: 'Публикуем бесплатно на Render — получаете ссылку вида yournames.onrender.com. RSVP начинают сыпаться.' },
  ];
  return (
    <section id="process" style={{ padding: 'var(--section-y) var(--pad-x)', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <Eyebrow number="(04)">Процесс</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(38px, 5vw, 72px)', lineHeight: 0.98, letterSpacing: '-0.025em', margin: '20px 0 clamp(48px, 8vw, 80px)', fontWeight: 400 }}>
          Пять шагов <span style={{ fontStyle: 'italic' }}>до рассылки</span>.
        </h2>
        <ol className="process-grid" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28 }}>
          {steps.map((s) => <ProcessStep key={s.n} number={s.n} title={s.title} body={s.body} />)}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: 'Шаблон', price: '4 000 ₽', desc: 'Любой из 9 готовых дизайнов', bullets: ['Ваши фото и тексты', 'RSVP-форма', 'Хостинг Render (бесплатно)', 'Один язык', 'Доставка 5 дней'], popular: true },
    { name: 'Кастом', price: '9 000 ₽', desc: 'Дизайн с нуля под пару', bullets: ['Арт-директор + копирайтер', 'Уникальный layout и типографика', 'Анимации и сценарий прокрутки', 'Хостинг Render + 2 языка', 'Срок 2–4 недели'] },
  ];
  return (
    <section id="pricing" style={{ padding: 'var(--section-y) var(--pad-x)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 40, marginBottom: 'clamp(40px, 6vw, 60px)' }}>
          <div>
            <Eyebrow number="(05)">Цены</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(38px, 5vw, 72px)', lineHeight: 0.98, letterSpacing: '-0.025em', margin: '20px 0 0', fontWeight: 400 }}>
              Прозрачно.<br/><span style={{ fontStyle: 'italic' }}>Без пакетов-сюрпризов</span>.
            </h2>
          </div>
          <p style={{ maxWidth: 380, color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Цены указаны за сайт. Хостинг на Render — бесплатно, SSL включён. Правки после публикации — 500 ₽ за правку.
          </p>
        </div>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          {tiers.map((t) => <PriceCard key={t.name} t={t} />)}
        </div>
      </div>
    </section>
  );
}

function PriceCard({ t }: { t: { name: string; price: string; desc: string; bullets: string[]; popular?: boolean } }) {
  const pop = t.popular;
  return (
    <div className="price-card" style={{ padding: 32, borderRadius: 4, background: pop ? 'var(--ink)' : 'transparent', color: pop ? 'var(--bg)' : 'var(--ink)', border: '1px solid ' + (pop ? 'var(--ink)' : 'var(--line)'), display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>{t.name}</h3>
        {pop && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'var(--bg)', color: 'var(--ink)', padding: '4px 10px', borderRadius: 999 }}>Популярно</span>}
      </div>
      <div className="serif" style={{ fontSize: 48, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1 }}>{t.price}</div>
      <div style={{ fontSize: 14, opacity: 0.7 }}>{t.desc}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {t.bullets.map((b) => <li key={b} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.5 }}><span style={{ opacity: 0.5, marginTop: 2 }}>—</span><span>{b}</span></li>)}
      </ul>
      <Button to={t.name === 'Кастом' ? '/contact' : '/templates'} variant={pop ? 'secondary' : 'primary'} tone={pop ? 'light' : 'default'}>
        {t.name === 'Кастом' ? 'Обсудить проект' : 'Выбрать шаблон'} →
      </Button>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: 'Сколько времени занимает весь процесс?', a: 'Готовый шаблон — 5 рабочих дней от получения контента. Кастомный проект — от 2 до 4 недель в зависимости от объёма.' },
    { q: 'Можно ли поменять шрифты и цвета в шаблоне?', a: 'В тарифе Шаблон меняем только контент-поля. В тарифе Кастом правим всё вплоть до сетки, шрифтов и цветов.' },
    { q: 'Как работает RSVP и куда приходят ответы?', a: 'По умолчанию — в Google Sheets, куда у вас есть полный доступ. По запросу можем подключить Notion, Airtable или вебхук.' },
    { q: 'Где размещается сайт?', a: 'Все сайты публикуются на Render — это бесплатный хостинг с автоматическим SSL. Вы получаете адрес вида yournames.onrender.com — без оплаты домена и хостинга.' },
    { q: 'Что с мультиязычностью?', a: 'RU — в базе. EN и любой дополнительный язык — включены в тариф Кастом.' },
    { q: 'Фотосессия нужна?', a: 'Не обязательна. У нас есть шаблоны, которые красиво работают без фото — только типографика и иллюстрации. Мы также работаем с вашим фотографом до или после свадьбы.' },
  ];
  return (
    <section id="faq" style={{ padding: 'var(--section-y) var(--pad-x)', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Eyebrow number="(06)">Вопросы</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(38px, 5vw, 72px)', lineHeight: 0.98, letterSpacing: '-0.025em', margin: '20px 0 clamp(40px, 6vw, 60px)', fontWeight: 400 }}>
          Часто <span style={{ fontStyle: 'italic' }}>спрашивают</span>.
        </h2>
        <dl style={{ borderTop: '1px solid var(--ink)', margin: 0 }}>
          {items.map((it, i) => (
            <FaqItem key={i} index={i} question={it.q} answer={it.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </dl>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section-y) var(--pad-x)', background: 'var(--ink)', color: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', textAlign: 'center' }}>
        <Eyebrow number="(07)" tone="light" align="center">Готовы?</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(44px, 9vw, 128px)', lineHeight: 0.96, letterSpacing: '-0.04em', margin: '36px 0', fontWeight: 400, textWrap: 'balance' } as React.CSSProperties}>
          Давайте соберём<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>ваш сайт.</span>
        </h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/templates" size="lg" variant="secondary" tone="light">Выбрать дизайн</Button>
          <Button to="/contact" size="lg" tone="light">Оставить заявку →</Button>
        </div>
        <p style={{ marginTop: 40, color: 'rgba(245,241,234,0.55)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          · Ответим за 2–3 часа в рабочее время ·
        </p>
      </div>
    </section>
  );
}

// Suppress unused import warning — Placeholder is used via TemplatePreview indirectly
void Placeholder;
