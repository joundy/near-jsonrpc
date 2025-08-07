export const JSON_RPC_TRANSPORTER_ERROR_CODE = -99999;

export enum NearRpcEndpoint {
  Mainnet = "https://rpc.mainnet.near.org",
  Testnet = "https://rpc.testnet.near.org",
  Betanet = "https://rpc.betanet.near.org",
  Localnet = "http://localhost:3030",
}

// TODO: add more params like timeout, headers, etc.
export type JsonRpcTransporterParams = {
  endpoint: NearRpcEndpoint | string;
};

export function jsonRpcTransporter({
  endpoint,
}: JsonRpcTransporterParams): (
  methodName: string,
  params: any
) => Promise<{ result: unknown; error: unknown }> {
  return async (methodName: string, params: any) => {
    const payload = {
      jsonrpc: "2.0",
      id: "dontcare",
      method: methodName,
      params,
    };

    try {
      const response = await fetch(endpoint, {
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
        result?: unknown;
        error?: unknown;
        id: number;
        jsonrpc: string;
      };

      return {
        result: data.result,
        error: data.error,
      };
    } catch (error) {
      return {
        result: undefined,
        error: {
          code: JSON_RPC_TRANSPORTER_ERROR_CODE,
          message:
            error instanceof Error
              ? error.message
              : "Unknown json rpc trasporter error",
          data: error,
        },
      };
    }
  };
}
