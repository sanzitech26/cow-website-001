"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { usd } from "@/lib/money";

type V = { id: number; option: string; value: string; priceDeltaCents: number; stock: number };
type P = { id: number; name: string; description: string; priceCents: number; stock: number; images: string[] };

// ponytail: one option group per product (variants[0].option); multi-axis variants need a combo table.
export function ProductView({ p, variants }: { p: P; variants: V[] }) {
  const router = useRouter();
  const [img, setImg] = useState(0);
  const [vid, setVid] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const v = variants.find((x) => x.id === vid);
  const price = p.priceCents + (v?.priceDeltaCents ?? 0);
  const stock = variants.length ? (v ? v.stock : 1) : p.stock;
  const ready = (!variants.length || v) && stock > 0;
  const add = () => addToCart({ productId: p.id, variantId: vid, qty: 1 });

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col-reverse gap-3 sm:flex-row">
        {p.images.length > 1 && (
          <div className="flex gap-2 sm:flex-col">
            {p.images.map((src, i) => (
              <button key={src} type="button" onClick={() => setImg(i)} aria-label={`Image ${i + 1}`} className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 ${i === img ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="min-w-0 flex-1 self-start overflow-hidden rounded-2xl bg-sky-50">
          {p.images[img] && <img src={p.images[img]} alt={p.name} className="aspect-[4/3] w-full min-w-0 object-cover" />}
        </div>
      </div>

      <div className="min-w-0">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">{p.name}</h1>
        <p className="mb-4 text-2xl font-semibold text-primary">{usd(price)}</p>
        <p className="mb-6 whitespace-pre-line text-slate-600">{p.description}</p>

        {variants.length > 0 && (
          <fieldset className="mb-6">
            <legend className="mb-2 text-sm font-semibold">{variants[0].option}</legend>
            <div className="flex flex-wrap gap-2">
              {variants.map((x) => (
                <button key={x.id} type="button" disabled={x.stock <= 0} aria-pressed={x.id === vid} onClick={() => setVid(x.id)}
                  className={`min-h-11 rounded-full border px-5 text-sm font-semibold disabled:opacity-40 ${x.id === vid ? "border-primary bg-primary text-white" : "border-sky-200"}`}>
                  {x.value}{x.priceDeltaCents ? ` (+${usd(x.priceDeltaCents)})` : ""}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <p className="mb-4 text-sm font-medium">{stock > 0 ? <span className="text-emerald-700">In stock</span> : <span className="text-slate-500">Sold out</span>}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" disabled={!ready} onClick={() => { add(); setAdded(true); }} className="min-h-12 flex-1 rounded-full border-2 border-primary font-semibold text-primary disabled:opacity-40">Add to cart</button>
          <button type="button" disabled={!ready} onClick={() => { add(); router.push("/checkout"); }} className="min-h-12 flex-1 rounded-full bg-primary font-semibold text-white disabled:opacity-40">Proceed to checkout</button>
        </div>
        {added && <Link href="/shop" className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full bg-sky-50 font-semibold text-sky-900">Continue shopping</Link>}

        <ul className="mt-8 space-y-2 rounded-2xl bg-sky-50 p-5 text-sm text-slate-700">
          <li>✓ Pay by bank transfer or cash on delivery</li>
          <li>✓ Send your order by email, WhatsApp or text</li>
          <li>✓ We reply with payment and delivery details</li>
        </ul>
      </div>
    </div>
  );
}
