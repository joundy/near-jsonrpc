import { Project } from "ts-morph";
import { GENERATED_COMMENT } from "./constants";

export function buildTypes() {
  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile("__temp__builder_types.ts", "");
  source.insertStatements(0, GENERATED_COMMENT);

  source.addImportDeclaration({
    moduleSpecifier: "zod/v4",
    namedImports: ["z"],
  });

  source
    .addTypeAlias({
      name: "Method",
      typeParameters: [
        { name: "TRequest" },
        { name: "TResponse" },
        { name: "TError" },
      ],
      type: "{\n  readonly methodName: string;\n  readonly zodRequest: z.ZodType<TRequest>;\n  readonly zodResponse: z.ZodType<TResponse>;\n  readonly zodError: z.ZodType<TError>;\n}",
      isExported: true,
    })
    .addJsDoc({
      description: "Type alias for a method with type parameters",
    });

  source
    .addFunction({
      name: "defineMethod",
      typeParameters: [
        { name: "TRequest" },
        { name: "TResponse" },
        { name: "TError" },
      ],
      parameters: [
        { name: "methodName", type: "string" },
        { name: "zodRequest", type: "z.ZodType<TRequest>" },
        { name: "zodResponse", type: "z.ZodType<TResponse>" },
        { name: "zodError", type: "z.ZodType<TError>" },
      ],
      returnType: "Method<TRequest, TResponse, TError>",
      isExported: true,
    })
    .setBodyText("return { methodName, zodRequest, zodResponse, zodError };")
    .addJsDoc({
      description:
        "Function to create a method definition with type parameters",
    });

  // Add RequestType helper type
  source
    .addTypeAlias({
      name: "RequestType",
      typeParameters: [{ name: "T", constraint: "Method<any, any, any>" }],
      type: "T extends Method<infer R, any, any> ? R : never",
      isExported: true,
    })
    .addJsDoc({
      description: "Type helper to extract the request type from a method",
    });

  // Add ResponseType helper type
  source
    .addTypeAlias({
      name: "ResponseType",
      typeParameters: [{ name: "T", constraint: "Method<any, any, any>" }],
      type: "T extends Method<any, infer R, any> ? R : never",
      isExported: true,
    })
    .addJsDoc({
      description: "Type helper to extract the response type from a method",
    });

  // Add ErrorType helper type
  source
    .addTypeAlias({
      name: "ErrorType",
      typeParameters: [{ name: "T", constraint: "Method<any, any, any>" }],
      type: "T extends Method<any, any, infer E> ? E : never",
      isExported: true,
    })
    .addJsDoc({
      description: "Type helper to extract the error type from a method",
    });

  source.formatText();

  const text = source.getFullText();
  project.removeSourceFile(source);

  return text;
}
