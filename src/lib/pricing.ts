import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { products, variants, type OrderItem } from "@/db/schema";

export type Line = { productId: number; variantId: number | null; qty: number };
export type Priced = OrderItem & { image: string | null; stock: number; problem?: string };

// Source of truth for prices/options/stock: the browser cart only sends ids and quantities.
export async function priceCart(lines: Line[]): Promise<{ items: Priced[]; total: number; ok: boolean }> {
  const clean = lines.filter((l) => Number.isInteger(l.productId) && Number.isInteger(l.qty) && l.qty > 0 && l.qty <= 99);
  if (!clean.length) return { items: [], total: 0, ok: false };
  const [ps, vs] = await Promise.all([
    db.select().from(products).where(inArray(products.id, clean.map((l) => l.productId))),
    db.select().from(variants).where(inArray(variants.productId, clean.map((l) => l.productId))),
  ]);
  const items = clean.map((l): Priced => {
    const p = ps.find((x) => x.id === l.productId);
    const v = l.variantId ? vs.find((x) => x.id === l.variantId && x.productId === l.productId) : undefined;
    if (!p || !p.published) return { ...l, variantId: l.variantId, name: "Unavailable item", option: "", unitCents: 0, qty: l.qty, image: null, stock: 0, problem: "No longer available" };
    const needsVariant = vs.some((x) => x.productId === p.id);
    const stock = needsVariant ? (v?.stock ?? 0) : p.stock;
    const problem = needsVariant && !v ? "Option no longer available" : stock <= 0 ? "Out of stock" : l.qty > stock ? `Only ${stock} left` : undefined;
    return { productId: p.id, variantId: v?.id ?? null, name: p.name, option: v ? `${v.option}: ${v.value}` : "", qty: l.qty, unitCents: p.priceCents + (v?.priceDeltaCents ?? 0), image: p.images[0] ?? null, stock, problem };
  });
  return { items, total: items.reduce((a, i) => a + i.unitCents * i.qty, 0), ok: items.every((i) => !i.problem) };
}
