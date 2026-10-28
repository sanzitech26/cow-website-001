import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { usd } from "@/lib/money";
import { card } from "@/lib/ui";

export default async function Orders() {
  const list = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Orders</h1>
      {!list.length && <p className="text-slate-600">No orders yet.</p>}
      <ul className={`${card} divide-y divide-slate-100 p-0`}>
        {list.map((o) => (
          <li key={o.id}><Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 p-3 hover:bg-slate-50">
            <span><span className="block font-semibold">{o.number} · {o.customerName}</span><span className="text-sm text-slate-500">{o.createdAt.toLocaleString("en-US")} · {o.channel}</span></span>
            <span className="text-right"><span className="block font-semibold">{usd(o.totalCents)}</span><span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium">{o.status}</span></span>
          </Link></li>
        ))}
      </ul>
    </div>
  );
}
