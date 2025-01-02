import { drizzle } from "drizzle-orm/postgres-js";
import postgres from ".pnpm/postgres@3.4.5/node_modules/postgres";

import { env } from "~/env";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDb.conn ??
  postgres(env.DATABASE_URL, {
    ssl: env.NODE_ENV === "development" ? false : true,
  });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn);
