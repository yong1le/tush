import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import ThemeSwitch from "~/app/_components/theme-switch";

export default function CreditsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-base-light dark:bg-base-dark text-primary-light dark:text-primary-dark">
      <div className="flex justify-between items-center p-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary-light
            dark:bg-secondary-dark hover:opacity-80 transition-opacity"
        >
          <ArrowLeftIcon size={16} />
          <span>Back to Home</span>
        </Link>
        <ThemeSwitch />
      </div>
      <main>{children}</main>
    </div>
  );
}
