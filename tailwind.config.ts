import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      primary: {
        light: "#202124",
        dark: "#f5f5f5",
      },
      secondary: {
        light: "#D1D5DB",
        dark: "#1f1f1f",
      },
      accent: {
        light: "#A0A0A0",
        dark: "#6B7280",
      },
      neutral: {
        light: "#4B5563",
        dark: "#6B7280",
      },
      base: {
        light: "#F8F8F8",
        dark: "#121212",
      },
      info: {
        light: "#3ABFF8",
        dark: "#0EA5E9",
      },
      success: {
        light: "#22C55E",
        dark: "#16A34A",
      },
      warning: {
        light: "#FACC15",
        dark: "#F59E0B",
      },
      error: {
        light: "#EF4444",
        dark: "#DC2626",
      },
    },
  },
  plugins: [],
} satisfies Config;
