import * as changeCase from "change-case";
import fg from "fast-glob";
import { writeFileSync } from "fs";
import { join } from "path";
import { name as pkgName } from "../package.json";

// Component prefix
const componentPrefix = "v";
// Regular expression for matching component paths
const regex = /src\/components\/([^/]+)\/index\.ts/;
// Get all component paths
const componentPaths = fg.sync("src/components/*/index.ts");
// Extract component names
const componentEntryNames = componentPaths.map((path) => path.match(regex)![1]);

const componentsStr = componentEntryNames
  .map(
    (name) =>
      " ".repeat(4) +
      changeCase.pascalCase(`${componentPrefix}_${name}`) +
      `: (typeof import("${pkgName}"))["${changeCase.pascalCase(name)}"];`,
  )
  .join("\n");

const dts = [
  "export {};",
  'declare module "vue" {',
  "  export interface GlobalComponents {",
  componentsStr,
  "  }",
  "}",
].join("\n");

writeFileSync(join(process.cwd(), "global.d.ts"), dts, "utf-8");

console.log("[dts]: Build success.");
