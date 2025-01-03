import { pgTable, text, jsonb } from "drizzle-orm/pg-core";
import { users } from "./auth";

type JobOutputLocation = {
  bucket: string;
  key: string;
};

export const jobs = pgTable("jobs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  output: jsonb("output").notNull().$type<JobOutputLocation>(),
});
