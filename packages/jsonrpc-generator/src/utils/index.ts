import { readFileSync } from "fs";

const OPEN_API_NEARCORE_URL =
  "https://raw.githubusercontent.com/near/nearcore/refs/heads/master/chain/jsonrpc/openapi/openapi.json";

export async function getOpenApiSpecFromNearcore() {
  const response = await fetch(OPEN_API_NEARCORE_URL);
  const spec = await response.text();
  return spec;
}

export function getOpenApiSpecFromLocal(): string {
  return readFileSync("openapi.json", "utf-8");
}

export function removeQuotes(text: string) {
  return text.replace(/['"]/g, "");
}

export function addQuote(text: string) {
  return `"${text}"`;
}

export function snakeToCamel(str: string) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
}
