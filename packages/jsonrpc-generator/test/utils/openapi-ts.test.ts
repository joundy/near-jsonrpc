import { generateOpenapiTS } from "../../src/utils/openapi-ts";
import { readFileSync } from "fs";
import { join } from "path";

describe("generateOpenapiTS", () => {
  const fixtureDir = join(
    __dirname,
    "../../test/_fixtures/openapi/minimal-nearcore"
  );
  const inputSpecPath = join(fixtureDir, "spec.json");
  const expectedOutputPath = join(fixtureDir, "spec.ts");

  let inputSpec: string;
  let expectedOutput: string;

  beforeAll(() => {
    // Read the fixture files
    inputSpec = readFileSync(inputSpecPath, "utf-8");
    expectedOutput = readFileSync(expectedOutputPath, "utf-8");
  });

  it("should generate TypeScript types that match the expected fixture output", async () => {
    const result = await generateOpenapiTS(inputSpec);

    expect(result).toBe(expectedOutput);
  });
});
