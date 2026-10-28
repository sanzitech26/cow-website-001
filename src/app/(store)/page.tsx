import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts, products, testimonials } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { photo, P } from "@/lib/photos";
import { ProductCard } from "@/components/ProductCard";

const btn = "inline-flex min-h-12 items-center justify-center rounded-full px-7 font-semibold";
const STEPS = [
  ["Choose", "Browse cattle, shares, dairy and more, and add them to your cart."],
  ["Pick a payment method", "Bank transfer or cash on delivery. No card details on this site."],
  ["Send your order", "Send it to us by email, WhatsApp or text in one tap."],
  ["We reply", "We confirm availability and send payment details. Then we deliver."],
];
const WHY = [
  ["Pasture-raised", "Our animals graze open pasture, no feedlots."],
  ["No shortcuts", "No routine antibiotics, no growth hormones."],
  ["Family run", "Real people answer your calls and messages."],
  ["Honest pricing", "The price you see is the price you pay."],
];

export default async function Home() {
  const [s, cats, latest, tests, blog] = await Promise.all([
    getSettings(),
    db.select().from(categories),
    db.select().from(products).where(eq(products.published, true)).orderBy(desc(products.createdAt)).limit(6),
    db.select().from(testimonials).limit(3),
    db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt)).limit(1),
  ]);
  return (
    <>
      <section className="relative bg-slate-900">
        <img src={photo(P.cowsHill, 1800)} alt="Cows grazing on green pasture" className="h-[clamp(420px,70vh,640px)] w-full object-cover opacity-70" fetchPriority="high" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/80 via-transparent">
          <div className="mx-auto w-full max-w-6xl px-5 pb-10 sm:pb-16">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-sky-200">Farm fresh · Pasture raised</p>
            <h1 className="max-w-2xl text-4xl font-bold text-white sm:text-6xl">{s.tagline}</h1>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className={`${btn} bg-primary text-white shadow-lg`}>Shop now</Link>
              <Link href="/about" className={`${btn} border border-white/70 text-white`}>Our story</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Shop by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {cats.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className="flex min-h-24 items-center justify-center rounded-2xl bg-sky-50 p-4 text-center font-semibold text-sky-900 transition hover:bg-sky-100">{c.name}</Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-bold sm:text-4xl">Latest from the farm</h2>
          <Link href="/shop" className="font-semibold text-primary">View all →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{latest.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>

      <section className="bg-sky-50 py-14">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="mb-8 text-3xl font-bold sm:text-4xl">How ordering works</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-white p-5 shadow-sm">
                <span className="mb-3 grid size-9 place-items-center rounded-full bg-primary font-bold text-white">{i + 1}</span>
                <h3 className="mb-1 text-lg font-bold">{t}</h3>
                <p className="text-sm text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sky-50/60">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Our promise</p>
          <h2 className="mb-8 text-3xl font-bold sm:text-4xl">Why buy from us</h2>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {WHY.map(([t, d]) => (
              <div key={t} className="min-w-0 rounded-xl border border-sky-100 bg-white p-5">
                <h3 className="mb-1 text-lg font-bold">{t}</h3>
                <p className="text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {tests.length > 0 && (
        <section className="bg-sky-50 py-14">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="mb-8 text-3xl font-bold sm:text-4xl">Happy customers</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {tests.map((t) => (
                <figure key={t.id} className="rounded-2xl bg-white p-6 shadow-sm">
                  <blockquote className="mb-4 text-slate-700">“{t.quote}”</blockquote>
                  <figcaption className="flex items-center gap-3 text-sm font-semibold">
                    {t.photo && <img src={t.photo} alt="" className="size-9 rounded-full object-cover" />}
                    {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {blog[0] && (
        <section className="bg-sky-50/60">
          <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-8 px-5 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:gap-14">
            <div className="min-w-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">From the blog</p>
              <h2 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">{blog[0].title}</h2>
              <p className="mb-6 max-w-md text-slate-600">{blog[0].excerpt}</p>
              <Link href={`/blog/${blog[0].slug}`} className="inline-flex min-h-11 items-center rounded-full border border-slate-900 px-6 text-sm font-semibold hover:bg-slate-900 hover:text-white">Read the story</Link>
            </div>
            {blog[0].cover && <img src={blog[0].cover} alt="" className="aspect-[4/5] w-full min-w-0 rounded-2xl object-cover" loading="lazy" />}
          </div>
        </section>
      )}
    </>
  );
}
