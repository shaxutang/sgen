import "dotenv/config";
import { defineConfig, Options } from "tsup";

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const isProd = process.env.NODE_ENV === "production";

const propdOptions: Options = {
  dts: true,
  sourcemap: true,
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
    Github: JSON.stringify({
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET,
    }),
  },
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: isProd,
  minify: true,
  publicDir: "public",
  ...(isProd ? propdOptions : {}),
});
