import { Explore } from "../FileTree/explore";

export interface PlaygroundProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  explores: Explore | Explore[];
}
