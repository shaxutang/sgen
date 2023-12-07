import { resolve } from "path";
import { defineConfig } from "vite";
// https://github.com/qmhc/vite-plugin-dts
import dts from "vite-plugin-dts";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "<%= s.changeCase.camelCase(name) %>",
      fileName: "index",
      formats: ["es", "cjs"],
    },
  },
});
