"use client";
import { useEffect } from "react";

// Arriving at /our-beef#share-3 opens that share's cut list and scrolls to it.
export function OpenOnHash() {
  useEffect(() => {
    const open = () => {
      const el = document.getElementById(location.hash.slice(1));
      if (!el) return;
      el.querySelector("details")?.setAttribute("open", "");
      el.scrollIntoView({ block: "center" });
    };
    open();
    addEventListener("hashchange", open);
    return () => removeEventListener("hashchange", open);
  }, []);
  return null;
}
