import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import sharp from "sharp";
import { TRPCError } from "@trpc/server";
import JSZip from "jszip";

export const imageRouter = createTRPCRouter({
  convert: publicProcedure
    .input(
      z.object({
        urls: z.array(z.string()),
        format: z.enum(["png", "jpeg", "webp"]),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("starting conversion");
      try {
        const zip = new JSZip();

        // Convert all images first
        await Promise.all(
          input.urls.map(async (url, i) => {
            console.log("converting ", url);
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            zip.file(
              `image-${i + 1}.${input.format}`,
              sharp(buffer).toFormat(input.format).toBuffer(),
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
