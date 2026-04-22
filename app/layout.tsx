import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "denisixone — свадебные сайты-приглашения | Wedding website design 2026",
  description:
    "Премиальные свадебные сайты-приглашения. 9 готовых дизайнов и кастомные проекты под ключ.",
  keywords: [
    "свадебный сайт",
    "приглашения",
    "wedding website",
    "wedding invitation",
    "wedding website design 2026",
  ],
  openGraph: {
    title: "denisixone — свадебные сайты-приглашения",
    description: "9 готовых дизайнов и кастом под ключ.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        {children}
      </body>
    </html>
  );
}
