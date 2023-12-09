"use client";

import clsx from "clsx";
import { useState } from "react";
import Editor from "../Editor";
import FileTree from "../FileTree";
import { Explore, FileEntity, FolderEntity } from "../FileTree/explore";
import Preview from "../Preview";
import { PlaygroundProps } from "./type";

export default function Playground({ className, ...rest }: PlaygroundProps) {
  const [currenFile, setcurrentFile] = useState<FileEntity>(null!);
  const [state, setState] = useState(false);

  const [explores] = useState<Explore>(
    new FolderEntity(
      ".sgen",
      [new FolderEntity("creator"), new FolderEntity("generator")],
      {
        forceUpdate: () => setState(!state),
        onClick,
        onCreate,
      },
    ),
  );

  function onClick(explore: Explore) {
    if (explore instanceof FileEntity) {
      console.log("click...");
      setcurrentFile(explore);
      console.log(explore);
    }
  }

  function onCreate(explore: Explore) {
    if (explore instanceof FileEntity) {
      console.log("create...");
      setcurrentFile(explore);
      console.log(explore);
    }
  }

  return (
    <section
      className={clsx("grid h-[calc(100vh-4rem-1px)] grid-cols-12", className)}
      {...rest}
    >
      <aside className="col-span-2">
        <FileTree explores={explores} onClick={onClick} onCreate={onCreate} />
      </aside>
      <div className="border-color-base col-span-5 border-l border-r">
        <Editor file={currenFile} />
      </div>
      <div className="col-span-5">
        <Preview />
      </div>
    </section>
  );
}
