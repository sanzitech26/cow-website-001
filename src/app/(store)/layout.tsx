import Link from "next/link";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { MobileMenu } from "@/components/MobileMenu";
import { CartLink } from "@/components/CartLink";
import { LiveChat } from "@/components/LiveChat";

export const dynamic = "force-dynamic"; // all pages read the DB

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faqs", label: "FAQs" },
  { href: "/contact", label: "Contact" },
];

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [s, cats] = await Promise.all([getSettings(), db.select().from(categories)]);
  const tel = s.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      {s.banner && <div className="bg-primary px-4 py-2 text-center text-sm text-white">{s.banner}{tel && <> · <a href={`tel:${tel}`} className="font-semibold">{s.phone}</a></>}</div>}
      <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-3 px-5">
          <Link href="/" className="mr-auto font-heading text-lg font-bold leading-tight">{s.storeName}</Link>
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-semibold hover:text-primary">{l.label}</Link>)}
          </nav>
          <CartLink />
          <MobileMenu links={LINKS}>
            {tel && <a href={`tel:${tel}`} className="flex min-h-12 items-center justify-center rounded-full bg-primary font-semibold text-white">Call {s.phone}</a>}
          </MobileMenu>
        </div>
      </header>

      <main id="main" className="flex-1 pb-16 lg:pb-0">{children}</main>

      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
          <div>
            <p className="font-heading text-xl font-bold text-white">{s.storeName}</p>
            <p className="mt-2 text-sm">{s.tagline}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Shop</p>
            <ul className="space-y-1 text-sm">{cats.map((c) => <li key={c.id}><Link href={`/shop?category=${c.slug}`}>{c.name}</Link></li>)}</ul>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Get in touch</p>
            <ul className="space-y-1 text-sm">
              {s.phone && <li><a href={`tel:${tel}`}>{s.phone}</a></li>}
              {s.email && <li><a href={`mailto:${s.email}`}>{s.email}</a></li>}
              {s.address && <li>{s.address}</li>}
              <li><Link href="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <p className="border-t border-slate-800 py-4 text-center text-xs">© {new Date().getFullYear()} {s.storeName}</p>
      </footer>

      {/* Sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-sky-100 bg-white/95 p-2 backdrop-blur lg:hidden">
        {tel && <a href={`tel:${tel}`} className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-primary font-semibold text-primary">Call</a>}
        <Link href="/shop" className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-primary font-semibold text-white">Shop now</Link>
      </div>

      {s.whatsappFloating && s.whatsapp && (
        <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-20 right-4 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg lg:bottom-6">💬</a>
      )}
      {s.liveChatOn && s.liveChat && <LiveChat snippet={s.liveChat} />}
    </>
  );
}
