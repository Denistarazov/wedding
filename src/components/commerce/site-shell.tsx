import Link from "next/link";
import type { ReactNode } from "react";

export function SiteHeader() {
  return (
    <header className="commerce-header">
      <Link className="commerce-brand" href="/">
        <span className="serif">denisixone</span>
        <span>WEDDING STORE</span>
      </Link>
      <nav aria-label="Основная навигация" className="commerce-nav">
        <Link href="/shop">Каталог</Link>
        <Link href="/templates">Демо</Link>
        <Link href="/contact">Заявка</Link>
        <Link href="/admin">Админ</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="commerce-footer">
      <div>
        <div className="serif">denisixone</div>
        <p>Свадебные шаблоны и дизайн-пакеты. Оплата через ЮKassa, запуск на Vercel.</p>
      </div>
      <div>
        <Link href="/privacy">Политика конфиденциальности</Link>
        <Link href="/terms">Пользовательское соглашение</Link>
      </div>
    </footer>
  );
}

export function CommerceShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="commerce-main">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="commerce-hero">
      <p className="commerce-eyebrow">{eyebrow}</p>
      <h1 className="serif">{title}</h1>
      {children ? <div className="commerce-hero-copy">{children}</div> : null}
    </section>
  );
}
