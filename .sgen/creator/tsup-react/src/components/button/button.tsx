import clsx from "clsx";
import { ButtonProps } from "./type";

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button className={clsx("t-button", className)} {...rest}>
      {children}
    </button>
  );
}
