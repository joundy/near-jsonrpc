import { PropertySignature, SourceFile, SyntaxKind, TypeNode } from "ts-morph";
import {
  addNewPropertyToSchema,
  getSchemaProperty,
  getSchemaSet,
} from "./utils";
import { MethodType } from "../types";
import {
  capitalize,
  findCommonStringsOfMapsByKey,
  mergeMaps,
  removeQuotes,
  snakeToCamel,
} from "../utils";

function getPropertiesHasStringLiteralFromTypeNode(
  node: TypeNode,
  strLiteralMap: Map<string, string>
) {
  if (node.isKind(SyntaxKind.ParenthesizedType)) {
    const typeNode = node
      .asKindOrThrow(SyntaxKind.ParenthesizedType)
      .getTypeNode();
    getPropertiesHasStringLiteralFromTypeNode(typeNode, strLiteralMap);
  }

  if (node.isKind(SyntaxKind.IntersectionType)) {
    const nodes = node
      .asKindOrThrow(SyntaxKind.IntersectionType)
      .getTypeNodes();

    for (const node of nodes) {
      getPropertiesHasStringLiteralFromTypeNode(node, strLiteralMap);
    }
  }

  if (node.isKind(SyntaxKind.TypeLiteral)) {
    const properties = node
      .asKindOrThrow(SyntaxKind.TypeLiteral)
      .getProperties();

    for (const property of properties) {
      const stringLiteral = property
        .getTypeNode()
        ?.asKind(SyntaxKind.LiteralType)
        ?.getFirstChildByKind(SyntaxKind.StringLiteral);
      if (stringLiteral) {
        strLiteralMap.set(
          property.getName(),
          removeQuotes(stringLiteral.getText())
        );
      }
    }
  }
}

export function expandDescriminatedMethods(
  source: SourceFile,
  methodTypes: MethodType[]
) {
  const schemaSet = getSchemaSet(source);
  const schemaMaps: Map<string, string>[] = [];

  for (const methodType of methodTypes) {
    if (!schemaSet.has(methodType.request.type)) {
      continue;
    }

    const property = getSchemaProperty(source, methodType.request.type);
    const union = property.getFirstChildByKind(SyntaxKind.UnionType);
    if (!union) {
      continue;
    }

    const nodes = union.getTypeNodes();

    const strLiteralMaps: Map<string, string>[] = [];

    for (const node of nodes) {
      const strLiteralMap = new Map<string, string>();
      getPropertiesHasStringLiteralFromTypeNode(node, strLiteralMap);
      strLiteralMaps.push(strLiteralMap);
    }
    const commonStrings = findCommonStringsOfMapsByKey(strLiteralMaps);
    if (commonStrings.length !== 1) {
      continue;
    }
    const discriminator = commonStrings[0]!;

    const schemaMap = new Map<string, string>();
    const discriminatorValueToSchemaMap = new Map<string, string>();

    for (const [key, value] of strLiteralMaps.entries()) {
      const disValue = value.get(discriminator)!;
      const nodeType = nodes[key]!.getText();

      const schema = `${methodType.request.type}${capitalize(
        snakeToCamel(disValue)
      )}`;

      if (schemaMap.has(schema)) {
        schemaMap.set(
          schema,
          schemaMap.get(schema) + " | " + nodeType // combine the types using union if there's multiple discriminator that has the same value
        );
      } else {
        schemaMap.set(schema, nodeType);
      }

      discriminatorValueToSchemaMap.set(disValue, schema);
    }

    for (const [key, value] of discriminatorValueToSchemaMap) {
      methodTypes.push({
        request: {
          type: value,
          method: methodType.request.method,
          fromSchema: methodType.request.fromSchema,
          discriminatedType: {
            property: discriminator,
            value: key,
          },
        },
        response: methodType.response,
        error: methodType.error,
      });
    }

    schemaMaps.push(schemaMap);
  }

  addNewPropertyToSchema(source, mergeMaps(schemaMaps));
}
