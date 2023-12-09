"use client";

import { compileEjsTemplate } from "@/app/core/compile";
import clsx from "clsx";
import { useState } from "react";
import Editor from "../Editor";
import FileTree from "../FileTree";
import { Explore, FileEntity, FolderEntity } from "../FileTree/explore";
import Preview from "../Preview";
import { PlaygroundProps } from "./type";

export default function Playground({ className, ...rest }: PlaygroundProps) {
  const [state, setState] = useState(false);
  const [currenFile, setcurrentFile] = useState<FileEntity>(null!);
  const [preview, setPreview] = useState("");

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

  async function renderPreview() {
    const compile = compileEjsTemplate(currenFile?.getContent() || "");
    const { frontmatter, content } = await fetch("/api/render", {
      method: "POST",
      body: JSON.stringify({
        ...(compile ?? { frontmatter: {}, content: "" }),
      }),
    }).then((res) => res.json());
    setPreview([frontmatter, content].join("\n"));
  }

  function onClick(explore: Explore) {
    explore.setActive(true);
    if (explore instanceof FileEntity) {
      setcurrentFile(explore);
      renderPreview();
      console.log("click...", explore);
    }
  }

  function onCreate(explore: Explore) {
    if (explore instanceof FileEntity) {
      setcurrentFile(explore);
      renderPreview();
      console.log("create...", explore);
    }
  }

  function onChange(value: string) {
    currenFile?.setContent(value);
    renderPreview();
  }

  return (
    <section className={clsx("main-h grid grid-cols-12", className)} {...rest}>
      <aside className="col-span-2">
        <FileTree explores={explores} onClick={onClick} onCreate={onCreate} />
      </aside>
      <div className="border-color-base col-span-5 border-l border-r">
        <Editor file={currenFile} onChange={onChange} />
      </div>
      <div className="col-span-5">
        <Preview value={preview} />
      </div>
    </section>
  );
}
