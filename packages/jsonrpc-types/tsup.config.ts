import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    methods: "src/methods.ts",
    schemas: "src/schemas.ts",
    types: "src/types.ts",
    "mapped-properties": "src/mapped-properties.ts",
    "zod-schemas": "src/zod-schemas.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
});
