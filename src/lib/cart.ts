"use client";
import { useSyncExternalStore } from "react";

export type CartLine = { productId: number; variantId: number | null; qty: number };
const KEY = "cart";
let cache = "[]";

const read = () => {
  try { return localStorage.getItem(KEY) ?? "[]"; } catch { return "[]"; }
};
const subscribe = (cb: () => void) => {
  window.addEventListener("cart", cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener("cart", cb); window.removeEventListener("storage", cb); };
};
const snapshot = () => { cache = read(); return cache; };

export function useCart(): CartLine[] {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  return JSON.parse(raw);
}
export function setCart(lines: CartLine[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  window.dispatchEvent(new Event("cart"));
}
export function addToCart(l: CartLine) {
  const lines = JSON.parse(read()) as CartLine[];
  const hit = lines.find((x) => x.productId === l.productId && x.variantId === l.variantId);
  if (hit) hit.qty += l.qty; else lines.push(l);
  setCart(lines);
}
export const clearCart = () => setCart([]);
