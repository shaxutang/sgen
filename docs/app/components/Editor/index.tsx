"use client";
import { useDark } from "@/app/hooks/useDark";
import MonacoEditor from "@monaco-editor/react";
import clsx from "clsx";
import { EditorProps } from "./type";

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
  ...rest
}: EditorProps) {
  const { isDark } = useDark();

  function handleChange(value: string | undefined) {
    file?.setContent(value || "");
  }

  return (
    <div className={clsx("h-full", className)} {...rest}>
      <MonacoEditor
        theme={isDark ? "vs-dark" : "vs-light"}
        height="100%"
        language={detectLanguage(file?.getName() || "javascript")}
        defaultLanguage="javascript"
        value={file?.getContent()}
        onChange={handleChange}
      />
    </div>
  );
}
