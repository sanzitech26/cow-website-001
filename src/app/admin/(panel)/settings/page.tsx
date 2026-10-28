import { getSettings } from "@/lib/settings";
import { FormSwitch } from "@/components/FormSwitch";
import { PhoneField } from "@/components/PhoneField";
import { card, inp, btn, btn2 } from "@/lib/ui";
import { save, testDiscord, testEmail } from "./actions";

function T({ name, label, v, type = "text", area }: { name: string; label: string; v: string; type?: string; area?: boolean }) {
  return (
    <label className="block text-sm font-medium">{label}
      {area ? <textarea name={name} defaultValue={v} rows={3} className={`${inp} mt-1`} /> : <input name={name} type={type} defaultValue={v} autoComplete="off" className={`${inp} mt-1`} />}
    </label>
  );
}

export default async function Settings({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const [s, { msg }] = await Promise.all([getSettings(), searchParams]);
  return (
    <form action={save} className="space-y-6 pb-24">
      <h1 className="text-3xl font-bold">Settings</h1>

      <section className={`${card} space-y-3`}>
        <h2 className="text-xl font-bold">Store</h2>
        <T name="storeName" label="Store name" v={s.storeName} />
        <T name="tagline" label="Tagline" v={s.tagline} />
        <T name="banner" label="Announcement banner (empty hides it)" v={s.banner} />
        <T name="phone" label="Phone" v={s.phone} />
        <T name="email" label="Public email" v={s.email} type="email" />
        <T name="address" label="Store address" v={s.address} />
        <FormSwitch name="showMap" label="Show map on contact page" hint="Needs an address" defaultChecked={s.showMap} />
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="text-xl font-bold">Ordering</h2>
        <FormSwitch name="orderByEmail" label="Let customers order by email" defaultChecked={s.orderByEmail} />
        <PhoneField name="whatsapp" label="WhatsApp number" defaultValue={s.whatsapp} />
        <FormSwitch name="orderByWhatsapp" label="Let customers order by WhatsApp" defaultChecked={s.orderByWhatsapp} />
        <FormSwitch name="whatsappFloating" label="Floating WhatsApp button" defaultChecked={s.whatsappFloating} />
        <PhoneField name="sms" label="Text message (SMS) number" defaultValue={s.sms} />
        <FormSwitch name="orderBySms" label="Let customers order by text" defaultChecked={s.orderBySms} />
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="text-xl font-bold">Live chat</h2>
        <T name="liveChat" label="Provider snippet" v={s.liveChat} area />
        <FormSwitch name="liveChatOn" label="Show live chat" defaultChecked={s.liveChatOn} />
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="text-xl font-bold">Discord</h2>
        <T name="discordWebhook" label="Webhook URL" v={s.discordWebhook} />
        <button formAction={testDiscord} className={btn2}>Send test</button>
      </section>

      <section className={`${card} space-y-3`}>
        <h2 className="text-xl font-bold">Email (SMTP)</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <T name="smtpHost" label="Host" v={s.smtpHost} />
          <T name="smtpPort" label="Port" v={s.smtpPort} />
          <T name="smtpUser" label="User" v={s.smtpUser} />
          <T name="smtpPass" label="Password" v={s.smtpPass} type="password" />
        </div>
        <T name="smtpFrom" label="From address" v={s.smtpFrom} />
        <T name="notifyEmails" label="Notification recipients (comma separated)" v={s.notifyEmails} />
        <button formAction={testEmail} className={btn2}>Send test email</button>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-end gap-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
        {msg && <p role="status" className="mr-auto text-sm font-semibold text-emerald-700">{msg}</p>}
        <button type="submit" className={btn}>Save settings</button>
      </div>
    </form>
  );
}
