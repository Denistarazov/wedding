// 02 · Swiss — 12-col grid, Helvetica, meta everywhere, no decoration

function TemplateSwiss() {
  const t = TEMPLATES.find((x) => x.slug === 'swiss');
  const cd = useCountdown('2026-06-07T15:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#fff', color: '#111', fontFamily: "'Inter', Helvetica, Arial, sans-serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Top meta grid */}
      <header style={{
        padding: 24, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16,
        borderBottom: '1px solid #111', fontSize: 11, letterSpacing: '0.02em',
      }}>
        <div style={{ gridColumn: '1 / 3' }}>Mira · Leo</div>
        <div style={{ gridColumn: '3 / 5' }}>07.06.2026</div>
        <div style={{ gridColumn: '5 / 7' }}>Zürich, CH</div>
        <div style={{ gridColumn: '7 / 9', textAlign: 'right' }}>47.3769° N</div>
        <div style={{ gridColumn: '9 / 11', textAlign: 'right' }}>8.5417° E</div>
        <div style={{ gridColumn: '11 / 13', textAlign: 'right' }}>ML-2026-0607</div>
      </header>

      {/* Hero — giant reserved name block, minimal */}
      <section style={{ padding: '40px 24px 120px', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <div style={{ gridColumn: '1 / 13', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #111' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.02em' }}>00 / Invitation</span>
          <span style={{ fontSize: 11 }}>Ref. ML-2026-0607</span>
        </div>
        <div style={{ gridColumn: '1 / 9', marginTop: 60 }}>
          <div style={{ fontSize: 'clamp(96px, 18vw, 260px)', lineHeight: 0.85, fontWeight: 300, letterSpacing: '-0.045em' }}>
            mira<br/>leo.
          </div>
        </div>
        <div style={{ gridColumn: '9 / 13', marginTop: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 12 }}>
          <div style={{ fontSize: 12, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            You are warmly invited<br/>to the wedding of<br/>
            <span style={{ fontWeight: 500 }}>Mira Koller<br/>and Leo Engstrøm</span><br/>
            on the seventh of June<br/>two thousand twenty-six<br/>
            at fifteen hundred hours<br/>
            Villa Wesendonck, Zürich
          </div>
        </div>
        <div style={{ gridColumn: '1 / 13', display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #111', fontSize: 11 }}>
          <span>MK · LE</span><span>01 of 09</span><span>→ R.S.V.P.</span>
        </div>
      </section>

      {/* Countdown grid */}
      <section style={{ padding: 24, borderTop: '1px solid #111', borderBottom: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <div style={{ gridColumn: '1 / 4', fontSize: 11, letterSpacing: '0.02em' }}>01 / Countdown</div>
        {[['D', cd.days], ['H', cd.hours], ['M', cd.minutes], ['S', cd.seconds]].map(([k, v], i) => (
          <div key={k} style={{ gridColumn: `span 2`, textAlign: i === 0 ? 'left' : 'left' }}>
            <div style={{ fontSize: 64, fontWeight: 300, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
            <div style={{ fontSize: 11 }}>{k}</div>
          </div>
        ))}
      </section>

      {/* Info sections — each one tiny header + body, grid-aligned */}
      <Block n="02" label="Ceremony">
        <Row k="Time" v="15:00 — 16:00 (CET)" />
        <Row k="Venue" v="Villa Wesendonck · Gablerstrasse 15, Zürich" />
        <Row k="Dress" v="Formal · warm tones preferred" />
        <Row k="Language" v="DE · EN" />
      </Block>
      <Block n="03" label="Reception">
        <Row k="Time" v="17:30 — 00:00" />
        <Row k="Venue" v="Restaurant Kunsthaus, 2nd floor" />
        <Row k="Menu" v="Tasting · 5 courses · vegetarian option" />
        <Row k="Music" v="String quartet → DJ SVEN RASCH" />
      </Block>
      <Block n="04" label="Travel">
        <Row k="Airport" v="ZRH · 18 min by train" />
        <Row k="Hotel block" v="Storchen Zürich · use code MIRALEO2026" />
        <Row k="Shuttle" v="16:45 from hotel lobby" />
      </Block>

      {/* Portrait — minimal, single image, meta alongside */}
      <section style={{ padding: 24, borderTop: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <div style={{ gridColumn: '1 / 4', fontSize: 11, letterSpacing: '0.02em' }}>05 / Figure 01</div>
        <div style={{ gridColumn: '4 / 10' }}>
          <AssetImage src="assets/images/swiss-figure-portrait.png" alt="Mira and Leo portrait" ratio="3/2" />
        </div>
        <div style={{ gridColumn: '10 / 13', fontSize: 11, lineHeight: 1.6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Figure 01<br/>Mira &amp; Leo<br/>Photographed by<br/>Anna Bühler<br/>Zürich, 2026
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: 24, borderTop: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
        <div style={{ gridColumn: '1 / 4', fontSize: 11, letterSpacing: '0.02em' }}>06 / R.S.V.P.</div>
        <div style={{ gridColumn: '4 / 13' }}>
          <div style={{ fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.035em', marginBottom: 40 }}>
            Please respond<br/>by 10 May 2026.
          </div>
          <SwissRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: 24, borderTop: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16, fontSize: 11 }}>
        <div style={{ gridColumn: '1 / 5' }}>ML-2026-0607 · Canvas Studio</div>
        <div style={{ gridColumn: '5 / 9', textAlign: 'center' }}>Mira Koller · Leo Engstrøm</div>
        <div style={{ gridColumn: '9 / 13', textAlign: 'right' }}>07.06.2026 · ZRH</div>
      </footer>
    </div>
  );
}

function Block({ n, label, children }) {
  return (
    <section style={{ padding: 24, borderTop: '1px solid #111', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
      <div style={{ gridColumn: '1 / 4', fontSize: 11, letterSpacing: '0.02em' }}>{n} / {label}</div>
      <div style={{ gridColumn: '4 / 13', display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </section>
  );
}
function Row({ k, v }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 24, fontSize: 15, paddingBottom: 10, borderBottom: '1px solid #eee' }}>
      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>{k}</span>
      <span>{v}</span>
    </div>
  );
}

function SwissRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ padding: 24, border: '1px solid #111', fontSize: 14 }}>Received. Thank you, {rsvp.state.name}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, fontSize: 14 }}>
      <SwissField label="Name" value={rsvp.state.name} onChange={(v) => rsvp.update('name', v)} required />
      <SwissField label="Guests" type="number" value={rsvp.state.guests} onChange={(v) => rsvp.update('guests', v)} />
      <div style={{ gridColumn: '1 / 3' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: 10 }}>Attending</div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['yes', 'YES / will attend'], ['no', 'NO / regretfully decline']].map(([v, l]) => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="radio" checked={rsvp.state.attending === v} onChange={() => rsvp.update('attending', v)} /> {l}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" style={{ gridColumn: '1 / 3', padding: 18, background: '#111', color: '#fff', border: 0, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>Submit response →</button>
    </form>
  );
}
function SwissField({ label, value, onChange, type = 'text', required }) {
  return (
    <label>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: 10 }}>{label}</div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        style={{ width: '100%', padding: 12, border: '1px solid #111', background: '#fff', fontFamily: 'inherit', fontSize: 14, outline: 'none' }} />
    </label>
  );
}

Object.assign(window, { TemplateSwiss });
