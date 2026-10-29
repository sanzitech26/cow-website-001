import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { PROMISES, STEPS, WILL } from "@/lib/copy";
import { Band, Cards, Eyebrow, Section, Steps, btnLine, btnRed } from "@/components/site";

const LETTER = [
  "This is a family farm, and it has been since 1998. What I know about cattle I learned from the people who raised me, the same way they learned it from the people who raised them.",
  "The work has not changed much. Look after the land, look after the animals, and be straight with the people who buy from you. That is most of it.",
  "Our cattle are grass fed and grass finished — grass and forage their whole lives, no grain, no antibiotics, and no pesticides on the pasture. Raising an animal this way takes longer. I think you can taste why we still do it.",
  "We sell quarter, half and whole shares so a family can fill a freezer and know exactly where the beef came from and who raised it. No guesswork, no middleman, no label to decode.",
  "From our family to yours — thank you for putting our beef on your table.",
];

export default async function OurStory() {
  const s = await getSettings();
  const tel = s.phone.replace(/[^\d+]/g, "");
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-start gap-8 px-5 py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-14">
          <div className="min-w-0">
            <Eyebrow>Our story</Eyebrow>
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl">A family tradition since 1998.</h1>
            <div className="space-y-4 text-slate-700">{LETTER.map((p) => <p key={p}>{p}</p>)}</div>
            {s.founder && <p className="mt-5 font-heading font-bold text-primary">— {s.founder}</p>}
            <Link href="/reserve" className={`${btnRed} mt-6`}>Reserve a share</Link>
          </div>
          <img src="/img/cow-portrait-700.webp" alt="One of our cattle on the pasture" className="aspect-[4/5] w-full min-w-0 rounded-2xl object-cover" />
        </div>
      </section>

      <Band title="Good food starts with care." sub="Soil first, then grass, then cattle. In that order, every year." />

      <Section tone="sand" eyebrow="How we raise them" title="What we will and will not do." intro="These are the only claims we make, and we stand behind every one of them."><Cards items={WILL} cols={2} /></Section>

      <Section eyebrow="Buying from us" title="How a share works."><Steps items={STEPS} /></Section>

      <Section tone="sand" eyebrow="Our promise" title="What you can hold us to.">
        <Cards items={PROMISES.slice(0, 2)} cols={2} />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/reserve" className={btnRed}>Reserve your share</Link>
          {tel && <a href={`tel:${tel}`} className={btnLine}>Talk to the farmer</a>}
        </div>
      </Section>
    </>
  );
}
