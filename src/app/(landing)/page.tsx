import { Button } from "@headlessui/react";

export default function Home() {
  return (
    <div className="px-10">
      <div className="mt-28 flex flex-col items-stretch gap-10">
        <h1 className="text-center text-4xl font-bold">
          Create Perfect Laptop Mockups from Your Images
        </h1>

        <Button className="max-w-[400px] rounded-xl bg-primary-light px-4 py-2 dark:bg-primary-dark">
          Get Started
        </Button>
      </div>
    </div>
  );
}
