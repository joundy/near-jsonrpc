import { writeFileSync } from "fs";
import type { MethodType, SchemaType } from "../types";
import { exportMethods } from "./export-methods";
import { exportTypes } from "./export-types";
import { exportSchemas } from "./export-schema";
import { exportMappedProperties } from "./export-mapped-properties";

export function exporter(
  methodTypes: MethodType[],
  schemaTypes: SchemaType[],
  mappedSnakeCamelProperty: Map<string, string>
) {
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
  const exportedMappedProperties = exportMappedProperties(
    mappedSnakeCamelProperty
  );

  writeFileSync("../../packages/jsonrpc-types/src/types.ts", exportedTypes);
  writeFileSync("../../packages/jsonrpc-types/src/methods.ts", exportedMethods);
  writeFileSync("../../packages/jsonrpc-types/src/schemas.ts", exportedSchemas);
  writeFileSync(
    "../../packages/jsonrpc-types/src/mapped-properties.ts",
    exportedMappedProperties
  );
}
