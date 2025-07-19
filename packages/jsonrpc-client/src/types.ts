import * as methods from "@near-js/jsonrpc-types/methods";
import type {
  ErrorType,
  Method,
  RequestType,
  ResponseType,
} from "@near-js/jsonrpc-types/types";

export type RpcClient = {
  [K in keyof typeof methods]: (typeof methods)[K] extends Method<any, any, any>
    ? (request: RequestType<(typeof methods)[K]>) => Promise<
        {
          result?: ResponseType<(typeof methods)[K]>;
          error?: ErrorType<(typeof methods)[K]>;
        } & (
          | { error: ErrorType<(typeof methods)[K]>; result?: never }
          | { result: ResponseType<(typeof methods)[K]>; error?: never }
        )
      >
    : never;
};

export type Transporter = (
  methodName: string,
  request: any
) => Promise<{ result: any; error: any }>;
