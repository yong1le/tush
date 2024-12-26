import "~/styles/globals.css";

import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/client";

export const metadata: Metadata = {
  title: "Tush",
  description: "Generate device mockups for your images.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const font = Poppins({
  weight: ["400", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${font.className} `} suppressHydrationWarning>
      <body
        className="dark:bg-base-dark bg-base-light text-primary-light dark:text-primary-dark
          box-border"
      >
        <ThemeProvider attribute="class">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
