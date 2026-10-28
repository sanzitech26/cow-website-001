import { db } from "@/db";
import { faqs } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { photo, P } from "@/lib/photos";
import { sendContact } from "./actions";

const field = "w-full min-h-11 rounded-xl border border-sky-200 px-3 py-2";

export default async function Contact({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const [s, list, { sent }] = await Promise.all([getSettings(), db.select().from(faqs).orderBy(faqs.id), searchParams]);
  const tel = s.phone.replace(/[^\d+]/g, "");
  const cards = [
    s.address && ["Address", s.address, `https://www.google.com/maps?q=${encodeURIComponent(s.address)}`],
    s.phone && ["Phone", s.phone, `tel:${tel}`],
    s.email && ["Email", s.email, `mailto:${s.email}`],
  ].filter(Boolean) as string[][];

  return (
    <>
      <section className="relative bg-slate-900">
        <img src={photo(P.cowsHill, 1800)} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]">
          <h1 className="text-5xl font-bold text-white sm:text-6xl">Get in touch</h1>
          <form action={sendContact} className="space-y-3 rounded-3xl bg-white p-6 shadow-xl">
            {sent && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Thanks! We&rsquo;ll be in touch soon.</p>}
            <label className="block text-sm font-medium">Name<input name="name" required className={field} /></label>
            <label className="block text-sm font-medium">Email<input name="email" type="email" required className={field} /></label>
            <label className="block text-sm font-medium">Message<textarea name="message" required rows={4} className={field} /></label>
            <button type="submit" className="min-h-12 w-full rounded-full bg-primary font-semibold text-white">Send message</button>
          </form>
        </div>
      </section>

      {cards.length > 0 && (
        <section className="mx-auto grid max-w-6xl gap-4 px-5 py-12 sm:grid-cols-3">
          {cards.map(([t, v, href]) => (
            <a key={t} href={href} className="rounded-2xl bg-sky-50 p-5 transition hover:bg-sky-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t}</p><p className="mt-1 font-semibold">{v}</p>
            </a>
          ))}
        </section>
      )}

      {s.showMap && s.address && (
        <section className="mx-auto max-w-6xl px-5 pb-12">
          <iframe title="Map" loading="lazy" className="h-80 w-full rounded-2xl border-0" src={`https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`} />
        </section>
      )}

      {list.length > 0 && (
        <section className="mx-auto max-w-3xl px-5 pb-16">
          <h2 className="mb-4 text-3xl font-bold">Common questions</h2>
          <div className="divide-y divide-sky-100 rounded-2xl border border-sky-100">
            {list.map((f) => (
              <details key={f.id} className="group p-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">{f.question}<span aria-hidden className="text-primary transition group-open:rotate-45">+</span></summary>
                <p className="mt-2 whitespace-pre-line text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
