import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "src/env";

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

export const generatePresignedUrl = async (
  action: "get" | "put",
  bucket: string,
  key: string,
) => {
  let command;
  if (action == "put") {
    command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });
  } else {
    command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
  }

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
};
