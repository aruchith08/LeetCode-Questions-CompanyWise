import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, BookOpen, Target, BarChart2, ChevronDown } from 'lucide-react';
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
  const patternsMasteredCount = slidingWindowSolvedCount === SLIDING_WINDOW_QUESTIONS.length ? 1 : 0;

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
    <div className="min-h-screen py-8 space-y-12">
      {/* Hero Section matching exact screenshot layout */}
      <section className="relative pt-2 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtitle & 3 Stat Cards */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight leading-[1.12]">
                Think in Patterns.
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8A69C] max-w-xl leading-relaxed">
                Understand the techniques behind DSA problems. Build intuition, recognize approaches, and solve unfamiliar questions with confidence.
              </p>
            </div>

            {/* 3 Stat Cards in a row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {/* Stat 1: Learning tracks */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5] leading-tight">
                    18
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#A8A69C]">
                    Learning tracks
                  </div>
                </div>
              </div>

              {/* Stat 2: Patterns mastered */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5] leading-tight">
                    {patternsMasteredCount} / 18
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#A8A69C]">
                    Patterns mastered
                  </div>
                </div>
              </div>

              {/* Stat 3: Pattern questions solved */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5] leading-tight">
                    {totalPatternQuestionsSolved}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-[#A8A69C]">
                    Pattern questions solved
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Res 3D Isometric Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center select-none">
            <div className="relative w-full max-w-[420px] flex items-center justify-center">
              <img
                src="/patterns-hero-3d.webp"
                alt="DSA Pattern Mastery Journey: Learn, Practice, Master"
                className="w-full h-auto object-contain drop-shadow-sm select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search & Level Filter Bar matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-start gap-3 pt-2">
        {/* Search Input */}
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search patterns..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-[#1E1E1C] border border-slate-200/90 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        {/* All Levels Dropdown Toggle */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1E1E1C] border border-slate-200/90 dark:border-[#43433F] text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#30302E] transition-colors shadow-2xs cursor-pointer"
          >
            <span>{selectedLevel === 'All' ? 'All Levels' : selectedLevel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-[#262624] border border-slate-200 dark:border-[#43433F] p-1.5 shadow-lg z-30 space-y-1">
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
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'text-slate-600 dark:text-[#A8A69C] hover:bg-slate-50 dark:hover:bg-[#30302E]'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className="font-mono text-[11px] opacity-70">({opt.count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Level Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {levelOptions.map(opt => {
            const isSelected = selectedLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedLevel(opt.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#1E1E1C] text-slate-600 dark:text-[#A8A69C] hover:bg-slate-100 dark:hover:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F]'
                }`}
              >
                <span>{opt.id === 'All' ? 'All Patterns' : `${opt.label} (${opt.count})`}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Groups */}
      {selectedLevel === 'All' ? (
        <div className="space-y-14">
          {/* Foundation Section */}
          {foundationPatterns.length > 0 && (
            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Start with the fundamentals
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A69C] mt-0.5">
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Intermediate patterns
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A69C] mt-0.5">
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                  Advanced patterns
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A69C] mt-0.5">
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
