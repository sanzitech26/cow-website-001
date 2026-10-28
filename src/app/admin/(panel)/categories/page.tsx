import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/form";
import { btn, card, inp } from "@/lib/ui";

async function add(fd: FormData) {
  "use server";
  await requireAdmin();
  const name = String(fd.get("name") ?? "").trim();
  if (name) await db.insert(categories).values({ name, slug: `${slugify(name)}-${Date.now().toString(36).slice(-3)}` }).onConflictDoNothing();
  revalidatePath("/admin/categories");
}
async function remove(fd: FormData) {
  "use server";
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, Number(fd.get("id"))));
  revalidatePath("/admin/categories");
}

export default async function Categories() {
  const list = await db.select().from(categories).orderBy(categories.id);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Categories</h1>
      <form action={add} className="flex gap-2"><input name="name" required placeholder="New category" aria-label="Category name" className={inp} /><button className={btn}>Add</button></form>
      <ul className={`${card} divide-y divide-slate-100 p-0`}>
        {list.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-3"><span className="font-medium">{c.name}</span>
            <form action={remove}><input type="hidden" name="id" value={c.id} /><button className="text-sm font-semibold text-red-600">Delete</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
