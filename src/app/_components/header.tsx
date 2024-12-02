import {
  CloseButton,
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { EllipsisVertical, X } from "lucide-react";

export default function Header() {
  const links = [
    {
      name: "Get Started",
      href: "#",
    },
    {
      name: "Sign Up",
      href: "#",
    },
    {
      name: "Log In",
      href: "#",
    },
    {
      name: "About",
      href: "#",
    },
  ];

  return (
    <nav className="flex flex-row items-end justify-between px-4 py-2">
      <h2 className="text-2xl font-bold">tush</h2>

      <Popover className="relative">
        <PopoverButton>
          <EllipsisVertical className="text-muted-light dark:text-muted-dark" />
        </PopoverButton>
        <PopoverBackdrop className="fixed inset-0 backdrop-blur-xl" />
        <PopoverPanel
          anchor={{
            to: "bottom",
            padding: 10,
          }}
          transition
          className={`flex w-72 origin-top flex-row items-start justify-between rounded-xl p-5 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-surface-dark`}
        >
          <div className="flex flex-col gap-5">
            {links.map(({ name, href }, i) => (
              <a
                href={href}
                className="font-bold text-muted-light dark:text-muted-dark"
                key={i}
              >
                {name}
              </a>
            ))}
          </div>
          <CloseButton>
            <X className="text-muted-light dark:text-muted-dark" />
          </CloseButton>
        </PopoverPanel>
      </Popover>
    </nav>
  );
}
