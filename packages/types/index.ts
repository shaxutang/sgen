export type Sgenrc = Partial<{
  avatar: string;
  username: string;
  email: string;
  url: string;
  workspace: string;
  [prop: string]: any;
}>;

export type MergeSgenrc = {
  os: Sgenrc;
  cwd: Sgenrc;
  merge: Sgenrc;
};
