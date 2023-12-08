"use client";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { clsx } from "clsx";
import { Inter } from "next/font/google";
import useDarkMode from "use-dark-mode";
import NavBar from "./components/NavBar";
import "./globals.css";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const darkMode = useDarkMode(false);
  return (
    <html lang="en" className={darkMode.value ? "dark" : "light"}>
      <head>
        <title>SGEN | Welcome</title>
      </head>
      <body className={clsx(inter.className)}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
