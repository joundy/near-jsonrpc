import { Project, VariableDeclarationKind } from "ts-morph";
import { GENERATED_COMMENT } from "./constants";
import type { ZodSchemaType } from "../types";

export type BuildZodSchemasOptions = {
  schemaDependency?: {
    location: string;
    dependencies: string[];
  };
};

export function buildZodSchemas(
  zodSchemasTypes: ZodSchemaType[],
  options: BuildZodSchemasOptions
) {
  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile("__temp__builder_zod_schemas.ts", "");
  source.insertStatements(0, GENERATED_COMMENT);

  source.addImportDeclaration({
    moduleSpecifier: "zod/v4",
    namedImports: ["z"],
  });

  if (options.schemaDependency) {
    source.addImportDeclaration({
      moduleSpecifier: options.schemaDependency.location,
      namedImports: options.schemaDependency.dependencies,
      isTypeOnly: true,
    });
  }

  source.addVariableStatements(
    zodSchemasTypes.map((schema) => {
      return {
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: schema.schema,
            initializer: schema.type,
            type: schema.zodType ? `z.ZodType<${schema.zodType}>` : undefined,
          },
        ],
      };
    })
  );

  source.formatText();

  const text = source.getFullText();
  project.removeSourceFile(source);

  return text;
}
