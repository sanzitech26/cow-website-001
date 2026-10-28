"use server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/form";
import { uploadImage } from "@/lib/storage";

export async function savePost(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const title = String(fd.get("title") ?? "").trim();
  if (!title) redirect("/admin/blog");
  const f = fd.get("cover");
  const cover = f instanceof File && f.size > 0 ? await uploadImage(f) : undefined;
  const layout = ["classic", "grid", "magazine"].includes(String(fd.get("layout"))) ? String(fd.get("layout")) : "classic";
  const data = { title, excerpt: String(fd.get("excerpt") ?? ""), body: String(fd.get("body") ?? ""), layout, published: fd.get("published") === "on", ...(cover && { cover }) };
  if (id) await db.update(posts).set(data).where(eq(posts.id, id));
  else await db.insert(posts).values({ ...data, slug: `${slugify(title)}-${Date.now().toString(36).slice(-3)}` });
  redirect("/admin/blog");
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  await db.delete(posts).where(eq(posts.id, Number(fd.get("id"))));
  redirect("/admin/blog");
}
