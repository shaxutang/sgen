---
to: src/index.ts
pattern: // import component
---
import <%= s.changeCase.pascalCase(name) %> from "./components/<%= name %>";