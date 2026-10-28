import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const makeAuth = (signUp: boolean) =>
  betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    emailAndPassword: { enabled: true, disableSignUp: !signUp },
    plugins: [nextCookies()],
  });

export const auth = makeAuth(false); // admin is created by scripts/seed.ts only
