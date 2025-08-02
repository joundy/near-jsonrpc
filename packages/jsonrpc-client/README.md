# @near-js/jsonrpc-client

Type-safe JSON-RPC client for NEAR Protocol.

## Installation

```bash
npm install @near-js/jsonrpc-client
```

## Quick Start

```typescript
import { jsonRpcTransporter, createClient } from "@near-js/jsonrpc-client";
import { DiscriminateRpcQueryResponse } from "@near-js/jsonrpc-types";

const transporter = jsonRpcTransporter({
  endpoint: "https://rpc.testnet.near.org",
});
const client = createClient({ transporter });

// Query account using discriminated method
const { result, error } = await client.queryViewAccount({
  accountId: "example.testnet",
  finality: "final",
});

if (!error) {
  // Use discriminator helper for type-safe response handling
  const accountView = DiscriminateRpcQueryResponse(result).AccountView;
  if (accountView) {
    console.log(`Balance: ${accountView.amount} yoctoNEAR`);
  }
}

// Alternative: Use generic query method (still supported)
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

### `jsonRpcTransporter(config)`

Creates a transporter function for making JSON-RPC requests to NEAR Protocol.

#### Parameters

- `config.endpoint: string | NearRpcEndpoint` - The RPC endpoint URL or predefined endpoint

#### Example

```typescript
import { jsonRpcTransporter, NearRpcEndpoint } from "@near-js/jsonrpc-client";

// Using predefined endpoints
const transporter = jsonRpcTransporter({
  endpoint: NearRpcEndpoint.Mainnet, // or Testnet, Betanet, Localnet
});

// Using custom endpoint
const customTransporter = jsonRpcTransporter({
  endpoint: "https://my-custom-rpc.com",
});
```

### `createClient(config)`

Creates a type-safe JSON-RPC client with all available NEAR Protocol methods.

#### Parameters

- `config.transporter: Transporter` - The transport layer for making JSON-RPC requests
- `config.runtimeValidation?: true` - Optional flag to enable runtime validation of requests and responses

#### Example

```typescript
import { jsonRpcTransporter, createClient } from "@near-js/jsonrpc-client";

const transporter = jsonRpcTransporter({
  endpoint: "https://rpc.testnet.near.org",
});

// Basic client
const client = createClient({ transporter });

// Client with runtime validation
const validatedClient = createClient({
  transporter,
  runtimeValidation: true,
});
```

### `createClientWithMethods(config)`

Creates a type-safe JSON-RPC client with only specific methods. This is useful for reducing bundle size and creating more focused clients.

#### Parameters

- `config.transporter: Transporter` - The transport layer for making JSON-RPC requests
- `config.methods: object` - Object containing specific methods from `@near-js/jsonrpc-types/methods`
- `config.runtimeValidation?: true` - Optional flag to enable runtime validation of requests and responses

#### Example

```typescript
import {
  jsonRpcTransporter,
  createClientWithMethods,
} from "@near-js/jsonrpc-client";
import { block, status, query } from "@near-js/jsonrpc-types/methods";

const transporter = jsonRpcTransporter({
  endpoint: "https://rpc.testnet.near.org",
});

// Client with only specific methods
const selectiveClient = createClientWithMethods({
  transporter,
  methods: { block, status, query },
  runtimeValidation: true,
});

// Only these methods are available (TypeScript enforced):
const blockData = await selectiveClient.block({ finality: "final" });
const statusData = await selectiveClient.status(null);
// selectiveClient.gasPrice() // ❌ TypeScript error - method not included

// Use cases:
// 1. Monitoring client (read-only operations)
const monitoringClient = createClientWithMethods({
  transporter,
  methods: { status, block, gasPrice, query },
});

// 2. Transaction client (transaction operations)
import {
  broadcastTxAsync,
  broadcastTxCommit,
  tx,
} from "@near-js/jsonrpc-types/methods";
const txClient = createClientWithMethods({
  transporter,
  methods: { broadcastTxAsync, broadcastTxCommit, tx },
  runtimeValidation: true,
});
```

## Discriminated Methods

The client now supports discriminated methods that provide better type safety and developer experience for specific operations. These methods automatically set the discriminator properties (like `requestType`) for you.

### Query Methods

Instead of using the generic `query` method with a `requestType` parameter, you can now use specific methods:

```typescript
import { jsonRpcTransporter, createClient } from "@near-js/jsonrpc-client";
import { DiscriminateRpcQueryResponse } from "@near-js/jsonrpc-types";

const transporter = jsonRpcTransporter({
  endpoint: "https://rpc.testnet.near.org",
});
const client = createClient({ transporter });

// Use specific discriminated methods
const { result, error } = await client.queryViewAccount({
  accountId: "example.testnet",
  finality: "final",
  // requestType: "view_account" is automatically set
});

// Or use generic method
await client.query({
  requestType: "view_account",
  accountId: "example.testnet",
  finality: "final",
});
```

### Changes Methods

Similar discriminated methods are available for state changes:

```typescript
// Specific change type methods
await client.changesAccountChanges({
  accountIds: ["example.testnet"],
  finality: "final",
  // changesType: "account_changes" is automatically set
});

// Or use generic changes method
await client.changes({
  accountIds: ["example.testnet"],
  finality: "final",
  changesType: "account_changes",
});
```

### Discriminator Helper Functions

Use discriminator helpers to safely handle union response types:

```typescript
import {
  DiscriminateRpcQueryResponse,
  DiscriminateRpcTransactionResponse,
} from "@near-js/jsonrpc-types";

// For query responses
const { result } = await client.queryViewAccount({
  accountId: "example.testnet",
});

const discriminated = DiscriminateRpcQueryResponse(result);
if (discriminated.AccountView) {
  // TypeScript knows this is AccountView type
  console.log(discriminated.AccountView.amount);
} else if (discriminated.CallResult) {
  // TypeScript knows this is CallResult type
  console.log(discriminated.CallResult.result);
}
```

#### Runtime Validation

When `runtimeValidation` is enabled, the client will validate both outgoing requests and incoming responses using Zod schemas. This provides additional type safety at runtime and helps catch issues early.

```typescript
import { jsonRpcTransporter, createClient } from "@near-js/jsonrpc-client";

// Create client with runtime validation enabled
const transporter = jsonRpcTransporter({
  endpoint: "https://rpc.testnet.near.org",
});
const client = createClient({
  transporter,
  runtimeValidation: true,
});

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

- [View Account](../../examples/view-account.ts) - Traditional query method usage
- [Query View Account](../../examples/query-view-account.ts) - Discriminated method usage
- [Discriminated Helper](../../examples/discriminated-helper.ts) - Using discriminator helpers
- [Transactions](../../examples/transactions.ts)
- [Gas Price](../../examples/gas.ts)
- [Selective Methods](../../examples/selective-methods.ts)

## Related

- [`@near-js/jsonrpc-types`](../jsonrpc-types) - TypeScript types
- [NEAR JSON-RPC Docs](https://docs.near.org/api/rpc/introduction)

## License

MIT
