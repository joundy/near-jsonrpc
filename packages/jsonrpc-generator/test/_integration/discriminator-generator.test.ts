import { generateDiscriminators } from "../../src/discriminator-generator";
import { SchemaDiscriminator } from "../../src/types";

describe("Integration: Discriminator Generator", () => {
  it("should generate discriminator spec with type literal", () => {
    const fixture = {
      schemaTs: `
export type TypeA = {
  type_a_a: string,
  type_a_b: number
}
export type TypeB = {
  type_b_a: string,
  type_b_b: number
}
export type WantToDiscriminate = {
  a: string,
  b: number
} & (TypeA | TypeB);
`,
    };

    const expected: SchemaDiscriminator[] = [
      {
        schema: "WantToDiscriminate",
        typeLiteral: `{\n  a: string,\n  b: number\n}`,
        refDiscriminators: [
          {
            referenceSchema: "TypeA",
            properties: ["type_a_a", "type_a_b"],
          },
          {
            referenceSchema: "TypeB",
            properties: ["type_b_a", "type_b_b"],
          },
        ],
      },
    ];

    const result = generateDiscriminators(fixture.schemaTs);
    expect(result).toEqual(expected);
  });

  it("should generate discriminator spec without type literal", () => {
    const fixture = {
      schemaTs: `
export type TypeA = {
  type_a_a: string,
  type_a_b: number
}
export type TypeB = {
  type_b_a: string,
  type_b_b: number
}
export type WantToDiscriminate = TypeA | TypeB;
`,
    };

    const expected: SchemaDiscriminator[] = [
      {
        schema: "WantToDiscriminate",
        refDiscriminators: [
          {
            referenceSchema: "TypeA",
            properties: ["type_a_a", "type_a_b"],
          },
          {
            referenceSchema: "TypeB",
            properties: ["type_b_a", "type_b_b"],
          },
        ],
      },
    ];

    const result = generateDiscriminators(fixture.schemaTs);
    expect(result).toEqual(expected);
  });
});
