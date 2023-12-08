import { FileEntity } from "../FileTree/explore";

export interface EditorProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  file?: FileEntity;
}
