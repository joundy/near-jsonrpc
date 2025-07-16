import { SourceFile, SyntaxKind } from "ts-morph";
import { OPENAPI_TS_COMPONENTS, OPENAPI_TS_SCHEMAS } from "../utils/openapi-ts";

export function parseSchemaTypes(source: SourceFile) {
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

    // const findReferences = property.findReferences();
    // const ref = findReferences[0]!; // TODO: should validate this
    // const references = ref.getReferences();

    // for (const reference of references) {
    //   const node = reference.getNode();
    //   if (node.getKind() === SyntaxKind.Identifier) {
    //     continue;
    //   }
    //   const ancestor = node.getFirstAncestorByKindOrThrow(
    //     SyntaxKind.IndexedAccessType
    //   );
    //   console.log(ancestor.getFullText());
    // }

    // for (const findReference of findReferences) {
    //   const references = findReference.getReferences();
    //   for (const reference of references) {
    //     const node = reference.getNode();
    //     console.log(node.getText())
    //   }
    // }

    let typeDefinition = typeNode.getText();

    // TODO: find a better way to do this, this is a HACK!!
    // Replace the type definition with the coresponding type
    // components["schemas"]["AccessKey"] -> AccessKey
    const regex = /components\["schemas"\]\["([^"]+)"\]/g;
    typeDefinition = typeDefinition.replace(regex, "$1");

    outputContent += `export type ${typeName} = ${typeDefinition};\n`;

    // if (typeName === "AccessKey") {
    //   break;
    // }
  }

  return outputContent;
}
