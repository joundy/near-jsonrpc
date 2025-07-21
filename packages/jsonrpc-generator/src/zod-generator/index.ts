import { Project } from "ts-morph";
import { resolveDependencies } from "./dep-resolvers";
import {
  detectCircularDependencies,
  findMostCommonStringInCircles,
} from "./utils";
import { createGeneratorContext, generateSchemas } from "./generator";

// generate zod schemas from the cooked schemas
export function generateZodSchemas(schemasTs: string, suffix: string) {
  const project = new Project();
  const source = project.createSourceFile("__temp__zod_schemas.ts", schemasTs);

  const schemas = source.getTypeAliases();
  const dependencyMap = resolveDependencies(schemas);

  const circularDependencies = detectCircularDependencies(dependencyMap);
  const cyclicTypeNames = findMostCommonStringInCircles(circularDependencies);
  const cyclicTypes = new Set(cyclicTypeNames);
  const context = createGeneratorContext(schemas, cyclicTypes, suffix);

  const result = generateSchemas(schemas, context);

  project.removeSourceFile(source);

  return {
    zodSchemas: result,
    dependencies: Array.from(cyclicTypes),
  };
}
