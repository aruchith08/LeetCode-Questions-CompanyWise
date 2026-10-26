import React from 'react';
import { Link } from 'react-router-dom';
import type { DSAPattern } from '../../types/patterns';
import PatternMiniVisual from './PatternMiniVisual';

interface PatternCardProps {
  pattern: DSAPattern;
  solvedCount?: number;
  totalQuestions?: number;
}

export default function PatternCard({
  pattern,
  solvedCount = 0,
  totalQuestions,
}: PatternCardProps) {
  const isAvailable = pattern.availability === 'available';
  const qCount = totalQuestions ?? pattern.questionCount;
  const progressPercent = qCount > 0 ? Math.round((solvedCount / qCount) * 100) : 0;

  // Level badge styling
  const levelBadgeClass = (() => {
    switch (pattern.level) {
      case 'Foundation':
        return 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50';
    }
  })();

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 bg-white dark:bg-[#262624] shadow-xs hover:shadow-md ${
        isAvailable
          ? 'border-blue-500/50 dark:border-blue-500/60 ring-1 ring-blue-500/20 hover:border-blue-600 dark:hover:border-blue-400'
          : 'border-slate-200/90 dark:border-[#43433F] hover:border-slate-300 dark:hover:border-[#52524E]'
      }`}
    >
      <div>
        {/* Visual Mini Graphic */}
        <div className="mb-4">
          <PatternMiniVisual slug={pattern.slug} isAvailable={isAvailable} />
        </div>

        {/* Pattern Header */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#FAF9F5] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {pattern.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C] line-clamp-2 leading-relaxed">
            {pattern.shortDescription}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${levelBadgeClass}`}>
            {pattern.level}
          </span>

          {isAvailable ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200/80 dark:bg-[#30302E] dark:text-[#8E8C82] dark:border-[#43433F]">
              Upcoming
            </span>
          )}

          {isAvailable && (
            <span className="text-[11px] font-mono text-slate-400 dark:text-[#8E8C82] ml-auto">
              {qCount} Questions
            </span>
          )}
        </div>
      </div>

      {/* Progress & CTA */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#383835] space-y-3">
        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-[#8E8C82]">
            <span>Progress</span>
            <span className="font-semibold text-slate-600 dark:text-[#FAF9F5]">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-[#1E1E1C] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isAvailable ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-[#43433F]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {isAvailable ? (
          <Link
            to={`/patterns/${pattern.slug}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-xs hover:shadow-sm"
          >
            <span>{solvedCount > 0 ? 'Continue Learning' : 'Start Learning'}</span>
            <span className="text-sm">→</span>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-[#30302E] text-slate-400 dark:text-[#7A7870] font-semibold text-xs cursor-not-allowed select-none border border-slate-200/60 dark:border-[#383835]"
          >
            Coming Soon
          </button>
        )}
      </div>
    </div>
  );
}
