import { db } from "@/db";
import { faqs, paymentMethods } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { getShares, price } from "@/lib/shares";
import { STEPS } from "@/lib/copy";
import { Eyebrow, Steps } from "@/components/site";
import { ReserveForm } from "@/components/ReserveForm";

export default async function Reserve({ searchParams }: { searchParams: Promise<{ share?: string }> }) {
  const [s, shares, methods, list, { share }] = await Promise.all([
    getSettings(), getShares(), db.select().from(paymentMethods).orderBy(paymentMethods.id), db.select().from(faqs).orderBy(faqs.id), searchParams,
  ]);
  const open = shares.filter((x) => x.published);
  const live = methods.filter((m) => m.enabled);
  const channels = ([s.orderByEmail && "email", s.orderByWhatsapp && s.whatsapp && "whatsapp", s.orderBySms && s.sms && "sms"] as const).filter(Boolean) as ("email" | "whatsapp" | "sms")[];
  const rows = [["Deposit", "Confirmed when we reply"], ["Balance due", "Before your beef ships"], ["We accept", live.map((m) => m.name).join(", ") || "—"], ["Ships to", "Anywhere in the USA"]];
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Eyebrow>Reserve</Eyebrow>
          <h1 className="mb-5 text-4xl font-bold sm:text-5xl">Lock in your share.</h1>
          <p className="mb-10 max-w-xl text-slate-600">A deposit reserves your animal and locks your price. Tell us which share you want and we will reply within 24 hours with availability and payment details.</p>
          <Steps items={STEPS} />
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <div className="min-w-0">
            <h2 className="mb-4 text-3xl font-bold">Reserve your share</h2>
            <p className="mb-5 max-w-md text-slate-700">Every share is whole-animal, vacuum sealed and flash frozen. {s.shipNote}</p>
            <dl className="max-w-md space-y-1.5 border-t border-stone-300 pt-3 text-sm">
              {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-slate-500">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>)}
            </dl>
            <p className="mt-4 max-w-md text-sm text-slate-600">We never post payment handles publicly. Once your reservation is confirmed we send instructions for the method you picked.</p>
          </div>
          <ReserveForm
            shares={open.map((x) => ({ id: x.id, label: `${x.name} — ${price(x.priceCents)}` }))}
            methods={live.map((m) => ({ id: m.id, label: m.name }))}
            channels={channels}
            initial={Number(share) || undefined}
          />
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Eyebrow>Good questions</Eyebrow>
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Before you reserve.</h2>
          <div className="max-w-2xl divide-y divide-stone-200 border-y border-stone-200">
            {list.map((f) => (
              <details key={f.id} className="group py-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">{f.question}<span aria-hidden className="text-primary transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 whitespace-pre-line text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
