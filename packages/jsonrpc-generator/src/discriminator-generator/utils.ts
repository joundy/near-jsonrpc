import {
  SourceFile,
  SyntaxKind,
  TypeLiteralNode,
  UnionTypeNode,
  TypeNode,
  PropertySignature,
} from "ts-morph";
import { RefDiscriminator } from "../types";

/**
 * Extracts non-optional property names from a TypeScript type literal
 * @param schema - The type literal node to analyze
 * @returns Array of non-optional property names
 */
export function extractSchemaPropertiesNonOptional(schema: TypeLiteralNode): string[] {
  const properties = schema.getProperties();
  return properties
    .filter(isRequiredProperty)
    .map(property => property.getName());
}

/**
 * Analyzes a union type and extracts discriminators for each type reference
 * @param source - The source file containing type definitions
 * @param unionType - The union type node to analyze
 * @returns Array of discriminators for each valid type reference
 */
export function discriminateUnionTypeReference(
  source: SourceFile,
  unionType: UnionTypeNode
): RefDiscriminator[] {
  const typeNodes = unionType.getTypeNodes();
  const discriminators: RefDiscriminator[] = [];

  for (const typeNode of typeNodes) {
    const discriminator = processTypeNode(source, typeNode);
    if (discriminator) {
      discriminators.push(discriminator);
    }
  }

  return discriminators;
}

/**
 * Checks if a property is required (non-optional)
 * @param property - The property signature to check
 * @returns True if the property is required
 */
function isRequiredProperty(property: PropertySignature): boolean {
  return !property.hasQuestionToken();
}

/**
 * Processes a single type node to extract discriminator information
 * @param source - The source file containing type definitions
 * @param typeNode - The type node to process
 * @returns RefDiscriminator if the type node is a valid type reference, undefined otherwise
 */
function processTypeNode(
  source: SourceFile,
  typeNode: TypeNode
): RefDiscriminator | undefined {
  if (!typeNode.isKind(SyntaxKind.TypeReference)) {
    return undefined;
  }

  const reference = typeNode.asKindOrThrow(SyntaxKind.TypeReference);
  const referenceName = reference.getText();

  const schemaTypeLiteral = findSchemaTypeLiteral(source, referenceName);
  if (!schemaTypeLiteral) {
    return undefined;
  }

  const properties = extractSchemaPropertiesNonOptional(schemaTypeLiteral);
  
  return {
    referenceSchema: referenceName,
    properties,
  };
}

/**
 * Finds the type literal for a given schema name in the source file
 * @param source - The source file to search in
 * @param referenceName - The name of the type alias to find
 * @returns The type literal node if found, undefined otherwise
 */
function findSchemaTypeLiteral(
  source: SourceFile,
  referenceName: string
): TypeLiteralNode | undefined {
  try {
    const typeAlias = source.getTypeAlias(referenceName);
    return typeAlias?.getFirstChildByKind(SyntaxKind.TypeLiteral);
  } catch {
    // Type alias not found or doesn't have a type literal
    return undefined;
  }
}
