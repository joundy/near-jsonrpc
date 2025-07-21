import { TypeNode, SyntaxKind } from "ts-morph";
import {
  PrimitiveType,
  IdentifierType,
  ZodProperty,
  GeneratorContext,
} from "./types";
import {
  createZodPrimitive,
  createZodObject,
  createZodArray,
  createZodTuple,
  createZodUnion,
  createZodIntersection,
  createZodNull,
  createZodStringLiteral,
  createZodTypeReference,
  createZodDate,
  createZodRecord,
} from "./builders";

/**
 * Handles primitive type nodes (string, number, boolean, etc.)
 */
export function handlePrimitiveType(typeNode: TypeNode): string | null {
  const kindToType: Record<number, PrimitiveType> = {
    [SyntaxKind.StringKeyword]: PrimitiveType.String,
    [SyntaxKind.NumberKeyword]: PrimitiveType.Number,
    [SyntaxKind.BooleanKeyword]: PrimitiveType.Boolean,
    [SyntaxKind.AnyKeyword]: PrimitiveType.Any,
    [SyntaxKind.NeverKeyword]: PrimitiveType.Never,
    [SyntaxKind.UnknownKeyword]: PrimitiveType.Unknown,
  };

  const primitiveType = kindToType[typeNode.getKind()];
  return primitiveType ? createZodPrimitive(primitiveType) : null;
}

/**
 * Handles type reference nodes (Date, Record, custom types)
 */
export function handleTypeReference(
  typeNode: TypeNode,
  context: GeneratorContext
): string | null {
  if (!typeNode.isKind(SyntaxKind.TypeReference)) {
    return null;
  }

  const typeName = typeNode.getTypeName();
  if (!typeName.isKind(SyntaxKind.Identifier)) {
    return createZodPrimitive(PrimitiveType.Any);
  }

  const identifier = typeName.getText();

  // Handle built-in types
  if (identifier === IdentifierType.Date) {
    return createZodDate();
  }

  if (identifier === IdentifierType.Record) {
    return handleRecordType(typeNode);
  }

  // Handle custom schema references
  if (context.schemaSet.has(identifier)) {
    return createZodTypeReference(identifier);
  }

  return createZodPrimitive(PrimitiveType.Any);
}

/**
 * Handles Record<K, V> type references
 */
function handleRecordType(typeNode: TypeNode): string {
  if (!typeNode.isKind(SyntaxKind.TypeReference)) {
    throw new Error("Expected TypeReference for Record type");
  }

  const typeArguments = typeNode.getTypeArguments();
  if (typeArguments.length !== 2) {
    throw new Error("Record type must have exactly 2 type arguments");
  }

  const keyType = convertTypeNodeToZod(typeArguments[0]!, new Set(), new Set());
  const valueType = convertTypeNodeToZod(
    typeArguments[1]!,
    new Set(),
    new Set()
  );

  return createZodRecord(keyType, valueType);
}

/**
 * Handles type literal nodes (object types)
 */
export function handleTypeLiteral(
  typeNode: TypeNode,
  context: GeneratorContext
): string | null {
  if (!typeNode.isKind(SyntaxKind.TypeLiteral)) {
    return null;
  }

  const properties = typeNode.getProperties();

  // Handle empty object with index signature
  if (properties.length === 0) {
    const indexSignature = typeNode.getFirstChildByKind(
      SyntaxKind.IndexSignature
    );
    if (indexSignature) {
      const keyType = convertTypeNodeToZod(
        indexSignature.getKeyTypeNode(),
        context.schemaSet,
        context.cyclicTypes
      );
      const valueType = convertTypeNodeToZod(
        indexSignature.getReturnTypeNode(),
        context.schemaSet,
        context.cyclicTypes
      );
      return createZodRecord(keyType, valueType);
    }
    return createZodObject([]);
  }

  // Handle object properties
  const zodProperties: ZodProperty[] = properties.map((property) => ({
    name: property.getName(),
    zodType: convertTypeNodeToZod(
      property.getTypeNode(),
      context.schemaSet,
      context.cyclicTypes
    ),
    isOptional: property.hasQuestionToken(),
  }));

  return createZodObject(zodProperties);
}

/**
 * Handles array type nodes
 */
export function handleArrayType(
  typeNode: TypeNode,
  context: GeneratorContext
): string | null {
  if (!typeNode.isKind(SyntaxKind.ArrayType)) {
    return null;
  }

  const elementType = convertTypeNodeToZod(
    typeNode.getElementTypeNode(),
    context.schemaSet,
    context.cyclicTypes
  );
  return createZodArray(elementType);
}

/**
 * Handles tuple type nodes
 */
export function handleTupleType(
  typeNode: TypeNode,
  context: GeneratorContext
): string | null {
  if (!typeNode.isKind(SyntaxKind.TupleType)) {
    return null;
  }

  const elements = typeNode.getElements();
  const zodTypes = elements.map((element) =>
    convertTypeNodeToZod(element, context.schemaSet, context.cyclicTypes)
  );

  return createZodTuple(zodTypes);
}

/**
 * Handles union type nodes
 */
export function handleUnionType(
  typeNode: TypeNode,
  context: GeneratorContext
): string | null {
  if (!typeNode.isKind(SyntaxKind.UnionType)) {
    return null;
  }

  const nodes = typeNode.getTypeNodes();
  const zodTypes = nodes.map((node) =>
    convertTypeNodeToZod(node, context.schemaSet, context.cyclicTypes)
  );

  return createZodUnion(zodTypes);
}

/**
 * Handles intersection type nodes
 */
export function handleIntersectionType(
  typeNode: TypeNode,
  context: GeneratorContext
): string | null {
  if (!typeNode.isKind(SyntaxKind.IntersectionType)) {
    return null;
  }

  const nodes = typeNode.getTypeNodes();
  const zodTypes = nodes.map((node) =>
    convertTypeNodeToZod(node, context.schemaSet, context.cyclicTypes)
  );

  return createZodIntersection(zodTypes);
}

/**
 * Handles parenthesized type nodes
 */
export function handleParenthesizedType(
  typeNode: TypeNode,
  context: GeneratorContext
): string | null {
  if (!typeNode.isKind(SyntaxKind.ParenthesizedType)) {
    return null;
  }

  return convertTypeNodeToZod(
    typeNode.getTypeNode(),
    context.schemaSet,
    context.cyclicTypes
  );
}

/**
 * Handles literal type nodes (null, string literals)
 */
export function handleLiteralType(typeNode: TypeNode): string | null {
  if (!typeNode.isKind(SyntaxKind.LiteralType)) {
    return null;
  }

  const literal = typeNode.getLiteral();

  if (literal.getKind() === SyntaxKind.NullKeyword) {
    return createZodNull();
  }

  if (literal.getKind() === SyntaxKind.StringLiteral) {
    return createZodStringLiteral(literal.getText());
  }

  throw new Error(`Unsupported literal type: ${literal.getKindName()}`);
}

/**
 * Main function to convert TypeNode to Zod schema string
 */
export function convertTypeNodeToZod(
  typeNode: TypeNode | undefined,
  schemaSet: Set<string>,
  cyclicTypes: Set<string>
): string {
  if (!typeNode) {
    return createZodPrimitive(PrimitiveType.Unknown);
  }

  const context: GeneratorContext = {
    schemaSet,
    dependencies: new Set(),
    cyclicTypes,
  };

  // Try each handler in order
  const handlers = [
    handlePrimitiveType,
    (node: TypeNode) => handleTypeReference(node, context),
    (node: TypeNode) => handleTypeLiteral(node, context),
    (node: TypeNode) => handleArrayType(node, context),
    (node: TypeNode) => handleTupleType(node, context),
    (node: TypeNode) => handleUnionType(node, context),
    (node: TypeNode) => handleIntersectionType(node, context),
    (node: TypeNode) => handleParenthesizedType(node, context),
    handleLiteralType,
  ];

  for (const handler of handlers) {
    const result = handler(typeNode);
    if (result !== null) {
      return result;
    }
  }

  throw new Error(`Unsupported type: ${typeNode.getKindName()}`);
}
