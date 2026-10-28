import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { ProductCard } from "@/components/ProductCard";

export default async function Shop({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const cats = await db.select().from(categories);
  const cat = cats.find((c) => c.slug === category);
  const list = await db.select().from(products)
    .where(and(eq(products.published, true), cat ? eq(products.categoryId, cat.id) : undefined))
    .orderBy(desc(products.createdAt));
  const chip = (on: boolean) => `rounded-full border px-4 py-2 text-sm font-semibold ${on ? "border-primary bg-primary text-white" : "border-sky-200 text-sky-900 hover:bg-sky-50"}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="mb-6 text-4xl font-bold sm:text-5xl">Shop</h1>
      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/shop" className={chip(!cat)}>All</Link>
        {cats.map((c) => <Link key={c.id} href={`/shop?category=${c.slug}`} className={chip(c.id === cat?.id)}>{c.name}</Link>)}
      </div>
      {list.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : <p className="text-slate-600">Nothing here yet. Check back soon.</p>}
    </div>
  );
}
