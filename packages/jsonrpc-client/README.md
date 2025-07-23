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

## API

### `createClient(transporter, runtimeValidation?)`

Creates a type-safe JSON-RPC client for NEAR Protocol.

#### Parameters

- `transporter: Transporter` - The transport layer for making JSON-RPC requests
- `runtimeValidation?: true` - Optional flag to enable runtime validation of requests and responses

#### Runtime Validation

When `runtimeValidation` is enabled, the client will validate both outgoing requests and incoming responses using Zod schemas. This provides additional type safety at runtime and helps catch issues early.

```typescript
import { jsonRpcTransporter, createClient } from "@near-js/jsonrpc-client";

// Create client with runtime validation enabled
const transporter = jsonRpcTransporter({
  endpoint: "https://rpc.testnet.near.org",
});
const client = createClient(transporter, true);

// If validation fails, the client will return validation errors
const result = await client.query({
  requestType: "view_account",
  finality: "final",
  accountId: "example.testnet",
});

// Check for validation errors
if ("error" in result && "validation" in result.error) {
  console.error("Validation error:", result.error.validation);
  return;
}

// Safe to use the result
console.log(result.result);
```

#### Validation Error Format

When runtime validation is enabled and validation fails, the client returns an error object with the following structure:

```typescript
{
  error: {
    validation: {
      runtimeValidation: "request" | "response" | "error",
      error: // Zod validation error details
    }
  }
}
```

For a comprehensive example of how to handle different types of validation errors and access specific error properties, see the [accessing-error.ts example](../../examples/accessing-error.ts).

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
