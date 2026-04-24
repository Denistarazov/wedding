import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { productUpsertSchema } from "@/lib/validators";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getDb().product.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = productUpsertSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Некорректные данные" }, { status: 400 });
  }

  const { id, ...data } = parsed.data;
  const product = id
    ? await getDb().product.update({ where: { id }, data })
    : await getDb().product.create({ data: { ...data, currency: "RUB" } });

  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string") {
    return NextResponse.json({ error: "id обязателен" }, { status: 400 });
  }

  await getDb().product.delete({ where: { id: body.id } });
  return NextResponse.json({ ok: true });
}
