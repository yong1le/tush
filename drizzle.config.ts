import { type Config } from ".pnpm/drizzle-kit@0.24.2/node_modules/drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: env.NODE_ENV === "development" ? false : true,
  },
} satisfies Config;
