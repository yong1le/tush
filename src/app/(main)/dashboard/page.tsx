"use client";

import { type ChangeEvent, useEffect, useRef } from "react";
import { Canvas, FabricImage } from "fabric";
import { Button, Input } from "@headlessui/react";

const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas>();
  const frameRef = useRef<FabricImage>();

  useEffect(() => {
    const handlePageResize = () => {
      if (!containerRef.current || !fabricRef.current || !frameRef.current) {
        console.warn("Page has not loaded yet");
        return;
      }

      console.log("resizing", containerRef.current.clientWidth);

      const canvas = fabricRef.current;
      const frame = frameRef.current;
      const container = containerRef.current;

      canvas.setDimensions({
        width: container.clientWidth,
        height: container.clientWidth * 0.5625, // 16:9
      });

      frame.scaleToWidth(canvas.width - 50);
      canvas.centerObject(frame);
      canvas.requestRenderAll();
    };

    if (!canvasRef.current || !containerRef.current) {
      console.warn("Page has not loaded yet");
      return;
    }

    fabricRef.current = new Canvas(canvasRef.current ?? undefined, {
      preserveObjectStacking: true,
    });

    const canvas = fabricRef.current;

    void FabricImage.fromURL("/frame.png").then((image) => {
      frameRef.current = image;
      image.selectable = false;
      image.evented = false;

      canvas.add(image);

      handlePageResize();
    });

    window.addEventListener("resize", handlePageResize);

    return () => {
      window.removeEventListener("resize", handlePageResize);
      void canvas.dispose();
    };
  }, []);

  const handleUploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No image uploaded ");
      return;
    }

    if (!fabricRef.current || !frameRef.current) {
      console.warn("Page has not loaded yet");
      return;
    }

    const canvas = fabricRef.current;
    const frame = frameRef.current;

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

  const buttonStyles = `bg-primary-light text-secondary-light py-2 px-4 rounded-lg dark:bg-primary-dark
  dark:text-secondary-dark hover:opacity-80 transition-opacity hover:cursor-pointer`;

  return (
    <div className="flex flex-col items-center gap-10 m-4 md:m-10">
      <div
        ref={containerRef}
        className="max-w-[1000px] w-[90%] bg-base-light rounded-lg"
      >
        <canvas ref={canvasRef} />
      </div>

      <div className="gap-2 md:gap-8 md:flex-row flex-col flex items-center">
        <label htmlFor="imageInput" className={buttonStyles}>
          Choose Image
        </label>
        <Input
          type="file"
          id="imageInput"
          onChange={handleUploadFile}
          accept="image/*"
          className="hidden"
        />
        <Button className={buttonStyles} onClick={downloadCanvasImage}>
          Download
        </Button>
      </div>
    </div>
  );
};
export default Dashboard;
