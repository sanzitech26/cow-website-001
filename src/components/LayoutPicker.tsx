// Visual layout picker: radios (sr-only + peer) so it needs no JS and stays keyboard accessible.
const I = "#7dd3fc", L = "#cbd5e1", D = "#475569"; // image, line, dark
const svg = (children: React.ReactNode) => <svg viewBox="0 0 60 40" className="w-full rounded border border-slate-200 bg-white" aria-hidden>{children}</svg>;

const THUMBS = {
  classic: {
    list: svg(<>{[4, 16, 28].map((y) => <g key={y}><rect x="4" y={y} width="14" height="9" rx="1" fill={I} /><rect x="21" y={y + 1} width="30" height="2.5" fill={D} /><rect x="21" y={y + 5} width="22" height="2" fill={L} /></g>)}</>),
    post: svg(<><rect x="12" y="3" width="36" height="4" fill={D} /><rect x="12" y="10" width="36" height="14" rx="1" fill={I} /><rect x="12" y="27" width="36" height="2" fill={L} /><rect x="12" y="31" width="36" height="2" fill={L} /><rect x="12" y="35" width="24" height="2" fill={L} /></>),
    name: "Classic", desc: "Rows in the list, one narrow column on the post.",
  },
  grid: {
    list: svg(<>{[[4, 4], [32, 4], [4, 22], [32, 22]].map(([x, y]) => <g key={`${x}${y}`}><rect x={x} y={y} width="24" height="10" rx="1" fill={I} /><rect x={x} y={y + 12} width="20" height="2.5" fill={D} /></g>)}</>),
    post: svg(<><rect x="4" y="3" width="40" height="4" fill={D} /><rect x="4" y="11" width="25" height="24" rx="1" fill={I} /><rect x="33" y="11" width="23" height="2" fill={L} /><rect x="33" y="16" width="23" height="2" fill={L} /><rect x="33" y="21" width="23" height="2" fill={L} /><rect x="33" y="26" width="16" height="2" fill={L} /></>),
    name: "Grid", desc: "Cards in a grid, image beside the text on the post.",
  },
  magazine: {
    list: svg(<><rect x="4" y="4" width="52" height="20" rx="1" fill={I} /><rect x="8" y="16" width="28" height="3" fill={D} /><rect x="4" y="28" width="24" height="8" rx="1" fill={L} /><rect x="32" y="28" width="24" height="8" rx="1" fill={L} /></>),
    post: svg(<><rect x="0" y="0" width="60" height="18" fill={I} /><rect x="6" y="11" width="32" height="3.5" fill={D} /><rect x="6" y="23" width="12" height="10" fill={L} /><rect x="24" y="23" width="30" height="2" fill={L} /><rect x="24" y="28" width="30" height="2" fill={L} /><rect x="24" y="33" width="20" height="2" fill={L} /></>),
    name: "Magazine", desc: "Big featured banner in the list, full-width hero on the post.",
  },
} as const;

export function LayoutPicker({ defaultValue = "classic" }: { defaultValue?: string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">Layout</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(THUMBS) as (keyof typeof THUMBS)[]).map((k) => (
          <label key={k} className="cursor-pointer">
            <input type="radio" name="layout" value={k} defaultChecked={defaultValue === k} className="peer sr-only" />
            <span className="block rounded-2xl border-2 border-slate-200 p-3 peer-checked:border-primary peer-checked:bg-sky-50 peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
              <span className="grid grid-cols-2 gap-2 text-center text-[10px] text-slate-500">
                <span>{THUMBS[k].list}In the list</span><span>{THUMBS[k].post}On the post</span>
              </span>
              <span className="mt-2 block font-semibold">{THUMBS[k].name}</span>
              <span className="block text-xs text-slate-600">{THUMBS[k].desc}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
