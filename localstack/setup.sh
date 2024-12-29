#!/bin/sh

echo "Initializing s3 bucket for tush"
awslocal s3 mb "s3://${AWS_S3_BUCKET_NAME}"
awslocal s3api put-bucket-cors --bucket "${AWS_S3_BUCKET_NAME}" --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["PUT", "POST", "GET"],
      "AllowedOrigins": ["http://localhost:3000"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}'
