import type { Metadata } from "next";
import { CommerceShell, PageHero } from "@/components/commerce/site-shell";
import { AdminLoginForm } from "@/components/commerce/admin-login-form";

export const metadata: Metadata = {
  title: "Вход в админку | denisixone",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <CommerceShell>
      <PageHero eyebrow="Админ" title="Защищённый вход.">
        <p>Доступ только для владельца. Пароль хранится в переменной окружения ADMIN_PASSWORD.</p>
      </PageHero>
      <AdminLoginForm />
    </CommerceShell>
  );
}
