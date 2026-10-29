import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { shares } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { cents } from "@/lib/form";
import { uploadImage } from "@/lib/storage";
import { FormSwitch } from "@/components/FormSwitch";
import { btn, btn2, card, inp } from "@/lib/ui";

const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

async function save(fd: FormData) {
  "use server";
  await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const pic = async (k: string, old: string | null) => { const f = fd.get(`${k}File`); return f instanceof File && f.size > 0 ? uploadImage(f) : fd.get(`${k}Clear`) === "on" ? null : old; };
  const data = {
    name: text(fd, "name"), kind: text(fd, "kind") === "pork" ? "pork" : "beef", badge: text(fd, "badge"), priceCents: cents(fd.get("price")),
    blurb: text(fd, "blurb"), who: text(fd, "who"), hangingWeight: text(fd, "hangingWeight"), packagedYield: text(fd, "packagedYield"),
    freezerSpace: text(fd, "freezerSpace"), cuts: text(fd, "cuts"), position: Number(fd.get("position")) || 0, published: fd.get("published") === "on",
    chart: await pic("chart", text(fd, "chartOld") || null), photo: await pic("photo", text(fd, "photoOld") || null),
  };
  if (!data.name) return;
  if (id) await db.update(shares).set(data).where(eq(shares.id, id));
  else await db.insert(shares).values(data);
  revalidatePath("/admin/shares");
}
async function remove(fd: FormData) {
  "use server";
  await requireAdmin();
  await db.delete(shares).where(eq(shares.id, Number(fd.get("id"))));
  revalidatePath("/admin/shares");
}

type S = typeof shares.$inferSelect;
function Form({ s }: { s?: S }) {
  const f = (name: string, label: string, v?: string | number, type = "text") => <label className="block text-sm font-medium">{label}<input name={name} type={type} defaultValue={v} className={`${inp} mt-1`} /></label>;
  const img = (k: "chart" | "photo", label: string) => (
    <div className="text-sm font-medium">{label}
      {s?.[k] && <div className="mt-1 flex items-center gap-3"><img src={s[k]!} alt="" className="h-16 rounded-lg" /><label className="flex items-center gap-1 text-xs font-normal"><input type="checkbox" name={`${k}Clear`} /> remove</label></div>}
      <input type="hidden" name={`${k}Old`} value={s?.[k] ?? ""} />
      <input type="file" name={`${k}File`} accept="image/*" className="mt-1 block w-full text-sm font-normal" />
    </div>
  );
  return (
    <form action={save} encType="multipart/form-data" className={`${card} space-y-3`}>
      {s && <input type="hidden" name="id" value={s.id} />}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">{f("name", "Name (e.g. 1/4 Beef)", s?.name)}</div>
        {f("price", "Price (USD)", s ? (s.priceCents / 100).toFixed(2) : "", "number")}
        <label className="block text-sm font-medium">Kind<select name="kind" defaultValue={s?.kind ?? "beef"} className={`${inp} mt-1`}><option value="beef">Beef</option><option value="pork">Pork</option></select></label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">{f("badge", "Badge (optional, e.g. Most popular)", s?.badge)}{f("position", "Order (lower shows first)", s?.position ?? 0, "number")}</div>
      {f("blurb", "Card description", s?.blurb)}
      {f("who", "Who it's for", s?.who)}
      <div className="grid gap-3 sm:grid-cols-3">{f("hangingWeight", "Hanging weight", s?.hangingWeight)}{f("packagedYield", "Packaged yield", s?.packagedYield)}{f("freezerSpace", "Freezer space", s?.freezerSpace)}</div>
      <label className="block text-sm font-medium">Full cut list <span className="font-normal text-slate-500">(one per line: Cut | amount. No amount = included)</span><textarea name="cuts" rows={8} defaultValue={s?.cuts} className={`${inp} mt-1`} /></label>
      <div className="grid gap-3 sm:grid-cols-2">{img("chart", "Cut chart image")}{img("photo", "Photo (shown in the cut list)")}</div>
      <FormSwitch name="published" label="Published" hint="Shown on the site and in the reserve form" defaultChecked={s?.published ?? true} />
      <div className="flex gap-3"><button className={s ? btn2 : btn}>{s ? "Save" : "Add share"}</button>{s && <button formAction={remove} formNoValidate className="text-sm font-semibold text-red-600">Delete</button>}</div>
    </form>
  );
}

export default async function Shares() {
  const list = await db.select().from(shares).orderBy(shares.position, shares.id);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Shares</h1>
      <p className="text-sm text-slate-500">Everything on the Home, Our Beef and Reserve pages that describes a share comes from here. Keep each save under about 4 MB of images.</p>
      <details className="rounded-2xl"><summary className={`${btn} cursor-pointer list-none`}>+ New share</summary><div className="mt-3"><Form /></div></details>
      {list.map((s) => <Form key={s.id} s={s} />)}
    </div>
  );
}
