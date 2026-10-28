import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders, paymentMethods } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { orderText } from "@/lib/notify";
import { usd } from "@/lib/money";
import { AutoOpen } from "@/components/AutoOpen";

// Deliberately omits the customer's phone and address.
export default async function OrderPage({ params, searchParams }: { params: Promise<{ number: string }>; searchParams: Promise<{ sms?: string }> }) {
  const [o] = await db.select().from(orders).where(eq(orders.number, (await params).number));
  if (!o) notFound();
  const [s, [m]] = await Promise.all([getSettings(), db.select().from(paymentMethods).where(eq(paymentMethods.name, o.paymentMethod))]);
  const text = encodeURIComponent(orderText(o, s, true));
  const btn = "mt-4 inline-flex min-h-12 items-center justify-center rounded-full px-7 font-semibold text-white";
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-primary">Order received</p>
      <h1 className="mb-2 text-4xl font-bold">Thank you!</h1>
      <p className="mb-6 text-slate-600">Your order number is <strong>{o.number}</strong>. We&rsquo;ll reply with payment details shortly.</p>
      <ul className="divide-y divide-sky-100 rounded-2xl border border-sky-100">
        {o.items.v.map((i, n) => <li key={n} className="flex justify-between gap-3 p-4"><span>{i.qty} × {i.name}{i.option && ` (${i.option})`}</span><span>{usd(i.unitCents * i.qty)}</span></li>)}
        <li className="flex justify-between p-4 text-lg font-bold"><span>Total</span><span>{usd(o.totalCents)}</span></li>
      </ul>
      <div className="mt-6 rounded-2xl bg-sky-50 p-5">
        <p className="font-semibold">Payment: {o.paymentMethod}</p>
        {m?.instructions && <p className="mt-1 whitespace-pre-line text-sm">{m.instructions}</p>}
      </div>
      {o.channel === "whatsapp" && s.whatsapp && <a className={`${btn} bg-[#128C7E]`} href={`https://wa.me/${s.whatsapp}?text=${text}`} target="_blank" rel="noreferrer">Send on WhatsApp</a>}
      {o.channel === "sms" && s.sms && (await searchParams).sms === "1" && <AutoOpen href={`sms:+${s.sms}?&body=${text}`} />}
      {o.channel === "sms" && s.sms && <a className={`${btn} bg-primary`} href={`sms:+${s.sms}?&body=${text}`}>Send text message</a>}
      {o.channel === "email" && <p className="mt-4 text-sm text-slate-600">A confirmation was emailed to you (if email is set up on this store).</p>}
    </div>
  );
}
