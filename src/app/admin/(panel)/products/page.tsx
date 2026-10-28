import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { usd } from "@/lib/money";
import { btn, card } from "@/lib/ui";
import { deleteProduct } from "./actions";

export default async function AdminProducts() {
  const list = await db.select().from(products).orderBy(desc(products.createdAt));
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-bold">Products</h1><Link href="/admin/products/new" className={btn}>New product</Link></div>
      <ul className={`${card} divide-y divide-slate-100 p-0`}>
        {list.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            {p.images[0] && <img src={p.images[0]} alt="" className="size-14 rounded-lg object-cover" />}
            <Link href={`/admin/products/${p.id}`} className="min-w-0 flex-1"><p className="truncate font-semibold">{p.name}</p><p className="text-sm text-slate-500">{usd(p.priceCents)} · stock {p.stock}{!p.published && " · draft"}</p></Link>
            <form action={deleteProduct}><input type="hidden" name="id" value={p.id} /><button className="text-sm font-semibold text-red-600">Delete</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
