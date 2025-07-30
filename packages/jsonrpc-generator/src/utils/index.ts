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

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function findCommonStringsOfMapsByKey(
  maps: Map<string, string>[]
): string[] {
  if (maps.length === 0) {
    return [];
  }

  const firstMap = maps[0]!;
  const allKeys = Array.from(firstMap.keys());
  return allKeys.filter((key) => maps.every((map) => map.has(key)));
}

export function mergeMaps<K, V>(maps: Map<K, V>[]): Map<K, V> {
  const result = new Map<K, V>();
  
  for (const map of maps) {
    for (const [key, value] of map.entries()) {
      result.set(key, value);
    }
  }
  
  return result;
}