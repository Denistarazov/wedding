// 04 · Dark luxe — black/gold, cinematic hero crop, Cormorant italic, serif numbers

function TemplateDark() {
  const t = TEMPLATES.find((x) => x.slug === 'dark');
  const cd = useCountdown('2026-11-30T19:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#0d0b08', color: '#d4b87a', fontFamily: "'Cormorant Garamond', serif", minHeight: '100vh' }}>
      <DemoBar t={t} theme="dark" />

      {/* Hero — cinematic full-bleed */}
      <section style={{ height: '100vh', minHeight: 700, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,11,8,0) 0%, rgba(13,11,8,0.3) 50%, rgba(13,11,8,0.95) 100%)' }} />
        <AssetImage src="assets/images/dark-luxe-hero-paris.png" alt="Sofia and Max in nocturne Paris" ratio="16/9" style={{ position: 'absolute', inset: 0, height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,11,8,0.55) 0%, rgba(13,11,8,0.2) 50%, rgba(13,11,8,0.95) 100%)' }} />

        <div style={{ position: 'absolute', top: 40, left: 0, right: 0, padding: '0 40px', display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.7 }}>
          <span>PARIS · MMXXVI</span><span>— NOCTURNE —</span><span>№ 001 / 001</span>
        </div>

        <div style={{ position: 'absolute', bottom: 80, left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.4em', marginBottom: 32, opacity: 0.75 }}>— 30 · XI · MMXXVI —</div>
          <div style={{ fontSize: 'clamp(80px, 14vw, 200px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '0.01em' }}>Sofia</div>
          <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', margin: '-0.2em 0', fontStyle: 'italic', opacity: 0.7 }}>&amp;</div>
          <div style={{ fontSize: 'clamp(80px, 14vw, 200px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '0.01em' }}>Max</div>
        </div>

        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', opacity: 0.5 }}>↓ SCROLL</div>
      </section>

      {/* Invitation text */}
      <section style={{ padding: '140px 40px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <p style={{ fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 1.4, fontWeight: 300, fontStyle: 'italic', margin: 0, color: '#e8d4a8' }}>
          В ночь, когда Париж гаснет, а зал заливает свечной свет — мы приглашаем вас быть рядом.
        </p>
        <div style={{ marginTop: 60, width: 40, height: 0.5, background: '#d4b87a', margin: '60px auto 0', opacity: 0.5 }} />
      </section>

      {/* Countdown — big serif numerals */}
      <section style={{ padding: '80px 40px', textAlign: 'center', borderTop: '1px solid rgba(212,184,122,0.15)', borderBottom: '1px solid rgba(212,184,122,0.15)' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55 }}>TILL WE MEET</div>
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 5vw, 80px)', flexWrap: 'wrap' }}>
          {[['days', cd.days], ['hours', cd.hours], ['minutes', cd.minutes], ['seconds', cd.seconds]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 'clamp(72px, 10vw, 140px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: '#e8d4a8' }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 10, opacity: 0.55 }}>{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Program — alternating left/right with thin dividers */}
      <section style={{ padding: '120px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55 }}>PROGRAMME</div>
          <h2 style={{ fontSize: 'clamp(48px, 6vw, 88px)', fontStyle: 'italic', fontWeight: 300, margin: '20px 0 0', lineHeight: 1 }}>Сценарий вечера</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            ['19:00', 'Welcome champagne', 'Grand Salon · Palais'],
            ['20:00', 'Ceremony', 'Candlelit Nave'],
            ['21:30', 'Dinner by Bertrand', 'La Salle · Chef Bertrand Guéneron'],
            ['23:00', 'First dance', 'Ballroom'],
            ['00:00', 'Midnight toast', 'Terrace overlooking Seine'],
            ['03:00', 'End of service', 'Last shuttle'],
          ].map(([time, title, place], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 40, padding: '28px 0', borderBottom: '1px solid rgba(212,184,122,0.2)', alignItems: 'baseline' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.15em', opacity: 0.65 }}>{time}</div>
              <div style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 300 }}>{title}</div>
              <div style={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6 }}>{place}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section style={{ padding: '100px 40px', background: '#11100b', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55 }}>DRESS CODE</div>
        <h2 style={{ fontSize: 'clamp(56px, 8vw, 120px)', fontStyle: 'italic', fontWeight: 300, margin: '20px 0 0', lineHeight: 1, letterSpacing: '0.02em' }}>Black Tie,<br/>nocturne.</h2>
        <p style={{ marginTop: 24, maxWidth: 500, margin: '24px auto 0', fontSize: 17, lineHeight: 1.5, opacity: 0.75, fontStyle: 'italic' }}>
          Глубокие цвета, бархат, длинные платья. Без белого — для нас этот цвет только у невесты.
        </p>
      </section>

      {/* RSVP */}
      <section style={{ padding: '120px 40px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.55 }}>R · S · V · P</div>
          <h2 style={{ fontSize: 'clamp(64px, 9vw, 140px)', fontStyle: 'italic', fontWeight: 300, margin: '20px 0 0', lineHeight: 0.95 }}>Будем<br/>ждать.</h2>
          <DarkRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.4, borderTop: '1px solid rgba(212,184,122,0.15)' }}>
        S · M · MMXXVI · PARIS
      </footer>
    </div>
  );
}

function DarkRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 40, fontStyle: 'italic', fontSize: 24, color: '#e8d4a8' }}>Ваш ответ получен, {rsvp.state.name}. До встречи.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <input required placeholder="Your name" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(212,184,122,0.3)', color: '#e8d4a8', fontSize: 28, fontStyle: 'italic', padding: '12px 0', outline: 'none', textAlign: 'center', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 12 }}>
        {[['yes', 'Accept'], ['no', 'Decline']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 18, background: rsvp.state.attending === v ? '#d4b87a' : 'transparent', color: rsvp.state.attending === v ? '#0d0b08' : '#d4b87a', border: '1px solid rgba(212,184,122,0.4)', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 12, padding: 18, background: '#d4b87a', color: '#0d0b08', border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer' }}>Confirm →</button>
    </form>
  );
}

Object.assign(window, { TemplateDark });
