import { db } from "@/db";
import { faqs } from "@/db/schema";

export default async function Faqs() {
  const list = await db.select().from(faqs).orderBy(faqs.id);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="mb-8 text-4xl font-bold sm:text-5xl">FAQs</h1>
      <div className="divide-y divide-sky-100 rounded-2xl border border-sky-100">
        {list.map((f) => (
          <details key={f.id} className="group p-5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">{f.question}<span aria-hidden className="text-primary transition group-open:rotate-45">+</span></summary>
            <p className="mt-2 whitespace-pre-line text-slate-600">{f.answer}</p>
          </details>
        ))}
        {!list.length && <p className="p-5 text-slate-600">No questions yet.</p>}
      </div>
    </div>
  );
}
