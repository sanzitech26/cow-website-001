import nodemailer from "nodemailer";
import type { orders } from "@/db/schema";
import { usd } from "./money";
import type { Settings } from "./settings";

type Order = typeof orders.$inferSelect;

// brief=true omits phone/email/address: used for links rendered on the public confirmation page.
export function orderText(o: Order, s: Settings, brief = false) {
  const lines = o.items.v.map((i) => `• ${i.qty} × ${i.name}${i.option ? ` (${i.option})` : ""}: ${usd(i.unitCents * i.qty)}`);
  return [`New order ${o.number} (${s.storeName})`, ...lines, `Total: ${usd(o.totalCents)}`, `Payment: ${o.paymentMethod}`, `Name: ${o.customerName}`, ...(brief ? [`(contact details are saved with the order)`] : [`Phone: ${o.phone}`, `Email: ${o.email}`, `Address: ${o.address}`, o.notes && `Notes: ${o.notes}`])].filter(Boolean).join("\n");
}

// Notifications never fail the order: every sender swallows its own errors.
export async function notifyDiscord(s: Settings, text: string) {
  if (!s.discordWebhook) return;
  try { await fetch(s.discordWebhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text.slice(0, 1900) }) }); } catch {}
}

export async function sendMail(s: Settings, to: string[], subject: string, text: string) {
  if (!s.smtpHost || !to.length) return;
  try {
    const t = nodemailer.createTransport({ host: s.smtpHost, port: Number(s.smtpPort) || 587, secure: Number(s.smtpPort) === 465, auth: s.smtpUser ? { user: s.smtpUser, pass: s.smtpPass } : undefined });
    await t.sendMail({ from: s.smtpFrom || s.smtpUser, to, subject, text });
  } catch {}
}

// For the settings "send test" buttons: surfaces the error instead of swallowing it.
export async function sendMailStrict(s: Settings, to: string, subject: string, text: string) {
  const t = nodemailer.createTransport({ host: s.smtpHost, port: Number(s.smtpPort) || 587, secure: Number(s.smtpPort) === 465, auth: s.smtpUser ? { user: s.smtpUser, pass: s.smtpPass } : undefined });
  await t.sendMail({ from: s.smtpFrom || s.smtpUser, to, subject, text });
}
