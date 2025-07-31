import { Project, SourceFile, SyntaxKind, TypeAliasDeclaration, TypeNode } from "ts-morph";
import { SchemaDiscriminator } from "../types";
import { discriminateUnionTypeReference } from "./utils";

const TEMP_SOURCE_FILE_NAME = "__temp__discriminators.ts";
const SUPPORTED_INTERSECTION_TYPES_COUNT = 2;

/**
 * Generates discriminators for TypeScript schemas by analyzing union and intersection types
 */
export function generateDiscriminators(schemasTs: string): SchemaDiscriminator[] {
  const project = new Project();
  const source = project.createSourceFile(TEMP_SOURCE_FILE_NAME, schemasTs);
  
  try {
    const schemas = source.getTypeAliases();
    const schemaDiscriminators = processSchemas(source, schemas);
    return schemaDiscriminators;
  } finally {
    project.removeSourceFile(source);
  }
}

/**
 * Processes all schemas and extracts discriminators from each
 */
function processSchemas(
  source: SourceFile, 
  schemas: TypeAliasDeclaration[]
): SchemaDiscriminator[] {
  const schemaDiscriminators: SchemaDiscriminator[] = [];

  for (const schema of schemas) {
    const schemaDiscriminator = processSchema(source, schema);
    
    if (schemaDiscriminator.refDiscriminators.length > 0) {
      schemaDiscriminators.push(schemaDiscriminator);
    }
  }

  return schemaDiscriminators;
}

/**
 * Processes a single schema and extracts discriminators based on its type structure
 */
function processSchema(
  source: SourceFile, 
  schema: TypeAliasDeclaration
): SchemaDiscriminator {
  const schemaDiscriminator: SchemaDiscriminator = {
    schema: schema.getName(),
    refDiscriminators: [],
  };

  const typeNode = schema.getTypeNode();
  if (!typeNode) {
    return schemaDiscriminator;
  }

  if (typeNode.isKind(SyntaxKind.UnionType)) {
    processUnionType(source, typeNode, schemaDiscriminator);
  } else if (typeNode.isKind(SyntaxKind.IntersectionType)) {
    processIntersectionType(source, typeNode, schemaDiscriminator);
  }

  return schemaDiscriminator;
}

/**
 * Processes union types to extract discriminators
 */
function processUnionType(
  source: SourceFile,
  typeNode: TypeNode,
  schemaDiscriminator: SchemaDiscriminator
): void {
  const unionType = typeNode.asKindOrThrow(SyntaxKind.UnionType);
  schemaDiscriminator.refDiscriminators = discriminateUnionTypeReference(
    source,
    unionType
  );
}

/**
 * Processes intersection types to extract discriminators
 * Currently supports intersection of 2 types: one type literal and one parenthesized union type
 */
function processIntersectionType(
  source: SourceFile,
  typeNode: TypeNode,
  schemaDiscriminator: SchemaDiscriminator
): void {
  const intersectionType = typeNode.asKindOrThrow(SyntaxKind.IntersectionType);
  const intersectionNodes = intersectionType.getTypeNodes();
  
  if (!isValidIntersectionStructure(intersectionNodes)) {
    return;
  }

  const typeLiteralNode = findTypeLiteralNode(intersectionNodes);
  const unionType = findParenthesizedUnionType(intersectionNodes);
  
  if (!typeLiteralNode || !unionType) {
    return;
  }

  schemaDiscriminator.refDiscriminators = discriminateUnionTypeReference(
    source,
    unionType
  );
  schemaDiscriminator.typeLiteral = typeLiteralNode.getText();
}

/**
 * Validates that intersection has the expected structure (exactly 2 types)
 */
function isValidIntersectionStructure(intersectionNodes: TypeNode[]): boolean {
  return intersectionNodes.length === SUPPORTED_INTERSECTION_TYPES_COUNT;
}

/**
 * Finds the type literal node in intersection types
 */
function findTypeLiteralNode(intersectionNodes: TypeNode[]): TypeNode | undefined {
  return intersectionNodes.find(node => node.isKind(SyntaxKind.TypeLiteral));
}

/**
 * Finds and extracts the union type from a parenthesized type in intersection types
 */
function findParenthesizedUnionType(intersectionNodes: TypeNode[]) {
  const parenthesized = intersectionNodes.find(node => 
    node.isKind(SyntaxKind.ParenthesizedType)
  );
  
  if (!parenthesized) {
    return undefined;
  }

  const parenthesizedNode = parenthesized.getTypeNode();
  if (!parenthesizedNode?.isKind(SyntaxKind.UnionType)) {
    return undefined;
  }

  return parenthesizedNode.asKindOrThrow(SyntaxKind.UnionType);
}
