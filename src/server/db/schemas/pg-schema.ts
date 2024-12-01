import { pgSchema } from "drizzle-orm/pg-core";

import { env } from "~/env";

// Postgres databases are organized in DB -> Schema (Folder) -> Table
export const tushSchema = pgSchema(env.DATABASE_SCHEMA);
