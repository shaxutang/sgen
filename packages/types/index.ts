export type Sgenrc = Partial<{
  avatar: string;
  username: string;
  email: string;
  url: string;
  workspace: string;
  [prop: string]: any;
}>;

export type MergeSgenrc = {
  cwd: Sgenrc;
  os: Sgenrc;
  merge: Sgenrc;
};

export type File = {
  name: string;
  path: string;
  size: number;
  type: "file";
  extension?: string;
};

export type Folder = {
  name: string;
  path: string;
  size: number;
  type: "directory";
  children: MabeFile[];
};

export type MabeFile = Folder | File;

export type MergeDirTree = {
  sgenDirTree: Folder;
  workspaceDirTree: Folder;
};
