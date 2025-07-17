import * as methods from "@near-js/jsonrpc-types/methods";
import type { RpcClient } from "./types";

// JSON-RPC transporter implementation according to the JSON-RPC 2.0 specification
export function createJsonRpcTransporter(
  url: string
): (methodName: string, params: any) => Promise<{ result: any; error: any }> {
  return async (methodName: string, params: any) => {
    const id = Math.floor(Math.random() * 1000000);
    const payload = {
      jsonrpc: "2.0",
      id,
      method: methodName,
      params,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = (await response.json()) as {
        result?: any;
        error?: any;
        id: number;
        jsonrpc: string;
      };

      // According to JSON-RPC spec, response should have either result or error
      return {
        result: data.result,
        error: data.error,
      };
    } catch (error) {
      // TODO: should be add this asswell
      return {
        result: null,
        error: {
          code: -32000,
          message: error instanceof Error ? error.message : "Unknown error",
          data: error,
        },
      };
    }
  };
}

export function createRpcClient(
  transport: (
    methodName: string,
    request: any
  ) => Promise<{ result: any; error: any }>
): RpcClient {
  return Object.entries(methods).reduce((acc, [key, method]) => {
    // Use the key (export name) as the method name instead of method.methodName
    acc[key] = (request: any) => transport(method.methodName, request);
    return acc;
  }, {} as any);
}

async function main() {
  const transporter = createJsonRpcTransporter("https://rpc.testnet.near.org");
  const client = createRpcClient(transporter);

  const { result, error } = await client.block({
    block_id: "ADbRTY7bbGpS8UeJK6vNT4D8biEzzvL8AkD4pjQ38jA8",
  });
  if (error) {
    console.log("error");
  }

  console.log(result.author);
}

main();
