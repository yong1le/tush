#!/bin/bash

awslocal lambda create-function \
  --function-name convert-image-format \
  --runtime "nodejs22.x" \
  --role arn:aws:iam::123456789012:role/lambda-ex \
  --code S3Bucket="hot-reload",S3Key="${FUNCTIONS_DIR}" \
  --handler index.handler \
  --region "${AWS_REGION}" \
  --environment "Variables={BLOB_READ_WRITE_TOKEN=$BLOB_READ_WRITE_TOKEN}" \
  --memory-size 1024 \
  --timeout 60
