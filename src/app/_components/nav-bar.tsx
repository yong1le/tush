import ThemeSwitch from "./theme-switch";
import {
  HomeIcon,
  ImagesIcon,
  MoonIcon,
  User2Icon,
  SunIcon,
  LaptopIcon,
  FolderSyncIcon,
} from "lucide-react";
import { trpc } from "~/trpc/server";
import NavbarItem from "~/app/_components/nav-bar-item";
import Image from "next/image";

export default async function Navbar() {
  const user = await trpc.user.getUser();

  return (
    <div
      className="px-2 md:px-4 py-2 border-r-secondary-light dark:border-r-secondary-dark flex
        border-r flex-col justify-between h-full"
    >
      <ul>
        <li>
          <NavbarItem href="/">
            <ImagesIcon />
            <h2 className="text-2xl font-bold hidden md:inline">tush</h2>
          </NavbarItem>
        </li>

        <hr className="border-secondary-light dark:border-secondary-dark my-2 md:my-4" />

        <li>
          <NavbarItem href="/dashboard">
            <HomeIcon />
            <p className="hidden md:inline">Dashboard</p>
          </NavbarItem>
        </li>
        <li>
          <NavbarItem href="/mockup">
            <LaptopIcon />
            <p className="hidden md:inline">Mockups</p>
          </NavbarItem>
        </li>
        <li>
          <NavbarItem href="/convert">
            <FolderSyncIcon />
            <p className="hidden md:inline">Convert</p>
          </NavbarItem>
        </li>
      </ul>

      <ul>
        <li className="w-full my-2 flex flex-row gap-4 items-center md:px-4 justify-center">
          <SunIcon className="hidden md:inline" />
          <ThemeSwitch />
          <MoonIcon className="hidden md:inline" />
        </li>
        <li>
          <NavbarItem href={user ? "#" : "/signin"}>
            {user?.image ? (
              <Image
                src={user?.image}
                width={24}
                height={24}
                alt="Profile Image"
                className="rounded-[50%]"
              />
            ) : (
              <User2Icon />
            )}
            <p className="hidden md:inline">{user?.name ?? "Login"}</p>
          </NavbarItem>
        </li>
      </ul>
    </div>
  );
}
