import { PropertySignature, SourceFile, SyntaxKind } from "ts-morph";
import {
  OPENAPI_TS_OPERATION_CONTENT_TYPE,
  OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT,
  OPENAPI_TS_OPERATION_RESPONSES_200,
} from "../utils/openapi-ts";
import {
  JsonRPCBodyType,
  JsonRpcResponseType,
  removeQuotes,
  snakeToCamel,
} from "../utils";
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
  source: SourceFile,
  schemaSet: Set<string>
): { body: RequestType } {
  const contentProperty = getContentFromProperty(property);
  const schemaName = getSchemaNameFromContent(contentProperty);

  return {
    body: getRequestType(schemaName, source, schemaSet),
  };
}

/**
 * Parses response from operation property
 */
export function parseResponse(
  property: PropertySignature,
  source: SourceFile,
  schemaSet: Set<string>
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
    response: getResponseType(schemaName, source, schemaSet),
    schemaName,
  };
}

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
  source: SourceFile,
  schemaSet: Set<string>
): RequestType {
  const schema = getSchemaProperty(
    source,
    schemaType
  ).getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral);

  const methodName = schema
    .getPropertyOrThrow(JsonRPCBodyType.method)
    .getFirstDescendantByKindOrThrow(SyntaxKind.LiteralType)
    .getText();

  const paramsType = schema
    .getPropertyOrThrow(JsonRPCBodyType.params)
    .getTypeNodeOrThrow()
    .getText();

  const processedType = processTypeWithSchemaSet(
    paramsType,
    schemaSet,
    schemaType
  );

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
  const schema = getSchemaProperty(
    source,
    schemaType
  ).getFirstDescendantByKindOrThrow(SyntaxKind.IntersectionType);

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
        const processedType = processTypeWithSchemaSet(
          resultType,
          schemaSet,
          schemaType
        );
        responseType = processedType;
      }

      if (error) {
        const errorTypeNode = error.getTypeNodeOrThrow().getText();
        const processedType = processTypeWithSchemaSet(
          errorTypeNode,
          schemaSet,
          schemaType
        );
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
  if (schemaSet.has(type)) {
    return type;
  }

  const newSchemaName = generateSchemaName(fromSchema, suffix);
  newSchemaMethodMap.set(newSchemaName, type);
  return newSchemaName;
}

/**
 * Processes a type and returns the appropriate type based on schema set
 * When the reference type is not in the schema set, it returns the raw type
 */
export function processTypeWithSchemaSet(
  rawType: string,
  schemaSet: Set<string>,
  fromSchema: string
): { type: string; fromSchema: string } {
  const parsedType = replaceAllIndexedSchemas(rawType);

  if (schemaSet.has(parsedType)) {
    return {
      type: parsedType,
      fromSchema,
    };
  }

  return {
    type: rawType,
    fromSchema,
  };
}
