import { z } from "zod";

const contactSchema = z
  .string()
  .trim()
  .min(3, "Укажите email или Telegram")
  .refine((value) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isTelegram = /^@?[a-zA-Z0-9_]{3,32}$/.test(value);
    return isEmail || isTelegram;
  }, "Укажите корректный email или Telegram");

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(120),
  contact: contactSchema,
  type: z.string().trim().min(2).max(80).default("Готовый"),
  message: z.string().trim().max(3000).optional().default(""),
  source: z.string().trim().max(80).optional().default("contact_form"),
});

export const orderSchema = z.object({
  productSlug: z.string().trim().min(2).max(80),
  customerName: z.string().trim().min(2, "Укажите имя").max(120),
  contact: contactSchema,
  message: z.string().trim().max(3000).optional().default(""),
});

export const productUpsertSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(180),
  type: z.enum(["TEMPLATE", "DESIGN_PACKAGE"]),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  price: z.coerce.number().int().min(0).max(10000000),
  short: z.string().trim().min(5).max(300),
  description: z.string().trim().min(10).max(5000),
  image: z.string().trim().max(500).optional().default(""),
});
