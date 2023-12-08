---
to: app/components/<%= s.changeCase.pascalCase(name) %>/index.tsx
---
import clsx from "clsx";
import { <%= s.changeCase.pascalCase(name) %>Props } from "./type";

export default function <%= s.changeCase.pascalCase(name) %>({ children, className, ...rest }: <%= s.changeCase.pascalCase(name) %>Props) {
  return (
    <div className={clsx(className)} {...rest}>
      {children}
    </div>
  );
}

<!-- sgen seperator -->

---
to: app/components/<%= s.changeCase.pascalCase(name) %>/type.ts
---
export interface <%= s.changeCase.pascalCase(name) %>Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}
