import { describe, it, expect } from 'vitest';
import { PATTERN_TRIGGERS, getPatternTrigger } from '../src/data/patterns/patternTriggers';
import { PATTERNS_CATALOG } from '../src/data/patternsData';
import { SKILL_NODES } from '../src/components/patterns/PatternSkillTree';

describe('Pattern Triggers & Active Recall Insights', () => {
  it('should provide canonical triggers for flagship interview questions', () => {
    // Two Sum (#1)
    const twoSumTrigger = getPatternTrigger(1);
    expect(twoSumTrigger).toBeDefined();
    expect(twoSumTrigger?.trigger).toContain('O(1)');
    expect(twoSumTrigger?.keyInvariant).toContain('target - x');

    // Trapping Rain Water (#42)
    const rainWaterTrigger = getPatternTrigger(42);
    expect(rainWaterTrigger).toBeDefined();
    expect(rainWaterTrigger?.trigger).toContain('maxLeft');
    expect(rainWaterTrigger?.keyInvariant).toContain('maxLeft < maxRight');

    // Subarray Sum Equals K (#560)
    const subarraySumTrigger = getPatternTrigger(560);
    expect(subarraySumTrigger).toBeDefined();
    expect(subarraySumTrigger?.trigger).toContain('sliding window');
    expect(subarraySumTrigger?.whenItBreaks).toContain('negative');

    // Daily Temperatures (#739)
    const dailyTempsTrigger = getPatternTrigger(739);
    expect(dailyTempsTrigger).toBeDefined();
    expect(dailyTempsTrigger?.keyInvariant).toContain('strictly decreasing');

    // Coin Change (#322)
    const coinChangeTrigger = getPatternTrigger(322);
    expect(coinChangeTrigger).toBeDefined();
    expect(coinChangeTrigger?.whenItBreaks).toContain('Greedy');
  });

  it('should gracefully synthesize fallback trigger when given subpattern label', () => {
    const fallbackTrigger = getPatternTrigger(999999, 'Dynamic Window');
    expect(fallbackTrigger).toBeDefined();
    expect(fallbackTrigger?.trigger).toContain('Dynamic Window');
    expect(fallbackTrigger?.whyThisPattern).toContain('Dynamic Window');
  });

  it('should return undefined for unknown question ID with no subpattern label', () => {
    const unknown = getPatternTrigger(999999);
    expect(unknown).toBeUndefined();
  });
});

describe('Skill Tree Prerequisite Graph Integrity', () => {
  const catalogSlugs = new Set(PATTERNS_CATALOG.map(p => p.slug));
  const skillNodeMap = new Map(SKILL_NODES.map(n => [n.slug, n]));

  it('all skill nodes should correspond to recognized catalog patterns', () => {
    for (const node of SKILL_NODES) {
      expect(catalogSlugs.has(node.slug)).toBe(true);
    }
  });

  it('all upstream prerequisites should point to existing skill nodes', () => {
    for (const node of SKILL_NODES) {
      for (const prereq of node.prerequisites) {
        expect(skillNodeMap.has(prereq)).toBe(true);
        expect(prereq).not.toBe(node.slug); // No self-loops
      }
    }
  });

  it('all downstream unlocks should point to existing skill nodes', () => {
    for (const node of SKILL_NODES) {
      for (const unlock of node.unlocks) {
        expect(skillNodeMap.has(unlock)).toBe(true);
        expect(unlock).not.toBe(node.slug); // No self-loops
      }
    }
  });

  it('should have no circular dependency loops in prerequisites', () => {
    // Detect cycles using DFS cycle detection
    const visited = new Set<string>();
    const inStack = new Set<string>();

    function hasCycle(slug: string): boolean {
      visited.add(slug);
      inStack.add(slug);

      const node = skillNodeMap.get(slug);
      if (node) {
        for (const prereq of node.prerequisites) {
          if (!visited.has(prereq)) {
            if (hasCycle(prereq)) return true;
          } else if (inStack.has(prereq)) {
            return true; // Cycle detected
          }
        }
      }

      inStack.delete(slug);
      return false;
    }

    for (const node of SKILL_NODES) {
      if (!visited.has(node.slug)) {
        expect(hasCycle(node.slug)).toBe(false);
      }
    }
  });

  it('should have foundational entry points with zero prerequisites', () => {
    const entryPoints = SKILL_NODES.filter(n => n.prerequisites.length === 0);
    expect(entryPoints.length).toBeGreaterThanOrEqual(3);
    const entrySlugs = entryPoints.map(e => e.slug);
    expect(entrySlugs).toContain('hashing-and-frequency-counting');
    expect(entrySlugs).toContain('tree-dfs');
    expect(entrySlugs).toContain('bit-manipulation');
  });
});
