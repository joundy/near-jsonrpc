import { getOpenApiSpec, getOpenApiSpecLocal } from "./utils";
import { generateOpenapiTS } from "./utils/openapi-ts";
import { parse } from "./open-api-ts-parser";
import { writeFileSync } from "fs";

async function main() {
  const spec = getOpenApiSpecLocal();
  // const spec = await getOpenApiSpec();
  const openapiTS = await generateOpenapiTS(spec);

  parse(openapiTS);

  // writeFileSync("openapi.ts", openapiTS);
}

main();
