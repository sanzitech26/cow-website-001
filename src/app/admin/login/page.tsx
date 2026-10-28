"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    const f = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) { setBusy(false); return setError("Wrong email or password."); }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-sky-50 p-5">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl bg-white p-7 shadow-xl">
        <h1 className="text-3xl font-bold">Admin login</h1>
        <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="username" className="mt-1 w-full min-h-11 rounded-xl border border-sky-200 px-3" /></label>
        <label className="block text-sm font-medium">Password<input name="password" type="password" required autoComplete="current-password" className="mt-1 w-full min-h-11 rounded-xl border border-sky-200 px-3" /></label>
        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="min-h-12 w-full rounded-full bg-primary font-semibold text-white disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
