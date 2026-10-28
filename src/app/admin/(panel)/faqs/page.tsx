import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { btn, btn2, card, inp } from "@/lib/ui";

async function create(fd: FormData) {
  "use server";
  await requireAdmin();
  const question = String(fd.get("question") ?? "").trim(), answer = String(fd.get("answer") ?? "").trim();
  if (question && answer) await db.insert(faqs).values({ question, answer });
  revalidatePath("/admin/faqs");
}
async function update(fd: FormData) {
  "use server";
  await requireAdmin();
  await db.update(faqs).set({ question: String(fd.get("question")), answer: String(fd.get("answer")) }).where(eq(faqs.id, Number(fd.get("id"))));
  revalidatePath("/admin/faqs");
}
async function remove(fd: FormData) {
  "use server";
  await requireAdmin();
  await db.delete(faqs).where(eq(faqs.id, Number(fd.get("id"))));
  revalidatePath("/admin/faqs");
}

export default async function Faqs() {
  const list = await db.select().from(faqs).orderBy(faqs.id);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">FAQs</h1>
      <form action={create} className={`${card} space-y-3`}>
        <input name="question" required placeholder="Question" aria-label="Question" className={inp} />
        <textarea name="answer" required rows={2} placeholder="Answer" aria-label="Answer" className={inp} />
        <button className={btn}>Add FAQ</button>
      </form>
      {list.map((f) => (
        <form key={f.id} action={update} className={`${card} space-y-3`}>
          <input type="hidden" name="id" value={f.id} />
          <input name="question" required defaultValue={f.question} aria-label="Question" className={inp} />
          <textarea name="answer" required rows={2} defaultValue={f.answer} aria-label="Answer" className={inp} />
          <div className="flex gap-3"><button className={btn2}>Save</button><button formAction={remove} formNoValidate className="text-sm font-semibold text-red-600">Delete</button></div>
        </form>
      ))}
    </div>
  );
}
