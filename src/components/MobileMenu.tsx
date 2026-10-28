"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

type L = { href: string; label: string };

// Drawer is portaled to <body>: a sticky header with backdrop-blur traps position:fixed children.
export function MobileMenu({ links, children }: { links: L[]; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-xl border border-slate-200 lg:hidden">
        <span className="relative block h-0.5 w-5 bg-current before:absolute before:-top-1.5 before:h-0.5 before:w-5 before:bg-current after:absolute after:top-1.5 after:h-0.5 after:w-5 after:bg-current" />
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <nav aria-label="Menu" className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-white p-5 shadow-2xl">
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="mb-4 ml-auto grid size-11 place-items-center rounded-xl border border-slate-200 text-xl">×</button>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={path === l.href ? "page" : undefined}
                className="flex min-h-14 items-center border-b border-slate-100 text-lg font-semibold aria-[current]:text-primary">{l.label}</Link>
            ))}
            <div className="mt-auto pt-6" onClick={() => setOpen(false)}>{children}</div>
          </nav>
        </div>,
        document.body,
      )}
    </>
  );
}
