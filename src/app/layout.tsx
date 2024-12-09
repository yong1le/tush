import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Header from "./_components/header";

export const metadata: Metadata = {
  title: "Tush",
  description: "Generate device mockups for your images.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} `}>
      <body className="dark:bg-base-dark">
        <div
          className="relative h-screen bg-gradient-to-br from-transparent via-blue-400 via-30%
            to-transparent"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-fuchsia-400 via-60%
              to-transparent opacity-40"
          ></div>
          <div
            className="h-full bg-base-light/90 text-primary-light backdrop-blur-xl backdrop-opacity-0
              dark:bg-base-dark/70 dark:text-primary-dark dark:md:bg-base-dark/85"
          >
            <Header />
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
