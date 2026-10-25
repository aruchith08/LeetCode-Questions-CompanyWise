import React, { useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Upload, Trash2,
  ChevronRight, X, Target,
  Bookmark, Calendar,
  Search, ArrowRight, Flame
} from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useDataIndex } from '../hooks/useDataIndex';
import { useAllQuestions } from '../hooks/useAllQuestions';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CompanyLogo from '../components/ui/CompanyLogo';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import StatusToggle from '../components/ui/StatusToggle';
import BookmarkButton from '../components/ui/BookmarkButton';

type CompanySort = 'count' | 'solved' | 'completion' | 'name';
type CompanyFilter = 'all' | 'in_progress' | 'completed';

export default function ProgressPage() {
  const {
    progress, totalSolved, totalAttempted, getStatus, toggleSolved,
    exportProgress, importProgress, resetProgress, toggleBookmark,
    addRecentQuestion,
  } = useProgress();

  const { data: index, loading: loadingIndex } = useDataIndex();
  const { data: allQuestions, loading: loadingQ } = useAllQuestions();

  const [companySort, setCompanySort] = useState<CompanySort>('solved');
  const [companyFilter, setCompanyFilter] = useState<CompanyFilter>('all');
  const [companySearch, setCompanySearch] = useState('');
  const [expandedCompanies, setExpandedCompanies] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalQuestions = index?.totalQuestions || 3411;
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

  // Solved and attempted counts per difficulty
  const difficultyStats = useMemo(() => {
    let easySolved = 0;
    let medSolved = 0;
    let hardSolved = 0;
    let easyAttempted = 0;
    let medAttempted = 0;
    let hardAttempted = 0;

    const easyTotal = index?.difficultyCounts.Easy || 814;
    const medTotal = index?.difficultyCounts.Medium || 1817;
    const hardTotal = index?.difficultyCounts.Hard || 780;

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
      easy: { solved: easySolved, attempted: easyAttempted, total: easyTotal },
      medium: { solved: medSolved, attempted: medAttempted, total: medTotal },
      hard: { solved: hardSolved, attempted: hardAttempted, total: hardTotal },
    };
  }, [allQuestions, index, getStatus]);

  // Company completion breakdown
  const companyProgressList = useMemo(() => {
    if (!index || !allQuestions) return [];

    const solvedByCompany = new Map<string, number>();
    const attemptedByCompany = new Map<string, number>();

    for (const q of allQuestions) {
      const s = getStatus(q.id);
      if (s === 'solved') {
        for (const slug of q.companySlugs) {
          solvedByCompany.set(slug, (solvedByCompany.get(slug) || 0) + 1);
        }
      } else if (s === 'attempted') {
        for (const slug of q.companySlugs) {
          attemptedByCompany.set(slug, (attemptedByCompany.get(slug) || 0) + 1);
        }
      }
    }

    let list = index.companies.map(c => {
      const solved = solvedByCompany.get(c.slug) || 0;
      const attempted = attemptedByCompany.get(c.slug) || 0;
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
        name: c.name,
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

  // Practice Activity Chart Data (past 7 days from real history)
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
    a.download = `companywise-backup-${new Date().toISOString().split('T')[0]}.json`;
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1 border-b border-slate-200/80 dark:border-[#43433F] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal hero-serif tracking-tight text-[#0F1B3D] dark:text-[#FAF9F5]">
              My <span className="text-[#0F1B3D] dark:text-[#D97757]">Progress</span>
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5A524]" title="CompanyWise live progress" />
          </div>
          <p className="text-sm text-slate-600 dark:text-[#A8A69C] max-w-xl">
            Track interview preparation completion, examine company breakdown rates, and maintain practice consistency.
          </p>
        </div>

        {/* Top-Right Action Strip */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-[#8FBF78] border border-emerald-200/60 dark:border-emerald-900/40 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Local Storage Active</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D] transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Backup & data</span>
          </button>

          <Link
            to="/problems"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F1B3D] hover:bg-[#1F1E1D] dark:bg-[#D97757] dark:hover:bg-[#E0921B] text-white dark:text-[#262624] text-xs font-bold transition-all shadow-sm"
          >
            <span>Explore problems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Cards Stats Grid (Overall + Easy + Medium + Hard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Overall Completion (Spans 2 cols on lg) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-5 shadow-xs flex items-center justify-between">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-[#FAF9F5]">
              <Target className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757] shrink-0" />
              <span>Overall completion</span>
            </div>

            <div className="mt-3 flex items-baseline gap-1.5 font-sans">
              <span className="text-3xl font-extrabold text-[#0F1B3D] dark:text-[#FAF9F5] font-mono">{totalSolved}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-[#A8A69C]">/ {totalQuestions.toLocaleString()} solved</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#FAF9F5] font-medium mt-1">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A524]" />
                {totalAttempted} attempted
              </span>
              <span>·</span>
              <span>{bookmarkedQuestions.length} bookmarked</span>
            </div>

            <div className="w-44 sm:w-48 h-2 rounded-full bg-slate-100 dark:bg-[#262624] overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-[#0F1B3D] to-[#F5A524] dark:from-[#D97757] dark:to-[#D97757] rounded-full transition-all duration-300"
                style={{ width: `${Math.max(overallPctRaw, totalSolved > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl font-extrabold font-mono text-[#0F1B3D] dark:text-[#D97757] block">
              {overallPctFormatted}
            </span>
            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">accuracy</span>
          </div>
        </div>

        {/* Card 2: Easy */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-[#8FBF78]">Easy</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#FAF9F5]">
              {difficultyStats.easy.solved}
            </span>
            <span className="text-xs text-slate-500 font-mono ml-1">/ {difficultyStats.easy.total}</span>
          </div>
          <div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#262624] overflow-hidden mb-1">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${(difficultyStats.easy.solved / difficultyStats.easy.total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {difficultyStats.easy.attempted} attempted
            </span>
          </div>
        </div>

        {/* Card 3: Medium */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-[#E0B14F]">Medium</span>
            <span className="w-2 h-2 rounded-full bg-[#F5A524]" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#FAF9F5]">
              {difficultyStats.medium.solved}
            </span>
            <span className="text-xs text-slate-500 font-mono ml-1">/ {difficultyStats.medium.total}</span>
          </div>
          <div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#262624] overflow-hidden mb-1">
              <div
                className="h-full bg-[#F5A524] rounded-full transition-all duration-300"
                style={{ width: `${(difficultyStats.medium.solved / difficultyStats.medium.total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {difficultyStats.medium.attempted} attempted
            </span>
          </div>
        </div>

        {/* Card 4: Hard */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 dark:text-[#EE8F78]">Hard</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-[#FAF9F5]">
              {difficultyStats.hard.solved}
            </span>
            <span className="text-xs text-slate-500 font-mono ml-1">/ {difficultyStats.hard.total}</span>
          </div>
          <div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#262624] overflow-hidden mb-1">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${(difficultyStats.hard.solved / difficultyStats.hard.total) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {difficultyStats.hard.attempted} attempted
            </span>
          </div>
        </div>
      </div>

      {/* Practice Activity Tracker & Weekly Velocity */}
      <section className="p-5 rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
              <span>Practice Activity & Velocity</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
              Daily problems solved over the past 7 days based on real interactions.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono font-medium">
            <span className="text-slate-500 dark:text-[#A8A69C]">
              <strong className="text-slate-900 dark:text-[#FAF9F5]">{activityData.totalThisWeek}</strong> solved this week
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-[#F5A524] border border-[#F5A524]/20 font-bold">
              <Flame className="w-3.5 h-3.5 flame-streak-animate" />
              <span>{activityData.streak} day streak</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {activityData.days.map((d, idx) => {
            const heightPct = Math.max((d.count / activityData.maxCount) * 100, 8);
            return (
              <div key={d.date} className="flex flex-col items-center gap-2 text-center velocity-col" style={{ '--col-idx': idx } as React.CSSProperties}>
                <div className="w-full h-24 bg-slate-100 dark:bg-[#262624] rounded-xl flex items-end p-1 overflow-hidden border border-slate-200/50 dark:border-[#43433F]/50">
                  <div
                    className={`w-full rounded-lg transition-all duration-300 velocity-bar ${
                      d.count > 0
                        ? d.isToday
                          ? 'bg-[#F5A524] today-bar-active'
                          : 'bg-[#0F1B3D] dark:bg-[#38BDF8]'
                        : 'bg-slate-200 dark:bg-[#43433F]/40'
                    }`}
                    style={{ height: `${heightPct}%` }}
                    title={`${d.day}: ${d.count} questions`}
                  />
                </div>
                <div className="font-mono text-[11px]">
                  <span className={`block font-semibold ${d.isToday ? 'text-[#0F1B3D] dark:text-[#D97757]' : 'text-slate-600 dark:text-[#A8A69C]'}`}>
                    {d.day}
                  </span>
                  <span className="text-slate-400 text-[10px] block mt-0.5 font-bold">
                    {d.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Two-Column View: Company Matrix (Left) + Saved Questions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Company-Wise Completion */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5]">
                Company Completion Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A8A69C]">
                Track exact preparation progress for individual target companies.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5">
              {(['all', 'in_progress', 'completed'] as CompanyFilter[]).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCompanyFilter(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                    companyFilter === f
                      ? 'bg-[#0F1B3D] dark:bg-[#D97757] text-white dark:text-[#262624] shadow-2xs font-bold'
                      : 'bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-slate-600 dark:text-[#A8A69C] hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : 'Completed'}
                </button>
              ))}
            </div>
          </div>

          {/* Company Search and Sort Bar */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={companySearch}
                onChange={e => setCompanySearch(e.target.value)}
                placeholder="Search companies in progress..."
                className="w-full h-9 pl-9 pr-3 bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] rounded-xl text-xs text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:border-[#F5A524] shadow-2xs"
              />
            </div>

            <select
              value={companySort}
              onChange={e => setCompanySort(e.target.value as CompanySort)}
              className="h-9 px-3 bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] rounded-xl text-xs font-semibold text-slate-700 dark:text-[#FAF9F5] focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="solved">Sort: Solved (Most)</option>
              <option value="completion">Sort: Completion %</option>
              <option value="count">Sort: Total Questions</option>
              <option value="name">Sort: Name (A–Z)</option>
            </select>
          </div>

          {/* Company Progress Rows */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] divide-y divide-slate-100 dark:divide-[#43433F]/80 shadow-xs overflow-hidden">
            {displayedCompanies.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No companies match your filters.
              </div>
            ) : (
              displayedCompanies.map(c => (
                <Link
                  key={c.slug}
                  to={`/companies/${c.slug}`}
                  className="p-4 hover:bg-slate-50/80 dark:hover:bg-[#1F1E1D]/60 transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CompanyLogo slug={c.slug} name={c.name} size="sm" className="rounded-lg shadow-2xs" />
                    <div className="min-w-0">
                      <span className="font-bold text-sm text-slate-900 dark:text-[#FAF9F5] block truncate">
                        {c.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {c.solved} solved · {c.attempted} attempted of {c.total}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-32 sm:w-40 text-right">
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-[#262624] overflow-hidden mb-1">
                        <div
                          className="h-full bg-gradient-to-r from-[#0F1B3D] to-[#F5A524] dark:from-[#D97757] dark:to-[#D97757] rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(c.rawPct, c.solved > 0 ? 3 : 0)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-xs text-[#0F1B3D] dark:text-[#D97757]">
                        {c.pctDisplay}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Expand/Collapse Button */}
          {companyProgressList.length > 6 && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setExpandedCompanies(!expandedCompanies)}
                className="px-4 py-2 rounded-xl border border-slate-200/90 dark:border-[#43433F] text-xs font-semibold text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D] transition-colors"
              >
                {expandedCompanies ? 'Show top 6 companies only' : `Show all ${companyProgressList.length} companies`}
              </button>
            </div>
          )}
        </section>

        {/* Right Column (4 cols): Bookmarked Questions */}
        <section className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#F5A524]" />
              <span>Bookmarked ({bookmarkedQuestions.length})</span>
            </h2>
            <Link
              to="/problems"
              className="text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757] hover:underline"
            >
              Browse all →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 shadow-xs divide-y divide-slate-100 dark:divide-[#43433F]/80">
            {bookmarkedQuestions.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Bookmark className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-700" />
                <p>No questions bookmarked yet.</p>
                <p className="text-[11px] text-slate-400">
                  Click the bookmark icon on any problem to save it for quick revision.
                </p>
              </div>
            ) : (
              bookmarkedQuestions.map(q => {
                const status = getStatus(q.id);
                return (
                  <div
                    key={q.id}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5 group"
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
                        onClick={() => addRecentQuestion(q.id)}
                        className="text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757] truncate transition-colors"
                      >
                        {q.title}
                      </a>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <DifficultyBadge difficulty={q.difficulty} size="sm" />
                      <BookmarkButton
                        isBookmarked={true}
                        onToggle={() => toggleBookmark(q.id)}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Backup & Data Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#43433F]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                Progress Backup & Data
              </h3>
              <button
                type="button"
                onClick={() => { setShowSettingsModal(false); setShowResetConfirm(false); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {importNotice && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-[#E0B14F]">
                {importNotice}
              </div>
            )}

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#43433F] bg-slate-50 dark:bg-[#262624]/60 space-y-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-[#FAF9F5] block">
                  Export Progress
                </span>
                <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] leading-relaxed">
                  Download a JSON file containing all your solved problems, attempted questions, and bookmarks.
                </p>
                <button
                  type="button"
                  onClick={handleExport}
                  className="px-3.5 py-1.5 rounded-xl bg-[#0F1B3D] hover:bg-[#1F1E1D] dark:bg-[#D97757] dark:hover:bg-[#E0921B] text-white dark:text-[#262624] text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (.json)</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/90 dark:border-[#43433F] bg-slate-50 dark:bg-[#262624]/60 space-y-2">
                <span className="font-semibold text-xs text-slate-900 dark:text-[#FAF9F5] block">
                  Import Progress
                </span>
                <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] leading-relaxed">
                  Restore your questions and history from an existing CompanyWise backup file.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-[#43433F] bg-white dark:bg-[#30302E] text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D] transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File to Import</span>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
                <span className="font-semibold text-xs text-rose-700 dark:text-[#EE8F78] block">
                  Reset Progress
                </span>
                <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] leading-relaxed">
                  Erase all tracked problem statuses and bookmarks saved in this browser.
                </p>
                {showResetConfirm ? (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        resetProgress();
                        setShowResetConfirm(false);
                        setShowSettingsModal(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
                    >
                      Yes, reset all
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#43433F] text-xs font-semibold text-slate-600 dark:text-[#FAF9F5]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-300 dark:bg-rose-950/40 dark:border-rose-900/60 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset All Data</span>
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
