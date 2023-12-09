import clsx from "clsx";
import { PreviewProps } from "./type";

export default function Preview({ value, className, ...rest }: PreviewProps) {
  return (
    <div className={clsx("main-h", className)} {...rest}>
      <pre className="block h-full w-full text-sm">{value}</pre>
    </div>
  );
}
