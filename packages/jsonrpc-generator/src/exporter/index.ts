import { writeFileSync } from "fs";
import type { MethodType, SchemaType } from "../types";
import { exportMethods } from "./export-methods";
import { exportTypes } from "./export-types";
import { exportSchemas } from "./export-schema";

export function exporter(methodTypes: MethodType[], schemaTypes: SchemaType[]) {
  const uniqueNeededSchemasSet = new Set<string>();
  for (const methodType of methodTypes) {
    uniqueNeededSchemasSet.add(methodType.request.schema);
    uniqueNeededSchemasSet.add(methodType.response.schema);
    uniqueNeededSchemasSet.add(methodType.error.schema);
  }
  const neededSchemas = Array.from(uniqueNeededSchemasSet);

  const exportedTypes = exportTypes();
  const exportedMethods = exportMethods(methodTypes, neededSchemas);
  const exportedSchemas = exportSchemas(schemaTypes);

  writeFileSync("../../packages/jsonrpc-types/src/types.ts", exportedTypes);
  writeFileSync("../../packages/jsonrpc-types/src/methods.ts", exportedMethods);
  writeFileSync("../../packages/jsonrpc-types/src/schemas.ts", exportedSchemas);
}
