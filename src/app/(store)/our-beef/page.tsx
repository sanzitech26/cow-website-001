import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getShares, price } from "@/lib/shares";
import { CLAIMS } from "@/lib/copy";
import { OpenOnHash } from "@/components/OpenOnHash";
import { Band, Cards, Eyebrow, ShareStats, btnRed } from "@/components/site";

export default async function OurBeef() {
  const [s, all] = await Promise.all([getSettings(), getShares()]);
  const shares = all.filter((x) => x.published);
  return (
    <>
      <OpenOnHash />
      <section className="bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Eyebrow>Our beef</Eyebrow>
          <h1 className="mb-5 max-w-2xl text-4xl font-bold sm:text-5xl">Grass fed, grass finished, and nothing else.</h1>
          <p className="mb-8 max-w-xl text-slate-600">Most beef labeled grass fed in a grocery store spent its last few months on grain to fatten up faster. Ours never does. Here is exactly what we raise, how we raise it, and what arrives in your freezer.</p>
          <Cards items={CLAIMS} />
        </div>
      </section>

      <Band title="Rotated, rested, regrown." sub="Cattle move between paddocks so the grass recovers and the soil keeps its roots." />

      <section className="bg-sand">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-8 px-5 py-16 md:grid-cols-[repeat(2,minmax(0,1fr))] md:gap-14">
          <img src="/img/hero-herd-640.jpeg" alt="Cattle grazing" className="aspect-[4/3] w-full min-w-0 rounded-2xl object-cover" loading="lazy" />
          <div className="min-w-0">
            <Eyebrow>On the pasture</Eyebrow>
            <h2 className="mb-4 text-3xl font-bold">Room to move, all year.</h2>
            <p className="mb-4 text-slate-700">Our cattle spend their days on open grass with space to graze and shade to rest in. A slower-grown animal on good forage puts on fat differently — that is where the flavor in a grass finished ribeye comes from.</p>
            <p className="text-slate-700">We keep the land in shape because the land is what feeds the herd. No pesticides go on our pasture.</p>
          </div>
        </div>
      </section>

      <section id="shares" className="scroll-mt-20 bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Eyebrow>Every share, side by side</Eyebrow>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">What is in each one.</h2>
          <p className="mb-8 max-w-xl text-slate-600">Beef first, then the two pasture-raised pork shares. Yields vary a little animal to animal — these are honest ranges, not marketing numbers.</p>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))]">
            {shares.map((x) => (
              <article key={x.id} id={`share-${x.id}`} className="min-w-0 scroll-mt-24 rounded-xl border border-stone-200/70 bg-white p-5 shadow-sm">
                <h3 className="font-heading text-lg font-bold">{x.name} — {price(x.priceCents)}</h3>
                <p className="mb-3 text-sm text-slate-600">{x.who}</p>
                <div className="text-sm"><ShareStats s={x} /></div>
                {(x.cuts || x.photo) && (
                  <details className="group mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-primary">See the full cut list</summary>
                    {x.photo && <img src={x.photo} alt="" className="mt-3 aspect-[4/3] w-full rounded-lg object-cover" loading="lazy" />}
                    <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{x.cuts}</p>
                  </details>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-8 px-5 py-16 md:grid-cols-[repeat(2,minmax(0,1fr))] md:gap-14">
          <div className="min-w-0">
            <Eyebrow>After harvest</Eyebrow>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Cut, sealed, and frozen hard.</h2>
            <p className="mb-4 text-slate-700">Your beef is dry aged, cut to your sheet, vacuum sealed and flash frozen so it holds its flavor until you are ready for it. Everything is labeled, so nobody is squinting at a mystery package six months from now.</p>
            <p className="mb-6 text-slate-700">{s.shipNote}</p>
            <Link href="/reserve" className={btnRed}>Reserve your share</Link>
          </div>
          <img src="/img/share-eighth-700.jpeg" alt="Dry aged ribeye steaks" className="aspect-[4/3] w-full min-w-0 rounded-2xl object-cover" loading="lazy" />
        </div>
      </section>
    </>
  );
}
