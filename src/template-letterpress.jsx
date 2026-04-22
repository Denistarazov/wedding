// 06 · Letterpress — aged paper, centered classical, EB Garamond, ornaments

function TemplateLetterpress() {
  const t = TEMPLATES.find((x) => x.slug === 'letterpress');
  const cd = useCountdown('2026-06-14T13:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{
      background: '#ebe1cc', color: '#3a2a1a', fontFamily: "'EB Garamond', Georgia, serif", minHeight: '100vh',
      backgroundImage: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(201,168,120,0.08) 100%), url(assets/images/letterpress-paper-texture.png)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
    }}>
      <DemoBar t={t} />

      <section style={{ padding: '100px 40px', maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
        <FleurOrnament style={{ width: 80, opacity: 0.5, margin: '0 auto 40px' }} />

        <div style={{ fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.65 }}>— We kindly request the honour of your presence —</div>

        <div style={{ fontSize: 'clamp(40px, 5.5vw, 72px)', margin: '60px 0 14px', fontStyle: 'italic', fontWeight: 400, lineHeight: 1.1 }}>
          at the marriage of
        </div>

        <div style={{ fontSize: 'clamp(60px, 9vw, 124px)', margin: 0, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1 }}>
          Eleanor
        </div>
        <div style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontStyle: 'italic', margin: '10px 0' }}>&amp;</div>
        <div style={{ fontSize: 'clamp(60px, 9vw, 124px)', margin: 0, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1 }}>
          Theodore
        </div>

        <FleurOrnament style={{ width: 80, opacity: 0.5, margin: '48px auto', transform: 'rotate(180deg)' }} />

        <div style={{ fontSize: 20, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
          on the <span style={{ fontStyle: 'italic' }}>fourteenth day of June</span><br/>
          in the year of our Lord<br/>
          <span style={{ fontSize: 28, fontStyle: 'italic' }}>two thousand twenty-six</span><br/>
          at one o'clock in the afternoon
        </div>

        <div style={{ margin: '48px auto 0', display: 'flex', alignItems: 'center', gap: 14, maxWidth: 240 }}>
          <div style={{ flex: 1, height: 0.5, background: '#3a2a1a', opacity: 0.4 }} />
          <div style={{ fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.6 }}>et</div>
          <div style={{ flex: 1, height: 0.5, background: '#3a2a1a', opacity: 0.4 }} />
        </div>

        <div style={{ marginTop: 36, fontSize: 22, fontStyle: 'italic', letterSpacing: '0.05em' }}>
          Église Saint-Aignan<br/>Orléans, France
        </div>
      </section>

      {/* Program card */}
      <section style={{ padding: '80px 40px', maxWidth: 820, margin: '0 auto' }}>
        <div style={{ border: '1.5px double #3a2a1a', padding: 40, textAlign: 'center' }}>
          <FleurOrnament style={{ width: 40, opacity: 0.6, margin: '0 auto 16px' }} />
          <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.65 }}>Ordre du Jour</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 36 }}>
            {[
              ['I', 'Thirteen o\'clock', 'Cérémonie'],
              ['II', 'Fourteen o\'clock', 'Vin d\'honneur sous les tilleuls'],
              ['III', 'Sixteen o\'clock', 'Déjeuner au château'],
              ['IV', 'Twenty-one o\'clock', 'Bal champêtre'],
            ].map(([num, time, title]) => (
              <div key={num} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 20, alignItems: 'baseline', paddingBottom: 14, borderBottom: '1px dotted rgba(58,42,26,0.3)' }}>
                <div style={{ fontStyle: 'italic', fontSize: 22 }}>{num}.</div>
                <div style={{ fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7 }}>{time}</div>
                <div style={{ fontSize: 22, fontStyle: 'italic', textAlign: 'right' }}>{title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', opacity: 0.6 }}>— and the time till then —</div>
        <div style={{ marginTop: 32, fontSize: 'clamp(32px, 4.5vw, 56px)', fontStyle: 'italic' }}>
          <span style={{ fontSize: 'clamp(72px, 10vw, 120px)', fontStyle: 'normal' }}>{cd.days}</span> days, {cd.hours} hours &amp; {cd.minutes} minutes
        </div>
      </section>

      {/* RSVP card */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: 40, border: '1.5px double #3a2a1a', textAlign: 'center', background: 'rgba(255,255,255,0.25)' }}>
          <FleurOrnament style={{ width: 40, opacity: 0.6, margin: '0 auto 16px' }} />
          <div style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', opacity: 0.65 }}>The Favour of a Reply</div>
          <h2 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontStyle: 'italic', fontWeight: 400, margin: '24px 0 0', lineHeight: 1 }}>
            is requested before<br/>the First of May
          </h2>
          <LetterpressRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.6 }}>
        · Printed · Orléans · MMXXVI ·
      </footer>
    </div>
  );
}

function FleurOrnament({ style }) {
  return (
    <svg viewBox="0 0 100 40" style={style}>
      <g stroke="#3a2a1a" fill="none" strokeWidth="0.7">
        <path d="M50 20 Q30 5, 10 20 Q30 35, 50 20 Q70 5, 90 20 Q70 35, 50 20" />
        <circle cx="50" cy="20" r="2" fill="#3a2a1a" />
        <line x1="50" y1="4" x2="50" y2="10" />
        <line x1="50" y1="30" x2="50" y2="36" />
      </g>
    </svg>
  );
}

function LetterpressRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 32, fontStyle: 'italic', fontSize: 22 }}>Gratitude, {rsvp.state.name}.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input required placeholder="Your name" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid #3a2a1a', color: '#3a2a1a', fontSize: 22, fontStyle: 'italic', padding: '8px 0', outline: 'none', textAlign: 'center', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {[['yes', 'With pleasure'], ['no', 'Regrets only']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 14, background: rsvp.state.attending === v ? '#3a2a1a' : 'transparent', color: rsvp.state.attending === v ? '#ebe1cc' : '#3a2a1a', border: '1px solid #3a2a1a', cursor: 'pointer', fontFamily: 'inherit', fontStyle: 'italic', fontSize: 18 }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ padding: 14, background: '#3a2a1a', color: '#ebe1cc', border: 0, fontFamily: 'inherit', fontSize: 14, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', marginTop: 8 }}>Post Reply</button>
    </form>
  );
}

Object.assign(window, { TemplateLetterpress });
