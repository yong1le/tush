export function setTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") {
    console.warn("This function should be run in the browser");
    return;
  }

  const html = document.documentElement;

  if (theme === "dark") {
    localStorage.setItem("theme", "dark");
    html.classList.add("dark");
  } else {
    localStorage.setItem("theme", "light");
    html.classList.remove("dark");
  }
}

export function getTheme() {
  if (typeof window === "undefined") {
    console.warn("This function should be run in the browser");
    return;
  }

  const theme = localStorage.getItem("theme");

  if (theme !== "dark" && theme !== "light") {
    console.warn("Invalid theme value in local storage");
    return "light";
  }

  return theme ?? "light";
}
