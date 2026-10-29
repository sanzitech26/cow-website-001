import { db } from "@/db";
import { shares } from "@/db/schema";

export const getShares = () => db.select().from(shares).orderBy(shares.position, shares.id);
export type Share = typeof shares.$inferSelect;

// Whole dollars for share prices ("$1,500"), unlike usd() which always shows cents.
export const price = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
