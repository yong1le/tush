import { betterAuth } from "better-auth";
import { db } from "../db/index";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./schemas/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
