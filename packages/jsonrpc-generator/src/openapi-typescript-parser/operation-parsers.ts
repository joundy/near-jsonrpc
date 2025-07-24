import { PropertySignature, SourceFile, SyntaxKind } from "ts-morph";
import { OPENAPI_TS_OPERATION_RESPONSES_200 } from "../utils/openapi-ts";
import type { ErrorType, RequestType, ResponseType } from "../types";
import {
  getContentFromProperty,
  getRequestType,
  getResponseType,
  getSchemaNameFromContent,
} from "./type-processors";

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
