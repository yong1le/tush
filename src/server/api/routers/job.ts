import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { jobs } from "~/server/db/schemas/jobs";
import { eq } from "drizzle-orm";
import { ImageFormat, JobType, UpscaleFactor } from "~/types";

export const jobRouter = createTRPCRouter({
  createJob: protectedProcedure
    .input(
      z.object({
        bucket: z.string(),
        key: z.string(),
        options: z.union([
          z.object({ format: z.nativeEnum(ImageFormat) }),
          z.object({ scale: z.nativeEnum(UpscaleFactor) }),
        ]),
        type: z.nativeEnum(JobType),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .insert(jobs)
        .values({
          userId: ctx.session.user.id!,
          jobType: input.type,
          options: input.options,
          output: {
            bucket: input.bucket,
            key: input.key,
          },
        })
        .execute();
    }),
  getUserJobs: protectedProcedure.query(async ({ ctx }) => {
    const user_id = ctx.session.user.id!;
    const res = await ctx.db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, user_id));

    return {
      jobs: res,
    };
  }),
});
