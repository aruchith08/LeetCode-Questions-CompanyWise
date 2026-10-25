import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink,
  ChevronLeft, ChevronRight, Check, X,
  Building2, BarChart2, Copy, Clock, ChevronDown
} from 'lucide-react';
import { useAllQuestions } from '../hooks/useAllQuestions';
import { useDataIndex } from '../hooks/useDataIndex';
import { useProgress } from '../hooks/useProgress';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import StatusToggle from '../components/ui/StatusToggle';
import BookmarkButton from '../components/ui/BookmarkButton';
import CompanyLogo from '../components/ui/CompanyLogo';
import type { GlobalQuestion, QuestionStatus } from '../types';

type SortKey = 'id' | 'title' | 'difficulty' | 'acceptance' | 'companies';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 30;

export default function ProblemsPage() {
  const { data: questions, loading: loadingQ } = useAllQuestions();
  const { data: index } = useDataIndex();
  const {
    totalSolved, getStatus, toggleSolved, toggleBookmark,
    isBookmarked, setQuestionStatus, addRecentQuestion,
  } = useProgress();

  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from query params
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [difficultyFilter, setDifficultyFilter] = useState(searchParams.get('difficulty') || 'all');
  const [companyFilter, setCompanyFilter] = useState(searchParams.get('company') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Batch selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Sync state with URL params
  useEffect(() => {
    const qParam = searchParams.get('q');
    if (qParam !== null && qParam !== search) setSearch(qParam);

    const diffParam = searchParams.get('difficulty');
    if (diffParam !== null && diffParam !== difficultyFilter) setDifficultyFilter(diffParam);

    const compParam = searchParams.get('company');
    if (compParam !== null && compParam !== companyFilter) setCompanyFilter(compParam);

    const statParam = searchParams.get('status');
    if (statParam !== null && statParam !== statusFilter) setStatusFilter(statParam);
  }, [searchParams]);

  // Company names map
  const companyNameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (index?.companies) {
      for (const c of index.companies) {
        map.set(c.slug, c.name);
      }
    }
    return map;
  }, [index]);

  // Sorted companies list for dropdown
  const sortedCompanyList = useMemo(() => {
    if (!index?.companies) return [];
    return [...index.companies].sort((a, b) => b.questionCount - a.questionCount);
  }, [index]);

  // Filter & sort questions
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    let list = [...questions];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        item => item.title.toLowerCase().includes(q) || item.id.toString() === q
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      list = list.filter(item => item.difficulty === difficultyFilter);
    }

    // Company filter
    if (companyFilter !== 'all') {
      list = list.filter(item => item.companySlugs.includes(companyFilter));
    }

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter(item => getStatus(item.id) === statusFilter);
    }

    // Sorting
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'id': cmp = a.id - b.id; break;
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'difficulty': {
          const order = { Easy: 1, Medium: 2, Hard: 3 };
          cmp = (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
          break;
        }
        case 'acceptance': {
          const aVal = parseFloat(a.acceptance) || 0;
          const bVal = parseFloat(b.acceptance) || 0;
          cmp = aVal - bVal;
          break;
        }
        case 'companies':
          cmp = a.companyCount - b.companyCount;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [questions, search, difficultyFilter, companyFilter, statusFilter, sortKey, sortDir, getStatus]);

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);
  const pagedItems = filteredQuestions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSortToggle = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const hasActiveFilters = search !== '' || difficultyFilter !== 'all' || companyFilter !== 'all' || statusFilter !== 'all';

  const handleClearAllFilters = () => {
    setSearch('');
    setDifficultyFilter('all');
    setCompanyFilter('all');
    setStatusFilter('all');
    setSearchParams({});
    setPage(1);
  };

  // Batch toggle
  const handleToggleSelectRow = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === pagedItems.length && pagedItems.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pagedItems.map(q => q.id)));
    }
  };

  const handleBatchMark = (status: QuestionStatus) => {
    selectedIds.forEach(id => {
      setQuestionStatus(id, status);
    });
    setSelectedIds(new Set());
  };

  const handleCopy = (q: GlobalQuestion, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!q.link) return;
    navigator.clipboard.writeText(q.link);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#F5A524]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#F5A524]" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-[#1E2E5C]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Problems
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {totalQuestionsCount.toLocaleString()} problems across {index?.totalCompanies || 200} companies
          </p>
        </div>

        {/* Header Progress Widget */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] px-5 py-2.5 shadow-xs flex items-center gap-6 self-start sm:self-auto shrink-0 font-sans">
          {/* Solved Stat */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 dark:text-white leading-tight font-mono">
                {totalSolved}
              </div>
              <div className="text-xs text-slate-500 font-medium">solved</div>
            </div>
          </div>

          {/* Progress % */}
          <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-[#1E2E5C]">
            <div>
              <div className="font-extrabold text-base text-[#0F1B3D] dark:text-[#F5A524] leading-tight font-mono">
                {overallPctDisplay}
              </div>
              <div className="text-xs text-slate-500 font-medium">complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search problems or ID..."
              className="w-full h-10 pl-10 pr-9 bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0F1B3D] dark:focus:border-[#F5A524] transition-colors shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 h-10 pl-3.5 pr-8 bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
              <BarChart2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Company Filter */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 h-10 pl-3.5 pr-8 bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 h-10 pl-3.5 pr-8 bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
              <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <div className="flex items-center gap-2 h-10 pl-3.5 pr-8 bg-white dark:bg-[#111C3D] border border-slate-200/90 dark:border-[#1E2E5C] rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={`${sortKey}-${sortDir}`}
                onChange={e => {
                  const [k, d] = e.target.value.split('-') as [SortKey, SortDir];
                  setSortKey(k);
                  setSortDir(d);
                  setPage(1);
                }}
                className="appearance-none bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="id-asc">Sort: ID (Low to High)</option>
                <option value="id-desc">Sort: ID (High to Low)</option>
                <option value="companies-desc">Sort: Most Companies</option>
                <option value="title-asc">Sort: Title (A–Z)</option>
                <option value="difficulty-asc">Sort: Difficulty (Easy first)</option>
                <option value="difficulty-desc">Sort: Difficulty (Hard first)</option>
                <option value="acceptance-desc">Sort: Highest Acceptance</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-mono">Filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#16244E] text-[#0F1B3D] dark:text-[#F5A524] border border-slate-200 dark:border-[#1E2E5C]">
                Query: &ldquo;{search}&rdquo;
                <button type="button" onClick={() => setSearch('')} className="hover:text-rose-600 dark:hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {difficultyFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#16244E] text-[#0F1B3D] dark:text-[#F5A524] border border-slate-200 dark:border-[#1E2E5C]">
                Difficulty: {difficultyFilter}
                <button type="button" onClick={() => setDifficultyFilter('all')} className="hover:text-rose-600 dark:hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {companyFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#16244E] text-[#0F1B3D] dark:text-[#F5A524] border border-slate-200 dark:border-[#1E2E5C]">
                Company: {companyNameMap.get(companyFilter) || companyFilter}
                <button type="button" onClick={() => setCompanyFilter('all')} className="hover:text-rose-600 dark:hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#16244E] text-[#0F1B3D] dark:text-[#F5A524] border border-slate-200 dark:border-[#1E2E5C]">
                Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <button type="button" onClick={() => setStatusFilter('all')} className="hover:text-rose-600 dark:hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0F1B3D] dark:bg-[#132047] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 dark:border-[#1E2E5C] flex items-center gap-4 animate-fade-in">
          <span className="text-xs font-bold text-slate-300 font-mono">
            {selectedIds.size} {selectedIds.size === 1 ? 'question' : 'questions'} selected
          </span>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBatchMark('solved')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Mark Solved</span>
            </button>
            <button
              type="button"
              onClick={() => handleBatchMark('attempted')}
              className="px-3 py-1.5 rounded-xl bg-[#F5A524] hover:bg-amber-600 text-[#0F1B3D] text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Mark Attempted</span>
            </button>
            <button
              type="button"
              onClick={() => handleBatchMark('unsolved')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Mark Unsolved</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Deselect all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Problems Table Card */}
      {pagedItems.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500 bg-white dark:bg-[#111C3D] rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] shadow-xs space-y-3">
          <p>No questions match your current filters.</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#0F1B3D] dark:text-[#F5A524] bg-slate-100 dark:bg-[#16244E] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-[#1E2E5C] bg-white dark:bg-[#111C3D] shadow-xs">
            <table className="w-full text-xs">
              <thead className="bg-slate-50/80 dark:bg-[#0E1733]/80 border-b border-slate-200 dark:border-[#1E2E5C] text-left text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  {/* Select All Checkbox */}
                  <th className="py-3.5 px-3 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === pagedItems.length && pagedItems.length > 0}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#0F1B3D] dark:text-[#F5A524] focus:ring-0 cursor-pointer"
                      aria-label="Select all rows on this page"
                    />
                  </th>

                  {/* Status Indicator */}
                  <th className="py-3.5 px-2 w-14 text-center">STATUS</th>

                  {/* ID */}
                  <th
                    className={`py-3.5 px-3 w-20 cursor-pointer select-none transition-colors group ${
                      sortKey === 'id' ? 'text-[#0F1B3D] dark:text-[#F5A524]' : 'hover:text-slate-900 dark:hover:text-white'
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
                      sortKey === 'title' ? 'text-[#0F1B3D] dark:text-[#F5A524]' : 'hover:text-slate-900 dark:hover:text-white'
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
                      sortKey === 'difficulty' ? 'text-[#0F1B3D] dark:text-[#F5A524]' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSortToggle('difficulty')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>DIFFICULTY</span>
                      {renderSortIcon('difficulty')}
                    </div>
                  </th>

                  {/* Top Companies Asking */}
                  <th
                    className={`py-3.5 px-4 cursor-pointer select-none transition-colors group min-w-[180px] ${
                      sortKey === 'companies' ? 'text-[#0F1B3D] dark:text-[#F5A524]' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSortToggle('companies')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>COMPANIES</span>
                      {renderSortIcon('companies')}
                    </div>
                  </th>

                  {/* Acceptance */}
                  <th
                    className={`py-3.5 px-4 w-28 cursor-pointer select-none transition-colors group ${
                      sortKey === 'acceptance' ? 'text-[#0F1B3D] dark:text-[#F5A524]' : 'hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => handleSortToggle('acceptance')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>ACCEPTANCE</span>
                      {renderSortIcon('acceptance')}
                    </div>
                  </th>

                  {/* Actions Column */}
                  <th className="py-3.5 px-4 w-32 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E2E5C]/60">
                {pagedItems.map(q => {
                  const status = getStatus(q.id);
                  const isSelected = selectedIds.has(q.id);
                  const bookmarked = isBookmarked(q.id);
                  const isCopied = copiedId === q.id;

                  return (
                    <tr
                      key={q.id}
                      className={`min-h-[48px] hover:bg-slate-50/80 dark:hover:bg-[#16244E]/60 transition-colors group ${
                        isSelected ? 'bg-amber-500/10 dark:bg-[#F5A524]/15' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(q.id)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-[#0F1B3D] dark:text-[#F5A524] focus:ring-0 cursor-pointer"
                          aria-label={`Select row for problem #${q.id}`}
                        />
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-2 text-center">
                        <StatusToggle
                          status={status}
                          onSelectStatus={(newStatus) => setQuestionStatus(q.id, newStatus)}
                          onToggleSolved={() => toggleSolved(q.id)}
                        />
                      </td>

                      {/* ID */}
                      <td className="py-3 px-3 font-mono text-slate-400 text-xs">
                        #{q.id}
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4">
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => addRecentQuestion(q.id)}
                          className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#0F1B3D] dark:group-hover:text-[#F5A524] transition-colors inline-block"
                        >
                          {q.title}
                        </a>
                      </td>

                      {/* Difficulty Badge */}
                      <td className="py-3 px-3">
                        <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      </td>

                      {/* Companies asking */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center -space-x-1.5 overflow-hidden">
                            {q.companySlugs.slice(0, 3).map(slug => (
                              <CompanyLogo
                                key={slug}
                                slug={slug}
                                size="xs"
                                className="border border-white dark:border-[#111C3D] rounded-md shadow-2xs"
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[11px] text-slate-500 font-medium">
                            {q.companyCount} {q.companyCount === 1 ? 'co' : 'cos'}
                          </span>
                        </div>
                      </td>

                      {/* Acceptance */}
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {q.acceptance}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleCopy(q, e)}
                            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#16244E] opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Copy problem link"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                            <BookmarkButton
                              isBookmarked={bookmarked}
                              onToggle={() => toggleBookmark(q.id)}
                            />
                          </div>

                          <a
                            href={q.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => addRecentQuestion(q.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-white hover:bg-[#0F1B3D] dark:hover:bg-white dark:hover:text-[#0F1B3D] rounded-lg transition-colors group-hover:bg-slate-100 dark:group-hover:bg-[#16244E] group-hover:hover:bg-[#0F1B3D] dark:group-hover:hover:bg-white group-hover:hover:text-white dark:group-hover:hover:text-[#0F1B3D]"
                          >
                            Solve <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 px-1 pt-1 font-mono">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredQuestions.length)} of {filteredQuestions.length} questions
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 px-2.5 rounded-xl border border-slate-200/90 dark:border-[#1E2E5C] flex items-center gap-1 font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-[#16244E] transition-colors text-slate-700 dark:text-slate-300 shadow-2xs cursor-pointer"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <span className="px-2 font-bold font-sans">
                Page {page} of {totalPages || 1}
              </span>

              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="h-8 px-2.5 rounded-xl border border-slate-200/90 dark:border-[#1E2E5C] flex items-center gap-1 font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-[#16244E] transition-colors text-slate-700 dark:text-slate-300 shadow-2xs cursor-pointer"
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
