/**
 * Responsible for handling functions related to retreiving user date
 */

import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure.query(({ ctx }) => {
    if (!ctx.session) {
      return null;
    }
    return ctx.session.user;
  }),
});
