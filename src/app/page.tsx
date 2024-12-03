import { Button } from "@headlessui/react";

export default function Home() {
  return (
    <div className="px-10">
      <div className="mt-28 flex flex-col items-stretch gap-10 md:items-center">
        <h1 className="text-center text-4xl font-bold">
          Create Perfect Laptop Mockups from Your Images
        </h1>

        <Button className="rounded-xl bg-info-light px-4 py-2 transition-transform data-[hover]:scale-105 md:w-[400px] dark:bg-info-dark">
          Get Started
        </Button>
      </div>
    </div>
  );
}
