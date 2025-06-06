import asyncio
import io
import json
import time
import uuid
import zipfile
from concurrent.futures import ThreadPoolExecutor

import boto3
import cv2
import numpy as np

s3_client = boto3.client("s3")

format_params = {
    "png": (".png", [cv2.IMWRITE_PNG_COMPRESSION, 6]),
    "jpeg": (".jpg", [cv2.IMWRITE_JPEG_QUALITY, 85]),
    "webp": (".webp", [cv2.IMWRITE_WEBP_QUALITY, 85]),
    "gif": (".gif", None),
    "bmp": (".bmp", None),
    "tiff": (".tiff", None),
    "ico": (".ico", None),
    "cur": (".cur", None),
}


def get_format(img_data):
    if img_data.startswith(b"\xff\xd8"):
        return "jpeg"
    elif img_data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    elif img_data.startswith(b"RIFF") and img_data[8:12] == b"WEBP":  # WebP
        return "webp"
    elif img_data.startswith(b"GIF87a") or img_data.startswith(b"GIF89a"):
        return "gif"
    elif img_data.startswith(b"BM"):
        return "bmp"
    elif img_data.startswith(b"MM\x00\x2a") or img_data.startswith(b"II\x2a\x00"):
        return "tiff"
    elif img_data.startswith(b"\x00\x00\x01\x00"):
        return "ico"
    elif img_data.startswith(b"\x00\x00\x02\x00"):
        return "cur"
    else:
        raise Exception("Unsupported image format")


def convert_image_format(
    index: int, location: dict, options: dict
) -> tuple[str, bytes]:
    """
    Convert a single image file to the specified format and return its
    name and converted bytes.
    """
    format: str = options["format"]
    bucket = location["bucket"]
    key = location["key"]

    if format not in format_params:
        raise ValueError(f"Unsupported format: {options}")

    print(f"converting {key}")

    response = s3_client.get_object(Bucket=bucket, Key=key)
    img_data = response["Body"].read()

    img_array = np.asarray(bytearray(img_data), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    ext, params = format_params[format]

    success, buffer = cv2.imencode(ext, img, params)
    if not success:
        raise Exception(f"Failed to encode image from {key}")

    print(f"converted {key}")
    return (f"image-{index+1}.{format}", buffer.tobytes())


def upscale_image(index: int, location: dict, options: dict) -> tuple[str, bytes]:
    scale: int = int(options["scale"])
    bucket = location["bucket"]
    key = location["key"]

    print(f"converting {key}")

    response = s3_client.get_object(Bucket=bucket, Key=key)
    img_data = response["Body"].read()

    img_array = np.asarray(bytearray(img_data), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    # Add these debug prints
    print(f"Image shape before resize: {img.shape}")
    print(f"Image dtype before resize: {img.dtype}")
    print(f"Image range before resize: [{np.min(img)}, {np.max(img)}]")

    print(scale)
    # Scale the image using cv2.resize
    img = cv2.resize(img, (0, 0), fx=scale, fy=scale)

    # After resize
    print(f"Image shape after resize: {img.shape}")
    print(f"Image dtype after resize: {img.dtype}")
    print(f"Image range after resize: [{np.min(img)}, {np.max(img)}]")

    ext, params = format_params[get_format(img_data)]
    success, buffer = cv2.imencode(ext, img, params)
    if not success:
        raise Exception(f"Failed to encode image from {key}")

    print(f"converted {key}")
    return (f"image-{index+1}{ext}", buffer.tobytes())


def handler(event, context):
    return asyncio.run(async_handler(event, context))


async def async_handler(event: dict, context):
    try:
        locations: list[dict] = event["input"]["images"]
        job_type: str = event["input"]["type"]
        options: dict = event["input"]["options"]
        bucket: str = event["output"]["bucket"]
        key: str = event["output"]["key"]

        if not locations:
            raise ValueError("Cannot have empty locations list")

    except Exception as e:
        raise e

    try:
        conversion_start = time.time()
        if job_type == "convert":
            processing_fn = convert_image_format
        else:
            processing_fn = upscale_image

        with ThreadPoolExecutor() as executor:
            results = list(
                executor.map(
                    lambda x: processing_fn(x[0], x[1], options),
                    enumerate(locations),
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
                raise Exception("Error writing to zip:", str(e))
        zip_time = time.time() - zip_start

        print(f"Image conversion took: {conversion_time:.2f} seconds")
        print(f"Zip generation and upload took: {zip_time:.2f} seconds")

        zip_buffer.seek(0)

        print(f"Uploading {bucket} at {key}")
        s3_client.put_object(
            Bucket=bucket,
            Key=key,
            Body=zip_buffer.getvalue(),
            ContentType="application/zip",
        )

    except Exception as e:
        raise e
