import type { PatternLearningContent } from '../../types/patterns';
export * from './patternMappings';
import { FOUNDATION_PATTERNS } from './foundationPatterns';
import { INTERMEDIATE_PATTERNS } from './intermediatePatterns';
import { ADVANCED_PATTERNS } from './advancedPatterns';

export const ALL_PATTERNS_CONTENT: PatternLearningContent[] = [
  ...FOUNDATION_PATTERNS,
  ...INTERMEDIATE_PATTERNS,
  ...ADVANCED_PATTERNS,
];

const patternContentCache = new Map<string, PatternLearningContent>();
for (const p of ALL_PATTERNS_CONTENT) {
  patternContentCache.set(p.slug, p);
}

export const PATTERN_CONTENT_MAP: Record<string, PatternLearningContent> = ALL_PATTERNS_CONTENT.reduce(
  (acc, pattern) => {
    acc[pattern.slug] = pattern;
    return acc;
  },
  {} as Record<string, PatternLearningContent>
);

export function getPatternContent(slug: string): PatternLearningContent | undefined {
  return patternContentCache.get(slug);
}

export async function loadPatternContent(slug: string): Promise<PatternLearningContent | undefined> {
  return patternContentCache.get(slug);
}
