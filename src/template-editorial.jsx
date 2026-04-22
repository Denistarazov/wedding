// 01 · Editorial — Vogue magazine feel: giant serif wordmark, full-bleed portrait, drop caps, pull quotes

function TemplateEditorial() {
  const t = TEMPLATES.find((x) => x.slug === 'editorial');
  const cd = useCountdown('2026-09-14T16:00:00');
  const rsvp = useRsvp();
  return (
    <div style={{
      background: '#f5f1ea', color: '#2a2418', fontFamily: "'Fraunces', Georgia, serif",
      minHeight: '100vh',
    }}>
      <DemoBar t={t} />

      {/* Masthead */}
      <header style={{
        padding: '28px 40px', borderBottom: '1px solid #2a2418',
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
      }}>
        <span>Vol. I · № 14</span>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 14, fontStyle: 'italic', letterSpacing: '-0.02em', textTransform: 'none' }}>A · &amp; · G</span>
        <span>Como, Italy — Autumn MMXXVI</span>
      </header>

      {/* Hero */}
      <section style={{ padding: '100px 40px 40px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.3em', opacity: 0.7 }}>— SAVE THE DATE —</div>
        <h1 style={{
          fontSize: 'clamp(96px, 18vw, 280px)', lineHeight: 0.88,
          fontWeight: 300, margin: '36px 0 0', letterSpacing: '-0.045em',
        }}>
          <span style={{ fontStyle: 'italic' }}>Алиса</span>
        </h1>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(18px, 2.5vw, 32px)', fontStyle: 'italic', opacity: 0.8, margin: '-0.3em 0 0' }}>&amp;</div>
        <h1 style={{
          fontSize: 'clamp(96px, 18vw, 280px)', lineHeight: 0.88,
          fontWeight: 400, margin: 0, letterSpacing: '-0.045em',
        }}>Григорий</h1>
        <div style={{ marginTop: 40, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.3em' }}>
          14 · IX · MMXXVI  ·  VILLA ERBA  ·  LAGO DI COMO
        </div>
      </section>

      {/* Full-bleed photo */}
      <section style={{ padding: '40px 40px' }}>
        <AssetImage src="assets/images/editorial-hero-lake-como.png" alt="Алиса и Григорий у озера Комо" ratio="16/9" />
      </section>

      {/* Countdown */}
      <section style={{ padding: '60px 40px', textAlign: 'center', borderTop: '1px solid #2a2418', borderBottom: '1px solid #2a2418' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.6, marginBottom: 24 }}>DAYS UNTIL</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[['days', 'дней', cd.days], ['hours', 'часов', cd.hours], ['minutes', 'минут', cd.minutes], ['seconds', 'секунд', cd.seconds]].map(([k, ru, v]) => (
            <div key={k}>
              <div style={{ fontSize: 'clamp(56px, 8vw, 112px)', fontWeight: 300, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', opacity: 0.6, marginTop: 6 }}>{ru}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story with drop cap */}
      <section style={{ padding: '120px 40px', maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60 }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 }}>ONE · THE STORY</div>
            <h2 style={{ fontSize: 56, fontWeight: 400, margin: '20px 0 0', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
              Как <span style={{ fontStyle: 'italic' }}>это</span><br/>случилось
            </h2>
          </div>
          <div style={{ columnCount: 2, columnGap: 40, fontSize: 17, lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <span style={{ float: 'left', fontSize: 84, lineHeight: 0.85, paddingRight: 12, paddingTop: 6, fontStyle: 'italic', fontWeight: 400 }}>А</span>
              лиса и Григорий познакомились на выставке в Венеции в октябре две тысячи двадцать третьего года.
              Он стоял у работы Агнес Мартин и делал вид, что понимает, зачем художнице минимум сорок восемь одинаковых линий.
              Она подошла и сказала: «Это не сорок восемь, а сорок девять.»
            </p>
            <p>
              С тех пор — три года, две страны, один переезд и бесконечные разговоры о том, какой должна быть свадьба.
              В итоге — вилла на озере, ужин на террасе, сто двадцать гостей и никаких шатров. Мы счастливы, что вы будете там.
            </p>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: '#ede7dc' }}>
        <p style={{ fontSize: 'clamp(28px, 4vw, 56px)', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.2, letterSpacing: '-0.01em', maxWidth: 1000, margin: '0 auto', textWrap: 'balance' }}>
          «Мы не хотели ни шатров, ни сюрпризов, ни тамады. Только семью, озеро и длинный стол с белым льном.»
        </p>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', marginTop: 24, opacity: 0.6 }}>— А. &amp; Г.</div>
      </section>

      {/* Details — three-column editorial block */}
      <section style={{ padding: '120px 40px', maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 }}>TWO · THE DAY</div>
        <h2 style={{ fontSize: 72, fontWeight: 400, margin: '20px 0 60px', letterSpacing: '-0.025em' }}>Программа <span style={{ fontStyle: 'italic' }}>дня</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {[
            ['16:00', 'Церемония', 'Terrazza del Lago — welcome aperitivo уже с 15:30'],
            ['18:30', 'Ужин', 'Длинный стол под оливами · шеф Лука Марчелли'],
            ['21:00', 'Танцы', 'DJ Винцент до двух ночи · трансфер до отеля'],
          ].map(([time, title, body]) => (
            <div key={title} style={{ borderTop: '1px solid #2a2418', paddingTop: 24 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.14em', opacity: 0.6 }}>{time}</div>
              <div style={{ fontSize: 32, fontWeight: 400, margin: '16px 0 12px', letterSpacing: '-0.01em' }}>{title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.55, opacity: 0.75, fontFamily: 'Inter, sans-serif' }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section style={{ padding: '120px 40px', background: '#2a2418', color: '#f5f1ea' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.3em', opacity: 0.6 }}>THREE · R.S.V.P.</div>
          <h2 style={{ fontSize: 'clamp(56px, 8vw, 112px)', fontWeight: 400, margin: '24px 0 0', letterSpacing: '-0.035em', lineHeight: 0.95 }}>
            Дайте <span style={{ fontStyle: 'italic' }}>знать</span>.
          </h2>
          <p style={{ marginTop: 24, fontSize: 17, opacity: 0.75, lineHeight: 1.55, fontFamily: 'Inter, sans-serif' }}>
            Ответьте, пожалуйста, до 14 августа 2026 года.
          </p>
          <EditorialRSVP rsvp={rsvp} />
        </div>
      </section>

      <footer style={{ padding: '40px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.2em', opacity: 0.6, textTransform: 'uppercase', background: '#2a2418', color: '#f5f1ea' }}>
        · Made with Canvas · hello@canvas.wedding ·
      </footer>
    </div>
  );
}

function EditorialRSVP({ rsvp }) {
  if (rsvp.sent) {
    return <div style={{ marginTop: 40, padding: 32, border: '1px solid rgba(245,241,234,0.3)', fontStyle: 'italic', fontSize: 22 }}>Благодарим, {rsvp.state.name}. Мы ждём вас 14 сентября.</div>;
  }
  return (
    <form onSubmit={rsvp.submit} style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left', fontFamily: 'Inter, sans-serif' }}>
      <input required placeholder="Ваше имя" value={rsvp.state.name} onChange={(e) => rsvp.update('name', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(245,241,234,0.3)', color: '#f5f1ea', fontSize: 24, fontFamily: "'Fraunces', serif", padding: '8px 0', outline: 'none' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {[['yes', 'Буду'], ['no', 'Не смогу']].map(([v, l]) => (
          <button type="button" key={v} onClick={() => rsvp.update('attending', v)}
            style={{ flex: 1, padding: 16, background: rsvp.state.attending === v ? '#f5f1ea' : 'transparent', color: rsvp.state.attending === v ? '#2a2418' : '#f5f1ea', border: '1px solid rgba(245,241,234,0.3)', cursor: 'pointer', fontFamily: "'Fraunces', serif", fontSize: 18, fontStyle: v === 'yes' ? 'italic' : 'normal' }}>{l}</button>
        ))}
      </div>
      <input placeholder="Диетарные пожелания (необязательно)" value={rsvp.state.dietary} onChange={(e) => rsvp.update('dietary', e.target.value)}
        style={{ background: 'transparent', border: 0, borderBottom: '1px solid rgba(245,241,234,0.3)', color: '#f5f1ea', fontSize: 16, padding: '8px 0', outline: 'none' }} />
      <button type="submit" style={{ marginTop: 12, padding: 20, background: '#f5f1ea', color: '#2a2418', border: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer' }}>Отправить ответ →</button>
    </form>
  );
}

Object.assign(window, { TemplateEditorial });
