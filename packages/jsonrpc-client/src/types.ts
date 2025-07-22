import * as methods from "@near-js/jsonrpc-types/methods";
import { z } from "zod/v4";
import type {
  ErrorType,
  Method,
  RequestType,
  ResponseType,
} from "@near-js/jsonrpc-types/types";

export type RuntimeValidationType = "request" | "response" | "error";

export type RuntimeValidation<T, RuntimeValidationType> = {
  runtimeValidation: RuntimeValidationType;
  error: z.core.$ZodErrorTree<T>;
};

export type RpcClient = {
  [K in keyof typeof methods]: (typeof methods)[K] extends Method<
    RequestType<(typeof methods)[K]>,
    ResponseType<(typeof methods)[K]>,
    ErrorType<(typeof methods)[K]>
  >
    ? (request: RequestType<(typeof methods)[K]>) => Promise<
        {
          result?: ResponseType<(typeof methods)[K]>;
          error?: {
            rpc?: ErrorType<(typeof methods)[K]>;
            validation?:
              | RuntimeValidation<RequestType<(typeof methods)[K]>, "request">
              | RuntimeValidation<ResponseType<(typeof methods)[K]>, "response">
              | RuntimeValidation<ErrorType<(typeof methods)[K]>, "error">;
          };
        } & (
          | {
              result: ResponseType<(typeof methods)[K]>;
              error?: never;
            }
          | {
              result?: never;
              error: {
                rpc: ErrorType<(typeof methods)[K]>;
                validation?: never;
              };
            }
          | {
              result?: never;
              error: {
                rpc?: never;
                validation?:
                  | RuntimeValidation<
                      RequestType<(typeof methods)[K]>,
                      "request"
                    >
                  | RuntimeValidation<
                      ResponseType<(typeof methods)[K]>,
                      "response"
                    >
                  | RuntimeValidation<ErrorType<(typeof methods)[K]>, "error">;
              };
            }
        )
      >
    : never;
};

export type Transporter = (
  methodName: string,
  request: any
) => Promise<{ result: any; error: any }>;
