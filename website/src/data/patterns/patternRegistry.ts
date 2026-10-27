import type { PatternLearningContent, PatternQuestionMapping } from '../../types/patterns';
import { FOUNDATION_PATTERNS } from './foundationPatterns';
import { INTERMEDIATE_PATTERNS } from './intermediatePatterns';
import { ADVANCED_PATTERNS } from './advancedPatterns';

export const ALL_PATTERNS_CONTENT: PatternLearningContent[] = [
  ...FOUNDATION_PATTERNS,
  ...INTERMEDIATE_PATTERNS,
  ...ADVANCED_PATTERNS,
];

export const PATTERN_CONTENT_MAP: Record<string, PatternLearningContent> = ALL_PATTERNS_CONTENT.reduce(
  (acc, pattern) => {
    acc[pattern.slug] = pattern;
    return acc;
  },
  {} as Record<string, PatternLearningContent>
);

export function getPatternContent(slug: string): PatternLearningContent | undefined {
  return PATTERN_CONTENT_MAP[slug];
}

/**
 * All question mappings across all 18 patterns.
 */
export const ALL_PATTERN_MAPPINGS: PatternQuestionMapping[] = ALL_PATTERNS_CONTENT.flatMap(
  pattern => pattern.mappings
);

/**
 * Returns a list of mappings for a given pattern slug.
 */
export function getPatternMappings(slug: string): PatternQuestionMapping[] {
  const content = getPatternContent(slug);
  return content ? content.mappings : [];
}
