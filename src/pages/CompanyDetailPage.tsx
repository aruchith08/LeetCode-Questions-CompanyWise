import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ExternalLink, Search, Copy, Check, Star, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import { useProgress } from '../hooks/useProgress';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import StatusToggle from '../components/ui/StatusToggle';
import BookmarkButton from '../components/ui/BookmarkButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CompanyLogo from '../components/ui/CompanyLogo';
import { PERIOD_LABELS, PERIOD_ORDER } from '../types';
import type { Question } from '../types';

type SortKey = 'frequency' | 'id' | 'title' | 'difficulty' | 'acceptance';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 25;

export default function CompanyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error, loadCompany } = useCompanyData();
  const {
    getStatus, setQuestionStatus, toggleSolved, toggleBookmark, isBookmarked,
    addRecentCompany, addRecentQuestion
  } = useProgress();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('frequency');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (slug) {
      loadCompany(slug);
      addRecentCompany(slug);
    }
  }, [slug, loadCompany, addRecentCompany]);

  useEffect(() => {
    if (data && !selectedPeriod) {
      const periods = Object.keys(data.periods);
      const sorted = periods.sort(
        (a, b) => PERIOD_ORDER.indexOf(a) - PERIOD_ORDER.indexOf(b)
      );
      setSelectedPeriod(sorted[0] || '');
    }
  }, [data, selectedPeriod]);

  const filteredQuestions = useMemo(() => {
    if (!data || !selectedPeriod || !data.periods[selectedPeriod]) return [];
    let qs = [...data.periods[selectedPeriod]];

    if (search.trim()) {
      const q = search.toLowerCase();
      qs = qs.filter(
        item => item.title.toLowerCase().includes(q) || item.id.toString().includes(q)
      );
    }

    if (difficultyFilter !== 'all') {
      qs = qs.filter(item => item.difficulty === difficultyFilter);
    }

    if (statusFilter !== 'all') {
      qs = qs.filter(item => {
        const s = getStatus(item.id);
        if (statusFilter === 'solved') return s === 'solved';
        if (statusFilter === 'unsolved') return s === 'unsolved';
        return true;
      });
    }

    qs.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'id': cmp = a.id - b.id; break;
        case 'title': cmp = a.title.localeCompare(b.title); break;
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
        case 'frequency': cmp = a.frequency - b.frequency; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return qs;
  }, [data, selectedPeriod, search, difficultyFilter, statusFilter, sortKey, sortDir, getStatus]);

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
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Back link */}
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
        </Link>
      </div>

      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <CompanyLogo slug={data.slug} name={data.name} size="md" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {data.name}
            </h1>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              Verified technical interview questions ordered by frequency
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors self-start sm:self-auto ${
            isFollowing
              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
              : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFollowing ? 'fill-amber-500 text-amber-500' : ''}`} />
          {isFollowing ? 'Targeted' : 'Target company'}
        </button>
      </div>

      {/* Period Tabs & Quick Metrics Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Time Period Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {periods.map(p => {
            const count = data.periods[p]?.length || 0;
            const isActive = selectedPeriod === p;
            return (
              <button
                key={p}
                onClick={() => { setSelectedPeriod(p); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {PERIOD_LABELS[p] || p} <span className="font-mono text-[11px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Clean Inline Metrics Strip */}
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 shrink-0">
          <span>{stats.total} questions</span>
          <span>·</span>
          <span className="text-emerald-600 dark:text-emerald-400">{stats.easy} Easy</span>
          <span>·</span>
          <span className="text-amber-600 dark:text-amber-400">{stats.medium} Med</span>
          <span>·</span>
          <span className="text-rose-600 dark:text-rose-400">{stats.hard} Hard</span>
          <span>·</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">{stats.solved} solved ({completionPctDisplay})</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={`Search ${data.name} questions...`}
            className="w-full h-8 pl-8 pr-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-700"
          />
        </div>

        <select
          value={difficultyFilter}
          onChange={e => { setDifficultyFilter(e.target.value); setPage(1); }}
          className="h-8 px-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none font-medium"
        >
          <option value="all">Difficulty: All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-8 px-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none font-medium"
        >
          <option value="all">Status: All</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>

        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as SortKey)}
          className="h-8 px-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none font-medium"
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
        <div className="py-16 text-center text-xs text-neutral-500">
          No problems found matching your filters.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214]">
            <table className="w-full text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-500 font-mono text-[11px] uppercase tracking-wider">
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
                          className="min-h-[44px] hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors group"
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
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-white hover:bg-blue-600 rounded transition-colors group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800 dark:group-hover:hover:bg-blue-600 group-hover:hover:text-white"
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
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredQuestions.length)} of {filteredQuestions.length} questions
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 text-neutral-600 dark:text-neutral-400"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono">{page} / {totalPages || 1}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded border border-neutral-200 dark:border-neutral-800 disabled:opacity-30 text-neutral-600 dark:text-neutral-400"
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
