import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getShares } from "@/lib/shares";
import { CLAIMS, PROMISES, STEPS } from "@/lib/copy";
import { Band, Cards, Eyebrow, Section, ShareCard, Steps, btnLine, btnRed } from "@/components/site";

const TRUST = ["100% grass fed & finished", "No antibiotics", "No pesticides", "Family run since 1998", "Ships nationwide", "Shipping included"];

export default async function Home() {
  const [s, shares] = await Promise.all([getSettings(), getShares()]);
  const tel = s.phone.replace(/[^\d+]/g, "");
  const beef = shares.filter((x) => x.kind === "beef" && x.published), pork = shares.filter((x) => x.kind === "pork" && x.published);
  const freezer = [...beef, ...pork].map((x) => `${x.name}: about ${x.freezerSpace}`).join(". ");
  return (
    <>
      <section className="relative isolate overflow-hidden bg-slate-900">
        <img src="/img/hero-herd-640.jpeg" alt="Cattle on open pasture" className="absolute inset-0 -z-10 size-full object-cover opacity-60" fetchPriority="high" />
        <div className="mx-auto max-w-5xl px-5 pb-8 pt-16 sm:pt-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-300">{s.heroEyebrow}</p>
          <h1 className="max-w-xl text-4xl font-bold text-white sm:text-6xl">Beef raised the way nature intended.</h1>
          <p className="mt-5 max-w-md text-white/90">Grass fed and grass finished on our family&rsquo;s pasture. Vacuum sealed, flash frozen, and shipped to your door anywhere in the USA.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="#shares" className={btnRed}>See the shares</a>
            {tel && <a href={`tel:${tel}`} className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/70 px-7 font-semibold text-white">Call {s.phone}</a>}
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 bg-black/45 backdrop-blur-sm">
          <ul className="mx-auto grid max-w-5xl grid-cols-[repeat(2,minmax(0,1fr))] gap-x-4 gap-y-2 px-5 py-4 text-xs font-medium text-white sm:flex sm:flex-wrap sm:justify-between">
            {TRUST.map((t) => <li key={t} className="flex min-w-0 items-center gap-2"><span aria-hidden className="size-1.5 shrink-0 rounded-full bg-amber-300" />{t}</li>)}
          </ul>
        </div>
      </section>

      <section id="shares" className="scroll-mt-20 bg-cream">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Eyebrow>Our shares</Eyebrow>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Pick the size that fits your freezer.</h2>
          <p className="mb-8 max-w-2xl text-slate-600">Four beef shares, one honest price each. No hidden fees, no membership, no confusing per-pound math — the price you see is the price you pay, and a deposit reserves your animal. Pasture-raised pork below.</p>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(4,minmax(0,1fr))]">{beef.map((x) => <ShareCard key={x.id} s={x} />)}</div>

          {!!pork.length && (
            <div className="mt-16">
              <Eyebrow>Also from the farm</Eyebrow>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Pasture-raised pork.</h2>
              <p className="mb-8 max-w-2xl text-slate-600">Two hog shares, cut to your specifications and packed the same way as the beef. Pork is pasture-raised rather than grass finished — pigs are not grazers, so we do not claim they are.</p>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(4,minmax(0,1fr))]">{pork.map((x) => <ShareCard key={x.id} s={x} />)}</div>
            </div>
          )}

          <div className="mt-10 rounded-xl border border-stone-200/70 bg-white p-5 text-sm shadow-sm">
            <h3 className="mb-1 font-bold">How much freezer do I need?</h3>
            <p className="text-slate-600">{s.freezerNote} {freezer && `${freezer}. `}When in doubt, size up.</p>
          </div>
        </div>
      </section>

      <Band title="Grass, sunshine, and time." sub="No grain. No feedlot. No shortcuts in the last ninety days." />

      <Section tone="sand" eyebrow="Why buy from us" title="What you are actually getting."><Cards items={CLAIMS} /></Section>

      <Section eyebrow="How it works" title="Four steps, start to freezer.">
        <Steps items={STEPS} />
        <Link href="/reserve" className={`${btnRed} mt-10`}>Reserve your share</Link>
      </Section>

      <Section tone="sand" eyebrow="Our promise" title="What you can hold us to."><Cards items={PROMISES} cols={2} /></Section>

      <Section eyebrow="Our family" title="Three generations on the same grass." intro="We have been raising cattle here since 1998. The way we do it has not changed much, and that is the point.">
        <Link href="/our-story" className={btnLine}>Read our story</Link>
      </Section>
    </>
  );
}
