import { eq } from "drizzle-orm";
import { db } from "@/db";
import { paymentMethods } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function Checkout() {
  const [s, methods] = await Promise.all([getSettings(), db.select().from(paymentMethods).where(eq(paymentMethods.enabled, true)).orderBy(paymentMethods.id)]);
  const channels = ([s.orderByEmail && "email", s.orderByWhatsapp && s.whatsapp && "whatsapp", s.orderBySms && s.sms && "sms"] as const).filter(Boolean) as ("email" | "whatsapp" | "sms")[];
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="mb-8 text-4xl font-bold">Checkout</h1>
      <CheckoutForm methods={methods} channels={channels} />
    </div>
  );
}
