import { getOpenApiSpecLocal } from "./utils";
import { generateOpenapiTS } from "./utils/openapi-ts";
import { parseOpenapiTS } from "./open-api-ts-parser";
import { exporter } from "./exporter";

async function main() {
  const spec = getOpenApiSpecLocal();

  const openapiTS = await generateOpenapiTS(spec);
  const parsed = parseOpenapiTS(openapiTS);

  // exporter(parsed.methods, parsed.schemas);
}

main();
