import { FileEntity } from "../FileTree/explore";

export interface EditorProps
  extends Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    "onChange"
  > {
  file?: FileEntity;
  onChange?: (value: string) => void;
}
