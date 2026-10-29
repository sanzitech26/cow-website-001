import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: "700" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { title: `${s.storeName} ${s.brandSub}`.trim(), description: s.tagline };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-slate-900">{children}</body>
    </html>
  );
}
