import { getSettings } from "@/lib/settings";

export default async function Privacy() {
  const s = await getSettings();
  return (
    <div className="mx-auto max-w-2xl space-y-4 px-5 py-12 text-slate-700">
      <h1 className="text-4xl font-bold">Privacy</h1>
      <p>When you place an order, {s.storeName} stores your name, phone, email, delivery address and order so we can fulfil it.</p>
      <p>We never take card details on this site. We use your details only to process your order and to contact you about it, and we don&rsquo;t sell them.</p>
      <p>To have your details removed, contact us{s.email && <> at {s.email}</>}.</p>
    </div>
  );
}
