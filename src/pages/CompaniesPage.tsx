import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight, X, ChevronDown
} from 'lucide-react';
import { useDataIndex } from '../hooks/useDataIndex';
import { useAllQuestions } from '../hooks/useAllQuestions';
import { useProgress } from '../hooks/useProgress';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CompanyLogo from '../components/ui/CompanyLogo';

type SortBy = 'name' | 'questions' | 'solved' | 'completion';
type SortDir = 'asc' | 'desc';
type CategoryFilter = 'all' | 'faang' | 'product' | 'startups' | 'service';

const PAGE_SIZE = 20;
const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

// Categorization mapping
const CATEGORY_MAP: Record<CategoryFilter, string[]> = {
  all: [],
  faang: ['google', 'amazon', 'meta', 'facebook', 'microsoft', 'apple', 'netflix'],
  product: [
    'adobe', 'airbnb', 'atlassian', 'bytedance', 'cisco', 'dropbox',
    'ebay', 'intuit', 'linkedin', 'lyft', 'oracle', 'paypal',
    'pinterest', 'salesforce', 'snapchat', 'spotify', 'square',
    'stripe', 'twitter', 'uber', 'zoom'
  ],
  startups: [
    'affirm', 'airtable', 'asana', 'brex', 'chime', 'coinbase',
    'coupang', 'databricks', 'doordash', 'figma', 'instacart',
    'notion', 'opendoor', 'plaid', 'robinhood', 'roblox', 'snowflake'
  ],
  service: [
    'accenture', 'capgemini', 'cognizant', 'deloitte', 'infosys',
    'tcs', 'wipro', 'hcl', 'tech-mahindra'
  ],
};

export default function CompaniesPage() {
  const { data, loading: loadingIndex } = useDataIndex();
  const { data: allQuestions } = useAllQuestions();
  const { getStatus } = useProgress();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [category, setCategory] = useState<CategoryFilter>(
    (searchParams.get('category') as CategoryFilter) || 'all'
  );
  const [sortBy, setSortBy] = useState<SortBy>('questions');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  // Solved counts and difficulty breakdown per company
  const companyMetrics = useMemo(() => {
    const map = new Map<string, { solved: number; easy: number; medium: number; hard: number }>();
    if (!allQuestions) return map;

    for (const q of allQuestions) {
      const isSolved = getStatus(q.id) === 'solved';
      for (const slug of q.companySlugs) {
        if (!map.has(slug)) {
          map.set(slug, { solved: 0, easy: 0, medium: 0, hard: 0 });
        }
        const m = map.get(slug)!;
        if (isSolved) m.solved++;
        if (q.difficulty === 'Easy') m.easy++;
        else if (q.difficulty === 'Medium') m.medium++;
        else if (q.difficulty === 'Hard') m.hard++;
      }
    }
    return map;
  }, [allQuestions, getStatus]);

  // Filter & sort companies
  const filteredCompanies = useMemo(() => {
    if (!data) return [];
    let list = [...data.companies];

    // Category filter
    if (category !== 'all') {
      const allowed = new Set(CATEGORY_MAP[category]);
      list = list.filter(c => allowed.has(c.slug));
    }

    // Alphabet filter
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
      const mA = companyMetrics.get(a.slug) || { solved: 0, easy: 0, medium: 0, hard: 0 };
      const mB = companyMetrics.get(b.slug) || { solved: 0, easy: 0, medium: 0, hard: 0 };

      switch (sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'questions':
          cmp = a.questionCount - b.questionCount;
          break;
        case 'solved':
          cmp = mA.solved - mB.solved;
          break;
        case 'completion': {
          const pctA = a.questionCount > 0 ? mA.solved / a.questionCount : 0;
          const pctB = b.questionCount > 0 ? mB.solved / b.questionCount : 0;
          cmp = pctA - pctB;
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [data, category, selectedLetter, search, sortBy, sortDir, companyMetrics]);

  const totalPages = Math.ceil(filteredCompanies.length / PAGE_SIZE);
  const pagedCompanies = filteredCompanies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortBy) => {
    if (sortBy === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const isFiltered = search !== '' || selectedLetter !== 'ALL' || category !== 'all';

  const handleClearFilters = () => {
    setSearch('');
    setSelectedLetter('ALL');
    setCategory('all');
    setSearchParams({});
    setPage(1);
  };

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

  const formatPct = (solved: number, total: number) => {
    if (solved === 0 || total === 0) return '0%';
    const pct = (solved / total) * 100;
    if (pct < 1) return `${pct.toFixed(2)}%`;
    if (pct < 10) return `${pct.toFixed(1)}%`;
    return `${Math.round(pct)}%`;
  };

  const renderSortIcon = (key: SortBy) => {
    if (sortBy !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757]" />
    );
  };

  if (loadingIndex) return <LoadingSpinner />;
  if (!data) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#43433F]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#FAF9F5]">
            Companies
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#A8A69C] mt-1 max-w-2xl">
            Curated LeetCode problem sets for {data.totalCompanies} employers with verified interview frequency and difficulty distributions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 font-mono text-xs font-semibold">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] text-[#0F1B3D] dark:text-[#E0B14F]">
            {data.totalCompanies} Companies
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] text-slate-700 dark:text-[#FAF9F5]">
            {data.totalQuestions.toLocaleString()} Problems
          </span>
        </div>
      </div>

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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                category === tab.id
                  ? 'bg-[#0F1B3D] dark:bg-white text-white dark:text-[#0F1B3D] shadow-xs'
                  : 'bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D]'
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search companies..."
              className="w-full h-9 pl-9 pr-8 bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] rounded-xl text-xs text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:border-[#0F1B3D] dark:focus:border-[#D97757] transition-colors shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
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
              className="appearance-none h-9 pl-3 pr-8 bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] rounded-xl text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] focus:outline-none focus:border-[#0F1B3D] dark:focus:border-[#D97757] cursor-pointer shadow-2xs"
            >
              <option value="questions-desc">Sort: Questions (High to Low)</option>
              <option value="questions-asc">Sort: Questions (Low to High)</option>
              <option value="name-asc">Sort: Name (A – Z)</option>
              <option value="name-desc">Sort: Name (Z – A)</option>
              <option value="solved-desc">Sort: Solved (Most)</option>
              <option value="completion-desc">Sort: Completion %</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Controls Row 2: Alphabet Jump Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] px-4 py-2 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1.5">
            JUMP TO:
          </span>
          {ALPHABET.map(letter => {
            const isActive = selectedLetter === letter;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => { setSelectedLetter(letter); setPage(1); }}
                className={`h-7 min-w-[28px] px-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-[#0F1B3D] dark:bg-white text-white dark:text-[#0F1B3D] shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
                }`}
              >
                {letter === 'ALL' ? 'All' : letter}
              </button>
            );
          })}
        </div>

        {/* Clear Filters Action */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-[#EE8F78] bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Companies Table Card */}
      {filteredCompanies.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500 bg-white dark:bg-[#30302E] rounded-2xl border border-slate-200/90 dark:border-[#43433F] space-y-3">
          <p>No companies found matching your filters.</p>
          {isFiltered && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757] bg-slate-100 dark:bg-[#1F1E1D] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] shadow-xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#43433F] bg-slate-50/80 dark:bg-[#262624]/80 text-left text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  {/* Company Column */}
                  <th
                    className={`py-3.5 px-5 cursor-pointer select-none transition-colors group ${
                      sortBy === 'name' ? 'text-[#0F1B3D] dark:text-[#D97757]' : 'hover:text-slate-900 dark:hover:text-white'
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
                      sortBy === 'questions' ? 'text-[#0F1B3D] dark:text-[#D97757]' : 'hover:text-slate-900 dark:hover:text-white'
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
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium normal-case font-mono">
                        (Easy · Med · Hard)
                      </span>
                    </div>
                  </th>

                  {/* Progress Column */}
                  <th
                    className={`py-3.5 px-5 w-64 cursor-pointer select-none transition-colors group ${
                      sortBy === 'solved' || sortBy === 'completion' ? 'text-[#0F1B3D] dark:text-[#D97757]' : 'hover:text-slate-900 dark:hover:text-white'
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
              <tbody className="divide-y divide-slate-100 dark:divide-[#43433F]/60">
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
                      className="h-16 hover:bg-slate-50/80 dark:hover:bg-[#1F1E1D]/60 transition-colors group cursor-pointer"
                    >
                      {/* Company Name & Logo */}
                      <td className="py-3.5 px-5">
                        <Link to={`/companies/${c.slug}`} className="flex items-center gap-3.5">
                          <CompanyLogo slug={c.slug} name={c.name} size="sm" className="rounded-lg shadow-2xs" />
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-slate-900 dark:text-[#FAF9F5] block truncate">
                              {c.name}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Question Count */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-baseline gap-1 font-mono">
                          <span className="font-bold text-sm text-slate-900 dark:text-[#FAF9F5]">
                            {c.questionCount}
                          </span>
                          <span className="text-xs text-slate-500 font-normal">questions</span>
                        </div>
                      </td>

                      {/* Difficulty Split (Stacked Multi-Color Bar + Percentages) */}
                      <td className="py-3.5 px-5">
                        <div className="w-56 sm:w-60 h-2 rounded-full bg-slate-100 dark:bg-[#1F1E1D] flex overflow-hidden gap-0.5">
                          <div
                            className="bg-emerald-500 transition-all duration-300"
                            style={{ width: `${(m.easy / total) * 100}%` }}
                            title={`Easy: ${m.easy} (${easyPct}%)`}
                          />
                          <div
                            className="bg-[#F5A524] transition-all duration-300"
                            style={{ width: `${(m.medium / total) * 100}%` }}
                            title={`Medium: ${m.medium} (${medPct}%)`}
                          />
                          <div
                            className="bg-rose-500 transition-all duration-300"
                            style={{ width: `${(m.hard / total) * 100}%` }}
                            title={`Hard: ${m.hard} (${hardPct}%)`}
                          />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold mt-1.5 font-mono">
                          <span className="text-emerald-600 dark:text-[#8FBF78]">{easyPct}% E</span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="text-[#F5A524]">{medPct}% M</span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="text-rose-600 dark:text-[#EE8F78]">{hardPct}% H</span>
                        </div>
                      </td>

                      {/* Your Progress */}
                      <td className="py-3.5 px-5">
                        <div className="w-48 sm:w-52">
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#1F1E1D] overflow-hidden mb-1.5">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-[#F5A524] rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(pctNum, m.solved > 0 ? 4 : 0)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono font-medium">
                            <span className="text-slate-700 dark:text-[#FAF9F5]">
                              {m.solved} / {c.questionCount}
                            </span>
                            <span className="font-bold text-[#0F1B3D] dark:text-[#D97757]">
                              {pctDisplay}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Row Action Arrow */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to={`/companies/${c.slug}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757] group-hover:bg-slate-100 dark:group-hover:bg-[#1F1E1D] group-hover:translate-x-0.5 transition-all"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-[#A8A69C] px-1 pt-1">
            <span className="font-medium">
              Showing <strong className="text-slate-900 dark:text-[#FAF9F5]">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredCompanies.length)}</strong> of <strong className="text-slate-900 dark:text-[#FAF9F5]">{filteredCompanies.length}</strong> companies
            </span>

            {/* Numeric Page Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 px-2.5 rounded-xl border border-slate-200/90 dark:border-[#43433F] flex items-center gap-1 font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-[#1F1E1D] transition-colors text-slate-700 dark:text-[#FAF9F5] shadow-2xs cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {paginationItems.map((item, idx) => {
                if (item === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold">
                      ...
                    </span>
                  );
                }
                const pageNum = item as number;
                const isCurrent = pageNum === page;
                return (
                  <button
                    key={`page-${pageNum}`}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-xl font-mono text-xs font-bold transition-colors flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'bg-[#0F1B3D] dark:bg-white text-white dark:text-[#0F1B3D] shadow-xs'
                        : 'border border-slate-200/90 dark:border-[#43433F] text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="h-8 px-2.5 rounded-xl border border-slate-200/90 dark:border-[#43433F] flex items-center gap-1 font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-[#1F1E1D] transition-colors text-slate-700 dark:text-[#FAF9F5] shadow-2xs cursor-pointer"
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
