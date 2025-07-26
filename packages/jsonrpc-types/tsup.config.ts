import { defineConfig } from "tsup";

export default defineConfig([
  // Main exports with DTS
  {
    entry: {
      index: "src/index.ts",
      methods: "src/methods.ts",
      schemas: "src/schemas.ts",
      types: "src/types.ts",
      "mapped-properties": "src/mapped-properties.ts",
    },
    format: ["cjs", "esm"],
    dts: true,
    splitting: true,
    minify: true,
    clean: true,
    outDir: "dist",
  },
  // Zod schemas without DTS (to save space)
  {
    entry: { "zod-schemas": "src/zod-schemas.ts" },
    format: ["cjs", "esm"],
    dts: false,
    splitting: true,
    minify: true,
    clean: false,
    outDir: "dist",
  },
]);
