"use client";

import { type ChangeEvent, useEffect, useRef } from "react";
import { Canvas, FabricImage } from "fabric";
import { trpc } from "~/trpc/client";
import { Button, Input } from "@headlessui/react";

const Dashboard = () => {
  const username = trpc.user.getName.useQuery().data;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas>();
  const frameRef = useRef<FabricImage>();

  useEffect(() => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        canvasRef.current.style.width = "100%";
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientWidth * 0.5625; // 16:9 aspect ratio
        canvasRef.current.style.alignSelf = "center";
      }
    }

    fabricRef.current = new Canvas(canvasRef.current ?? undefined, {
      preserveObjectStacking: true,
      width: canvasRef.current?.width,
    });

    const canvas = fabricRef.current;

    void FabricImage.fromURL("/frame.png").then((image) => {
      frameRef.current = image;
      image.selectable = false;
      image.evented = false;

      image.scaleToWidth(canvas.width - 50);
      canvas.centerObject(image);
      canvas.add(image);
    });

    return () => {
      void canvas.dispose();
    };
  }, []);

  const handleUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No image uploaded ");
      return;
    }

    const canvas = fabricRef.current;
    if (!canvas) {
      console.warn("Canvas has not been initialized");
      return;
    }

    const frame = frameRef.current;
    if (!frame) {
      console.warn("No device frame exists in canvas");
      return;
    }

    const url = URL.createObjectURL(file);

    const image = await FabricImage.fromURL(url);
    image.scaleToWidth(frame.getScaledWidth());
    canvas.centerObject(image);
    canvas.add(image);

    canvas.bringObjectToFront(frame);
  };

  const downloadCanvasImage = () => {
    const canvas = fabricRef.current;
    if (!canvas) {
      console.warn("Canvas has not been initialized");
      return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL({
      multiplier: 1,
      format: "png",
      quality: 1,
    });
    link.download = "canvas.png";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="m-10 flex flex-col items-center gap-10">
      <div>
        Welcome <span className="font-bold"> {username}</span>
      </div>

      <div className="w-5/6 flex justify-center">
        <canvas ref={canvasRef} />
      </div>

      <div>
        <Input
          type="file"
          id="imageInput"
          onChange={handleUploadFile}
          accept="image/*"
          className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-light
            file:text-secondary-light dark:file:bg-primary-dark
            dark:file:text-secondary-dark cursor-pointer file:cursor-pointer
            hover:opacity-80 transition-opacity"
        />
        <Button
          className="bg-primary-light text-secondary-light p-2 rounded dark:bg-primary-dark
            dark:text-secondary-dark hover:opacity-80 transition-opacity"
          onClick={downloadCanvasImage}
        >
          Download
        </Button>
      </div>
    </div>
  );
};
export default Dashboard;
