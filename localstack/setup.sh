#!/bin/bash

awslocal s3 mb s3://"${AWS_S3_BUCKET_NAME}"

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

awslocal lambda create-function \
  --function-name "${AWS_LAMBDA_FN_NAME}" \
  --runtime "python3.12" \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --code S3Bucket=hot-reload,S3Key='$FUNCTIONS_DIR' \
  --handler main.handler \
  --region "${AWS_REGION}" \
  --environment "Variables={PYTHONPATH=./lambda-venv/lib/python3.12/site-packages}" \
  --memory-size 1024 \
  --timeout 60
