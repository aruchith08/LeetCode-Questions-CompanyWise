import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ArrowUpRight, ChevronRight, ChevronLeft, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, X
} from 'lucide-react';
import { useDataIndex } from '../hooks/useDataIndex';
import { useProgress } from '../hooks/useProgress';
import { useAllQuestions } from '../hooks/useAllQuestions';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CompanyLogo from '../components/ui/CompanyLogo';

type CategoryFilter = 'all' | 'faang' | 'product' | 'startups' | 'service';
type SortBy = 'questions' | 'name' | 'solved' | 'completion';
type SortDir = 'asc' | 'desc';

// Well-defined category mappings
const FAANG_SLUGS = ['google', 'amazon', 'facebook', 'meta', 'microsoft', 'apple', 'netflix'];
const SERVICE_SLUGS = ['tcs', 'infosys', 'accenture', 'wipro', 'cognizant', 'capgemini', 'hcl', 'tech-mahindra', 'mindtree'];
const STARTUP_SLUGS = [
  'bytedance', 'uber', 'doordash', 'airbnb', 'robinhood', 'stripe', 'coupang',
  'databricks', 'roblox', 'pinterest', 'snapchat', 'lyft', 'coinbase', 'snowflake',
  'instacart', 'plaid', 'palantir', 'figma'
];

// Featured curated companies
const FEATURED_SLUGS = ['google', 'amazon', 'facebook', 'microsoft', 'apple', 'netflix', 'uber', 'bytedance'];
const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
const PAGE_SIZE = 25;

export default function CompaniesPage() {
  const { data, loading } = useDataIndex();
  const { data: allQuestions } = useAllQuestions();
  const { getStatus } = useProgress();

  const [category, setCategory] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('questions');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  // Solved counts and difficulty split per company
  const companyMetrics = useMemo(() => {
    const map = new Map<string, { solved: number; easy: number; medium: number; hard: number }>();
    if (!allQuestions) return map;

    for (const q of allQuestions) {
      const isSolved = getStatus(q.id) === 'solved';
      for (const slug of q.companySlugs) {
        const curr = map.get(slug) || { solved: 0, easy: 0, medium: 0, hard: 0 };
        if (isSolved) curr.solved++;
        if (q.difficulty === 'Easy') curr.easy++;
        else if (q.difficulty === 'Medium') curr.medium++;
        else if (q.difficulty === 'Hard') curr.hard++;
        map.set(slug, curr);
      }
    }
    return map;
  }, [allQuestions, getStatus]);

  // Featured 8 companies
  const featuredCompanies = useMemo(() => {
    if (!data) return [];
    return FEATURED_SLUGS
      .map(slug => data.companies.find(c => c.slug === slug || (slug === 'facebook' && (c.slug === 'facebook' || c.slug === 'meta'))))
      .filter(Boolean) as typeof data.companies;
  }, [data]);

  const isFiltered = category !== 'all' || selectedLetter !== 'ALL' || search.trim() !== '';

  const handleClearFilters = () => {
    setCategory('all');
    setSelectedLetter('ALL');
    setSearch('');
    setSortBy('questions');
    setSortDir('desc');
    setPage(1);
  };

  const handleSort = (key: SortBy) => {
    if (sortBy === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
    setPage(1);
  };

  const filteredCompanies = useMemo(() => {
    if (!data) return [];
    let list = [...data.companies];

    // Category filter
    if (category === 'faang') {
      list = list.filter(c => FAANG_SLUGS.includes(c.slug));
    } else if (category === 'service') {
      list = list.filter(c => SERVICE_SLUGS.includes(c.slug));
    } else if (category === 'startups') {
      list = list.filter(c => STARTUP_SLUGS.includes(c.slug));
    } else if (category === 'product') {
      list = list.filter(c => !SERVICE_SLUGS.includes(c.slug));
    }

    // Alphabet jump bar filter
    if (selectedLetter !== 'ALL') {
      list = list.filter(c => c.name.toUpperCase().startsWith(selectedLetter));
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
    }

    // Sorting
    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === 'solved') {
        const aSolved = companyMetrics.get(a.slug)?.solved || 0;
        const bSolved = companyMetrics.get(b.slug)?.solved || 0;
        cmp = aSolved - bSolved;
      } else if (sortBy === 'completion') {
        const aSolved = companyMetrics.get(a.slug)?.solved || 0;
        const bSolved = companyMetrics.get(b.slug)?.solved || 0;
        const aPct = a.questionCount > 0 ? aSolved / a.questionCount : 0;
        const bPct = b.questionCount > 0 ? bSolved / b.questionCount : 0;
        cmp = aPct - bPct;
      } else {
        cmp = a.questionCount - b.questionCount;
      }

      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [data, category, selectedLetter, search, sortBy, sortDir, companyMetrics]);

  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);
  const pagedCompanies = filteredCompanies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Pagination items builder (e.g. 1, 2, 3, 4, 5, '...', 8)
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (page >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', page - 1, page, page + 1, '...', totalPages];
  }, [page, totalPages]);

  // Formats percentage accurately (e.g. 0.23% for 2 / 865)
  const formatPct = (solved: number, total: number) => {
    if (solved === 0 || total === 0) return '0%';
    const pct = (solved / total) * 100;
    if (pct < 1) return `${pct.toFixed(2)}%`;
    if (pct < 10) return `${pct.toFixed(1)}%`;
    return `${Math.round(pct)}%`;
  };

  const renderSortIcon = (key: SortBy) => {
    if (sortBy !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    );
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* Clean, Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Companies
          </h1>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-2xl">
            Curated LeetCode problem sets for {data.totalCompanies} employers with verified interview frequency and difficulty distributions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-bold">
            {data.totalCompanies} Companies
          </div>
          <div className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 text-xs font-bold">
            {data.totalQuestions.toLocaleString()} Problems
          </div>
        </div>
      </div>

      {/* Featured Companies Section (4 cards per row on desktop, 2 spacious rows) */}
      <section className="space-y-3.5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Featured Companies
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            High-frequency problem sets curated from top tech and engineering employers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {featuredCompanies.map(c => {
            const m = companyMetrics.get(c.slug) || { solved: 0, easy: 0, medium: 0, hard: 0 };
            const pctDisplay = formatPct(m.solved, c.questionCount);
            const pctNum = c.questionCount > 0 ? (m.solved / c.questionCount) * 100 : 0;

            return (
              <Link
                key={c.slug}
                to={`/companies/${c.slug}`}
                className="p-4 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-neutral-700 bg-white dark:bg-[#121214] transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <CompanyLogo slug={c.slug} name={c.name} size="md" className="rounded-xl shadow-2xs" />
                    <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate block transition-colors">
                      {c.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium block mt-0.5">
                      {c.questionCount} questions
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-600 dark:text-neutral-400 font-medium">Progress</span>
                    <span className="font-bold text-slate-800 dark:text-neutral-200">{pctDisplay}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(pctNum, m.solved > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Filter Controls Row 1: Category Tabs + Search & Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `All (${data.totalCompanies})` },
            { id: 'faang', label: 'Big Tech' },
            { id: 'product', label: 'Product' },
            { id: 'startups', label: 'Startups' },
            { id: 'service', label: 'Service' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setCategory(tab.id as CategoryFilter); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs ${
                category === tab.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search companies..."
              className="w-full h-9 pl-9 pr-8 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors shadow-2xs"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={e => {
                const [by, dir] = e.target.value.split('-') as [SortBy, SortDir];
                setSortBy(by);
                setSortDir(dir);
                setPage(1);
              }}
              className="appearance-none h-9 pl-3 pr-8 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="questions-desc">Sort: Questions (High to Low)</option>
              <option value="questions-asc">Sort: Questions (Low to High)</option>
              <option value="name-asc">Sort: Name (A – Z)</option>
              <option value="name-desc">Sort: Name (Z – A)</option>
              <option value="solved-desc">Sort: Solved (Most)</option>
              <option value="completion-desc">Sort: Completion %</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Controls Row 2: Alphabet Jump Bar + Clear Filters Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1.5">
            JUMP TO:
          </span>
          {ALPHABET.map(letter => {
            const isActive = selectedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => { setSelectedLetter(letter); setPage(1); }}
                className={`h-7 min-w-[28px] px-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center justify-center ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-slate-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {letter === 'ALL' ? 'All' : letter}
              </button>
            );
          })}
        </div>

        {/* Clear Filters Action Button */}
        {isFiltered && (
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors shrink-0 self-start sm:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Companies Table Card */}
      {filteredCompanies.length === 0 ? (
        <div className="py-16 text-center text-sm text-neutral-500 bg-white dark:bg-[#121214] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 space-y-3">
          <p>No companies found matching your filters.</p>
          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] shadow-xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 text-left text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                  {/* Company Column */}
                  <th
                    className={`py-3.5 px-5 cursor-pointer select-none transition-colors group ${
                      sortBy === 'name' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>COMPANY</span>
                      {renderSortIcon('name')}
                    </div>
                  </th>

                  {/* Questions Column */}
                  <th
                    className={`py-3.5 px-5 w-36 cursor-pointer select-none transition-colors group ${
                      sortBy === 'questions' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSort('questions')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>QUESTIONS</span>
                      {renderSortIcon('questions')}
                    </div>
                  </th>

                  {/* Difficulty Column */}
                  <th className="py-3.5 px-5 w-72">
                    <div className="flex items-center gap-2">
                      <span>DIFFICULTY</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium normal-case">
                        (Easy · Med · Hard)
                      </span>
                    </div>
                  </th>

                  {/* Progress Column */}
                  <th
                    className={`py-3.5 px-5 w-64 cursor-pointer select-none transition-colors group ${
                      sortBy === 'solved' || sortBy === 'completion' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSort('solved')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>YOUR PROGRESS</span>
                      {renderSortIcon(sortBy === 'completion' ? 'completion' : 'solved')}
                    </div>
                  </th>

                  {/* Action Column */}
                  <th className="py-3.5 px-4 w-12 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {pagedCompanies.map(c => {
                  const m = companyMetrics.get(c.slug) || { solved: 0, easy: 0, medium: 0, hard: 0 };
                  const total = m.easy + m.medium + m.hard || c.questionCount || 1;
                  const easyPct = Math.round((m.easy / total) * 100);
                  const medPct = Math.round((m.medium / total) * 100);
                  const hardPct = Math.max(0, 100 - easyPct - medPct);

                  const pctNum = c.questionCount > 0 ? (m.solved / c.questionCount) * 100 : 0;
                  const pctDisplay = formatPct(m.solved, c.questionCount);

                  return (
                    <tr
                      key={c.slug}
                      className="h-16 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                    >
                      {/* Company Name & Logo */}
                      <td className="py-3.5 px-5">
                        <Link to={`/companies/${c.slug}`} className="flex items-center gap-3.5">
                          <CompanyLogo slug={c.slug} name={c.name} size="sm" className="rounded-lg shadow-2xs" />
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block truncate">
                              {c.name}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Question Count */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-baseline gap-1">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white font-sans">
                            {c.questionCount}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">questions</span>
                        </div>
                      </td>

                      {/* Difficulty Split (Stacked Multi-Color Bar + Percentages) */}
                      <td className="py-3.5 px-5">
                        <div className="w-56 sm:w-60 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 flex overflow-hidden gap-0.5">
                          <div
                            className="bg-emerald-500 transition-all duration-300"
                            style={{ width: `${(m.easy / total) * 100}%` }}
                            title={`Easy: ${m.easy} (${easyPct}%)`}
                          />
                          <div
                            className="bg-amber-500 transition-all duration-300"
                            style={{ width: `${(m.medium / total) * 100}%` }}
                            title={`Medium: ${m.medium} (${medPct}%)`}
                          />
                          <div
                            className="bg-rose-500 transition-all duration-300"
                            style={{ width: `${(m.hard / total) * 100}%` }}
                            title={`Hard: ${m.hard} (${hardPct}%)`}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold mt-1.5 text-slate-600 dark:text-neutral-300">
                          <span className="text-emerald-600 dark:text-emerald-400">{easyPct}% E</span>
                          <span className="text-neutral-300 dark:text-neutral-700">·</span>
                          <span className="text-amber-600 dark:text-amber-400">{medPct}% M</span>
                          <span className="text-neutral-300 dark:text-neutral-700">·</span>
                          <span className="text-rose-600 dark:text-rose-400">{hardPct}% H</span>
                        </div>
                      </td>

                      {/* Your Progress */}
                      <td className="py-3.5 px-5">
                        <div className="w-48 sm:w-52">
                          <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-1.5">
                            <div
                              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(pctNum, m.solved > 0 ? 4 : 0)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-slate-700 dark:text-neutral-300 font-semibold font-sans">
                              {m.solved} / {c.questionCount}
                            </span>
                            <span className="font-bold text-blue-600 dark:text-blue-400 font-sans">
                              {pctDisplay}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Row Action Arrow */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/companies/${c.slug}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:translate-x-0.5 transition-all"
                          aria-label={`Open ${c.name}`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-neutral-400 px-1 pt-1">
            <span className="font-medium">
              Showing <strong className="text-slate-900 dark:text-white">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredCompanies.length)}</strong> of <strong className="text-slate-900 dark:text-white">{filteredCompanies.length}</strong> companies
            </span>

            {/* Numeric Page Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 px-2.5 rounded-xl border border-neutral-200/90 dark:border-neutral-800 flex items-center gap-1 font-semibold disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-slate-700 dark:text-neutral-300 shadow-2xs"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Number Buttons */}
              {paginationItems.map((item, idx) => {
                if (item === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-neutral-400 font-bold">
                      ...
                    </span>
                  );
                }
                const pageNum = item as number;
                const isActive = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-2xs ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'border border-neutral-200/90 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-white dark:bg-[#121214]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page Button */}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="h-8 px-2.5 rounded-xl border border-neutral-200/90 dark:border-neutral-800 flex items-center gap-1 font-semibold disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-slate-700 dark:text-neutral-300 shadow-2xs"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
