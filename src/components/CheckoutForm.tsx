"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/app/(store)/checkout/actions";
import { clearCart } from "@/lib/cart";
import { usePriced } from "@/lib/usePriced";
import { usd } from "@/lib/money";
import { ClearCart } from "@/components/ClearCart";

type M = { id: number; name: string; image: string | null; instructions: string };
const LABEL = { email: "email", whatsapp: "WhatsApp", sms: "text message" } as const;
const SUBMIT = { email: "Place order & send by email", whatsapp: "Place order & continue on WhatsApp", sms: "Place order & send by text" } as const;
const input = "w-full min-h-11 rounded-xl border border-sky-200 px-3 py-2";

export function CheckoutForm({ methods, channels }: { methods: M[]; channels: (keyof typeof LABEL)[] }) {
  const router = useRouter();
  const { lines, loading, items, total, ok } = usePriced();
  const [method, setMethod] = useState<number | null>(null);
  const [channel, setChannel] = useState<keyof typeof LABEL>(channels[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!methods.length || !channels.length) return <p className="rounded-2xl bg-sky-50 p-6">Checkout isn&rsquo;t available right now. Please contact us directly.</p>;
  if (!lines.length) return <p className="rounded-2xl bg-sky-50 p-6">Your cart is empty. <Link href="/shop" className="font-semibold text-primary underline">Browse the shop</Link></p>;
  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (!ok) return (
    <div role="alert" className="rounded-2xl bg-amber-50 p-6 text-amber-900">
      <p className="mb-3">Some items in your cart can&rsquo;t be ordered right now.</p>
      <Link href="/cart" className="mr-4 font-semibold underline">Review cart</Link><ClearCart />
    </div>
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (method == null) return setError("Please choose a payment method.");
    setError(""); setBusy(true);
    // Must open synchronously inside the click so popup blockers allow it; its URL is set after the order saves.
    const tab = channel === "whatsapp" ? window.open("", "_blank") : null;
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const r = await placeOrder({ ...raw, methodId: String(method), channel }, lines);
    if ("error" in r) { tab?.close(); setBusy(false); return setError(r.error); }
    if (tab && r.handoff) tab.location.href = r.handoff;
    clearCart();
    // sms: the confirmation page opens the text app (see AutoOpen); navigating first keeps the order page reliable
    router.push(`/order/${r.number}${channel === "sms" ? "?sms=1" : ""}`);
  }

  const chosen = methods.find((m) => m.id === method);
  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-xl font-bold">Your details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-medium">Full name<input name="name" required autoComplete="name" className={input} /></label>
            <label className="text-sm font-medium">Phone<input name="phone" required type="tel" autoComplete="tel" className={input} /></label>
            <label className="text-sm font-medium sm:col-span-2">Email<input name="email" required type="email" autoComplete="email" className={input} /></label>
            <label className="text-sm font-medium sm:col-span-2">Delivery address<textarea name="address" required rows={2} autoComplete="street-address" className={input} /></label>
            <label className="text-sm font-medium sm:col-span-2">Notes (optional)<textarea name="notes" rows={2} className={input} /></label>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold">Payment method</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {methods.map((m) => (
              <label key={m.id} className="cursor-pointer">
                <input type="radio" name="pm" className="peer sr-only" checked={method === m.id} onChange={() => setMethod(m.id)} />
                <span className="flex min-h-16 items-center gap-3 rounded-2xl border-2 border-sky-100 p-3 peer-checked:border-primary peer-checked:bg-sky-50 peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                  {m.image && <img src={m.image} alt="" className="size-10 rounded-lg object-contain" />}
                  <span className="font-semibold">{m.name}</span>
                </span>
              </label>
            ))}
          </div>
          {chosen?.instructions && <p className="mt-3 whitespace-pre-line rounded-xl bg-sky-50 p-4 text-sm">{chosen.instructions}</p>}
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold">Send my order by</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {channels.map((c) => (
              <label key={c} className="cursor-pointer">
                <input type="radio" name="ch" className="peer sr-only" checked={channel === c} onChange={() => setChannel(c)} />
                <span className="flex min-h-14 items-center justify-center rounded-2xl border-2 border-sky-100 px-3 font-semibold capitalize peer-checked:border-primary peer-checked:bg-sky-50 peer-focus-visible:ring-2 peer-focus-visible:ring-primary">{LABEL[c]}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-sky-100 p-5 lg:sticky lg:top-24">
        <h2 className="mb-3 text-xl font-bold">Order summary</h2>
        <ul className="mb-4 space-y-2 text-sm">
          {items.map((i) => <li key={`${i.productId}-${i.variantId}`} className="flex justify-between gap-3"><span>{i.qty} × {i.name}{i.option && ` (${i.option})`}</span><span>{usd(i.unitCents * i.qty)}</span></li>)}
        </ul>
        <p className="mb-4 flex justify-between text-lg font-bold"><span>Total</span><span>{usd(total)}</span></p>
        {error && <p role="alert" className="mb-3 text-sm font-medium text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="min-h-12 w-full rounded-full bg-primary font-semibold text-white disabled:opacity-50">{busy ? "Placing order…" : SUBMIT[channel]}</button>
      </aside>
    </form>
  );
}
