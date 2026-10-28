"use client";
import { useState } from "react";

// Saves immediately: optimistic update, rolled back if the action throws.
export function InstantSwitch({ id, enabled, label, action }: { id: number; enabled: boolean; label: string; action: (id: number, on: boolean) => Promise<void> }) {
  const [on, setOn] = useState(enabled);
  async function flip() {
    const next = !on;
    setOn(next);
    try { await action(id, next); } catch { setOn(!next); }
  }
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={flip}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-slate-300"}`}>
      <span className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}
