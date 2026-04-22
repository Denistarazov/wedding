// Shared utilities used by individual template demos:
// - Countdown hook
// - RSVP form (each template styles its own visually, but the state logic here)
// - Demo chrome (floating "this is a demo" bar with CTA back to main site)

function useCountdown(targetIso) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const target = new Date(targetIso).getTime();
  const d = Math.max(0, target - now);
  const days = Math.floor(d / (1000 * 60 * 60 * 24));
  const hours = Math.floor((d / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((d / (1000 * 60)) % 60);
  const seconds = Math.floor((d / 1000) % 60);
  return { days, hours, minutes, seconds };
}

// Floating demo-chrome bar (top). Shows this is a template preview + returns to /templates.
function DemoBar({ t, theme = 'light' }) {
  const [open, setOpen] = useState(true);
  const dark = theme === 'dark';
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 200,
          background: dark ? 'rgba(20,16,10,0.8)' : 'rgba(245,241,234,0.85)',
          backdropFilter: 'blur(12px)',
          color: dark ? '#f5f1ea' : '#2a2418',
          border: dark ? '1px solid rgba(245,241,234,0.2)' : '1px solid rgba(42,36,24,0.15)',
          borderRadius: 999, padding: '8px 14px', cursor: 'pointer',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}
      >Canvas · {t.name} ↓</button>
    );
  }
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
      background: dark ? 'rgba(15,12,8,0.85)' : 'rgba(245,241,234,0.92)',
      backdropFilter: 'blur(14px)',
      color: dark ? '#f5f1ea' : '#2a2418',
      border: dark ? '1px solid rgba(245,241,234,0.18)' : '1px solid rgba(42,36,24,0.12)',
      borderRadius: 999, padding: '8px 8px 8px 20px',
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      maxWidth: 'calc(100vw - 32px)',
    }}>
      <Link to="/templates" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.7 }}>
        ← Все дизайны
      </Link>
      <span style={{ opacity: 0.3 }}>|</span>
      <span style={{ opacity: 0.85 }}>
        <span style={{ fontStyle: 'italic', fontFamily: "'Fraunces', serif", textTransform: 'none', letterSpacing: 0, fontSize: 14 }}>{t.name}</span>
        <span style={{ marginLeft: 10, opacity: 0.55 }}>· {t.styleRu}</span>
      </span>
      <Button to="/contact" size="sm" tone={dark ? 'light' : 'default'}>Заказать такой →</Button>
      <button
        onClick={() => setOpen(false)}
        style={{ background: 'transparent', border: 0, color: 'inherit', cursor: 'pointer', fontSize: 14, opacity: 0.5, padding: '0 6px' }}
        aria-label="collapse"
      >×</button>
    </div>
  );
}

// Minimal generic RSVP logic — each template wraps in its own visuals
function useRsvp() {
  const [state, setState] = useState({ name: '', attending: 'yes', guests: 1, dietary: '' });
  const [sent, setSent] = useState(false);
  const update = (k, v) => setState((s) => ({ ...s, [k]: v }));
  const submit = (e) => { e?.preventDefault?.(); setSent(true); };
  return { state, update, submit, sent };
}

Object.assign(window, { useCountdown, DemoBar, useRsvp });
