import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, ArrowUpRight, Clock, Bookmark,
  ChevronRight, X, ExternalLink, Target
} from 'lucide-react';
import { useDataIndex } from '../hooks/useDataIndex';
import { useProgress } from '../hooks/useProgress';
import { useAllQuestions } from '../hooks/useAllQuestions';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CompanyLogo from '../components/ui/CompanyLogo';
import StatusToggle from '../components/ui/StatusToggle';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import CompanyWiseGlobe from '../components/ui/CompanyWiseGlobe';
import AboutSection from '../components/ui/AboutSection';

export default function HomePage() {
  const { data, loading: loadingIndex } = useDataIndex();
  const { data: allQuestions, loading: loadingQuestions } = useAllQuestions();
  const { totalSolved, progress, getStatus, toggleSolved } = useProgress();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcut '/' to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        if (!['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      } else if (e.key === 'Escape' && searchFocused) {
        setSearchFocused(false);
        searchInputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchFocused]);

  // Click outside search container to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Data calculations
  const totalQuestions = data?.totalQuestions || 3411;
  const rawPct = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
  const progressDisplay = totalSolved === 0
    ? '0%'
    : rawPct < 1
      ? `${rawPct.toFixed(2)}%`
      : rawPct < 10
        ? `${rawPct.toFixed(1)}%`
        : `${Math.round(rawPct)}%`;

  // Solved by difficulty
  const difficultyBreakdown = useMemo(() => {
    let easySolved = 0;
    let medSolved = 0;
    let hardSolved = 0;

    if (allQuestions) {
      for (const q of allQuestions) {
        if (getStatus(q.id) === 'solved') {
          if (q.difficulty === 'Easy') easySolved++;
          else if (q.difficulty === 'Medium') medSolved++;
          else if (q.difficulty === 'Hard') hardSolved++;
        }
      }
    }

    return {
      easy: { solved: easySolved, total: data?.difficultyCounts.Easy || 814 },
      medium: { solved: medSolved, total: data?.difficultyCounts.Medium || 1817 },
      hard: { solved: hardSolved, total: data?.difficultyCounts.Hard || 780 },
    };
  }, [allQuestions, data, getStatus]);

  // Total attempted count
  const totalAttempted = useMemo(() => {
    return Object.values(progress.solvedQuestions).filter(s => s === 'attempted').length;
  }, [progress.solvedQuestions]);

  // Total bookmarked count
  const totalBookmarked = progress.bookmarks.length;

  // Prominent target companies for shortcuts & featured section
  const targetCompanies = useMemo(() => {
    if (!data) return [];
    const slugs = ['google', 'amazon', 'meta', 'microsoft', 'apple', 'bloomberg', 'uber', 'bytedance'];
    return slugs
      .map(slug => data.companies.find(c => c.slug === slug || (slug === 'meta' && c.slug === 'facebook')))
      .filter(Boolean) as typeof data.companies;
  }, [data]);

  const companyTopTags: Record<string, string> = {
    google: 'Arrays · DP · Graphs',
    amazon: 'Trees · Strings · Hash Map',
    meta: 'Trees · Binary Search · BFS',
    facebook: 'Trees · Binary Search · BFS',
    microsoft: 'Linked List · Arrays · DFS',
    apple: 'Arrays · Math · Dynamic Prog',
    bloomberg: 'Strings · Stack · Hash Table',
    uber: 'Graphs · BFS · Shortest Path',
    bytedance: 'Strings · DP · Backtracking',
  };

  // Company solved count map
  const companySolvedMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!allQuestions) return map;
    for (const q of allQuestions) {
      if (getStatus(q.id) === 'solved') {
        for (const slug of q.companySlugs) {
          map.set(slug, (map.get(slug) || 0) + 1);
        }
      }
    }
    return map;
  }, [allQuestions, getStatus]);

  // Recently viewed questions
  const recentlyViewed = useMemo(() => {
    if (!allQuestions) return [];
    if (progress.recentQuestions.length > 0) {
      return progress.recentQuestions
        .map(id => allQuestions.find(q => q.id === id))
        .filter((q): q is typeof allQuestions[number] => Boolean(q))
        .slice(0, 4);
    }
    const defaults = [1, 200, 146, 20];
    return defaults
      .map(id => allQuestions.find(q => q.id === id))
      .filter((q): q is typeof allQuestions[number] => Boolean(q));
  }, [allQuestions, progress.recentQuestions]);

  // Live search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 1) return { companies: [], questions: [] };

    const matchingCompanies = data
      ? data.companies
          .filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
          .slice(0, 4)
      : [];

    const matchingQuestions = allQuestions
      ? allQuestions
          .filter(p => p.title.toLowerCase().includes(q) || p.id.toString() === q)
          .slice(0, 5)
      : [];

    return {
      companies: matchingCompanies,
      questions: matchingQuestions,
    };
  }, [searchQuery, data, allQuestions]);

  const hasSearchResults =
    searchResults.companies.length > 0 || searchResults.questions.length > 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/problems?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchFocused(false);
  };

  if (loadingIndex || loadingQuestions) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-10 sm:space-y-12 animate-fade-in pb-12">
      {/* 2-Column Command Desk Hero: 3D Globe on Left, Command Copy & Controls on Right */}
      <section className="pt-2 sm:pt-4 pb-2 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: 3D Network Globe */}
        <div className="w-full flex items-center justify-center order-2 lg:order-1 lg:col-span-5">
          <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
            <CompanyWiseGlobe
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
              autoRotate={true}
              speed={0.17}
              draggable={false}
            />
          </div>
        </div>

        {/* Right Column: Hero Content & Search Desk */}
        <div className="w-full order-1 lg:order-2 lg:col-span-7 space-y-6 text-left">
          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal hero-serif tracking-tight text-slate-900 dark:text-[#FAF9F5] leading-[1.12] hero-title-animate">
              <span>Target the exact questions<br className="hidden sm:inline" />top tech companies </span>
              <span className="inline-block relative hero-accent-badge text-[#0F1B3D] dark:text-[#D97757]">
                actually ask.
                <span className="hero-accent-underline" aria-hidden="true" />
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8A69C] max-w-2xl leading-relaxed">
              Eliminate interview guesswork. {data?.totalQuestions ? data.totalQuestions.toLocaleString() : '3,411'} verified LeetCode problems indexed across {data?.totalCompanies || '490'} tech companies with recency windows and frequency rankings.
            </p>
          </div>

          {/* Central Command Search Box */}
          <div className="relative w-full max-w-2xl text-left" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`relative flex items-center bg-white dark:bg-[#30302E] border rounded-2xl shadow-sm transition-all h-14 ${
                searchFocused
                  ? 'border-[#0F1B3D] dark:border-[#D97757] ring-4 ring-[#0F1B3D]/10 dark:ring-[#D97757]/15 shadow-md'
                  : 'border-slate-200/90 dark:border-[#43433F] hover:border-slate-300 dark:hover:border-slate-600'
              }`}>
                <Search className="w-5 h-5 text-slate-400 ml-4 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setSearchFocused(true);
                  }}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search companies (e.g. Google, Amazon) or questions (e.g. Two Sum, #146)..."
                  className="w-full h-full pl-3 pr-28 bg-transparent text-sm text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none font-sans"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      aria-label="Clear query"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono font-semibold text-[#0F1B3D] dark:text-[#E0B14F] bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] rounded-md">
                      /
                    </kbd>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Interactive Search Dropdown with Typeahead matches */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-[#43433F]/80 animate-fade-in">
                {hasSearchResults ? (
                  <>
                    {/* Matching Companies */}
                    {searchResults.companies.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                          Companies
                        </div>
                        {searchResults.companies.map(c => (
                          <Link
                            key={c.slug}
                            to={`/companies/${c.slug}`}
                            onClick={() => setSearchFocused(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1F1E1D] transition-colors group"
                          >
                            <div className="flex items-center gap-2.5">
                              <CompanyLogo slug={c.slug} name={c.name} size="xs" />
                              <span className="text-xs font-semibold text-slate-900 dark:text-[#FAF9F5] group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757]">
                                {c.name}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-500">
                              {c.questionCount} questions <ChevronRight className="w-3 h-3 inline ml-0.5 opacity-60" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Matching Problems */}
                    {searchResults.questions.length > 0 && (
                      <div className="p-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                          Problems
                        </div>
                        {searchResults.questions.map(q => (
                          <Link
                            key={q.id}
                            to={`/problems?q=${encodeURIComponent(q.title)}`}
                            onClick={() => setSearchFocused(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1F1E1D] transition-colors group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-xs text-slate-400">#{q.id}</span>
                              <span className="text-xs font-medium text-slate-900 dark:text-[#FAF9F5] group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757] truncate">
                                {q.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <DifficultyBadge difficulty={q.difficulty} size="sm" />
                              <span className="text-[11px] font-mono text-slate-400">
                                {q.companySlugs.length} cos
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Footer link to view all */}
                    <div className="p-2.5 bg-slate-50 dark:bg-[#262624] text-center">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        Press Enter to view all results for &ldquo;{searchQuery}&rdquo; in Problems →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No matching companies or problems found for &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick-Access Company Jump Matrix */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Quick Jump to Target Companies
            </div>
            <div className="flex flex-wrap items-center justify-start gap-2">
              {targetCompanies.map(c => (
                <Link
                  key={c.slug}
                  to={`/companies/${c.slug}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] hover:border-[#D97757] dark:hover:border-[#D97757] text-xs font-medium text-slate-700 dark:text-[#FAF9F5] transition-colors shadow-2xs"
                >
                  <CompanyLogo slug={c.slug} name={c.name} size="xs" />
                  <span className="font-semibold text-slate-900 dark:text-[#FAF9F5]">
                    {c.name}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                    {c.questionCount}
                  </span>
                </Link>
              ))}
              <Link
                to="/companies"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] text-xs font-semibold text-slate-600 dark:text-[#A8A69C] transition-colors"
              >
                <span>+192 more</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Telemetry Strip from Actual Data */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-[#43433F]/80 w-full max-w-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl bg-white/90 dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-2xs overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-[#43433F]">
              <div className="p-3.5 text-left">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">Catalog</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5] block mt-0.5 tabular-nums">
                  {totalQuestions.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block mt-0.5">LeetCode problems</span>
              </div>

              <div className="p-3.5 text-left">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">Companies</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5] block mt-0.5 tabular-nums">
                  {data.totalCompanies}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block mt-0.5">interview loops</span>
              </div>

              <div className="p-3.5 text-left bg-[#0F1B3D]/[0.02] dark:bg-amber-500/[0.04]">
                <span className="text-[10px] font-mono text-[#F5A524] dark:text-[#D97757] uppercase tracking-wider block font-semibold">Your Solved</span>
                <span className="text-xl font-bold font-mono text-[#0F1B3D] dark:text-[#D97757] block mt-0.5 tabular-nums">
                  {totalSolved}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block mt-0.5">{progressDisplay} complete</span>
              </div>

              <div className="p-3.5 text-left">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">Windows</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-[#FAF9F5] block mt-0.5">
                  4 Tiers
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block mt-0.5">6m · 1y · 2y · All-time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Grid: Featured Company Sets (Left) + Personal Command Deck (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Featured Company Sets */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                Featured Company Collections
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                High-frequency questions curated directly from candidate interview reports.
              </p>
            </div>
            <Link
              to="/companies"
              className="text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View all {data?.totalCompanies || 490}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {targetCompanies.map(c => {
              const solved = companySolvedMap.get(c.slug) || 0;
              const rawCompPct = c.questionCount > 0 ? (solved / c.questionCount) * 100 : 0;
              const compPctDisplay = solved === 0
                ? '0%'
                : rawCompPct < 1
                  ? `${rawCompPct.toFixed(2)}%`
                  : rawCompPct < 10
                    ? `${rawCompPct.toFixed(1)}%`
                    : `${Math.round(rawCompPct)}%`;

              return (
                <Link
                  key={c.slug}
                  to={`/companies/${c.slug}`}
                  className="p-4 rounded-2xl border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] bg-white dark:bg-[#30302E] transition-colors duration-150 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-3">
                        <CompanyLogo slug={c.slug} name={c.name} size="md" className="rounded-xl shadow-2xs" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-[#FAF9F5] truncate">
                            {c.name}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {c.questionCount} questions
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#A8A69C] shrink-0" />
                    </div>

                    <p className="text-[11px] font-mono text-slate-500 dark:text-[#A8A69C] truncate mb-3">
                      {companyTopTags[c.slug] || 'Data Structures · Algorithms'}
                    </p>
                  </div>

                  {/* Progress Strip */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#43433F]/80">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                      <span className="text-slate-500 text-[11px]">
                        {solved} solved of {c.questionCount}
                      </span>
                      <span className="font-bold font-mono text-[11px] text-[#0F1B3D] dark:text-[#D97757]">
                        {compPctDisplay}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#1F1E1D] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-[#F5A524] rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(rawCompPct, solved > 0 ? 2 : 0)}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Personal Interview Command Deck */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Your Target & Real Progress Metrics */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#F5A524]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-[#FAF9F5]">Preparation Status</h3>
              </div>
              <Link
                to="/progress"
                className="text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757] hover:underline flex items-center gap-0.5"
              >
                Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Solved / Total Header */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-extrabold font-mono text-2xl text-slate-900 dark:text-[#FAF9F5]">
                  {totalSolved}
                </span>
                <span className="font-bold font-mono text-sm text-[#0F1B3D] dark:text-[#D97757]">
                  {progressDisplay}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#1F1E1D] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-[#F5A524] rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(rawPct, totalSolved > 0 ? 1 : 0)}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                {totalSolved} of {totalQuestions.toLocaleString()} total questions marked solved
              </span>
            </div>

            {/* Secondary telemetry counters */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#43433F]/80">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#262624] border border-slate-200/60 dark:border-[#43433F]">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-[#E0B14F] font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#F5A524]" />
                  <span>Attempted</span>
                </div>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-[#FAF9F5] block mt-0.5">
                  {totalAttempted}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#262624] border border-slate-200/60 dark:border-[#43433F]">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                  <span>Saved</span>
                </div>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-[#FAF9F5] block mt-0.5">
                  {totalBookmarked}
                </span>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#43433F]/80">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Solved by Difficulty
              </span>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-emerald-700 dark:text-[#8FBF78] font-semibold">Easy</span>
                    <span className="font-mono text-slate-600 dark:text-[#A8A69C]">
                      {difficultyBreakdown.easy.solved} / {difficultyBreakdown.easy.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#1F1E1D] overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(difficultyBreakdown.easy.solved / difficultyBreakdown.easy.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-amber-700 dark:text-[#E0B14F] font-semibold">Medium</span>
                    <span className="font-mono text-slate-600 dark:text-[#A8A69C]">
                      {difficultyBreakdown.medium.solved} / {difficultyBreakdown.medium.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#1F1E1D] overflow-hidden">
                    <div
                      className="h-full bg-[#F5A524] rounded-full"
                      style={{ width: `${(difficultyBreakdown.medium.solved / difficultyBreakdown.medium.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-rose-700 dark:text-[#EE8F78] font-semibold">Hard</span>
                    <span className="font-mono text-slate-600 dark:text-[#A8A69C]">
                      {difficultyBreakdown.hard.solved} / {difficultyBreakdown.hard.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#1F1E1D] overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(difficultyBreakdown.hard.solved / difficultyBreakdown.hard.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Recently Active / Target Queue */}
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-[#FAF9F5]">Recent Queue</h3>
              </div>
              <Link
                to="/problems"
                className="text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757] hover:underline"
              >
                All {totalQuestions.toLocaleString()} →
              </Link>
            </div>

            <div className="space-y-1.5">
              {recentlyViewed.map(q => {
                const status = getStatus(q.id);
                return (
                  <div
                    key={q.id}
                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1F1E1D] flex items-center justify-between gap-2.5 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <StatusToggle
                        status={status}
                        onToggleSolved={() => toggleSolved(q.id)}
                      />
                      <span className="font-mono text-[11px] text-slate-400 shrink-0">#{q.id}</span>
                      <a
                        href={q.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757] truncate transition-colors"
                      >
                        {q.title}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      {q.link && (
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="Solve on LeetCode"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* About Section: Story of the Website, the Foundation (Krishna Dey), the Expansion (liquidslr), and the Builder (Alokam Ruchith) */}
      <AboutSection />
    </div>
  );
}
