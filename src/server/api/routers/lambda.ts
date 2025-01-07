import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { lambda } from "~/server/aws/lambda";
import {
  ImageFormat,
  JobType,
  UpscaleFactor,
  type LambdaPayload,
} from "~/types";

import { env } from "~/env";

export const lambdaRouter = createTRPCRouter({
  invoke: publicProcedure
    .input(
      z.object({
        type: z.nativeEnum(JobType),
        options: z.union([
          z.object({ format: z.nativeEnum(ImageFormat) }),
          z.object({ scale: z.nativeEnum(UpscaleFactor) }),
        ]),
        locations: z.array(z.object({ bucket: z.string(), key: z.string() })),
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
              input: {
                images: input.locations,
                type: input.type,
                options: input.options,
              },
            } satisfies LambdaPayload),
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
