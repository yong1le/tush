import { betterAuth } from "better-auth";
import { db } from "~/server/db/index";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "~/server/db/schemas/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
