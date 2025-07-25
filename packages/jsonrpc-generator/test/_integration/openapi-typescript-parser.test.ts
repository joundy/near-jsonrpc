import { parseOpenapiTS } from "../../src/openapi-typescript-parser/index";
import { readFileSync } from "fs";

describe("Integration: OpenAPI TypeScript Parser", () => {
  it("should parse OpenAPI spec and generate TypeScript types", async () => {
    const spec = readFileSync(
      "./test/_fixtures/openapi/minimal-nearcore/spec.ts",
      "utf-8"
    );

    let expected = JSON.parse(
      readFileSync(
        "./test/_fixtures/openapi/minimal-nearcore/spec-parsed.json",
        "utf-8"
      )
    );
    expected.schemas.mappedSnakeCamelProperty = new Map(
      Object.entries(expected.schemas.mappedSnakeCamelProperty)
    );

    const result = parseOpenapiTS(spec);
    expect(result).toEqual(expected);
  });

  // TODO: add more tests to handle edge cases
});
