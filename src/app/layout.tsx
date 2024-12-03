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
    <html
      lang="en"
      className={`${GeistSans.variable} bg-base-light text-primary-light dark:bg-base-dark dark:text-primary-dark`}
    >
      <body>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
}
