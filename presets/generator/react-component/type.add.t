---
to: src/components/<%= name %>/type.ts
---
export interface <%= s.changeCase.pascalCase(name) %>Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}
