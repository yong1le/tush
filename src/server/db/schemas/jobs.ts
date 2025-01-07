import { pgTable, text, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { type JobOptions, type FileLocation, JobType } from "~/types";

export const jobTypeEnum = pgEnum(
  "job_type",
  Object.values(JobType) as [JobType, ...JobType[]],
);
export const jobs = pgTable("jobs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  jobType: jobTypeEnum("job_type").notNull().default(JobType.CONVERT),
  options: jsonb("options").notNull().$type<JobOptions>(),
  output: jsonb("output").notNull().$type<FileLocation>(),
});
