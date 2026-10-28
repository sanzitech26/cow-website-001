"use client";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartLink() {
  const n = useCart().reduce((a, l) => a + l.qty, 0);
  return (
    <Link href="/cart" aria-label={`Cart, ${n} items`} className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-primary px-4 text-sm font-semibold text-primary">
      Cart
      {n > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-xs text-white">{n}</span>}
    </Link>
  );
}
