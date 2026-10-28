import { notFound } from "next/navigation";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { products, variants } from "@/db/schema";
import { ProductView } from "@/components/ProductView";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p] = await db.select().from(products).where(and(eq(products.slug, slug), eq(products.published, true)));
  if (!p) notFound();
  const [vs, more] = await Promise.all([
    db.select().from(variants).where(eq(variants.productId, p.id)).orderBy(variants.id),
    p.categoryId ? db.select().from(products).where(and(eq(products.categoryId, p.categoryId), ne(products.id, p.id), eq(products.published, true))).limit(3) : [],
  ]);
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <ProductView p={p} variants={vs} />
      {more.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-bold">More from this category</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{more.map((m) => <ProductCard key={m.id} p={m} />)}</div>
        </section>
      )}
    </div>
  );
}
