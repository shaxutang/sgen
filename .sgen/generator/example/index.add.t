---
to: src/components/<%= name %>/index.ts
---
/**
* @author <%= sgenrc.username %>
* @email <%= sgenrc.email %>
*/
import <%= s.changeCase.pascalCase(name) %> from "./<%= name %>";
import "./style.css";

export default <%= s.changeCase.pascalCase(name) %>;
