import { PropertySignature, SourceFile, SyntaxKind } from "ts-morph";
import { parseOpenapiTSSchemaType } from "../utils/openapi-ts";
import type { SchemaType } from "../types";
import { snakeToCamel } from "../utils";
import { getSchemasLiteral } from "./schema-utils";

/**
 * Processes property renaming for snake_case to camelCase conversion
 * This is optimized to batch rename operations for better performance
 */
function processPropertyRenaming(
  propertyDescendants: PropertySignature[],
  propertyName: string
): Map<string, string> {
  const mappedSnakeCamelProperty = new Map<string, string>();
  const renameOperations: Array<{ property: any; newName: string }> = [];

  console.info(
    `🔄 Processing ${propertyDescendants.length} properties from ${propertyName} for snake_case to camelCase conversion`
  );

  // Collection phase: gather all rename operations
  for (const property of propertyDescendants) {
    const name = property.getName();
    const camelize = snakeToCamel(name);
    if (name !== camelize) {
      mappedSnakeCamelProperty.set(name, camelize);
      renameOperations.push({ property, newName: camelize });
    }
  }

  // Execution phase: batch all rename operations
  for (const { property, newName } of renameOperations) {
    property.rename(newName);
  }

  return mappedSnakeCamelProperty;
}

/**
 * Processes a single schema property and returns its schema type
 */
function processSchemaProperty(
  property: PropertySignature,
  ignoreSchemaSet: Set<string>
): { schemaType: SchemaType | null; mappedProperties: Map<string, string> } {
  if (ignoreSchemaSet.has(property.getName())) {
    return { schemaType: null, mappedProperties: new Map() };
  }

  const propertyDescendants = property.getDescendantsOfKind(
    SyntaxKind.PropertySignature
  );

  let mappedProperties = new Map<string, string>();

  if (propertyDescendants.length > 0) {
    mappedProperties = processPropertyRenaming(
      propertyDescendants,
      property.getName()
    );
  }

  console.info(`✅ Property renaming complete for ${property.getName()}`);

  const typeName = property.getName();
  const typeNode = property.getTypeNodeOrThrow();

  const schemaType: SchemaType = {
    schema: typeName,
    type: parseOpenapiTSSchemaType(typeNode.getText()),
  };

  return { schemaType, mappedProperties };
}

/**
 * Main function to parse schema types from OpenAPI TypeScript source
 * This function extracts schema types and handles snake_case to camelCase conversion
 */
export function parseSchemaTypes(
  source: SourceFile,
  ignoreSchemaSet: Set<string>
) {
  const schemaLiteral = getSchemasLiteral(source);
  const propertySignatures = schemaLiteral.getChildrenOfKind(
    SyntaxKind.PropertySignature
  );

  const mappedSnakeCamelProperty = new Map<string, string>();
  const schemaTypes: SchemaType[] = [];

  for (const property of propertySignatures) {
    const { schemaType, mappedProperties } = processSchemaProperty(
      property,
      ignoreSchemaSet
    );

    if (schemaType) {
      schemaTypes.push(schemaType);
    }

    // Merge mapped properties
    for (const [key, value] of mappedProperties) {
      mappedSnakeCamelProperty.set(key, value);
    }
  }

  return {
    schemaTypes,
    mappedSnakeCamelProperty,
  };
}
