import { Project } from "ts-morph";
import { GENERATED_COMMENT } from "./constants";

export function buildTypes() {
  const project = new Project({
    compilerOptions: {
      strict: true,
    },
  });

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
        { name: "DefaultTRequest", default: "undefined" },
      ],
      type: "{\n  readonly methodName: string;\n  readonly zodRequest: z.ZodType<TRequest>;\n  readonly zodResponse: z.ZodType<TResponse>;\n  readonly zodError: z.ZodType<TError>;\n  readonly defaultRequest?: DefaultTRequest;\n}",
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
        { name: "DefaultTRequest", default: "undefined" },
      ],
      parameters: [
        { name: "methodName", type: "string" },
        { name: "zodRequest", type: "z.ZodType<TRequest>" },
        { name: "zodResponse", type: "z.ZodType<TResponse>" },
        { name: "zodError", type: "z.ZodType<TError>" },
        {
          name: "defaultRequest",
          type: "DefaultTRequest",
          hasQuestionToken: true,
        },
      ],
      returnType: "Method<TRequest, TResponse, TError, DefaultTRequest>",
      isExported: true,
    })
    .setBodyText(
      "return { methodName, zodRequest, zodResponse, zodError, defaultRequest };"
    )
    .addJsDoc({
      description:
        "Function to create a method definition with type parameters",
    });

  // Add RequestType helper type
  source
    .addTypeAlias({
      name: "RequestType",
      typeParameters: [{ name: "T", constraint: "Method<any, any, any, any>" }],
      type: "T extends Method<infer R, any, any, any> ? R : never",
      isExported: true,
    })
    .addJsDoc({
      description: "Type helper to extract the request type from a method",
    });

  // Add ResponseType helper type
  source
    .addTypeAlias({
      name: "ResponseType",
      typeParameters: [{ name: "T", constraint: "Method<any, any, any, any>" }],
      type: "T extends Method<any, infer R, any, any> ? R : never",
      isExported: true,
    })
    .addJsDoc({
      description: "Type helper to extract the response type from a method",
    });

  // Add ErrorType helper type
  source
    .addTypeAlias({
      name: "ErrorType",
      typeParameters: [{ name: "T", constraint: "Method<any, any, any, any>" }],
      type: "T extends Method<any, any, infer E, any> ? E : never",
      isExported: true,
    })
    .addJsDoc({
      description: "Type helper to extract the error type from a method",
    });

  // Add DefaultRequestType helper type
  source
    .addTypeAlias({
      name: "DefaultRequestType",
      typeParameters: [{ name: "T", constraint: "Method<any, any, any, any>" }],
      type: "T extends Method<any, any, any, infer D> ? D : never",
      isExported: true,
    })
    .addJsDoc({
      description:
        "Type helper to extract the default request type from a method",
    });

  // Add DistributiveOmit utility type
  source
    .addTypeAlias({
      name: "DistributiveOmit",
      typeParameters: [{ name: "T" }, { name: "K", constraint: "PropertyKey" }],
      type: "T extends any ? Pick<T, Exclude<keyof T, K>> : never",
      isExported: true,
    })
    .addJsDoc({
      description:
        "Utility type to omit properties from a type in a distributive manner",
    });

  source.formatText();

  const text = source.getFullText();
  project.removeSourceFile(source);

  return text;
}
