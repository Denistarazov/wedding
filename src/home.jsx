// Home page

function Home() {
  return (
    <div>
      <TopNav />
      <Hero />
      <Value />
      <Portfolio />
      <Process />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section style={{ padding: '100px 40px 140px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', position: 'relative' }}>
        <Eyebrow number="(01)">Wedding website design · 2026</Eyebrow>

        <h1 className="serif" style={{
          fontSize: 'clamp(64px, 10vw, 164px)',
          lineHeight: 0.92, letterSpacing: '-0.035em',
          margin: '36px 0 0', fontWeight: 400,
          textWrap: 'balance',
        }}>
          Сайт-приглашение,<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>который гости</span><br/>
          дочитают до конца.
        </h1>

        <div style={{ marginTop: 60, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'end' }}>
          <p style={{ fontSize: 20, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 560, margin: 0, textWrap: 'pretty' }}>
            9 готовых дизайнов и кастомные проекты под ключ.
            RSVP, программа, карта, история пары — всё, что нужно,
            собрано в одном сайте. Типографика, отступы, темп —
            как у студии, а не как у конструктора.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button to="/templates" size="lg">Смотреть 9 дизайнов →</Button>
            <Button to="/contact" variant="secondary" size="lg">Связаться</Button>
          </div>
        </div>

        {/* marquee-ish meta row */}
        <div style={{
          marginTop: 100, paddingTop: 28, borderTop: '1px solid var(--line)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)',
        }}>
          <HeroMeta k="Срок" v="от 5 дней" />
          <HeroMeta k="От" v="€ 290" />
          <HeroMeta k="Домен" v="ваш .wedding / .love" />
          <HeroMeta k="Языки" v="RU · EN · +1" />
        </div>
      </div>

      {/* decorative label in corner */}
      <div style={{
        position: 'absolute', top: 80, right: 40, fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, letterSpacing: '0.25em', color: 'var(--muted)',
        writingMode: 'vertical-rl', textOrientation: 'mixed',
      }}>
        · Canvas Studio · Est. 2023 ·
      </div>
    </section>
  );
}

function HeroMeta({ k, v }) {
  return (
    <div>
      <div style={{ opacity: 0.55 }}>{k}</div>
      <div style={{ color: 'var(--ink)', marginTop: 6, fontSize: 13 }}>{v}</div>
    </div>
  );
}

function Value() {
  return (
    <section style={{ padding: '80px 40px', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, alignItems: 'start' }}>
          <div>
            <Eyebrow number="(02)">Что вы получаете</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em', margin: '24px 0 0', fontWeight: 400 }}>
              Два пути.<br/><span style={{ fontStyle: 'italic' }}>Один результат.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <ValueCard
              n="A"
              title="Готовый дизайн"
              price="€ 290 — 490"
              bullets={[
                '9 уникальных шаблонов',
                'Ваши фото, имена, даты',
                'RSVP + Google Sheets',
                'Свой домен',
                'Деплой за 5 дней',
              ]}
            />
            <ValueCard
              n="B"
              title="Кастомный проект"
              price="от € 1 200"
              bullets={[
                'Дизайн с нуля под пару',
                'Арт-директор + копирайтер',
                'Анимации, сценарий прокрутки',
                'Интеграции под запрос',
                'Срок 2–4 недели',
              ]}
              highlight
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueCard({ n, title, price, bullets, highlight }) {
  return (
    <div style={{
      background: highlight ? 'var(--ink)' : 'var(--bg)',
      color: highlight ? 'var(--bg)' : 'var(--ink)',
      padding: 36, borderRadius: 4,
      border: '1px solid ' + (highlight ? 'var(--ink)' : 'var(--line)'),
      display: 'flex', flexDirection: 'column', gap: 24, minHeight: 340,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="serif" style={{ fontSize: 48, fontStyle: 'italic', fontWeight: 300, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>{price}</div>
      </div>
      <h3 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {bullets.map((b) => (
          <li key={b} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.5 }}>
            <span style={{ opacity: 0.5, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, marginTop: 4 }}>◦</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Button
        to={highlight ? '/contact' : '/templates'}
        variant={highlight ? 'secondary' : 'primary'}
        tone={highlight ? 'light' : 'default'}
      >
        {highlight ? 'Запросить кастом' : 'Посмотреть дизайны'} →
      </Button>
    </div>
  );
}

function Portfolio() {
  return (
    <section style={{ padding: '140px 40px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 60, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <Eyebrow number="(03)">Портфолио · 9 дизайнов</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 0', fontWeight: 400 }}>
              Девять разных<br/><span style={{ fontStyle: 'italic' }}>миров</span>.
            </h2>
          </div>
          <NavLink to="/templates">Все с фильтрами →</NavLink>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {TEMPLATES.map((t, i) => (
            <TemplateCard key={t.slug} t={t} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Mini preview card — each template gets a distinctive hand-drawn thumb.
function TemplatePreview({ template: t }) {
  const dark = t.slug === 'dark' || t.slug === 'artdeco';
  const fg = dark ? '#ffffff' : t.ink;

  const previews = {
    editorial: (
      <div style={{ padding: '18% 14%', color: fg, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1, letterSpacing: '-0.03em' }}>Алиса<br/>& Григорий</div>
        <div style={{ width: 24, height: 1, background: fg, opacity: 0.5, margin: '18px 0' }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em' }}>14 · IX · MMXXVI</div>
      </div>
    ),
    swiss: (
      <div style={{ padding: 20, height: '100%', color: fg, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', gap: 6, fontFamily: 'Inter, sans-serif', fontSize: 9 }}>
        <div style={{ gridColumn: '1 / 6', gridRow: '1 / 2', fontWeight: 500, fontSize: 10 }}>MIRA · LEO</div>
        <div style={{ gridColumn: '8 / 13', gridRow: '1 / 2', textAlign: 'right', opacity: 0.6 }}>07.06.26</div>
        <div style={{ gridColumn: '1 / 13', gridRow: '3 / 7', border: '1px solid ' + fg, opacity: 0.3 }} />
        <div style={{ gridColumn: '1 / 7', gridRow: '4 / 6', fontFamily: 'Inter', fontWeight: 300, fontSize: 22, letterSpacing: '-0.02em', alignSelf: 'center' }}>mira<br/>leo</div>
        <div style={{ gridColumn: '1 / 4', gridRow: '8 / 9', opacity: 0.7, fontSize: 8 }}>ZÜRICH / CH</div>
      </div>
    ),
    garden: (
      <div style={{ padding: '14% 10%', color: fg, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 10, left: 10, width: 50, opacity: 0.5 }}>
          <path d="M20 80 Q30 40, 50 30 Q70 40, 80 80" stroke={fg} fill="none" strokeWidth="0.6" />
          <circle cx="50" cy="30" r="5" fill="none" stroke={fg} strokeWidth="0.5" />
          <circle cx="35" cy="55" r="3.5" fill="none" stroke={fg} strokeWidth="0.5" />
          <circle cx="65" cy="55" r="3.5" fill="none" stroke={fg} strokeWidth="0.5" />
        </svg>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', bottom: 10, right: 10, width: 50, opacity: 0.5, transform: 'rotate(160deg)' }}>
          <path d="M20 80 Q30 40, 50 30 Q70 40, 80 80" stroke={fg} fill="none" strokeWidth="0.6" />
          <circle cx="50" cy="30" r="5" fill="none" stroke={fg} strokeWidth="0.5" />
        </svg>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4.5vw, 48px)', fontStyle: 'italic', fontWeight: 300, textAlign: 'center', lineHeight: 1 }}>Ella<br/>&<br/>Matteo</div>
      </div>
    ),
    dark: (
      <div style={{ padding: '14% 10%', color: '#d4b87a', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.35em', opacity: 0.7 }}>— 30.XI.26 —</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(28px, 5vw, 52px)', margin: '14px 0', letterSpacing: '0.02em', lineHeight: 1 }}>Sofia<br/>&<br/>Max</div>
        <div style={{ width: 30, height: 0.5, background: '#d4b87a', opacity: 0.5 }} />
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.3em', marginTop: 14, opacity: 0.6 }}>PARIS · NOCTURNE</div>
      </div>
    ),
    brutalist: (
      <div style={{ padding: 16, color: '#000', background: '#eae4d8', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 0.85, letterSpacing: '-0.05em' }}>IRA<br/>×<br/>JAN</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
          <span>03/08/26</span>
          <span style={{ background: '#ff3b1f', color: '#fff', padding: '2px 6px' }}>BER</span>
        </div>
      </div>
    ),
    letterpress: (
      <div style={{ padding: '18% 14%', color: '#3a2a1a', height: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(0deg, rgba(201,168,120,0.15), transparent), #ebe1cc' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.3em', opacity: 0.7 }}>AT HOME</div>
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 400, margin: '14px 0 6px', lineHeight: 1.1 }}>
          Mr. Theodore<br/>&<br/>Ms. Eleanor
        </div>
        <div style={{ width: 40, height: 0.5, background: '#3a2a1a', opacity: 0.4, margin: '6px 0' }} />
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11 }}>June the Fourteenth</div>
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 11 }}>MMXXVI</div>
      </div>
    ),
    wabisabi: (
      <div style={{ padding: 20, color: '#1a1814', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15%', left: '15%', fontFamily: "'Noto Serif JP', serif", fontSize: 28, fontWeight: 300 }}>結</div>
        <div style={{ position: 'absolute', top: '44%', left: '32%', fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 300, letterSpacing: '0.1em' }}>Yuki — Ren</div>
        <div style={{ position: 'absolute', bottom: '18%', right: '16%', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.2em', textAlign: 'right' }}>2026.04.11<br/>京都</div>
        <div style={{ position: 'absolute', bottom: '30%', left: '18%', width: 40, height: 0.5, background: '#d85a3b' }} />
      </div>
    ),
    polaroid: (
      <div style={{ padding: 18, color: '#2a2418', height: '100%', background: '#f0ebe0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '14%', left: '10%', width: '44%', aspectRatio: '1', background: '#fff', padding: 6, paddingBottom: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)', transform: 'rotate(-6deg)' }}>
          <Placeholder ratio="1/1" variant="stripes" fg="#8a7a5a" bg="#e5dcc8" style={{ height: '100%' }} />
        </div>
        <div style={{ position: 'absolute', top: '34%', right: '8%', width: '40%', aspectRatio: '1', background: '#fff', padding: 6, paddingBottom: 18, boxShadow: '0 6px 18px rgba(0,0,0,0.12)', transform: 'rotate(8deg)' }}>
          <Placeholder ratio="1/1" variant="dots" fg="#8a7a5a" bg="#e5dcc8" style={{ height: '100%' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '10%', left: 0, right: 0, textAlign: 'center', fontFamily: "'Caveat', cursive", fontSize: 'clamp(28px, 4.5vw, 40px)' }}>Dasha & Kirill</div>
      </div>
    ),
    artdeco: (
      <div style={{ padding: 20, color: '#b8975a', background: '#0f0f18', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 14, width: 'calc(100% - 28px)', height: 'calc(100% - 28px)' }}>
          <rect x="4" y="4" width="92" height="92" fill="none" stroke="#b8975a" strokeWidth="0.4" />
          <path d="M50 6 L58 12 L50 18 L42 12 Z" fill="#b8975a" opacity="0.6" />
          <path d="M50 94 L58 88 L50 82 L42 88 Z" fill="#b8975a" opacity="0.6" />
        </svg>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(18px, 3.2vw, 28px)', letterSpacing: '0.2em', textAlign: 'center', lineHeight: 1.3 }}>VERA<br/><span style={{ fontSize: '0.7em', opacity: 0.7 }}>&</span><br/>NIKOLAI</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: '0.4em', marginTop: 18 }}>XII · XII · MMXXVI</div>
      </div>
    ),
  };

  return previews[t.slug] || null;
}

function Process() {
  const steps = [
    { n: '01', title: 'Заявка', body: 'Отправляете форму или пишете в Telegram. Обычно отвечаем за 2–3 часа.' },
    { n: '02', title: 'Выбор дизайна', body: 'Вы выбираете готовый шаблон или мы обсуждаем кастомную концепцию.' },
    { n: '03', title: 'Контент', body: 'Присылаете фото, имена, даты, историю. Шаблон — Google-форма, кастом — Notion-бриф.' },
    { n: '04', title: 'Сборка', body: 'Вы получаете ссылку на preview. Правите текст и фото прямо в интерфейсе.' },
    { n: '05', title: 'Деплой', body: 'Публикуем на своём домене (.wedding, .love) или на вашем. RSVP начинают сыпаться.' },
  ];
  return (
    <section id="process" style={{ padding: '140px 40px', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <Eyebrow number="(04)">Процесс</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 80px', fontWeight: 400 }}>
          Пять шагов <span style={{ fontStyle: 'italic' }}>до рассылки</span>.
        </h2>
        <ol style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 28, listStyle: 'none', padding: 0, margin: 0 }}>
          {steps.map((s) => (
            <ProcessStep key={s.n} number={s.n} title={s.title} body={s.body} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: 'Essential', price: '€ 290', desc: 'Любой из 9 шаблонов', bullets: ['Ваши фото и тексты', 'RSVP-форма', 'Поддомен canvas.wedding', 'Один язык', 'Доставка 5 дней'] },
    { name: 'Studio', price: '€ 490', desc: 'Шаблон + кастомизация', bullets: ['Всё из Essential', 'Свой домен', '2 языка', 'Индивидуальные цвета и шрифты', 'Карта + программа', 'Google Sheets RSVP'], popular: true },
    { name: 'Bespoke', price: 'от € 1 200', desc: 'Дизайн с нуля', bullets: ['Арт-директор + копирайтер', 'Анимации и сценарий прокрутки', 'Интеграции (CRM, платежи)', '3+ языка', 'Брендинг сопут. материалов', 'Срок 2–4 недели'] },
  ];
  return (
    <section id="pricing" style={{ padding: '140px 40px' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 40, marginBottom: 60 }}>
          <div>
            <Eyebrow number="(05)">Цены</Eyebrow>
            <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 0', fontWeight: 400 }}>
              Прозрачно.<br/><span style={{ fontStyle: 'italic' }}>Без пакетов-сюрпризов</span>.
            </h2>
          </div>
          <p style={{ maxWidth: 380, color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            Цены указаны за сайт. Хостинг, SSL и домен первого уровня — включены в первый год.
            Правки после публикации — 20 € / правка или подписка 9 € / мес.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {tiers.map((t) => (
            <PriceCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PriceCard({ t }) {
  const pop = t.popular;
  return (
    <div style={{
      padding: 32, borderRadius: 4,
      background: pop ? 'var(--ink)' : 'transparent',
      color: pop ? 'var(--bg)' : 'var(--ink)',
      border: '1px solid ' + (pop ? 'var(--ink)' : 'var(--line)'),
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="serif" style={{ fontSize: 32, fontWeight: 400, margin: 0, letterSpacing: '-0.01em' }}>{t.name}</h3>
        {pop && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', background: 'var(--bg)', color: 'var(--ink)', padding: '4px 10px', borderRadius: 999 }}>Популярно</span>}
      </div>
      <div className="serif" style={{ fontSize: 48, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1 }}>{t.price}</div>
      <div style={{ fontSize: 14, opacity: 0.7 }}>{t.desc}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {t.bullets.map((b) => (
          <li key={b} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ opacity: 0.5, marginTop: 2 }}>—</span><span>{b}</span>
          </li>
        ))}
      </ul>
      <Button
        to={t.name === 'Bespoke' ? '/contact' : '/templates'}
        variant={pop ? 'secondary' : 'primary'}
        tone={pop ? 'light' : 'default'}
      >
        {t.name === 'Bespoke' ? 'Обсудить проект' : 'Выбрать шаблон'} →
      </Button>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    { q: 'Сколько времени занимает весь процесс?', a: 'Готовый шаблон — 5 рабочих дней от получения контента. Кастомный проект — от 2 до 4 недель в зависимости от объёма.' },
    { q: 'Можно ли поменять шрифты и цвета в шаблоне?', a: 'Да, в тарифе Studio. В Essential — только ваши контент-поля. В Bespoke правим всё вплоть до сетки.' },
    { q: 'Как работает RSVP и куда приходят ответы?', a: 'По умолчанию — в Google Sheets, куда у вас есть полный доступ. По запросу можем подключить Notion, Airtable или вебхук.' },
    { q: 'Нужен ли свой домен?', a: 'Нет. В Essential мы даём красивый поддомен canvas.wedding/yournames. Начиная со Studio — любой ваш домен (покупаем и настраиваем при необходимости).' },
    { q: 'Что с мультиязычностью?', a: 'RU, EN — включены в Studio. Третий язык — +50 €. Bespoke — без ограничений.' },
    { q: 'Фотосессия нужна?', a: 'Не обязательна. У нас есть шаблоны, которые красиво работают без фото — только типографика и иллюстрации. Мы также работаем с вашим фотографом до или после свадьбы.' },
  ];
  return (
    <section id="faq" style={{ padding: '140px 40px', background: 'var(--bg-2)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Eyebrow number="(06)">Вопросы</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.025em', margin: '20px 0 60px', fontWeight: 400 }}>
          Часто <span style={{ fontStyle: 'italic' }}>спрашивают</span>.
        </h2>
        <dl style={{ borderTop: '1px solid var(--ink)', margin: 0, padding: 0 }}>
          {items.map((it, i) => (
            <FaqItem
              key={i}
              index={i}
              question={it.q}
              answer={it.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{ padding: '140px 40px', background: 'var(--ink)', color: 'var(--bg)' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', textAlign: 'center' }}>
        <Eyebrow number="(07)" tone="light" align="center">Готовы?</Eyebrow>
        <h2 className="serif" style={{ fontSize: 'clamp(64px, 10vw, 180px)', lineHeight: 0.92, letterSpacing: '-0.04em', margin: '36px 0', fontWeight: 400, textWrap: 'balance' }}>
          Давайте соберём<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>ваш сайт.</span>
        </h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/templates" size="lg" variant="secondary" tone="light">Выбрать дизайн</Button>
          <Button to="/contact" size="lg" tone="light">Оставить заявку →</Button>
        </div>
        <p style={{ marginTop: 40, color: 'rgba(245,241,234,0.55)', fontSize: 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          · Ответим за 2–3 часа в рабочее время ·
        </p>
      </div>
    </section>
  );
}

Object.assign(window, { Home, TemplatePreview, TemplateCard });
