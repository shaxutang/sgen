"use client";

import { useDark } from "@/app/hooks/useDark";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import clsx from "clsx";
import Link from "next/link";
import VariablesModalButton from "../VariablesModalButton";
import { NavBarProps } from "./type";

export default function NavBar({ className, ...rest }: NavBarProps) {
  const { isDark, toggle } = useDark();
  return (
    <header className={clsx(className, "border-color-base border-b")} {...rest}>
      <div className="flex h-16 items-center justify-between px-16">
        <Link href="/">
          <h1 className="text-xl font-bold">SGEN</h1>
        </Link>
        <div className="space-x-6">
          <div className="inline-block space-x-2">
            <Button color="primary">RUN</Button>
            <VariablesModalButton />
          </div>
          <Link href="https://github.com/shaxutang/sgen" target="_blank">
            <FontAwesomeIcon icon={faGithub} className="text-xl" />
          </Link>
          <button onClick={toggle}>
            <FontAwesomeIcon
              icon={isDark ? faMoon : faSun}
              className="text-xl"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
