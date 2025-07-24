import { PropertySignature, SourceFile, SyntaxKind } from "ts-morph";
import {
  OPENAPI_TS_OPERATION_CONTENT_TYPE,
  OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT,
} from "../utils/openapi-ts";
import { JsonRPCBodyType, JsonRpcResponseType, removeQuotes, snakeToCamel } from "../utils";
import type { ErrorType, RequestType, ResponseType } from "../types";
import { getSchemaProperty, processTypeWithSchemaSet } from "./schema-utils";

/**
 * Type processing utilities for OpenAPI TypeScript parser
 */

/**
 * Extracts schema name from content property
 */
export function getSchemaNameFromContent(property: PropertySignature): string {
  const indexed = property
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(OPENAPI_TS_OPERATION_CONTENT_TYPE)
    .getFirstDescendantByKindOrThrow(SyntaxKind.IndexedAccessType);

  const indexType = indexed
    .getIndexTypeNode()
    .asKindOrThrow(SyntaxKind.LiteralType);

  return removeQuotes(indexType.getText());
}

/**
 * Gets content property from a property signature
 */
export function getContentFromProperty(property: PropertySignature): PropertySignature {
  return property
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT);
}

/**
 * Processes request type from schema
 */
export function getRequestType(
  schemaType: string,
  source: SourceFile,
  schemaSet: Set<string>
): RequestType {
  const schema = getSchemaProperty(source, schemaType)
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral);

  const methodName = schema
    .getPropertyOrThrow(JsonRPCBodyType.method)
    .getFirstDescendantByKindOrThrow(SyntaxKind.LiteralType)
    .getText();

  const paramsType = schema
    .getPropertyOrThrow(JsonRPCBodyType.params)
    .getTypeNodeOrThrow()
    .getText();

  const processedType = processTypeWithSchemaSet(paramsType, schemaSet, schemaType);

  return {
    method: removeQuotes(methodName),
    type: processedType.type,
    fromSchema: processedType.fromSchema,
  };
}

/**
 * Processes response and error types from schema
 */
export function getResponseType(
  schemaType: string,
  source: SourceFile,
  schemaSet: Set<string>
): { errorType: ErrorType; responseType: ResponseType } {
  const schema = getSchemaProperty(source, schemaType)
    .getFirstDescendantByKindOrThrow(SyntaxKind.IntersectionType);
  
  const union = schema
    .getFirstDescendantByKindOrThrow(SyntaxKind.ParenthesizedType)
    .getFirstDescendantByKindOrThrow(SyntaxKind.UnionType);

  let errorType: ErrorType | undefined;
  let responseType: ResponseType | undefined;

  const unionDescendants = union.getDescendants();
  for (const descendant of unionDescendants) {
    if (descendant.getKind() === SyntaxKind.TypeLiteral) {
      const literal = descendant.asKindOrThrow(SyntaxKind.TypeLiteral);

      const result = literal.getProperty(JsonRpcResponseType.result);
      const error = literal.getProperty(JsonRpcResponseType.error);

      if (result) {
        const resultType = result.getTypeNodeOrThrow().getText();
        const processedType = processTypeWithSchemaSet(resultType, schemaSet, schemaType);
        responseType = processedType;
      }

      if (error) {
        const errorTypeNode = error.getTypeNodeOrThrow().getText();
        const processedType = processTypeWithSchemaSet(errorTypeNode, schemaSet, schemaType);
        errorType = processedType;
      }
    }
  }

  if (!errorType || !responseType) {
    throw new Error("Invalid response type");
  }

  return {
    errorType,
    responseType,
  };
}

/**
 * Generates schema name using snake_case to camelCase conversion
 */
export function generateSchemaName(fromSchema: string, suffix: string): string {
  return snakeToCamel(fromSchema + "_" + suffix);
}

/**
 * Processes type for schema generation, returns the final type and updates the schema map if needed
 */
export function processTypeForSchemaGeneration(
  type: string,
  fromSchema: string,
  suffix: string,
  schemaSet: Set<string>,
  newSchemaMethodMap: Map<string, string>
): string {
  if (schemaSet.has(type)) {
    return type;
  }

  const newSchemaName = generateSchemaName(fromSchema, suffix);
  newSchemaMethodMap.set(newSchemaName, type);
  return newSchemaName;
}
