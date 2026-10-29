import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { MobileMenu } from "@/components/MobileMenu";
import { LiveChat } from "@/components/LiveChat";

export const dynamic = "force-dynamic"; // all pages read the DB

// ponytail: Shop, Blog, FAQs, Contact and the cart still exist at their URLs, just not linked until the owner decides.
const LINKS = [
  { href: "/", label: "Home & Shares" },
  { href: "/our-beef", label: "Our Beef" },
  { href: "/our-story", label: "Our Story" },
  { href: "/reserve", label: "Reserve" },
];

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const tel = s.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      {s.banner && <div className="bg-bar px-4 py-2 text-center text-xs text-white sm:text-sm">{s.banner}{tel && <> · <a href={`tel:${tel}`} className="font-semibold">{s.phone}</a></>}</div>}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center gap-3 px-5">
          <Link href="/" className="mr-auto leading-tight">
            <span className="block font-heading text-lg font-bold">{s.storeName}</span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-ember">{s.brandSub}</span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium hover:text-primary">{l.label}</Link>)}
          </nav>
          {tel && <a href={`tel:${tel}`} className="hidden min-h-10 items-center rounded-full border border-primary px-4 text-sm font-semibold text-primary lg:inline-flex">☎ {s.phone}</a>}
          <MobileMenu links={LINKS}>
            {tel && <a href={`tel:${tel}`} className="flex min-h-12 items-center justify-center rounded-full bg-primary font-semibold text-white">Call {s.phone}</a>}
          </MobileMenu>
        </div>
      </header>

      <main id="main" className="flex-1 pb-16 lg:pb-0">{children}</main>

      <footer className="bg-[#1c1917] text-stone-300">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:grid-cols-[minmax(0,1.3fr)_repeat(2,minmax(0,1fr))]">
          <div>
            <p className="font-heading text-lg font-bold text-white">{s.storeName} {s.brandSub}</p>
            <p className="mt-2 text-sm">{s.tagline}</p>
            {s.facebook && <a href={s.facebook} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-amber-200 underline">Facebook</a>}
          </div>
          <div>
            <p className="mb-2 font-heading font-bold text-white">Pages</p>
            <ul className="space-y-1.5 text-sm text-amber-200">{LINKS.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <p className="mb-2 font-heading font-bold text-white">Get in touch</p>
            <ul className="space-y-1.5 text-sm">
              {s.phone && <li><a href={`tel:${tel}`} className="text-amber-200">{s.phone}</a></li>}
              {s.email && <li><a href={`mailto:${s.email}`} className="text-amber-200">{s.email}</a></li>}
              {s.address && <li className="whitespace-pre-line">{s.address}</li>}
              {s.farmNote && <li>{s.farmNote}</li>}
            </ul>
          </div>
        </div>
        <p className="mx-auto max-w-5xl border-t border-stone-700 px-5 py-4 text-xs text-stone-400">© {new Date().getFullYear()} {s.storeName} {s.brandSub}. · <Link href="/privacy" className="text-amber-200 underline">Privacy</Link></p>
      </footer>

      {/* Sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-stone-200 bg-cream/95 p-2 backdrop-blur lg:hidden">
        {tel && <a href={`tel:${tel}`} className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-primary font-semibold text-primary">Call</a>}
        <Link href="/reserve" className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-primary font-semibold text-white">Reserve</Link>
      </div>

      {s.whatsappFloating && s.whatsapp && (
        <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-20 right-4 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg lg:bottom-6">💬</a>
      )}
      {s.liveChatOn && s.liveChat && <LiveChat snippet={s.liveChat} />}
    </>
  );
}
