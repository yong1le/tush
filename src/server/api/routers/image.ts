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
      try {
        const zip = new JSZip();

        // Optimize Sharp settings
        sharp.cache(false); // Disable caching for memory efficiency
        sharp.concurrency(1); // Limit concurrent processing

        // Batch process images in smaller chunks
        const BATCH_SIZE = 3;
        for (let i = 0; i < input.urls.length; i += BATCH_SIZE) {
          const batch = input.urls.slice(i, i + BATCH_SIZE);
          await Promise.all(
            batch.map(async (url, index) => {
              const response = await fetch(url);
              const arrayBuffer = await response.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);

              const converted = await sharp(buffer)
                .toFormat(input.format, {
                  // Format-specific optimizations
                  ...(input.format === "jpeg" && {
                    quality: 80,
                    progressive: true,
                  }),
                  ...(input.format === "png" && {
                    compressionLevel: 6, // Balance between speed and size
                    palette: true, // Use palette-based encoding for smaller files
                  }),
                  ...(input.format === "webp" && {
                    quality: 80,
                    effort: 4, // Range 0-6, lower is faster
                  }),
                })
                .resize(1920, 1920, {
                  // Limit max dimensions
                  fit: "inside",
                  withoutEnlargement: true,
                })
                .toBuffer();

              zip.file(`image-${i + index + 1}.${input.format}`, converted);
            }),
          );
        }

        const zipBuffer = await zip.generateAsync({
          type: "nodebuffer",
          compression: "STORE", // Use STORE for faster zipping
        });

        return {
          file: zipBuffer.toString("base64"),
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
