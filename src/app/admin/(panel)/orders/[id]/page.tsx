import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { usd } from "@/lib/money";
import { btn, btn2, card, inp } from "@/lib/ui";

const STATUSES = ["new", "confirmed", "paid", "shipped", "completed", "cancelled"];

async function setStatus(fd: FormData) {
  "use server";
  await requireAdmin();
  const status = String(fd.get("status"));
  if (!STATUSES.includes(status)) return;
  await db.update(orders).set({ status }).where(eq(orders.id, Number(fd.get("id"))));
  revalidatePath(`/admin/orders/${fd.get("id")}`);
}

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [o] = Number.isInteger(id) ? await db.select().from(orders).where(eq(orders.id, id)) : [];
  if (!o) notFound();
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">{o.number}</h1>
      <section className={`${card} space-y-1 text-sm`}>
        <p><strong>{o.customerName}</strong></p><p>{o.phone} · {o.email}</p><p className="whitespace-pre-line">{o.address}</p>
        {o.notes && <p className="text-slate-600">Notes: {o.notes}</p>}
        <p className="text-slate-500">{o.createdAt.toLocaleString("en-US")} · sent by {o.channel} · {o.paymentMethod}</p>
      </section>
      <ul className={`${card} divide-y divide-slate-100 p-0`}>
        {o.items.v.map((i, n) => <li key={n} className="flex justify-between gap-3 p-3"><span>{i.qty} × {i.name}{i.option && ` (${i.option})`}</span><span>{usd(i.unitCents * i.qty)}</span></li>)}
        <li className="flex justify-between p-3 text-lg font-bold"><span>Total</span><span>{usd(o.totalCents)}</span></li>
      </ul>
      <form action={setStatus} className="flex gap-2">
        <input type="hidden" name="id" value={o.id} />
        <select name="status" defaultValue={o.status} aria-label="Status" className={inp}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <button className={btn}>Update</button>
      </form>
      <Link href={`/admin/receipt/${o.id}`} className={btn2}>Printable receipt</Link>
    </div>
  );
}
