// 08 · Polaroid — rotated photo cards, tape, handwritten Caveat, scrapbook

function TemplatePolaroid() {
  const t = TEMPLATES.find((x) => x.slug === 'polaroid');
  const cd = useCountdown('2026-07-18T17:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{ background: '#f0ebe0', color: '#2a2418', fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <DemoBar t={t} />

      {/* Hero — scattered polaroids */}
      <section style={{ padding: '80px 40px 120px', position: 'relative', minHeight: 800 }}>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(80px, 14vw, 200px)', lineHeight: 0.9, color: '#2a2418', fontWeight: 500 }}>
            Dasha &amp; Kirill
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.25em', opacity: 0.6, marginTop: 16 }}>
            MONTENEGRO · SUMMER · 2026
          </div>
        </div>

        {/* Scattered polaroids */}
        <PolaroidCard rotate={-8} top="8%" left="4%" size={180} label="montenegro, 2024" src="assets/images/polaroid-montenegro-coast.png" />
        <PolaroidCard rotate={6} top="12%" right="6%" size={200} label="our first dive" src="assets/images/polaroid-dive.png" />
        <PolaroidCard rotate={-4} bottom="10%" left="10%" size={170} label="proposal night" src="assets/images/polaroid-proposal-night.png" />
        <PolaroidCard rotate={10} bottom="6%" right="12%" size={190} label="engagement party" src="assets/images/polaroid-engagement-party.png" />
        <PolaroidCard rotate={-12} bottom="30%" left="42%" size={160} label="sveti stefan" src="assets/images/polaroid-sveti-stefan-sunset.png" tape />
      </section>

      {/* Date card */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block', background: '#fff', padding: '28px 44px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          transform: 'rotate(-2deg)', border: '1px solid rgba(42,36,24,0.1)',
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.6 }}>SAVE THE DATE</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 72, lineHeight: 1, margin: '12px 0 4px', fontWeight: 500 }}>18 July</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, letterSpacing: '0.3em' }}>2026</div>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 24, marginTop: 10, opacity: 0.7 }}>Sveti Stefan, beach</div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '80px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <PolaroidCard rotate={-5} top="0" left="0" size={280} label="how it started · 2021" src="assets/images/polaroid-beach-dinner.png" tape relative />
          </div>
          <div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 56, lineHeight: 1 }}>Как всё началось</div>
            <p style={{ fontSize: 17, lineHeight: 1.7, marginTop: 20 }}>
              Мы встретились на каяке где-то между двумя островами в Адриатике. У Даши сломалось весло, у Кирилла было запасное.
              С тех пор мы путешествуем, ныряем, спорим про лучший греческий йогурт, и вот — решили, что хотим этого ещё надолго.
            </p>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 28, marginTop: 16, color: '#8a6a4a' }}>— приходите к нам на пляж, будет хорошо! —</p>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 48, color: '#8a6a4a' }}>осталось</div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
          {[['дней', cd.days], ['часов', cd.hours], ['минут', cd.minutes]].map(([l, v]) => (
            <div key={l} style={{ background: '#fff', padding: '20px 28px', boxShadow: '0 6px 18px rgba(0,0,0,0.08)', transform: `rotate(${Math.random() * 6 - 3}deg)`, minWidth: 120 }}>
              <div style={{ fontSize: 72, fontFamily: "'Caveat', cursive", lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', opacity: 0.6, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Programme — handwritten list on notebook paper */}
      <section style={{ padding: '80px 40px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{
          background: '#fefcf5', padding: 48, transform: 'rotate(-0.5deg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.08)', border: '1px solid rgba(42,36,24,0.1)',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0, transparent 34px, rgba(42,36,24,0.06) 34px, rgba(42,36,24,0.06) 35px)',
        }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 56, color: '#2a2418', lineHeight: 1.1 }}>план дня ↓</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', fontFamily: "'Caveat', cursive", fontSize: 28, lineHeight: 34 + 'px' }}>
            {[
              '17:00 — встреча на пляже',
              '17:30 — церемония (босиком!)',
              '18:30 — просекко + закат',
              '20:00 — ужин, длинный стол',
              '22:00 — музыка до утра',
              '05:00 — плавание тем, кто дожил',
            ].map((l) => (<li key={l} style={{ height: 35 }}>{l}</li>))}
          </ul>
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '120px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(72px, 10vw, 140px)', lineHeight: 1 }}>скажи да :)</div>
        <p style={{ fontSize: 16, opacity: 0.7, marginTop: 12 }}>до 1 июня 2026 · потом будет поздно ловить трансфер</p>
        <PolaroidRSVP rsvp={rsvp} />
      </section>

      <footer style={{ padding: 40, textAlign: 'center', fontFamily: "'Caveat', cursive", fontSize: 28, opacity: 0.6 }}>
        с любовью, Даша + Кирилл
      </footer>
    </div>
  );
}

function PolaroidCard({ rotate = 0, top, left, right, bottom, size = 180, label, variant = 'stripes', src, tape = false, relative = false }) {
  return (
    <div style={{
      position: relative ? 'relative' : 'absolute', top, left, right, bottom,
      width: size, background: '#fff', padding: 10, paddingBottom: 32,
      boxShadow: '0 10px 28px rgba(0,0,0,0.15)', transform: `rotate(${rotate}deg)`,
      border: '1px solid rgba(42,36,24,0.08)',
    }}>
      {tape && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(-4deg)', width: 60, height: 18, background: 'rgba(200,180,140,0.55)', border: '1px solid rgba(160,140,100,0.3)' }} />}
      {src ? <AssetImage src={src} alt={label} ratio="1/1" /> : <Placeholder ratio="1/1" variant={variant} fg="#8a6a4a" bg="#e5dcc8" />}
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, textAlign: 'center', marginTop: 6, color: '#2a2418' }}>{label}</div>
    </div>
  );
}

function PolaroidRSVP({ rsvp }) {
  if (rsvp.sent) return <div style={{ marginTop: 40, fontFamily: "'Caveat', cursive", fontSize: 48 }}>ура! увидимся, {rsvp.state.name} ☺</div>;
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 40, maxWidth: 500, margin: '40px auto 0', display: 'flex', flexDirection: 'column', gap: 20, background: '#fff', padding: 32, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transform: 'rotate(-1deg)' }}>
      <input required placeholder="твоё имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px dashed rgba(42,36,24,0.3)', padding: '8px 0', fontFamily: "'Caveat', cursive", fontSize: 28, outline: 'none' }} />
      <div style={{ display: 'flex', gap: 10 }}>
        {[['yes', 'приду!'], ['no', 'не смогу']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 14, background: rsvp.state.attending === v ? '#2a2418' : '#f0ebe0', color: rsvp.state.attending === v ? '#f0ebe0' : '#2a2418', border: '1px solid #2a2418', cursor: 'pointer', fontFamily: "'Caveat', cursive", fontSize: 24 }}>{l}</button>
        ))}
      </div>
      <button type="submit" style={{ padding: 14, background: '#e8d4a8', color: '#2a2418', border: '1px solid #2a2418', fontFamily: "'Caveat', cursive", fontSize: 28, cursor: 'pointer' }}>отправить →</button>
    </form>
  );
}

Object.assign(window, { TemplatePolaroid });
