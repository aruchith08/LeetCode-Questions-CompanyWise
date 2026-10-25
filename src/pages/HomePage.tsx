import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, ArrowUpRight, Check, Clock, Bookmark,
  Layers, ChevronRight, X, Sparkles, Building2, Terminal,
  ExternalLink, BarChart2, ShieldCheck, Target
} from 'lucide-react';
import { useDataIndex } from '../hooks/useDataIndex';
import { useProgress } from '../hooks/useProgress';
import { useAllQuestions } from '../hooks/useAllQuestions';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CompanyLogo from '../components/ui/CompanyLogo';
import StatusToggle from '../components/ui/StatusToggle';
import DifficultyBadge from '../components/ui/DifficultyBadge';

export default function HomePage() {
  const { data, loading: loadingIndex } = useDataIndex();
  const { data: allQuestions, loading: loadingQuestions } = useAllQuestions();
  const { totalSolved, progress, getStatus, toggleSolved, toggleBookmark, isBookmarked } = useProgress();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  // Data constants & calculations
  const totalQuestions = data?.totalQuestions || 1446;
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
      easy: { solved: easySolved, total: data?.difficultyCounts.Easy || 350 },
      medium: { solved: medSolved, total: data?.difficultyCounts.Medium || 799 },
      hard: { solved: hardSolved, total: data?.difficultyCounts.Hard || 297 },
    };
  }, [allQuestions, data, getStatus]);

  // Total attempted questions count
  const totalAttempted = useMemo(() => {
    return Object.values(progress.solvedQuestions).filter(s => s === 'attempted').length;
  }, [progress.solvedQuestions]);

  // Total bookmarked questions count
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
    // Default to classic iconic problems
    const defaults = [1, 200, 146, 20];
    return defaults
      .map(id => allQuestions.find(q => q.id === id))
      .filter((q): q is typeof allQuestions[number] => Boolean(q));
  }, [allQuestions, progress.recentQuestions]);

  // Live search results: combine companies + problems
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
    <div className="space-y-10 sm:space-y-12 animate-fade-in pb-16">
      {/* Search-First Command Desk Hero */}
      <section className="pt-2 sm:pt-6 pb-2 max-w-4xl mx-auto text-center space-y-6">
        {/* Terminal/Diagnostic Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] text-xs font-mono text-neutral-600 dark:text-neutral-400 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Curated Interview Intelligence · 200 Companies</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
            Target the exact questions<br />
            top tech companies <span className="text-blue-600 dark:text-blue-400">actually ask.</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate interview guesswork. 1,446 verified LeetCode problems indexed across 200 tech companies with recency windows and interview frequency rankings.
          </p>
        </div>

        {/* Central Command Search Box */}
        <div className="relative max-w-2xl mx-auto text-left" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className={`relative flex items-center bg-white dark:bg-[#121214] border rounded-2xl shadow-sm transition-all ${
              searchFocused
                ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md'
                : 'border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
            }`}>
              <Search className="w-5 h-5 text-neutral-400 ml-4 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                  setSelectedIndex(0);
                }}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search companies (e.g. Google, Amazon) or questions (e.g. Two Sum, #146)..."
                className="w-full h-13 pl-3 pr-28 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
              />
              <div className="absolute right-3 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
                    className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    aria-label="Clear query"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md">
                    /
                  </kbd>
                )}
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Interactive Search Dropdown with Typeahead matches */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-[#141416] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-800/80 animate-fade-in">
              {hasSearchResults ? (
                <>
                  {/* Matching Companies */}
                  {searchResults.companies.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5">
                        Companies
                      </div>
                      {searchResults.companies.map(c => (
                        <Link
                          key={c.slug}
                          to={`/companies/${c.slug}`}
                          onClick={() => setSearchFocused(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <CompanyLogo slug={c.slug} name={c.name} size="xs" />
                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {c.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-neutral-500">
                            {c.questionCount} questions <ChevronRight className="w-3 h-3 inline ml-0.5 opacity-60" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Matching Problems */}
                  {searchResults.questions.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5">
                        Problems
                      </div>
                      {searchResults.questions.map(q => (
                        <Link
                          key={q.id}
                          to={`/problems?q=${encodeURIComponent(q.title)}`}
                          onClick={() => setSearchFocused(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-xs text-neutral-400">#{q.id}</span>
                            <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                              {q.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <DifficultyBadge difficulty={q.difficulty} size="sm" />
                            <span className="text-[11px] font-mono text-neutral-400">
                              {q.companySlugs.length} cos
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Footer link to view all */}
                  <div className="p-2.5 bg-neutral-50 dark:bg-neutral-900/40 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      Press Enter to view all results for &ldquo;{searchQuery}&rdquo; in Problems →
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No matching companies or problems found for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick-Access Company Jump Matrix */}
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Quick Jump to Tech Targets
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {targetCompanies.map(c => (
              <Link
                key={c.slug}
                to={`/companies/${c.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-all shadow-2xs group"
              >
                <CompanyLogo slug={c.slug} name={c.name} size="xs" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {c.name}
                </span>
                <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                  {c.questionCount}
                </span>
              </Link>
            ))}
            <Link
              to="/companies"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>+192 more</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Concise Telemetry Strip: Derived Strictly from Real Data */}
        <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
          <div className="p-3 rounded-xl bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 shadow-2xs">
            <span className="text-[11px] font-mono text-neutral-500 block uppercase tracking-wider">Catalog</span>
            <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white block mt-0.5">
              {totalQuestions.toLocaleString()}
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">LeetCode problems</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 shadow-2xs">
            <span className="text-[11px] font-mono text-neutral-500 block uppercase tracking-wider">Companies</span>
            <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white block mt-0.5">
              {data.totalCompanies}
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">interview loops</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 shadow-2xs">
            <span className="text-[11px] font-mono text-neutral-500 block uppercase tracking-wider">Your Solved</span>
            <span className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 block mt-0.5">
              {totalSolved}
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">{progressDisplay} complete</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 shadow-2xs">
            <span className="text-[11px] font-mono text-neutral-500 block uppercase tracking-wider">Windows</span>
            <span className="text-xl font-bold font-mono text-neutral-900 dark:text-white block mt-0.5">
              4 Tiers
            </span>
            <span className="text-[11px] text-neutral-500 font-medium">6m · 1y · 2y · All-time</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Grid: Featured Company Sets (Left) + Personal Command Desk (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Featured Company Sets */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                Featured Company Collections
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                High-frequency questions curated directly from candidate interview reports.
              </p>
            </div>
            <Link
              to="/companies"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1 shrink-0"
            >
              <span>View all 200</span>
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
                  className="p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-neutral-700 bg-white dark:bg-[#121214] transition-all duration-200 group flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-3">
                        <CompanyLogo slug={c.slug} name={c.name} size="md" className="rounded-xl shadow-2xs" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {c.name}
                          </h3>
                          <span className="text-xs text-neutral-500 font-medium">
                            {c.questionCount} questions
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>

                    <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate mb-3">
                      {companyTopTags[c.slug] || 'Data Structures · Algorithms'}
                    </p>
                  </div>

                  {/* Progress Strip */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                      <span className="text-neutral-500 text-[11px]">
                        {solved} solved of {c.questionCount}
                      </span>
                      <span className="font-bold font-mono text-[11px] text-blue-600 dark:text-blue-400">
                        {compPctDisplay}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
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
          <div className="p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Preparation Status</h3>
              </div>
              <Link
                to="/progress"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Solved / Total Header */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-extrabold font-mono text-2xl text-neutral-900 dark:text-white">
                  {totalSolved}
                </span>
                <span className="font-bold font-mono text-sm text-blue-600 dark:text-blue-400">
                  {progressDisplay}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(rawPct, totalSolved > 0 ? 1 : 0)}%` }}
                />
              </div>
              <span className="text-[11px] text-neutral-500 block mt-1">
                {totalSolved} of {totalQuestions.toLocaleString()} total questions marked solved
              </span>
            </div>

            {/* Secondary telemetry counters */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Attempted</span>
                </div>
                <span className="font-mono font-bold text-base text-neutral-900 dark:text-white block mt-0.5">
                  {totalAttempted}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </div>
                <span className="font-mono font-bold text-base text-neutral-900 dark:text-white block mt-0.5">
                  {totalBookmarked}
                </span>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Solved by Difficulty
              </span>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Easy</span>
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">
                      {difficultyBreakdown.easy.solved} / {difficultyBreakdown.easy.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(difficultyBreakdown.easy.solved / difficultyBreakdown.easy.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-amber-700 dark:text-amber-400 font-semibold">Medium</span>
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">
                      {difficultyBreakdown.medium.solved} / {difficultyBreakdown.medium.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(difficultyBreakdown.medium.solved / difficultyBreakdown.medium.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-rose-700 dark:text-rose-400 font-semibold">Hard</span>
                    <span className="font-mono text-neutral-600 dark:text-neutral-400">
                      {difficultyBreakdown.hard.solved} / {difficultyBreakdown.hard.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
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
          <div className="p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-500" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Recent Queue</h3>
              </div>
              <Link
                to="/problems"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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
                    className="p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 flex items-center justify-between gap-2.5 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <StatusToggle
                        status={status}
                        onToggleSolved={() => toggleSolved(q.id)}
                      />
                      <span className="font-mono text-[11px] text-neutral-400 shrink-0">#{q.id}</span>
                      <a
                        href={q.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors"
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
                          className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
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

      {/* Curated Problem Categories / Tracks */}
      <section className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
            Curated Study Tracks
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Focus your preparation on standard interview domains and frequency tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/companies?category=faang"
            className="p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-blue-500/50 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Big Tech Tier
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Google, Amazon, Meta, Microsoft, Apple, Netflix problem sets.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between">
              <span>Explore companies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/problems?difficulty=Medium"
            className="p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-amber-500/50 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Medium Core (799)
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                The backbone of L4/L5 interview loops. DP, Trees, Graphs, and Hash Tables.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between">
              <span>View Medium problems</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/companies?category=startups"
            className="p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-blue-500/50 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                High-Growth Startups
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Stripe, DoorDash, Databricks, Robinhood, Coupang question sets.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-between">
              <span>Explore startups</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/problems?q=Dynamic+Programming"
            className="p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-blue-500/50 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Dynamic Programming
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Substrings, grid paths, memoization, and optimal substructure problems.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Search DP problems</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
