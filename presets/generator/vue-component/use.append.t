---
to: src/index.ts
pattern: // app use component
---
app.use(<%= s.changeCase.pascalCase(name) %>);