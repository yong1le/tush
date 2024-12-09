"use client";

import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import { getTheme, setTheme } from "../_lib/theme-switcher";

const ThemeSwitch = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (getTheme() == "dark") {
      setEnabled(true);
      setTheme("dark");
    }
  }, []);

  const changeTheme = () => {
    if (enabled) {
      setTheme("light");
    } else {
      setTheme("dark");
    }

    setEnabled(!enabled);
  };
  return (
    <Switch
      checked={enabled}
      onChange={changeTheme}
      className="group inline-flex h-6 w-11 items-center rounded-full bg-secondary-light
        transition data-[checked]:bg-secondary-dark"
    >
      <span
        className="size-4 translate-x-1 rounded-full bg-primary-light transition
          group-data-[checked]:translate-x-6 dark:bg-primary-dark"
      />
    </Switch>
  );
};

export default ThemeSwitch;
