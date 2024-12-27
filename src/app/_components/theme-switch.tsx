"use client";

import { Switch } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const changeTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Switch
      checked={mounted ? resolvedTheme === "dark" : false}
      onChange={changeTheme}
      className="group inline-flex h-6 w-8 md:w-11 items-center rounded-full bg-secondary-light
        transition data-[checked]:bg-secondary-dark"
    >
      <span
        className="size-4 translate-x-1 rounded-full bg-primary-light transition
          md:group-data-[checked]:translate-x-6 dark:bg-primary-dark
          group-data-[checked]:translate-x-3"
      />
    </Switch>
  );
};

export default ThemeSwitch;
