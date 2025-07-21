import { PrimitiveType, ZodProperty } from "./types";

/**
 * Creates a Zod primitive type schema
 */
export function createZodPrimitive(type: PrimitiveType): string {
  return `z.${type}()`;
}

/**
 * Creates a Zod object schema from properties
 */
export function createZodObject(properties: ZodProperty[]): string {
  if (properties.length === 0) {
    return "z.object({})";
  }

  const propertyStrings = properties.map(({ name, zodType, isOptional }) => {
    const fieldType = isOptional ? `${zodType}.optional()` : zodType;
    return `    ${name}: ${fieldType}`;
  });

  return `z.object({\n${propertyStrings.join(",\n")}\n  })`;
}

/**
 * Creates a Zod tuple schema from element types
 */
export function createZodTuple(elements: string[]): string {
  if (elements.length === 0) {
    return "z.tuple([])";
  }

  const elementStrings = elements.map((zodType) => `    ${zodType}`);
  return `z.tuple([\n${elementStrings.join(",\n")}\n  ])`;
}

/**
 * Creates a Zod array schema from element type
 */
export function createZodArray(elementType: string): string {
  return `z.array(${elementType})`;
}

/**
 * Creates a Zod union schema from element types
 */
export function createZodUnion(elements: string[]): string {
  if (elements.length === 0) {
    throw new Error("Union type must have at least one element");
  }
  if (elements.length === 1) {
    return elements[0]!;
  }

  return `z.union([${elements.join(", ")}])`;
}

/**
 * Creates a Zod intersection schema from element types
 */
export function createZodIntersection(elements: string[]): string {
  if (elements.length === 0) {
    throw new Error("Intersection type must have at least one element");
  }
  if (elements.length === 1) {
    return elements[0]!;
  }

  // For multiple intersections, chain them
  let result = elements[0]!;
  for (let i = 1; i < elements.length; i++) {
    result = `${result}.and(${elements[i]!})`;
  }
  return result;
}

/**
 * Creates a Zod null schema
 */
export function createZodNull(): string {
  return "z.null()";
}

/**
 * Creates a Zod string literal schema
 */
export function createZodStringLiteral(value: string): string {
  return `z.literal(${value})`;
}

/**
 * Creates a Zod type reference schema
 */
export function createZodTypeReference(name: string, useLazy: boolean): string {
  if (!useLazy) {
    return name;
  }
  return `z.lazy(() => ${name})`;
}

/**
 * Creates a Zod date schema
 */
export function createZodDate(): string {
  return "z.date()";
}

/**
 * Creates a Zod record schema
 */
export function createZodRecord(keyType: string, valueType: string): string {
  return `z.record(${keyType}, ${valueType})`;
}
