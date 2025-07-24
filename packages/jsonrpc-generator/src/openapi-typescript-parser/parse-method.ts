import { PropertySignature, type SourceFile, SyntaxKind } from "ts-morph";
import {
  OPENAPI_TS_OPERATIONS,
  OPENAPI_TS_OPERATION_REQUEST_BODY,
  OPENAPI_TS_OPERATION_RESPONSES,
} from "../utils/openapi-ts";
import type {
  ErrorType,
  MethodType,
  RequestType,
  ResponseType,
} from "../types";
import { getSchemaSet, getSchemasLiteral } from "./schema-utils";
import { parseRequestBody, parseResponse } from "./operation-parsers";
import { processTypeForSchemaGeneration } from "./type-processors";

/**
 * Adds new properties to the schema
 */
function addNewPropertyToSchema(
  source: SourceFile,
  newSchemaMethodMap: Map<string, string>
) {
  const literal = getSchemasLiteral(source);

  for (const [key, value] of newSchemaMethodMap) {
    literal.addProperty({
      name: key,
      type: value,
      docs: [
        {
          description: `Generated from ${value}`,
        },
      ],
    });
  }
}

/**
 * Processes method types and handles schema generation
 */
function processMethodTypes(
  operationProperties: PropertySignature[],
  source: SourceFile,
  schemaSet: Set<string>
): { results: MethodType[]; newSchemaMethodMap: Map<string, string> } {
  const results: MethodType[] = [];
  const newSchemaMethodMap = new Map<string, string>();

  for (const operation of operationProperties) {
    const methodProperties = operation
      .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
      .getProperties();

    let requestType: RequestType | undefined;
    let responseType: ResponseType | undefined;
    let errorType: ErrorType | undefined;

    // Process each method property
    for (const methodProperty of methodProperties) {
      if (methodProperty.getName() === OPENAPI_TS_OPERATION_REQUEST_BODY) {
        const requestBody = parseRequestBody(methodProperty, source, schemaSet);

        const processedType = processTypeForSchemaGeneration(
          requestBody.body.type,
          requestBody.body.fromSchema,
          "request",
          schemaSet,
          newSchemaMethodMap
        );

        requestType = {
          method: requestBody.body.method,
          type: processedType,
          fromSchema: requestBody.body.fromSchema,
        };
      }

      if (methodProperty.getName() === OPENAPI_TS_OPERATION_RESPONSES) {
        const response = parseResponse(methodProperty, source, schemaSet);

        // Process response type
        const processedResponseType = processTypeForSchemaGeneration(
          response.response.responseType.type,
          response.response.responseType.fromSchema,
          "response",
          schemaSet,
          newSchemaMethodMap
        );

        responseType = {
          type: processedResponseType,
          fromSchema: response.response.responseType.fromSchema,
        };

        // Process error type
        const processedErrorType = processTypeForSchemaGeneration(
          response.response.errorType.type,
          response.response.errorType.fromSchema,
          "error",
          schemaSet,
          newSchemaMethodMap
        );

        errorType = {
          type: processedErrorType,
          fromSchema: response.response.errorType.fromSchema,
        };
      }
    }

    // Only add valid method types
    if (requestType && responseType && errorType) {
      results.push({
        request: requestType,
        response: responseType,
        error: errorType,
      });
    }
  }

  return { results, newSchemaMethodMap };
}

/**
 * Main function to parse method types from OpenAPI TypeScript source
 */
export function parseMethodTypes(source: SourceFile): MethodType[] {
  const schemaSet = getSchemaSet(source);
  const operation = source.getInterfaceOrThrow(OPENAPI_TS_OPERATIONS);
  const operationProperties = operation.getProperties();

  const { results, newSchemaMethodMap } = processMethodTypes(
    operationProperties,
    source,
    schemaSet
  );

  // Add new schema properties if any were generated
  if (newSchemaMethodMap.size > 0) {
    addNewPropertyToSchema(source, newSchemaMethodMap);
  }

  return results;
}
