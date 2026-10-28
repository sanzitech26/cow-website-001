"use client";
import { useEffect } from "react";

// Best-effort: opens the customer's messaging app once on arrival. The visible button remains the fallback.
export function AutoOpen({ href }: { href: string }) {
  useEffect(() => {
    const a = document.createElement("a");
    a.href = href;
    a.click();
  }, [href]);
  return null;
}
