import { Project } from "ts-morph";
import { GENERATED_COMMENT_WITH_CREDITS } from "../utils";
import type { SchemaType } from "../types";

export function buildSchemas(schemaTypes: SchemaType[]) {
  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile("__temp__builder_schemas.ts", "");
  source.insertStatements(0, GENERATED_COMMENT_WITH_CREDITS);

  source.addTypeAliases(
    schemaTypes.map((schema) => ({
      name: schema.schema,
      type: schema.type,
      isExported: true,
    }))
  );

  source.formatText();

  const text = source.getFullText();
  project.removeSourceFile(source)

  return text
}
