import { PropertySignature, SourceFile, SyntaxKind } from "ts-morph";
import { OPENAPI_TS_COMPONENTS, OPENAPI_TS_SCHEMAS } from "./constants";

/**
 * Utility functions for working with OpenAPI TypeScript schemas
 * TODO: cache when getting the data
 */

/**
 * Gets the schema set from the source file
 * schema from the type components.schemas
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
 * Gets the schemas literal from the source file
 * example of schema property: components.schemas.RpcRequestHealth = {<object_data>}
 * {<object_data>} this is the type literal or the data/object of selected schema
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
 * Gets a specific schema property from the source file
 * example of schema property: components.schemas.RpcRequestHealth
 */
export function getSchemaProperty(
  source: SourceFile,
  schema: string
): PropertySignature {
  return getSchemasLiteral(source)
    .getPropertyOrThrow(schema)
    .asKindOrThrow(SyntaxKind.PropertySignature);
}

// TODO: find a better way to do this, this is a HACK!! but maybe it's the most efficient way
// replacing using finding references are type safed but it expensive and slow
// Replace the type definition with the coresponding type
// components["schemas"]["AccessKey"] -> AccessKey
export function replaceAllIndexedSchemas(schemaType: string) {
  const regex = /components\["schemas"\]\["([^"]+)"\]/g;
  return schemaType.replace(regex, "$1");
}
