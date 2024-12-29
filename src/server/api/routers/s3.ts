import { s3 } from "~/server/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const s3Router = createTRPCRouter({
  generatePresignedUrls: publicProcedure
    .input(z.object({ count: z.number().positive() }))
    .mutation(async ({ input }) => {
      const bucket = env.AWS_S3_BUCKET_NAME;

      const keys = Array.from({ length: input.count }, () =>
        crypto.randomUUID(),
      );

      const urls = await Promise.all(
        keys.map(async (key) => {
          return {
            bucket,
            key,
            url: await getSignedUrl(
              s3,
              new PutObjectCommand({ Bucket: bucket, Key: key }),
              {
                expiresIn: 3600,
              },
            ),
          };
        }),
      );

      return urls;
    }),
});
