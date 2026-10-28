import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { getSettings } from "@/lib/settings";
import { usd } from "@/lib/money";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function Receipt({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  const [[o], s] = await Promise.all([Number.isInteger(id) ? db.select().from(orders).where(eq(orders.id, id)) : [], getSettings()]);
  if (!o) notFound();
  return (
    <div className="mx-auto max-w-2xl bg-white p-8 text-slate-900">
      <div className="mb-6 flex items-start justify-between">
        <div><h1 className="text-3xl font-bold">{s.storeName}</h1><p className="text-sm text-slate-600">{s.address}<br />{s.phone} {s.email}</p></div>
        <PrintButton />
      </div>
      <p className="font-semibold">Receipt {o.number}</p>
      <p className="mb-4 text-sm text-slate-600">{o.createdAt.toLocaleDateString("en-US", { dateStyle: "long" })} · Status: {o.status}</p>
      <p className="mb-4 text-sm"><strong>{o.customerName}</strong><br />{o.address}<br />{o.phone} · {o.email}</p>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-slate-300 text-left"><th className="py-2">Item</th><th>Qty</th><th className="text-right">Price</th></tr></thead>
        <tbody>
          {o.items.v.map((i, n) => <tr key={n} className="border-b border-slate-100"><td className="py-2">{i.name}{i.option && ` (${i.option})`}</td><td>{i.qty}</td><td className="text-right">{usd(i.unitCents * i.qty)}</td></tr>)}
          <tr><td colSpan={2} className="py-3 text-right font-bold">Total</td><td className="text-right text-lg font-bold">{usd(o.totalCents)}</td></tr>
        </tbody>
      </table>
      <p className="mt-4 text-sm">Payment method: {o.paymentMethod}</p>
    </div>
  );
}
