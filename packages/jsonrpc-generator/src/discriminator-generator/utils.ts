import {
  SourceFile,
  SyntaxKind,
  TypeLiteralNode,
  UnionTypeNode,
} from "ts-morph";
import { RefDiscriminator } from "../types";

export function extractSchemaPropertiesNonOptional(schema: TypeLiteralNode) {
  const propertyNames: string[] = [];
  const properties = schema.getProperties();
  for (const property of properties) {
    const isOptional = property.hasQuestionToken();
    if (!isOptional) {
      propertyNames.push(property.getName());
    }
  }

  return propertyNames;
}

export function discriminateUnionTypeReference(
  source: SourceFile,
  unionType: UnionTypeNode
): RefDiscriminator[] {
  const typeNodes = unionType.getTypeNodes();

  const discriminators: RefDiscriminator[] = [];
  for (const typeNode of typeNodes) {
    if (typeNode.isKind(SyntaxKind.TypeReference)) {
      const reference = typeNode.asKindOrThrow(SyntaxKind.TypeReference);
      const referenceName = reference.getText();

      const schemaTypeLiteral = source
        .getTypeAliasOrThrow(referenceName)
        .getFirstChildByKind(SyntaxKind.TypeLiteral);

      if (schemaTypeLiteral) {
        const properties =
          extractSchemaPropertiesNonOptional(schemaTypeLiteral);

        discriminators.push({
          referenceSchema: referenceName,
          properties,
        });
      }
    }
  }

  return discriminators;
}
