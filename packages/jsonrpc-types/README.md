# @near-js/jsonrpc-types

TypeScript types and schemas for NEAR JSON-RPC API.

## Installation

```bash
npm install @near-js/jsonrpc-types
```

## Usage

### Import Types

```typescript
import type {
  AccountView,
  AccountId,
  ValidatorStakeView,
  BlockHeaderView,
  ExecutionOutcomeView,
  RpcBlockRequest,
  RpcBlockResponse,
  RpcQueryRequest,
  RpcQueryResponse,
} from "@near-js/jsonrpc-types";
```

### Import Method Definitions

```typescript
import {
  query,
  block,
  status,
  validators,
  broadcastTxCommit,
  gasPrice,
  health,
  networkInfo,
  EXPERIMENTALProtocolConfig,
} from "@near-js/jsonrpc-types/methods";

// Each method provides type-safe request/response/error schemas
const result = await client.call(query, {
  request_type: "view_account",
  account_id: "example.near",
  finality: "final",
});
```

### Import TypeScript Types and Schemas

```typescript
// TypeScript type definitions
import type {
  AccountView,
  ValidatorStakeView,
  BlockHeaderView,
} from "@near-js/jsonrpc-types/schemas";
```

### Import Zod Validation Schemas

```typescript
// Runtime validation schemas
import {
  AccountViewSchema,
  ValidatorStakeViewSchema,
  BlockHeaderViewSchema,
  RpcBlockRequestSchema,
  RpcBlockResponseSchema,
} from "@near-js/jsonrpc-types/zod-schemas";

// Validate API responses at runtime
const account = AccountViewSchema.parse(response);
const blockRequest = RpcBlockRequestSchema.parse(userInput);
```

### Import Property Mappings

```typescript
import { mappedSnakeCamelProperty } from "@near-js/jsonrpc-types/mapped-properties";

// Convert between snake_case and camelCase property names
const camelCase = mappedSnakeCamelProperty.get("account_id"); // "accountId"
```

## Available Exports

- **`/methods`** - JSON-RPC method definitions with type parameters and validation schemas
- **`/schemas`** - TypeScript type definitions for all NEAR JSON-RPC types
- **`/zod-schemas`** - Runtime Zod validation schemas for type checking and parsing
- **`/mapped-properties`** - Property name conversion mappings between snake_case and camelCase

## Available Methods

The package includes all NEAR JSON-RPC methods:

**Core Methods:**

- `block` - Get block information
- `query` - Query account/contract state
- `status` - Get node status
- `validators` - Get current validators
- `gasPrice` - Get current gas price
- `health` - Check node health
- `networkInfo` - Get network information

**Transaction Methods:**

- `broadcastTxAsync` - Broadcast transaction asynchronously
- `broadcastTxCommit` - Broadcast transaction and wait for commit
- `sendTx` - Send transaction
- `tx` - Get transaction status

**Advanced Methods:**

- `chunk` - Get chunk information
- `changes` - Get state changes
- `lightClientProof` - Get light client proof
- `nextLightClientBlock` - Get next light client block

**Experimental Methods:**

- `EXPERIMENTALProtocolConfig` - Get protocol configuration
- `EXPERIMENTALValidatorsOrdered` - Get validators in order
- `EXPERIMENTALReceipt` - Get receipt information
- `EXPERIMENTALTxStatus` - Get transaction status
- `EXPERIMENTALChanges` - Get state changes
- `EXPERIMENTALChangesInBlock` - Get changes in block
- And more...

For complete method details, parameter types, and response schemas, see [`/methods`](./src/methods.ts).

## Features

- Complete TypeScript coverage of NEAR JSON-RPC API
- Runtime validation with Zod schemas
- Tree-shakeable - import only what you need
- Auto-generated from OpenAPI specification
- Type-safe method definitions with request/response validation
- Property name conversion utilities
- Support for all NEAR JSON-RPC methods including experimental ones

## Related

- [`@near-js/jsonrpc-client`](../jsonrpc-client) - JSON-RPC client
- [`@near-js/jsonrpc-generator`](../jsonrpc-generator) - Code generator

## License

MIT
