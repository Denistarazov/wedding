// Root app — routes

function App() {
  const route = useRoute();

  // /templates/[slug]
  if (route.startsWith('/templates/')) {
    const slug = route.slice('/templates/'.length);
    const map = {
      editorial: TemplateEditorial, swiss: TemplateSwiss, garden: TemplateGarden,
      dark: TemplateDark, brutalist: TemplateBrutalist, letterpress: TemplateLetterpress,
      wabisabi: TemplateWabiSabi, polaroid: TemplatePolaroid, artdeco: TemplateArtDeco,
    };
    const Tmpl = map[slug];
    if (Tmpl) return <Tmpl />;
    return <NotFound />;
  }

  if (route === '/templates') return <TemplatesIndex />;
  if (route === '/contact') return <Contact />;
  if (route === '/' || route === '' || route.startsWith('/#')) return <Home />;
  return <NotFound />;
}

function NotFound() {
  return (
    <div>
      <TopNav />
      <section style={{ padding: '160px 40px', textAlign: 'center', minHeight: '60vh' }}>
        <div className="serif" style={{ fontSize: 160, fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1 }}>404</div>
        <p style={{ marginTop: 20, fontSize: 18, color: 'var(--muted)' }}>Страница не найдена.</p>
        <div style={{ marginTop: 24 }}><Button to="/">← На главную</Button></div>
      </section>
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
