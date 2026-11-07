import type { PatternQuizScore } from '../types';

/**
 * Checks if a pattern quiz result meets the passing threshold (score >= 2/3).
 */
export function isPatternQuizPassed(quizScore?: PatternQuizScore | null): boolean {
  if (!quizScore) return false;
  if (quizScore.passed) return true;
  if (quizScore.total > 0 && quizScore.score / quizScore.total >= 2 / 3) {
    return true;
  }
  return false;
}

/**
 * Mastery Definition:
 * A pattern is considered "Mastered" when the user passes the pattern assessment quiz
 * (e.g. score >= 2/3) AND has solved at least 1 curated practice question for that pattern.
 */
export function isPatternMastered(
  quizScore: PatternQuizScore | undefined | null,
  solvedPracticeQuestionsCount: number
): boolean {
  return isPatternQuizPassed(quizScore) && solvedPracticeQuestionsCount >= 1;
}
