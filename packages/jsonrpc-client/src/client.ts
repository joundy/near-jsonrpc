import * as methods from "@near-js/jsonrpc-types/methods";
import { z } from "zod/v4";
import type {
  RpcClient,
  RuntimeValidation,
  SelectiveRpcClient,
  CreateClientWithMethodsConfig,
  CreateClientConfig,
} from "./types";
import { RuntimeValidationType } from "./types";
import {
  transformCamelToSnake,
  transformSnakeToCamel,
} from "./transform-property";
import {
  ErrorType,
  RequestType,
  ResponseType,
  Method,
} from "@near-js/jsonrpc-types/types";
import { JSON_RPC_TRANSPORTER_ERROR_CODE } from "./transporter";

function preProces(request: any) {
  return transformCamelToSnake(request);
}

function postProcess(response: any) {
  return transformSnakeToCamel(response);
}

function parseZod<T>(
  type: RuntimeValidationType,
  schema: z.ZodType<T>,
  data: T
):
  | {
      error: {
        validation: RuntimeValidation<T, RuntimeValidationType>;
      };
    }
  | undefined {
  const validate = schema.safeParse(data);
  if (validate.error) {
    const error = z.treeifyError(validate.error);

    return {
      error: {
        validation: {
          runtimeValidation: type,
          error,
        },
      },
    };
  }
}

/**
 * Create a JSON-RPC client with only specific methods
 * @param config - Configuration object
 *
 * @example
 * ```typescript
 * import { createClientWithMethods, jsonRpcTransporter, NearRpcEndpoint } from "@near-js/jsonrpc-client";
 * import { block, status, query } from "@near-js/jsonrpc-types/methods";
 *
 * const transporter = jsonRpcTransporter({ endpoint: NearRpcEndpoint.Mainnet });
 * const client = createClientWithMethods({
 *   transporter,
 *   methods: { block, status, query },
 *   runtimeValidation: true
 * });
 *
 * // Only these methods are available:
 * const blockData = await client.block({ finality: "final" });
 * const statusData = await client.status(null);
 * ```
 */
export function createClientWithMethods<
  T extends Record<string, Method<any, any, any, any>>
>(config: CreateClientWithMethodsConfig<T>): SelectiveRpcClient<T> {
  const { transporter, methods: selectedMethods, runtimeValidation } = config;

  return Object.entries(selectedMethods).reduce((acc, [key, method]) => {
    acc[key] = async (request: RequestType<typeof method>) => {
      if (method.defaultRequest) {
        request = {
          ...method.defaultRequest,
          ...request,
        };
      }

      if (runtimeValidation) {
        const requestValidation = parseZod<RequestType<typeof method>>(
          "request",
          method.zodRequest,
          request
        );

        if (requestValidation) {
          return requestValidation;
        }
      }

      const response = await transporter(method.methodName, preProces(request));
      const result = postProcess(response) as { result: any; error: any };

      if (runtimeValidation) {
        if (result.result) {
          const resultValidation = parseZod<ResponseType<typeof method>>(
            "response",
            method.zodResponse,
            result.result
          );
          if (resultValidation) {
            return resultValidation;
          }
        }

        if (
          result.error &&
          result.error.code !== JSON_RPC_TRANSPORTER_ERROR_CODE
        ) {
          const errorValidation = parseZod<ErrorType<typeof method>>(
            "error",
            method.zodError,
            result.error
          );
          if (errorValidation) {
            return errorValidation;
          }
        }
      }

      // handling error from the json rpc transporter
      if (result.error) {
        return {
          error: {
            rpc: result.error,
          },
        };
      }

      return result;
    };
    return acc;
  }, {} as any);
}

/**
 * Create a JSON-RPC client with all available methods
 * @param config - Configuration object
 *
 * @example
 * ```typescript
 * import { createClient, jsonRpcTransporter, NearRpcEndpoint } from "@near-js/jsonrpc-client";
 *
 * const transporter = jsonRpcTransporter({ endpoint: NearRpcEndpoint.Mainnet });
 * const client = createClient({
 *   transporter,
 *   runtimeValidation: true
 * });
 *
 * // All methods are available:
 * const blockData = await client.block({ finality: "final" });
 * const statusData = await client.status(null);
 * const queryData = await client.query({ requestType: "view_account", finality: "final", accountId: "near" });
 * ```
 */
export function createClient(config: CreateClientConfig): RpcClient {
  return createClientWithMethods({
    transporter: config.transporter,
    methods,
    runtimeValidation: config.runtimeValidation,
  }) as RpcClient;
}
