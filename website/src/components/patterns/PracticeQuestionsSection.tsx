import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, CheckCircle2, Filter, Loader2 } from 'lucide-react';
import type { PatternQuestion, SlidingWindowSubcategory } from '../../types/patterns';
import { SLIDING_WINDOW_MAPPINGS, joinPatternQuestions } from '../../data/patternsData';
import { useAllQuestions } from '../../hooks/useAllQuestions';
import { useDataIndex } from '../../hooks/useDataIndex';
import { useProgress } from '../../hooks/useProgress';
import DifficultyBadge from '../ui/DifficultyBadge';
import StatusToggle from '../ui/StatusToggle';
import BookmarkButton from '../ui/BookmarkButton';

type FilterTab = 'all' | SlidingWindowSubcategory;

export default function PracticeQuestionsSection() {
  const { getStatus, toggleSolved, toggleBookmark, isBookmarked } = useProgress();
  const { data: allQuestions, loading: loadingQuestions } = useAllQuestions();
  const { data: indexData } = useDataIndex();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    return joinPatternQuestions(SLIDING_WINDOW_MAPPINGS, allQuestions);
  }, [allQuestions]);

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

  // Solved statistics for Sliding Window
  const solvedCount = useMemo(() => {
    return questions.filter(q => getStatus(q.id) === 'solved').length;
  }, [questions, getStatus]);

  const solvedPercentage = Math.round((solvedCount / questions.length) * 100);

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Problems', count: questions.length },
    {
      id: 'fixed-window',
      label: 'Fixed-Size',
      count: questions.filter(q => q.subpattern === 'fixed-window').length,
    },
    {
      id: 'variable-window',
      label: 'Variable-Size',
      count: questions.filter(q => q.subpattern === 'variable-window').length,
    },
    {
      id: 'frequency-window',
      label: 'Frequency & Character Counts',
      count: questions.filter(q => q.subpattern === 'frequency-window').length,
    },
    {
      id: 'advanced-window',
      label: 'Advanced',
      count: questions.filter(q => q.subpattern === 'advanced-window').length,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#383835]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
            Curated Practice Problems
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
            15 hand-selected problems from real company interview loops, organized by sub-technique.
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#1E1E1C] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-[#383835]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-[#FAF9F5]">
              {solvedCount} / {questions.length} Solved
            </span>
          </div>
          <div className="w-20 sm:w-24 h-1.5 bg-slate-200 dark:bg-[#383835] rounded-full overflow-hidden">
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
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1E1E1C] dark:text-[#A8A69C] dark:hover:bg-[#30302E] dark:hover:text-[#FAF9F5]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 text-[11px] opacity-80 font-mono`}>
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
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Questions Table / List */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-[#383835]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-[#383835] bg-slate-50/70 dark:bg-[#1E1E1C]/60 text-slate-500 dark:text-[#A8A69C] font-semibold">
              <th className="py-2.5 px-3 w-10 text-center">Status</th>
              <th className="py-2.5 px-3 w-14">#</th>
              <th className="py-2.5 px-3.5">Title</th>
              <th className="py-2.5 px-3 w-24">Difficulty</th>
              <th className="py-2.5 px-3.5 hidden md:table-cell">Subcategory</th>
              <th className="py-2.5 px-3.5 hidden sm:table-cell">Top Companies</th>
              <th className="py-2.5 px-3 text-right hidden lg:table-cell">Acceptance</th>
              <th className="py-2.5 px-3 w-10 text-center">Save</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#383835]">
            {filteredQuestions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 dark:text-[#8E8C82]">
                  No practice problems found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredQuestions.map(q => {
                const status = getStatus(q.id);
                const bookmarked = isBookmarked(q.id);

                return (
                  <tr
                    key={q.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-[#30302E]/40 transition-colors ${
                      status === 'solved' ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                    }`}
                  >
                    {/* Status Toggle */}
                    <td className="py-2.5 px-3 text-center">
                      <StatusToggle
                        status={status}
                        onToggleSolved={() => toggleSolved(q.id)}
                      />
                    </td>

                    {/* Problem ID */}
                    <td className="py-2.5 px-3 font-mono text-slate-400 dark:text-[#8E8C82]">
                      {q.id}
                    </td>

                    {/* Problem Title */}
                    <td className="py-2.5 px-3.5">
                      <a
                        href={q.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 font-semibold text-slate-800 dark:text-[#FAF9F5] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span className={status === 'solved' ? 'line-through text-slate-400 dark:text-[#8E8C82]' : ''}>
                          {q.title}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>

                    {/* Difficulty */}
                    <td className="py-2.5 px-3">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>

                    {/* Subcategory */}
                    <td className="py-2.5 px-3.5 hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80 dark:bg-[#1E1E1C] dark:text-[#A8A69C] dark:border-[#383835]">
                        {q.subpatternLabel}
                      </span>
                    </td>

                    {/* Top Companies */}
                    <td className="py-2.5 px-3.5 hidden sm:table-cell">
                      <div className="flex flex-wrap items-center gap-1">
                        {q.companies.slice(0, 3).map((comp, idx) => {
                          const name =
                            companyNameMap.get(comp.toLowerCase()) ||
                            comp.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                          return (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-[#1E1E1C] dark:text-[#A8A69C] border border-slate-200/60 dark:border-[#383835]"
                              title={name}
                            >
                              {name}
                            </span>
                          );
                        })}
                        {q.companies.length > 3 && (
                          <span
                            className="text-[10px] font-mono text-slate-400 dark:text-[#8E8C82]"
                            title={`${q.companies.length - 3} more companies`}
                          >
                            +{q.companies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Acceptance */}
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500 dark:text-[#A8A69C] hidden lg:table-cell">
                      {q.acceptance}
                    </td>

                    {/* Bookmark */}
                    <td className="py-2.5 px-3 text-center">
                      <BookmarkButton
                        isBookmarked={bookmarked}
                        onToggle={() => toggleBookmark(q.id)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
