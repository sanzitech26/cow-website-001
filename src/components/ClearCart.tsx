"use client";
import { useState } from "react";
import { clearCart } from "@/lib/cart";

// Two-step inline confirm (no window.confirm, which blocks automation and some in-app browsers).
export function ClearCart() {
  const [ask, setAsk] = useState(false);
  return ask ? (
    <span className="inline-flex items-center gap-2 text-sm">
      Clear everything?
      <button type="button" onClick={() => { clearCart(); setAsk(false); }} className="font-semibold text-red-600">Yes, clear</button>
      <button type="button" onClick={() => setAsk(false)} className="font-semibold">Cancel</button>
    </span>
  ) : (
    <button type="button" onClick={() => setAsk(true)} className="text-sm font-semibold text-red-600 underline">Clear cart</button>
  );
}
