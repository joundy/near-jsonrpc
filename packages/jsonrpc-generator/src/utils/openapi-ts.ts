import openapiTS, { astToString } from "openapi-typescript";

export async function generateOpenapiTS(spec: string) {
  const ast = await openapiTS(spec, {
    emptyObjectsUnknown: true,
    alphabetize: true,
    exportType: true,
  });
  return astToString(ast);
}