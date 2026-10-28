import { photo, P } from "@/lib/photos";

const PRINCIPLES = [
  ["🌿", "Pasture first", "Our cattle graze open pasture. It is better for the animals, the land and the flavor."],
  ["🤝", "Honest dealing", "Clear prices, clear descriptions, and a real person who answers when you message."],
  ["🏡", "Family run", "A small farm, not a factory. We know every animal we sell."],
];
const HOW = [
  [P.cowField, "Choose", "Browse live cattle, beef and pork shares, dairy, merch and supplies."],
  [P.herdSunset, "Order", "Pick a payment method and send your order to us in one tap."],
  [P.steak, "Receive", "We confirm, you pay as agreed, and we deliver or arrange pickup."],
];

export default function About() {
  return (
    <>
      <section className="relative bg-slate-900">
        <img src={photo(P.herdSunset, 1800)} alt="" className="h-[clamp(300px,50vh,460px)] w-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center">
          <h1 className="mx-auto w-full max-w-6xl px-5 text-5xl font-bold text-white sm:text-7xl">Our story</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Principles</h2>
        <p className="mb-8 max-w-2xl text-lg text-slate-600">We raise cattle the way it has always been done well: slowly, on grass, with care.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map(([icon, t, d]) => (
            <div key={t} className="rounded-2xl bg-sky-50 p-6">
              <span aria-hidden className="mb-3 block text-3xl">{icon}</span>
              <h3 className="mb-1 text-xl font-bold">{t}</h3>
              <p className="text-sm text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="mb-8 text-3xl font-bold sm:text-4xl">How it works</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {HOW.map(([id, t, d]) => (
            <div key={t} className="overflow-hidden rounded-2xl border border-sky-100">
              <img src={photo(id, 700)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-5"><h3 className="mb-1 text-xl font-bold">{t}</h3><p className="text-sm text-slate-600">{d}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
