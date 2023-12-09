import { Explore, FileEntity, FolderEntity } from "./explore";

export interface FileTreeProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "onClick"
  > {
  explores: Explore | Explore[];
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
