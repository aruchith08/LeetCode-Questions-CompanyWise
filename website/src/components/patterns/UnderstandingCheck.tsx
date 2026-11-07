import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw } from 'lucide-react';
import { SLIDING_WINDOW_QUIZ } from '../../data/patternsData';
import type { QuizQuestion } from '../../types/patterns';
import { useProgress } from '../../hooks/useProgress';

export interface UnderstandingCheckProps {
  quiz?: QuizQuestion[];
  patternTitle?: string;
  patternDescription?: string;
  patternSlug?: string;
}

export default function UnderstandingCheck({
  quiz = SLIDING_WINDOW_QUIZ,
  patternTitle = 'Understanding Check',
  patternDescription,
  patternSlug,
}: UnderstandingCheckProps = {}) {
  const { recordPatternQuiz, getPatternQuiz } = useProgress();
  const savedQuiz = patternSlug ? getPatternQuiz(patternSlug) : undefined;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleSelectOption = (questionId: string, optionId: string) => {
    // Only allow selection once per question unless reset
    if (selectedAnswers[questionId]) return;

    const newAnswers = {
      ...selectedAnswers,
      [questionId]: optionId,
    };
    setSelectedAnswers(newAnswers);

    // If all questions are answered, persist score and passed state
    if (quiz.length > 0 && Object.keys(newAnswers).length === quiz.length) {
      const currentCorrect = quiz.filter(q => newAnswers[q.id] === q.correctOptionId).length;
      const passed = (currentCorrect / quiz.length) >= (2 / 3);
      if (patternSlug) {
        recordPatternQuiz(patternSlug, currentCorrect, quiz.length, passed);
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = quiz.filter(
    q => selectedAnswers[q.id] === q.correctOptionId
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#43433F]">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
            8
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
              {patternTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
              {patternDescription || 'Test your conceptual intuition, time complexity, and edge cases.'}
            </p>
          </div>
        </div>

        {/* Quiz Score Badge, Saved Status & Reset */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {savedQuiz && (
            <div
              data-testid="saved-quiz-badge"
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${
                savedQuiz.passed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
              }`}
            >
              {savedQuiz.passed ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Passed ({savedQuiz.score}/{savedQuiz.total})</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Previous: {savedQuiz.score}/{savedQuiz.total} (Retake to pass)</span>
                </>
              )}
            </div>
          )}

          <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] text-xs font-semibold text-slate-700 dark:text-[#FAF9F5]">
            {answeredCount > 0 ? (
              <>
                Score: <span className="font-bold text-[#0F1B3D] dark:text-[#D97757]">{correctCount}</span> / {quiz.length}
              </>
            ) : savedQuiz ? (
              <>
                Score: <span className="font-bold text-[#0F1B3D] dark:text-[#D97757]">{savedQuiz.score}</span> / {savedQuiz.total}
              </>
            ) : (
              <>
                Score: <span className="font-bold text-[#0F1B3D] dark:text-[#D97757]">{correctCount}</span> / {quiz.length}
              </>
            )}
          </div>

          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>

      {/* Quiz Completion Banner */}
      {answeredCount === quiz.length && quiz.length > 0 && (
        <div
          data-testid="quiz-completion-banner"
          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            (correctCount / quiz.length) >= (2 / 3)
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {(correctCount / quiz.length) >= (2 / 3) ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <span>
              {(correctCount / quiz.length) >= (2 / 3)
                ? `Quiz passed! (${correctCount}/${quiz.length} correct) Pattern assessment requirement earned.`
                : `Attempt complete: ${correctCount}/${quiz.length} correct. Need at least 67% to pass for Pattern Mastery.`}
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#262624] border border-slate-200 dark:border-[#43433F] hover:bg-slate-50 dark:hover:bg-[#30302E] shrink-0 transition-colors cursor-pointer"
          >
            Retry Quiz
          </button>
        </div>
      )}

      {/* Quiz Questions List */}
      <div className="space-y-4">
        {quiz.map((q, qIdx) => {
          const selectedOption = selectedAnswers[q.id];
          const hasAnswered = Boolean(selectedOption);
          const isCorrect = selectedOption === q.correctOptionId;

          return (
            <div
              key={q.id}
              className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-[#43433F] bg-slate-50/50 dark:bg-[#1F1E1D]/50 space-y-3"
            >
              {/* Question Header */}
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0F1B3D]/10 dark:bg-[#D97757]/15 border border-[#0F1B3D]/20 dark:border-[#D97757]/30 text-[#0F1B3D] dark:text-[#D97757] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-[#FAF9F5] leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-1.5 pl-7 sm:pl-8">
                {q.options.map(opt => {
                  const isSelected = selectedOption === opt.id;
                  const isTheCorrectOne = opt.id === q.correctOptionId;

                  let optionStyles = 'border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] text-slate-700 dark:text-[#FAF9F5] hover:border-[#0F1B3D]/40 dark:hover:border-[#D97757]/50';

                  if (hasAnswered) {
                    if (isTheCorrectOne) {
                      optionStyles = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyles = 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    } else {
                      optionStyles = 'border-slate-200/50 dark:border-[#43433F]/50 bg-white/50 dark:bg-[#30302E]/50 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start justify-between gap-2.5 ${optionStyles}`}
                    >
                      <span className="leading-relaxed">{opt.text}</span>
                      {hasAnswered && isTheCorrectOne && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanatory Feedback */}
              {hasAnswered && (
                <div
                  className={`ml-7 sm:ml-8 p-3 rounded-lg text-xs leading-relaxed border ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300'
                      : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Correct!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>Not quite.</span>
                      </>
                    )}
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
