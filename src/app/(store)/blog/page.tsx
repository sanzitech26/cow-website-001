import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";

// Each post's layout shapes how it appears in this list.
export default async function Blog() {
  const list = await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt));
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="mb-8 text-4xl font-bold sm:text-5xl">Blog</h1>
      {!list.length && <p className="text-slate-600">No posts yet.</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((p) =>
          p.layout === "magazine" ? (
            <Link key={p.id} href={`/blog/${p.slug}`} className="relative col-span-full block overflow-hidden rounded-2xl bg-slate-900">
              {p.cover && <img src={p.cover} alt="" className="aspect-[21/9] w-full object-cover opacity-70" />}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900/80 p-6 text-white">
                <h2 className="text-3xl font-bold">{p.title}</h2><p className="mt-1 max-w-xl">{p.excerpt}</p>
              </div>
            </Link>
          ) : p.layout === "grid" ? (
            <Link key={p.id} href={`/blog/${p.slug}`} className="overflow-hidden rounded-2xl border border-sky-100">
              {p.cover && <img src={p.cover} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />}
              <div className="p-5"><h2 className="text-xl font-bold">{p.title}</h2><p className="mt-1 text-sm text-slate-600">{p.excerpt}</p></div>
            </Link>
          ) : (
            <Link key={p.id} href={`/blog/${p.slug}`} className="col-span-full grid gap-5 border-b border-sky-100 pb-6 sm:grid-cols-[14rem_minmax(0,1fr)]">
              {p.cover && <img src={p.cover} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />}
              <div><h2 className="text-2xl font-bold">{p.title}</h2><p className="mt-1 text-slate-600">{p.excerpt}</p><span className="mt-3 inline-block font-semibold text-primary">Read more →</span></div>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
