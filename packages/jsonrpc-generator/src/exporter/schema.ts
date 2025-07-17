import { Project } from "ts-morph";
import { GENERATED_COMMENT } from "../utils";

export function exportSchemas(schemas: string) {
  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile("__temp__exporter_schemas.ts", "");
  // TODO: add generated comments
  source.insertStatements(0, schemas);

  source.formatText();

  return source.getFullText();
}
