import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePresignedUrl } from "~/server/aws/s3";
import { env } from "~/env";

export const s3Router = createTRPCRouter({
  generatePresignedPutUrls: publicProcedure
    .input(z.object({ count: z.number() }))
    .mutation(async ({ input }) => {
      const presignedUrls = await Promise.all(
        Array.from({ length: input.count }, async () => {
          const key = "input/" + crypto.randomUUID();
          return generatePresignedUrl("put", env.AWS_S3_BUCKET_NAME, key).then(
            (url) => ({
              url,
              key,
              bucket: env.AWS_S3_BUCKET_NAME,
            }),
          );
        }),
      );

      return presignedUrls;
    }),
});
