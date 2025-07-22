import { SourceFile, SyntaxKind } from "ts-morph";
import { OPENAPI_TS_COMPONENTS, OPENAPI_TS_SCHEMAS } from "../utils/openapi-ts";
import type { SchemaType } from "../types";
import { snakeToCamel } from "../utils";

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

  const mappedSnakeCamelProperty = new Map<string, string>();
  const schemaTypes: SchemaType[] = [];

  // TODO: add property mapper, to make sure the camelize and snakekies are parsed correctly
  for (const property of propertySignatures) {
    const propertyDescendants = property.getDescendantsOfKind(
      SyntaxKind.PropertySignature
    );
    if (propertyDescendants.length > 0) {
      // TODO: optimize this, this is a heavy operation: -> https://ts-morph.com/manipulation/performance,
      // ^^ not necessary for the generator because it's will be used rarely, but it's a good practice
      // convert property name from snake_case to camelCase, TYPE SAFE!!
      console.info(
        `🔄 Processing ${
          propertyDescendants.length
        } properties from ${property.getName()} for snake_case to camelCase conversion`
      );
      for (const property of propertyDescendants) {
        const name = property.getName();
        const camelize = snakeToCamel(name);
        if (name !== camelize) {
          mappedSnakeCamelProperty.set(name, camelize);
          property.rename(camelize);
        }
      }
    }

    console.info(`✅ Property renaming complete for ${property.getName()}`);

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

  return {
    schemaTypes,
    mappedSnakeCamelProperty,
  };
}
