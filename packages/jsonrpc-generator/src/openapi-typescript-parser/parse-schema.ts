import { SourceFile, SyntaxKind } from "ts-morph";
import {
  OPENAPI_TS_COMPONENTS,
  OPENAPI_TS_SCHEMAS,
  parseOpenapiTSSchemaType,
} from "../utils/openapi-ts";
import type { SchemaType } from "../types";
import { snakeToCamel } from "../utils";

// This basically grabbing the schema types from the openapi.ts file and exporting them by its name
export function parseSchemaTypes(
  source: SourceFile,
  ignoreSchemaSet: Set<string>
) {
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

  for (const property of propertySignatures) {
    if (ignoreSchemaSet.has(property.getName())) {
      continue;
    }

    const propertyDescendants = property.getDescendantsOfKind(
      SyntaxKind.PropertySignature
    );
    if (propertyDescendants.length > 0) {
      // TODO: optimize this, this is a heavy/expensive operation: -> https://ts-morph.com/manipulation/performance,
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

    schemaTypes.push({
      schema: typeName,
      type: parseOpenapiTSSchemaType(typeNode.getText()),
    });
  }

  return {
    schemaTypes,
    mappedSnakeCamelProperty,
  };
}
