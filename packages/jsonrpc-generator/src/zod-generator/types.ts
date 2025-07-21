export enum PrimitiveType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Unknown = "unknown",
  Never = "never",
  Any = "any",
}

export enum IdentifierType {
  Record = "Record",
  Date = "Date",
}

export interface ZodProperty {
  name: string;
  zodType: string;
  isOptional: boolean;
}

export interface GeneratorContext {
  schemaSet: Set<string>;
  dependencies: Set<string>;
  cyclicTypes: Set<string>;
  suffix: string;
}

export interface DependencyMap extends Map<string, Set<string>> {}

export interface GeneratorConfig {
  schemaFileName: string;
  outputPath: string;
  typeCheckPath: string;
}

export interface GenerationResult {
  generatorResult: string;
  typeCheckResult: string;
  schemasList: string[];
}
