import { Project } from "ts-morph";
import { parseSchemaTypes } from "./schema";
import { parseMethodTypes } from "./method";

export function getSource(openapiTS: string) {
  const project = new Project();

  // create a virtual file to access the typescript schemas from openapiTS
  const source = project.createSourceFile("__temp__openapi.ts", openapiTS);

  return source;
}

export function parseOpenapiTS(openapiTS: string) {
  const source = getSource(openapiTS);

  // const schemaTypes = parseSchemaTypes(source);
  const methods = parseMethodTypes(source);

  // TODO: need to add more work for this
  const schemas = parseSchemaTypes(source);

  return {
    methods,
    schemas,
  };
}
