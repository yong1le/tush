import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { lambda } from "~/server/aws/lambda";
import { ImageFormat } from "~/types";

import { env } from "~/env";

export const imageRouter = createTRPCRouter({
  convert: publicProcedure
    .input(
      z.object({
        locations: z.array(z.object({ bucket: z.string(), key: z.string() })),
        format: z.nativeEnum(ImageFormat),
      }),
    )
    .mutation(async ({ input }) => {
      const bucket = env.AWS_S3_BUCKET_NAME;
      const key = `outputs/zipfile-${crypto.randomUUID()}`;
      let res;
      try {
        res = await lambda.send(
          new InvokeCommand({
            InvocationType: "Event",
            FunctionName: env.AWS_LAMBDA_FN_NAME,
            Payload: JSON.stringify({
              output: { bucket, key },
              locations: input.locations,
              format: input.format,
            }),
          }),
        );
      } catch (e: unknown) {
        if (e instanceof Error) throw e;
        throw new Error(
          "Error invoking lambda function, please contact the administrator for details",
        );
      }

      if (!res.$metadata.requestId || res.StatusCode !== 202) {
        throw new Error(
          "Error invoking lambda function, please contact the administrator for details",
        );
      }

      return { bucket, key };
    }),
});
