import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, ArrowUpRight, Clock, Bookmark,
  Layers, ChevronRight, X, Sparkles, Building2,
  ExternalLink, BarChart2, Target
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
      {/* Search-First Command Desk Hero */}
      <section className="pt-2 sm:pt-6 pb-2 max-w-4xl mx-auto text-center space-y-6">
        {/* Terminal/Diagnostic Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] text-xs font-mono text-slate-600 dark:text-slate-400 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#F5A524] animate-pulse" />
          <span>Curated Interview Intelligence · 200 Companies</span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <div data-impeccable-variants="5a69e52b" data-impeccable-variant-count="3" style={{ display: "contents" }}>
            {/* impeccable-variants-start 5a69e52b */}
            {/* Original */}
            <div data-impeccable-variant="original">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Target the exact questions<br />
                top tech companies <span className="text-[#0F1B3D] dark:text-[#F5A524]">actually ask.</span>
              </h1>
            </div>
            {/* Variants: insert below this line */}
            <style data-impeccable-css="5a69e52b">{`
@keyframes v1-slide-up {
  0% {
    transform: translateY(115%);
    opacity: 0;
  }
  100% {
    transform: translateY(0%);
    opacity: 1;
  }
}

@scope ([data-impeccable-variant="1"]) {
  :scope > h1 .v1-line-1 {
    animation: v1-slide-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  :scope > h1 .v1-line-2 {
    animation: v1-slide-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
  }
}

@keyframes v2-tracking-settle {
  0% {
    opacity: 0;
    transform: translateY(16px);
    letter-spacing: 0.03em;
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    letter-spacing: -0.025em;
    filter: blur(0px);
  }
}

@scope ([data-impeccable-variant="2"]) {
  :scope > h1 {
    animation: v2-tracking-settle 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
}

@keyframes v3-glide-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes v3-underline-draw {
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  100% {
    transform: scaleX(1);
    opacity: 0.9;
  }
}

@keyframes v3-pulse-glow {
  0%, 100% {
    text-shadow: 0 0 0 rgba(245, 165, 36, 0);
  }
  50% {
    text-shadow: 0 0 16px rgba(245, 165, 36, 0.35);
  }
}

@scope ([data-impeccable-variant="3"]) {
  :scope > h1 {
    animation: v3-glide-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  :scope > h1 .v3-accent-badge {
    animation: v3-pulse-glow 2.4s ease-in-out 0.6s infinite;
  }
  :scope > h1 .v3-underline {
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 3px;
    background: currentColor;
    border-radius: 2px;
    transform-origin: left center;
    animation: v3-underline-draw 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
  }
}

@media (prefers-reduced-motion: reduce) {
  @scope ([data-impeccable-variant="1"]) {
    :scope > h1 .v1-line-1,
    :scope > h1 .v1-line-2 {
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }
  @scope ([data-impeccable-variant="2"]) {
    :scope > h1 {
      animation: none !important;
      transform: none !important;
      filter: none !important;
      opacity: 1 !important;
    }
  }
  @scope ([data-impeccable-variant="3"]) {
    :scope > h1,
    :scope > h1 .v3-accent-badge,
    :scope > h1 .v3-underline {
      animation: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }
}
`}</style>
            <div data-impeccable-variant="1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                <span className="inline-block overflow-hidden pb-1">
                  <span className="inline-block v1-line-1">Target the exact questions</span>
                </span>
                <br />
                <span className="inline-block overflow-hidden pt-1">
                  <span className="inline-block v1-line-2">
                    top tech companies <span className="text-[#0F1B3D] dark:text-[#F5A524]">actually ask.</span>
                  </span>
                </span>
              </h1>
            </div>
            <div data-impeccable-variant="2" style={{ display: "none" }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                Target the exact questions<br />
                top tech companies <span className="text-[#0F1B3D] dark:text-[#F5A524]">actually ask.</span>
              </h1>
            </div>
            <div data-impeccable-variant="3" style={{ display: "none" }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                <span className="v3-base-text">Target the exact questions<br />top tech companies </span>
                <span className="inline-block relative v3-accent-badge text-[#0F1B3D] dark:text-[#F5A524]">
                  actually ask.
                  <span className="v3-underline" aria-hidden="true" />
                </span>
              </h1>
            </div>
            {/* impeccable-variants-end 5a69e52b */}
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate interview guesswork. 1,446 verified LeetCode problems indexed across 200 tech companies with recency windows and frequency rankings.
          </p>
        </div>

        {/* Central Command Search Box */}
        <div className="relative max-w-2xl mx-auto text-left" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className={`relative flex items-center bg-white dark:bg-[#111C3D] border rounded-2xl shadow-sm transition-all h-14 ${
              searchFocused
                ? 'border-[#0F1B3D] dark:border-[#F5A524] ring-4 ring-[#0F1B3D]/10 dark:ring-[#F5A524]/15 shadow-md'
                : 'border-slate-200/90 dark:border-[#1E2E5C] hover:border-slate-300 dark:hover:border-slate-600'
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
                className="w-full h-full pl-3 pr-28 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-sans"
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
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono font-semibold text-[#0F1B3D] dark:text-amber-300 bg-slate-100 dark:bg-[#16244E] border border-slate-200 dark:border-[#1E2E5C] rounded-md">
                    /
                  </kbd>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#0F1B3D] transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Interactive Search Dropdown with Typeahead matches */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white dark:bg-[#132047] border border-slate-200 dark:border-[#1E2E5C] rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-[#1E2E5C]/80 animate-fade-in">
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
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#16244E] transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <CompanyLogo slug={c.slug} name={c.name} size="xs" />
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#0F1B3D] dark:group-hover:text-[#F5A524]">
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
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#16244E] transition-colors group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-xs text-slate-400">#{q.id}</span>
                            <span className="text-xs font-medium text-slate-900 dark:text-slate-100 group-hover:text-[#0F1B3D] dark:group-hover:text-[#F5A524] truncate">
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
                  <div className="p-2.5 bg-slate-50 dark:bg-[#0E1733] text-center">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-[#0F1B3D] dark:text-[#F5A524] hover:underline inline-flex items-center gap-1 cursor-pointer"
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
          <div className="flex flex-wrap items-center justify-center gap-2">
            {targetCompanies.map(c => (
              <Link
                key={c.slug}
                to={`/companies/${c.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] hover:border-[#F5A524]/60 dark:hover:border-[#F5A524]/60 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all shadow-2xs group"
              >
                <CompanyLogo slug={c.slug} name={c.name} size="xs" />
                <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#0F1B3D] dark:group-hover:text-[#F5A524] transition-colors">
                  {c.name}
                </span>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  {c.questionCount}
                </span>
              </Link>
            ))}
            <Link
              to="/companies"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-[#F5A524] hover:text-[#0F1B3D] dark:hover:text-[#F5A524] transition-colors"
            >
              <span>+192 more</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Telemetry Strip from Actual Data */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-[#1E2E5C]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
          <div className="p-3 rounded-xl bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 block uppercase tracking-wider">Catalog</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
              {totalQuestions.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">LeetCode problems</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 block uppercase tracking-wider">Companies</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
              {data.totalCompanies}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">interview loops</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 block uppercase tracking-wider">Your Solved</span>
            <span className="text-xl font-bold font-mono text-[#0F1B3D] dark:text-[#F5A524] block mt-0.5">
              {totalSolved}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{progressDisplay} complete</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] shadow-2xs">
            <span className="text-[11px] font-mono text-slate-500 block uppercase tracking-wider">Windows</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
              4 Tiers
            </span>
            <span className="text-[11px] text-slate-500 font-medium">6m · 1y · 2y · All-time</span>
          </div>
        </div>
      </section>

      {/* Main Workspace Grid: Featured Company Sets (Left) + Personal Command Deck (Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Featured Company Sets */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Featured Company Collections
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                High-frequency questions curated directly from candidate interview reports.
              </p>
            </div>
            <Link
              to="/companies"
              className="text-xs font-semibold text-[#0F1B3D] dark:text-[#F5A524] hover:underline flex items-center gap-1 shrink-0"
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
                  className="p-4 rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] hover:border-[#F5A524]/50 dark:hover:border-[#F5A524]/60 bg-white dark:bg-[#111C3D] transition-all duration-200 group flex flex-col justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-3">
                        <CompanyLogo slug={c.slug} name={c.name} size="md" className="rounded-xl shadow-2xs" />
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0F1B3D] dark:group-hover:text-[#F5A524] transition-colors truncate">
                            {c.name}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {c.questionCount} questions
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F1B3D] dark:group-hover:text-[#F5A524] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                    </div>

                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mb-3">
                      {companyTopTags[c.slug] || 'Data Structures · Algorithms'}
                    </p>
                  </div>

                  {/* Progress Strip */}
                  <div className="pt-2 border-t border-slate-100 dark:border-[#1E2E5C]/80">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                      <span className="text-slate-500 text-[11px]">
                        {solved} solved of {c.questionCount}
                      </span>
                      <span className="font-bold font-mono text-[11px] text-[#0F1B3D] dark:text-[#F5A524]">
                        {compPctDisplay}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#16244E] overflow-hidden">
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
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#F5A524]" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Preparation Status</h3>
              </div>
              <Link
                to="/progress"
                className="text-xs font-semibold text-[#0F1B3D] dark:text-[#F5A524] hover:underline flex items-center gap-0.5"
              >
                Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Solved / Total Header */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-extrabold font-mono text-2xl text-slate-900 dark:text-white">
                  {totalSolved}
                </span>
                <span className="font-bold font-mono text-sm text-[#0F1B3D] dark:text-[#F5A524]">
                  {progressDisplay}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#16244E] overflow-hidden">
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
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#1E2E5C]/80">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1733] border border-slate-200/60 dark:border-[#1E2E5C]">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#F5A524]" />
                  <span>Attempted</span>
                </div>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white block mt-0.5">
                  {totalAttempted}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0E1733] border border-slate-200/60 dark:border-[#1E2E5C]">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  <Bookmark className="w-3.5 h-3.5 text-blue-500" />
                  <span>Saved</span>
                </div>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white block mt-0.5">
                  {totalBookmarked}
                </span>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1E2E5C]/80">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Solved by Difficulty
              </span>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Easy</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {difficultyBreakdown.easy.solved} / {difficultyBreakdown.easy.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#16244E] overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(difficultyBreakdown.easy.solved / difficultyBreakdown.easy.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-amber-700 dark:text-amber-400 font-semibold">Medium</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {difficultyBreakdown.medium.solved} / {difficultyBreakdown.medium.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#16244E] overflow-hidden">
                    <div
                      className="h-full bg-[#F5A524] rounded-full"
                      style={{ width: `${(difficultyBreakdown.medium.solved / difficultyBreakdown.medium.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-rose-700 dark:text-rose-400 font-semibold">Hard</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">
                      {difficultyBreakdown.hard.solved} / {difficultyBreakdown.hard.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#16244E] overflow-hidden">
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
          <div className="p-5 rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Queue</h3>
              </div>
              <Link
                to="/problems"
                className="text-xs font-semibold text-[#0F1B3D] dark:text-[#F5A524] hover:underline"
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
                    className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#16244E] flex items-center justify-between gap-2.5 transition-colors group"
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
                        className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#0F1B3D] dark:group-hover:text-[#F5A524] truncate transition-colors"
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

      {/* Curated Problem Categories / Tracks */}
      <section className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Curated Study Tracks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Focus your preparation on standard interview domains and frequency tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/companies?category=faang"
            className="p-4 rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] hover:border-[#0F1B3D] dark:hover:border-[#F5A524] transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-[#16244E] text-[#0F1B3D] dark:text-[#38BDF8] flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#0F1B3D] dark:group-hover:text-[#F5A524] transition-colors">
                Big Tech Tier
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Google, Amazon, Meta, Microsoft, Apple, Netflix problem sets.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-[#1E2E5C] text-xs font-semibold text-[#0F1B3D] dark:text-[#F5A524] flex items-center justify-between">
              <span>Explore companies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/problems?difficulty=Medium"
            className="p-4 rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] hover:border-[#F5A524] transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <BarChart2 className="w-4 h-4 text-[#F5A524]" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#F5A524] transition-colors">
                Medium Core (799)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The backbone of L4/L5 interview loops. DP, Trees, Graphs, and Hash Tables.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-[#1E2E5C] text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center justify-between">
              <span>View Medium problems</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/companies?category=startups"
            className="p-4 rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] hover:border-[#0F1B3D] dark:hover:border-[#F5A524] transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#F5A524] transition-colors">
                High-Growth Startups
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Stripe, DoorDash, Databricks, Robinhood, Coupang question sets.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-[#1E2E5C] text-xs font-semibold text-[#0F1B3D] dark:text-[#F5A524] flex items-center justify-between">
              <span>Explore startups</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            to="/problems?q=Dynamic+Programming"
            className="p-4 rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] hover:border-emerald-500/50 transition-all shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Dynamic Programming
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Substrings, grid paths, memoization, and optimal substructure problems.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 dark:border-[#1E2E5C] text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>Search DP problems</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
