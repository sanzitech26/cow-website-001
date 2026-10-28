import Link from "next/link";
import { usd } from "@/lib/money";

type P = { slug: string; name: string; priceCents: number; stock: number; images: string[] };

export function ProductCard({ p }: { p: P }) {
  return (
    <Link href={`/shop/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden bg-sky-50">
        {p.images[0] && <img src={p.images[0]} alt={p.name} loading="lazy" className="size-full object-cover transition group-hover:scale-105" />}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-lg font-bold">{p.name}</h3>
        <p className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-primary">{usd(p.priceCents)}</span>
          {p.stock <= 0 && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Sold out</span>}
        </p>
      </div>
    </Link>
  );
}
