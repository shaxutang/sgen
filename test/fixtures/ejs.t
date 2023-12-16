---
to: src/components/<%= name %>/<%= name %>.tsx
---
import clsx from "clsx";
import { <%= s.changeCase.pascalCase(name) %>Props } from "./type";

export default function <%= s.changeCase.pascalCase(name) %>({ children, className, ...rest }: <%= s.changeCase.pascalCase(name) %>Props) {
  return (
    <div className={clsx("t-<%= name %>", className)} {...rest}>
      {children}
    </div>
  );
}

<!-- truncate -->

---
to: src/components/<%= name %>/styles.css
---
.<%= name %> {

}
