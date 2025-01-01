import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { lambdaClient } from "~/server/functions";
import { ImageFormat } from "~/types";

import type { APIGatewayProxyResult } from "aws-lambda";
import { del } from "@vercel/blob";

export const imageRouter = createTRPCRouter({
  convert: publicProcedure
    .input(
      z.object({
        urls: z.array(z.string()),
        format: z.nativeEnum(ImageFormat),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await lambdaClient.send(
        new InvokeCommand({
          FunctionName: "convert-image-format",
          Payload: JSON.stringify({
            urls: input.urls,
            format: input.format,
          }),
        }),
      );

      const payload = new TextDecoder().decode(res.Payload);
      const result = JSON.parse(payload) as APIGatewayProxyResult;

      if (result.statusCode != 200) {
        throw new Error(`Lambda function error with ${result.statusCode}`);
      }

      const body = JSON.parse(result.body) as { zipUrl: string };

      return {
        zipUrl: body.zipUrl,
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        urls: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      await Promise.all(
        input.urls.map(async (url) => {
          await del(url);
        }),
      );
    }),
});
