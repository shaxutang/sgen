import clsx from "clsx";
import { ButtonGroupProps } from "./type";

export default function ButtonGroup({
  children,
  className,
  ...rest
}: ButtonGroupProps) {
  return (
    <div className={clsx("t-button-group", className)} {...rest}>
      {children}
    </div>
  );
}
