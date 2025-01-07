import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { lambdaRouter } from "./routers/lambda";
import { s3Router } from "./routers/s3";
import { jobRouter } from "./routers/job";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => {
    return {
      health: "ok",
    };
  }),
  user: userRouter,
  lambda: lambdaRouter,
  s3: s3Router,
  job: jobRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
