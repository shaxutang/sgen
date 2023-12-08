import { defineConfig, Options } from "tsup";

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const isProd = process.env.NODE_ENV === "production";

const propdOptions: Options = {
  treeshake: true,
  esbuildOptions(options) {
    options.chunkNames = "chunks/[name]";
  },
};

export default defineConfig({
  define: {
    isDev: isDev + "",
    isTest: isTest + "",
    isProd: isProd + "",
  },
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: isProd,
  minify: true,
  ...(isProd ? propdOptions : {}),
});
