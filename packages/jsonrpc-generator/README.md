# @near-js/jsonrpc-generator

Code generator for NEAR JSON-RPC TypeScript types from OpenAPI specifications.

## Usage

```bash
# Generate types
yarn generate
# or
npx tsx src/index.ts
```

## What it Generates

Creates files in `@near-js/jsonrpc-types`:

| File                   | Description                |
| ---------------------- | -------------------------- |
| `types.ts`             | Core TypeScript types      |
| `methods.ts`           | JSON-RPC method signatures |
| `schemas.ts`           | JSON schema definitions    |
| `zod-schemas.ts`       | Zod validation schemas     |
| `mapped-properties.ts` | Property name mappings     |

## How it Works

1. **OpenAPI Spec** → TypeScript via `openapi-typescript`
2. **AST Processing** → Clean types via `ts-morph`
3. **Zod Generation** → Runtime validation schemas
4. **Property Mapping** → Naming convention utilities

## Automation

- **Daily updates** via GitHub Actions
- **Pull requests** created for API changes
- **Keeps types in sync** with NEAR's API

## Related

- [`@near-js/jsonrpc-types`](../jsonrpc-types) - Generated types
- [`@near-js/jsonrpc-client`](../jsonrpc-client) - Uses generated types

## License

MIT
