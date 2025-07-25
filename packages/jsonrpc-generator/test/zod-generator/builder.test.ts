import {
  createZodPrimitive,
  createZodObject,
  createZodTuple,
  createZodArray,
  createZodUnion,
  createZodIntersection,
  createZodNull,
  createZodStringLiteral,
  createZodTypeReference,
  createZodDate,
  createZodRecord,
} from "../../src/zod-generator/builders";
import { PrimitiveType, ZodProperty } from "../../src/zod-generator/types";

describe("Zod Builder Functions", () => {
  describe("createZodPrimitive", () => {
    it("should create string primitive", () => {
      expect(createZodPrimitive(PrimitiveType.String)).toBe("z.string()");
    });

    it("should create number primitive", () => {
      expect(createZodPrimitive(PrimitiveType.Number)).toBe("z.number()");
    });

    it("should create boolean primitive", () => {
      expect(createZodPrimitive(PrimitiveType.Boolean)).toBe("z.boolean()");
    });

    it("should create unknown primitive", () => {
      expect(createZodPrimitive(PrimitiveType.Unknown)).toBe("z.unknown()");
    });

    it("should create never primitive", () => {
      expect(createZodPrimitive(PrimitiveType.Never)).toBe("z.never()");
    });

    it("should create any primitive", () => {
      expect(createZodPrimitive(PrimitiveType.Any)).toBe("z.any()");
    });
  });

  describe("createZodObject", () => {
    it("should create empty object", () => {
      expect(createZodObject([])).toBe("z.object({})");
    });

    it("should create object with single required property", () => {
      const properties: ZodProperty[] = [
        { name: "id", zodType: "z.string()", isOptional: false },
      ];
      const expected = `z.object({
    id: z.string()
  })`;
      expect(createZodObject(properties)).toBe(expected);
    });

    it("should create object with single optional property", () => {
      const properties: ZodProperty[] = [
        { name: "name", zodType: "z.string()", isOptional: true },
      ];
      const expected = `z.object({
    name: z.string().optional()
  })`;
      expect(createZodObject(properties)).toBe(expected);
    });

    it("should create object with multiple mixed properties", () => {
      const properties: ZodProperty[] = [
        { name: "id", zodType: "z.string()", isOptional: false },
        { name: "age", zodType: "z.number()", isOptional: true },
        { name: "active", zodType: "z.boolean()", isOptional: false },
      ];
      const expected = `z.object({
    id: z.string(),
    age: z.number().optional(),
    active: z.boolean()
  })`;
      expect(createZodObject(properties)).toBe(expected);
    });
  });

  describe("createZodTuple", () => {
    it("should create empty tuple", () => {
      expect(createZodTuple([])).toBe("z.tuple([])");
    });

    it("should create tuple with single element", () => {
      const expected = `z.tuple([
    z.string()
  ])`;
      expect(createZodTuple(["z.string()"])).toBe(expected);
    });

    it("should create tuple with multiple elements", () => {
      const elements = ["z.string()", "z.number()", "z.boolean()"];
      const expected = `z.tuple([
    z.string(),
    z.number(),
    z.boolean()
  ])`;
      expect(createZodTuple(elements)).toBe(expected);
    });
  });

  describe("createZodArray", () => {
    it("should create array of strings", () => {
      expect(createZodArray("z.string()")).toBe("z.array(z.string())");
    });

    it("should create array of numbers", () => {
      expect(createZodArray("z.number()")).toBe("z.array(z.number())");
    });

    it("should create array of complex types", () => {
      expect(createZodArray("UserSchema")).toBe("z.array(UserSchema)");
    });
  });

  describe("createZodUnion", () => {
    it("should throw error for empty union", () => {
      expect(() => createZodUnion([])).toThrow(
        "Union type must have at least one element"
      );
    });

    it("should return single element for union with one element", () => {
      expect(createZodUnion(["z.string()"])).toBe("z.string()");
    });

    it("should create union with two elements", () => {
      const elements = ["z.string()", "z.number()"];
      expect(createZodUnion(elements)).toBe(
        "z.union([z.string(), z.number()])"
      );
    });

    it("should create union with multiple elements", () => {
      const elements = ["z.string()", "z.number()", "z.boolean()"];
      expect(createZodUnion(elements)).toBe(
        "z.union([z.string(), z.number(), z.boolean()])"
      );
    });
  });

  describe("createZodIntersection", () => {
    it("should throw error for empty intersection", () => {
      expect(() => createZodIntersection([])).toThrow(
        "Intersection type must have at least one element"
      );
    });

    it("should return single element for intersection with one element", () => {
      expect(createZodIntersection(["z.string()"])).toBe("z.string()");
    });

    it("should create intersection with two elements", () => {
      const elements = ["BaseSchema", "ExtensionSchema"];
      expect(createZodIntersection(elements)).toBe(
        "BaseSchema.and(ExtensionSchema)"
      );
    });

    it("should create chained intersection with multiple elements", () => {
      const elements = ["SchemaA", "SchemaB", "SchemaC"];
      expect(createZodIntersection(elements)).toBe(
        "SchemaA.and(SchemaB).and(SchemaC)"
      );
    });
  });

  describe("createZodNull", () => {
    it("should create null schema", () => {
      expect(createZodNull()).toBe("z.null()");
    });
  });

  describe("createZodStringLiteral", () => {
    it("should create string literal with double quotes", () => {
      expect(createZodStringLiteral('"hello"')).toBe('z.literal("hello")');
    });

    it("should create string literal with single quotes", () => {
      expect(createZodStringLiteral("'world'")).toBe("z.literal('world')");
    });

    it("should create string literal with special characters", () => {
      expect(createZodStringLiteral('"test-value_123"')).toBe(
        'z.literal("test-value_123")'
      );
    });
  });

  describe("createZodTypeReference", () => {
    it("should create direct type reference when not lazy", () => {
      expect(createZodTypeReference("UserSchema", false)).toBe("UserSchema");
    });

    it("should create lazy type reference when lazy is true", () => {
      expect(createZodTypeReference("UserSchema", true)).toBe(
        "z.lazy(() => UserSchema)"
      );
    });

    it("should handle complex type names", () => {
      expect(createZodTypeReference("ComplexNestedSchema", true)).toBe(
        "z.lazy(() => ComplexNestedSchema)"
      );
    });
  });

  describe("createZodDate", () => {
    it("should create date schema", () => {
      expect(createZodDate()).toBe("z.date()");
    });
  });

  describe("createZodRecord", () => {
    it("should create record with string key and string value", () => {
      expect(createZodRecord("z.string()", "z.string()")).toBe(
        "z.record(z.string(), z.string())"
      );
    });

    it("should create record with string key and number value", () => {
      expect(createZodRecord("z.string()", "z.number()")).toBe(
        "z.record(z.string(), z.number())"
      );
    });

    it("should create record with complex types", () => {
      expect(createZodRecord("KeySchema", "ValueSchema")).toBe(
        "z.record(KeySchema, ValueSchema)"
      );
    });
  });
});
