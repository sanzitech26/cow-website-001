import { FormSwitch } from "@/components/FormSwitch";
import { LayoutPicker } from "@/components/LayoutPicker";
import { btn, card, inp } from "@/lib/ui";
import { savePost } from "@/app/admin/(panel)/blog/actions";

type P = { id: number; title: string; excerpt: string; body: string; cover: string | null; layout: string; published: boolean };

export function PostForm({ p }: { p?: P }) {
  return (
    <form action={savePost} encType="multipart/form-data" className="space-y-5">
      {p && <input type="hidden" name="id" value={p.id} />}
      <section className={`${card} space-y-3`}>
        <label className="block text-sm font-medium">Title<input name="title" required defaultValue={p?.title} className={`${inp} mt-1`} /></label>
        <label className="block text-sm font-medium">Excerpt<input name="excerpt" defaultValue={p?.excerpt} className={`${inp} mt-1`} /></label>
        <label className="block text-sm font-medium">Body (blank line = new paragraph)<textarea name="body" rows={10} defaultValue={p?.body} className={`${inp} mt-1`} /></label>
        <div className="text-sm font-medium">Cover image
          {p?.cover && <img src={p.cover} alt="" className="my-2 h-24 rounded-lg object-cover" />}
          <input type="file" name="cover" accept="image/*" className="block text-sm" />
        </div>
        <FormSwitch name="published" label="Published" defaultChecked={p?.published ?? true} />
      </section>
      <section className={card}><LayoutPicker defaultValue={p?.layout} /></section>
      <button type="submit" className={btn}>{p ? "Save post" : "Create post"}</button>
    </form>
  );
}
