import { S3Client } from "@aws-sdk/client-s3";

import { env } from "~/env";

export const s3 = new S3Client({
  endpoint:
    env.NODE_ENV === "development" ? "http://localhost:4566" : undefined,
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});
