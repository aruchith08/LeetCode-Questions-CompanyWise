import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, CheckCircle2, Filter, Loader2, RotateCcw, Lightbulb, ChevronDown, ChevronUp, X } from 'lucide-react';
import type {
  PatternQuestion,
  PatternQuestionMapping,
  SlidingWindowSubcategory,
} from '../../types/patterns';
import { SLIDING_WINDOW_MAPPINGS, joinPatternQuestions } from '../../data/patternsData';
import { getPatternTrigger } from '../../data/patterns/patternTriggers';
import { useAllQuestions } from '../../hooks/useAllQuestions';
import { useDataIndex } from '../../hooks/useDataIndex';
import { useProgress } from '../../hooks/useProgress';
import DifficultyBadge from '../ui/DifficultyBadge';
import StatusToggle from '../ui/StatusToggle';
import BookmarkButton from '../ui/BookmarkButton';
import CompanyLogo from '../ui/CompanyLogo';

type FilterTab = 'all' | SlidingWindowSubcategory | string;

export interface PracticeQuestionsSectionProps {
  mappings?: PatternQuestionMapping[];
  subpatternTabs?: { id: string; label: string }[];
  patternTitle?: string;
  patternDescription?: string;
}

export default function PracticeQuestionsSection({
  mappings = SLIDING_WINDOW_MAPPINGS,
  subpatternTabs,
  patternTitle = 'Curated Practice Problems',
  patternDescription,
}: PracticeQuestionsSectionProps = {}) {
  const { getStatus, toggleSolved, toggleBookmark, isBookmarked } = useProgress();
  const { data: allQuestions, loading: loadingQuestions, error: catalogError, refetch } = useAllQuestions();
  const { data: indexData } = useDataIndex();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTriggerId, setExpandedTriggerId] = useState<number | null>(null);

  // Map company slugs to proper display names
  const companyNameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (indexData?.companies) {
      for (const c of indexData.companies) {
        map.set(c.slug.toLowerCase(), c.name);
      }
    }
    return map;
  }, [indexData]);

  // Join pattern mappings with canonical global question catalog
  const questions = useMemo(() => {
    return joinPatternQuestions(mappings, allQuestions);
  }, [mappings, allQuestions]);

  // Filter questions based on active tab and search query
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesTab = activeTab === 'all' || q.subpattern === activeTab;
      const qLower = searchQuery.toLowerCase().trim();
      const matchesQuery =
        qLower === '' ||
        q.title.toLowerCase().includes(qLower) ||
        q.id.toString().includes(qLower) ||
        q.companies.some(c => {
          const cSlug = c.toLowerCase();
          const cName = (companyNameMap.get(cSlug) || '').toLowerCase();
          return cSlug.includes(qLower) || cName.includes(qLower);
        });
      return matchesTab && matchesQuery;
    });
  }, [questions, activeTab, searchQuery, companyNameMap]);

  // Solved statistics for this pattern
  const solvedCount = useMemo(() => {
    return questions.filter(q => getStatus(q.id) === 'solved').length;
  }, [questions, getStatus]);

  const solvedPercentage = questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0;

  const tabs: { id: FilterTab; label: string; count: number }[] = useMemo(() => {
    if (subpatternTabs && subpatternTabs.length > 0) {
      return [
        { id: 'all', label: 'All Problems', count: questions.length },
        ...subpatternTabs.map(t => ({
          id: t.id,
          label: t.label,
          count: questions.filter(q => q.subpattern === t.id).length,
        })),
      ];
    }
    const uniqueSubpatterns = Array.from(new Set(mappings.map(m => m.subpattern)));
    return [
      { id: 'all', label: 'All Problems', count: questions.length },
      ...uniqueSubpatterns.map(sp => {
        const sample = mappings.find(m => m.subpattern === sp);
        return {
          id: sp,
          label: sample?.subpatternLabel || sp,
          count: questions.filter(q => q.subpattern === sp).length,
        };
      }),
    ];
  }, [subpatternTabs, mappings, questions]);

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#43433F]/70">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
            7
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
              {patternTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
              {patternDescription || `${questions.length} hand-selected problems from real company interview loops, organized by sub-technique.`}
            </p>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#1F1E1D] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#43433F]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-[#FAF9F5]">
              {solvedCount} / {questions.length} Solved
            </span>
          </div>
          <div className="w-20 sm:w-24 h-1.5 bg-slate-200 dark:bg-[#43433F] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${solvedPercentage}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-[#A8A69C]">
            {solvedPercentage}%
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Subcategory Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0F1B3D] dark:bg-[#D97757] text-white dark:text-[#1F1E1D] shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1F1E1D] dark:text-[#A8A69C] dark:hover:bg-[#262624] dark:hover:text-[#FAF9F5] border border-transparent dark:border-[#43433F]/50 font-medium'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 text-[11px] opacity-80 font-mono">
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search problems or companies..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F1B3D] dark:focus:ring-[#D97757]"
          />
        </div>
      </div>

      {/* Questions Table (Identical to ProblemsPage) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] shadow-2xs">
        {loadingQuestions && !allQuestions ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#0F1B3D] dark:text-[#D97757] mx-auto" />
            <p className="text-xs text-slate-500 dark:text-[#A8A69C]">
              Loading practice problems from question catalog...
            </p>
          </div>
        ) : catalogError && !allQuestions ? (
          <div className="py-12 px-4 text-center space-y-3">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Failed to load question catalog: {catalogError}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/80 dark:bg-[#262624]/80 border-b border-slate-200 dark:border-[#43433F] text-slate-400 dark:text-[#A8A69C] font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-3 w-12 text-center">STATUS</th>
                <th className="py-3 px-3 w-16">ID</th>
                <th className="py-3 px-4 min-w-[200px]">PROBLEM</th>
                <th className="py-3 px-3 w-28">DIFFICULTY</th>
                <th className="py-3 px-3.5 hidden md:table-cell">SUBCATEGORY</th>
                <th className="py-3 px-4 hidden sm:table-cell">COMPANIES</th>
                <th className="py-3 px-4 text-right hidden lg:table-cell w-28">ACCEPTANCE</th>
                <th className="py-3 px-4 text-right w-28">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#43433F]/60">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-[#8E8C82]">
                    No practice problems found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map(q => {
                  const status = getStatus(q.id);
                  const bookmarked = isBookmarked(q.id);
                  const trigger = getPatternTrigger(q.id, q.subpatternLabel);
                  const isExpanded = expandedTriggerId === q.id;

                  return (
                    <React.Fragment key={q.id}>
                      <tr
                        className={`hover:bg-slate-50/80 dark:hover:bg-[#1F1E1D]/60 transition-colors group ${
                          status === 'solved' ? 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]' : ''
                        } ${isExpanded ? 'bg-amber-50/30 dark:bg-amber-950/20' : ''}`}
                      >
                        {/* Status Toggle */}
                        <td className="py-3 px-3 text-center">
                          <StatusToggle
                            status={status}
                            onToggleSolved={() => toggleSolved(q.id)}
                          />
                        </td>

                        {/* Problem ID */}
                        <td className="py-3 px-3 font-mono text-slate-400 text-xs">
                          #{q.id}
                        </td>

                        {/* Problem Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <a
                              href={q.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-slate-900 dark:text-[#FAF9F5] group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757] transition-colors inline-block"
                            >
                              <span className={status === 'solved' ? 'line-through text-slate-400 dark:text-[#8E8C82]' : ''}>
                                {q.title}
                              </span>
                            </a>
                            {trigger && (
                              <button
                                type="button"
                                onClick={() => setExpandedTriggerId(isExpanded ? null : q.id)}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-semibold transition-all cursor-pointer ${
                                  isExpanded
                                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-2xs'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/40'
                                }`}
                                title="Click to view the 💡 Ah-Ha Pattern Trigger & intuition"
                                aria-label={`View trigger intuition for ${q.title}`}
                              >
                                <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span>Trigger</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-2.5 h-2.5 opacity-70" />
                                ) : (
                                  <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Difficulty Badge */}
                        <td className="py-3 px-3">
                          {q.difficulty ? (
                            <DifficultyBadge difficulty={q.difficulty} size="sm" />
                          ) : (
                            <span className="text-slate-400 dark:text-[#8E8C82] text-xs font-mono">—</span>
                          )}
                        </td>

                        {/* Subcategory */}
                        <td className="py-3 px-3.5 hidden md:table-cell">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-[#1F1E1D] dark:text-[#A8A69C] border border-slate-200/80 dark:border-[#43433F]">
                            {q.subpatternLabel}
                          </span>
                        </td>

                        {/* Top Companies Asking */}
                        <td className="py-3 px-4 hidden sm:table-cell">
                          {q.companies && q.companies.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center -space-x-1.5 overflow-hidden">
                                {q.companies.slice(0, 3).map(slug => (
                                  <CompanyLogo
                                    key={slug}
                                    slug={slug}
                                    size="xs"
                                    className="border border-white dark:border-[#30302E] rounded-md shadow-2xs"
                                  />
                                ))}
                              </div>
                              <span className="font-mono text-[11px] text-slate-500 dark:text-[#A8A69C] font-medium">
                                {q.companies.length} {q.companies.length === 1 ? 'co' : 'cos'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-[#8E8C82] text-xs font-mono">—</span>
                          )}
                        </td>

                        {/* Acceptance */}
                        <td className="py-3 px-4 text-right font-mono text-slate-500 dark:text-[#A8A69C] hidden lg:table-cell">
                          {q.acceptance && q.acceptance !== '—' ? (
                            q.acceptance
                          ) : (
                            <span className="text-slate-400 dark:text-[#8E8C82]">—</span>
                          )}
                        </td>

                        {/* Action Column matching ProblemsPage */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                              <BookmarkButton
                                isBookmarked={bookmarked}
                                onToggle={() => toggleBookmark(q.id)}
                              />
                            </div>
                            <a
                              href={q.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-[#FAF9F5] hover:text-white hover:bg-[#0F1B3D] dark:hover:bg-[#D97757] dark:hover:text-[#1F1E1D] rounded-lg transition-colors group-hover:bg-slate-100 dark:group-hover:bg-[#1F1E1D] group-hover:hover:bg-[#0F1B3D] dark:group-hover:hover:bg-[#D97757] group-hover:hover:text-white"
                            >
                              <span>Solve</span>
                              <ExternalLink className="w-3 h-3 opacity-60" />
                            </a>
                          </div>
                        </td>
                      </tr>

                      {/* Collapsible Ah-Ha Pattern Trigger Drawer */}
                      {isExpanded && trigger && (
                        <tr className="bg-amber-50/50 dark:bg-[#252320]/80 border-b border-amber-200/70 dark:border-amber-900/50 animate-fade-in">
                          <td colSpan={8} className="py-3.5 px-4 sm:px-6">
                            <div className="rounded-xl p-3.5 sm:p-4 bg-white/95 dark:bg-[#1F1E1D] border border-amber-200/90 dark:border-amber-900/50 space-y-2.5 shadow-2xs">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                                  <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-700/60">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                  </span>
                                  <span>The "Ah-Ha" Pattern Trigger</span>
                                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-[#2A2926] dark:text-[#A8A69C]">
                                    Active Recall Hint
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setExpandedTriggerId(null)}
                                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#2A2926] transition-colors cursor-pointer"
                                  aria-label="Close trigger hint"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <p className="text-xs sm:text-[13px] text-slate-800 dark:text-[#E2DFD8] leading-relaxed font-medium">
                                {trigger.trigger}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2.5 border-t border-slate-100 dark:border-[#33322E] text-[11px] sm:text-xs">
                                <div className="p-2 rounded-lg bg-slate-50/80 dark:bg-[#262522] border border-slate-200/60 dark:border-[#383733]">
                                  <span className="font-bold text-slate-900 dark:text-[#FAF9F5] block mb-0.5">
                                    Why this technique:
                                  </span>
                                  <span className="text-slate-600 dark:text-[#A8A69C] leading-normal">
                                    {trigger.whyThisPattern}
                                  </span>
                                </div>

                                {trigger.whenItBreaks ? (
                                  <div className="p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                                    <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">
                                      ⚠️ When it breaks:
                                    </span>
                                    <span className="text-slate-600 dark:text-[#A8A69C] leading-normal">
                                      {trigger.whenItBreaks}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                                      Complexity Profile:
                                    </span>
                                    <span className="text-slate-600 dark:text-[#A8A69C] leading-normal">
                                      Optimal single-pass or logarithmic reduction.
                                    </span>
                                  </div>
                                )}

                                <div className="md:col-span-2 p-2 rounded-lg bg-amber-50/40 dark:bg-[#262420] border border-amber-200/60 dark:border-amber-900/40">
                                  <span className="font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
                                    Inherent Invariant:
                                  </span>
                                  <span className="text-slate-700 dark:text-[#E2DFD8] font-mono text-[10.5px] sm:text-[11px]">
                                    {trigger.keyInvariant}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
