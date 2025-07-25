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

/**
 * Common return type for all JSON-RPC client methods
 */
export type ClientMethodReturnType<TRequest, TResponse, TError> = Promise<
  {
    result?: TResponse;
    error?: {
      rpc?: TError;
      validation?:
        | RuntimeValidation<TRequest, "request">
        | RuntimeValidation<TResponse, "response">
        | RuntimeValidation<TError, "error">;
    };
  } & (
    | {
        result: TResponse;
        error?: never;
      }
    | {
        result?: never;
        error: {
          rpc: TError;
          validation?: never;
        };
      }
    | {
        result?: never;
        error: {
          rpc?: never;
          validation:
            | RuntimeValidation<TRequest, "request">
            | RuntimeValidation<TResponse, "response">
            | RuntimeValidation<TError, "error">;
        };
      }
  )
>;

export type RpcClient = {
  [K in keyof typeof methods]: (typeof methods)[K] extends Method<
    RequestType<(typeof methods)[K]>,
    ResponseType<(typeof methods)[K]>,
    ErrorType<(typeof methods)[K]>
  >
    ? (
        request: RequestType<(typeof methods)[K]>
      ) => ClientMethodReturnType<
        RequestType<(typeof methods)[K]>,
        ResponseType<(typeof methods)[K]>,
        ErrorType<(typeof methods)[K]>
      >
    : never;
};

/**
 * Type for a client with selected methods
 */
export type SelectiveRpcClient<
  T extends Record<string, Method<any, any, any>>
> = {
  [K in keyof T]: T[K] extends Method<
    infer TRequest,
    infer TResponse,
    infer TError
  >
    ? (request: TRequest) => ClientMethodReturnType<TRequest, TResponse, TError>
    : never;
};

export type Transporter = (
  methodName: string,
  request: any
) => Promise<{ result: any; error: any }>;

/**
 * Configuration for creating a selective JSON-RPC client
 */
export interface CreateClientWithMethodsConfig<
  T extends Record<string, Method<any, any, any>>
> {
  /** The transport function to use for sending requests */
  transporter: Transporter;
  /** Object containing the specific methods to include from "@near-js/jsonrpc-types/methods" */
  methods: T;
  /** Whether to enable runtime validation (optional, defaults to false) */
  runtimeValidation?: true;
}

/**
 * Configuration for creating a full JSON-RPC client
 */
export interface CreateClientConfig {
  /** The transport function to use for sending requests */
  transporter: Transporter;
  /** Whether to enable runtime validation (optional, defaults to false) */
  runtimeValidation?: true;
}
