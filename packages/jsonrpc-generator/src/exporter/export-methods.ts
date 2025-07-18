import { Project, VariableDeclarationKind } from "ts-morph";
import type { MethodType } from "../types";
import { snakeToCamel } from "../utils/formarter";
import { GENERATED_COMMENT } from "../utils";

export function exportMethods(methods: MethodType[], neededSchemas: string[]) {
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
    namedImports: neededSchemas,
    isTypeOnly: true,
  });

  source.addVariableStatements(
    methods.map((method) => {
      let response = method.response.schema;
      if (method.response.isArray) {
        response = `${method.response.schema}[]`;
      }
      if (method.response.isNullable) {
        response = `${method.response.schema} | null`;
      }

      return {
        declarationKind: VariableDeclarationKind.Const,
        isExported: true,
        declarations: [
          {
            name: snakeToCamel(method.request.method),
            initializer: `defineMethod<${method.request.schema}, ${response}, RpcError>("${method.request.method}")`,
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

  return source.getFullText();
}
