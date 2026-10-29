import { db } from "@/db";
import { settings } from "@/db/schema";
import { sql } from "drizzle-orm";

// Adding a setting = adding a key here.
export const DEFAULTS = {
  storeName: "Anord's",
  brandSub: "Grass Fed Beef Shares",
  tagline: "A family tradition since 1998. 100% grass fed and grass finished beef, shipped from our family's pasture to your freezer.",
  heroEyebrow: "Thomasville, Georgia · Since 1998",
  founder: "Anord",
  banner: "Free shipping on every share",
  farmNote: "Farm visits by appointment",
  copyNote: "A family tradition since 1998.",
  facebook: "",
  freezerNote: "Roughly one cubic foot per 35–40 lbs of vacuum-packed meat.",
  shipNote: "Shipping is included on every share, anywhere in the US. Most orders leave within 1–4 business days and arrive 1–3 business days later.",
  phone: "",
  email: "",
  address: "",
  showMap: false,
  whatsapp: "",
  whatsappFloating: false,
  orderByWhatsapp: true,
  sms: "",
  orderBySms: true,
  orderByEmail: true,
  liveChat: "",
  liveChatOn: false,
  discordWebhook: "",
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  smtpFrom: "",
  notifyEmails: "",
};
export type Settings = typeof DEFAULTS;

export async function getSettings(): Promise<Settings> {
  const rows = await db.select().from(settings);
  const out: Record<string, unknown> = { ...DEFAULTS };
  for (const r of rows) if (r.key in DEFAULTS) out[r.key] = r.value.v;
  return out as Settings;
}

export async function saveSettings(values: Partial<Settings>) {
  const rows = Object.entries(values).map(([key, v]) => ({ key, value: { v } }));
  if (!rows.length) return;
  await db.insert(settings).values(rows).onConflictDoUpdate({ target: settings.key, set: { value: sql`excluded.value` } });
}
