import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const limit = rateLimit(`lead:${getClientIp(request)}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Слишком много запросов. Попробуйте позже." }, { status: 429 });
  }

  const parsed = leadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Некорректные данные" }, { status: 400 });
  }

  try {
    const db = getDb();
    const lead = await db.lead.create({ data: parsed.data });
    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "База данных пока не настроена. Добавьте DATABASE_URL и примените миграции." },
      { status: 503 },
    );
  }
}
