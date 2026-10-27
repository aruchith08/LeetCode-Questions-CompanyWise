import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { DSAPattern } from '../../types/patterns';
import PatternMiniVisual from './PatternMiniVisual';
import PatternIcon from './PatternIcon';

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
  const qCount = isAvailable ? (totalQuestions ?? pattern.questionCount ?? 0) : 0;
  const progressPercent = isAvailable && qCount > 0 ? Math.round((solvedCount / qCount) * 100) : 0;

  // Level badge styling
  const levelBadgeClass = (() => {
    switch (pattern.level) {
      case 'Foundation':
        return 'bg-blue-50 text-blue-600 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50';
    }
  })();

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-5 transition-all duration-300 ease-out bg-white dark:bg-[#30302E] hover:-translate-y-1.5 hover:shadow-xl ${
        isAvailable
          ? 'border-2 border-[#0F1B3D] dark:border-[#D97757] ring-1 ring-[#0F1B3D]/10 dark:ring-[#D97757]/20 shadow-sm hover:shadow-[#0F1B3D]/12 dark:hover:shadow-black/50 hover:border-[#1A2D5E] dark:hover:border-[#E08566]'
          : 'border border-slate-200/80 dark:border-[#43433F] hover:border-slate-300 dark:hover:border-[#52524E] shadow-xs hover:shadow-slate-200/60 dark:hover:shadow-black/30'
      }`}
    >
      <div>
        {/* Visual Mini Graphic */}
        <div className="mb-4">
          <PatternMiniVisual slug={pattern.slug} isAvailable={isAvailable} />
        </div>

        {/* Pattern Header */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
              <PatternIcon slug={pattern.slug} name={pattern.title} className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#FAF9F5] group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757] transition-colors truncate">
              {pattern.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C] line-clamp-2 leading-relaxed">
            {pattern.shortDescription}
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${levelBadgeClass}`}>
            {pattern.level}
          </span>

          {isAvailable ? (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50">
              Available
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200/80 dark:bg-[#1F1E1D] dark:text-[#8E8C82] dark:border-[#43433F]">
              Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Progress & CTA */}
      <div className="space-y-3 pt-2">
        {isAvailable ? (
          <>
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-slate-100 dark:bg-[#1E1E1C] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F1B3D] dark:bg-[#D97757] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-[#8E8C82]">
                {solvedCount}/{qCount} ({progressPercent}%)
              </span>
            </div>

            {/* Action Button */}
            <Link
              to={`/patterns/${pattern.slug}`}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] font-semibold text-xs transition-colors shadow-xs hover:shadow-sm"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        ) : (
          <>
            {/* Upcoming Track Indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#8E8C82] py-0.5">
              <span>Curated practice collection</span>
              <span className="font-mono text-[10px]">Phase 2</span>
            </div>

            <button
              type="button"
              disabled
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-[#1F1E1D] text-slate-400 dark:text-[#7A7870] font-semibold text-xs cursor-not-allowed select-none border border-slate-200/60 dark:border-[#43433F]/70"
            >
              Coming Soon
            </button>
          </>
        )}
      </div>
    </div>
  );
}
