"use client";

import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useState } from "react";
import { trpc } from "~/trpc/client";
import { useDropzone } from "react-dropzone";
import { CloudUploadIcon, XIcon } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { ImageFormat } from "~/types";
import ImagePreview from "~/app/_components/image-preview";

const ConvertPage = () => {
  const [images, setImages] = useState<File[]>([]);
  const [state, setState] = useState<
    "idle" | "uploading" | "converting" | "downloading"
  >("idle");
  const [progress, setProgress] = useState<number>(0);

  const convert = trpc.image.convert.useMutation({});
  const deleteUrls = trpc.image.delete.useMutation();

  const onFileInput = (newImages: File[]) => {
    if (images.length >= 5) {
      alert("You can only convert 5 files at once");
      return;
    } else if (images.length + newImages.length > 5) {
      alert("You can only convert 5 files at once");
      return;
    }
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeUploadedImage = (image: File) => {
    setImages((prev) => prev.filter((p) => p != image));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onFileInput,
  });

  const convertImages = async (format: ImageFormat) => {
    try {
      if (images.length <= 0) {
        console.warn("No images to convert");
        return;
      }

      setState("uploading");
      const urls = await Promise.all(
        images.map(async (image) => {
          const res = await upload(`public/${image.name}`, image, {
            access: "public",
            handleUploadUrl: "/api/image/upload",
            multipart: true,
          });

          setProgress((prev) => prev + 99 / images.length);

          return res.downloadUrl;
        }),
      );

      setState("converting");
      const { zipUrl } = await convert.mutateAsync({
        urls: urls,
        format,
      });
      setProgress(100);

      setState("downloading");
      const zipRes = await fetch(zipUrl);

      if (!zipRes.ok) {
        console.error("Failed to download zip");
        return;
      }

      // Delete the blob

      const blob = await zipRes.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "converted-images.zip";
      a.click();
      window.URL.revokeObjectURL(downloadUrl);

      urls.push(zipUrl);
      await deleteUrls.mutateAsync({ urls: urls });
    } catch (e) {
      alert(e);
    } finally {
      setProgress(0);
      setImages([]);
      setState("idle");
    }
  };

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
          <Input {...getInputProps()} disabled={state !== "idle"} />
          <div
            className={`flex flex-col gap-2 w-full items-center justify-center h-full p-10
              hover:bg-secondary-light cursor-pointer transition-colors rounded-lg
              dark:hover:bg-secondary-dark ${ state !== "idle" &&
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
              className={`${buttonStyles}`}
              disabled={state !== "idle"}
            >
              {state === "idle" ? (
                <>Convert {images.length} images</>
              ) : (
                <div className="w-full flex flex-col gap-1 items-center transition-all">
                  <div className="h-2 w-32 rounded-full overflow-hidden bg-base-light dark:bg-base-dark">
                    <div
                      className="h-full bg-info-light dark:bg-info-dark transition-all duration-300 ease-in-out
                        rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-center text-sm text-secondary-light dark:text-secondary-dark">
                    {state.toLocaleUpperCase()} - {Math.floor(progress)}%
                  </span>
                </div>
              )}
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
              {Object.values(ImageFormat).map((format) => (
                <MenuItem key={format}>
                  <Button
                    className={dropdownStyles}
                    onClick={async () => {
                      await convertImages(format);
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
