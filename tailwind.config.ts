import { type Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: colors.slate["900"],
          dark: colors.slate["300"],
        },
        secondary: {
          light: colors.slate["200"],
          dark: colors.slate["700"],
        },
        neutral: {
          light: colors.neutral["500"],
          dark: colors.neutral["400"],
        },
        base: {
          light: colors.slate["50"],
          dark: colors.slate["900"],
        },
        info: {
          light: colors.blue["300"],
          dark: colors.blue["500"],
        },
        success: {
          light: colors.emerald["300"],
          dark: colors.emerald["500"],
        },
        warning: {
          light: colors.amber["300"],
          dark: colors.amber["500"],
        },
        error: {
          light: colors.red["300"],
          dark: colors.red["500"],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
