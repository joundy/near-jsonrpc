# NEAR JSON-RPC TypeScript SDK

A modern, type-safe TypeScript SDK for NEAR Protocol's JSON-RPC API.

## Packages

| Package                                                        | Description                  |
| -------------------------------------------------------------- | ---------------------------- |
| **[@near-js/jsonrpc-client](./packages/jsonrpc-client)**       | Type-safe JSON-RPC client    |
| **[@near-js/jsonrpc-types](./packages/jsonrpc-types)**         | TypeScript types and schemas |
| **[@near-js/jsonrpc-generator](./packages/jsonrpc-generator)** | Code generator for types     |

## Quick Start

```bash
npm install @near-js/jsonrpc-client
```

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

console.log(`Balance: ${account.result.amount} yoctoNEAR`);
```

## Links

- **[Examples](./examples)** - Usage examples
- **[NEAR Docs](https://docs.near.org/api/rpc/introduction)** - JSON-RPC API reference

## Development

```bash
git clone https://github.com/near/near-jsonrpc.git
cd near-jsonrpc
yarn install
yarn build
```

## License

MIT
