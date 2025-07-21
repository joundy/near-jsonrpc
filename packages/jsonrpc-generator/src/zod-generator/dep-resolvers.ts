import { TypeAliasDeclaration, SyntaxKind } from "ts-morph";
import { DependencyMap } from "./types";

/**
 * Resolves dependencies between type aliases by analyzing their references
 */
export function resolveDependencies(
  typeAliases: TypeAliasDeclaration[]
): DependencyMap {
  const dependencies = new Map<string, Set<string>>();

  for (const typeAlias of typeAliases) {
    const name = typeAlias.getName();
    const references = findTypeAliasReferences(typeAlias);

    if (references.length === 0) {
      continue;
    }

    const dependencyNames = extractDependencyNames(references, name);

    if (dependencyNames.length > 0) {
      dependencies.set(name, new Set(dependencyNames));
    }
  }

  return dependencies;
}

/**
 * Finds all references to a type alias
 */
function findTypeAliasReferences(typeAlias: TypeAliasDeclaration) {
  const references = typeAlias.findReferences();

  if (references.length === 0) {
    return [];
  }

  return references[0]?.getReferences() || [];
}

/**
 * Extracts dependency names from references, excluding self-references
 */
function extractDependencyNames(
  references: any[],
  currentTypeName: string
): string[] {
  const dependencyNames: string[] = [];
  let selfRefCount = 0;

  for (const reference of references) {
    const node = reference.getNode();
    const referenceAlias = node.getFirstAncestorByKind(
      SyntaxKind.TypeAliasDeclaration
    );

    if (!referenceAlias) {
      continue;
    }

    const referenceName = referenceAlias.getName();

    // Count self-references
    if (referenceName === currentTypeName) {
      selfRefCount++;
    }

    // Add dependency if it's not a self-reference, or if it's a recursive self-reference
    if (referenceName !== currentTypeName || selfRefCount > 1) {
      dependencyNames.push(referenceName);
    }
  }

  return dependencyNames;
}
