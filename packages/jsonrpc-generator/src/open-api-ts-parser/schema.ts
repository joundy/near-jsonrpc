import { SourceFile, SyntaxKind } from "ts-morph";
import { OPENAPI_TS_COMPONENTS, OPENAPI_TS_SCHEMAS } from "../utils/openapi-ts";
import { removeQuotes } from "../utils";
import { writeFileSync } from "fs";

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

  let outputSchemas = ``;

  for (const property of properties) {
    const typeName = property.getName();
    // if (typeName !== "BandwidthRequestBitmap") {
    //   continue;
    // }

    console.log({ typeName });
    const typeNode = property.getTypeNodeOrThrow();

    const findReferences = property.findReferences();
    const ref = findReferences[0]!; // TODO: should validate this
    const references = ref.getReferences();

    for (const reference of references) {
      const node = reference.getNode();

      if (node.wasForgotten()) {
        console.log("##  was forgotten");
        continue;
      }

      if (node.getKind() === SyntaxKind.Identifier) {
        console.log("##  identifier");
        continue;
      }

      const parent = node
        .getParent()!
        .getParent()!
        .asKind(SyntaxKind.IndexedAccessType);

      if (parent) {
        parent.replaceWithText(
          removeQuotes(parent.getIndexTypeNode().getText())
        );
      }

      // console.log(parent.getFullText());

      // const indexedNode = node.getFirstAncestorByKind(
      //   SyntaxKind.IndexedAccessType
      // );
      // if (indexedNode) {
      //   indexedNode.replaceWithText(removeQuotes(indexedNode.getText()));
      // }

      // console.log(ancestor.getFullText());
    }

    // for (const findReference of findReferences) {
    //   const references = findReference.getReferences();
    //   for (const reference of references) {
    //     const node = reference.getNode();
    //     console.log(node.getText())
    //   }
    // }

    // let typeDefinition = typeNode.getText();

    // TODO: find a better way to do this, this is a HACK!!
    // Replace the type definition with the coresponding type
    // components["schemas"]["AccessKey"] -> AccessKey
    // const regex = /components\["schemas"\]\["([^"]+)"\]/g;
    // typeDefinition = typeDefinition.replace(regex, "$1");

    // outputSchemas += `export type ${typeName} = ${typeDefinition};\n`;

    // console.log(typeName);
  }

  // console.log(outputSchemas);

  // console.log(source.getFullText());

  writeFileSync("./output-test-test.ts", source.getFullText());

  return outputSchemas;
}
