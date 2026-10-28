"use client";
import { useEffect } from "react";

// innerHTML scripts don't execute, so rebuild each node from the provider snippet.
export function LiveChat({ snippet }: { snippet: string }) {
  useEffect(() => {
    const t = document.createElement("template");
    t.innerHTML = snippet;
    const added: Node[] = [];
    t.content.childNodes.forEach((n) => {
      let el: Node = n;
      if (n instanceof HTMLScriptElement) {
        el = document.createElement("script");
        for (const a of n.attributes) (el as HTMLScriptElement).setAttribute(a.name, a.value);
        (el as HTMLScriptElement).text = n.text;
      }
      document.body.appendChild(el);
      added.push(el);
    });
    return () => added.forEach((n) => n.parentNode?.removeChild(n));
  }, [snippet]);
  return null;
}
