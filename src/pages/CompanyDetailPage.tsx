import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Search, Star, ExternalLink,
  ChevronLeft, ChevronRight, Copy, Check
} from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import { useProgress } from '../hooks/useProgress';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import StatusToggle from '../components/ui/StatusToggle';
import BookmarkButton from '../components/ui/BookmarkButton';
import CompanyLogo from '../components/ui/CompanyLogo';
import type { Question } from '../types';

type SortKey = 'frequency' | 'id' | 'title' | 'difficulty' | 'acceptance';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 30;

const PERIOD_LABELS: Record<string, string> = {
  alltime: 'All Time',
  '2year': 'Last 2 Years',
  '1year': 'Last 1 Year',
  '6months': 'Last 6 Months',
};

const PERIOD_ORDER = ['alltime', '2year', '1year', '6months'];

export default function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error, loadCompany } = useCompanyData();

  useEffect(() => {
    if (slug) {
      loadCompany(slug);
    }
  }, [slug, loadCompany]);

  const {
    getStatus, setQuestionStatus, toggleSolved, toggleBookmark,
    isBookmarked, addRecentQuestion,
  } = useProgress();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('alltime');
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('frequency');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Set default period once data loads
  useEffect(() => {
    if (data && data.periods) {
      const keys = Object.keys(data.periods);
      if (!keys.includes(selectedPeriod)) {
        const preferred = PERIOD_ORDER.find(p => keys.includes(p)) || keys[0];
        if (preferred) setSelectedPeriod(preferred);
      }
    }
  }, [data, selectedPeriod]);

  // Questions filtering and sorting
  const filteredQuestions = useMemo(() => {
    if (!data || !selectedPeriod || !data.periods[selectedPeriod]) return [];
    let qs = [...data.periods[selectedPeriod]];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      qs = qs.filter(
        item => item.title.toLowerCase().includes(q) || item.id.toString().includes(q)
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      qs = qs.filter(item => item.difficulty === difficultyFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      qs = qs.filter(item => getStatus(item.id) === statusFilter);
    }

    // Sorting
    qs.sort((a, b) => {
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
        case 'frequency': cmp = a.frequency - b.frequency; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return qs;
  }, [data, selectedPeriod, search, difficultyFilter, statusFilter, sortKey, sortDir, getStatus]);

  // Real statistics for selected period
  const stats = useMemo(() => {
    if (!data || !selectedPeriod || !data.periods[selectedPeriod]) {
      return { total: 0, easy: 0, medium: 0, hard: 0, solved: 0 };
    }
    const qs = data.periods[selectedPeriod];
    return {
      total: qs.length,
      easy: qs.filter(q => q.difficulty === 'Easy').length,
      medium: qs.filter(q => q.difficulty === 'Medium').length,
      hard: qs.filter(q => q.difficulty === 'Hard').length,
      solved: qs.filter(q => getStatus(q.id) === 'solved').length,
    };
  }, [data, selectedPeriod, getStatus]);

  const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);
  const pagedQuestions = filteredQuestions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCopy = (q: Question, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!q.link) return;
    navigator.clipboard.writeText(q.link);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) return <LoadingSpinner />;
  if (error || !data) {
    return (
      <div className="py-16 text-center text-xs text-neutral-500">
        Company dataset not found for &ldquo;{slug}&rdquo;.
      </div>
    );
  }

  const periods = Object.keys(data.periods).sort(
    (a, b) => PERIOD_ORDER.indexOf(a) - PERIOD_ORDER.indexOf(b)
  );

  const rawCompPct = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
  const completionPctDisplay = stats.solved === 0
    ? '0%'
    : rawCompPct < 1
      ? `${rawCompPct.toFixed(2)}%`
      : rawCompPct < 10
        ? `${rawCompPct.toFixed(1)}%`
        : `${Math.round(rawCompPct)}%`;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Back link */}
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3.5">
          <CompanyLogo slug={data.slug} name={data.name} size="md" className="rounded-xl shadow-2xs" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {data.name}
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              Verified technical interview questions ordered by frequency
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsFollowing(!isFollowing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors self-start sm:self-auto ${
            isFollowing
              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
              : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFollowing ? 'fill-amber-500 text-amber-500' : ''}`} />
          {isFollowing ? 'Targeted' : 'Target company'}
        </button>
      </div>

      {/* Period Tabs & Metrics Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Time Period Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {periods.map(p => {
            const count = data.periods[p]?.length || 0;
            const isActive = selectedPeriod === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => { setSelectedPeriod(p); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {PERIOD_LABELS[p] || p} <span className="font-mono text-[11px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Clean Inline Metrics Strip */}
        <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-500 shrink-0">
          <span>{stats.total} questions</span>
          <span>·</span>
          <span className="text-emerald-600 dark:text-emerald-400">{stats.easy} Easy</span>
          <span>·</span>
          <span className="text-amber-600 dark:text-amber-400">{stats.medium} Med</span>
          <span>·</span>
          <span className="text-rose-600 dark:text-rose-400">{stats.hard} Hard</span>
          <span>·</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">{stats.solved} solved ({completionPctDisplay})</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={`Search ${data.name} questions...`}
            className="w-full h-9 pl-9 pr-3 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500 shadow-2xs"
          />
        </div>

        <select
          value={difficultyFilter}
          onChange={e => { setDifficultyFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none font-semibold cursor-pointer shadow-2xs"
        >
          <option value="all">Difficulty: All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none font-semibold cursor-pointer shadow-2xs"
        >
          <option value="all">Status: All</option>
          <option value="solved">Solved</option>
          <option value="attempted">Attempted</option>
          <option value="unsolved">Unsolved</option>
        </select>

        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className="h-9 px-3 bg-white dark:bg-[#121214] border border-neutral-200/90 dark:border-neutral-800 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none font-semibold cursor-pointer shadow-2xs"
        >
          <option value="frequency">Sort: Frequency</option>
          <option value="id">Sort: LeetCode ID</option>
          <option value="title">Sort: Title</option>
          <option value="difficulty">Sort: Difficulty</option>
          <option value="acceptance">Sort: Acceptance</option>
        </select>
      </div>

      {/* Questions Table */}
      {filteredQuestions.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-500 bg-white dark:bg-[#121214] rounded-2xl border border-neutral-200/90 dark:border-neutral-800">
          No problems found matching your filters.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] shadow-xs">
            <table className="w-full text-xs">
              <thead className="bg-neutral-50/80 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-10 text-center whitespace-nowrap">Status</th>
                  <th className="py-3 px-2 w-16 whitespace-nowrap">ID</th>
                  <th className="py-3 px-3">Title</th>
                  <th className="py-3 px-3 w-28 whitespace-nowrap">Difficulty</th>
                  <th className="py-3 px-3 w-24 whitespace-nowrap">Acceptance</th>
                  <th className="py-3 px-3 w-24 whitespace-nowrap">Frequency</th>
                  <th className="py-3 px-3 w-36 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {pagedQuestions.map(q => {
                  const status = getStatus(q.id);
                  const bookmarked = isBookmarked(q.id);
                  const isCopied = copiedId === q.id;

                  return (
                    <tr
                      key={q.id}
                      className="min-h-[44px] hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors group"
                    >
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <StatusToggle
                          status={status}
                          onSelectStatus={(newStatus) => setQuestionStatus(q.id, newStatus)}
                          onToggleSolved={() => toggleSolved(q.id)}
                        />
                      </td>

                      <td className="py-2.5 px-2 font-mono text-neutral-400 text-xs whitespace-nowrap">
                        #{q.id}
                      </td>

                      <td className="py-2.5 px-3">
                        {q.link ? (
                          <a
                            href={q.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => addRecentQuestion(q.id)}
                            className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {q.title}
                          </a>
                        ) : (
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">{q.title}</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      </td>

                      <td className="py-2.5 px-3 font-mono text-neutral-500 whitespace-nowrap">
                        {q.acceptance}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                        {q.frequency > 0 ? q.frequency.toFixed(2) : '—'}
                      </td>

                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {q.link && (
                            <button
                              type="button"
                              onClick={(e) => handleCopy(q, e)}
                              className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 opacity-60 group-hover:opacity-100 transition-opacity"
                              title="Copy problem link"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}

                          <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                            <BookmarkButton
                              isBookmarked={bookmarked}
                              onToggle={() => toggleBookmark(q.id)}
                            />
                          </div>

                          {q.link ? (
                            <a
                              href={q.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => addRecentQuestion(q.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-white hover:bg-blue-600 rounded-lg transition-colors group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800 dark:group-hover:hover:bg-blue-600 group-hover:hover:text-white"
                            >
                              Solve <ExternalLink className="w-3 h-3 opacity-60" />
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

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 font-mono">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredQuestions.length)} of {filteredQuestions.length} questions
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-bold">{page} / {totalPages || 1}</span>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
