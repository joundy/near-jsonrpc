import { PropertySignature, SyntaxKind, type SourceFile } from "ts-morph";
import {
  OPENAPI_TS_COMPONENTS,
  OPENAPI_TS_OPERATION_CONTENT_TYPE,
  OPENAPI_TS_OPERATION_REQUEST_BODY,
  OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT,
  OPENAPI_TS_OPERATION_RESPONSES,
  OPENAPI_TS_OPERATION_RESPONSES_200,
  OPENAPI_TS_OPERATIONS,
  OPENAPI_TS_SCHEMAS,
  parseOpenapiTSSchemaType,
} from "../utils/openapi-ts";
import {
  JsonRPCBodyType,
  JsonRpcResponseType,
  removeQuotes,
  snakeToCamel,
} from "../utils";
import type {
  ErrorType,
  MethodType,
  RequestType,
  ResponseType,
} from "../types";

function getSchemaSet(source: SourceFile) {
  const schemaSet = new Set<string>();

  const componentAlias = source.getTypeAliasOrThrow(OPENAPI_TS_COMPONENTS);
  const typeLiteral = componentAlias.getFirstChildByKindOrThrow(
    SyntaxKind.TypeLiteral
  );

  const properties = typeLiteral
    .getPropertyOrThrow(OPENAPI_TS_SCHEMAS)
    .asKindOrThrow(SyntaxKind.PropertySignature)
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getProperties();

  for (const property of properties) {
    schemaSet.add(property.getName());
  }

  return schemaSet;
}

function getSchemaProperty(source: SourceFile, schemaType: string) {
  const componentAlias = source.getTypeAliasOrThrow(OPENAPI_TS_COMPONENTS);
  const typeLiteral = componentAlias.getFirstChildByKindOrThrow(
    SyntaxKind.TypeLiteral
  );

  const schemaLiteral = typeLiteral
    .getPropertyOrThrow(OPENAPI_TS_SCHEMAS)
    .asKindOrThrow(SyntaxKind.PropertySignature)
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(schemaType);

  return schemaLiteral;
}

function getRequestType(
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

  let paramsType = schema
    .getPropertyOrThrow(JsonRPCBodyType.params)
    .getTypeNodeOrThrow()
    .getText();

  const parsedType = parseOpenapiTSSchemaType(paramsType);
  if (schemaSet.has(parsedType)) {
    return {
      method: removeQuotes(methodName),
      type: parsedType,
      fromSchema: schemaType,
    };
  }

  return {
    method: removeQuotes(methodName),
    type: paramsType,
    fromSchema: schemaType,
  };
}

function getResponseType(
  schemaType: string,
  source: SourceFile,
  schemaSet: Set<string>
) {
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
        const parsedResultType = parseOpenapiTSSchemaType(resultType);
        if (schemaSet.has(parsedResultType)) {
          responseType = {
            type: parsedResultType,
            fromSchema: schemaType,
          };
        } else {
          responseType = {
            type: resultType,
            fromSchema: schemaType,
          };
        }
      }

      if (error) {
        const errorTypeNode = error.getTypeNodeOrThrow().getText();
        const parsedErrorType = parseOpenapiTSSchemaType(errorTypeNode);

        if (schemaSet.has(parsedErrorType)) {
          errorType = {
            type: parsedErrorType,
            fromSchema: schemaType,
          };
        } else {
          errorType = {
            type: errorTypeNode,
            fromSchema: schemaType,
          };
        }
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

function getSchemaNameFromContent(property: PropertySignature) {
  const indexed = property
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(OPENAPI_TS_OPERATION_CONTENT_TYPE)
    .getFirstDescendantByKindOrThrow(SyntaxKind.IndexedAccessType);

  const indexType = indexed
    .getIndexTypeNode()
    .asKindOrThrow(SyntaxKind.LiteralType);

  return removeQuotes(indexType.getText());
}

function getContentFromProperty(property: PropertySignature) {
  return property
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT);
}

function parseRequestBody(
  property: PropertySignature,
  source: SourceFile,
  schemaSet: Set<string>
) {
  const contentProperty = getContentFromProperty(property);
  const schemaName = getSchemaNameFromContent(contentProperty);

  return {
    body: getRequestType(schemaName, source, schemaSet),
  };
}

function parseResponse(
  property: PropertySignature,
  source: SourceFile,
  schemaSet: Set<string>
) {
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

function addNewPropertyToSchema(
  source: SourceFile,
  newSchemaMethodMap: Map<string, string>
) {
  const componentAlias = source.getTypeAliasOrThrow(OPENAPI_TS_COMPONENTS);
  const typeLiteral = componentAlias.getFirstChildByKindOrThrow(
    SyntaxKind.TypeLiteral
  );

  const literal = typeLiteral
    .getPropertyOrThrow(OPENAPI_TS_SCHEMAS)
    .asKindOrThrow(SyntaxKind.PropertySignature)
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral);

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

export function parseMethodTypes(source: SourceFile) {
  const schemaSet = getSchemaSet(source);

  const operation = source.getInterfaceOrThrow(OPENAPI_TS_OPERATIONS);
  const operationProperties = operation.getProperties();

  let results: MethodType[] = [];

  // Get the non schema methods: example RpcHealthResponse | (null) or Range_of_uint64[]
  // need to create a new schema for it latter
  const newSchemaMethodMap = new Map<string, string>();

  for (const operation of operationProperties) {
    const methodProperties = operation
      .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
      .getProperties();

    let requestType: RequestType | undefined;
    let responseType: ResponseType | undefined;
    let errorType: ErrorType | undefined;

    // getting the coresponding request, response, and error type
    for (const methodProperty of methodProperties) {
      if (methodProperty.getName() === OPENAPI_TS_OPERATION_REQUEST_BODY) {
        const requestBody = parseRequestBody(methodProperty, source, schemaSet);

        // getting the request type
        let type = requestBody.body.type;
        if (!schemaSet.has(requestBody.body.type)) {
          type = snakeToCamel(requestBody.body.fromSchema + "_request");
          newSchemaMethodMap.set(type, requestBody.body.type);
        }
        requestType = {
          method: requestBody.body.method,
          type,
          fromSchema: requestBody.body.fromSchema,
        };
      }

      if (methodProperty.getName() === OPENAPI_TS_OPERATION_RESPONSES) {
        const response = parseResponse(methodProperty, source, schemaSet);

        // getting the response type
        let _responseType = response.response.responseType.type;
        if (!schemaSet.has(_responseType)) {
          _responseType = snakeToCamel(
            response.response.responseType.fromSchema + "_response"
          );
          newSchemaMethodMap.set(
            _responseType,
            response.response.responseType.type
          );
        }
        responseType = {
          type: _responseType,
          fromSchema: response.response.responseType.fromSchema,
        };

        // getting the error type
        let _errorType = response.response.errorType.type;
        if (!schemaSet.has(_errorType)) {
          _errorType = snakeToCamel(
            response.response.errorType.fromSchema + "_error"
          );
          newSchemaMethodMap.set(_errorType, response.response.errorType.type);
        }
        errorType = {
          type: _errorType,
          fromSchema: response.response.errorType.fromSchema,
        };
      }
    }

    // if not valid then it will ignore it
    if (!requestType || !responseType || !errorType) {
      continue;
    }

    results.push({
      request: requestType,
      response: responseType,
      error: errorType,
    });
  }

  addNewPropertyToSchema(source, newSchemaMethodMap);

  return results;
}
