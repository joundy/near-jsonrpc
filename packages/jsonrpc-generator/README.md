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
| `schemas.ts`           | TS schema definitions      |
| `zod-schemas.ts`       | Zod schema definitions     |
| `mapped-properties.ts` | Property name mappings     |

## How it Works

1. **OpenAPI Spec** → TypeScript via `openapi-typescript`
2. **AST Processing** → Clean types via `ts-morph`
3. **Zod Generation** → Generate zod schemas from the TS schema.
4. **Zod 1:1 TS Validation** -> Validate zod schema against the TS schema to ensure that the generated types are 1:1 correct.
5. **Property Mapping** → Naming convention utilities that map property names from the JSON-RPC spec (snake_case) to TypeScript types (camelCase). This ensures consistent transformation and prevents edge cases where traditional regex-based conversion might fail. The mapping is maintained in a dedicated file to provide a single source of truth for all property name transformations.

## Automation

- **Daily updates** via GitHub Actions
- **Pull requests** created for API changes
- **Keeps types in sync** with NEAR's API

## Related

- [`@near-js/jsonrpc-types`](../jsonrpc-types) - Generated types
- [`@near-js/jsonrpc-client`](../jsonrpc-client) - Uses generated types

## License

MIT
