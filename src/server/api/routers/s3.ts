import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generatePresignedUrl, s3 } from "~/server/aws/s3";
import { env } from "~/env";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

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
  generatePresignedGetUrl: publicProcedure
    .input(z.object({ bucket: z.string(), key: z.string() }))
    .mutation(async ({ input }) => {
      const url = await generatePresignedUrl("get", input.bucket, input.key);

      return {
        url: url,
      };
    }),
  checkObjectExists: publicProcedure
    .input(z.object({ bucket: z.string(), key: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await s3.send(
          new HeadObjectCommand({
            Bucket: input.bucket,
            Key: input.key,
          }),
        );
        return { exists: true };
      } catch {
        return { exists: false };
      }
    }),
});
