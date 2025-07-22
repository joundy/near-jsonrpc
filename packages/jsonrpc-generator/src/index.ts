import { getOpenApiSpecLocal, getUniqueSchemas } from "./utils";
import { generateOpenapiTS } from "./utils/openapi-ts";
import { parseOpenapiTS } from "./openapi-typescript-parser";
import { buildTypes } from "./builder/build-types";
import { buildMethods } from "./builder/build-methods";
import { buildSchemas } from "./builder/build-schemas";
import { buildMappedProperties } from "./builder/build-mapped-properties";
import { writeFileSync } from "fs";
import { generateZodSchemas } from "./zod-generator";
import { buildZodSchemas } from "./builder/build-zod-schema";
import { validateZodSchema } from "./zod-validator";

const SCHEMA_SUFFIX = "Type";
const ZOD_SCHEMA_SUFFIX = "Schema";

async function main() {
  console.info("📄 Getting OpenAPI spec...");
  const spec = getOpenApiSpecLocal();

  console.info("🔄 Generating TypeScript from OpenAPI...");
  const openapiTS = await generateOpenapiTS(spec);

  console.info("🔍 Parsing generated TypeScript...");
  const parsed = parseOpenapiTS(openapiTS);

  console.info("🏗️ Building output files...");
  const neededSchemas = getUniqueSchemas(parsed.methods);

  console.info("  ├─ 📝 Building types...");
  const builtTypes = buildTypes();

  console.info("  ├─ 🔌 Building methods...");
  const builtMethods = buildMethods(parsed.methods, neededSchemas, {
    schemasLocation: "./schemas",
    typesLocation: "./types",
  });

  console.info("  ├─ 📊 Building schemas...");
  const builtSchemas = buildSchemas(parsed.schemas.schemaTypes);

  console.info("  └─ 🔄 Building property mappings...");
  const builtMappedProperties = buildMappedProperties(
    parsed.schemas.mappedSnakeCamelProperty
  );

  console.info("✨ Generating Zod from schemas...");
  const zodSchemas = generateZodSchemas(builtSchemas, ZOD_SCHEMA_SUFFIX);

  const builtZodSchemas = buildZodSchemas(zodSchemas.zodSchemas, {
    schemasLocation: "./schemas",
    schemaDependencies: zodSchemas.dependencies,
  });

  console.info("  ├─ 📊 Validating Zod schemas to ensure 1:1 with TS schemas...");
  await validateZodSchema({
    schemas: parsed.schemas.schemaTypes.map((schema) => schema.schema),
    schemaTs: builtSchemas,
    zodSchemaTs: builtZodSchemas,
    zodSchemaSuffix: ZOD_SCHEMA_SUFFIX,
  });

  console.info("💾 Saving output files...");
  writeFileSync("../../packages/jsonrpc-types/src/types.ts", builtTypes);
  writeFileSync("../../packages/jsonrpc-types/src/methods.ts", builtMethods);
  writeFileSync("../../packages/jsonrpc-types/src/schemas.ts", builtSchemas);
  writeFileSync(
    "../../packages/jsonrpc-types/src/zod-schemas.ts",
    builtZodSchemas
  );
  writeFileSync(
    "../../packages/jsonrpc-types/src/mapped-properties.ts",
    builtMappedProperties
  );
}

main();
