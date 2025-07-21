/**
 * Gas Price Example
 *
 * This example demonstrates how to get the gas price for a NEAR account.
 */

import {
  createJsonRpcTransporter,
  createRpcClient,
} from "@near-js/jsonrpc-client";

async function main() {
  const transporter = createJsonRpcTransporter({
    endpoint: "https://rpc.testnet.near.org",
  });
  const client = createRpcClient(transporter);

  console.log("🔑 NEAR JSON-RPC Client - Gas Price Example\n");

  const { result: gasPriceResponse, error: gasPriceError } =
    await client.gasPrice({});

  if (gasPriceError) {
    console.error("Error fetching gas price:", gasPriceError);
    return;
  }

  const { gasPrice } = gasPriceResponse;


  console.log("Gas price:", gasPrice, "\n");
}

main().catch(console.error);
