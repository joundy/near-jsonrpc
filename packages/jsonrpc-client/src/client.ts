import * as methods from "@near-js/jsonrpc-types/methods";
import type { RpcClient, Transporter } from "./types";
import {
  transformCamelToSnake,
  transformSnakeToCamel,
} from "./transform-property";

function preProces(request: any) {
  return transformCamelToSnake(request);
}

function postProcess(response: any) {
  return transformSnakeToCamel(response);
}

export function createClient(transport: Transporter): RpcClient {
  return Object.entries(methods).reduce((acc, [key, method]) => {
    acc[key] = async (request: any) => {
      const response = await transport(method.methodName, preProces(request));
      return postProcess(response);
    };
    return acc;
  }, {} as any);
}
