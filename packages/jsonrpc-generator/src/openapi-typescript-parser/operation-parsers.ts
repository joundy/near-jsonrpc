import { PropertySignature, SourceFile, SyntaxKind } from "ts-morph";
import {
  OPENAPI_TS_OPERATION_CONTENT_TYPE,
  OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT,
  OPENAPI_TS_OPERATION_RESPONSES_200,
  RPC_BODY_METHOD,
  RPC_BODY_PARAMS,
  RPC_RESPONSE_ERROR,
  RPC_RESPONSE_RESULT,
} from "./constants";
import { addQuote, removeQuotes, snakeToCamel } from "../utils";
import type { ErrorType, RequestType, ResponseType } from "../types";
import { getSchemaProperty, replaceAllIndexedSchemas } from "./utils";

/**
 * Parsers for OpenAPI operation components
 */

/**
 * Parses request body from operation property
 */
export function parseRequestBody(
  property: PropertySignature,
  source: SourceFile
): { body: RequestType } {
  const contentProperty = getContentFromProperty(property);
  const schemaName = getSchemaNameFromContent(contentProperty);

  return {
    body: getRequestType(schemaName, source),
  };
}

/**
 * Parses response from operation property
 */
export function parseResponse(
  property: PropertySignature,
  source: SourceFile
): {
  response: { errorType: ErrorType; responseType: ResponseType };
  schemaName: string;
} {
  const responseOkProperty = property
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(OPENAPI_TS_OPERATION_RESPONSES_200);

  const contentProperty = getContentFromProperty(responseOkProperty);
  const schemaName = getSchemaNameFromContent(contentProperty);

  return {
    response: getResponseType(schemaName, source),
    schemaName,
  };
}

/**
 * Extracts schema name from content property
 */
export function getSchemaNameFromContent(property: PropertySignature): string {
  const indexed = property
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(addQuote(OPENAPI_TS_OPERATION_CONTENT_TYPE))
    .getFirstDescendantByKindOrThrow(SyntaxKind.IndexedAccessType);

  const indexType = indexed
    .getIndexTypeNode()
    .asKindOrThrow(SyntaxKind.LiteralType);

  return removeQuotes(indexType.getText());
}

/**
 * Gets content property from a property signature
 */
export function getContentFromProperty(
  property: PropertySignature
): PropertySignature {
  return property
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT);
}

/**
 * Processes request type from schema
 */
export function getRequestType(
  schemaType: string,
  source: SourceFile
): RequestType {
  const schema = getSchemaProperty(
    source,
    schemaType
  ).getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral);

  const methodName = schema
    .getPropertyOrThrow(RPC_BODY_METHOD)
    .getFirstDescendantByKindOrThrow(SyntaxKind.LiteralType)
    .getText();

  const paramsType = schema
    .getPropertyOrThrow(RPC_BODY_PARAMS)
    .getTypeNodeOrThrow()
    .getText();

  return {
    method: removeQuotes(methodName),
    type: paramsType,
    fromSchema: schemaType,
  };
}

/**
 * Processes response and error types from schema
 */
export function getResponseType(
  schemaType: string,
  source: SourceFile
): { errorType: ErrorType; responseType: ResponseType } {
  const schema = getSchemaProperty(
    source,
    schemaType
  ).getFirstDescendantByKindOrThrow(SyntaxKind.IntersectionType);

  const union = schema
    .getFirstDescendantByKindOrThrow(SyntaxKind.ParenthesizedType)
    .getFirstDescendantByKindOrThrow(SyntaxKind.UnionType);

  let responseType: ResponseType | undefined;
  let errorType: ErrorType | undefined;

  const unionDescendants = union.getDescendants();
  for (const descendant of unionDescendants) {
    if (descendant.getKind() === SyntaxKind.TypeLiteral) {
      const literal = descendant.asKindOrThrow(SyntaxKind.TypeLiteral);

      const result = literal.getProperty(RPC_RESPONSE_RESULT);
      const error = literal.getProperty(RPC_RESPONSE_ERROR);

      if (result) {
        const resultType = result.getTypeNodeOrThrow().getText();

        responseType = {
          type: resultType,
          fromSchema: schemaType,
        };
      }

      if (error) {
        const errorTypeNode = error.getTypeNodeOrThrow().getText();
        errorType = {
          type: errorTypeNode,
          fromSchema: schemaType,
        };
      }
    }
  }

  if (!errorType || !responseType) {
    throw new Error(`Invalid response structure for the ${schemaType}`);
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
 * Basically this will make sure that the type is available in the schema set,
 * if it is not exist then it will create a new schema latter
 */
export function processTypeForSchemaGeneration(
  type: string,
  fromSchema: string,
  suffix: string,
  schemaSet: Set<string>,
  newSchemaMethodMap: Map<string, string>
): string {
  const replacedType = replaceAllIndexedSchemas(type);
  if (schemaSet.has(replacedType)) {
    return replacedType;
  }

  const newSchemaName = generateSchemaName(fromSchema, suffix);
  newSchemaMethodMap.set(newSchemaName, type);
  return newSchemaName;
}
