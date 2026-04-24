import { NextResponse } from "next/server";
import { catalogProducts } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { orderSchema } from "@/lib/validators";
import { createYooKassaPayment, hasYooKassaConfig, mapYooKassaStatus } from "@/lib/yookassa";

function orderNumber() {
  return `WB-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
  const limit = rateLimit(`order:${getClientIp(request)}`, 4, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Слишком много заказов подряд. Попробуйте позже." }, { status: 429 });
  }

  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Некорректные данные" }, { status: 400 });
  }

  const catalogProduct = catalogProducts.find((product) => product.slug === parsed.data.productSlug);
  if (!catalogProduct) {
    return NextResponse.json({ error: "Услуга не найдена" }, { status: 404 });
  }

  try {
    const db = getDb();
    const product = await db.product.upsert({
      where: { slug: catalogProduct.slug },
      update: {
        title: catalogProduct.title,
        price: catalogProduct.price * 100,
        short: catalogProduct.short,
        description: catalogProduct.description,
        image: catalogProduct.image,
      },
      create: {
        slug: catalogProduct.slug,
        title: catalogProduct.title,
        type: catalogProduct.kind === "template" ? "TEMPLATE" : "DESIGN_PACKAGE",
        price: catalogProduct.price * 100,
        currency: "RUB",
        short: catalogProduct.short,
        description: catalogProduct.description,
        image: catalogProduct.image,
      },
    });

    const order = await db.order.create({
      data: {
        orderNumber: orderNumber(),
        productId: product.id,
        customerName: parsed.data.customerName,
        contact: parsed.data.contact,
        message: parsed.data.message,
        amount: product.price,
        currency: "RUB",
        status: "NEW",
      },
    });

    if (!hasYooKassaConfig()) {
      return NextResponse.json(
        {
          orderId: order.id,
          orderNumber: order.orderNumber,
          warning: "YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY не настроены",
        },
        { status: 201 },
      );
    }

    const payment = await createYooKassaPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.amount,
      description: `${catalogProduct.title} · ${order.orderNumber}`,
    });

    await db.$transaction([
      db.order.update({
        where: { id: order.id },
        data: { status: payment.status === "succeeded" ? "PAID" : "PAYMENT_PENDING" },
      }),
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

    return NextResponse.json(
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        confirmationUrl: payment.confirmationUrl,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "База данных пока не настроена. Добавьте DATABASE_URL и примените миграции." },
      { status: 503 },
    );
  }
}
