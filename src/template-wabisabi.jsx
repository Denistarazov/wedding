// 07 · Wabi-sabi — lots of white, asymmetric placements, ink-brush, Japanese hint

function TemplateWabiSabi() {
  const t = TEMPLATES.find((x) => x.slug === 'wabisabi');
  const cd = useCountdown('2026-04-11T15:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#f2ede4', color: '#1a1814', fontFamily: "'Noto Serif JP', 'Cormorant Garamond', serif", minHeight: '100vh', overflow: 'hidden' }}>
      <DemoBar t={t} />

      {/* Hero — asymmetric with huge empty space */}
      <section style={{ minHeight: '90vh', position: 'relative', padding: '120px 40px 80px' }}>
        <div style={{ position: 'absolute', top: '18%', left: '8%', fontFamily: "'Noto Serif JP', serif", fontSize: 'clamp(120px, 18vw, 260px)', fontWeight: 300, color: '#1a1814', lineHeight: 1 }}>結</div>

        <InkCircle style={{ position: 'absolute', top: '12%', right: '10%', width: 160, opacity: 0.7 }} />

        <div style={{ position: 'absolute', top: '48%', left: '28%', maxWidth: 520 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 6vw, 76px)', fontStyle: 'italic', fontWeight: 300, letterSpacing: '0.08em', lineHeight: 1.1 }}>
            Yuki<br/>—<br/>Ren
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '8%', right: '10%', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.25em', textAlign: 'right' }}>
          2026<span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>04<span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>11<br/>
          <span style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 16, letterSpacing: '0.1em' }}>京都 · Kyoto</span>
        </div>

        <div style={{ position: 'absolute', bottom: '20%', left: '12%', width: 70, height: 0.8, background: '#d85a3b' }} />
      </section>

      {/* Poem */}
      <section style={{ padding: '140px 40px', maxWidth: 900, margin: '0 auto', position: 'relative' }}>
        <InkCircle style={{ position: 'absolute', top: 40, left: 40, width: 60, opacity: 0.4 }} />
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(22px, 2.8vw, 32px)', lineHeight: 1.7, fontWeight: 300, paddingLeft: '20%' }}>
          Мы собираемся в Киото,<br/>
          когда сакура <span style={{ color: '#d85a3b' }}>только распускается</span>,<br/>
          в старом доме с бумажными стенами,<br/>
          и хотим, чтобы вы были рядом.
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', marginTop: 40, paddingLeft: '20%', opacity: 0.5 }}>— Y &amp; R</div>
      </section>

      {/* Program — asymmetric list with ink accents */}
      <section style={{ padding: '80px 40px 120px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 60, fontWeight: 300, marginBottom: 48 }}>式次第 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic', opacity: 0.6, marginLeft: 16 }}>— programme</span></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            ['15:00', '式', 'Ceremony', 'Kennin-ji temple, private garden'],
            ['17:00', '宴', 'Kaiseki dinner', 'Hosted by chef Kenji Tanaka'],
            ['20:00', '茶', 'Tea ceremony', 'Matcha &amp; wagashi'],
            ['21:30', '夜', 'Late music', 'Shamisen &amp; slow DJ'],
          ].map(([time, ja, en, desc], i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '80px 100px 1fr 1fr', gap: 40,
              padding: '32px 0', borderBottom: i < 3 ? '1px solid rgba(26,24,20,0.15)' : 0,
              alignItems: 'baseline',
              paddingLeft: i % 2 === 0 ? 0 : 60,
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.15em', opacity: 0.6 }}>{time}</div>
              <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 32, fontWeight: 300, color: '#d85a3b' }}>{ja}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontStyle: 'italic', fontWeight: 300, letterSpacing: '0.05em' }} dangerouslySetInnerHTML={{ __html: en }} />
              <div style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', opacity: 0.7, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
          ))}
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '80px 40px', textAlign: 'center', position: 'relative' }}>
        <InkCircle style={{ position: 'absolute', top: 20, right: '30%', width: 120, opacity: 0.3 }} />
        <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 120, fontWeight: 300, lineHeight: 1 }}>{cd.days}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontStyle: 'italic', marginTop: 10, opacity: 0.7 }}>days remain</div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '120px 40px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 64, fontWeight: 300 }}>返信 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontStyle: 'italic', opacity: 0.6, marginLeft: 10 }}>— reply</span></div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, marginTop: 16, opacity: 0.75 }}>before 11 March 2026</p>
        <WabiRSVP rsvp={rsvp} />
      </section>

      <footer style={{ padding: 40, display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', opacity: 0.5 }}>
        <span>YUKI · REN</span><span>京都 · 2026</span>
      </footer>
    </div>
  );
}

function InkCircle({ style }) {
  return (
    <svg viewBox="0 0 100 100" style={style}>
      <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1814" strokeWidth="2.5" strokeDasharray="200 40 80 20" strokeLinecap="round" transform="rotate(-12 50 50)" />
    </svg>
  );
}

function WabiRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 24, color: '#d85a3b' }}>ありがとう, {rsvp.state.name}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <input required placeholder="Your name" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid #1a1814', color: '#1a1814', fontSize: 28, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', padding: '10px 0', outline: 'none' }} />
      <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
        {[['yes', '出席 · attending'], ['no', '欠席 · regret']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 20, background: rsvp.state.attending === v ? '#1a1814' : 'transparent', color: rsvp.state.attending === v ? '#f2ede4' : '#1a1814', border: '1px solid #1a1814', cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontStyle: 'italic' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 12, padding: 16, background: '#d85a3b', color: '#f2ede4', border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer' }}>送信 · send</button>
    </form>
  );
}

Object.assign(window, { TemplateWabiSabi });
