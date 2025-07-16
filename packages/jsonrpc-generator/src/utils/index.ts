import { readFileSync } from "fs";

export enum JsonRPCBodyType {
  id = "id",
  jsonrpc = "jsonrpc",
  method = "method",
  params = "params",
}

export enum JsonRpcResponseType {
  result = "result",
  error = "error",
}

const OPEN_API_LINK =
  // "https://raw.githubusercontent.com/near/nearcore/refs/heads/master/chain/jsonrpc/openapi/openapi.json";
  "https://raw.githubusercontent.com/near/nearcore/refs/heads/master/chain/jsonrpc/openapi/progenitor.json";

export async function getOpenApiSpec() {
  const response = await fetch(OPEN_API_LINK);
  const spec = await response.text();
  return spec;
}

export function getOpenApiSpecLocal(): string {
  return readFileSync("openapi.json", "utf-8");
}
