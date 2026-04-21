// 09 · Art Deco — Cinzel, geometric frames, gold on dark, symmetrical

function TemplateArtDeco() {
  const t = TEMPLATES.find((x) => x.slug === 'artdeco');
  const cd = useCountdown('2026-12-12T19:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#0f0f18', color: '#b8975a', fontFamily: "'Cinzel', serif", minHeight: '100vh' }}>
      <DemoBar t={t} theme="dark" />

      {/* Hero with deco frame */}
      <section style={{ padding: '60px 40px', position: 'relative' }}>
        <DecoFrame>
          <div style={{ padding: '80px 40px', textAlign: 'center' }}>
            <DecoDivider />
            <div style={{ fontSize: 13, letterSpacing: '0.5em', marginTop: 36, opacity: 0.8 }}>
              THE CELEBRATION OF THE MARRIAGE
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.5em', marginTop: 10, opacity: 0.6 }}>— OF —</div>

            <div style={{ fontSize: 'clamp(56px, 9vw, 128px)', marginTop: 40, letterSpacing: '0.15em', fontWeight: 400, lineHeight: 1.1 }}>
              VERA
            </div>
            <div style={{ fontSize: 'clamp(24px, 3vw, 40px)', margin: '20px 0', fontWeight: 400, letterSpacing: '0.4em', opacity: 0.7 }}>&amp;</div>
            <div style={{ fontSize: 'clamp(56px, 9vw, 128px)', letterSpacing: '0.15em', fontWeight: 400, lineHeight: 1.1 }}>
              NIKOLAI
            </div>

            <DecoDivider style={{ marginTop: 48 }} />

            <div style={{ fontSize: 14, letterSpacing: '0.4em', marginTop: 36 }}>
              XII · DECEMBER · MMXXVI
            </div>
            <div style={{ fontSize: 12, letterSpacing: '0.4em', marginTop: 12, opacity: 0.7 }}>
              PRINCIPALITY OF MONACO
            </div>
          </div>
        </DecoFrame>
      </section>

      {/* Countdown */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#15151f' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.5em', opacity: 0.6 }}>— UNTIL THE EVENING —</div>
        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 5vw, 80px)', flexWrap: 'wrap' }}>
          {[['DAYS', cd.days], ['HOURS', cd.hours], ['MIN', cd.minutes], ['SEC', cd.seconds]].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 'clamp(56px, 8vw, 120px)', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.4em', marginTop: 14, opacity: 0.6 }}>{k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programme */}
      <section style={{ padding: '100px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <DecoDivider />
          <div style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '0.25em', marginTop: 32 }}>PROGRAMME</div>
        </div>
        <div>
          {[
            ['XVI', '16:00', 'RECEPTION', 'Hôtel de Paris · Grand Foyer'],
            ['XVII', '17:30', 'CEREMONY', 'Salle Empire'],
            ['XIX', '19:00', 'DINNER', 'Le Louis XV · Chef Ducasse'],
            ['XXII', '22:00', 'ORCHESTRA', 'Chamber Jazz Ensemble'],
            ['XXIV', '00:00', 'MIDNIGHT', 'Champagne &amp; pyrotechnics'],
          ].map(([rn, time, title, place], i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '60px 80px 1fr 1fr', gap: 20,
              padding: '28px 0', borderTop: '1px solid rgba(184,151,90,0.3)',
              alignItems: 'baseline',
            }}>
              <div style={{ fontSize: 20, letterSpacing: '0.1em', opacity: 0.7 }}>{rn}</div>
              <div style={{ fontSize: 13, letterSpacing: '0.2em' }}>{time}</div>
              <div style={{ fontSize: 22, letterSpacing: '0.15em' }}>{title}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 16, textAlign: 'right', opacity: 0.75 }} dangerouslySetInnerHTML={{ __html: place }} />
            </div>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#15151f' }}>
        <DecoDivider />
        <div style={{ fontSize: 11, letterSpacing: '0.5em', marginTop: 36, opacity: 0.7 }}>— ATTIRE —</div>
        <div style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '0.2em', marginTop: 24 }}>BLACK TIE</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 20, marginTop: 20, opacity: 0.75 }}>
          Long gowns · dinner jackets · Art Deco welcome
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <DecoFrame padding="40px 32px">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, letterSpacing: '0.5em', opacity: 0.7 }}>— R · S · V · P —</div>
              <div style={{ fontSize: 'clamp(36px, 5vw, 56px)', letterSpacing: '0.15em', marginTop: 24 }}>THE FAVOUR</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22, marginTop: 10, opacity: 0.8 }}>of your reply by 1 November 2026</div>
              <ArtDecoRSVP rsvp={rsvp} />
            </div>
          </DecoFrame>
        </div>
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontSize: 10, letterSpacing: '0.5em', opacity: 0.5 }}>
        V · N · MMXXVI · MONACO
      </footer>
    </div>
  );
}

function DecoFrame({ children, padding }) {
  return (
    <div style={{ position: 'relative', padding: 24 }}>
      <div style={{ position: 'absolute', inset: 24, border: '1px solid #b8975a', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 32, border: '0.5px solid rgba(184,151,90,0.5)', pointerEvents: 'none' }} />
      {/* corner diamonds */}
      {[[24, 24], [24, 'auto'], ['auto', 24], ['auto', 'auto']].map(([top, left], i) => {
        const pos = { top: 24, left: 24 };
        if (i === 1) { delete pos.left; pos.right = 24; }
        if (i === 2) { delete pos.top; pos.bottom = 24; }
        if (i === 3) { delete pos.top; delete pos.left; pos.right = 24; pos.bottom = 24; }
        return (
          <svg key={i} viewBox="0 0 20 20" style={{ position: 'absolute', ...pos, width: 20, height: 20, transform: 'translate(-50%, -50%)' }}>
            <path d="M10 0 L14 10 L10 20 L6 10 Z" fill="#b8975a" />
          </svg>
        );
      })}
      <div style={{ padding: padding || 0 }}>{children}</div>
    </div>
  );
}

function DecoDivider({ style }) {
  return (
    <svg viewBox="0 0 200 20" style={{ width: 240, display: 'block', margin: '0 auto', ...style }}>
      <line x1="10" y1="10" x2="80" y2="10" stroke="#b8975a" strokeWidth="0.5" />
      <line x1="120" y1="10" x2="190" y2="10" stroke="#b8975a" strokeWidth="0.5" />
      <path d="M100 2 L108 10 L100 18 L92 10 Z" fill="none" stroke="#b8975a" strokeWidth="0.8" />
      <circle cx="100" cy="10" r="1.5" fill="#b8975a" />
    </svg>
  );
}

function ArtDecoRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 22 }}>Thank you, {rsvp.state.name}. We await you.</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <input required placeholder="NAME" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid #b8975a', color: '#b8975a', fontSize: 18, padding: '10px 0', outline: 'none', textAlign: 'center', fontFamily: 'inherit', letterSpacing: '0.25em' }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['yes', 'ACCEPT'], ['no', 'DECLINE']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? '#b8975a' : 'transparent', color: rsvp.state.attending === v ? '#0f0f18' : '#b8975a', border: '1px solid #b8975a', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.3em' }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ marginTop: 12, padding: 14, background: 'transparent', color: '#b8975a', border: '1px solid #b8975a', fontFamily: 'inherit', fontSize: 12, letterSpacing: '0.35em', cursor: 'pointer' }}>CONFIRM ♦</button>
    </form>
  );
}

Object.assign(window, { TemplateArtDeco });
