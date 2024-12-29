import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import sharp from "sharp";
import archiver, { type Archiver } from "archiver";
import { TRPCError } from "@trpc/server";

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
        const archive: Archiver = archiver("zip", { zlib: { level: 9 } });
        const chunks: Buffer[] = [];
        archive.on("data", (chunk: Buffer) => chunks.push(chunk));

        await Promise.all(
          input.urls.map(async (url, i) => {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const convertedBuffer = await sharp(buffer)
              .toFormat(input.format)
              .toBuffer();

            archive.append(convertedBuffer, {
              name: `image-${i + 1}.${input.format}`,
            });

            // You might want to save this buffer somewhere or convert to base64
            return convertedBuffer.toString("base64");
          }),
        );

        await archive.finalize();

        return {
          file: Buffer.concat(chunks).toString("base64"),
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
