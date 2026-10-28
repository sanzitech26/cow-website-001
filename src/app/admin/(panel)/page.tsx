import Link from "next/link";
import { desc, count } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { usd } from "@/lib/money";
import { card } from "@/lib/ui";

export default async function Dashboard() {
  const [[o], [p], recent] = await Promise.all([
    db.select({ n: count() }).from(orders),
    db.select({ n: count() }).from(products),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
  ]);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className={card}><p className="text-sm text-slate-500">Orders</p><p className="text-3xl font-bold">{o.n}</p></div>
        <div className={card}><p className="text-sm text-slate-500">Products</p><p className="text-3xl font-bold">{p.n}</p></div>
      </div>
      <h2 className="text-xl font-bold">Recent orders</h2>
      <ul className={`${card} divide-y divide-slate-100 p-0`}>
        {recent.map((r) => <li key={r.id}><Link href={`/admin/orders/${r.id}`} className="flex justify-between p-3 hover:bg-slate-50"><span>{r.number} · {r.customerName}</span><span className="font-semibold">{usd(r.totalCents)}</span></Link></li>)}
        {!recent.length && <li className="p-3 text-slate-500">No orders yet.</li>}
      </ul>
    </div>
  );
}
