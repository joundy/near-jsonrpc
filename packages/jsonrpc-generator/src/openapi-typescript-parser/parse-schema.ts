import { PropertySignature, SourceFile, SyntaxKind } from "ts-morph";
import type { SchemaType } from "../types";
import { snakeToCamel } from "../utils";
import { getSchemasLiteral, replaceAllIndexedSchemas } from "./utils";

/**
 * Processes property renaming for snake_case to camelCase conversion
 * This is optimized to batch rename operations for better performance
 */
function processPropertyRenaming(
  propertyDescendants: PropertySignature[],
  propertyName: string,
  mappedSnakeCamelProperty: Map<string, string>
) {
  const renameOperations: Array<{
    property: PropertySignature;
    newName: string;
  }> = [];

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

  // Rename the properties
  // TODO: use batch rename for better performance
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
  mappedSnakeCamelProperty: Map<string, string>
) {
  const propertyDescendants = property.getDescendantsOfKind(
    SyntaxKind.PropertySignature
  );

  if (propertyDescendants.length > 0) {
    processPropertyRenaming(
      propertyDescendants,
      property.getName(),
      mappedSnakeCamelProperty
    );
  }

  console.info(`✅ Property renaming complete for ${property.getName()}`);

  const typeName = property.getName();
  const typeNode = property.getTypeNodeOrThrow();

  const schemaType: SchemaType = {
    schema: typeName,
    type: replaceAllIndexedSchemas(typeNode.getText()),
  };

  return schemaType;
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
    if (ignoreSchemaSet.has(property.getName())) {
      continue;
    }

    const schemaType = processSchemaProperty(
      property,
      mappedSnakeCamelProperty
    );
    schemaTypes.push(schemaType);
  }

  return {
    schemaTypes,
    mappedSnakeCamelProperty,
  };
}
