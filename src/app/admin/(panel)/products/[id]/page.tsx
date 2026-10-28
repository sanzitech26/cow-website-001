import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, variants } from "@/db/schema";
import { ProductForm } from "@/components/ProductForm";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [p] = Number.isInteger(id) ? await db.select().from(products).where(eq(products.id, id)) : [];
  if (!p) notFound();
  const [vs, cats] = await Promise.all([db.select().from(variants).where(eq(variants.productId, id)).orderBy(variants.id), db.select().from(categories)]);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Edit product</h1>
      <ProductForm p={p} vs={vs} cats={cats} />
    </div>
  );
}
