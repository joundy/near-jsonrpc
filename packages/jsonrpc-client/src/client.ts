import * as methods from "@near-js/jsonrpc-types/methods";
import { z } from "zod/v4";
import type { RpcClient, RuntimeValidation, Transporter } from "./types";
import { RuntimeValidationType } from "./types";
import {
  transformCamelToSnake,
  transformSnakeToCamel,
} from "./transform-property";
import { ErrorType, RequestType, ResponseType } from "@near-js/jsonrpc-types";
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

export function createClient(
  transport: Transporter,
  runtimeValidation?: true
): RpcClient {
  return Object.entries(methods).reduce((acc, [key, method]) => {
    acc[key] = async (request: RequestType<typeof method>) => {
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

      const response = await transport(method.methodName, preProces(request));
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
