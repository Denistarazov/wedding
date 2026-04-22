'use client';

import { useState } from 'react';
import { TopNav, Footer, Eyebrow, Chip, Link } from './shared';
import { TEMPLATES, type TemplateData } from './templates-data';
import { TemplateCard, FinalCTA } from './home';

export function TemplatesIndex() {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const styles = ['all', 'Editorial', 'Swiss', 'Ботанический', 'Dark luxe', 'Бруталист', 'Letterpress', 'Wabi-sabi', 'Polaroid', 'Art Deco', 'Neon / Glitch', 'Коттеджкор', 'Мемфис / 80-е'];
  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.styleRu === filter);

  return (
    <div>
      <TopNav />
      <main id="main">
        <section style={{ padding: 'clamp(48px, 7vw, 72px) var(--pad-x) 36px' }}>
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            <Eyebrow>Portfolio · 12 works</Eyebrow>
            <h1 className="serif page-title" style={{ fontSize: 'clamp(48px, 7.2vw, 108px)', lineHeight: 0.96, letterSpacing: '-0.035em', margin: '24px 0 0', fontWeight: 400 }}>
              Все <span style={{ fontStyle: 'italic' }}>дизайны</span>.
            </h1>
            <p style={{ marginTop: 28, maxWidth: 560, color: 'var(--ink-2)', fontSize: 'clamp(16px, 1.4vw, 18px)', lineHeight: 1.55 }}>
              Девять продуманных от начала до конца миров. Каждый можно открыть как полноценное демо с реальными данными вымышленной пары.
            </p>
          </div>
        </section>

        <div style={{ position: 'sticky', top: 58, zIndex: 10, borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'rgba(245,241,234,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div className="filter-bar" style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '14px var(--pad-x)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div role="tablist" aria-label="Фильтр по стилю" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginRight: 8 }}>Стиль</span>
              {styles.map((s) => (
                <Chip key={s} role="tab" aria-selected={filter === s} active={filter === s} onClick={() => setFilter(s)}>
                  {s === 'all' ? 'Все 12' : s}
                </Chip>
              ))}
            </div>
            <div role="group" aria-label="Вид отображения" style={{ display: 'flex', gap: 4 }}>
              {(['grid', 'list'] as const).map((v) => (
                <Chip key={v} aria-pressed={view === v} active={view === v} onClick={() => setView(v)}>
                  {v === 'grid' ? '⊞ Сетка' : '≡ Список'}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <section style={{ padding: 'clamp(40px, 6vw, 60px) var(--pad-x) 0' }}>
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            {view === 'grid' ? (
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'clamp(18px, 2vw, 28px)' }}>
                {filtered.map((t) => <TemplateCard key={t.slug} t={t} idx={TEMPLATES.indexOf(t)} />)}
              </div>
            ) : (
              <div style={{ borderTop: '1px solid var(--line)' }}>
                {filtered.map((t) => <TemplateRow key={t.slug} t={t} idx={TEMPLATES.indexOf(t)} />)}
              </div>
            )}
            {filtered.length === 0 && (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>
                <p style={{ marginBottom: 16 }}>Ничего не найдено.</p>
                <button onClick={() => setFilter('all')} style={{ background: 'transparent', border: '1px solid var(--line)', padding: '10px 20px', cursor: 'pointer', fontFamily: 'inherit' }}>Сбросить фильтр</button>
              </div>
            )}
          </div>
        </section>

        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function TemplateRow({ t, idx }: { t: TemplateData; idx: number }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={`/templates/${t.slug}`}
      aria-label={`${t.name} — ${t.styleRu}, ${t.couple}, ${t.date}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="templates-row"
      style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 120px 40px', gap: 20, alignItems: 'center', padding: '28px 12px', borderBottom: '1px solid var(--line)', cursor: 'pointer', background: hov ? 'rgba(42,36,24,0.04)' : 'transparent', transition: 'background 0.2s var(--ease)' }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em' }}>№ 0{idx + 1}</div>
      <div className="serif" style={{ fontSize: 28, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{t.name}</div>
      <div style={{ fontSize: 14 }}>{t.styleRu}</div>
      <div style={{ fontSize: 14, color: 'var(--muted)' }}>{t.couple}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted)' }}>{t.date}</div>
      <div aria-hidden="true" style={{ textAlign: 'right', fontSize: 18, opacity: hov ? 1 : 0.4, transform: hov ? 'translateX(4px)' : 'none', transition: 'all 0.25s var(--ease)' }}>→</div>
    </Link>
  );
}
