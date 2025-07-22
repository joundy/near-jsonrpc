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

const ZOD_SCHEMA_SUFFIX = "Schema";

// Output paths
const OUTPUT_BASE_PATH = "../../packages/jsonrpc-types/src";
const TYPES_FILE = "types.ts";
const METHODS_FILE = "methods.ts";
const SCHEMAS_FILE = "schemas.ts";
const ZOD_SCHEMAS_FILE = "zod-schemas.ts";
const MAPPED_PROPERTIES_FILE = "mapped-properties.ts";

// Import locations
const SCHEMAS_LOCATION = "./schemas";
const TYPES_LOCATION = "./types";
const ZOD_LOCATION = "./zod-schemas";

async function main() {
  console.info("📄 Getting OpenAPI spec...");
  const spec = getOpenApiSpecLocal();

  console.info("🔄 Generating TypeScript from OpenAPI...");
  const openapiTS = await generateOpenapiTS(spec);

  console.info("🔍 Parsing generated TypeScript...");
  const parsed = parseOpenapiTS(openapiTS);

  console.info("🏗️ Building output files...");
  const neededSchemas = getUniqueSchemas(parsed.methods);

  console.info(" 📝 Building types...");
  const builtTypes = buildTypes();

  console.info("🔌 Building methods...");
  const builtMethods = buildMethods(parsed.methods, neededSchemas, {
    schemasLocation: SCHEMAS_LOCATION,
    typesLocation: TYPES_LOCATION,
    zodSchemaLocation: ZOD_LOCATION,
    zodSuffix: ZOD_SCHEMA_SUFFIX,
  });

  console.info("📊 Building schemas...");
  const builtSchemas = buildSchemas(parsed.schemas.schemaTypes);

  console.info("🔄 Building property mappings...");
  const builtMappedProperties = buildMappedProperties(
    parsed.schemas.mappedSnakeCamelProperty
  );

  console.info("✨ Generating Zod from schemas...");
  const zodSchemas = generateZodSchemas(builtSchemas, ZOD_SCHEMA_SUFFIX);

  const builtZodSchemas = buildZodSchemas(zodSchemas.zodSchemas, {
    schemasLocation: SCHEMAS_LOCATION,
    schemaDependencies: zodSchemas.dependencies,
  });

  console.info(
    "📊 Validating Zod schemas to ensure 1:1 with TS schemas compatibility..."
  );
  await validateZodSchema({
    schemas: parsed.schemas.schemaTypes.map((schema) => schema.schema),
    schemaTs: builtSchemas,
    zodSchemaTs: builtZodSchemas,
    zodSchemaSuffix: ZOD_SCHEMA_SUFFIX,
    validateAll: true, // set to false to validate one by one
  });

  console.info("💾 Saving output files...");
  writeFileSync(`${OUTPUT_BASE_PATH}/${TYPES_FILE}`, builtTypes);
  writeFileSync(`${OUTPUT_BASE_PATH}/${METHODS_FILE}`, builtMethods);
  writeFileSync(`${OUTPUT_BASE_PATH}/${SCHEMAS_FILE}`, builtSchemas);
  writeFileSync(`${OUTPUT_BASE_PATH}/${ZOD_SCHEMAS_FILE}`, builtZodSchemas);
  writeFileSync(`${OUTPUT_BASE_PATH}/${MAPPED_PROPERTIES_FILE}`, builtMappedProperties);
}

main();
