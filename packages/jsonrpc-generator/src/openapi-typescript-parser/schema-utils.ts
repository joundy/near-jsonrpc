import { PropertySignature, SourceFile, SyntaxKind } from "ts-morph";
import {
  OPENAPI_TS_COMPONENTS,
  OPENAPI_TS_SCHEMAS,
  parseOpenapiTSSchemaType,
} from "../utils/openapi-ts";

/**
 * Utility functions for working with OpenAPI TypeScript schemas
 */

/**
 * Gets the schema set from the source file
 */
export function getSchemaSet(source: SourceFile): Set<string> {
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

/**
 * Gets a specific schema property from the source file
 */
export function getSchemaProperty(
  source: SourceFile,
  schemaType: string
): PropertySignature {
  const componentAlias = source.getTypeAliasOrThrow(OPENAPI_TS_COMPONENTS);
  const typeLiteral = componentAlias.getFirstChildByKindOrThrow(
    SyntaxKind.TypeLiteral
  );

  return typeLiteral
    .getPropertyOrThrow(OPENAPI_TS_SCHEMAS)
    .asKindOrThrow(SyntaxKind.PropertySignature)
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral)
    .getPropertyOrThrow(schemaType)
    .asKindOrThrow(SyntaxKind.PropertySignature);
}

/**
 * Gets the schemas literal from the source file
 */
export function getSchemasLiteral(source: SourceFile) {
  const componentAlias = source.getTypeAliasOrThrow(OPENAPI_TS_COMPONENTS);
  const typeLiteral = componentAlias.getFirstChildByKindOrThrow(
    SyntaxKind.TypeLiteral
  );

  return typeLiteral
    .getPropertyOrThrow(OPENAPI_TS_SCHEMAS)
    .asKindOrThrow(SyntaxKind.PropertySignature)
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral);
}

/**
 * Processes a type and returns the appropriate type based on schema set
 */
export function processTypeWithSchemaSet(
  rawType: string,
  schemaSet: Set<string>,
  fromSchema: string
): { type: string; fromSchema: string } {
  const parsedType = parseOpenapiTSSchemaType(rawType);

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
