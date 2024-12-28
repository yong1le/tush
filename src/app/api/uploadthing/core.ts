import { createUploadthing, type FileRouter } from "uploadthing/next";
import { trpc } from "~/trpc/server";

const f = createUploadthing();

export const uploadFileRouter = {
  publicImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  }).onUploadComplete(async ({ file }) => {
    return { key: file.key };
  }),
} satisfies FileRouter;

export type UploadFileRouter = typeof uploadFileRouter;
