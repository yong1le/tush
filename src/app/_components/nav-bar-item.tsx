"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarItem({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const onCurrentItem = usePathname().endsWith(href);

  return (
    <Link
      href={href}
      className={`flex flex-row gap-2 items-center px-2 md:px-4 py-2 rounded-md
        hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors my-1
        ${className} ${onCurrentItem && "bg-secondary-light dark:bg-secondary-dark"}`}
    >
      {children}
    </Link>
  );
}
