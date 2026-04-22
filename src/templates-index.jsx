// /templates index page — filterable grid

function TemplatesIndex() {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid'); // grid | list

  const styles = ['all', 'Editorial', 'Swiss', 'Ботанический', 'Dark luxe', 'Бруталист', 'Letterpress', 'Wabi-sabi', 'Polaroid', 'Art Deco'];
  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.styleRu === filter);

  return (
    <div>
      <TopNav />
      <section style={{ padding: '80px 40px 40px' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>
          <Eyebrow>Portfolio · 09 works</Eyebrow>
          <h1 className="serif" style={{
            fontSize: 'clamp(56px, 9vw, 148px)', lineHeight: 0.92, letterSpacing: '-0.035em',
            margin: '24px 0 0', fontWeight: 400,
          }}>
            Все <span style={{ fontStyle: 'italic' }}>дизайны</span>.
          </h1>
          <p style={{ marginTop: 28, maxWidth: 560, color: 'var(--ink-2)', fontSize: 18, lineHeight: 1.55 }}>
            Девять продуманных от начала до конца миров.
            Каждый можно открыть как полноценное демо
            с реальными данными вымышленной пары.
          </p>
        </div>
      </section>

      {/* sticky filter bar */}
      <div style={{
        position: 'sticky', top: 58, zIndex: 10,
        borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        background: 'rgba(245,241,234,0.85)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1360, margin: '0 auto', padding: '14px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginRight: 8 }}>Стиль</span>
            {styles.map((s) => (
              <Chip key={s} role="tab" aria-selected={filter === s} active={filter === s} onClick={() => setFilter(s)}>
                {s === 'all' ? 'Все 09' : s}
              </Chip>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['grid', 'list'].map((v) => (
              <Chip key={v} aria-pressed={view === v} active={view === v} onClick={() => setView(v)}>
                {v === 'grid' ? '⊞ Сетка' : '≡ Список'}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <section style={{ padding: '60px 40px 0' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }}>
          {view === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {filtered.map((t) => (
                <TemplateCard key={t.slug} t={t} idx={TEMPLATES.indexOf(t)} />
              ))}
            </div>
          ) : (
            <div style={{ borderTop: '1px solid var(--line)' }}>
              {filtered.map((t) => (
                <TemplateRow key={t.slug} t={t} idx={TEMPLATES.indexOf(t)} />
              ))}
            </div>
          )}
          {filtered.length === 0 && (
            <p style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>Ничего не найдено. Сбросьте фильтр.</p>
          )}
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </div>
  );
}

// TemplateCardIndex removed — TemplateCard (unified) is now used everywhere.

function TemplateRow({ t, idx }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={`/templates/${t.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 120px 40px', gap: 20, alignItems: 'center',
        borderBottom: '1px solid var(--line)', cursor: 'pointer',
        background: hov ? 'rgba(42,36,24,0.03)' : 'transparent', transition: 'background 0.2s',
        padding: '28px 12px',
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em' }}>№ 0{idx + 1}</div>
      <div className="serif" style={{ fontSize: 28, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{t.name}</div>
      <div style={{ fontSize: 14 }}>{t.styleRu}</div>
      <div style={{ fontSize: 14, color: 'var(--muted)' }}>{t.couple}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted)' }}>{t.date}</div>
      <div style={{ textAlign: 'right', fontSize: 18, opacity: hov ? 1 : 0.4, transform: hov ? 'translateX(4px)' : 'none', transition: 'all 0.25s' }}>→</div>
    </Link>
  );
}

Object.assign(window, { TemplatesIndex });
