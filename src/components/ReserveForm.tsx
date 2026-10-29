"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { reserve } from "@/app/(store)/reserve/actions";

type Opt = { id: number; label: string };
const LABEL = { email: "Email", whatsapp: "WhatsApp", sms: "Text message" } as const;
const input = "mt-1 w-full min-h-11 rounded-xl border border-stone-200 bg-cream px-3 py-2";

export function ReserveForm({ shares, methods, channels, initial }: { shares: Opt[]; methods: Opt[]; channels: (keyof typeof LABEL)[]; initial?: number }) {
  const router = useRouter();
  const [channel, setChannel] = useState(channels[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setBusy(true);
    // Must open synchronously inside the click so popup blockers allow it; its URL is set after the reservation saves.
    const tab = channel === "whatsapp" ? window.open("", "_blank") : null;
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const r = await reserve({ ...raw, channel });
    if ("error" in r) { tab?.close(); setBusy(false); return setError(r.error); }
    if (tab && r.handoff) tab.location.href = r.handoff;
    router.push(`/order/${r.number}${channel === "sms" ? "?sms=1" : ""}`);
  }

  if (!shares.length || !methods.length || !channels.length) return <p className="rounded-2xl bg-white p-6">Reservations aren&rsquo;t available right now. Please call us.</p>;
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-6 text-sm font-medium shadow-lg">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>First name<input name="first" required autoComplete="given-name" className={input} /></label>
        <label>Last name<input name="last" required autoComplete="family-name" className={input} /></label>
        <label>Phone<input name="phone" type="tel" required autoComplete="tel" className={input} /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" className={input} /></label>
      </div>
      <label>Which share?
        <select name="shareId" defaultValue={initial} className={input}>{shares.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
      </label>
      <label>Delivery ZIP <span className="font-normal text-slate-500">so we can quote timing</span><input name="zip" required autoComplete="postal-code" className={input} /></label>
      <label>Preferred payment method
        <select name="methodId" className={input}>{methods.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
      </label>
      {channels.length > 1 && (
        <fieldset>
          <legend>Send my reservation by</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {channels.map((c) => (
              <label key={c} className="cursor-pointer">
                <input type="radio" name="ch" className="peer sr-only" checked={channel === c} onChange={() => setChannel(c)} />
                <span className="inline-flex min-h-11 items-center rounded-full border border-stone-300 px-4 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary">{LABEL[c]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label>Anything else? <span className="font-normal text-slate-500">optional</span><textarea name="notes" rows={3} placeholder="Cut preferences, timing, questions…" className={input} /></label>
      {error && <p role="alert" className="font-semibold text-red-600">{error}</p>}
      <div>
        <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-semibold text-white shadow-lg shadow-primary/25 disabled:opacity-50">{busy ? "Sending…" : "Send my reservation"}</button>
        <p className="mt-3 text-xs font-normal text-slate-500">We reply within 24 hours. We never share your details.</p>
      </div>
    </form>
  );
}
