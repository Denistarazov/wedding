import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getDb().order.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true, payments: { orderBy: { createdAt: "desc" }, take: 1 } },
    take: 100,
  });

  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string" || typeof body?.status !== "string") {
    return NextResponse.json({ error: "id и status обязательны" }, { status: 400 });
  }

  const order = await getDb().order.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  return NextResponse.json({ order });
}
