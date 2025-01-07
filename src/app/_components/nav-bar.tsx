import ThemeSwitch from "./theme-switch";
import {
  HomeIcon,
  ImagesIcon,
  MoonIcon,
  User2Icon,
  SunIcon,
  LaptopIcon,
  FolderSyncIcon,
  SquareChevronUpIcon,
} from "lucide-react";
import { trpc } from "~/trpc/server";
import NavbarItem from "~/app/_components/nav-bar-item";
import Image from "next/image";

export default async function Navbar() {
  const user = await trpc.user.getUser();

  return (
    <div
      className="px-2 md:px-4 py-2 border-r-secondary-light dark:border-r-secondary-dark flex
        border-r flex-row md:flex-col h-full justify-normal gap-2"
    >
      <ul>
        <li>
          <NavbarItem href="/">
            <ImagesIcon />
            <h2 className="text-2xl font-bold hidden md:inline">tush</h2>
          </NavbarItem>
        </li>
      </ul>

      <hr className="hidden md:inline border-secondary-light dark:border-secondary-dark my-2 md:my-4" />

      <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto flex-1">
        {user && (
          <li>
            <NavbarItem href="/dashboard">
              <HomeIcon />
              <p className="hidden md:inline">Dashboard</p>
            </NavbarItem>
          </li>
        )}
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
        {/* <li> */}
        {/*   <NavbarItem href="/upscale"> */}
        {/*     <SquareChevronUpIcon /> */}
        {/*     <p className="hidden md:inline">Upscale</p> */}
        {/*   </NavbarItem> */}
        {/* </li> */}
      </ul>

      <ul className="flex flex-row md:flex-col gap-2 shrink-0">
        <li className="w-full my-2 flex flex-row gap-4 items-center md:px-4">
          <SunIcon className="hidden md:inline" />
          <ThemeSwitch />
          <MoonIcon className="hidden md:inline" />
        </li>
        <li>
          <NavbarItem href={user ? "#" : "/signin"}>
            {user?.image ? (
              <div className="relative w-[24px] h-[24px]">
                <Image
                  src={user.image}
                  fill={true}
                  alt="Profile Image"
                  className="rounded-[50%]"
                />
              </div>
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
