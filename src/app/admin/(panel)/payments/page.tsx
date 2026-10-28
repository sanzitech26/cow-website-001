import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { uploadImage } from "@/lib/storage";
import { InstantSwitch } from "@/components/InstantSwitch";
import { btn, card, inp } from "@/lib/ui";

async function add(fd: FormData) {
  "use server";
  await requireAdmin();
  const name = String(fd.get("name") ?? "").trim();
  if (!name) return;
  const f = fd.get("image");
  const image = f instanceof File && f.size > 0 ? await uploadImage(f) : null;
  await db.insert(paymentMethods).values({ name, image, instructions: String(fd.get("instructions") ?? "") });
  revalidatePath("/admin/payments");
}
async function toggle(id: number, enabled: boolean) {
  "use server";
  await requireAdmin();
  await db.update(paymentMethods).set({ enabled }).where(eq(paymentMethods.id, id));
}
async function remove(fd: FormData) {
  "use server";
  await requireAdmin();
  await db.delete(paymentMethods).where(eq(paymentMethods.id, Number(fd.get("id"))));
  revalidatePath("/admin/payments");
}

export default async function Payments() {
  const list = await db.select().from(paymentMethods).orderBy(paymentMethods.id);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Payment methods</h1>
      <form action={add} className={`${card} space-y-3`}>
        <h2 className="font-bold">Add a method</h2>
        <input name="name" required placeholder="e.g. Bank transfer" aria-label="Name" className={inp} />
        <textarea name="instructions" rows={3} placeholder="Instructions shown to the customer" aria-label="Instructions" className={inp} />
        <label className="block text-sm font-medium">Image / logo <input type="file" name="image" accept="image/*" className="block text-sm" /></label>
        <button className={btn}>Add</button>
      </form>
      <ul className={`${card} divide-y divide-slate-100 p-0`}>
        {list.map((m) => (
          <li key={m.id} className="flex items-center gap-3 p-3">
            {m.image && <img src={m.image} alt="" className="size-10 rounded-lg object-contain" />}
            <div className="min-w-0 flex-1"><p className="font-semibold">{m.name}</p><p className="truncate text-sm text-slate-500">{m.instructions}</p></div>
            <InstantSwitch id={m.id} enabled={m.enabled} label={`${m.name} enabled`} action={toggle} />
            <form action={remove}><input type="hidden" name="id" value={m.id} /><button className="text-sm font-semibold text-red-600">Delete</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
