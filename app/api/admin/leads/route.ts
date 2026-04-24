import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await getDb().lead.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ leads });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string" || typeof body?.status !== "string") {
    return NextResponse.json({ error: "id и status обязательны" }, { status: 400 });
  }

  const lead = await getDb().lead.update({
    where: { id: body.id },
    data: { status: body.status },
  });

  return NextResponse.json({ lead });
}
