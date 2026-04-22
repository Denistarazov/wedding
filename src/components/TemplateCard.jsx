// TemplateCard — clickable template preview card
//
// Used on both the Home portfolio grid and the /templates index grid.
// Single unified component — previously duplicated as TemplateCard + TemplateCardIndex.
//
// Props: t (template object from TEMPLATES), idx (0-based index for label)
// Hover animation is handled by .tpl-card CSS class (no inline style needed).

function TemplateCard({ t, idx }) {
  return (
    <Link
      to={`/templates/${t.slug}`}
      aria-label={`Открыть шаблон ${t.name} — ${t.styleRu}`}
      style={{ display: 'block', cursor: 'pointer' }}
    >
      <div className="tpl-card" style={{
        position: 'relative', aspectRatio: '4/5', overflow: 'hidden',
        background: t.previewBg,
      }}>
        <TemplatePreview template={t} />
        <div style={{
          position: 'absolute', top: 16, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: t.slug === 'dark' || t.slug === 'artdeco'
            ? 'rgba(255,255,255,0.8)' : 'rgba(42,36,24,0.6)',
        }}>
          <span>№ 0{idx + 1}</span>
          <span>{t.styleRu}</span>
        </div>
      </div>
      <div style={{
        padding: '18px 2px 0', display: 'flex',
        justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div>
          <div className="serif" style={{ fontSize: 24, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{t.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{t.tagline}</div>
        </div>
        <div aria-hidden="true" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, opacity: 0.4,
        }}>→</div>
      </div>
    </Link>
  );
}
