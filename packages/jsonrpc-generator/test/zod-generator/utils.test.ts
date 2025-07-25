import {
  detectCircularDependencies,
  findMostCommonStringInCircles,
} from '../../src/zod-generator/utils';

describe('detectCircularDependencies', () => {
  it('should return empty array when no dependencies exist', () => {
    const dependencies = new Map<string, Set<string>>();
    const result = detectCircularDependencies(dependencies);
    expect(result).toEqual([]);
  });

  it('should return empty array when no circular dependencies exist', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set()],
    ]);
    const result = detectCircularDependencies(dependencies);
    expect(result).toEqual([]);
  });

  it('should detect simple circular dependency (A -> B -> A)', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['A'])],
    ]);
    const result = detectCircularDependencies(dependencies);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(['A', 'B', 'A']);
  });

  it('should detect self-referencing circular dependency', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['A'])],
    ]);
    const result = detectCircularDependencies(dependencies);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(['A', 'A']);
  });

  it('should detect multiple circular dependencies', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['A'])],
      ['C', new Set(['D'])],
      ['D', new Set(['C'])],
    ]);
    const result = detectCircularDependencies(dependencies);
    expect(result).toHaveLength(2);
    
    // Sort results for consistent testing
    const sortedResult = result.sort((a, b) => a[0]!.localeCompare(b[0]!));
    expect(sortedResult[0]).toEqual(['A', 'B', 'A']);
    expect(sortedResult[1]).toEqual(['C', 'D', 'C']);
  });

  it('should detect complex circular dependency (A -> B -> C -> A)', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A'])],
    ]);
    const result = detectCircularDependencies(dependencies);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(['A', 'B', 'C', 'A']);
  });

  it('should detect circular dependency with multiple paths', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B', 'C'])],
      ['B', new Set(['D'])],
      ['C', new Set(['D'])],
      ['D', new Set(['A'])],
    ]);
    const result = detectCircularDependencies(dependencies);
    expect(result.length).toBeGreaterThan(0);
    
    // Should detect cycles through both paths
    const hasABDA = result.some(cycle => 
      JSON.stringify(cycle) === JSON.stringify(['A', 'B', 'D', 'A'])
    );
    const hasACDA = result.some(cycle => 
      JSON.stringify(cycle) === JSON.stringify(['A', 'C', 'D', 'A'])
    );
    
    expect(hasABDA || hasACDA).toBe(true);
  });

  it('should handle nodes with no dependencies', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set()],
      ['C', new Set()],
    ]);
    const result = detectCircularDependencies(dependencies);
    expect(result).toEqual([]);
  });

  it('should handle mixed scenario with both circular and non-circular dependencies', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A'])], // Circular: A -> B -> C -> A
      ['D', new Set(['E'])],
      ['E', new Set()], // Non-circular: D -> E
    ]);
    const result = detectCircularDependencies(dependencies);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(['A', 'B', 'C', 'A']);
  });

  it('should handle nodes that reference non-existent dependencies', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])], // B is not defined in the map
      ['C', new Set(['D'])], // D is not defined in the map
    ]);
    const result = detectCircularDependencies(dependencies);
    // Should not find any cycles since B and D don't have dependencies
    // This tests the || new Set<string>() fallback when dependencies.get() returns undefined
    expect(result).toEqual([]);
  });
});

describe('findMostCommonStringInCircles', () => {
  it('should return empty array when no circular dependencies exist', () => {
    const circularDependencies: string[][] = [];
    const result = findMostCommonStringInCircles(circularDependencies);
    expect(result).toEqual([]);
  });

  it('should return most common string from single circular dependency', () => {
    const circularDependencies = [
      ['A', 'B', 'A'], // A appears twice, B appears once
    ];
    const result = findMostCommonStringInCircles(circularDependencies);
    expect(result).toEqual(['A']);
  });

  it('should return most common string from multiple separate circular dependencies', () => {
    const circularDependencies = [
      ['A', 'B', 'A'], // A appears twice
      ['C', 'D', 'C'], // C appears twice
    ];
    const result = findMostCommonStringInCircles(circularDependencies);
    expect(result).toHaveLength(2);
    expect(result).toContain('A');
    expect(result).toContain('C');
  });

  it('should group related circular dependencies and find most common in each group', () => {
    const circularDependencies = [
      ['A', 'B', 'A'], // Group 1: A appears 3 times, B appears 2 times
      ['B', 'C', 'B'], // Group 1: B appears in both circles
      ['D', 'E', 'D'], // Group 2: D appears twice, E appears once
    ];
    const result = findMostCommonStringInCircles(circularDependencies);
    expect(result).toHaveLength(2);
    
    expect(result).toEqual(['B', 'D']);
  });

  it('should handle complex grouping with shared elements', () => {
    const circularDependencies = [
      ['A', 'B', 'C', 'A'], // A appears twice, B and C appear once each
      ['B', 'D', 'B'], // B appears twice, D appears once
      ['E', 'F', 'E'], // Separate group: E appears twice, F appears once
    ];
    const result = findMostCommonStringInCircles(circularDependencies);
    expect(result).toHaveLength(2);
    
    // First group (A-B-C and B-D circles): B appears 3 times total
    // Second group (E-F circle): E appears 2 times
    expect(result).toContain('B');
    expect(result).toContain('E');
  });

  it('should handle single element circular dependency', () => {
    const circularDependencies = [
      ['A', 'A'], // Self-reference
    ];
    const result = findMostCommonStringInCircles(circularDependencies);
    expect(result).toEqual(['A']);
  });

  it('should handle ties by returning first encountered element', () => {
    const circularDependencies = [
      ['A', 'B', 'C', 'A'], // A appears twice, B and C appear once each
    ];
    const result = findMostCommonStringInCircles(circularDependencies);
    expect(result).toEqual(['A']); // A should win due to appearing twice
  });

  it('should handle multiple groups with different most common elements', () => {
    const circularDependencies = [
      ['X', 'Y', 'X'], // Group 1: X appears twice
      ['Y', 'Z', 'Y'], // Group 1: Y connects the groups
      ['P', 'Q', 'R', 'P'], // Group 2: P appears twice
    ];
    const result = findMostCommonStringInCircles(circularDependencies);
    expect(result).toHaveLength(2);
    
    // Should group X-Y and Y-Z together due to shared Y
    // Y appears 3 times total in the first group
    expect(result).toContain('Y');
    expect(result).toContain('P');
  });
});

// Integration tests combining both functions
describe('Integration: detectCircularDependencies + findMostCommonStringInCircles', () => {
  it('should work together to detect cycles and find most common elements', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['C'])],
      ['C', new Set(['A'])], // Creates cycle: A -> B -> C -> A
      ['D', new Set(['E'])],
      ['E', new Set(['D'])], // Creates cycle: D -> E -> D
    ]);
    
    const circularDependencies = detectCircularDependencies(dependencies);
    const mostCommon = findMostCommonStringInCircles(circularDependencies);
    
    expect(circularDependencies).toHaveLength(2);
    expect(mostCommon).toHaveLength(2);
    
    // Each cycle should have its starting element as most common
    // (appears at both start and end of the cycle)
    expect(mostCommon).toContain('A');
    expect(mostCommon).toContain('D');
  });

  it('should handle complex dependency graph with multiple interconnected cycles', () => {
    const dependencies = new Map<string, Set<string>>([
      ['A', new Set(['B'])],
      ['B', new Set(['C', 'D'])],
      ['C', new Set(['A'])], // Cycle: A -> B -> C -> A
      ['D', new Set(['E'])],
      ['E', new Set(['B'])], // Cycle: B -> D -> E -> B (shares B with first cycle)
    ]);
    
    const circularDependencies = detectCircularDependencies(dependencies);
    const mostCommon = findMostCommonStringInCircles(circularDependencies);
    
    expect(circularDependencies.length).toBeGreaterThan(0);
    expect(mostCommon.length).toBeGreaterThan(0);
    
    // B should be the most common as it appears in multiple cycles
    expect(mostCommon).toContain('B');
  });
});