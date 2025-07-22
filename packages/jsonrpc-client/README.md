# @near-js/jsonrpc-client

Type-safe JSON-RPC client for NEAR Protocol.

## Installation

```bash
npm install @near-js/jsonrpc-client
```

## Quick Start

```typescript
import { jsonRpcTransporter, createClient } from "@near-js/jsonrpc-client";

const transporter = jsonRpcTransporter({
  endpoint: "https://rpc.testnet.near.org",
});
const client = createClient(transporter);

// Query account
const account = await client.query({
  requestType: "view_account",
  finality: "final",
  accountId: "example.testnet",
});

// Get transaction status
const txStatus = await client.tx({
  txHash: "your-tx-hash",
  senderAccountId: "sender.testnet",
  waitUntil: "FINAL",
});

// Get current gas price
const gasPrice = await client.gasPrice({});
```

## Networks

```typescript
import { NearRpcEndpoint } from "@near-js/jsonrpc-client";

// Pre-defined endpoints
NearRpcEndpoint.Mainnet; // https://rpc.mainnet.near.org
NearRpcEndpoint.Testnet; // https://rpc.testnet.near.org
NearRpcEndpoint.Localnet; // http://localhost:3030
```

## Examples

See the [examples directory](../../examples) for more usage patterns:

- [View Account](../../examples/view-account.ts)
- [Transactions](../../examples/transactions.ts)
- [Gas Price](../../examples/gas.ts)

## Related

- [`@near-js/jsonrpc-types`](../jsonrpc-types) - TypeScript types
- [NEAR JSON-RPC Docs](https://docs.near.org/api/rpc/introduction)

## License

MIT
