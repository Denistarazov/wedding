import { NextResponse } from "next/server";
import { createAdminSession, verifyAdminPassword } from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limit = rateLimit(`admin-login:${getClientIp(request)}`, 6, 5 * 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Слишком много попыток входа" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
