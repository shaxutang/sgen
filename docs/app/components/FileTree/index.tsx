"use client";

import clsx from "clsx";
import FileExplore from "./FileExplore";
import { FolderEntity } from "./explore";
import { FileTreeProps } from "./type";

export default function FileTree({
  className,
  explores,
  onClick,
  onCreate,
  ...rest
}: FileTreeProps) {
  const root = new FolderEntity(
    "/",
    Array.isArray(explores) ? explores : [explores],
  );

  return (
    <div className={clsx("px-2 py-4", className)} {...rest}>
      <FileExplore explores={root.getExplores()} />
    </div>
  );
}
