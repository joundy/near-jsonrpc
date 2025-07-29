import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  minify: true,
  clean: true,
  outDir: "dist",
  external: ["@near-js/jsonrpc-types"],
});
