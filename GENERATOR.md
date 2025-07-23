# Code Generator Documentation

## Overview

The `@near-js/jsonrpc-generator` is a sophisticated code generation tool that automatically creates TypeScript types and Zod schemas for NEAR's JSON-RPC API. It bridges the gap between NEAR's OpenAPI specification and type-safe TypeScript client libraries, ensuring that all JSON-RPC methods, request/response types, and validation schemas stay in perfect sync with the official API.

## Architecture

### High-Level Workflow

```
OpenAPI Spec → TypeScript Types → Zod Schemas → Validation → Output Files
     ↓              ↓                ↓             ↓           ↓
 openapi.json → openapi-typescript → AST Parser → Validator → jsonrpc-types/
```

### Core Components

The generator is structured into several specialized modules:

#### 1. **OpenAPI Processing** (`src/utils/openapi-ts.ts`)

- Fetches or reads the OpenAPI specification from NEAR's repository
- Uses `openapi-typescript` library to convert OpenAPI schemas to TypeScript types
- Applies patches via `patch-package` for customization needs

#### 2. **AST Parser** (`src/openapi-typescript-parser/`)

- **`index.ts`**: Main parser orchestrator
- **`parse-method.ts`**: Extracts JSON-RPC method definitions, parameters, and return types
- **`parse-schema.ts`**: Parses TypeScript type definitions and creates schema mappings

#### 3. **Builder System** (`src/builder/`)

- **`build-types.ts`**: Generates core TypeScript utilities and method type definitions
- **`build-methods.ts`**: Creates method signature definitions with Zod schema references
- **`build-schemas.ts`**: Builds clean TypeScript schema definitions
- **`build-mapped-properties.ts`**: Generates property name mappings (snake_case ↔ camelCase)
- **`build-zod-schema.ts`**: Constructs final Zod schema file with proper imports

#### 4. **Zod Generator** (`src/zod-generator/`)

- **`generator.ts`**: Core Zod schema generation logic
- **`dep-resolvers.ts`**: Resolves TypeScript type dependencies
- **`utils.ts`**: Handles circular dependency detection and resolution
- **`builders.ts`**: Low-level Zod schema construction utilities

#### 5. **Validation System** (`src/zod-validator/`)

- Ensures 1:1 compatibility between TypeScript types and generated Zod schemas
- Uses `expect-type` library for compile-time type checking
- Provides both individual and batch validation modes

## Detailed Process Flow

### Phase 1: OpenAPI Ingestion

```typescript
// 1. Load OpenAPI specification
const spec = getOpenApiSpecLocal(); // or getOpenApiSpec() for remote

// 2. Convert to TypeScript using openapi-typescript
const openapiTS = await generateOpenapiTS(spec);
```

The generator reads NEAR's OpenAPI specification, which contains:

- JSON-RPC method definitions
- Request/response schemas
- Error type definitions
- Parameter specifications

### Phase 2: TypeScript Parsing

```typescript
// 3. Parse the generated TypeScript using ts-morph AST
const parsed = parseOpenapiTS(openapiTS);
// Returns: { methods, schemas }
```

The AST parser extracts:

- **Methods**: JSON-RPC method names, request types, response types, error types
- **Schemas**: All TypeScript type definitions and property mappings

### Phase 3: File Generation

The generator creates five distinct output files:

#### `types.ts` - Core Type Utilities

```typescript
export type Method<TRequest, TResponse, TError> = {
  readonly methodName: string;
  readonly zodRequest: z.ZodType<TRequest>;
  readonly zodResponse: z.ZodType<TResponse>;
  readonly zodError: z.ZodType<TError>;
};

export function defineMethod<TRequest, TResponse, TError>(
  methodName: string,
  zodRequest: z.ZodType<TRequest>,
  zodResponse: z.ZodType<TResponse>,
  zodError: z.ZodType<TError>
): Method<TRequest, TResponse, TError>;

// Type helpers for extracting types from Method definitions
export type RequestType<T extends Method<any, any, any>>;
export type ResponseType<T extends Method<any, any, any>>;
export type ErrorType<T extends Method<any, any, any>>;
```

#### `methods.ts` - JSON-RPC Method Definitions

```typescript
export const query = defineMethod(
  "query",
  QueryRequestSchema,
  QueryResponseSchema,
  QueryErrorSchema
);

export const broadcast_tx_commit = defineMethod(
  "broadcast_tx_commit",
  BroadcastTxCommitRequestSchema,
  BroadcastTxCommitResponseSchema,
  BroadcastTxCommitErrorSchema
);
// ... all other JSON-RPC methods
```

#### `schemas.ts` - TypeScript Type Definitions

```typescript
export type AccessKey = {
  nonce: number;
  permission: AccessKeyPermission;
};

export type QueryRequest = {
  request_type: string;
  finality?: string;
  block_id?: string;
  account_id?: string;
  // ... other properties
};
// ... all schema types
```

#### `zod-schemas.ts` - Zod Validation Schemas

```typescript
export const AccessKeySchema = z.object({
  nonce: z.number(),
  permission: AccessKeyPermissionSchema,
});

export const QueryRequestSchema = z.object({
  request_type: z.string(),
  finality: z.string().optional(),
  block_id: z.string().optional(),
  account_id: z.string().optional(),
  // ... other properties
});
// ... all Zod schemas
```

#### `mapped-properties.ts` - Property Name Mappings

```typescript
export const MAPPED_PROPERTIES = {
  // Snake case (JSON-RPC) → Camel case (TypeScript)
  access_key: "accessKey",
  block_hash: "blockHash",
  finality_checkpoint: "finalityCheckpoint",
  gas_price: "gasPrice",
  // ... comprehensive mapping
} as const;
```

### Phase 4: Zod Schema Generation

```typescript
// 4. Generate Zod schemas from TypeScript types
const zodSchemas = generateZodSchemas(builtSchemas, "Schema");
```

This sophisticated process:

- Analyzes TypeScript type definitions using AST manipulation
- Detects circular dependencies between types
- Generates corresponding Zod validation schemas
- Handles complex TypeScript features (unions, intersections, generics)

### Phase 5: Validation

```typescript
// 5. Validate 1:1 compatibility between TS and Zod schemas
await validateZodSchema({
  schemas: parsed.schemas.schemaTypes.map((schema) => schema.schema),
  schemaTs: builtSchemas,
  zodSchemaTs: builtZodSchemas,
  zodSchemaSuffix: "Schema",
  validateAll: true,
});
```

The validation system ensures:

- Every TypeScript type has a matching Zod schema
- Zod schemas can infer to identical TypeScript types
- No type information is lost during the conversion
- Runtime validation matches compile-time types

## Key Features

### 1. **Automated Synchronization**

- Daily GitHub Actions workflow fetches latest OpenAPI spec
- Automatically creates pull requests when API changes are detected
- Keeps type definitions in sync with NEAR's evolving API

### 2. **Property Name Transformation**

- Handles conversion between JSON-RPC snake_case and TypeScript camelCase
- Maintains a comprehensive mapping to prevent edge cases
- Ensures consistent naming conventions across the codebase

### 3. **Circular Dependency Resolution**

- Detects and handles circular type dependencies
- Uses sophisticated dependency graph analysis
- Generates valid Zod schemas even with complex type relationships

### 4. **Type Safety Validation**

- Compile-time validation using `expect-type`
- Ensures Zod schemas produce identical types to TypeScript definitions
- Prevents runtime/compile-time type mismatches

### 5. **AST-Based Processing**

- Uses `ts-morph` for reliable TypeScript AST manipulation
- More robust than regex-based text processing
- Handles complex TypeScript language features correctly

## Development Workflow

### Local Development

```bash
# Generate types locally
cd packages/jsonrpc-generator
yarn generate

# Or run directly
npx tsx src/index.ts
```

### Customization

#### Adding New Transformations

1. Modify parsers in `src/openapi-typescript-parser/`
2. Update builders in `src/builder/`
3. Extend Zod generators if needed
4. Update validation logic

#### Handling New OpenAPI Features

1. Update `openapi-typescript` if needed (may require patches)
2. Extend AST parsing logic
3. Update Zod generation to handle new patterns
4. Add validation for new features

## Output Integration

### Usage in `@near-js/jsonrpc-client`

```typescript
import { query, broadcast_tx_commit } from "@near-js/jsonrpc-types";
import type { RequestType, ResponseType } from "@near-js/jsonrpc-types";

// Type-safe method calls
const queryRequest: RequestType<typeof query> = {
  requestType: "view_account",
  accountId: "near",
  finality: "final",
};

// Runtime validation
const validatedRequest = query.zodRequest.parse(queryRequest);
const validatedResponse = query.zodResponse.parse(response);
```

### Benefits for Consumers

1. **Compile-time Safety**: Full TypeScript support with autocomplete
2. **Runtime Validation**: Zod schemas catch invalid data at runtime
3. **API Synchronization**: Always up-to-date with NEAR's latest API
4. **Developer Experience**: Rich type information and validation errors

## Contributing

### Making Changes

1. **Fork and Clone**: Standard GitHub workflow
2. **Test Locally**: Run generation and validation
3. **Update Tests**: Add tests for new functionality
4. **Documentation**: Update this documentation for significant changes
5. **Pull Request**: Submit with detailed description

### Code Style

- Follow existing TypeScript conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Include error handling and logging

---

This generator represents a sophisticated approach to maintaining type safety between OpenAPI specifications and TypeScript client libraries. It ensures that NEAR's JSON-RPC API consumers always have access to accurate, up-to-date type definitions and runtime validation, significantly improving the developer experience and reducing integration errors.
