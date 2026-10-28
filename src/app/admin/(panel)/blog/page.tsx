import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { btn, card } from "@/lib/ui";
import { deletePost } from "./actions";

export default async function AdminBlog() {
  const list = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><h1 className="text-3xl font-bold">Blog</h1><Link href="/admin/blog/new" className={btn}>New post</Link></div>
      <ul className={`${card} divide-y divide-slate-100 p-0`}>
        {list.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            <Link href={`/admin/blog/${p.id}`} className="min-w-0 flex-1"><p className="truncate font-semibold">{p.title}</p><p className="text-sm text-slate-500">{p.layout}{!p.published && " · draft"}</p></Link>
            <form action={deletePost}><input type="hidden" name="id" value={p.id} /><button className="text-sm font-semibold text-red-600">Delete</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
