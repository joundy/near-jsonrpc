import {
  IndexedAccessTypeNode,
  PropertySignature,
  SyntaxKind,
  TypeChecker,
  TypeLiteralNode,
  type SourceFile,
} from "ts-morph";
import {
  OPENAPI_TS_COMPONENTS,
  OPENAPI_TS_OPERATION_CONTENT_TYPE,
  OPENAPI_TS_OPERATION_REQUEST_BODY,
  OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT,
  OPENAPI_TS_OPERATION_RESPONSES,
  OPENAPI_TS_OPERATION_RESPONSES_200,
  OPENAPI_TS_OPERATIONS,
  OPENAPI_TS_SCHEMAS,
} from "../utils/openapi-ts";
import { JsonRPCBodyType, JsonRpcResponseType } from "../utils";
import type {
  ErrorType,
  MethodType,
  RequestType,
  ResponseType,
} from "../types";

// TODO: validate is it valid json rpc request or not
// TODO: validate the schema for request and response should be has a standard json rpc schema

function removeQuotes(text: string) {
  return text.replace(/['"]/g, "");
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

// TODO: validate valid json rpc request schema
function getRequestType(schemaType: string, source: SourceFile) {
  const schema = getSchemaProperty(
    source,
    schemaType
  ).getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral);

  const methodName = schema
    .getPropertyOrThrow(JsonRPCBodyType.method)
    .getFirstDescendantByKindOrThrow(SyntaxKind.LiteralType)
    .getText();

  const paramIndex = schema
    .getPropertyOrThrow(JsonRPCBodyType.params)
    .getFirstDescendantByKindOrThrow(SyntaxKind.IndexedAccessType)
    .getIndexTypeNode()
    .asKindOrThrow(SyntaxKind.LiteralType)
    .getText();

  return {
    method: removeQuotes(methodName),
    requestType: removeQuotes(paramIndex),
  };
}

// TODO: handle more possible cases for the result type
function resultToResponseType(result: PropertySignature) {
  const resultChild = result.getChildAtIndex(2);

  switch (resultChild.getKind()) {
    case SyntaxKind.ArrayType:
      const arrayType = resultChild.asKindOrThrow(SyntaxKind.ArrayType);

      const arrayindexed = arrayType.getChildAtIndexIfKindOrThrow(
        0,
        SyntaxKind.IndexedAccessType
      );

      return {
        schema: removeQuotes(arrayindexed.getIndexTypeNode().getText()),
        isArray: true,
        isNullable: false,
      };

    case SyntaxKind.UnionType:
      const unionType = resultChild.asKindOrThrow(SyntaxKind.UnionType);
      const type = unionType.getTypeNodes();

      if (type.length !== 2) {
        throw new Error("Unsupported union result type");
      }

      // this should be indexed access type
      const unionIndexed = type[0]!.asKindOrThrow(SyntaxKind.IndexedAccessType);

      // this should be nulled type
      type[1]!
        .asKindOrThrow(SyntaxKind.LiteralType)
        .getFirstDescendantByKindOrThrow(SyntaxKind.NullKeyword);

      return {
        schema: removeQuotes(unionIndexed.getIndexTypeNode().getText()),
        isArray: false,
        isNullable: true,
      };

    case SyntaxKind.IndexedAccessType:
      const directIndexed = resultChild.asKindOrThrow(
        SyntaxKind.IndexedAccessType
      );

      return {
        schema: removeQuotes(directIndexed.getIndexTypeNode().getText()),
        isArray: false,
        isNullable: false,
      };

    default:
      throw new Error("Unsupported result type");
  }
}

function errorToErrorType(error: PropertySignature): ErrorType {
  const indexed = error.getFirstDescendantByKindOrThrow(
    SyntaxKind.IndexedAccessType
  );

  return {
    schema: removeQuotes(indexed.getIndexTypeNode().getText()),
  };
}

// TODO: validate valid json rpc response schema
function getResponseType(schemaType: string, source: SourceFile) {
  const schema = getSchemaProperty(
    source,
    schemaType
  ).getFirstDescendantByKindOrThrow(SyntaxKind.IntersectionType);

  // TODO: for jsonrpc validation
  //   const literal = schema.getFirstDescendantByKindOrThrow(
  //     SyntaxKind.TypeLiteral
  //   );
  //   const properties = literal.getProperties();
  //   for (const prop of properties) {
  //     console.log(prop.getName());
  //   }

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
        responseType = resultToResponseType(result);
      }
      if (error) {
        errorType = errorToErrorType(error);
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

function getSchemaTypeFromContent(property: PropertySignature) {
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

function parseRequestBody(property: PropertySignature, source: SourceFile) {
  const contentProperty = getContentFromProperty(property);
  const schemaType = getSchemaTypeFromContent(contentProperty);

  return getRequestType(schemaType, source);
}

function parseResponse(property: PropertySignature, source: SourceFile) {
  const responseOkProperty = property
    .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(OPENAPI_TS_OPERATION_RESPONSES_200);

  const contentProperty = getContentFromProperty(responseOkProperty);
  const schemaType = getSchemaTypeFromContent(contentProperty);

  return getResponseType(schemaType, source);
}

export function parseMethodTypes(source: SourceFile) {
  const operation = source.getInterfaceOrThrow(OPENAPI_TS_OPERATIONS);
  const operationProperties = operation.getProperties();

  const results: MethodType[] = [];
  for (const operation of operationProperties) {
    // TODO: remove this when its ready
    const name = operation.getName();

    const methodProperties = operation
      .getFirstDescendantByKindOrThrow(SyntaxKind.TypeLiteral)
      .getProperties();

    let requestType: RequestType | undefined;
    let responseType: ResponseType | undefined;
    let errorType: ErrorType | undefined;

    for (const methodProperty of methodProperties) {
      if (methodProperty.getName() === OPENAPI_TS_OPERATION_REQUEST_BODY) {
        const requestBody = parseRequestBody(methodProperty, source);
        requestType = {
          method: requestBody.method,
          schema: requestBody.requestType,
        };
      }
      if (methodProperty.getName() === OPENAPI_TS_OPERATION_RESPONSES) {
        const response = parseResponse(methodProperty, source);
        responseType = response.responseType;
        errorType = response.errorType;
      }
    }

    if (!requestType || !responseType || !errorType) {
      throw new Error("Invalid method type");
    }

    results.push({
      request: requestType,
      response: responseType,
      error: errorType,
    });

    // TODO: remove this when its ready
    // if (name === "block") {
    //   break;
    // }
  }

  console.log(results);
}
