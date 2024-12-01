import { type Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: colors.blue["300"],
          dark: colors.blue["600"],
        },
        secondary: {
          light: colors.fuchsia["300"],
          dark: colors.fuchsia["600"],
        },
        accent: {
          light: colors.lime["400"],
          dark: colors.lime["600"],
        },
        muted: {
          light: colors.slate["200"],
          dark: colors.slate["800"],
        },
        base: {
          light: colors.slate["50"],
          dark: colors.slate["700"],
        },
        info: {
          light: colors.sky["300"],
          dark: colors.sky["600"],
        },
        success: {
          light: colors.emerald["300"],
          dark: colors.emerald["600"],
        },
        warning: {
          light: colors.amber["300"],
          dark: colors.amber["600"],
        },
        error: {
          light: colors.red["300"],
          dark: colors.red["600"],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
