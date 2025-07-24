import { Project, VariableDeclarationKind } from "ts-morph";
import { GENERATED_COMMENT } from "./constants";

export function buildMappedProperties(
  mappedSnakeCamelProperty: Map<string, string>
) {
  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile(
    "__temp__builder_mapped_properties.ts",
    ""
  );
  source.insertStatements(0, GENERATED_COMMENT);

  source.addVariableStatement({
    declarations: [
      {
        name: "mappedSnakeCamelProperty",
        initializer: `new Map<string, string>([${Array.from(
          mappedSnakeCamelProperty.entries()
        )
          .map(([key, value]) => `["${key}", "${value}"]`)
          .join(",\n      ")}])`,
      },
    ],
    declarationKind: VariableDeclarationKind.Const,
    isExported: true,
  });

  source.formatText();

  const text = source.getFullText();
  project.removeSourceFile(source);

  return text;
}
