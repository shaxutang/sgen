"use client";

import {
  Frontmatter,
  GENERATOR_SEPERATOR,
  compileEjsTemplate,
} from "@/app/core/compile";
import { isCreator, isGenerator } from "@/app/core/sgen";
import clsx from "clsx";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Editor from "../Editor";
import FileTree from "../FileTree";
import {
  Context,
  Explore,
  FileEntity,
  FolderEntity,
} from "../FileTree/explore";
import Preview from "../Preview";
import { StoreVariables } from "../VariablesModalButton";
import { PlaygroundProps } from "./type";

export default function Playground({ className, ...rest }: PlaygroundProps) {
  const [state, setState] = useState(false);
  const [currentFile, setcurrentFile] = useState<FileEntity>(null!);
  const [preview, setPreview] = useState("");
  const [variables] = useLocalStorage<StoreVariables>("variables", {
    sgenrc: {
      username: "shaxutang",
      email: "olaysunju@163.com",
    },
    name: "sgen",
  });

  const context = new Context({
    forceUpdate: () => setState(!state),
    onClick,
    onCreate,
  });

  const [explores] = useState<Explore>(
    new FolderEntity(
      ".sgen",
      [
        new FolderEntity("creator", [
          new FolderEntity("tsup", [
            new FolderEntity("src", [
              new FileEntity("index.ts", `const name="<%= name %>"`),
            ]),
            new FileEntity(
              "package.json",
              JSON.stringify(
                {
                  name: "<%= name %>",
                  homepage:
                    "https://github.com/<%= sgenrc.username %>/<%= name %>#readme",
                  repository: {
                    type: "git",
                    url: "git+https://github.com/<%= sgenrc.username %>/<%= name %>.git",
                  },
                  bugs: {
                    url: "https://github.com/<%= sgenrc.username %>/<%= name %>/issues",
                  },
                  author: "<%= sgenrc.username %> <<%= sgenrc.email%>>",
                },
                null,
                2,
              ),
            ),
          ]),
        ]),
        new FolderEntity("generator", [
          new FolderEntity("rc-components", [
            new FileEntity(
              "comp.add.t",
              [
                "---",
                "to: src/components/<%= s.changeCase.pascalCase(name) %>.tsx",
                "---",
                "export default function <%= s.changeCase.pascalCase(name) %>() {",
                "  return <div></div>;",
                "}",
              ].join("\n"),
            ),
            new FileEntity(
              "index.append.t",
              [
                "---",
                "to: src/index.ts",
                "pattern: // export component",
                "---",
                'export { default as <%= s.changeCase.pascalCase(name) %> } from "./comopnents/<%= s.changeCase.pascalCase(name) %>.tsx;"',
              ].join("\n"),
            ),
          ]),
        ]),
      ],
      context,
    ),
  );

  async function renderPreview() {
    if (!currentFile) return;

    if (isCreator(currentFile)) {
      const { content } = await fetch("/api/render/creator", {
        method: "POST",
        body: JSON.stringify({
          content: currentFile.getContent() ?? "",
          variables,
        }),
      }).then((res) => res.json());
      setPreview(content);
      return;
    }

    if (isGenerator(currentFile)) {
      const templates = currentFile
        .getContent()
        .split(GENERATOR_SEPERATOR)
        .map((content) => compileEjsTemplate(content))
        .filter((str) => !!str);
      const { templates: renderTemplates } = await fetch(
        "/api/render/generator",
        {
          method: "POST",
          body: JSON.stringify({
            templates,
            variables,
          }),
        },
      ).then((res) => res.json());

      const preview = (
        renderTemplates as {
          frontmatter: Frontmatter;
          content: string;
        }[]
      )
        .map(({ frontmatter, content }) => [frontmatter, content].join("\n"))
        .join("\n\n");
      setPreview(preview);
      return;
    }

    setPreview(
      ["`SGEN` will ignore the file", currentFile.getContent()].join("\n"),
    );
  }

  async function onClick(explore: Explore) {
    explore.setActive(true);
    if (explore instanceof FileEntity) {
      setcurrentFile(explore);
      await renderPreview();
      console.log("click...", explore.getPath());
    }
  }

  async function onCreate(explore: Explore) {
    if (explore instanceof FileEntity) {
      setcurrentFile(explore);
      await renderPreview();
      console.log("create...", explore);
    }
  }

  function onChange(value: string) {
    currentFile?.setContent(value);
    renderPreview();
  }

  return (
    <section className={clsx("main-h grid grid-cols-12", className)} {...rest}>
      <aside className="col-span-2">
        <FileTree explores={explores} />
      </aside>
      <div className="border-color-base col-span-5 border-l border-r">
        <Editor file={currentFile} onChange={onChange} />
      </div>
      <div className="col-span-5">
        <Preview value={preview} />
      </div>
    </section>
  );
}
