"use client";

import Image from "next/image";
import { type ChangeEvent, useState } from "react";
import { UploadDropzone } from "~/app/_components/uploadthing";
import { trpc } from "~/trpc/client";

const ConvertPage = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const trpcHook = trpc.image.convert.useMutation({
    onSuccess: (data) => {
      const blob = new Blob([Buffer.from(data.file, "base64")], {
        type: "application/zip",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "converted-images.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const images = event.target.files;
    if (!images) {
      console.warn("No files uploaded");
      return;
    }

    const urls = Array.from(images).map((image) => URL.createObjectURL(image));
    setImageUrls(urls);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col md:flex-row gap-2">
        {imageUrls.map((url, i) => (
          <div key={i} className="w-full relative">
            <Image src={url} alt="Image" className="object-cover" fill={true} />
          </div>
        ))}
      </div>

      <UploadDropzone
        className="w-[50%] h-[200px]"
        endpoint="publicImageUploader"
        config={{
          mode: "manual",
        }}
        onClientUploadComplete={async (res) => {
          await trpcHook.mutateAsync({
            urls: res.map((r) => r.url),
            format: "jpeg",
          });
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};

export default ConvertPage;
