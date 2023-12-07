import fg from "fast-glob";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import vue from "@vitejs/plugin-vue";

// Regular expression for matching component paths
const regex = /src\/components\/([^/]+)\/index\.ts/;
// Get all component paths
const componentPaths = fg.sync("src/components/*/index.ts");
// Extract component names
const componentEntryNames = componentPaths.map((path) => path.match(regex)![1]);
// Map component paths to an object
const componentEntries = componentPaths.reduce((entries, path) => {
  const name = path.match(regex)![1];
  return { ...entries, [name]: path };
}, {});

// Check if it's a component entry
function isComponentEntry(name: string) {
  return componentEntryNames.includes(name);
}

/**
 * Vite configuration file
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    dts({
      include: ["src/*.ts", "src/components/**/*.{ts,vue}"],
    }),
  ],
  build: {
    lib: {
      entry: {
        // Main entry
        index: "src/index.ts",
        // Component entries
        ...componentEntries,
        // Style merge entry
        merge: "src/index.css",
      },
      // Library name
      name: "<%= s.changeCase.camelCase(name) %>",
      // File naming rule
      fileName: (format, name) => {
        const formatExtension = format === "es" ? "js" : "cjs";

        if (isComponentEntry(name)) {
          // Component file naming rule
          return `components/${name}/index.${formatExtension}`;
        }
        // Non-component file naming rule
        return `${name}.${formatExtension}`;
      },
      // Supported formats
      formats: ["cjs", "es"],
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Rollup configuration
    rollupOptions: {
      external: ["vue"],
      output: {
        // CSS file naming rule
        assetFileNames: ({ name }) => {
          if (name?.endsWith(".css")) {
            const cssName = name?.replace(".css", "");
            if (cssName === "merge") {
              // Merged style file name
              return "index.css";
            }
            if (isComponentEntry(cssName))
              // Component style file naming rule
              return `components/${cssName}/index.css`;
          }
          return name!;
        },
        // JS file naming rule
        chunkFileNames: "chunks/[name].[format].js",
      },
    },
  },
});
