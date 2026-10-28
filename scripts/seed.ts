import "dotenv/config";
import { db } from "../src/db";
import * as s from "../src/db/schema";
import { makeAuth } from "../src/lib/auth";
import { saveSettings } from "../src/lib/settings";
import { eq } from "drizzle-orm";
import { photo, P } from "../src/lib/photos";

const im = (id: string) => photo(id, 900);

async function main() {
  // Admin (sign-up is disabled in the app; this script uses a sign-up-enabled instance).
  const email = process.env.ADMIN_EMAIL!;
  if (!(await db.select().from(s.user).where(eq(s.user.email, email))).length)
    await makeAuth(true).api.signUpEmail({ body: { email, password: process.env.ADMIN_PASSWORD!, name: "Admin" } });

  if ((await db.select().from(s.categories)).length) return console.log("demo data exists, admin ensured");

  await saveSettings({ phone: "(555) 010-2030", email: "hello@example.com", address: "123 Pasture Lane, Thomasville, GA" });

  const cats = await db.insert(s.categories).values([
    { slug: "live-cattle", name: "Live Cattle" },
    { slug: "beef-shares", name: "Beef & Pork Shares" },
    { slug: "dairy", name: "Dairy" },
    { slug: "merch", name: "Merch" },
    { slug: "farm-supplies", name: "Farm Supplies" },
  ]).returning();
  const c = (slug: string) => cats.find((x) => x.slug === slug)!.id;

  const prods = [
    { slug: "holstein-heifer", name: "Holstein Heifer", description: "Healthy, pasture-raised Holstein heifer, vaccinated and ready for her new home.", priceCents: 185000, stock: 6, categoryId: c("live-cattle"), images: [im(P.cowField), im(P.cowsHill)],
      v: [["Age", "12 months", 0, 3], ["Age", "18 months", 25000, 3]] },
    { slug: "jersey-cow", name: "Jersey Dairy Cow", description: "Gentle Jersey with rich, creamy milk. Great for a family homestead.", priceCents: 240000, stock: 3, categoryId: c("live-cattle"), images: [im(P.jersey)], v: [] },
    { slug: "quarter-beef-share", name: "Quarter Beef Share", description: "Grass-fed, grass-finished. About 100 lbs of mixed cuts, vacuum-sealed and flash-frozen.", priceCents: 100000, stock: 12, categoryId: c("beef-shares"), images: [im(P.steak), im(P.herdSunset)], v: [] },
    { slug: "half-beef-share", name: "Half Beef Share", description: "Our most popular share. About 200 lbs, custom cut to your order.", priceCents: 150000, stock: 8, categoryId: c("beef-shares"), images: [im(P.herdSunset)], v: [] },
    { slug: "half-pig-share", name: "Half Pig Share", description: "Pasture-raised pork: chops, roasts, bacon and sausage.", priceCents: 50000, stock: 5, categoryId: c("beef-shares"), images: [im(P.pig)], v: [] },
    { slug: "fresh-whole-milk", name: "Fresh Whole Milk", description: "Creamy farm-fresh whole milk, bottled the day it's milked.", priceCents: 800, stock: 60, categoryId: c("dairy"), images: [im(P.milk)],
      v: [["Size", "Half gallon", 0, 30], ["Size", "Gallon", 700, 30]] },
    { slug: "aged-farmhouse-cheese", name: "Aged Farmhouse Cheese", description: "Hand-made wheel aged for six months.", priceCents: 1800, stock: 25, categoryId: c("dairy"), images: [im(P.cheese)], v: [] },
    { slug: "cow-print-tote", name: "Cow Print Tote Bag", description: "Sturdy canvas tote with our signature spots.", priceCents: 2200, stock: 40, categoryId: c("merch"), images: [im(P.cowNose)], v: [] },
    { slug: "pasture-mineral-mix", name: "Pasture Mineral Mix", description: "Balanced loose mineral for grazing cattle.", priceCents: 4200, stock: 30, categoryId: c("farm-supplies"), images: [im(P.crops)],
      v: [["Bag", "25 lb", 0, 15], ["Bag", "50 lb", 3500, 15]] },
  ];
  for (const { v, ...p } of prods) {
    const [row] = await db.insert(s.products).values(p).returning();
    if (v.length) await db.insert(s.variants).values(v.map(([option, value, d, stock]) => ({ productId: row.id, option: option as string, value: value as string, priceDeltaCents: d as number, stock: stock as number })));
  }

  await db.insert(s.paymentMethods).values([
    { name: "Bank transfer", instructions: "We'll message you our bank details. Your order is held for 48 hours while we wait for the transfer." },
    { name: "Cash on delivery", instructions: "Pay in cash when your order is delivered or picked up." },
  ]);
  await db.insert(s.faqs).values([
    { question: "How does ordering work?", answer: "Pick your items, choose a payment method, and send us your order by email, WhatsApp or text. We reply with payment details." },
    { question: "Do you ship nationwide?", answer: "Meat and dairy ship in insulated packaging. Live cattle are pickup or arranged delivery." },
    { question: "Can I visit the farm?", answer: "Yes, by appointment. Contact us to book a time." },
  ]);
  await db.insert(s.testimonials).values([
    { name: "Sarah M.", quote: "The best beef we've ever had. Our freezer is stocked for the year." },
    { name: "James T.", quote: "Healthy heifers and honest people. Delivery was smooth." },
    { name: "Priya K.", quote: "The milk tastes like childhood. We order every week." },
  ]);
  await db.insert(s.posts).values({ slug: "why-grass-fed", title: "Why grass-fed beef tastes better", excerpt: "What 90 days on pasture changes.", body: "Cattle raised on pasture grow slowly and develop a deeper, cleaner flavor.\n\nHere is what we do differently on our farm.", cover: im(P.herdSunset), layout: "classic" });
  console.log("seeded");
}
main();
