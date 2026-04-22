// 05 · Brutalist — massive Archivo Black, red accent, raw grid, no decoration

function TemplateBrutalist() {
  const t = TEMPLATES.find((x) => x.slug === 'brutalist');
  const cd = useCountdown('2026-08-03T14:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{
      background: '#eae4d8',
      color: '#000',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(234,228,216,0.88), rgba(234,228,216,0.88)), url(assets/images/brutalist-urban-poster-texture.png)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
    }}>
      <DemoBar t={t} />

      {/* Hero */}
      <section style={{ padding: '32px 24px', borderBottom: '2px solid #000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500 }}>
          <span>IRA × JAN — WEDDING DOCUMENT v.1.0</span>
          <span style={{ background: '#ff3b1f', color: '#fff', padding: '2px 8px' }}>BER / 03.08.26</span>
        </div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(120px, 24vw, 360px)', lineHeight: 0.82, letterSpacing: '-0.06em', marginTop: 40 }}>
          IRA
        </div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(80px, 14vw, 220px)', lineHeight: 0.82, letterSpacing: '-0.05em', color: '#ff3b1f', margin: '0.1em 0' }}>
          ×
        </div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(120px, 24vw, 360px)', lineHeight: 0.82, letterSpacing: '-0.06em', textAlign: 'right' }}>
          JAN
        </div>
      </section>

      {/* Facts row */}
      <section style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderBottom: '2px solid #000' }}>
        {[['DATE', '03.08.2026'], ['TIME', '14:00 CET'], ['PLACE', 'KREUZBERG, BERLIN'], ['CODE', 'COLOR ALLOWED']].map(([k, v]) => (
          <div key={k} style={{ borderRight: '1px solid #000', padding: '0 20px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>{k}</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(20px, 2.6vw, 34px)', letterSpacing: '-0.02em', marginTop: 8 }}>{v}</div>
          </div>
        ))}
      </section>

      {/* Manifesto */}
      <section style={{ padding: '80px 24px', borderBottom: '2px solid #000' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            § 01<br/>MANIFESTO
          </div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(32px, 4vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.035em' }}>
            WE'RE GETTING MARRIED.<br/>
            <span style={{ color: '#ff3b1f' }}>NO</span> DRESS CODE.<br/>
            <span style={{ color: '#ff3b1f' }}>NO</span> SEATING CHART.<br/>
            <span style={{ color: '#ff3b1f' }}>NO</span> PRESENT LIST.<br/>
            <span style={{ color: '#ff3b1f' }}>YES</span> TO YOU.
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '40px 24px', borderBottom: '2px solid #000', background: '#000', color: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[['DAYS', cd.days], ['HOURS', cd.hours], ['MINUTES', cd.minutes], ['SECONDS', cd.seconds]].map(([k, v], i) => (
            <div key={k} style={{ padding: 20, borderRight: i < 3 ? '1px solid #333' : 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', opacity: 0.6 }}>{k}</div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(48px, 7vw, 96px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em', marginTop: 6 }}>{String(v).padStart(2, '0')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programme table */}
      <section style={{ padding: '80px 24px', borderBottom: '2px solid #000' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>§ 02 PROGRAMME</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(18px, 2.5vw, 28px)', letterSpacing: '-0.02em' }}>
          <tbody>
            {[
              ['14:00', 'CEREMONY', 'COURTYARD, GROUND FLOOR'],
              ['15:30', 'STREET FOOD', 'YARD · 12 VENDORS'],
              ['18:00', 'DINNER', 'BASEMENT LEVEL'],
              ['20:30', 'BAND: KRAUTFUNK', 'STAGE A'],
              ['23:00', 'DJ: LUCA LÖWENZAHN', 'STAGE B UNTIL LATE'],
            ].map(([time, title, place], i) => (
              <tr key={i} style={{ borderTop: '2px solid #000' }}>
                <td style={{ padding: '20px 0', width: 120 }}>{time}</td>
                <td style={{ padding: '20px 0' }}>{title}</td>
                <td style={{ padding: '20px 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, textAlign: 'right', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* RSVP */}
      <section style={{ padding: '80px 24px', background: '#ff3b1f', color: '#000' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>§ 03 RSVP FORM</div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(56px, 9vw, 140px)', lineHeight: 0.88, letterSpacing: '-0.05em', marginBottom: 40 }}>
          TELL US<br/>YES OR NO.
        </div>
        <BrutalistRSVP rsvp={rsvp} />
      </section>

      <footer style={{ padding: 20, background: '#000', color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, display: 'flex', justifyContent: 'space-between', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        <span>IRA × JAN · 03.08.26 · BER</span>
        <span>DOC v.1.0 · PRINTED ON WEB</span>
      </footer>
    </div>
  );
}

function BrutalistRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 48, letterSpacing: '-0.03em' }}>GOT IT, {rsvp.state.name.toUpperCase()}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, maxWidth: 900 }}>
      <input required placeholder="NAME" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ gridColumn: 'span 2', padding: 18, background: '#000', color: '#fff', border: 0, fontFamily: "'Archivo Black', sans-serif", fontSize: 18, letterSpacing: '-0.02em', outline: 'none' }} />
      <button type="button" onClick={() => rsvp.update('attending', 'yes')}
        style={{ padding: 18, background: rsvp.state.attending === 'yes' ? '#000' : 'transparent', color: rsvp.state.attending === 'yes' ? '#ff3b1f' : '#000', border: '2px solid #000', cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: 18 }}>YES</button>
      <button type="button" onClick={() => rsvp.update('attending', 'no')}
        style={{ padding: 18, background: rsvp.state.attending === 'no' ? '#000' : 'transparent', color: rsvp.state.attending === 'no' ? '#ff3b1f' : '#000', border: '2px solid #000', borderLeft: 0, cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", fontSize: 18 }}>NO</button>
      <button type="submit" style={{ gridColumn: 'span 4', padding: 22, background: '#000', color: '#ff3b1f', border: 0, fontFamily: "'Archivo Black', sans-serif", fontSize: 24, letterSpacing: '-0.02em', cursor: 'pointer', marginTop: 8 }}>SUBMIT →</button>
    </form>
  );
}

Object.assign(window, { TemplateBrutalist });
