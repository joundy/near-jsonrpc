import {
  PropertySignature,
  SourceFile,
  SyntaxKind,
  TypeLiteralNode,
} from "ts-morph";
import {
  addNewPropertyToSchema,
  getSchemaProperty,
  getSchemaSet,
} from "./utils";
import { MethodType, QueryType } from "../types";
import { RPC_METHOD_QUERY, RPC_METHOD_QUERY_REQUEST_TYPE } from "./constants";
import { capitalize, removeQuotes, snakeToCamel } from "../utils";

function getRequestTypeFromLiteral(typeLiteral: TypeLiteralNode) {
  const property = typeLiteral.getProperty(RPC_METHOD_QUERY_REQUEST_TYPE);
  if (!property) {
    return;
  }

  const typeNode = property.getTypeNode();
  if (!typeNode) {
    return;
  }

  return typeNode.getText();
}

export function assignQueryChildMethods(
  source: SourceFile,
  methodTypes: MethodType[]
) {
  const schemaSet = getSchemaSet(source);

  for (const methodType of methodTypes) {
    const requestTypeSchemaMap = new Map<string, string>();
    const schemaToRequestType = new Map<string, string>();
    const queryTypes: QueryType[] = [];

    if (methodType.request.method === RPC_METHOD_QUERY) {
      if (schemaSet.has(methodType.request.type)) {
        const property = getSchemaProperty(source, methodType.request.type);
        const union = property.getFirstChildByKind(SyntaxKind.UnionType);

        if (union) {
          const nodes = union.getTypeNodes();

          for (const node of nodes) {
            const intersection = node.getFirstChildByKind(
              SyntaxKind.IntersectionType
            );
            if (intersection) {
              const typeLiterals = intersection.getChildrenOfKind(
                SyntaxKind.TypeLiteral
              );

              let requestType: string | undefined;
              for (const typeLiteral of typeLiterals) {
                if (requestType) {
                  break;
                }
                const _requestType = getRequestTypeFromLiteral(typeLiteral);
                if (_requestType) {
                  requestType = _requestType;
                }
              }

              if (requestType) {
                const camelRequestType = snakeToCamel(
                  capitalize(removeQuotes(requestType))
                );
                const newSchema = methodType.request.type + camelRequestType;

                if (requestTypeSchemaMap.has(newSchema)) {
                  requestTypeSchemaMap.set(
                    newSchema,
                    requestTypeSchemaMap.get(newSchema) + " | " + node.getText()
                  );
                } else {
                  requestTypeSchemaMap.set(newSchema, node.getText());
                }

                schemaToRequestType.set(newSchema, removeQuotes(requestType));
              }
              continue;
            }

            const typeLiteral = node.getFirstChildByKind(
              SyntaxKind.TypeLiteral
            );
            if (typeLiteral) {
              const requestType = getRequestTypeFromLiteral(typeLiteral);

              if (requestType) {
                const camelRequestType = snakeToCamel(
                  capitalize(removeQuotes(requestType))
                );
                const newSchema = methodType.request.type + camelRequestType;

                if (requestTypeSchemaMap.has(newSchema)) {
                  requestTypeSchemaMap.set(
                    newSchema,
                    requestTypeSchemaMap.get(newSchema) + " | " + node.getText()
                  );
                } else {
                  requestTypeSchemaMap.set(newSchema, node.getText());
                }

                schemaToRequestType.set(newSchema, removeQuotes(requestType));
              }
            }
          }
        }
      }

      addNewPropertyToSchema(source, requestTypeSchemaMap);
      for (const [key] of requestTypeSchemaMap) {
        queryTypes.push({
          requestType: schemaToRequestType.get(key)!,
          type: key,
          fromSchema: methodType.request.type,
        });
      }

      console.log(queryTypes);

      break;
    }
  }
}
