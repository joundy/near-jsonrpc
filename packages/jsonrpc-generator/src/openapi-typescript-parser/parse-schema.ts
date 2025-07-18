import {
  PropertyDeclaration,
  PropertySignature,
  SourceFile,
  SyntaxKind,
  TypeNode,
} from "ts-morph";
import { OPENAPI_TS_COMPONENTS, OPENAPI_TS_SCHEMAS } from "../utils/openapi-ts";
import type { SchemaType } from "../types";
import { snakeToCamel } from "../utils/formarter";

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
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral);

  const propertySignatures = schemaLiteral.getChildrenOfKind(
    SyntaxKind.PropertySignature
  );

  const mappedCamelToSnakeProperty = new Map<string, string>();

  for (const property of propertySignatures) {
    const descendants = property.getDescendantsOfKind(
      SyntaxKind.PropertySignature
    );

    // TODO: optimize this, this is a expensive/cpu intensive operation
    // convert snake_case property into camelCase
    for (const property of descendants) {
      const name = property.getName();
      const camelize = snakeToCamel(name);

      if (name !== camelize) {
        mappedCamelToSnakeProperty.set(camelize, name);
      }
    }
  }

  const properties = schemaLiteral.getProperties();
  const schemaTypes: SchemaType[] = [];

  // for (const property of properties) {
  //   const typeName = property.getName();
  //   const typeNode = property.getTypeNodeOrThrow();

  //   let typeDefinition = typeNode.getText();

  //   const regex = /components\["schemas"\]\["([^"]+)"\]/g;
  //   // TODO: find a better way to do this, this is a HACK!! but maybe it's the most efficient way
  //   // replacing using finding references are type safed but it expensive and slow
  //   //
  //   // Replace the type definition with the coresponding type
  //   // components["schemas"]["AccessKey"] -> AccessKey
  //   typeDefinition = typeDefinition.replace(regex, "$1");

  //   schemaTypes.push({
  //     schema: typeName,
  //     type: typeDefinition,
  //   });
  // }

  return {
    schemaTypes,
    mappedCamelToSnakeProperty,
  };
}
