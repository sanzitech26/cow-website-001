"use client";
import { useState } from "react";

const COUNTRIES = [
  ["US", "United States", "1"], ["CA", "Canada", "1"], ["GB", "United Kingdom", "44"], ["CM", "Cameroon", "237"], ["NG", "Nigeria", "234"],
  ["GH", "Ghana", "233"], ["KE", "Kenya", "254"], ["ZA", "South Africa", "27"], ["IN", "India", "91"], ["AU", "Australia", "61"],
] as const;
const CODES = [...new Set(COUNTRIES.map((c) => c[2]))].sort((a, b) => b.length - a.length);

// Hidden input stores digits only (country code + national number). Pasting a full number auto-detects the country.
function split(digits: string, fallback: string) {
  const code = CODES.find((c) => digits.startsWith(c));
  const dial = code ?? fallback;
  const iso = COUNTRIES.find((c) => c[2] === dial)?.[0] ?? "US";
  return { iso: code && fallback === code ? COUNTRIES.find((c) => c[2] === fallback)![0] : iso, national: code ? digits.slice(code.length) : digits };
}

export function PhoneField({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  const init = defaultValue ? split(defaultValue, "1") : { iso: "US", national: "" };
  const [iso, setIso] = useState(init.iso);
  const [national, setNational] = useState(init.national);
  const dial = COUNTRIES.find((c) => c[0] === iso)![2];

  function onNational(raw: string) {
    const t = raw.trim();
    let d = t.replace(/\D/g, "");
    const explicit = t.startsWith("+") || t.startsWith("00") || d.length >= 11;
    if (t.startsWith("00")) d = d.slice(2);
    const hit = explicit ? CODES.find((c) => d.startsWith(c)) : undefined;
    if (hit) {
      setIso(COUNTRIES.find((c) => c[2] === hit)![0]);
      d = d.slice(hit.length);
    }
    setNational(d.replace(/^0+/, "")); // a leading local 0 is dropped
  }

  const digits = national ? dial + national : "";
  return (
    <div>
      <label className="mb-1 block text-sm font-medium" htmlFor={`${name}-n`}>{label}</label>
      <div className="flex gap-2">
        <select aria-label={`${label} country`} value={iso} onChange={(e) => setIso(e.target.value)} className="min-h-11 rounded-xl border border-sky-200 bg-white px-2">
          {COUNTRIES.map((c) => <option key={c[0]} value={c[0]}>{c[0]} +{c[2]}</option>)}
        </select>
        <input id={`${name}-n`} inputMode="tel" value={national} onChange={(e) => onNational(e.target.value)} placeholder="Phone number" className="min-h-11 min-w-0 flex-1 rounded-xl border border-sky-200 px-3" />
      </div>
      <input type="hidden" name={name} value={digits} />
      <p className="mt-1 text-xs text-slate-500">{digits ? `Customers will message +${digits}` : "Not set"}</p>
    </div>
  );
}
