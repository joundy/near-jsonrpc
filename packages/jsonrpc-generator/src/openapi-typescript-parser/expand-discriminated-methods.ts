import { PropertySignature, SourceFile, SyntaxKind, TypeNode } from "ts-morph";
import {
  addNewPropertyToSchema,
  getSchemaProperty,
  getSchemaSet,
} from "./utils";
import { MethodType } from "../types";
import {
  capitalize,
  findCommonStringsOfMapsByKey,
  mergeMaps,
  removeQuotes,
  snakeToCamel,
} from "../utils";

/**
 * Recursively extracts string literal properties from a TypeScript type node.
 * This function handles parenthesized types, intersection types, and type literals.
 * 
 * @param node - The TypeScript type node to analyze
 * @param stringLiteralMap - Map to store property names and their string literal values
 */
function extractStringLiteralsFromTypeNode(
  node: TypeNode,
  stringLiteralMap: Map<string, string>
): void {
  if (node.isKind(SyntaxKind.ParenthesizedType)) {
    const innerTypeNode = node
      .asKindOrThrow(SyntaxKind.ParenthesizedType)
      .getTypeNode();
    extractStringLiteralsFromTypeNode(innerTypeNode, stringLiteralMap);
    return;
  }

  if (node.isKind(SyntaxKind.IntersectionType)) {
    const typeNodes = node
      .asKindOrThrow(SyntaxKind.IntersectionType)
      .getTypeNodes();

    for (const typeNode of typeNodes) {
      extractStringLiteralsFromTypeNode(typeNode, stringLiteralMap);
    }
    return;
  }

  if (node.isKind(SyntaxKind.TypeLiteral)) {
    const properties = node
      .asKindOrThrow(SyntaxKind.TypeLiteral)
      .getProperties();

    for (const property of properties) {
      const stringLiteral = property
        .getTypeNode()
        ?.asKind(SyntaxKind.LiteralType)
        ?.getFirstChildByKind(SyntaxKind.StringLiteral);
      
      if (stringLiteral) {
        const propertyName = property.getName();
        const literalValue = removeQuotes(stringLiteral.getText());
        stringLiteralMap.set(propertyName, literalValue);
      }
    }
  }
}

/**
 * Extracts string literal maps from all union type nodes.
 * 
 * @param unionTypeNodes - Array of union type nodes to process
 * @returns Array of maps containing string literals for each union member
 */
function extractStringLiteralMapsFromUnion(
  unionTypeNodes: TypeNode[]
): Map<string, string>[] {
  const stringLiteralMaps: Map<string, string>[] = [];

  for (const node of unionTypeNodes) {
    const stringLiteralMap = new Map<string, string>();
    extractStringLiteralsFromTypeNode(node, stringLiteralMap);
    stringLiteralMaps.push(stringLiteralMap);
  }

  return stringLiteralMaps;
}

/**
 * Finds the discriminator property that is common across all union members.
 * 
 * @param stringLiteralMaps - Array of string literal maps from union members
 * @returns The discriminator property name, or null if no single discriminator found
 */
function findDiscriminator(stringLiteralMaps: Map<string, string>[]): string | null {
  const commonProperties = findCommonStringsOfMapsByKey(stringLiteralMaps);
  return commonProperties.length === 1 ? commonProperties[0]! : null;
}

/**
 * Creates schema mappings and discriminator value mappings for a method type.
 * 
 * @param methodType - The method type being processed
 * @param stringLiteralMaps - String literal maps from union members
 * @param unionTypeNodes - The union type nodes
 * @param discriminator - The discriminator property name
 * @returns Object containing schema map and discriminator value to schema map
 */
function createSchemaMappings(
  methodType: MethodType,
  stringLiteralMaps: Map<string, string>[],
  unionTypeNodes: TypeNode[],
  discriminator: string
): {
  schemaMap: Map<string, string>;
  discriminatorValueToSchemaMap: Map<string, string>;
} {
  const schemaMap = new Map<string, string>();
  const discriminatorValueToSchemaMap = new Map<string, string>();

  for (const [index, stringLiteralMap] of stringLiteralMaps.entries()) {
    const discriminatorValue = stringLiteralMap.get(discriminator);
    if (!discriminatorValue) {
      continue;
    }

    const nodeType = unionTypeNodes[index]?.getText();
    if (!nodeType) {
      continue;
    }

    const schemaName = `${methodType.request.type}${capitalize(
      snakeToCamel(discriminatorValue)
    )}`;

    // Handle multiple discriminator values mapping to the same schema
    if (schemaMap.has(schemaName)) {
      const existingType = schemaMap.get(schemaName)!;
      schemaMap.set(schemaName, `${existingType} | ${nodeType}`);
    } else {
      schemaMap.set(schemaName, nodeType);
    }

    discriminatorValueToSchemaMap.set(discriminatorValue, schemaName);
  }

  return { schemaMap, discriminatorValueToSchemaMap };
}

/**
 * Creates new method types based on discriminator values.
 * 
 * @param methodType - The original method type
 * @param discriminatorValueToSchemaMap - Map of discriminator values to schema names
 * @param discriminator - The discriminator property name
 * @returns Array of new method types
 */
function createDiscriminatedMethodTypes(
  methodType: MethodType,
  discriminatorValueToSchemaMap: Map<string, string>,
  discriminator: string
): MethodType[] {
  const newMethodTypes: MethodType[] = [];

  for (const [discriminatorValue, schemaName] of discriminatorValueToSchemaMap) {
    newMethodTypes.push({
      request: {
        type: schemaName,
        method: methodType.request.method,
        fromSchema: methodType.request.fromSchema,
        discriminatedType: {
          property: discriminator,
          value: discriminatorValue,
        },
      },
      response: methodType.response,
      error: methodType.error,
    });
  }

  return newMethodTypes;
}

/**
 * Processes a single method type for discriminated union expansion.
 * 
 * @param source - The TypeScript source file
 * @param methodType - The method type to process
 * @param schemaSet - Set of available schemas
 * @returns Object containing new method types and schema map, or null if processing failed
 */
function processMethodType(
  source: SourceFile,
  methodType: MethodType,
  schemaSet: Set<string>
): {
  newMethodTypes: MethodType[];
  schemaMap: Map<string, string>;
} | null {
  // Skip if schema doesn't exist
  if (!schemaSet.has(methodType.request.type)) {
    return null;
  }

  // Get the schema property and check for union type
  const property = getSchemaProperty(source, methodType.request.type);
  const unionType = property.getFirstChildByKind(SyntaxKind.UnionType);
  if (!unionType) {
    return null;
  }

  const unionTypeNodes = unionType.getTypeNodes();
  const stringLiteralMaps = extractStringLiteralMapsFromUnion(unionTypeNodes);
  
  // Find discriminator property
  const discriminator = findDiscriminator(stringLiteralMaps);
  if (!discriminator) {
    return null;
  }

  // Create schema mappings
  const { schemaMap, discriminatorValueToSchemaMap } = createSchemaMappings(
    methodType,
    stringLiteralMaps,
    unionTypeNodes,
    discriminator
  );

  // Create new method types
  const newMethodTypes = createDiscriminatedMethodTypes(
    methodType,
    discriminatorValueToSchemaMap,
    discriminator
  );

  return { newMethodTypes, schemaMap };
}

/**
 * Expands discriminated union method types by creating separate method types
 * for each discriminator value. This allows for more specific type handling
 * in JSON-RPC method processing.
 * 
 * @param source - The TypeScript source file containing the schemas
 * @param methodTypes - Array of method types to process and expand
 */
export function expandDiscriminatedMethods(
  source: SourceFile,
  methodTypes: MethodType[]
): void {
  const schemaSet = getSchemaSet(source);
  const schemaMaps: Map<string, string>[] = [];

  for (const methodType of methodTypes) {
    const result = processMethodType(source, methodType, schemaSet);
    if (!result) {
      continue;
    }

    const { newMethodTypes, schemaMap } = result;
    
    // Add new method types to the original array
    methodTypes.push(...newMethodTypes);
    schemaMaps.push(schemaMap);
  }

  // Add all new schemas to the source file
  if (schemaMaps.length > 0) {
    addNewPropertyToSchema(source, mergeMaps(schemaMaps));
  }
}
