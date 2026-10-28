import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const [p] = await db.select().from(posts).where(and(eq(posts.slug, (await params).slug), eq(posts.published, true)));
  if (!p) notFound();
  const body = <div className="space-y-4 text-lg leading-relaxed text-slate-700">{p.body.split(/\n{2,}/).map((t, i) => <p key={i}>{t}</p>)}</div>;
  const back = <Link href="/blog" className="mt-10 inline-block font-semibold text-primary">← All posts</Link>;

  if (p.layout === "magazine")
    return (
      <article>
        <header className="relative bg-slate-900">
          {p.cover && <img src={p.cover} alt="" className="h-[clamp(320px,55vh,520px)] w-full object-cover opacity-60" />}
          <div className="absolute inset-0 flex items-end"><h1 className="mx-auto w-full max-w-5xl px-5 pb-8 text-4xl font-bold text-white sm:text-6xl">{p.title}</h1></div>
        </header>
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          <p className="text-xl font-semibold text-primary">{p.excerpt}</p>
          <div>{body}{back}</div>
        </div>
      </article>
    );

  if (p.layout === "grid")
    return (
      <article className="mx-auto max-w-5xl px-5 py-12">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl">{p.title}</h1>
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {p.cover && <img src={p.cover} alt="" className="w-full min-w-0 rounded-2xl object-cover" />}
          <div>{body}{back}</div>
        </div>
      </article>
    );

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="mb-6 text-4xl font-bold sm:text-5xl">{p.title}</h1>
      {p.cover && <img src={p.cover} alt="" className="mb-8 w-full rounded-2xl object-cover" />}
      {body}{back}
    </article>
  );
}
