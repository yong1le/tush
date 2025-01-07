"use client";

import { Button } from "@headlessui/react";
import React from "react";
import { trpc } from "~/trpc/client";

type Props = {
  bucket: string;
  prefixKey: string;
  children: React.ReactNode;
};
const DownloadOutputButton = ({ bucket, prefixKey, children }: Props) => {
  const generatePresignedGetUrl = trpc.s3.generatePresignedGetUrl.useMutation();

  const downloadOutput = async () => {
    const { url } = await generatePresignedGetUrl.mutateAsync({
      bucket,
      key: prefixKey,
    });

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
  };

  return (
    <Button
      className="px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark text-base-light
        dark:text-base-dark"
      onClick={downloadOutput}
    >
      {children}
    </Button>
  );
};

export default DownloadOutputButton;
