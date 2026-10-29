"use server";
import { randomBytes } from "crypto";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders, paymentMethods, products, variants } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { priceCart, type Line, type Priced } from "@/lib/pricing";
import { finishOrder } from "@/lib/notify";

export async function priceCartAction(lines: Line[]): Promise<{ items: Priced[]; total: number; ok: boolean }> {
  return priceCart(lines);
}

const Form = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(40),
  address: z.string().trim().min(5).max(500),
  notes: z.string().trim().max(1000).default(""),
  methodId: z.coerce.number().int(),
  channel: z.enum(["email", "whatsapp", "sms"]),
});

export type PlaceResult = { error: string } | { number: string; handoff: string | null };

export async function placeOrder(raw: Record<string, string>, lines: Line[]): Promise<PlaceResult> {
  const f = Form.safeParse(raw);
  if (!f.success) return { error: "Please fill in every required field with valid details." };
  const s = await getSettings();
  const on = { email: s.orderByEmail, whatsapp: s.orderByWhatsapp && !!s.whatsapp, sms: s.orderBySms && !!s.sms };
  if (!on[f.data.channel]) return { error: "That way of sending the order is not available." };
  const [m] = await db.select().from(paymentMethods).where(eq(paymentMethods.id, f.data.methodId));
  if (!m?.enabled) return { error: "Please choose a payment method." };
  const priced = await priceCart(lines);
  if (!priced.ok) return { error: "Some items in your cart are unavailable. Please review your cart." };

  // ponytail: neon-http has no transactions; these are sequential writes, so a crash mid-way can leave stock untouched on a saved order.
  const number = `ORD-${randomBytes(4).toString("hex").toUpperCase()}`;
  const [order] = await db.insert(orders).values({
    number, customerName: f.data.name, email: f.data.email, phone: f.data.phone, address: f.data.address, notes: f.data.notes,
    items: { v: priced.items.map(({ image, stock, problem, ...i }) => i) }, totalCents: priced.total, paymentMethod: m.name, channel: f.data.channel,
  }).returning();
  for (const i of priced.items) {
    if (i.variantId) await db.update(variants).set({ stock: sql`${variants.stock} - ${i.qty}` }).where(eq(variants.id, i.variantId));
    else await db.update(products).set({ stock: sql`${products.stock} - ${i.qty}` }).where(eq(products.id, i.productId));
  }

  const handoff = await finishOrder(order, s);
  return { number, handoff };
}
