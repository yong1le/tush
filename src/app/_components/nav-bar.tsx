import ThemeSwitch from "./theme-switch";
import {
  HomeIcon,
  ImagesIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";
import { trpc } from "~/trpc/server";
import NavbarItem from "~/app/_components/nav-bar-item";

export default async function Navbar() {
  const username = await trpc.user.getName();

  return (
    <div
      className="px-2 md:px-4 py-2 border-r-secondary-light dark:border-r-secondary-dark flex
        border-r flex-col justify-between"
    >
      <ul>
        <li>
          <NavbarItem href="/">
            <ImagesIcon />
            <h2 className="text-2xl font-bold hidden md:inline">tush</h2>
          </NavbarItem>
        </li>

        <hr className="border-secondary-light dark:border-secondary-dark my-2 md:my-4" />

        <li className="flex">
          <NavbarItem href="/dashboard">
            <HomeIcon />
            <p className="hidden md:inline">Dashboard</p>
          </NavbarItem>
        </li>
        <li>
          <NavbarItem href="#">
            <SearchIcon />
            <p className="hidden md:inline">Search</p>
          </NavbarItem>
        </li>
      </ul>

      <ul className="">
        <li className="w-full my-2 flex flex-row gap-4 items-center md:px-4 justify-center">
          <SunIcon className="hidden md:inline" />
          <ThemeSwitch />
          <MoonIcon className="hidden md:inline" />
        </li>
        <li>
          <NavbarItem href={username ? "#" : "/login"}>
            <SettingsIcon />
            <p className="hidden md:inline">{username ?? "Login"}</p>
          </NavbarItem>
        </li>
      </ul>
    </div>
  );
}
