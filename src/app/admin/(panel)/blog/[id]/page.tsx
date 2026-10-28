import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { PostForm } from "@/components/PostForm";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const [p] = Number.isInteger(id) ? await db.select().from(posts).where(eq(posts.id, id)) : [];
  if (!p) notFound();
  return <div className="space-y-5"><h1 className="text-3xl font-bold">Edit post</h1><PostForm p={p} /></div>;
}
