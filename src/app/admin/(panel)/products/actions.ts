"use server";
import { redirect } from "next/navigation";
import { eq, inArray, and, notInArray } from "drizzle-orm";
import { db } from "@/db";
import { products, variants } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { cents, slugify } from "@/lib/form";
import { uploadImage } from "@/lib/storage";

export async function saveProduct(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const name = String(fd.get("name") ?? "").trim();
  if (!name) redirect(id ? `/admin/products/${id}` : "/admin/products/new");

  const kept = (JSON.parse(String(fd.get("existingImages") ?? "[]")) as string[]).filter((u) => !fd.getAll("removeImage").includes(u));
  const uploaded: string[] = [];
  for (const f of fd.getAll("files")) if (f instanceof File && f.size > 0) uploaded.push(await uploadImage(f));

  const data = {
    name, description: String(fd.get("description") ?? ""), priceCents: cents(fd.get("price")), stock: Math.max(0, Number(fd.get("stock")) || 0),
    categoryId: Number(fd.get("categoryId")) || null, published: fd.get("published") === "on", images: [...kept, ...uploaded],
  };

  let pid = id;
  if (id) await db.update(products).set(data).where(eq(products.id, id));
  else {
    let slug = slugify(name);
    if ((await db.select({ id: products.id }).from(products).where(eq(products.slug, slug))).length) slug += `-${Date.now().toString(36)}`;
    pid = (await db.insert(products).values({ ...data, slug }).returning({ id: products.id }))[0].id;
  }

  // Variants: update by id so customers' carts keep working; delete the rows the form dropped.
  const vid = fd.getAll("vid"), opt = fd.getAll("vopt"), val = fd.getAll("vval"), delta = fd.getAll("vdelta"), vstock = fd.getAll("vstock");
  const keep: number[] = [];
  for (let i = 0; i < vid.length; i++) {
    const option = String(opt[i]).trim(), value = String(val[i]).trim();
    if (!option || !value) continue;
    const row = { option, value, priceDeltaCents: cents(delta[i]), stock: Math.max(0, Number(vstock[i]) || 0) };
    const existing = Number(vid[i]);
    if (existing) { await db.update(variants).set(row).where(and(eq(variants.id, existing), eq(variants.productId, pid!))); keep.push(existing); }
    else keep.push((await db.insert(variants).values({ ...row, productId: pid! }).returning({ id: variants.id }))[0].id);
  }
  await db.delete(variants).where(keep.length ? and(eq(variants.productId, pid!), notInArray(variants.id, keep)) : eq(variants.productId, pid!));
  redirect("/admin/products");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  await db.delete(products).where(inArray(products.id, [Number(fd.get("id"))]));
  redirect("/admin/products");
}
