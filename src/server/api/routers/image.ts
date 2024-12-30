import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import sharp, { format, type FormatEnum } from "sharp";
import { TRPCError } from "@trpc/server";
import JSZip from "jszip";

export const imageRouter = createTRPCRouter({
  convert: publicProcedure
    .input(
      z.object({
        urls: z.array(z.string()),
        format: z.enum(
          Object.keys(format) as [keyof FormatEnum, ...(keyof FormatEnum)[]],
        ),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("starting conversion");
      try {
        const zip = new JSZip();

        const total = input.urls.length;
        let converted = 0;

        // Convert all images first
        await Promise.all(
          input.urls.map(async (url, i) => {
            console.log("converting ", url);
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            let transformer = sharp(buffer);

            switch (input.format) {
              case "png":
                transformer = transformer.png({
                  compressionLevel: 6, // Balance between speed and compression (range 0-9)
                  quality: 100, // Maintain original quality
                });
                break;
              case "jpeg":
                transformer = transformer.jpeg({
                  quality: 95, // High quality
                  mozjpeg: true, // Use mozjpeg optimization
                });
                break;
              case "webp":
                transformer = transformer.webp({
                  quality: 95, // High quality
                  lossless: true, // Preserve quality
                });
                break;
              default:
                transformer = transformer.toFormat(input.format);
            }

            zip.file(`image-${i + 1}.${input.format}`, transformer.toBuffer());

            converted++;
            console.log(`Converted ${converted}/${total} Images `);
          }),
        );

        console.log("generating zip");

        // Generate zip file
        const zipString = (
          await zip.generateAsync({ type: "nodebuffer" })
        ).toString("base64");

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
