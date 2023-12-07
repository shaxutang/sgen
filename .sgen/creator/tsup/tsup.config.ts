import { defineConfig } from "tsup";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  treeshake: true,
  sourcemap: true,
  splitting: true,
  minify: true,
  watch: !isProd,
  clean: ["dist/chunks"],
  esbuildOptions(options) {
    options.chunkNames = "chunks/[name].[hash]";
  },
});
