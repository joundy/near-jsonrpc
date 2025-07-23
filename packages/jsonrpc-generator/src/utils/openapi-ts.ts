import openapiTS, { astToString } from "openapi-typescript";

export const OPENAPI_TS_COMPONENTS = "components";
export const OPENAPI_TS_SCHEMAS = "schemas";
export const OPENAPI_TS_OPERATIONS = "operations";

export const OPENAPI_TS_OPERATION_REQUEST_BODY = "requestBody";
export const OPENAPI_TS_OPERATION_REQUEST_BODY_CONTENT = "content";

export const OPENAPI_TS_OPERATION_RESPONSES = "responses";
export const OPENAPI_TS_OPERATION_RESPONSES_200 = "200";

export const OPENAPI_TS_OPERATION_CONTENT_TYPE = `"application/json"`;

export async function generateOpenapiTS(spec: string) {
  const ast = await openapiTS(spec, {
    emptyObjectsUnknown: true,
    alphabetize: true,
    exportType: true,
  });
  return astToString(ast);
}

// TODO: find a better way to do this, this is a HACK!! but maybe it's the most efficient way
// replacing using finding references are type safed but it expensive and slow
//
// Replace the type definition with the coresponding type
// components["schemas"]["AccessKey"] -> AccessKey
export function parseOpenapiTSSchemaType(schemaType: string) {
  const regex = /components\["schemas"\]\["([^"]+)"\]/g;
  return schemaType.replace(regex, "$1");
}

export function toOpenApiTSSchemaType(schemaType: string) {
  return `components["schemas"]["${schemaType}"]`;
}
