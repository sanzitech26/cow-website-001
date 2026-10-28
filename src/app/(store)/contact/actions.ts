"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSettings } from "@/lib/settings";
import { notifyDiscord, sendMail } from "@/lib/notify";

const Msg = z.object({ name: z.string().trim().min(1).max(100), email: z.string().trim().email().max(200), message: z.string().trim().min(1).max(3000) });

export async function sendContact(fd: FormData) {
  const m = Msg.safeParse(Object.fromEntries(fd));
  if (!m.success) redirect("/contact");
  const s = await getSettings();
  const text = `Contact form\nFrom: ${m.data.name} <${m.data.email}>\n\n${m.data.message}`;
  await Promise.all([notifyDiscord(s, text), sendMail(s, s.notifyEmails.split(/[,\s]+/).filter(Boolean), `Message from ${m.data.name}`, text)]);
  redirect("/contact?sent=1");
}
