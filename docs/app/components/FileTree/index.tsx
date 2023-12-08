"use client";

import clsx from "clsx";
import { useState } from "react";
import FileExplore from "./FileExplore";
import { Explore } from "./explore";
import { FileTreeProps } from "./type";

export default function FileTree({
  className,
  explores: expls,
  onClick,
  onCreate,
  ...rest
}: FileTreeProps) {
  const [explores] = useState<Explore[]>(expls);

  return (
    <div className={clsx("px-2 py-4", className)} {...rest}>
      <FileExplore explores={explores} />
    </div>
  );
}
