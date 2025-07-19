import { getOpenApiSpecLocal } from "./utils";
import { generateOpenapiTS } from "./utils/openapi-ts";
import { parseOpenapiTS } from "./openapi-typescript-parser";
import { exporter } from "./exporter";

async function main() {
  console.info("# Getting OpenAPI spec");
  const spec = getOpenApiSpecLocal();

  console.info("# Generating OpenAPI TS");
  const openapiTS = await generateOpenapiTS(spec);

  console.info("# Parsing OpenAPI TS");
  const parsed = parseOpenapiTS(openapiTS);

  console.info("# Exporting");
  exporter(
    parsed.methods,
    parsed.schemas.schemaTypes,
    parsed.schemas.mappedSnakeCamelProperty
  );
}

main();
