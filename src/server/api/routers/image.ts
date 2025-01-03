import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { lambda } from "~/server/aws/lambda";
import { ImageFormat } from "~/types";

import type { APIGatewayProxyResult } from "aws-lambda";
import { env } from "~/env";
import { jobs } from "~/server/db/schemas/jobs";

export const imageRouter = createTRPCRouter({
  convert: publicProcedure
    .input(
      z.object({
        locations: z.array(z.object({ bucket: z.string(), key: z.string() })),
        format: z.nativeEnum(ImageFormat),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let res;
      try {
        res = await lambda.send(
          new InvokeCommand({
            FunctionName: env.AWS_LAMBDA_FN_NAME,
            Payload: JSON.stringify({
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

      const payload = new TextDecoder().decode(res.Payload);
      const result = JSON.parse(payload) as APIGatewayProxyResult;
      const body = JSON.parse(result.body) as {
        url: string;
        bucket: string;
        key: string;
        message: string;
      };

      if (result.statusCode != 200) {
        throw new Error(
          `Lambda function failed with code: ${result.statusCode}`,
        );
      }

      if (ctx.session?.user.id) {
        console.log("Saving job to database");
        await ctx.db
          .insert(jobs)
          .values({
            user_id: ctx.session.user.id,
            output: {
              bucket: body.bucket,
              key: body.key,
            },
          })
          .execute();
      }

      return {
        url: body.url,
      };
    }),
});
