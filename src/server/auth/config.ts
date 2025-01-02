import { DrizzleAdapter } from ".pnpm/@auth+drizzle-adapter@1.7.4/node_modules/@auth/drizzle-adapter";
import GitHub from "next-auth/providers/github";
import { type DefaultSession, type NextAuthConfig } from "next-auth";

import { db } from "~/server/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "~/server/db/schemas/auth";

import { env } from "~/env";

/**
 * We can use TypeScript module augmentation to add custom properties to the
 * any auth.js interfaces.
 *
 * @see https://authjs.dev/getting-started/typescript
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {} & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
} satisfies NextAuthConfig;
