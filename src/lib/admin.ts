import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

// Real authorization: call on every admin page and server action (the proxy is only a fast redirect).
export async function requireAdmin() {
  const s = await auth.api.getSession({ headers: await headers() });
  if (!s) redirect("/admin/login");
  return s;
}
