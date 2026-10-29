"use server";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders, paymentMethods, shares } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { finishOrder } from "@/lib/notify";
import type { PlaceResult } from "../checkout/actions";

const Form = z.object({
  first: z.string().trim().min(1).max(60),
  last: z.string().trim().min(1).max(60),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(200),
  shareId: z.coerce.number().int(),
  zip: z.string().trim().min(3).max(12),
  methodId: z.coerce.number().int(),
  notes: z.string().trim().max(1000).default(""),
  channel: z.enum(["email", "whatsapp", "sms"]),
});

// A reservation is saved as an order with one line (the share), so it shows up in Admin → Orders.
export async function reserve(raw: Record<string, string>): Promise<PlaceResult> {
  const f = Form.safeParse(raw);
  if (!f.success) return { error: "Please fill in every required field with valid details." };
  const s = await getSettings();
  const on = { email: s.orderByEmail, whatsapp: s.orderByWhatsapp && !!s.whatsapp, sms: s.orderBySms && !!s.sms };
  if (!on[f.data.channel]) return { error: "That way of sending the reservation is not available." };
  const [[sh], [m]] = await Promise.all([
    db.select().from(shares).where(eq(shares.id, f.data.shareId)),
    db.select().from(paymentMethods).where(eq(paymentMethods.id, f.data.methodId)),
  ]);
  if (!sh?.published) return { error: "Please choose a share." };
  if (!m?.enabled) return { error: "Please choose a payment method." };

  const number = `RSV-${randomBytes(4).toString("hex").toUpperCase()}`;
  const [order] = await db.insert(orders).values({
    number, customerName: `${f.data.first} ${f.data.last}`, email: f.data.email, phone: f.data.phone, address: `Delivery ZIP: ${f.data.zip}`, notes: f.data.notes,
    items: { v: [{ productId: 0, variantId: null, name: sh.name, option: "", qty: 1, unitCents: sh.priceCents }] },
    totalCents: sh.priceCents, paymentMethod: m.name, channel: f.data.channel,
  }).returning();
  return { number, handoff: await finishOrder(order, s, "reservation") };
}
