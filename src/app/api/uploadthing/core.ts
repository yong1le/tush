import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const uploadFileRouter = {
  publicImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .input(z.object({ format: z.enum(["jpeg", "png", "webp"]) }))
    .middleware(async ({ input }) => {
      return {
        format: input.format,
      };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { format: metadata.format };
    }),
} satisfies FileRouter;

export type UploadFileRouter = typeof uploadFileRouter;
