'use client';

import { useRoute, TopNav, Footer, Button } from './shared';
import { Home } from './home';
import { Contact } from './contact';
import { TemplatesIndex } from './templates-index';
import {
  TemplateEditorial,
  TemplateSwiss,
  TemplateGarden,
  TemplateDark,
  TemplateBrutalist,
  TemplateLetterpress,
  TemplateWabisabi,
  TemplatePolaroid,
  TemplateArtDeco,
  TemplateNeon,
  TemplateCottage,
  TemplateMemphis,
} from './templates';

type TemplateSlug =
  | 'editorial' | 'swiss' | 'garden' | 'dark'
  | 'brutalist' | 'letterpress' | 'wabisabi' | 'polaroid' | 'artdeco'
  | 'neon' | 'cottage' | 'memphis';

const TEMPLATE_MAP: Record<TemplateSlug, React.ComponentType> = {
  editorial:   TemplateEditorial,
  swiss:       TemplateSwiss,
  garden:      TemplateGarden,
  dark:        TemplateDark,
  brutalist:   TemplateBrutalist,
  letterpress: TemplateLetterpress,
  wabisabi:    TemplateWabisabi,
  polaroid:    TemplatePolaroid,
  artdeco:     TemplateArtDeco,
  neon:        TemplateNeon,
  cottage:     TemplateCottage,
  memphis:     TemplateMemphis,
};

function isTemplateSlug(s: string): s is TemplateSlug {
  return s in TEMPLATE_MAP;
}

function Router() {
  const route = useRoute();

  if (route.startsWith('/templates/')) {
    const slug = route.slice('/templates/'.length);
    if (isTemplateSlug(slug)) {
      const Tmpl = TEMPLATE_MAP[slug];
      return <Tmpl />;
    }
    return <NotFound />;
  }

  if (route === '/templates') return <TemplatesIndex />;
  if (route === '/contact')   return <Contact />;
  if (route === '/' || route === '' || route.startsWith('/#')) return <Home />;
  return <NotFound />;
}

function NotFound() {
  return (
    <div>
      <TopNav />
      <section style={{ padding: '160px 40px', textAlign: 'center', minHeight: '60vh' }}>
        <div className="serif" style={{ fontSize: 'clamp(80px, 18vw, 160px)', fontStyle: 'italic', letterSpacing: '-0.04em', lineHeight: 1 }}>404</div>
        <p style={{ marginTop: 20, fontSize: 18, color: 'var(--muted)' }}>Страница не найдена.</p>
        <div style={{ marginTop: 24 }}><Button to="/">← На главную</Button></div>
      </section>
      <Footer />
    </div>
  );
}

export default function WeddingApp() {
  return <Router />;
}

import React from 'react';
