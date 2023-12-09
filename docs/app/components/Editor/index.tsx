"use client";
import { useDark } from "@/app/hooks/useDark";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { EditorProps } from "./type";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

function detectLanguage(fileName: string): string {
  const fileExtension = fileName.split(".").pop();

  if (!fileExtension) {
    return "";
  }

  const languageMap: { [key: string]: string[] } = {
    typescript: ["ts"],
    javascript: ["js"],
    css: ["css"],
    less: ["less"],
    scss: ["scss"],
    json: ["json"],
    html: ["html"],
    java: ["java"],
    yaml: ["yaml", "yml"],
  };

  const lowerCaseExtension = fileExtension.toLowerCase();

  const lang = Object.entries(languageMap).find(([_language, extensions]) =>
    extensions.includes(lowerCaseExtension),
  );

  return lang ? lang[0] : "";
}

export default function Editor({
  children,
  className,
  file,
  onChange,
  ...rest
}: EditorProps) {
  const { isDark } = useDark();
  const monaco = useRef<editor.IStandaloneCodeEditor>(null!);

  function handleChange(value: string | undefined) {
    onChange?.(value || "");
  }

  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    monaco.current = editor;
  }

  useEffect(() => {
    monaco.current?.setValue(file?.getContent() || "");
  }, [file]);

  return (
    <div className={clsx(className)} {...rest}>
      <div
        className={clsx("main-h flex w-full items-center justify-center", {
          hidden: file,
        })}
      >
        <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />{" "}
        <span>empty...</span>
      </div>
      <MonacoEditor
        theme={isDark ? "vs-dark" : "vs-light"}
        height="calc(100vh - 4rem - 1px)"
        language={detectLanguage(file?.getName() || "")}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        className={clsx({
          hidden: !file,
        })}
      />
    </div>
  );
}
