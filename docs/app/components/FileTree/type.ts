import { Explore, FileEntity, FolderEntity } from "./explore";

export interface FileTreeProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "onClick"
  > {
  explores: Explore[];
  onClick?: (explore: Explore, e: React.MouseEvent) => void;
  onCreate?: (explore: Explore) => void;
}

export interface FileProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  file: FileEntity;
}

export interface FolderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  folder: FolderEntity;
}

export interface FileExploreProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  explores: Explore[];
}
