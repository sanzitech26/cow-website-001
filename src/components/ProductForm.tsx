import { FormSwitch } from "@/components/FormSwitch";
import { btn, card, inp } from "@/lib/ui";
import { saveProduct } from "@/app/admin/(panel)/products/actions";

type P = { id: number; name: string; description: string; priceCents: number; stock: number; categoryId: number | null; images: string[]; published: boolean };
type V = { id: number; option: string; value: string; priceDeltaCents: number; stock: number };

const ROWS = 5; // ponytail: fixed 5 variant rows; add a row button if anyone needs more

export function ProductForm({ p, vs, cats }: { p?: P; vs: V[]; cats: { id: number; name: string }[] }) {
  const rows = Array.from({ length: Math.max(ROWS, vs.length + 1) }, (_, i) => vs[i]);
  const small = `${inp} min-w-0`;
  return (
    <form action={saveProduct} encType="multipart/form-data" className="space-y-6">
      {p && <input type="hidden" name="id" value={p.id} />}
      <section className={`${card} space-y-3`}>
        <label className="block text-sm font-medium">Name<input name="name" required defaultValue={p?.name} className={`${inp} mt-1`} /></label>
        <label className="block text-sm font-medium">Description<textarea name="description" rows={4} defaultValue={p?.description} className={`${inp} mt-1`} /></label>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm font-medium">Price (USD)<input name="price" type="number" step="0.01" min="0" required defaultValue={p ? (p.priceCents / 100).toFixed(2) : ""} className={`${inp} mt-1`} /></label>
          <label className="block text-sm font-medium">Stock<input name="stock" type="number" min="0" defaultValue={p?.stock ?? 0} className={`${inp} mt-1`} /></label>
          <label className="block text-sm font-medium">Category
            <select name="categoryId" defaultValue={p?.categoryId ?? ""} className={`${inp} mt-1`}>
              <option value="">None</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <FormSwitch name="published" label="Published" hint="Visible in the shop" defaultChecked={p?.published ?? true} />
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="text-lg font-bold">Images</h2>
        <input type="hidden" name="existingImages" value={JSON.stringify(p?.images ?? [])} />
        {!!p?.images.length && (
          <div className="flex flex-wrap gap-3">
            {p.images.map((u) => (
              <label key={u} className="text-xs">
                <img src={u} alt="" className="size-20 rounded-lg object-cover" />
                <span className="mt-1 flex items-center gap-1"><input type="checkbox" name="removeImage" value={u} /> remove</span>
              </label>
            ))}
          </div>
        )}
        <input type="file" name="files" accept="image/*" multiple className="block w-full text-sm" />
        <p className="text-xs text-slate-500">Keep each save under about 4 MB total.</p>
      </section>

      <section className={`${card} space-y-2`}>
        <h2 className="text-lg font-bold">Variants</h2>
        <p className="text-xs text-slate-500">One option group per product (e.g. Size: Small, Large). When present, customers must pick one, and stock is tracked per value. Leave rows empty to skip.</p>
        <div className="hidden grid-cols-4 gap-2 text-xs font-semibold sm:grid"><span>Option</span><span>Value</span><span>Price change ($)</span><span>Stock</span></div>
        {rows.map((v, i) => (
          <div key={v?.id ?? `n${i}`} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <input type="hidden" name="vid" value={v?.id ?? 0} />
            <input name="vopt" aria-label="Option" placeholder="Size" defaultValue={v?.option ?? vs[0]?.option ?? ""} className={small} />
            <input name="vval" aria-label="Value" placeholder="Large" defaultValue={v?.value} className={small} />
            <input name="vdelta" aria-label="Price change" type="number" step="0.01" defaultValue={v ? (v.priceDeltaCents / 100).toFixed(2) : ""} className={small} />
            <input name="vstock" aria-label="Stock" type="number" min="0" defaultValue={v?.stock} className={small} />
          </div>
        ))}
      </section>
      <button type="submit" className={btn}>{p ? "Save product" : "Create product"}</button>
    </form>
  );
}
