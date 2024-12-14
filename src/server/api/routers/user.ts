/**
 * Responsible for handling functions related to retreiving user date
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { signIn } from "~/server/auth";

export const userRouter = createTRPCRouter({
  getName: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user.name;
  }),
  login: publicProcedure
    .input(
      z.object({
        method: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const method = input.method;

      await signIn(method, { redirect: false });
    }),
});
