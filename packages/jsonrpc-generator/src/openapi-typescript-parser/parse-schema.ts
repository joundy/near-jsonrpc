import { SourceFile, SyntaxKind } from "ts-morph";
import { OPENAPI_TS_COMPONENTS, OPENAPI_TS_SCHEMAS } from "../utils/openapi-ts";
import type { SchemaType } from "../types";

// TODO: change property from snake_case to camelCase
// This basically grabbing the schema types from the openapi.ts file and exporting them by its name
export function parseSchemaTypes(source: SourceFile) {
  const componentAlias = source.getTypeAliasOrThrow(OPENAPI_TS_COMPONENTS);

  const typeLiteral = componentAlias.getFirstChildByKindOrThrow(
    SyntaxKind.TypeLiteral
  );

  // Getting the all schemas from the openapi spec
  const schemaLiteral = typeLiteral
    .getPropertyOrThrow(OPENAPI_TS_SCHEMAS)
    .asKindOrThrow(SyntaxKind.PropertySignature)
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral);

  const properties = schemaLiteral.getProperties();

  const schemaTypes: SchemaType[] = [];

  for (const property of properties) {
    const typeName = property.getName();
    const typeNode = property.getTypeNodeOrThrow();

    let typeDefinition = typeNode.getText();

    // TODO: find a better way to do this, this is a HACK!! but maybe it's the most efficient way
    // replacing using finding references are type safed but it expensive and slow
    //
    // Replace the type definition with the coresponding type
    // components["schemas"]["AccessKey"] -> AccessKey
    const regex = /components\["schemas"\]\["([^"]+)"\]/g;
    typeDefinition = typeDefinition.replace(regex, "$1");

    schemaTypes.push({
      schema: typeName,
      type: typeDefinition,
    });
  }

  return schemaTypes;
}
