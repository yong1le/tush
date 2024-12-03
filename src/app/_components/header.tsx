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
          <EllipsisVertical className="text-neutral-light dark:text-neutral-dark" />
        </PopoverButton>
        <PopoverBackdrop className="fixed inset-0 backdrop-blur-xl" />
        <PopoverPanel
          anchor={{
            to: "bottom",
            padding: 10,
          }}
          transition
          className={`flex w-72 origin-top flex-row items-start justify-between rounded-xl bg-secondary-light/30 p-5 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-secondary-dark/70`}
        >
          <div className="flex flex-col gap-5">
            {links.map(({ name, href }, i) => (
              <a
                href={href}
                className="font-bold text-neutral-light dark:text-neutral-dark"
                key={i}
              >
                {name}
              </a>
            ))}
          </div>
          <CloseButton>
            <X className="text-neutral-light dark:text-neutral-dark" />
          </CloseButton>
        </PopoverPanel>
      </Popover>
    </nav>
  );
}
