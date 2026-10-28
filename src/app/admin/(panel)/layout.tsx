import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { MobileMenu } from "@/components/MobileMenu";
import { SignOutButton } from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/payments", label: "Payment methods" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/account", label: "Account" },
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-slate-200 bg-white p-4 lg:flex lg:flex-col">
        <p className="mb-4 px-3 font-heading text-lg font-bold">Admin</p>
        <nav aria-label="Admin" className="flex flex-col gap-1">
          {LINKS.map((l) => <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-sky-50">{l.label}</Link>)}
        </nav>
        <Link href="/" className="mt-4 px-3 text-sm text-slate-500">View store ↗</Link>
        <SignOutButton className="mt-auto rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50" />
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          <span className="font-heading text-lg font-bold">Admin</span>
          <MobileMenu links={LINKS}><SignOutButton className="min-h-12 w-full rounded-full border border-red-300 font-semibold text-red-600" /></MobileMenu>
        </header>
        <main className="mx-auto max-w-4xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
