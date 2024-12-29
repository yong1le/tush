import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import sharp from "sharp";
import { TRPCError } from "@trpc/server";
import JSZip from "jszip";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "~/server/s3";

export const imageRouter = createTRPCRouter({
  convert: publicProcedure
    .input(
      z.object({
        images: z.array(z.object({ bucket: z.string(), key: z.string() })),
        format: z.enum(["png", "jpeg", "webp"]),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("starting conversion");
      try {
        const zip = new JSZip();

        // Convert all images first
        await Promise.all(
          input.images.map(async (image, i) => {
            console.log("converting ", image.key);

            const response = await s3.send(
              new GetObjectCommand({
                Bucket: image.bucket,
                Key: image.key,
              }),
            );

            if (!response.Body) throw new Error("No body in response");

            const buffer = await response.Body.transformToByteArray();

            zip.file(
              `image-${i + 1}.${input.format}`,
              await sharp(buffer).toFormat(input.format).toBuffer(),
            );
          }),
        );

        console.log("generating zip");

        // Generate zip file
        const zipString = (
          await zip.generateAsync({ type: "nodebuffer" })
        ).toString("base64");

        console.log("generated zip");

        return {
          file: zipString,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }),
});
