import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { clsx } from "clsx";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./components/NavBar";
import "./globals.css";
import { Providers } from "./providers";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SGEN | Welcome",
  description: "A simple cli tool to generate a project.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SGEN | Welcome</title>
      </head>
      <body
        className={clsx(
          inter.className,
          "bg-white text-gray-600 dark:bg-[#252525] dark:text-white",
        )}
      >
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
