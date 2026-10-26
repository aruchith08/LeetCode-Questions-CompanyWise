import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw } from 'lucide-react';
import { SLIDING_WINDOW_QUIZ } from '../../data/patternsData';

export default function UnderstandingCheck() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const handleSelectOption = (questionId: string, optionId: string) => {
    // Only allow selection once per question unless reset
    if (selectedAnswers[questionId]) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = SLIDING_WINDOW_QUIZ.filter(
    q => selectedAnswers[q.id] === q.correctOptionId
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-[#383835]">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
            Understanding Check
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-1">
            Test your intuition on Sliding Window mechanics, time complexity, and edge cases.
          </p>
        </div>

        {/* Quiz Score Badge & Reset */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#43433F] text-xs font-semibold text-slate-700 dark:text-[#FAF9F5]">
            Score: <span className="font-bold text-blue-600 dark:text-blue-400">{correctCount}</span> / {SLIDING_WINDOW_QUIZ.length}
          </div>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#30302E] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {SLIDING_WINDOW_QUIZ.map((q, qIdx) => {
          const selectedOption = selectedAnswers[q.id];
          const hasAnswered = Boolean(selectedOption);
          const isCorrect = selectedOption === q.correctOptionId;

          return (
            <div
              key={q.id}
              className="p-5 rounded-xl border border-slate-200/80 dark:border-[#383835] bg-slate-50/40 dark:bg-[#1E1E1C]/40 space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <p className="text-sm font-semibold text-slate-900 dark:text-[#FAF9F5] leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-9">
                {q.options.map(opt => {
                  const isSelected = selectedOption === opt.id;
                  const isTheCorrectOne = opt.id === q.correctOptionId;

                  let optionStyles = 'border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] text-slate-700 dark:text-[#FAF9F5] hover:border-blue-300 dark:hover:border-blue-700';

                  if (hasAnswered) {
                    if (isTheCorrectOne) {
                      optionStyles = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyles = 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    } else {
                      optionStyles = 'border-slate-200/50 dark:border-[#383835] bg-white/50 dark:bg-[#262624]/50 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${optionStyles}`}
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
                  className={`ml-9 p-3.5 rounded-xl text-xs leading-relaxed border ${
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
