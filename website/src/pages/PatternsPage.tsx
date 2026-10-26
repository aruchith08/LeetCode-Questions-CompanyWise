import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Target, BarChart2, Sparkles } from 'lucide-react';
import { PATTERNS_CATALOG, SLIDING_WINDOW_QUESTIONS } from '../data/patternsData';
import type { PatternLevel } from '../types/patterns';
import PatternCard from '../components/patterns/PatternCard';
import { useProgress } from '../hooks/useProgress';

export default function PatternsPage() {
  const { getStatus } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | PatternLevel>('All');

  // Calculate user progress across patterns
  const slidingWindowSolvedCount = useMemo(() => {
    return SLIDING_WINDOW_QUESTIONS.filter(q => getStatus(q.id) === 'solved').length;
  }, [getStatus]);

  const totalPatternQuestionsSolved = slidingWindowSolvedCount;
  const patternsMasteredCount = slidingWindowSolvedCount === SLIDING_WINDOW_QUESTIONS.length ? 1 : 0;

  // Filter patterns
  const filteredPatterns = useMemo(() => {
    return PATTERNS_CATALOG.filter(pattern => {
      const matchesLevel = selectedLevel === 'All' || pattern.level === selectedLevel;
      const matchesSearch =
        searchQuery.trim() === '' ||
        pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesLevel && matchesSearch;
    });
  }, [searchQuery, selectedLevel]);

  const foundationPatterns = filteredPatterns.filter(p => p.level === 'Foundation');
  const intermediatePatterns = filteredPatterns.filter(p => p.level === 'Intermediate');
  const advancedPatterns = filteredPatterns.filter(p => p.level === 'Advanced');

  return (
    <div className="min-h-screen py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-[#43433F] bg-gradient-to-b from-blue-50/40 via-white to-transparent dark:from-[#2A2A28]/50 dark:via-[#262624] dark:to-[#262624] p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Stats */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DSA Pattern Mastery Framework</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                Think in Patterns.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8A69C] max-w-2xl leading-relaxed">
                Understand the techniques behind DSA problems. Build intuition, recognize approaches, and solve unfamiliar questions with confidence.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {/* Stat 1 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5]">
                    18
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#A8A69C]">
                    Learning tracks
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5]">
                    {patternsMasteredCount} / 18
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#A8A69C]">
                    Patterns mastered
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5]">
                    {totalPatternQuestionsSolved}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#A8A69C]">
                    Pattern questions solved
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Isometric Diagram Graphic */}
          <div className="lg:col-span-4 flex items-center justify-center relative select-none">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Stepping Stones / Cubes Illustration matching design */}
              <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-sm">
                {/* Floating hexagonal ambient shapes */}
                <polygon points="190,40 210,50 210,75 190,85 170,75 170,50" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <polygon points="40,80 55,90 55,108 40,118 25,108 25,90" fill="none" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

                {/* Step 3 - Master (Top Blue) */}
                <g transform="translate(145, 45)">
                  {/* Base cube top */}
                  <polygon points="35,0 70,20 35,40 0,20" fill="#3B82F6" />
                  <polygon points="0,20 35,40 35,75 0,55" fill="#2563EB" />
                  <polygon points="35,40 70,20 70,55 35,75" fill="#1D4ED8" />
                  {/* Flagpole */}
                  <line x1="35" y1="5" x2="35" y2="-20" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" />
                  <polygon points="35,-20 52,-13 35,-6" fill="#2563EB" />
                </g>
                <text x="180" y="115" textAnchor="middle" className="text-[11px] font-sans font-bold fill-blue-700 dark:fill-blue-300">
                  Master
                </text>

                {/* Step 2 - Practice (Middle Purple) */}
                <g transform="translate(100, 100)">
                  <polygon points="35,0 70,20 35,40 0,20" fill="#A855F7" />
                  <polygon points="0,20 35,40 35,70 0,50" fill="#9333EA" />
                  <polygon points="35,40 70,20 70,50 35,70" fill="#7E22CE" />
                </g>
                <text x="135" y="165" textAnchor="middle" className="text-[11px] font-sans font-bold fill-purple-700 dark:fill-purple-300">
                  Practice
                </text>

                {/* Step 1 - Learn (Bottom Mint Green) */}
                <g transform="translate(45, 135)">
                  <polygon points="35,0 70,20 35,40 0,20" fill="#34D399" />
                  <polygon points="0,20 35,40 35,70 0,50" fill="#10B981" />
                  <polygon points="35,40 70,20 70,50 35,70" fill="#059669" />
                </g>
                <text x="80" y="200" textAnchor="middle" className="text-[11px] font-sans font-bold fill-emerald-700 dark:fill-emerald-300">
                  Learn
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Level Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search patterns or keywords..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#1E1E1C] border border-slate-200/90 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Level filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          {(['All', 'Foundation', 'Intermediate', 'Advanced'] as const).map(level => {
            const count =
              level === 'All'
                ? PATTERNS_CATALOG.length
                : PATTERNS_CATALOG.filter(p => p.level === level).length;
            const isSelected = selectedLevel === level;

            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#1E1E1C] text-slate-600 dark:text-[#A8A69C] hover:bg-slate-100 dark:hover:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F]'
                }`}
              >
                <span>{level === 'All' ? 'All Patterns' : `${level} (${count})`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Groups */}
      {selectedLevel === 'All' ? (
        <div className="space-y-12">
          {/* Foundation Section */}
          {foundationPatterns.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Start with the fundamentals
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
                  Essential patterns that appear frequently in interviews.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foundationPatterns.map(pattern => (
                  <PatternCard
                    key={pattern.id}
                    pattern={pattern}
                    solvedCount={pattern.slug === 'sliding-window' ? slidingWindowSolvedCount : 0}
                    totalQuestions={pattern.slug === 'sliding-window' ? SLIDING_WINDOW_QUESTIONS.length : undefined}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Intermediate Section */}
          {intermediatePatterns.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Intermediate patterns
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
                  Build on the fundamentals to solve more complex problems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intermediatePatterns.map(pattern => (
                  <PatternCard
                    key={pattern.id}
                    pattern={pattern}
                    solvedCount={0}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Advanced Section */}
          {advancedPatterns.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Advanced patterns
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
                  Tackle specialized and high-difficulty interview questions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advancedPatterns.map(pattern => (
                  <PatternCard
                    key={pattern.id}
                    pattern={pattern}
                    solvedCount={0}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Filtered Grid for single level */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatterns.map(pattern => (
              <PatternCard
                key={pattern.id}
                pattern={pattern}
                solvedCount={pattern.slug === 'sliding-window' ? slidingWindowSolvedCount : 0}
                totalQuestions={pattern.slug === 'sliding-window' ? SLIDING_WINDOW_QUESTIONS.length : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {filteredPatterns.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#1E1E1C] rounded-2xl border border-slate-200/80 dark:border-[#43433F] p-8">
          <p className="text-sm font-semibold text-slate-700 dark:text-[#FAF9F5]">
            No patterns found matching "{searchQuery}"
          </p>
          <p className="text-xs text-slate-400 dark:text-[#8E8C82] mt-1">
            Try searching for another keyword like "two pointers", "window", or "heap".
          </p>
        </div>
      )}
    </div>
  );
}
