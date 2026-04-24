import { randomUUID } from "node:crypto";

type CreatePaymentInput = {
  orderId: string;
  orderNumber: string;
  amount: number;
  description: string;
};

export function hasYooKassaConfig() {
  return Boolean(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
}

function getAuthHeader() {
  const token = Buffer.from(
    `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`,
  ).toString("base64");
  return `Basic ${token}`;
}

export async function createYooKassaPayment(input: CreatePaymentInput) {
  if (!hasYooKassaConfig()) {
    throw new Error("YooKassa credentials are not configured");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const idempotenceKey = randomUUID();

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
    },
    body: JSON.stringify({
      amount: {
        value: (input.amount / 100).toFixed(2),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `${appUrl}/order/success?order=${encodeURIComponent(input.orderNumber)}`,
      },
      description: input.description.slice(0, 128),
      metadata: {
        orderId: input.orderId,
        orderNumber: input.orderNumber,
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.description || "YooKassa payment creation failed");
  }

  return {
    idempotenceKey,
    paymentId: payload.id as string,
    status: payload.status as string,
    confirmationUrl: payload.confirmation?.confirmation_url as string | undefined,
    raw: payload,
  };
}

export async function fetchYooKassaPayment(paymentId: string) {
  if (!hasYooKassaConfig()) {
    throw new Error("YooKassa credentials are not configured");
  }

  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.description || "YooKassa payment fetch failed");
  }

  return payload;
}

export function mapYooKassaStatus(status: string) {
  if (status === "succeeded") return "SUCCEEDED";
  if (status === "canceled") return "CANCELED";
  return "PENDING";
}
