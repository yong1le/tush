import type { APIGatewayProxyResult } from "aws-lambda";
import JSZip from "jszip";
import sharp, { type FormatEnum } from "sharp";
import { del, put } from "@vercel/blob";

export const handler = async (event: {
  urls: string[];
  format: keyof FormatEnum;
}): Promise<APIGatewayProxyResult> => {
  const zip = new JSZip();
  const urls = event.urls;
  const format = event.format;

  const total = urls.length;
  let converted = 0;

  await Promise.all(
    urls.map(async (url, i) => {
      console.log("converting ", url);

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let transformer = sharp(buffer);

      switch (format) {
        case "png":
          transformer = transformer.png({
            compressionLevel: 6, // Balance between speed and compression (range 0-9)
            quality: 100, // Maintain original quality
          });
          break;
        case "jpeg":
          transformer = transformer.jpeg({
            quality: 95, // High quality
            mozjpeg: true, // Use mozjpeg optimization
          });
          break;
        case "webp":
          transformer = transformer.webp({
            quality: 95, // High quality
            lossless: true, // Preserve quality
          });
          break;
        default:
          transformer = transformer.toFormat(format);
      }

      zip.file(`image-${i + 1}.${format}`, transformer.toBuffer());

      converted++;
      console.log(`Converted ${converted}/${total} Images `);
    }),
  );
  console.log("generating zip");

  // Generate zip file
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  // Upload to Vercel Blob with proper content type
  const blob = await put(`publicZips/archive-${Date.now()}.zip`, zipBuffer, {
    access: "public",
    contentType: "application/zip",
    addRandomSuffix: true, // optional: adds random suffix to prevent naming conflicts
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      zipUrl: blob.downloadUrl,
    }),
  };
};
