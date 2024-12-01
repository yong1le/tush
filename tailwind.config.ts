import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: colors.blue, // Primary Text, Active states and buttons
        secondary: colors.fuchsia, // Secondary Text, Buttons
        accent: colors.lime, // Highlighted information
        base: colors.slate, // Primary backgrounds, borders, low constrast text

        info: colors.sky,
        success: colors.emerald,
        warning: colors.amber,
        error: colors.red,
      },
    },
  },
  plugins: [],
} satisfies Config;
