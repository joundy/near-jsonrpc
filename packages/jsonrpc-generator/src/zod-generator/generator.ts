import { TypeAliasDeclaration } from "ts-morph";
import { GeneratorContext } from "./types";
import { convertTypeNodeToZod } from "./node-handler";
import { ZodSchemaType } from "../types";

/**
 * Generates Zod schemas from type aliases
 */
export function generateSchemas(
  schemas: TypeAliasDeclaration[],
  context: GeneratorContext
) {
  const { cyclicTypes } = context;

  const results: ZodSchemaType[] = [];

  // Generate schemas
  for (const schema of schemas) {
    const schemaName = schema.getName() + context.suffix;
    const typeNode = schema.getTypeNode();
    const zodSchema = convertTypeNodeToZod(
      typeNode,
      context
    );

    // Generate schema export
    if (cyclicTypes.has(schema.getName())) {
      results.push({
        schema: schemaName,
        type: zodSchema,
        zodType: schema.getName(),
      });
    } else {
      results.push({
        schema: schemaName,
        type: zodSchema,
      });
    }

    context.dependencies.add(schemaName);
  }
  return results;
}

/**
 * Creates a generator context from schemas and cyclic types
 */
export function createGeneratorContext(
  schemas: TypeAliasDeclaration[],
  cyclicTypes: Set<string>,
  suffix: string
): GeneratorContext {
  const schemaSet = new Set<string>();
  const dependencies = new Set<string>();

  for (const schema of schemas) {
    schemaSet.add(schema.getName() + suffix);
  }

  return {
    schemaSet,
    dependencies,
    cyclicTypes,
    suffix,
  };
}
