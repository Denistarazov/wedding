// /contact page

function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', type: 'Готовый', message: '' });
  const [sent, setSent] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div>
        <TopNav />
        <section style={{ padding: '160px 40px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <Eyebrow style={{ justifyContent: 'center' }}>Заявка принята</Eyebrow>
            <h1 className="serif" style={{ fontSize: 'clamp(56px, 9vw, 148px)', lineHeight: 0.92, letterSpacing: '-0.035em', margin: '24px 0 0', fontWeight: 400 }}>
              <span style={{ fontStyle: 'italic' }}>Спасибо</span>,<br/>{form.name || 'гость'}.
            </h1>
            <p style={{ marginTop: 32, maxWidth: 540, margin: '32px auto 0', color: 'var(--ink-2)', fontSize: 18, lineHeight: 1.55 }}>
              Мы получили заявку и напишем на {form.contact || 'указанный контакт'} в ближайшие 2–3 часа.
            </p>
            <div style={{ marginTop: 40 }}>
              <Button to="/templates">← Вернуться к дизайнам</Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <TopNav />
      <section style={{ padding: '80px 40px' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80 }}>
          <div>
            <Eyebrow>Связаться</Eyebrow>
            <h1 className="serif" style={{
              fontSize: 'clamp(56px, 8vw, 128px)', lineHeight: 0.92, letterSpacing: '-0.035em',
              margin: '24px 0 0', fontWeight: 400,
            }}>
              Напишите<br/><span style={{ fontStyle: 'italic' }}>нам</span>.
            </h1>
            <p style={{ marginTop: 32, color: 'var(--ink-2)', fontSize: 18, lineHeight: 1.55, maxWidth: 400 }}>
              Чем подробнее расскажете о свадьбе — тем лучше мы подберём формат. Или просто напишите «хочу сайт» — разберёмся вместе.
            </p>

            <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 28 }}>
              <ContactLine label="Email" v="hello@canvas.wedding" />
              <ContactLine label="Telegram" v="@canvas_wedding" />
              <ContactLine label="Часы" v="Пн–Сб · 10:00 — 20:00 GMT+4" />
              <ContactLine label="Ответ" v="В течение 2–3 часов" />
            </div>
          </div>

          <form onSubmit={submit} style={{
            background: 'var(--bg-2)', padding: 40, borderRadius: 4,
            display: 'flex', flexDirection: 'column', gap: 28, border: '1px solid var(--line)',
          }}>
            <Field label="Как вас зовут" value={form.name} onChange={(v) => update('name', v)} required />
            <Field label="Email или Telegram" value={form.contact} onChange={(v) => update('contact', v)} required placeholder="@you · you@mail.com" />

            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Тип проекта</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Готовый', 'Studio', 'Кастом', 'Не знаю'].map((t) => (
                  <button type="button" key={t} onClick={() => update('type', t)} style={{
                    background: form.type === t ? 'var(--ink)' : 'transparent',
                    color: form.type === t ? 'var(--bg)' : 'var(--ink)',
                    border: '1px solid ' + (form.type === t ? 'var(--ink)' : 'var(--line)'),
                    borderRadius: 999, padding: '8px 16px',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            <Field label="О свадьбе" multiline value={form.message} onChange={(v) => update('message', v)} placeholder="Даты, стиль, примерное кол-во гостей, язык…" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--line)' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}>
                Отправляя, вы принимаете оферту.
              </div>
              <Button onClick={() => {}} size="lg">Отправить заявку →</Button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, multiline, required, placeholder }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        {required && <span style={{ opacity: 0.5 }}>требуется</span>}
      </div>
      {multiline ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
          rows={5}
          style={{
            width: '100%', background: 'transparent', border: 0, borderBottom: '1px solid var(--line)',
            padding: '10px 0', fontFamily: 'inherit', fontSize: 18, color: 'var(--ink)', outline: 'none',
            resize: 'vertical',
          }}
        />
      ) : (
        <input
          value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
          style={{
            width: '100%', background: 'transparent', border: 0, borderBottom: '1px solid var(--line)',
            padding: '10px 0', fontFamily: 'inherit', fontSize: 18, color: 'var(--ink)', outline: 'none',
          }}
        />
      )}
    </label>
  );
}

function ContactLine({ label, v }) {
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</div>
      <div className="serif" style={{ fontSize: 26, marginTop: 8, letterSpacing: '-0.01em' }}>{v}</div>
    </div>
  );
}

Object.assign(window, { Contact });
