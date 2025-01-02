import time
import cv2
import io
import json
import numpy as np
import zipfile
from concurrent.futures import ThreadPoolExecutor
import asyncio
import boto3
import uuid

s3_client = boto3.client("s3")


def convert_image_format(index: int, location: dict, format: str) -> tuple[str, bytes]:
    """
    Convert a single image file to the specified format and return its
    name and converted bytes.
    """

    bucket = location["bucket"]
    key = location["key"]

    print(f"converting {key}")

    response = s3_client.get_object(Bucket=bucket, Key=key)
    img_data = response["Body"].read()

    img_array = np.asarray(bytearray(img_data), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    format_params = {
        "png": (".png", [cv2.IMWRITE_PNG_COMPRESSION, 6]),
        "jpeg": (".jpg", [cv2.IMWRITE_JPEG_QUALITY, 85]),
        "webp": (".webp", [cv2.IMWRITE_WEBP_QUALITY, 85]),
    }

    if format not in format_params:
        raise ValueError(f"Unsupported format: {format}")
    ext, params = format_params[format]

    # Encode to PNG with compression
    success, buffer = cv2.imencode(ext, img, params)
    if not success:
        raise Exception(f"Failed to encode image from {key}")

    print(f"converted {key}")
    return (f"image-{index+1}.png", buffer.tobytes())


def handler(event, context):
    url = asyncio.run(async_handler(event, context))
    return {
        "statusCode": 200,
        "body": json.dumps({"zipUrl": url}),
    }


async def async_handler(event: dict, context):
    locations: list[dict] = event["locations"]
    format: str = event["format"]

    conversion_start = time.time()
    with ThreadPoolExecutor() as executor:
        results = list(
            executor.map(
                lambda x: convert_image_format(x[0], x[1], format), enumerate(locations)
            )
        )
    conversion_time = time.time() - conversion_start

    print("generating zip")
    zip_start = time.time()
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        try:
            for filename, data in results:
                zip_file.writestr(filename, data)
        except Exception as e:
            print("Error writing to zip", e)
    zip_time = time.time() - zip_start

    print(f"Image conversion took: {conversion_time:.2f} seconds")
    print(f"Zip generation and upload took: {zip_time:.2f} seconds")

    try:
        zip_buffer.seek(0)
        output_name = "outputs/" + str(uuid.uuid4())
        s3_client.put_object(
            Bucket="tush-dev",
            Key=output_name,
            Body=zip_buffer.getvalue(),
            ContentType="application/zip",
        )

        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": "tush-dev", "Key": output_name},
            ExpiresIn=3600,
        )

        return presigned_url
    except Exception as e:
        print("Error sending to vercel", e)
