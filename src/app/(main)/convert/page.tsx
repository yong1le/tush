"use client";

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { trpc } from "~/trpc/client";
import { CloudUploadIcon, XIcon } from "lucide-react";
import { useUploadThing } from "~/app/_lib/uploadthing";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

const formats = ["jpeg", "png", "webp"] as const;

const ImagePreview = ({ image }: { image: File }) => {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(image);

    return () => {
      reader.abort();
    };
  }, [image]);

  return (
    <div
      className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] relative inline-block mx-2
        shrink-0"
    >
      {preview && (
        <Image
          src={preview}
          alt="Image"
          className="object-cover rounded-lg"
          fill={true}
        />
      )}
    </div>
  );
};

const ConvertPage = () => {
  const [images, setImages] = useState<File[]>([]);

  const convertImage = trpc.image.convert.useMutation({
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
      setImages([]);
    },
  });

  const { startUpload, isUploading, routeConfig } = useUploadThing(
    "publicImageUploader",
    {
      onClientUploadComplete: async (res) => {
        console.log("preparing to convert...");
        await convertImage.mutateAsync({
          urls: res.map((r) => r.url),
          format: res[0]?.serverData?.format ?? "jpeg",
        });
      },
      onUploadError: () => {
        alert("error occurred while uploading");
      },
      onUploadBegin: (file) => {
        console.log("upload has begun for", file);
      },
    },
  );

  const onFileInput = (images: File[]) => {
    setImages((prev) => [...prev, ...images]);
  };

  const removeUploadedImage = (image: File) => {
    setImages((prev) => prev.filter((p) => p != image));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileInput,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
  });

  const buttonStyles = `bg-primary-light text-secondary-light py-2 px-4 rounded-lg dark:bg-primary-dark
  dark:text-secondary-dark hover:opacity-80 transition-opacity hover:cursor-pointer`;

  const dropdownStyles = `flex group w-full items-center gap-2 rounded-lg py-1.5 px-3
                  data-[focus]:bg-white/10`;

  return (
    <div className="flex flex-col items-center h-full gap-4 m-10">
      <div
        className="w-4/5 lg:w-1/2 h-1/2 rounded-lg border-neutral-light border-2 border-dashed
          dark:border-neutral-dark"
      >
        <div {...getRootProps()} className="w-full h-full">
          <input {...getInputProps()} disabled={isUploading} />
          <div
            className={`flex flex-col gap-2 w-full items-center justify-center h-full p-10
              hover:bg-secondary-light cursor-pointer transition-colors rounded-lg
              dark:hover:bg-secondary-dark ${ isUploading &&
              "bg-secondary-light dark:bg-secondary-dark" }`}
          >
            <CloudUploadIcon height={64} width={64} />
            <p className="font-bold text-center">
              Choose images to upload or drag and drop
            </p>
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className="flex flex-col md:flex-row gap-2">
          <Menu>
            <MenuButton
              className={`${buttonStyles} disabled:bg-secondary-light dark:disabled:bg-secondary-dark`}
              disabled={isUploading}
            >
              Convert {images.length} images
            </MenuButton>
            <MenuItems
              transition
              anchor="bottom end"
              className="z-20 w-28 origin-top-right rounded-lg border border-secondary-light
                bg-primary-light/80 p-1 text-sm text-base-light transition duration-100 ease-out
                [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95
                data-[closed]:opacity-0 dark:bg-primary-dark/60 dark:text-base-dark
                dark:border-secondary-dark"
            >
              {formats.map((format) => (
                <MenuItem key={format}>
                  <Button
                    className={dropdownStyles}
                    onClick={async () => {
                      await startUpload(images, { format });
                    }}
                  >
                    {format.toUpperCase()}
                  </Button>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      )}
      <div
        className="flex-row p-2 items-center flex w-4/5 lg:w-1/2 h-[150px] md:h-[250px]
          overflow-x-auto rounded-lg overflow-y-hidden dark:bg-secondary-dark
          bg-secondary-light"
      >
        {images.length > 0 ? (
          images.map((image, i) => (
            <div key={i} className="relative">
              <div
                className="absolute -right-1 -top-2 z-10 cursor-pointer bg-error-light dark:bg-error-dark
                  rounded-full p-2 hover:scale-110 transition-transform"
                onClick={() => removeUploadedImage(image)}
              >
                <XIcon height={12} width={12} />
              </div>
              <ImagePreview image={image} />
            </div>
          ))
        ) : (
          <p className="w-full font-bold text-center">No Images Uploaded</p>
        )}
      </div>
    </div>
  );
};

export default ConvertPage;
