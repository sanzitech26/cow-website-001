import Link from "next/link";
import { price, type Share } from "@/lib/shares";

export const btnRed = "inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 font-semibold text-white shadow-lg shadow-primary/25 hover:brightness-110";
export const btnLine = "inline-flex min-h-12 items-center justify-center rounded-full border border-slate-900/70 px-7 font-semibold hover:bg-slate-900 hover:text-white";

export const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ember">{children}</p>;

export function Section({ eyebrow, title, intro, tone = "cream", children }: { eyebrow: string; title: string; intro?: string; tone?: "cream" | "sand"; children?: React.ReactNode }) {
  return (
    <section className={tone === "sand" ? "bg-sand" : "bg-cream"}>
      <div className="mx-auto max-w-5xl px-5 py-16">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h2>
        {intro && <p className="mb-8 max-w-2xl text-slate-600">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function Cards({ items, cols = 4 }: { items: string[][]; cols?: 2 | 4 }) {
  const g = cols === 4 ? "sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(4,minmax(0,1fr))]" : "sm:grid-cols-[repeat(2,minmax(0,1fr))]";
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)] gap-3 ${g}`}>
      {items.map(([t, d]) => (
        <div key={t} className="min-w-0 rounded-xl border border-stone-200/70 bg-white p-5 shadow-sm">
          <h3 className="mb-1 text-base font-bold">{t}</h3>
          <p className="text-sm text-slate-600">{d}</p>
        </div>
      ))}
    </div>
  );
}

export function Steps({ items }: { items: string[][] }) {
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] gap-8 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(4,minmax(0,1fr))]">
      {items.map(([t, d], i) => (
        <li key={t} className="min-w-0">
          <span className="mb-3 grid size-10 place-items-center rounded-full bg-primary font-heading font-bold text-white">{i + 1}</span>
          <h3 className="mb-1 text-base font-bold">{t}</h3>
          <p className="text-sm text-slate-600">{d}</p>
        </li>
      ))}
    </ol>
  );
}

export function Band({ title, sub }: { title: string; sub: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-900">
      <img src="/img/pasture-band-800.webp" alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-70" loading="lazy" />
      <div className="mx-auto max-w-2xl px-5 py-20 text-center text-white sm:py-24">
        <h2 className="mb-3 text-3xl font-bold sm:text-4xl">{title}</h2>
        <p className="mx-auto max-w-xs text-sm text-white/90">{sub}</p>
      </div>
    </section>
  );
}

export function ShareStats({ s }: { s: Share }) {
  return (
    <dl className="space-y-1.5 text-xs">
      {[["Hanging weight", s.hangingWeight], ["Packaged yield", s.packagedYield], ["Freezer space", s.freezerSpace]].map(([k, v]) => (
        <div key={k} className="flex justify-between gap-3 border-t border-stone-200/70 pt-1.5"><dt className="text-slate-500">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
      ))}
    </dl>
  );
}

export function ShareCard({ s }: { s: Share }) {
  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-stone-200/70 bg-white shadow-sm">
      {s.badge && <span className="absolute left-2 top-2 z-10 rounded-full bg-ember px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">{s.badge}</span>}
      {s.chart && <img src={s.chart} alt={`${s.name} cut chart`} className="aspect-[5/4] w-full bg-sand object-cover" loading="lazy" />}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-lg font-bold">{s.name}</h3>
          <p className="font-heading text-2xl font-bold text-primary">{price(s.priceCents)}</p>
          <p className="text-[11px] text-slate-500">A deposit reserves it · shipping included</p>
        </div>
        <p className="text-sm text-slate-600">{s.blurb}</p>
        <ShareStats s={s} />
        <div className="mt-auto grid gap-2 pt-1">
          <Link href={`/reserve?share=${s.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white hover:brightness-110">Reserve this share</Link>
          <Link href={`/our-beef#share-${s.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-900/60 px-4 text-sm font-semibold hover:bg-slate-900 hover:text-white">What&rsquo;s inside</Link>
        </div>
      </div>
    </article>
  );
}
