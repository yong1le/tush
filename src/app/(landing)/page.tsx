import { Button } from "@headlessui/react";
import Link from "next/link";
import { InfoIcon } from "lucide-react";
import ThemeSwitch from "~/app/_components/theme-switch";

export default function Home() {
  return (
    <div className="px-10 pt-28">
      <div className="flex flex-col items-stretch gap-10 md:items-center">
        <h1 className="text-center text-4xl font-bold md:text-6xl">
          Create Perfect Laptop Mockups from Your Images
        </h1>

        <Link
          className="rounded-xl bg-info-light px-4 py-6 transition-transform hover:scale-105
            md:w-[400px] dark:bg-info-dark shadow-xl dark:shadow-secondary-dark/80
            text-center"
          href="/mockup"
        >
          <Button className="text-xl">Get Started</Button>
        </Link>
      </div>
      <div className="absolute left-10 bottom-10">
        <Link
          href="/credits"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary-light
            dark:bg-secondary-dark hover:opacity-80 transition-opacity"
        >
          <InfoIcon size={16} />
          <span className="hidden sm:inline">Credits</span>
        </Link>
      </div>
      <div className="absolute right-10 bottom-10">
        <ThemeSwitch />
      </div>
    </div>
  );
}
