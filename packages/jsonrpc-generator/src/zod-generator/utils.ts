export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Detects circular dependencies in a dependency graph using DFS
 */
export function detectCircularDependencies(
  dependencies: Map<string, Set<string>>
): string[][] {
  const circularDependencies: string[][] = [];
  const visited = new Set<string>();

  function performDFS(
    node: string,
    path: string[] = [],
    stack = new Set<string>()
  ): void {
    // If node is already in current path, we found a cycle
    if (stack.has(node)) {
      const cycleStartIndex = path.indexOf(node);
      const cycle = [...path.slice(cycleStartIndex), node];
      circularDependencies.push(cycle);
      return;
    }

    // If we've already visited this node and found all cycles, skip it
    if (visited.has(node)) return;

    // Add node to current path
    stack.add(node);
    path.push(node);

    // Visit all dependencies of this node
    const deps = dependencies.get(node) || new Set<string>();
    for (const dep of deps) {
      performDFS(dep, [...path], new Set(stack));
    }

    // Remove node from path when done exploring
    stack.delete(node);

    // Mark node as fully visited after exploring all paths
    visited.add(node);
  }

  // Start DFS from each node to find all cycles
  for (const node of dependencies.keys()) {
    performDFS(node);
  }

  return circularDependencies;
}

/**
 * Groups circular dependencies that share common elements
 */
function groupCircularDependencies(
  circularDependencies: string[][]
): string[][][] {
  const groups: string[][][] = [];

  for (const circle of circularDependencies) {
    const circleSet = new Set(circle);
    let foundGroup = false;

    // Check if this circle shares elements with any existing group
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i]!;
      const groupElements = new Set<string>();

      // Collect all unique elements from all circles in the group
      for (const groupCircle of group) {
        for (const element of groupCircle) {
          groupElements.add(element);
        }
      }

      // Check for intersection between the current circle and the group
      const hasIntersection = [...circleSet].some((element) =>
        groupElements.has(element)
      );

      if (hasIntersection) {
        groups[i]!.push(circle);
        foundGroup = true;
        break;
      }
    }

    // If no matching group was found, create a new group
    if (!foundGroup) {
      groups.push([circle]);
    }
  }

  return groups;
}

/**
 * Finds the most common element in each group of circular dependencies
 */
function findMostCommonInGroup(group: string[][]): string {
  const counts = new Map<string, number>();

  // Count occurrences of each element
  for (const circle of group) {
    for (const element of circle) {
      counts.set(element, (counts.get(element) || 0) + 1);
    }
  }

  // Find the most common element
  let maxCount = 0;
  let mostCommon = "";

  for (const [element, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = element;
    }
  }

  return mostCommon;
}

/**
 * Finds the most common string in each group of circular dependencies
 */
export function findMostCommonStringInCircles(
  circularDependencies: string[][]
): string[] {
  if (circularDependencies.length === 0) {
    return [];
  }

  const groups = groupCircularDependencies(circularDependencies);
  return groups.map(findMostCommonInGroup);
}

/**
 * Creates a type-safe error with context information
 */
export function createError(
  message: string,
  context?: Record<string, unknown>
): Error {
  const error = new Error(message);
  if (context) {
    (error as any).context = context;
  }
  return error;
}
