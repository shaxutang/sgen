
import clsx from "clsx";
import { PreviewProps } from "./type";

export default function Preview({ children, className, ...rest }: PreviewProps) {
  return (
    <div className={clsx(className)} {...rest}>
      {children}
    </div>
  );
}