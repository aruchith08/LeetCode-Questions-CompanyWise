import React, { useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Upload, Trash2, ExternalLink,
  ChevronRight, Sparkles, X, Target, Flame, Check,
  Bookmark, ChevronDown, CheckCircle2, Clock, Calendar,
  BarChart2, Search, ArrowRight, ShieldCheck
} from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useDataIndex } from '../hooks/useDataIndex';
import { useAllQuestions } from '../hooks/useAllQuestions';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CompanyLogo from '../components/ui/CompanyLogo';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import type { QuestionStatus } from '../types';

type CompanySort = 'count' | 'solved' | 'completion' | 'name';
type CompanyFilter = 'all' | 'in_progress' | 'completed';

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'Recently';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export default function ProgressPage() {
  const {
    progress, totalSolved, totalAttempted, getStatus, toggleSolved, toggleAttempted,
    setQuestionStatus, exportProgress, importProgress, resetProgress, toggleBookmark,
    addRecentQuestion,
  } = useProgress();

  const { data: index, loading: loadingIndex } = useDataIndex();
  const { data: allQuestions, loading: loadingQ } = useAllQuestions();

  const [companySort, setCompanySort] = useState<CompanySort>('count');
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('all');
  const [companySearch, setCompanySearch] = useState('');
  const [expandedCompanies, setExpandedCompanies] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalQuestions = index?.totalQuestions || 1446;
  const overallPctRaw = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
  const overallPctFormatted = totalSolved === 0
    ? '0%'
    : overallPctRaw < 1
      ? `${overallPctRaw.toFixed(2)}%`
      : overallPctRaw < 10
        ? `${overallPctRaw.toFixed(1)}%`
        : `${Math.round(overallPctRaw)}%`;

  // Bookmarked questions
  const bookmarkedQuestions = useMemo(() => {
    if (!allQuestions) return [];
    return allQuestions.filter(q => progress.bookmarks.includes(q.id));
  }, [allQuestions, progress.bookmarks]);

  // Default recently viewed questions (matching design)
  const defaultRecentTitles = ['Two Sum', 'Number of Islands', 'LRU Cache', 'Valid Parentheses', 'Merge Intervals'];
  const recentlyViewed = useMemo(() => {
    if (!allQuestions) return [];
    if (progress.recentQuestions.length > 0) {
      return progress.recentQuestions
        .map(id => allQuestions.find(q => q.id === id))
        .filter((q): q is typeof allQuestions[number] => Boolean(q))
        .slice(0, 5);
    }
    return defaultRecentTitles
      .map(title => allQuestions.find(q => q.title.toLowerCase() === title.toLowerCase()))
      .filter((q): q is typeof allQuestions[number] => Boolean(q));
  }, [allQuestions, progress.recentQuestions]);

  // Solved and attempted counts per difficulty
  const difficultyStats = useMemo(() => {
    let easySolved = 0;
    let medSolved = 0;
    let hardSolved = 0;
    let easyAttempted = 0;
    let medAttempted = 0;
    let hardAttempted = 0;

    const easyTotal = index?.difficultyCounts.Easy || 350;
    const medTotal = index?.difficultyCounts.Medium || 799;
    const hardTotal = index?.difficultyCounts.Hard || 297;

    if (allQuestions) {
      for (const q of allQuestions) {
        const s = getStatus(q.id);
        if (s === 'solved') {
          if (q.difficulty === 'Easy') easySolved++;
          else if (q.difficulty === 'Medium') medSolved++;
          else if (q.difficulty === 'Hard') hardSolved++;
        } else if (s === 'attempted') {
          if (q.difficulty === 'Easy') easyAttempted++;
          else if (q.difficulty === 'Medium') medAttempted++;
          else if (q.difficulty === 'Hard') hardAttempted++;
        }
      }
    }

    return {
      easy: {
        solved: easySolved,
        attempted: easyAttempted,
        total: easyTotal,
        pct: Math.round((easySolved / easyTotal) * 100),
      },
      medium: {
        solved: medSolved,
        attempted: medAttempted,
        total: medTotal,
        pct: Math.round((medSolved / medTotal) * 100),
      },
      hard: {
        solved: hardSolved,
        attempted: hardAttempted,
        total: hardTotal,
        pct: Math.round((hardSolved / hardTotal) * 100),
      },
    };
  }, [allQuestions, index, getStatus]);

  // Next Recommended Question (highest company frequency among unsolved questions)
  const nextRecommended = useMemo(() => {
    if (!allQuestions) return null;
    const sorted = [...allQuestions].sort((a, b) => b.companySlugs.length - a.companySlugs.length);
    return sorted.find(q => getStatus(q.id) !== 'solved') || sorted[0];
  }, [allQuestions, getStatus]);

  // Company progress calculation
  // Verified: accurately counts only solved questions whose companySlugs includes the company
  const companyProgressList = useMemo(() => {
    if (!index || !allQuestions) return [];

    let list = index.companies.map(c => {
      const compQuestions = allQuestions.filter(q => q.companySlugs.includes(c.slug));
      const solved = compQuestions.filter(q => getStatus(q.id) === 'solved').length;
      const attempted = compQuestions.filter(q => getStatus(q.id) === 'attempted').length;
      const rawPct = c.questionCount > 0 ? (solved / c.questionCount) * 100 : 0;
      const pctDisplay = solved === 0
        ? '0%'
        : rawPct < 1
          ? `${rawPct.toFixed(2)}%`
          : rawPct < 10
            ? `${rawPct.toFixed(1)}%`
            : `${Math.round(rawPct)}%`;

      return {
        slug: c.slug,
        name: c.slug === 'facebook' ? 'Facebook / Meta' : c.name,
        total: c.questionCount,
        solved,
        attempted,
        rawPct,
        pctDisplay,
      };
    });

    // Filtering by status
    if (companyFilter === 'in_progress') {
      list = list.filter(c => c.solved > 0 && c.solved < c.total);
    } else if (companyFilter === 'completed') {
      list = list.filter(c => c.solved === c.total && c.total > 0);
    }

    // Search query
    if (companySearch.trim()) {
      const q = companySearch.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
    }

    // Sorting
    list.sort((a, b) => {
      if (companySort === 'solved') {
        return b.solved - a.solved || b.total - a.total;
      }
      if (companySort === 'completion') {
        return b.rawPct - a.rawPct || b.solved - a.solved;
      }
      if (companySort === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.total - a.total;
    });

    return list;
  }, [index, allQuestions, companySort, companyFilter, companySearch, getStatus]);

  // Display initial 6 companies (or all filtered if expanded)
  const displayedCompanies = useMemo(() => {
    return expandedCompanies ? companyProgressList : companyProgressList.slice(0, 6);
  }, [companyProgressList, expandedCompanies]);

  // Practice Activity Chart Data (past 7 days calculated from real recorded history)
  const activityData = useMemo(() => {
    const history = progress.activityHistory || {};
    const days: { day: string; date: string; count: number; isToday: boolean }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      days.push({
        day: dayLabel,
        date: dateStr,
        count: history[dateStr] || 0,
        isToday: i === 0,
      });
    }

    const maxCount = Math.max(...days.map(d => d.count), 4);
    const totalThisWeek = days.reduce((sum, d) => sum + d.count, 0);

    // Active streak calculation
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) streak++;
      else if (!days[i].isToday) break;
    }

    return { days, maxCount, totalThisWeek, streak };
  }, [progress.activityHistory]);

  const handleExport = () => {
    const json = exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codewise-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = importProgress(reader.result as string);
      setImportNotice(success ? 'Progress imported successfully.' : 'Invalid progress backup file.');
      setTimeout(() => setImportNotice(null), 3500);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (loadingIndex || loadingQ) return <LoadingSpinner />;
  if (!index || !allQuestions) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1 border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My <span className="text-blue-600 dark:text-blue-500">Progress</span>
          </h1>

          <p className="text-sm text-slate-600 dark:text-neutral-400 max-w-xl">
            Track your interview preparations, examine company completion rates, and maintain practice consistency.
          </p>
        </div>

        {/* Top-Right Action Strip */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0 pt-1">
          {/* Saved in browser pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Saved in this browser</span>
          </div>

          {/* Backup & data button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] text-xs font-semibold text-slate-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Backup & data</span>
          </button>

          {/* Explore problems button (directional chevron for internal navigation) */}
          <Link
            to="/problems"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-500/20"
          >
            <span>Explore problems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Cards Stats Grid (Overall Completion + Easy + Medium + Hard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Overall Completion (Spans 2 cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-neutral-300">
              <Target className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Overall completion</span>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5 font-sans">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalSolved}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-neutral-400">/ {totalQuestions.toLocaleString()} solved</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-300 font-medium mt-1">
              <span>{totalAttempted} attempted</span>
              <span>·</span>
              <span>{bookmarkedQuestions.length} bookmarked</span>
            </div>

            {/* Progress bar with visible minimum starting pip */}
            <div className="w-44 sm:w-48 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mt-3">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(overallPctRaw, totalSolved > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-blue-100 dark:text-blue-950/40"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 14}
                strokeDashoffset={2 * Math.PI * 14 * (1 - (totalSolved > 0 ? Math.max(overallPctRaw, 0.5) : 0) / 100)}
                strokeLinecap="round"
                className="text-blue-600 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight font-sans">
                {overallPctFormatted}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-neutral-400 font-semibold -mt-0.5">
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Easy */}
        <div className="lg:col-span-1 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">Easy</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
            </div>
          </div>

          <div>
            <div className="mt-3 flex items-baseline gap-1 font-sans">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{difficultyStats.easy.solved}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">/ {difficultyStats.easy.total}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5 font-medium">
              {difficultyStats.easy.attempted > 0 ? `${difficultyStats.easy.attempted} attempted` : 'questions solved'}
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mt-4">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(difficultyStats.easy.pct, difficultyStats.easy.solved > 0 ? 3 : 0)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Medium */}
        <div className="lg:col-span-1 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">Medium</span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <div>
            <div className="mt-3 flex items-baseline gap-1 font-sans">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{difficultyStats.medium.solved}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">/ {difficultyStats.medium.total}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5 font-medium">
              {difficultyStats.medium.attempted > 0 ? `${difficultyStats.medium.attempted} attempted` : 'questions solved'}
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mt-4">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(difficultyStats.medium.pct, difficultyStats.medium.solved > 0 ? 3 : 0)}%` }}
            />
          </div>
        </div>

        {/* Card 4: Hard */}
        <div className="lg:col-span-1 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">Hard</span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            </div>
          </div>

          <div>
            <div className="mt-3 flex items-baseline gap-1 font-sans">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{difficultyStats.hard.solved}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">/ {difficultyStats.hard.total}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5 font-medium">
              {difficultyStats.hard.attempted > 0 ? `${difficultyStats.hard.attempted} attempted` : 'questions solved'}
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mt-4">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(difficultyStats.hard.pct, difficultyStats.hard.solved > 0 ? 3 : 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Company Completion & Practice Activity, Right = 3 Sidebar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Company Completion + Practice Analytics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Company Completion Table */}
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs space-y-4">
            {/* Header + Filter Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Company completion
                </h2>
                <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5 font-medium">
                  Direct interview progress mapped to verified company question sets.
                </p>
              </div>

              {/* Sort Filter Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={companySort}
                  onChange={e => setCompanySort(e.target.value as CompanySort)}
                  className="appearance-none h-8 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-neutral-200 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  <option value="count">Sort: Most questions</option>
                  <option value="solved">Sort: Most solved</option>
                  <option value="completion">Sort: Completion %</option>
                  <option value="name">Sort: A – Z</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Quick Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'in_progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCompanyFilter(tab.id as CompanyFilter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      companyFilter === tab.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:max-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={companySearch}
                  onChange={e => setCompanySearch(e.target.value)}
                  placeholder="Filter company..."
                  className="w-full h-8 pl-8 pr-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Table Headers */}
            <div className="grid grid-cols-12 text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 pt-1">
              <span className="col-span-5 sm:col-span-5">COMPANY</span>
              <span className="col-span-3 sm:col-span-3">SOLVED</span>
              <span className="col-span-4 sm:col-span-4 text-right pr-6">YOUR PROGRESS</span>
            </div>

            {/* Company Rows */}
            {displayedCompanies.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-neutral-400">
                No companies match your filter criteria.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {displayedCompanies.map(c => (
                  <Link
                    key={c.slug}
                    to={`/companies/${c.slug}`}
                    className="py-3 px-2 flex items-center justify-between hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 rounded-xl transition-colors group cursor-pointer"
                  >
                    {/* Company Info */}
                    <div className="flex items-center gap-3 w-5/12 min-w-0">
                      <CompanyLogo slug={c.slug} name={c.name} size="sm" className="rounded-lg shadow-2xs" />
                      <div className="min-w-0">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate block">
                          {c.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                          {c.total} questions
                        </span>
                      </div>
                    </div>

                    {/* Solved Count */}
                    <div className="w-3/12 font-sans text-xs">
                      <span className="font-extrabold text-slate-900 dark:text-white">{c.solved}</span>
                      <span className="text-slate-500 dark:text-neutral-400 font-medium"> / {c.total}</span>
                    </div>

                    {/* Completion Progress Bar & Navigation Chevron */}
                    <div className="flex items-center justify-end gap-3 w-4/12">
                      <div className="w-20 sm:w-28 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0">
                        <div
                          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(c.rawPct, c.solved > 0 ? 3 : 0)}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs text-blue-600 dark:text-blue-400 w-12 text-right font-sans">
                        {c.pctDisplay}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Card Footer: Show more & View all companies */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-xs">
              {companyProgressList.length > 6 ? (
                <button
                  onClick={() => setExpandedCompanies(!expandedCompanies)}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500"
                >
                  {expandedCompanies ? 'Show fewer (6)' : `Show all ${companyProgressList.length} filtered`}
                </button>
              ) : (
                <span className="text-slate-500 dark:text-neutral-400 font-medium">
                  Showing {displayedCompanies.length} of {index.totalCompanies} companies
                </span>
              )}

              <Link
                to="/companies"
                className="font-bold text-slate-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
              >
                <span>View all companies</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Practice Activity Analytics (Real Recorded Events) */}
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Practice Activity
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 font-medium">
                    Weekly questions solved & attempted
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-neutral-200">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>{activityData.streak} day streak</span>
                </div>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {activityData.totalThisWeek} recorded this week
                </span>
              </div>
            </div>

            {/* 7-Day Activity Bar Chart */}
            <div className="pt-2">
              <div className="h-28 flex items-end justify-between gap-3 px-2">
                {activityData.days.map((item, idx) => {
                  const barHeightPct = item.count > 0
                    ? Math.max(Math.round((item.count / activityData.maxCount) * 100), 18)
                    : 6;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      {/* Count tooltip on hover */}
                      <span className={`text-[11px] font-mono font-bold transition-opacity ${item.count > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 opacity-60'}`}>
                        {item.count}
                      </span>

                      {/* Bar */}
                      <div className="w-full max-w-[28px] h-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5 flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-md transition-all duration-300 ${
                            item.count > 0
                              ? item.isToday
                                ? 'bg-gradient-to-t from-blue-700 to-blue-500 shadow-sm'
                                : 'bg-blue-600 hover:bg-blue-500'
                              : 'bg-neutral-200 dark:bg-neutral-700/40'
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>

                      {/* Day Label */}
                      <span className={`text-xs font-semibold ${item.isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-neutral-400'}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Stacked Widgets (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: Next Recommended (Restrained, Professional Card with Clear Explanation) */}
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEXT RECOMMENDED</span>
              </span>
              <DifficultyBadge difficulty={nextRecommended?.difficulty || 'Medium'} size="sm" />
            </div>

            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                {nextRecommended?.title || 'Number of Islands'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono mt-1">
                LeetCode #{nextRecommended?.id || 200} · Asked at {nextRecommended?.companySlugs.length || 58} verified companies
              </p>
            </div>

            {/* Clear Reason Explanation */}
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-xs text-slate-700 dark:text-neutral-300 space-y-1">
              <span className="font-bold text-blue-700 dark:text-blue-400 block">Why this problem:</span>
              <p className="leading-relaxed font-medium">
                Frequently featured in {nextRecommended?.companySlugs.length || 58} top engineering interview loops with an acceptance rate of {nextRecommended?.acceptance || '56.2%'}. Master this core {nextRecommended?.difficulty || 'Medium'} pattern.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={nextRecommended?.link || 'https://leetcode.com/problems/number-of-islands'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => nextRecommended && addRecentQuestion(nextRecommended.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5 active:scale-95"
              >
                <span>Solve on LeetCode</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {nextRecommended && (
                <button
                  onClick={() => toggleAttempted(nextRecommended.id)}
                  className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Mark as attempted
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Recently Viewed with Timestamps */}
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recently viewed
              </h3>
              <Link
                to="/problems"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1"
              >
                <span>All problems</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-1">
              {recentlyViewed.map(q => {
                const status = getStatus(q.id);
                const isSolved = status === 'solved';
                const isAttempted = status === 'attempted';
                const timestampStr = progress.recentQuestionTimestamps?.[q.id];
                const relativeTime = formatRelativeTime(timestampStr);

                return (
                  <div
                    key={q.id}
                    className="p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 flex items-center justify-between gap-3 text-xs transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isSolved ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : isAttempted ? (
                        <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                          <Clock className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0" />
                      )}
                      <div className="min-w-0">
                        <a
                          href={q.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => addRecentQuestion(q.id)}
                          className="font-bold text-xs text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate block"
                        >
                          {q.title}
                        </a>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-neutral-400">
                          <span className="font-mono">#{q.id}</span>
                          <span>·</span>
                          <span>{relativeTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Bookmarked Questions (with Actionable Empty State) */}
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#121214] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Bookmarked questions
              </h3>
              <span className="text-xs font-semibold text-slate-600 dark:text-neutral-400">
                {bookmarkedQuestions.length} saved
              </span>
            </div>

            {bookmarkedQuestions.length === 0 ? (
              <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      No bookmarks yet
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium">
                      Bookmark key problems to build your personalized revision set.
                    </p>
                  </div>
                </div>

                <Link
                  to="/problems"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 active:scale-95"
                >
                  <span>Browse problems to bookmark</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60 max-h-56 overflow-y-auto">
                {bookmarkedQuestions.map(q => (
                  <div
                    key={q.id}
                    className="py-2.5 flex items-center justify-between gap-2.5 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className="text-amber-500 p-0.5"
                        title="Remove bookmark"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                      <div className="min-w-0">
                        <a
                          href={q.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => addRecentQuestion(q.id)}
                          className="font-bold text-xs text-slate-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate block"
                        >
                          {q.title}
                        </a>
                        <span className="text-[11px] font-mono text-neutral-400">#{q.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      <a
                        href={q.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => addRecentQuestion(q.id)}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        Solve <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings & Backup Modal */}
      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18181b] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Backup & Data Management
                </h3>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Your preparation records are stored privately in your browser.
                </p>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {importNotice && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                {importNotice}
              </div>
            )}

            <div className="space-y-3">
              {/* Export backup */}
              <button
                onClick={handleExport}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-blue-600" />
                  <div className="text-left">
                    <div>Export progress backup (.json)</div>
                    <div className="text-[11px] text-neutral-400 font-normal">Save your progress file locally</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              {/* Import backup */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <div className="text-left">
                    <div>Import progress backup (.json)</div>
                    <div className="text-[11px] text-neutral-400 font-normal">Restore progress from a previous export</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />

              {/* Reset data */}
              <div className="pt-2">
                {showResetConfirm ? (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2">
                    <p className="text-xs text-rose-700 dark:text-rose-400 font-bold">
                      Are you sure you want to erase all progress?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          resetProgress();
                          setShowResetConfirm(false);
                          setShowSettingsModal(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold"
                      >
                        Yes, reset all
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full p-3 rounded-xl border border-rose-200 dark:border-rose-950/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trash2 className="w-4 h-4" />
                      <span>Reset local progress</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
