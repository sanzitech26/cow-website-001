import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { uploadImage } from "@/lib/storage";
import { btn, btn2, card, inp } from "@/lib/ui";

async function photoOf(fd: FormData) {
  const f = fd.get("photo");
  return f instanceof File && f.size > 0 ? await uploadImage(f) : undefined;
}
async function create(fd: FormData) {
  "use server";
  await requireAdmin();
  const name = String(fd.get("name") ?? "").trim(), quote = String(fd.get("quote") ?? "").trim();
  if (name && quote) await db.insert(testimonials).values({ name, quote, photo: (await photoOf(fd)) ?? null });
  revalidatePath("/admin/testimonials");
}
async function update(fd: FormData) {
  "use server";
  await requireAdmin();
  const photo = await photoOf(fd);
  await db.update(testimonials).set({ name: String(fd.get("name")), quote: String(fd.get("quote")), ...(photo && { photo }) }).where(eq(testimonials.id, Number(fd.get("id"))));
  revalidatePath("/admin/testimonials");
}
async function remove(fd: FormData) {
  "use server";
  await requireAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, Number(fd.get("id"))));
  revalidatePath("/admin/testimonials");
}

const file = <input type="file" name="photo" accept="image/*" aria-label="Photo (optional)" className="block text-sm" />;

export default async function Testimonials() {
  const list = await db.select().from(testimonials).orderBy(testimonials.id);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Testimonials</h1>
      <form action={create} className={`${card} space-y-3`}>
        <input name="name" required placeholder="Customer name" aria-label="Customer name" className={inp} />
        <textarea name="quote" required rows={2} placeholder="Quote" aria-label="Quote" className={inp} />
        {file}
        <button className={btn}>Add testimonial</button>
      </form>
      {list.map((t) => (
        <form key={t.id} action={update} className={`${card} space-y-3`}>
          <input type="hidden" name="id" value={t.id} />
          <div className="flex items-center gap-3">{t.photo && <img src={t.photo} alt="" className="size-12 rounded-full object-cover" />}<input name="name" required defaultValue={t.name} aria-label="Customer name" className={inp} /></div>
          <textarea name="quote" required rows={2} defaultValue={t.quote} aria-label="Quote" className={inp} />
          {file}
          <div className="flex gap-3"><button className={btn2}>Save</button><button formAction={remove} formNoValidate className="text-sm font-semibold text-red-600">Delete</button></div>
        </form>
      ))}
    </div>
  );
}
