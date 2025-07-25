import { getOpenApiSpecFromNearcore } from "./utils";
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
import { MethodType, SchemaType } from "./types";
import {
  ZOD_SCHEMA_SUFFIX,
  OUTPUT_BASE_PATH,
  TYPES_FILE,
  METHODS_FILE,
  SCHEMAS_FILE,
  ZOD_SCHEMAS_FILE,
  MAPPED_PROPERTIES_FILE,
  SCHEMAS_LOCATION,
  TYPES_LOCATION,
  ZOD_LOCATION,
} from "./constants";

async function main() {
  console.info("📄 Getting OpenAPI spec from nearcore repository...");
  const spec = await getOpenApiSpecFromNearcore();

  console.info("🔄 Generating TypeScript from OpenAPI...");
  const openapiTS = await generateOpenapiTS(spec);

  console.info("🔍 Parsing generated TypeScript...");
  const parsed = parseOpenapiTS(openapiTS);

  console.info("🏗️ Building output files...");

  console.info(" 📝 Building types...");
  const builtTypes = buildTypes();

  console.info("📊 Building schemas...");
  const builtSchemas = buildSchemas(parsed.schemas.schemaTypes);

  console.info("🔄 Building property mappings...");
  const builtMappedProperties = buildMappedProperties(
    parsed.schemas.mappedSnakeCamelProperty
  );

  console.info("✨ Generating Zod from schemas...");
  const zodSchemas = generateZodSchemas(builtSchemas, ZOD_SCHEMA_SUFFIX);

  const builtZodSchemas = buildZodSchemas(zodSchemas.zodSchemas, {
    schemaDependency:
      zodSchemas.dependencies.length > 0
        ? {
            location: SCHEMAS_LOCATION,
            dependencies: zodSchemas.dependencies,
          }
        : undefined,
  });

  console.info("🔌 Building methods...");
  const builtMethods = buildMethods(parsed.methods, {
    schemasLocation: SCHEMAS_LOCATION,
    typesLocation: TYPES_LOCATION,
    zodSchemaLocation: ZOD_LOCATION,
    zodSuffix: ZOD_SCHEMA_SUFFIX,
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
  writeFileSync(
    `${OUTPUT_BASE_PATH}/${MAPPED_PROPERTIES_FILE}`,
    builtMappedProperties
  );
}

main();
