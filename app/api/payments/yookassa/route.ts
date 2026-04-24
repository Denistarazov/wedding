import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createYooKassaPayment, hasYooKassaConfig, mapYooKassaStatus } from "@/lib/yookassa";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const orderId = typeof body?.orderId === "string" ? body.orderId : "";

  if (!orderId) {
    return NextResponse.json({ error: "orderId обязателен" }, { status: 400 });
  }

  if (!hasYooKassaConfig()) {
    return NextResponse.json({ error: "ЮKassa не настроена" }, { status: 503 });
  }

  try {
    const db = getDb();
    const order = await db.order.findUnique({ where: { id: orderId }, include: { product: true } });
    if (!order) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    const payment = await createYooKassaPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.amount,
      description: `${order.product.title} · ${order.orderNumber}`,
    });

    await db.$transaction([
      db.order.update({ where: { id: order.id }, data: { status: "PAYMENT_PENDING" } }),
      db.payment.create({
        data: {
          orderId: order.id,
          providerPaymentId: payment.paymentId,
          idempotenceKey: payment.idempotenceKey,
          amount: order.amount,
          currency: "RUB",
          status: mapYooKassaStatus(payment.status),
          confirmationUrl: payment.confirmationUrl,
          raw: payment.raw,
        },
      }),
    ]);

    return NextResponse.json({ confirmationUrl: payment.confirmationUrl });
  } catch {
    return NextResponse.json({ error: "Не удалось создать платёж" }, { status: 500 });
  }
}
