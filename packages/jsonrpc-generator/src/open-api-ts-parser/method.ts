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

  let errorProperty: PropertySignature | undefined;
  let resultProperty: PropertySignature | undefined;

  const unionDescendants = union.getDescendants();
  for (const descendant of unionDescendants) {
    if (descendant.getKind() === SyntaxKind.TypeLiteral) {
      const literal = descendant.asKindOrThrow(SyntaxKind.TypeLiteral);

      const result = literal.getProperty(JsonRpcResponseType.result);
      const error = literal.getProperty(JsonRpcResponseType.error);

      if (result) {
        resultProperty = result;
      }
      if (error) {
        errorProperty = error;
      }
    }
  }

  console.log(resultProperty?.getText());
  console.log(errorProperty?.getText());

  //   console.log(parenthized.getFullText());
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

type MethodType = {
  method: string;
  requestType: string;
  responseType: string;
  errorType: string;
};

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

    let method: string;
    let requestType: string;
    let responseType: string;
    let errorType: string;

    for (const methodProperty of methodProperties) {
      //   if (methodProperty.getName() === OPENAPI_TS_OPERATION_REQUEST_BODY) {
      //     const requestBody = parseRequestBody(methodProperty, source);
      //     method = requestBody.method;
      //     requestType = requestBody.requestType;
      //   }
      if (methodProperty.getName() === OPENAPI_TS_OPERATION_RESPONSES) {
        parseResponse(methodProperty, source);
      }
    }

    results.push({
      method: method!,
      requestType: requestType!,
      responseType: "",
      errorType: "",
    });

    // TODO: remove this when its ready
    // if (name === "block") {
    //   break;
    // }
  }

  //   console.log(results);
}
