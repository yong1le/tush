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
import toast from "react-hot-toast";
import { CloudUploadIcon, XIcon } from "lucide-react";
import { ImageFormat, type JobOptions, JobType, UpscaleFactor } from "~/types";
import { useImageProcessing } from "../_hooks/use-image-processing";
import { useDropzone } from "react-dropzone";
import ImagePreview from "./image-preview";

const ImageDropzone = ({ jobType }: { jobType: JobType }) => {
  const [images, setImages] = useState<File[]>([]);

  const { state, progress, startProcessing, isLoading } = useImageProcessing();

  const onFileInput = (newImages: File[]) => {
    const cap = 10;
    if (images.length >= cap) {
      alert(`You can only process ${cap} files at once`);
      return;
    } else if (images.length + newImages.length > cap) {
      alert(`You can only process ${cap} files at once`);
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

  const mapJobType = () => {
    if (jobType == JobType.CONVERT) {
      return ImageFormat;
    } else if (jobType == JobType.UPSCALE) {
      return UpscaleFactor;
    }
  };

  const mapJobTypeOptions = (option: unknown) => {
    if (jobType == JobType.CONVERT) {
      return {
        format: option as ImageFormat,
      } satisfies JobOptions;
    } else if (jobType == JobType.UPSCALE) {
      return {
        scale: option as UpscaleFactor,
      } satisfies JobOptions;
    }
  };

  const processImages = async (options: JobOptions) => {
    try {
      const url = await startProcessing(images, jobType, options);
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to download zip");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "converted-images.zip";
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error(String(e));
      }
    } finally {
      setImages([]);
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
          <Input {...getInputProps()} disabled={isLoading} />
          <div
            className={`flex flex-col gap-2 w-full items-center justify-center h-full p-10
              hover:bg-secondary-light cursor-pointer transition-colors rounded-lg
              dark:hover:bg-secondary-dark ${ isLoading &&
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
            <MenuButton className={`${buttonStyles}`} disabled={isLoading}>
              {!isLoading ? (
                <>Process {images.length} images</>
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
              {Object.values(mapJobType()!).map((i: string) => (
                <MenuItem key={i}>
                  <Button
                    className={dropdownStyles}
                    onClick={async () => {
                      await processImages(mapJobTypeOptions(i)!);
                    }}
                  >
                    {i}
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

export default ImageDropzone;
