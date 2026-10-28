import { randomBytes } from "crypto";

export const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || randomBytes(3).toString("hex");
export const cents = (v: FormDataEntryValue | null) => Math.round((parseFloat(String(v ?? "0")) || 0) * 100);
