import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// --- BetterAuth tables ---
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- Store tables (money in cents) ---
// jsonb values are always objects ({v: ...}): neon-http re-parses bare jsonb strings on read.
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<{ v: unknown }>().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  stock: integer("stock").notNull().default(0),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  images: text("images").array().notNull().default([]),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const variants = pgTable("variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  option: text("option").notNull(), // e.g. "Size"
  value: text("value").notNull(), // e.g. "Large"
  priceDeltaCents: integer("price_delta_cents").notNull().default(0),
  stock: integer("stock").notNull().default(0),
});

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  instructions: text("instructions").notNull().default(""),
  enabled: boolean("enabled").notNull().default(true),
});

export type OrderItem = { productId: number; variantId: number | null; name: string; option: string; qty: number; unitCents: number };
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  notes: text("notes").notNull().default(""),
  items: jsonb("items").$type<{ v: OrderItem[] }>().notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("new"), // new|confirmed|paid|shipped|completed|cancelled
  paymentMethod: text("payment_method").notNull(),
  channel: text("channel").notNull(), // email|whatsapp|sms
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// A reservable beef/pork share. Prices in cents; weights are free text ("80-90 lbs").
export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull().default("beef"), // beef|pork
  badge: text("badge").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  blurb: text("blurb").notNull().default(""),
  who: text("who").notNull().default(""),
  hangingWeight: text("hanging_weight").notNull().default(""),
  packagedYield: text("packaged_yield").notNull().default(""),
  freezerSpace: text("freezer_space").notNull().default(""),
  cuts: text("cuts").notNull().default(""),
  detailHeading: text("detail_heading").notNull().default(""),
  detailIntro: text("detail_intro").notNull().default(""),
  chartCaption: text("chart_caption").notNull().default(""),
  chart: text("chart"),
  photo: text("photo"),
  position: integer("position").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  quote: text("quote").notNull(),
  photo: text("photo"),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  cover: text("cover"),
  layout: text("layout").notNull().default("classic"), // classic|grid|magazine
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
