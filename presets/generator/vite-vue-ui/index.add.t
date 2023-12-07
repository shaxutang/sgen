---
to: src/components/<%= name %>/index.ts
---
import { Comp } from "@/type";
import { withInstall } from "@/utils/install";
import <%= s.changeCase.pascalCase(name) %> from "./<%= name %>.vue";
import "./style.css";

<%= s.changeCase.pascalCase(name) %>.install = withInstall(<%= s.changeCase.pascalCase(name) %>);

export default <%= s.changeCase.pascalCase(name) %> as Comp<typeof <%= s.changeCase.pascalCase(name) %>>;

export * from "./type";
