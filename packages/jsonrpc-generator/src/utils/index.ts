import { readFileSync } from "fs";
import openapiTS, { astToString } from "openapi-typescript";

const OPEN_API_LINK =
  "https://raw.githubusercontent.com/near/nearcore/refs/heads/master/chain/jsonrpc/openapi/openapi.json";

export async function getOpenApiSpec() {
  const response = await fetch(OPEN_API_LINK);
  const spec = await response.json();
  return spec;
}

export function getOpenApiSpecLocal(): string {
  return readFileSync("openapi.json", "utf-8");
}

export async function generateOpenapiTS(spec: string) {
  const ast = await openapiTS(spec, {
    additionalProperties: true,
    emptyObjectsUnknown: true,
    alphabetize: true,
    exportType: true
  });
  return astToString(ast);
}
