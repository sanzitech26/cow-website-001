import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shares } from "@/db/schema";
import { price } from "@/lib/shares";
import { CutTable, Eyebrow, btnLine, btnRed } from "@/components/site";

export default async function ShareDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [s] = Number.isInteger(id) ? await db.select().from(shares).where(eq(shares.id, id)) : [];
  if (!s?.published) notFound();
  const rows = [["Best for", s.who], ["Hanging weight", s.hangingWeight], ["Packaged yield", s.packagedYield], ["Freezer space", s.freezerSpace]];
  const lower = s.name.toLowerCase();
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-8 px-5 py-14 md:grid-cols-[repeat(2,minmax(0,1fr))] md:gap-14 md:py-20">
          <img src={s.photo || s.chart || ""} alt={s.name} className="aspect-[4/3] w-full min-w-0 rounded-2xl object-cover" />
          <div className="min-w-0">
            <Eyebrow>{s.kind === "pork" ? "Pork share" : "Beef share"}</Eyebrow>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{s.name} Share</h1>
            <p className="font-heading text-4xl font-bold text-primary">{price(s.priceCents)}</p>
            <p className="mb-2 text-xs text-slate-500">A deposit reserves it · shipping included</p>
            <p className="mb-5 text-slate-600">{s.blurb}</p>
            <dl className="mb-6 space-y-2 border-t border-stone-200 pt-4 text-sm">
              {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-slate-500">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>)}
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={`/reserve?share=${s.id}`} className={btnRed}>Reserve this share</Link>
              <Link href="/#shares" className={btnLine}>Compare all shares</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Eyebrow>What&rsquo;s inside</Eyebrow>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Your {lower.replace(/ (beef|pig)$/, "")} {s.kind === "pork" ? "pork" : "beef"}, cut by cut.</h2>
          <p className="mb-10 max-w-2xl text-slate-600">Ranges, not promises — every animal hangs a little differently. You choose the details on the butcher&rsquo;s cut sheet after you reserve.</p>
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 md:grid-cols-[repeat(2,minmax(0,1fr))] md:gap-14">
            <div className="min-w-0 rounded-xl border border-stone-200/70 bg-white p-6 shadow-sm">{s.cuts ? <CutTable cuts={s.cuts} /> : <p className="text-sm text-slate-600">Cut list coming soon.</p>}</div>
            {s.chart && (
              <figure className="min-w-0">
                <img src={s.chart} alt={`${s.name} cut chart`} className="aspect-[5/4] w-full rounded-2xl bg-white object-cover" />
                <figcaption className="mt-3 text-sm text-slate-600">The shaded area is roughly what comes home with you.</figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
