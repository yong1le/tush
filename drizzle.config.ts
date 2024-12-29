import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    port: env.DATABASE_PORT,
    database: env.DATABASE_NAME,
    ssl: env.NODE_ENV === "development" ? false : true,
  },
} satisfies Config;
