import { writeFileSync } from "fs";
import type { MethodType } from "../types";
import { exportMethods } from "./methods";
import { exportTypes } from "./types";
import { exportSchemas } from "./schema";

export function exporter(methods: MethodType[], schemas: string) {
  const exportedTypes = exportTypes();
  const exportedMethods = exportMethods(methods);
  const exportedSchemas = exportSchemas(schemas);

  writeFileSync("../../packages/jsonrpc-types/src/types.ts", exportedTypes);
  writeFileSync("../../packages/jsonrpc-types/src/methods.ts", exportedMethods);
  writeFileSync("../../packages/jsonrpc-types/src/schemas.ts", exportedSchemas);
}
