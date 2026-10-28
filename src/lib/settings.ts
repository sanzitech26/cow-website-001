import { db } from "@/db";
import { settings } from "@/db/schema";
import { sql } from "drizzle-orm";

// Adding a setting = adding a key here.
export const DEFAULTS = {
  storeName: "Meadowbrook Cattle Co.",
  tagline: "Cattle, dairy, beef & farm goods, straight from the pasture",
  banner: "Free local delivery on orders over $100",
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
