import type { PatternLearningContent } from '../../types/patterns';
export * from './patternMappings';

const FOUNDATION_SLUGS = new Set([
  'hashing-and-frequency-counting',
  'two-pointers',
  'sliding-window',
  'prefix-sum-and-difference-array',
  'fast-and-slow-pointers',
  'linked-list-in-place-reversal',
]);

const INTERMEDIATE_SLUGS = new Set([
  'binary-search',
  'tree-bfs',
  'tree-dfs',
  'graph-bfs-dfs',
  'topological-sort',
  'two-heaps-and-top-k',
]);

const ADVANCED_SLUGS = new Set([
  'monotonic-stack-and-queue',
  'dynamic-programming-1d',
  'dynamic-programming-2d-knapsack',
  'trie',
  'backtracking-and-permutations',
  'union-find-disjoint-set',
]);

const patternContentCache = new Map<string, PatternLearningContent>();

/**
 * Dynamic track loader: Code-splits patterns into foundation, intermediate, and advanced chunks.
 */
export async function loadPatternContent(slug: string): Promise<PatternLearningContent | undefined> {
  if (patternContentCache.has(slug)) {
    return patternContentCache.get(slug);
  }

  if (FOUNDATION_SLUGS.has(slug)) {
    const mod = await import('./foundationPatterns');
    for (const p of mod.FOUNDATION_PATTERNS) {
      patternContentCache.set(p.slug, p);
    }
  } else if (INTERMEDIATE_SLUGS.has(slug)) {
    const mod = await import('./intermediatePatterns');
    for (const p of mod.INTERMEDIATE_PATTERNS) {
      patternContentCache.set(p.slug, p);
    }
  } else if (ADVANCED_SLUGS.has(slug)) {
    const mod = await import('./advancedPatterns');
    for (const p of mod.ADVANCED_PATTERNS) {
      patternContentCache.set(p.slug, p);
    }
  }

  return patternContentCache.get(slug);
}

/**
 * Synchronous getter: Returns curriculum content if already loaded into cache.
 */
export function getPatternContent(slug: string): PatternLearningContent | undefined {
  return patternContentCache.get(slug);
}
