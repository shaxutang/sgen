"use client";

import { faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRef, useState } from "react";
import MdiFilePlusOutline from "../Icons/MdiFilePlusOutline";
import TablerFolderPlus from "../Icons/TablerFolderPlus";
import FileExplore from "./FileExplore";
import { Explore, FileEntity, FolderEntity } from "./explore";
import { FolderProps } from "./type";

export default function Folder(props: FolderProps) {
  const { folder } = props;

  const inputRef = useRef<HTMLInputElement>(null!);

  const [open, setOpen] = useState<boolean>(false);
  const [createType, setCreateType] = useState<"file" | "folder">(null!);
  const [input, setInput] = useState("");
  const [createState, setCreateState] = useState(false);

  const [name, path, explores] = [
    folder.getName(),
    folder.getPath(),
    folder.getExplores(),
  ];

  const sortExplores = () => {
    const directories = explores
      .filter((explore) => explore.getType() === "directory")
      .sort();
    const files = explores
      .filter((explore) => explore.getType() === "file")
      .sort();
    return [...directories, ...files];
  };

  function create() {
    if (!createType) return;
    let explore: Explore;
    if (createType === "folder") {
      explore = new FolderEntity(input);
      folder.createFolder(explore);
    } else {
      explore = new FileEntity(input);
      folder.createFile(explore);
    }
    folder.onCreate(explore);
  }

  let index: NodeJS.Timeout;

  function handleCreateFile(e: React.MouseEvent) {
    clearTimeout(index);
    e.stopPropagation();
    setCreateType("file");
    setCreateState(true);
    setOpen(true);
    index = setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  }

  function handleCreateFolder(e: React.MouseEvent) {
    clearTimeout(index);
    e.stopPropagation();
    setCreateType("folder");
    setCreateState(true);
    setOpen(true);
    index = setTimeout(() => {
      inputRef.current.focus();
    }, 200);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleBlur() {
    if (!!input) create();
    setCreateState(false);
    setInput("");
    setCreateState(false);
  }

  function handleEnder(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter") {
      create();
      setInput("");
      setCreateState(false);
    }
  }

  function handleClick(e: React.MouseEvent) {
    setOpen(!open);
    folder.onClick(e);
  }

  return (
    <div data-path={path}>
      <div
        className="explore group flex items-center justify-between"
        onClick={handleClick}
      >
        <div>
          <div className="text-sm leading-loose">
            <div className="inline-block w-5">
              <FontAwesomeIcon
                icon={open ? faFolderOpen : faFolder}
                className="mr-1"
              />
            </div>
            <span>{name}</span>
          </div>
        </div>
        <div className="hidden space-x-2 text-gray-400  group-hover:block">
          <button
            className="relative align-text-top text-lg transition-all hover:text-gray-500 dark:hover:text-white"
            onClick={handleCreateFolder}
          >
            <TablerFolderPlus />
          </button>
          <button
            className="relative align-text-top text-lg transition-all hover:text-gray-500 dark:hover:text-white"
            onClick={handleCreateFile}
          >
            <MdiFilePlusOutline />
          </button>
        </div>
      </div>
      <div className="border-color-base border-l pl-2">
        <input
          ref={inputRef}
          value={input}
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleEnder}
          className={clsx(
            "w-full border-none bg-gray-100 pl-2 text-sm outline-none dark:bg-slate-600",
            {
              hidden: !createState,
            },
          )}
        />
        <div
          className={clsx({
            hidden: !open,
          })}
        >
          <FileExplore explores={sortExplores()} />
        </div>
      </div>
    </div>
  );
}
