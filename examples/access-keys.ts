// TODO: This example will need to be updated once the library is converted
// from snake_case to camelCase parameters.


/**
 * Access Keys Example
 * 
 * This example demonstrates how to list access keys for a NEAR account.
 */

import { createJsonRpcTransporter, createRpcClient } from "@near-js/jsonrpc-client";

async function main() {
  const transporter = createJsonRpcTransporter("https://rpc.testnet.near.org");
  const client = createRpcClient(transporter);

  console.log("🔑 NEAR JSON-RPC Client - Access Keys Example\n");

  // You can change this to any account ID you want to inspect
  const accountId = "test.near";
  console.log(`Account ID whose keys we're listing: ${accountId}\n`);

  // Query access keys for the account
  const { result: accessKeyResponse, error: accessKeyError } = await client.query({
    request_type: "view_access_key_list",
    finality: "final",
    account_id: accountId,
  });

  if (accessKeyError) {
    console.error("Error fetching access keys:", accessKeyError);
    return;
  }

  // Display the access keys
  const accessKeys = (accessKeyResponse as any).keys;
  for (const accessKey of accessKeys) {
    console.log(`🗝 [${accessKey.public_key}]`);
    console.log(` ↳ nonce: ${accessKey.access_key.nonce}`);
    console.log(` ↳ permission: ${JSON.stringify(accessKey.access_key.permission, null, 2)}`);
    console.log();
  }

  console.log(`\nTotal access keys found: ${accessKeys.length}`);
}

main().catch(console.error); 