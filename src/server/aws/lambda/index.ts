import { LambdaClient } from "@aws-sdk/client-lambda";

import { env } from "src/env";

export const lambda = new LambdaClient({
  endpoint:
    env.NODE_ENV === "development" ? "http://localhost:4566" : undefined,
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
