import { Project, SyntaxKind } from "ts-morph";
import { generateOpenapiTS, getOpenApiSpecLocal } from "./utils";
import { writeFileSync, writeSync } from "fs";

const OPENAPI_TS_COMPONENTS = "components";
const OPENAPI_TS_SCHEMAS = "schemas";

function openapiTSToSchemaTypes(openapiTS: string) {
  const project = new Project();

  // create a virtual file to access the typescript schemas from openapiTS
  const source = project.createSourceFile("openapi.ts", openapiTS);

  //   Get the components type alias
  const componentAlias = source.getTypeAliasOrThrow(OPENAPI_TS_COMPONENTS);

  // Get the schemas type literal
  const typeLiteral = componentAlias.getFirstChildByKindOrThrow(
    SyntaxKind.TypeLiteral
  );

  // Get all schema properties
  const schemaLiteral = typeLiteral
    .getPropertyOrThrow(OPENAPI_TS_SCHEMAS)
    .asKindOrThrow(SyntaxKind.PropertySignature)
    .getTypeNodeOrThrow()
    .asKindOrThrow(SyntaxKind.TypeLiteral);

  const properties = schemaLiteral.getProperties();

  let outputContent = `/**
 * This file was auto-generated from @near-js/jsonrpc-generator.
 * It contains all the extracted types from openapi spec.
 */

`;

  for (const property of properties) {
    const typeName = property.getName();
    const typeNode = property.getTypeNodeOrThrow();

    let typeDefinition = typeNode.getText();

    // TODO: find a better way to do this, this is a HACK!!
    // Replace the type definition with the coresponding type
    // components["schemas"]["AccessKey"] -> AccessKey
    const regex = /components\["schemas"\]\["([^"]+)"\]/g;
    typeDefinition = typeDefinition.replace(regex, "$1");

    outputContent += `export type ${typeName} = ${typeDefinition};\n`;
  }

  return outputContent;
}

async function main() {
  const spec = getOpenApiSpecLocal();

  const openapiTS = await generateOpenapiTS(spec);
  const parsedOpenapiTS = openapiTSToSchemaTypes(openapiTS);

  writeFileSync("openapi-types.ts", parsedOpenapiTS);
}

main();
