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
 * Total question mappings count across all tracks (including multi-track questions).
 */
export const TOTAL_PATTERN_MAPPINGS_COUNT = ALL_PATTERN_MAPPINGS.length; // 207

/**
 * Deduplicated unique LeetCode question IDs across the curriculum.
 */
export const UNIQUE_PATTERN_QUESTION_IDS: number[] = Array.from(
  new Set(ALL_PATTERN_MAPPINGS.map(m => m.questionId))
);

/**
 * Total unique question count.
 */
export const UNIQUE_PATTERN_QUESTIONS_COUNT = UNIQUE_PATTERN_QUESTION_IDS.length; // 203

/**
 * Returns questions that legitimately appear in more than one pattern track along with their pattern tracks.
 */
export function getCrossPatternQuestions(): {
  questionId: number;
  occurrences: number;
  patterns: string[];
}[] {
  const map = new Map<number, string[]>();
  for (const pattern of ALL_PATTERNS_CONTENT) {
    for (const mapping of pattern.mappings) {
      const list = map.get(mapping.questionId) || [];
      list.push(pattern.slug);
      map.set(mapping.questionId, list);
    }
  }

  const crossQuestions: {
    questionId: number;
    occurrences: number;
    patterns: string[];
  }[] = [];

  for (const [questionId, patterns] of map.entries()) {
    if (patterns.length > 1) {
      crossQuestions.push({
        questionId,
        occurrences: patterns.length,
        patterns,
      });
    }
  }

  return crossQuestions;
}

/**
 * Returns a list of mappings for a given pattern slug.
 */
export function getPatternMappings(slug: string): PatternQuestionMapping[] {
  const content = getPatternContent(slug);
  return content ? content.mappings : [];
}
