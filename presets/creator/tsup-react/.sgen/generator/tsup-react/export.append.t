---
to: src/index.ts
pattern: // export component
---
export { default as <%= s.changeCase.pascalCase(name) %> } from "./components/<%= name %>";