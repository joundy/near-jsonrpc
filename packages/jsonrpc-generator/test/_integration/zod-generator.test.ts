import { generateZodSchemas } from "../../src/zod-generator";
import { readFileSync } from "fs";

describe("Integration: Zod Generator", () => {
  it("should generate Zod schemas from schema types", async () => {
    const schemaTs = readFileSync(
      "./test/_fixtures/openapi/minimal-nearcore/spec-schema.ts",
      "utf-8"
    );
    const expected = JSON.parse(
      readFileSync(
        "./test/_fixtures/openapi/minimal-nearcore/spec-zod-parsed.json",
        "utf-8"
      )
    );

    const result = generateZodSchemas(schemaTs, "ZodSchema");
    expect(result).toEqual(expected);
  });

  // TODO: add more tests to handle edge cases
});
