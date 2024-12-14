import { Button } from "@headlessui/react";
import Link from "next/link";
import ThemeSwitch from "~/app/_components/theme-switch";

export default function Home() {
  return (
    <div className="px-10 pt-28">
      <div className="flex flex-col items-stretch gap-10 md:items-center">
        <h1 className="text-center text-4xl font-bold md:text-6xl">
          Create Perfect Laptop Mockups from Your Images
        </h1>

        <Button
          className="rounded-xl bg-info-light px-4 py-6 transition-transform data-[hover]:scale-105
            md:w-[400px] dark:bg-info-dark shadow-xl dark:shadow-secondary-dark/80"
        >
          <Link className="text-xl" href="/dashboard">
            Get Started
          </Link>
        </Button>
      </div>
      <div className="absolute right-10 bottom-10">
        <ThemeSwitch />
      </div>
    </div>
  );
}
