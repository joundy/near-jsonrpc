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
    const schemaName = schema.getName();
    const typeNode = schema.getTypeNode();
    const zodSchema = convertTypeNodeToZod(
      typeNode,
      context.schemaSet,
      cyclicTypes
    );

    // Generate schema export
    if (cyclicTypes.has(schemaName)) {
      results.push({
        schema: schemaName,
        type: zodSchema,
        requiredZodType: true,
      });
    } else {
      results.push({
        schema: schemaName,
        type: zodSchema,
        requiredZodType: false,
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
  cyclicTypes: Set<string>
): GeneratorContext {
  const schemaSet = new Set<string>();
  const dependencies = new Set<string>();

  for (const schema of schemas) {
    schemaSet.add(schema.getName());
  }

  return {
    schemaSet,
    dependencies,
    cyclicTypes,
  };
}
