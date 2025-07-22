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
} from "@near-js/jsonrpc-types/methods";
```

### Import Schemas (for validation)

```typescript
import {
  AccountViewSchema,
  ValidatorStakeViewSchema,
  BlockHeaderViewSchema,
} from "@near-js/jsonrpc-types/schemas";

// Validate API response
const account = AccountViewSchema.parse(response);
```

## Available Exports

- **`/methods`** - JSON-RPC method definitions with type parameters
- **`/types`** - Core TypeScript types and utility functions
- **`/schemas`** - Runtime type definitions and Zod validation schemas
- **`/mapped-properties`** - Property name conversion mappings

## Features

- Complete TypeScript coverage of NEAR JSON-RPC API
- Tree-shakeable - import only what you need
- Auto-generated from OpenAPI specification
- Runtime validation with Zod schemas

## Related

- [`@near-js/jsonrpc-client`](../jsonrpc-client) - JSON-RPC client
- [`@near-js/jsonrpc-generator`](../jsonrpc-generator) - Code generator

## License

MIT
