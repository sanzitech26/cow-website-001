import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { APIError } from "better-auth/api";
import { db } from "@/db";
import { account, user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { btn, card, inp } from "@/lib/ui";

// Both changes require the current password: we verify it by attempting a sign-in.
async function verify(email: string, password: string) {
  try { await auth.api.signInEmail({ body: { email, password } }); return true; } catch (e) { if (e instanceof APIError) return false; throw e; }
}

async function changeEmail(fd: FormData) {
  "use server";
  const { user: u } = await requireAdmin();
  const next = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!next.includes("@")) redirect("/admin/account?msg=Enter+a+valid+email.");
  if (!(await verify(u.email, String(fd.get("current"))))) redirect("/admin/account?msg=Current+password+is+wrong.");
  await db.update(user).set({ email: next }).where(eq(user.id, u.id));
  await db.update(account).set({ accountId: u.id }).where(eq(account.userId, u.id)); // credential account is keyed by user id
  redirect("/admin/account?msg=Email+updated.");
}

async function changePassword(fd: FormData) {
  "use server";
  const { user: u } = await requireAdmin();
  const next = String(fd.get("next") ?? "");
  if (next.length < 8) redirect("/admin/account?msg=New+password+needs+at+least+8+characters.");
  if (!(await verify(u.email, String(fd.get("current"))))) redirect("/admin/account?msg=Current+password+is+wrong.");
  // no revokeOtherSessions: it logs this admin out
  await auth.api.changePassword({ body: { currentPassword: String(fd.get("current")), newPassword: next }, headers: await headers() });
  redirect("/admin/account?msg=Password+updated.");
}

export default async function Account({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const [{ user: u }, { msg }] = await Promise.all([requireAdmin(), searchParams]);
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">Account</h1>
      {msg && <p role="status" className="rounded-xl bg-sky-50 p-3 text-sm font-semibold">{msg}</p>}
      <form action={changeEmail} className={`${card} space-y-3`}>
        <h2 className="text-xl font-bold">Login email</h2>
        <input name="email" type="email" required defaultValue={u.email} aria-label="New email" className={inp} />
        <input name="current" type="password" required placeholder="Current password" aria-label="Current password" autoComplete="current-password" className={inp} />
        <button className={btn}>Change email</button>
      </form>
      <form action={changePassword} className={`${card} space-y-3`}>
        <h2 className="text-xl font-bold">Password</h2>
        <input name="current" type="password" required placeholder="Current password" aria-label="Current password" autoComplete="current-password" className={inp} />
        <input name="next" type="password" required minLength={8} placeholder="New password" aria-label="New password" autoComplete="new-password" className={inp} />
        <button className={btn}>Change password</button>
      </form>
    </div>
  );
}
