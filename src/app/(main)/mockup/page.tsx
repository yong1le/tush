"use client";

import { type ChangeEvent, useEffect, useRef } from "react";
import { Canvas, FabricImage } from "fabric";
import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

const MockupPage = () => {
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

  const downloadCanvasImage = (format: "png" | "jpeg") => {
    const canvas = fabricRef.current;
    if (!canvas) {
      console.warn("Canvas has not been initialized");
      return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL({
      multiplier: 1,
      format: format,
      quality: 1,
    });
    link.download = `canvas.${format}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buttonStyles = `bg-primary-light text-secondary-light py-2 px-4 rounded-lg dark:bg-primary-dark
  dark:text-secondary-dark hover:opacity-80 transition-opacity hover:cursor-pointer`;

  const dropdownStyles = `flex group w-full items-center gap-2 rounded-lg py-1.5 px-3
                  data-[focus]:bg-white/10`;

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Image Mockup</h1>
        <p>Add device frames around images</p>
      </div>
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
        <Menu>
          <MenuButton className={buttonStyles}>Download</MenuButton>
          <MenuItems
            transition
            anchor="bottom end"
            className="w-28 origin-top-right rounded-lg border border-secondary-light
              bg-primary-light/80 p-1 text-sm text-base-light transition duration-100 ease-out
              [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95
              data-[closed]:opacity-0 dark:bg-primary-dark/60 dark:text-base-dark
              dark:border-secondary-dark"
          >
            <MenuItem>
              <Button
                className={dropdownStyles}
                onClick={() => downloadCanvasImage("png")}
              >
                PNG
              </Button>
            </MenuItem>
            <MenuItem>
              <Button
                className={dropdownStyles}
                onClick={() => downloadCanvasImage("jpeg")}
              >
                JGP
              </Button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};
export default MockupPage;
