import { Project } from "ts-morph";
import { GENERATED_COMMENT_WITH_CREDITS } from "../utils";
import type { SchemaType } from "../types";

export type BuildZodTypeCheckerOptions = {
  schemasLocation: string;
  zodSchemasLocation: string;
  zodSchemaSuffix: string;
};

export function buildZodTypeChecker(
  schemaTypes: SchemaType[],
  options: BuildZodTypeCheckerOptions
) {
  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile(
    "__temp__builder_zod_type_checker.ts",
    ""
  );
  source.insertStatements(0, GENERATED_COMMENT_WITH_CREDITS);
  source.addImportDeclaration({
    moduleSpecifier: "expect-type",
    namedImports: ["expectTypeOf"],
  });
  source.addImportDeclaration({
    moduleSpecifier: "zod/v4",
    namedImports: ["z"],
  });
  source.addImportDeclaration({
    moduleSpecifier: options.zodSchemasLocation,
    namedImports: schemaTypes.map(
      (schema) => schema.schema + options.zodSchemaSuffix
    ),
  });
  source.addImportDeclaration({
    moduleSpecifier: options.schemasLocation,
    namedImports: schemaTypes.map((schema) => schema.schema),
  });

  source.addStatements(["\n\n"]);

  source.addStatements(
    schemaTypes.map(
      (schema) =>
        `expectTypeOf<z.infer<typeof ${schema.schema}${options.zodSchemaSuffix}>>().toEqualTypeOf<${schema.schema}>();`
    )
  );

  source.formatText();

  const text = source.getFullText();
  project.removeSourceFile(source);

  return text;
}
