import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
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
      className={`${GeistSans.variable} `}
      suppressHydrationWarning
    >
      <body className="dark:bg-base-dark bg-base-light">
        <ThemeProvider attribute="class">
          <Header />
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
