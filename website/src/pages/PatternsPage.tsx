import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, BookOpen, Target, BarChart2, ChevronDown, X } from 'lucide-react';
import { PATTERNS_CATALOG, SLIDING_WINDOW_QUESTIONS } from '../data/patternsData';
import type { PatternLevel } from '../types/patterns';
import PatternCard from '../components/patterns/PatternCard';
import { useProgress } from '../hooks/useProgress';

export default function PatternsPage() {
  const { getStatus } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | PatternLevel>('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Calculate user progress across patterns
  const slidingWindowSolvedCount = useMemo(() => {
    return SLIDING_WINDOW_QUESTIONS.filter(q => getStatus(q.id) === 'solved').length;
  }, [getStatus]);

  const totalPatternQuestionsSolved = slidingWindowSolvedCount;
  // Mastery assessment is a dedicated evaluation framework planned for Phase 2.
  // Solving practice problems reflects practice completion, not verified pattern mastery.
  const patternsMasteredCount = 0;

  // Filter patterns based on search query and selected level
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

  const levelOptions: { id: 'All' | PatternLevel; label: string; count: number }[] = [
    { id: 'All', label: 'All Patterns', count: PATTERNS_CATALOG.length },
    { id: 'Foundation', label: 'Foundation', count: 6 },
    { id: 'Intermediate', label: 'Intermediate', count: 7 },
    { id: 'Advanced', label: 'Advanced', count: 5 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Hero Header Section synchronized in scale with Companies/Problems/Progress pages */}
      <section className="pt-1 pb-4 border-b border-slate-200/80 dark:border-[#43433F]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Heading, Subtitle & Compact Stat Cards */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal hero-serif tracking-tight text-slate-900 dark:text-[#FAF9F5]">
                Think in Patterns.
              </h1>
              <p className="text-sm text-slate-600 dark:text-[#A8A69C] mt-1 max-w-xl leading-relaxed">
                Understand the techniques behind DSA problems. Build intuition, recognize approaches, and solve unfamiliar questions with confidence.
              </p>
            </div>

            {/* 3 Compact Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Stat 1: Learning tracks */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-[#FAF9F5] leading-tight">
                    18
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A8A69C] leading-none mt-0.5">
                    Learning tracks
                  </div>
                </div>
              </div>

              {/* Stat 2: Patterns mastered */}
              <div
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] shadow-2xs"
                title="Pattern mastery assessment system planned for Phase 2"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-[#FAF9F5] leading-tight">
                    {patternsMasteredCount} / 18
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A8A69C] leading-none mt-0.5">
                    Patterns mastered
                  </div>
                </div>
              </div>

              {/* Stat 3: Pattern questions solved */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-[#FAF9F5] leading-tight">
                    {totalPatternQuestionsSolved}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A8A69C] leading-none mt-0.5">
                    Practice solved
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Refined, Proportionate 3D Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end select-none">
            <div className="relative w-full max-w-[200px] sm:max-w-[240px] lg:max-w-[260px] flex items-center justify-center">
              <img
                src="/patterns-hero-3d.png"
                alt="DSA Pattern Mastery Journey: Learn, Practice, Master"
                className="w-full h-auto object-contain drop-shadow-sm select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search & Level Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-start gap-2.5">
        {/* Search Input */}
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search patterns..."
            className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:border-[#0F1B3D] dark:focus:border-[#D97757] transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* All Levels Dropdown Toggle */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D] transition-colors shadow-2xs cursor-pointer"
          >
            <span>{selectedLevel === 'All' ? 'All Levels' : selectedLevel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] p-1.5 shadow-lg z-30 space-y-1">
              {levelOptions.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedLevel(opt.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedLevel === opt.id
                      ? 'bg-slate-100 dark:bg-[#262624] text-[#0F1B3D] dark:text-[#FAF9F5] font-bold'
                      : 'text-slate-600 dark:text-[#A8A69C] hover:bg-slate-50 dark:hover:bg-[#1F1E1D]'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="font-mono text-[11px] opacity-70">({opt.count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Level Capsules */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {levelOptions.map(opt => {
            const isSelected = selectedLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedLevel(opt.id)}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs cursor-pointer inline-flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#0F1B3D] dark:bg-white text-white dark:text-[#0F1B3D] shadow-xs'
                    : 'bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D]'
                }`}
              >
                <span>{opt.id === 'All' ? 'All Patterns' : opt.label}</span>
                {opt.id !== 'All' && (
                  <span
                    className={`ml-1 font-mono text-[11px] ${
                      isSelected ? 'text-white/80 dark:text-[#0F1B3D]/80' : 'text-slate-400 dark:text-[#A8A69C]'
                    }`}
                  >
                    ({opt.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Groups */}
      {selectedLevel === 'All' ? (
        <div className="space-y-8">
          {/* Foundation Section */}
          {foundationPatterns.length > 0 && (
            <section className="space-y-3">
              <div>
                <h2 className="text-xl font-bold hero-serif text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Start with the fundamentals
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A69C] mt-0.5">
                  Essential patterns that appear frequently in interviews.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
            <section className="space-y-3">
              <div>
                <h2 className="text-xl font-bold hero-serif text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Intermediate patterns
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A69C] mt-0.5">
                  Build on the fundamentals to solve more complex problems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
            <section className="space-y-3">
              <div>
                <h2 className="text-xl font-bold hero-serif text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Advanced patterns
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A69C] mt-0.5">
                  Tackle specialized and high-difficulty interview questions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
        <div className="text-center py-12 bg-white dark:bg-[#30302E] rounded-2xl border border-slate-200/80 dark:border-[#43433F] p-8">
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
