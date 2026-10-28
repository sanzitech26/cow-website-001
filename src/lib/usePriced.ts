"use client";
import { useEffect, useState } from "react";
import { priceCartAction } from "@/app/(store)/checkout/actions";
import { useCart } from "./cart";
import type { Priced } from "./pricing";

export function usePriced() {
  const lines = useCart();
  const key = JSON.stringify(lines);
  const [data, setData] = useState<{ key: string; items: Priced[]; total: number; ok: boolean } | null>(null);
  useEffect(() => {
    if (!lines.length) return;
    let live = true;
    priceCartAction(lines).then((r) => live && setData({ key, ...r }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const fresh = lines.length > 0 && data?.key === key;
  return { lines, loading: lines.length > 0 && !fresh, items: fresh ? data!.items : [], total: fresh ? data!.total : 0, ok: fresh ? data!.ok : false };
}
