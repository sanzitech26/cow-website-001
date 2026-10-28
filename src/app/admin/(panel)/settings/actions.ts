"use server";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { DEFAULTS, getSettings, saveSettings, type Settings } from "@/lib/settings";
import { sendMailStrict } from "@/lib/notify";

function parse(fd: FormData): Partial<Settings> {
  const out: Record<string, unknown> = {};
  for (const [k, d] of Object.entries(DEFAULTS)) out[k] = typeof d === "boolean" ? fd.get(k) === "on" : String(fd.get(k) ?? "").trim();
  return out as Partial<Settings>;
}

export async function save(fd: FormData) {
  await requireAdmin();
  await saveSettings(parse(fd));
  redirect("/admin/settings?msg=Settings+saved.");
}

export async function testDiscord(fd: FormData) {
  await requireAdmin();
  const hook = String(fd.get("discordWebhook") ?? "").trim();
  let msg = "Test message sent to Discord.";
  try {
    const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: "Test from your store admin ✅" }) });
    if (!r.ok) msg = `Discord rejected it (${r.status}).`;
  } catch { msg = "Could not reach that webhook URL."; }
  redirect(`/admin/settings?msg=${encodeURIComponent(msg)}`);
}

export async function testEmail(fd: FormData) {
  await requireAdmin();
  const s = { ...(await getSettings()), ...parse(fd) };
  const to = s.notifyEmails.split(/[,\s]+/).filter(Boolean)[0] ?? s.smtpUser;
  let msg = `Test email sent to ${to}.`;
  try {
    if (!s.smtpHost || !to) throw new Error("Fill in the SMTP host and a notification recipient first.");
    await sendMailStrict(s, to, "Test email from your store", "SMTP is working.");
  } catch (e) { msg = `Email failed: ${(e as Error).message}`; }
  redirect(`/admin/settings?msg=${encodeURIComponent(msg)}`);
}
