import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, CheckCircle2, Filter } from 'lucide-react';
import type { PatternQuestion, SlidingWindowSubcategory } from '../../types/patterns';
import { SLIDING_WINDOW_QUESTIONS } from '../../data/patternsData';
import { useProgress } from '../../hooks/useProgress';
import DifficultyBadge from '../ui/DifficultyBadge';
import StatusToggle from '../ui/StatusToggle';
import BookmarkButton from '../ui/BookmarkButton';

type FilterTab = 'all' | SlidingWindowSubcategory;

export default function PracticeQuestionsSection() {
  const { getStatus, toggleSolved, toggleBookmark, isBookmarked } = useProgress();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const questions = SLIDING_WINDOW_QUESTIONS;

  // Filter questions based on active tab and search query
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesTab = activeTab === 'all' || q.subpattern === activeTab;
      const matchesQuery =
        searchQuery.trim() === '' ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toString().includes(searchQuery) ||
        q.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesQuery;
    });
  }, [questions, activeTab, searchQuery]);

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
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-6 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-[#383835]">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
            Curated Practice Problems
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-1">
            15 hand-selected problems from real company interview loops, organized by sub-technique.
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#1E1E1C] px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-[#383835]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-[#FAF9F5]">
              {solvedCount} / {questions.length} Solved
            </span>
          </div>
          <div className="w-24 h-2 bg-slate-200 dark:bg-[#383835] rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${solvedPercentage}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-[#A8A69C]">
            {solvedPercentage}%
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Subcategory Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
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
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Questions Table / List */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-[#383835]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-[#383835] bg-slate-50/70 dark:bg-[#1E1E1C]/60 text-slate-500 dark:text-[#A8A69C] font-semibold">
              <th className="py-3 px-3 w-10 text-center">Status</th>
              <th className="py-3 px-3 w-14">#</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-3 w-24">Difficulty</th>
              <th className="py-3 px-4 hidden md:table-cell">Subcategory</th>
              <th className="py-3 px-4 hidden sm:table-cell">Top Companies</th>
              <th className="py-3 px-3 text-right hidden lg:table-cell">Acceptance</th>
              <th className="py-3 px-3 w-10 text-center">Save</th>
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
                    <td className="py-3 px-3 text-center">
                      <StatusToggle
                        status={status}
                        onToggleSolved={() => toggleSolved(q.id)}
                      />
                    </td>

                    {/* Problem ID */}
                    <td className="py-3 px-3 font-mono text-slate-400 dark:text-[#8E8C82]">
                      {q.id}
                    </td>

                    {/* Problem Title */}
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-3">
                      <DifficultyBadge difficulty={q.difficulty} />
                    </td>

                    {/* Subcategory */}
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80 dark:bg-[#1E1E1C] dark:text-[#A8A69C] dark:border-[#383835]">
                        {q.subpatternLabel}
                      </span>
                    </td>

                    {/* Top Companies */}
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex flex-wrap items-center gap-1">
                        {q.companies.slice(0, 3).map((comp, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-[#1E1E1C] dark:text-[#A8A69C] border border-slate-200/60 dark:border-[#383835]"
                          >
                            {comp}
                          </span>
                        ))}
                        {q.companies.length > 3 && (
                          <span className="text-[10px] font-mono text-slate-400 dark:text-[#8E8C82]">
                            +{q.companies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Acceptance */}
                    <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-[#A8A69C] hidden lg:table-cell">
                      {q.acceptance}
                    </td>

                    {/* Bookmark */}
                    <td className="py-3 px-3 text-center">
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
