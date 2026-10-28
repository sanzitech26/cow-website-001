"use client";
import Link from "next/link";
import { setCart } from "@/lib/cart";
import { usePriced } from "@/lib/usePriced";
import { usd } from "@/lib/money";
import { ClearCart } from "@/components/ClearCart";

export default function Cart() {
  const { lines, loading, items, total, ok } = usePriced();
  const change = (pid: number, vid: number | null, d: number) =>
    setCart(lines.map((l) => (l.productId === pid && l.variantId === vid ? { ...l, qty: Math.max(1, Math.min(99, l.qty + d)) } : l)));
  const remove = (pid: number, vid: number | null) => setCart(lines.filter((l) => !(l.productId === pid && l.variantId === vid)));

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-4xl font-bold">Your cart</h1>
        {lines.length > 0 && <ClearCart />}
      </div>

      {lines.length === 0 ? (
        <div className="rounded-2xl bg-sky-50 p-8 text-center">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/shop" className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-semibold text-white">Browse the shop</Link>
        </div>
      ) : loading ? <p className="text-slate-500">Loading…</p> : (
        <>
          {!ok && <p role="alert" className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Some items can’t be ordered right now. Remove them, or clear your cart, to continue.</p>}
          <ul className="divide-y divide-sky-100 rounded-2xl border border-sky-100">
            {items.map((i) => (
              <li key={`${i.productId}-${i.variantId}`} className="flex gap-4 p-4">
                {i.image && <img src={i.image} alt="" className="size-20 shrink-0 rounded-xl object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{i.name}</p>
                  {i.option && <p className="text-sm text-slate-500">{i.option}</p>}
                  {i.problem && <p className="text-sm font-medium text-red-600">{i.problem}</p>}
                  <div className="mt-2 flex items-center gap-3">
                    <button type="button" aria-label="Decrease" onClick={() => change(i.productId, i.variantId, -1)} className="size-9 rounded-full border border-sky-200">−</button>
                    <span className="w-6 text-center">{i.qty}</span>
                    <button type="button" aria-label="Increase" onClick={() => change(i.productId, i.variantId, 1)} className="size-9 rounded-full border border-sky-200">+</button>
                    <button type="button" onClick={() => remove(i.productId, i.variantId)} className="ml-2 text-sm text-slate-500 underline">Remove</button>
                  </div>
                </div>
                <p className="font-semibold">{usd(i.unitCents * i.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between text-xl font-bold"><span>Total</span><span>{usd(total)}</span></div>
          {ok
            ? <Link href="/checkout" className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-primary font-semibold text-white">Checkout</Link>
            : <span className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-500">Checkout unavailable</span>}
        </>
      )}
    </div>
  );
}
