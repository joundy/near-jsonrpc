import { SchemaType } from "../../src/types";
import { validateZodSchema } from "../../src/zod-validator";
import { readFileSync } from "fs";

describe("Integration: Zod Validator against generated schemas", () => {
  const schemaTs = readFileSync(
    "./test/_fixtures/openapi/minimal-nearcore/spec-schema.ts",
    "utf-8"
  );
  const zodSchemaTs = readFileSync(
    "./test/_fixtures/openapi/minimal-nearcore/spec-zod-schema.ts",
    "utf-8"
  );
  let schemaTypes = JSON.parse(
    readFileSync(
      "./test/_fixtures/openapi/minimal-nearcore/spec-parsed.json",
      "utf-8"
    )
  ).schemas.schemaTypes as SchemaType[];

  it("should validate Zod schemas against TS schemas", async () => {
    await validateZodSchema({
      schemas: schemaTypes.map((schema) => schema.schema),
      schemaTs,
      zodSchemaTs,
      zodSchemaSuffix: "ZodSchema",
      validateAll: true,
    });
  });

  it("should validate Zod schemas against TS schemas one by one", async () => {
    await validateZodSchema({
      schemas: schemaTypes.map((schema) => schema.schema).slice(0, 1), // only test 1 schema
      schemaTs,
      zodSchemaTs,
      zodSchemaSuffix: "ZodSchema",
      validateAll: false,
    });
  });

  // TODO: add more tests to handle edge cases
});
