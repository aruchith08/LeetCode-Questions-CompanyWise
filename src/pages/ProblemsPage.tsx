import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ExternalLink, Search, Copy, Check, ChevronLeft, ChevronRight, X,
  BarChart2, Building2, Target, SlidersHorizontal, ChevronDown,
  ArrowUpDown, ArrowUp, ArrowDown, Clock, CheckCircle2, Bookmark
} from 'lucide-react';
import { useAllQuestions } from '../hooks/useAllQuestions';
import { useDataIndex } from '../hooks/useDataIndex';
import { useProgress } from '../hooks/useProgress';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import StatusToggle from '../components/ui/StatusToggle';
import BookmarkButton from '../components/ui/BookmarkButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CompanyLogo from '../components/ui/CompanyLogo';
import type { GlobalQuestion, QuestionStatus } from '../types';

type SortKey = 'companies' | 'id' | 'title' | 'difficulty' | 'acceptance';
type SortDir = 'asc' | 'desc';

export default function ProblemsPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { data: questions, loading: loadingQ } = useAllQuestions();
  const { data: index } = useDataIndex();
  const {
    getStatus, setQuestionStatus, markBatchStatus, toggleBookmark, isBookmarked,
    addRecentQuestion, totalSolved
  } = useProgress();

  const [search, setSearch] = useState(initialQuery);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('companies');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(30);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Company popover modal state for viewing all companies associated with a problem
  const [companyPopoverQuestion, setCompanyPopoverQuestion] = useState<GlobalQuestion | null>(null);
  const [popoverSearch, setPopoverSearch] = useState('');

  useEffect(() => {
    if (initialQuery) {
      setSearch(initialQuery);
    }
  }, [initialQuery]);

  const companyNameMap = useMemo(() => {
    if (!index) return new Map<string, string>();
    const map = new Map<string, string>();
    index.companies.forEach(c => map.set(c.slug, c.name));
    return map;
  }, [index]);

  const sortedCompanyList = useMemo(() => {
    if (!index) return [];
    return [...index.companies].sort((a, b) => a.name.localeCompare(b.name));
  }, [index]);

  const filtered = useMemo(() => {
    if (!questions) return [];
    let list = [...questions];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        item => item.title.toLowerCase().includes(q) || item.id.toString().includes(q)
      );
    }

    if (difficultyFilter !== 'all') {
      list = list.filter(item => item.difficulty === difficultyFilter);
    }

    if (companyFilter !== 'all') {
      list = list.filter(item => item.companySlugs.includes(companyFilter));
    }

    if (statusFilter !== 'all') {
      list = list.filter(item => {
        const s = getStatus(item.id);
        if (statusFilter === 'solved') return s === 'solved';
        if (statusFilter === 'attempted') return s === 'attempted';
        if (statusFilter === 'unsolved') return s === 'unsolved';
        return true;
      });
    }

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'id':
          cmp = a.id - b.id;
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'difficulty': {
          const ord = { Easy: 0, Medium: 1, Hard: 2 };
          cmp = ord[a.difficulty] - ord[b.difficulty];
          break;
        }
        case 'acceptance': {
          const aVal = parseFloat(a.acceptance) || 0;
          const bVal = parseFloat(b.acceptance) || 0;
          cmp = aVal - bVal;
          break;
        }
        case 'companies':
        default:
          cmp = (b.companySlugs?.length || 0) - (a.companySlugs?.length || 0) || (a.id - b.id);
          return sortDir === 'asc' ? -cmp : cmp;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [questions, search, difficultyFilter, statusFilter, companyFilter, sortKey, sortDir, getStatus]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const pagedItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Pagination number builder
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

  const handleCopyLink = (q: GlobalQuestion, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!q.link) return;
    navigator.clipboard.writeText(q.link);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === pagedItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pagedItems.map(item => item.id)));
    }
  };

  const handleToggleSelectRow = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSortToggle = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'title' || key === 'id' ? 'asc' : 'desc');
    }
    setPage(1);
  };

  const handleClearAllFilters = () => {
    setSearch('');
    setDifficultyFilter('all');
    setCompanyFilter('all');
    setStatusFilter('all');
    setSortKey('companies');
    setSortDir('desc');
    setPage(1);
  };

  const hasActiveFilters = search.trim() !== '' || difficultyFilter !== 'all' || companyFilter !== 'all' || statusFilter !== 'all';

  // Batch actions
  const handleBatchMark = (status: QuestionStatus) => {
    markBatchStatus(Array.from(selectedIds), status);
    setSelectedIds(new Set());
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    );
  };

  if (loadingQ) return <LoadingSpinner />;
  if (!questions) return null;

  const totalQuestionsCount = index?.totalQuestions || questions.length;
  const overallPctNum = totalQuestionsCount > 0 ? (totalSolved / totalQuestionsCount) * 100 : 0;
  const overallPctDisplay = totalSolved === 0
    ? '0%'
    : overallPctNum < 1
      ? `${overallPctNum.toFixed(2)}%`
      : overallPctNum < 10
        ? `${overallPctNum.toFixed(1)}%`
        : `${Math.round(overallPctNum)}%`;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Problems
          </h1>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1">
            {totalQuestionsCount.toLocaleString()} problems across {index?.totalCompanies || 200} companies
          </p>
        </div>

        {/* Header Progress Widget (Solved + Progress Ring) */}
        <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] px-5 py-2.5 shadow-xs flex items-center gap-6 self-start sm:self-auto shrink-0">
          {/* Solved Stat */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 dark:text-white leading-tight font-sans">
                {totalSolved}
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">solved</div>
            </div>
          </div>

          {/* Circular Progress Ring with Accurate Fractional % */}
          <div className="flex items-center gap-3 pl-6 border-l border-neutral-200 dark:border-neutral-800">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-neutral-100 dark:text-neutral-800"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 14}
                  strokeDashoffset={2 * Math.PI * 14 * (1 - (totalSolved > 0 ? Math.max(overallPctNum, 0.5) : 0) / 100)}
                  strokeLinecap="round"
                  className="text-blue-600 transition-all duration-500"
                />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 dark:text-white leading-tight font-sans">
                {overallPctDisplay}
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 font-medium">complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar (Search + 4 Styled Dropdowns) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search problems or ID..."
              className="w-full h-10 pl-10 pr-9 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs text-slate-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors shadow-2xs"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 h-10 pl-3.5 pr-8 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 shadow-2xs">
              <BarChart2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={difficultyFilter}
                onChange={e => { setDifficultyFilter(e.target.value); setPage(1); }}
                className="appearance-none bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">Difficulty: All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Company Filter */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 h-10 pl-3.5 pr-8 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={companyFilter}
                onChange={e => { setCompanyFilter(e.target.value); setPage(1); }}
                className="appearance-none bg-transparent focus:outline-none cursor-pointer pr-1 max-w-[150px] truncate"
              >
                <option value="all">Company: All ({sortedCompanyList.length})</option>
                {sortedCompanyList.map(c => (
                  <option key={c.slug} value={c.slug}>
                    {c.name} ({c.questionCount})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 h-10 pl-3.5 pr-8 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 shadow-2xs">
              <Target className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="appearance-none bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="all">Status: All</option>
                <option value="solved">Solved</option>
                <option value="attempted">Attempted</option>
                <option value="unsolved">Unsolved</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 h-10 pl-3.5 pr-8 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={`${sortKey}-${sortDir}`}
                onChange={e => {
                  const [key, dir] = e.target.value.split('-') as [SortKey, SortDir];
                  setSortKey(key);
                  setSortDir(dir);
                  setPage(1);
                }}
                className="appearance-none bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="companies-desc">Sort: Most companies</option>
                <option value="companies-asc">Sort: Least companies</option>
                <option value="id-asc">Sort: ID (Low to High)</option>
                <option value="id-desc">Sort: ID (High to Low)</option>
                <option value="title-asc">Sort: Title (A–Z)</option>
                <option value="title-desc">Sort: Title (Z–A)</option>
                <option value="difficulty-asc">Sort: Difficulty (Easy to Hard)</option>
                <option value="difficulty-desc">Sort: Difficulty (Hard to Easy)</option>
                <option value="acceptance-desc">Sort: Acceptance (High to Low)</option>
                <option value="acceptance-asc">Sort: Acceptance (Low to High)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filter Chips Strip */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-1">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                Search: &ldquo;{search}&rdquo;
                <button onClick={() => setSearch('')} className="hover:text-blue-900 dark:hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {difficultyFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                Difficulty: {difficultyFilter}
                <button onClick={() => setDifficultyFilter('all')} className="hover:text-blue-900 dark:hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {companyFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                Company: {companyNameMap.get(companyFilter) || companyFilter}
                <button onClick={() => setCompanyFilter('all')} className="hover:text-blue-900 dark:hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <button onClick={() => setStatusFilter('all')} className="hover:text-blue-900 dark:hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearAllFilters}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar (Visible when rows are selected) */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 dark:bg-[#18181b] text-white px-5 py-3 rounded-2xl shadow-xl shadow-black/25 border border-neutral-700 flex items-center gap-4 animate-fade-in">
          <span className="text-xs font-bold text-neutral-300">
            {selectedIds.size} {selectedIds.size === 1 ? 'question' : 'questions'} selected
          </span>
          <div className="h-4 w-px bg-neutral-700" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBatchMark('solved')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Mark Solved</span>
            </button>
            <button
              onClick={() => handleBatchMark('attempted')}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Mark Attempted</span>
            </button>
            <button
              onClick={() => handleBatchMark('unsolved')}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
            >
              <span>Mark Unsolved</span>
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
              title="Deselect all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Problems Table Card */}
      {pagedItems.length === 0 ? (
        <div className="py-16 text-center text-sm text-neutral-500 bg-white dark:bg-[#121214] rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-xs space-y-3">
          <p>No questions match your current filters.</p>
          {hasActiveFilters && (
            <button
              onClick={handleClearAllFilters}
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
              <thead className="sticky top-14 z-20 backdrop-blur-md bg-neutral-50/90 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-400 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  {/* Select All Checkbox */}
                  <th className="py-3.5 px-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === pagedItems.length && pagedItems.length > 0}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </th>

                  {/* Status Indicator */}
                  <th className="py-3.5 px-2 w-14 text-center">
                    STATUS
                  </th>

                  {/* ID */}
                  <th
                    className={`py-3.5 px-3 w-20 cursor-pointer select-none transition-colors group ${
                      sortKey === 'id' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSortToggle('id')}
                  >
                    <div className="flex items-center gap-1">
                      <span>ID</span>
                      {renderSortIcon('id')}
                    </div>
                  </th>

                  {/* Title */}
                  <th
                    className={`py-3.5 px-4 cursor-pointer select-none transition-colors group min-w-[240px] ${
                      sortKey === 'title' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSortToggle('title')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>PROBLEM</span>
                      {renderSortIcon('title')}
                    </div>
                  </th>

                  {/* Difficulty */}
                  <th
                    className={`py-3.5 px-3 w-28 cursor-pointer select-none transition-colors group ${
                      sortKey === 'difficulty' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSortToggle('difficulty')}
                  >
                    <div className="flex items-center gap-1">
                      <span>DIFFICULTY</span>
                      {renderSortIcon('difficulty')}
                    </div>
                  </th>

                  {/* Acceptance */}
                  <th
                    className={`py-3.5 px-4 w-36 whitespace-nowrap cursor-pointer select-none transition-colors group ${
                      sortKey === 'acceptance' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSortToggle('acceptance')}
                  >
                    <div className="flex items-center gap-1">
                      <span>ACCEPTANCE</span>
                      {renderSortIcon('acceptance')}
                    </div>
                  </th>

                  {/* Companies */}
                  <th
                    className={`py-3.5 px-4 w-56 min-w-[180px] cursor-pointer select-none transition-colors group ${
                      sortKey === 'companies' ? 'text-blue-600 dark:text-blue-400' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSortToggle('companies')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>COMPANIES</span>
                      {renderSortIcon('companies')}
                    </div>
                  </th>

                  {/* Action */}
                  <th className="py-3.5 px-4 w-44 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {pagedItems.map(q => {
                  const status = getStatus(q.id);
                  const isCopied = copiedId === q.id;
                  const isSelected = selectedIds.has(q.id);
                  const bookmarked = isBookmarked(q.id);
                  const topSlugs = q.companySlugs.slice(0, 3);
                  const remainingCount = q.companySlugs.length - topSlugs.length;

                  return (
                    <tr
                      key={q.id}
                      className={`h-14 transition-colors group ${
                        isSelected
                          ? 'bg-blue-50/70 dark:bg-blue-950/30'
                          : 'hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      {/* Select Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={(e) => handleToggleSelectRow(q.id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* 3-State Status Toggle (Solved / Attempted / Unsolved) */}
                      <td className="py-3 px-2 text-center">
                        <StatusToggle
                          status={status}
                          onSelectStatus={(newStatus) => setQuestionStatus(q.id, newStatus)}
                        />
                      </td>

                      {/* Problem ID */}
                      <td className="py-3 px-3 font-mono text-neutral-400 text-xs font-semibold">
                        #{q.id}
                      </td>

                      {/* Title with Link */}
                      <td className="py-3 px-4">
                        {q.link ? (
                          <a
                            href={q.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => addRecentQuestion(q.id)}
                            className="font-bold text-sm text-slate-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 hover:underline transition-colors block"
                          >
                            {q.title}
                          </a>
                        ) : (
                          <span className="font-bold text-sm text-neutral-700 dark:text-neutral-300">{q.title}</span>
                        )}
                      </td>

                      {/* Difficulty */}
                      <td className="py-3 px-3">
                        <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      </td>

                      {/* Acceptance Rate */}
                      <td className="py-3 px-4 font-mono font-semibold text-xs text-slate-600 dark:text-neutral-400 whitespace-nowrap">
                        {q.acceptance}
                      </td>

                      {/* Company Logos (24px) + Clickable Popover Count */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {topSlugs.map(s => (
                            <CompanyLogo
                              key={s}
                              slug={s}
                              name={companyNameMap.get(s) || s}
                              size="xs"
                              className="shadow-2xs"
                            />
                          ))}
                          {remainingCount > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompanyPopoverQuestion(q);
                                setPopoverSearch('');
                              }}
                              className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-neutral-100 hover:bg-blue-50 dark:bg-neutral-800 dark:hover:bg-blue-950/50 text-slate-700 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-blue-400 border border-neutral-200/90 dark:border-neutral-700/60 transition-colors shadow-2xs cursor-pointer"
                              title={`View all ${q.companySlugs.length} companies`}
                            >
                              +{remainingCount}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Action Column: Copy + Bookmark + Prominent Solve Button */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Copy Link Button */}
                          {q.link && (
                            <button
                              onClick={(e) => handleCopyLink(q, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                              title="Copy LeetCode link"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Bookmark Button */}
                          <BookmarkButton
                            isBookmarked={bookmarked}
                            onToggle={() => toggleBookmark(q.id)}
                          />

                          {/* Solve Button */}
                          {q.link ? (
                            <a
                              href={q.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => addRecentQuestion(q.id)}
                              className="h-8 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white inline-flex items-center gap-1.5 shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
                            >
                              <span>Solve</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-neutral-400">No link</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600 dark:text-neutral-400 px-1 pt-1">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                Showing <strong className="text-slate-900 dark:text-white">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> questions
              </span>

              {/* Rows Per Page Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Page size:</span>
                <select
                  value={pageSize}
                  onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                  className="h-7 px-2 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-lg text-xs font-bold text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
                >
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {/* Previous */}
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

              {/* Next */}
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

      {/* Company Association Modal / Popover */}
      {companyPopoverQuestion && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setCompanyPopoverQuestion(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Companies asking #{companyPopoverQuestion.id}
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  {companyPopoverQuestion.title} · {companyPopoverQuestion.companySlugs.length} verified companies
                </p>
              </div>
              <button
                onClick={() => setCompanyPopoverQuestion(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-slate-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search inside companies */}
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={popoverSearch}
                  onChange={e => setPopoverSearch(e.target.value)}
                  placeholder="Filter companies..."
                  className="w-full h-8 pl-8 pr-3 bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* List of Companies */}
            <div className="max-h-72 overflow-y-auto p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {companyPopoverQuestion.companySlugs
                .filter(slug => {
                  if (!popoverSearch.trim()) return true;
                  const name = companyNameMap.get(slug) || slug;
                  return name.toLowerCase().includes(popoverSearch.toLowerCase());
                })
                .map(slug => {
                  const name = companyNameMap.get(slug) || slug;
                  return (
                    <Link
                      key={slug}
                      to={`/companies/${slug}`}
                      onClick={() => setCompanyPopoverQuestion(null)}
                      className="flex items-center gap-2 p-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-neutral-700 bg-white dark:bg-[#121214] hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-lg border border-neutral-200/80 dark:border-neutral-800 p-0.5 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 shrink-0">
                        <CompanyLogo slug={slug} name={name} size="xs" />
                      </div>
                      <span className="font-bold text-xs text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {name}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
