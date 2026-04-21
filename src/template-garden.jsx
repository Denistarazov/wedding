// 03 · Garden botanical — soft sage, illustrated florals, Cormorant italic, ornament-framed

function TemplateGarden() {
  const t = TEMPLATES.find((x) => x.slug === 'garden');
  const cd = useCountdown('2026-05-22T17:00:00');
  const rsvp = useRsvp();

  return (
    <div style={{ background: '#eef2e6', color: '#2d3a26', fontFamily: "'Cormorant Garamond', serif", minHeight: '100vh' }}>
      <DemoBar t={t} />

      {/* Hero with botanical ornaments */}
      <section style={{ padding: '100px 40px 80px', position: 'relative', textAlign: 'center' }}>
        <BotanicalOrnament style={{ position: 'absolute', top: 20, left: 40, width: 200, opacity: 0.5 }} />
        <BotanicalOrnament style={{ position: 'absolute', top: 40, right: 40, width: 200, opacity: 0.5, transform: 'scaleX(-1)' }} />

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.65 }}>
          — With joy, we invite you —
        </div>
        <div style={{ marginTop: 40, fontSize: 'clamp(64px, 10vw, 140px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em' }}>
          Ella
        </div>
        <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, margin: '-0.2em 0', letterSpacing: '0.2em' }}>&amp;</div>
        <div style={{ fontSize: 'clamp(64px, 10vw, 140px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.01em' }}>
          Matteo
        </div>
        <div style={{ marginTop: 60, fontSize: 20, letterSpacing: '0.1em' }}>
          22 · MAY · 2026
        </div>
        <div style={{ fontSize: 15, letterSpacing: '0.25em', marginTop: 8, opacity: 0.7 }}>
          TUSCANY · ITALY
        </div>

        <div style={{ margin: '60px auto 0', width: 200, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 0.5, background: '#2d3a26', opacity: 0.4 }} />
          <svg viewBox="0 0 20 20" style={{ width: 14 }}><circle cx="10" cy="10" r="2" fill="#2d3a26" /></svg>
          <div style={{ flex: 1, height: 0.5, background: '#2d3a26', opacity: 0.4 }} />
        </div>
      </section>

      {/* Narrative + illustration */}
      <section style={{ padding: '80px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <BotanicalOrnament style={{ width: 90, opacity: 0.5, marginBottom: 20 }} />
            <h2 style={{ fontSize: 48, fontStyle: 'italic', fontWeight: 300, margin: 0, lineHeight: 1 }}>Наша история</h2>
            <p style={{ marginTop: 28, fontSize: 19, lineHeight: 1.65, fontFamily: 'EB Garamond, serif' }}>
              Мы встретились в мастерской флориста на окраине Флоренции — она покупала пионы, а он привёз ветки оливы.
              Три года спустя — та же мастерская, те же пионы и тот же оливковый лист в свадебном букете.
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.65, fontFamily: 'EB Garamond, serif' }}>
              Хотим разделить этот день с самыми близкими людьми в старом villa под оливами.
            </p>
          </div>
          <div>
            <div style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
              <Placeholder label="couple · garden · olive grove" ratio="3/4" fg="#5a6a4a" bg="#d9e2c8" variant="dots" style={{ height: '100%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Details in leaf-framed cards */}
      <section style={{ padding: '80px 40px', background: '#e5ecd8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontStyle: 'italic', fontWeight: 300, margin: 0, lineHeight: 1 }}>Программа дня</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 60 }}>
            {[
              ['17:00', 'Церемония', 'Под оливковым деревом во дворе villa'],
              ['19:00', 'Ужин', 'Длинный стол с flora-декором'],
              ['21:30', 'Танцы', 'Живая музыка и светлячки'],
            ].map(([time, title, body]) => (
              <div key={title} style={{ padding: 32, textAlign: 'center' }}>
                <BotanicalOrnament style={{ width: 60, opacity: 0.5, margin: '0 auto 16px' }} />
                <div style={{ fontSize: 14, letterSpacing: '0.25em', opacity: 0.7 }}>{time}</div>
                <div style={{ fontSize: 32, fontStyle: 'italic', margin: '10px 0 8px', fontWeight: 300 }}>{title}</div>
                <div style={{ fontSize: 16, fontFamily: 'EB Garamond, serif', lineHeight: 1.5, opacity: 0.8 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, letterSpacing: '0.3em', opacity: 0.65 }}>COUNTING THE DAYS</div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[['дней', cd.days], ['часов', cd.hours], ['минут', cd.minutes]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 96, fontStyle: 'italic', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              <div style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.65, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '100px 40px', background: '#2d3a26', color: '#eef2e6' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <BotanicalOrnament style={{ width: 120, opacity: 0.6, margin: '0 auto 20px' }} stroke="#eef2e6" />
          <h2 style={{ fontSize: 'clamp(48px, 7vw, 88px)', fontStyle: 'italic', fontWeight: 300, margin: 0, lineHeight: 1 }}>Пожалуйста,<br/>ответьте</h2>
          <p style={{ marginTop: 24, fontSize: 17, opacity: 0.8, fontFamily: 'EB Garamond, serif', lineHeight: 1.5 }}>До первого мая 2026 года.</p>
          <GardenRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 16, opacity: 0.7, background: '#2d3a26', color: '#eef2e6' }}>
        With love, Ella &amp; Matteo · May the twenty-second, two thousand twenty-six
      </footer>
    </div>
  );
}

function BotanicalOrnament({ style, stroke = '#2d3a26' }) {
  return (
    <svg viewBox="0 0 200 100" style={style}>
      <g stroke={stroke} fill="none" strokeWidth="0.8">
        <path d="M10 50 Q60 20, 100 50 T190 50" opacity="0.6" />
        <g opacity="0.8">
          {[30, 60, 90, 120, 150].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${45 + (i % 2) * 6})`}>
              <ellipse cx="0" cy="-5" rx="3" ry="6" transform="rotate(-20)" />
              <ellipse cx="0" cy="5" rx="3" ry="6" transform="rotate(20)" />
              <circle cx="0" cy="0" r="1.5" fill={stroke} />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

function GardenRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 32, fontStyle: 'italic', fontSize: 22 }}>Мы так рады, {rsvp.state.name}. Ждём вас среди олив.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(238,242,230,0.4)', color: '#eef2e6', fontSize: 26, fontStyle: 'italic', padding: '10px 0', outline: 'none' }} />
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {[['yes', 'С радостью'], ['no', 'К сожалению, нет']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? '#eef2e6' : 'transparent', color: rsvp.state.attending === v ? '#2d3a26' : '#eef2e6', border: '1px solid rgba(238,242,230,0.4)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 18, fontStyle: 'italic' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 12, padding: 18, background: '#eef2e6', color: '#2d3a26', border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Отправить →</button>
    </form>
  );
}

Object.assign(window, { TemplateGarden });
