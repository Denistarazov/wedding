import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { fetchYooKassaPayment, mapYooKassaStatus } from "@/lib/yookassa";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const eventType = payload?.event;
  const paymentId = payload?.object?.id;

  if (!eventType || !paymentId) {
    return NextResponse.json({ error: "Некорректный webhook" }, { status: 400 });
  }

  const eventId = `${eventType}:${paymentId}:${payload?.object?.status || "unknown"}`;

  try {
    const db = getDb();
    const existing = await db.webhookEvent.findUnique({ where: { eventId } });
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const verifiedPayment = await fetchYooKassaPayment(paymentId);
    const metadataOrderId = verifiedPayment?.metadata?.orderId;
    const status = mapYooKassaStatus(verifiedPayment.status);

    await db.$transaction(async (tx) => {
      await tx.webhookEvent.create({
        data: {
          provider: "yookassa",
          eventId,
          type: eventType,
          payload,
        },
      });

      const payment = await tx.payment.update({
        where: { providerPaymentId: paymentId },
        data: {
          status,
          raw: verifiedPayment,
        },
      });

      if (status === "SUCCEEDED") {
        await tx.order.update({
          where: { id: metadataOrderId || payment.orderId },
          data: { status: "PAID" },
        });
      }

      if (status === "CANCELED") {
        await tx.order.update({
          where: { id: metadataOrderId || payment.orderId },
          data: { status: "CANCELLED" },
        });
      }
    });

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook не обработан" }, { status: 500 });
  }
}
