import { Project, VariableDeclarationKind } from "ts-morph";
import type { MethodType } from "../types";
import { snakeToCamel } from "../utils";
import { GENERATED_COMMENT } from "./constants";

export type BuildMethodsOptions = {
  schemasLocation: string;
  typesLocation: string;
  zodSchemaLocation: string;
  zodSuffix: string;
};

export function buildMethods(
  methods: MethodType[],
  options: BuildMethodsOptions
) {
  const uniqueNeededSchemasSet = new Set<string>();
  for (const methodType of methods) {
    uniqueNeededSchemasSet.add(methodType.request.type);
    uniqueNeededSchemasSet.add(methodType.response.type);
    uniqueNeededSchemasSet.add(methodType.error.type);
  }
  const neededSchemas = Array.from(uniqueNeededSchemasSet);

  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile("__temp__builder_methods.ts", "");
  source.insertStatements(0, GENERATED_COMMENT);

  source.addImportDeclaration({
    moduleSpecifier: options.typesLocation,
    namedImports: ["defineMethod"],
  });

  source.addImportDeclaration({
    moduleSpecifier: options.schemasLocation,
    namedImports: neededSchemas,
    isTypeOnly: true,
  });

  source.addImportDeclaration({
    moduleSpecifier: options.zodSchemaLocation,
    namedImports: neededSchemas.map(
      (schema) => `${schema}${options.zodSuffix}`
    ),
  });

  source.addVariableStatements(
    methods.map((method) => {
      return {
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: snakeToCamel(method.request.method),
            initializer: (writer) => {
              writer
                .write(
                  `defineMethod<${method.request.type}, ${method.response.type}, ${method.error.type}>(`
                )
                .quote(method.request.method)
                .write(", ")
                .write(`${method.request.type}${options.zodSuffix}`)
                .write(", ")
                .write(`${method.response.type}${options.zodSuffix}`)
                .write(", ")
                .write(`${method.error.type}${options.zodSuffix}`)
                .write(")");
            },
          },
        ],
        docs: [
          {
            description: `Method definition for ${method.request.method} RPC call`,
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
