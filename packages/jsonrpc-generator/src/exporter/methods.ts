import { Project, VariableDeclarationKind } from "ts-morph";
import type { MethodType } from "../types";
import { snakeToCamel } from "../utils/formarter";
import { GENERATED_COMMENT } from "../utils";

export function exportMethods(methods: MethodType[]) {
  const uniqueNeededSchemas = new Set<string>();
  for (const method of methods) {
    uniqueNeededSchemas.add(method.request.schema);
    uniqueNeededSchemas.add(method.response.schema);
    uniqueNeededSchemas.add(method.error.schema);
  }

  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile("__temp__exporter_methods.ts", "");
  source.insertStatements(0, GENERATED_COMMENT);

  source.addImportDeclaration({
    moduleSpecifier: "./types",
    namedImports: ["defineMethod"],
  });

  source.addImportDeclaration({
    moduleSpecifier: "./schemas",
    namedImports: uniqueNeededSchemas.values().toArray(),
    isTypeOnly: true,
  });

  for (const method of methods) {
    source
      .addVariableStatement({
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: snakeToCamel(method.request.method),
            initializer: `defineMethod<${method.request.schema}, ${method.response.schema}, RpcError>("${method.request.method}")`,
          },
        ],
      })
      .addJsDoc({
        description: `Method definition for ${method.request.method} RPC call`,
      });
  }

  source.formatText();

  return source.getFullText();
}
