import { Project } from "ts-morph";
import { parseSchemaTypes } from "./parse-schema";
import { parseMethodTypes } from "./parse-method";

// OPENAPI TS is generated from the library openapi-typescript https://openapi-ts.dev/
// this parser is used for getting the methods and schemas for coresponding near json rpc methods
export function parseOpenapiTS(openapiTS: string) {
  const project = new Project();

  // create a virtual file to access the typescript schemas from openapiTS
  const source = project.createSourceFile("__temp__openapi.ts", openapiTS);

  const methods = parseMethodTypes(source);
  const schemas = parseSchemaTypes(source);

  project.removeSourceFile(source);

  return {
    methods,
    schemas,
  };
}
