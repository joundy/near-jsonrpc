import {
  Project,
  SourceFile,
  SyntaxKind,
  TypeAliasDeclaration,
  TypeLiteralNode,
  UnionTypeNode,
} from "ts-morph";

type RefDiscriminator = {
  referenceSchema: string;
  properties: string[];
};

type SchemaDiscriminator = {
  schema: string;
  refDiscriminators: RefDiscriminator[];
  typeLiteral?: string;
};

function extractSchemaPropertiesNonOptional(schema: TypeLiteralNode) {
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

function discriminateUnionTypeReference(
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

export function generateDiscriminators(schemasTs: string) {
  const project = new Project();
  const source = project.createSourceFile(
    "__temp__discriminators.ts",
    schemasTs
  );

  const schemas = source.getTypeAliases();

  const schemaDiscriminators: SchemaDiscriminator[] = [];

  for (const schema of schemas) {
    const schemaDiscriminator: SchemaDiscriminator = {
      schema: schema.getName(),
      refDiscriminators: [],
    };

    const typeNode = schema.getTypeNode();
    if (typeNode) {
      if (typeNode.isKind(SyntaxKind.UnionType)) {
        const unionType = typeNode.asKindOrThrow(SyntaxKind.UnionType);
        schemaDiscriminator.refDiscriminators = discriminateUnionTypeReference(
          source,
          unionType
        );
      }

      if (typeNode.isKind(SyntaxKind.IntersectionType)) {
        const intersectionType = typeNode.asKindOrThrow(
          SyntaxKind.IntersectionType
        );

        const intersectionNodes = intersectionType.getTypeNodes();
        // Right now we only support intersection of 2 types, one of them should be type literal and another one should be parenthesized union type
        if (intersectionNodes.length !== 2) {
          continue;
        }

        const typeLiteralNode = intersectionNodes.find((node) =>
          node.isKind(SyntaxKind.TypeLiteral)
        );
        if (!typeLiteralNode) {
          continue;
        }

        const parenthesized = intersectionNodes.find((node) =>
          node.isKind(SyntaxKind.ParenthesizedType)
        );
        if (!parenthesized) {
          continue;
        }

        const parenthesizedNode = parenthesized.getTypeNode();
        if (!parenthesizedNode) {
          continue;
        }
        if (!parenthesizedNode.isKind(SyntaxKind.UnionType)) {
          continue;
        }

        const unionType = parenthesizedNode.asKindOrThrow(SyntaxKind.UnionType);

        schemaDiscriminator.refDiscriminators = discriminateUnionTypeReference(
          source,
          unionType
        );

        schemaDiscriminator.typeLiteral = typeLiteralNode.getText();
      }
    }

    if (schemaDiscriminator.refDiscriminators.length > 0) {
      schemaDiscriminators.push(schemaDiscriminator);
    }
  }

  console.log(schemaDiscriminators);

  project.removeSourceFile(source);
}
