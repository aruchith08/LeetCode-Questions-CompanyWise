import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Timer,
  Eye,
  HelpCircle,
  RotateCcw,
  Building2,
  Check,
  Split,
  ChevronRight,
  Sparkles,
  MessageSquareCode,
  ShieldCheck,
  Workflow,
  GraduationCap
} from 'lucide-react';

type RoadmapTab = 'all' | 'beginner' | 'intermediate' | 'compass' | 'loop';

interface DiagnosticQuestion {
  id: string;
  title: string;
  category: string;
  options: {
    label: string;
    description: string;
    score: number; // 0 for beginner signal, 1 for intermediate signal
  }[];
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'language',
    title: 'Language Fluency',
    category: 'Syntax & Standard Library',
    options: [
      {
        label: 'Still Syntax-Struggling',
        description: 'Frequently look up standard library methods, syntax, or array manipulation basics.',
        score: 0,
      },
      {
        label: 'Fluent in 1 Language',
        description: 'Can write clean, idiomatic loops, hash maps, and recursion without syntax friction.',
        score: 1,
      },
    ],
  },
  {
    id: 'bigO',
    title: 'Big-O Intuition',
    category: 'Complexity Analysis',
    options: [
      {
        label: 'Unsure or Guessing',
        description: 'Struggle to analyze nested loops, recursive stack depths, or space trade-offs.',
        score: 0,
      },
      {
        label: 'Instant Complexity Intuition',
        description: 'Immediately recognize O(N log N) vs O(N) vs O(2^N) and compute auxiliary space.',
        score: 1,
      },
    ],
  },
  {
    id: 'solved',
    title: 'Problems Solved',
    category: 'Practice Volume',
    options: [
      {
        label: '< 30 Problems Solved',
        description: 'New to LeetCode practice or returning after a prolonged multi-month break.',
        score: 0,
      },
      {
        label: '50+ Problems Solved',
        description: 'Familiar with basic arrays, hash maps, and have tackled diverse question types.',
        score: 1,
      },
    ],
  },
  {
    id: 'recursion',
    title: 'Recursion & Trees',
    category: 'Data Structures',
    options: [
      {
        label: 'Fear the Call Stack',
        description: 'Uncomfortable visualizing branching recursive calls, DFS/BFS, or backtracking trees.',
        score: 0,
      },
      {
        label: 'Comfortable with Trees',
        description: 'Can write tree traversals, understand base cases, and conceptualize state branching.',
        score: 1,
      },
    ],
  },
  {
    id: 'bottleneck',
    title: 'Core Bottleneck',
    category: 'Current Struggle',
    options: [
      {
        label: 'No Clue Which Pattern Applies',
        description: 'Read a problem description and freeze because the starting technique is opaque.',
        score: 0,
      },
      {
        label: 'Spot Pattern, Fail Edge Cases & Speed',
        description: 'Recognize the general family, but stumble on implementation details or time limits.',
        score: 1,
      },
    ],
  },
];

const TABS: { id: RoadmapTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All Tracks & Overview', icon: Sparkles },
  { id: 'beginner', label: 'Beginner Roadmap', icon: GraduationCap },
  { id: 'intermediate', label: 'Intermediate Sprint', icon: Zap },
  { id: 'compass', label: 'Feature Compass', icon: Compass },
  { id: 'loop', label: 'Platform Loop', icon: Workflow },
];

export default function RoadmapsPage() {
  const [activeTab, setActiveTab] = useState<RoadmapTab>('all');
  const [answers, setAnswers] = useState<Record<string, number | null>>({
    language: null,
    bigO: null,
    solved: null,
    recursion: null,
    bottleneck: null,
  });

  const handleSelectOption = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleResetDiagnostic = () => {
    setAnswers({
      language: null,
      bigO: null,
      solved: null,
      recursion: null,
      bottleneck: null,
    });
  };

  // Compute recommendation
  const answeredCount = useMemo(() => {
    return Object.values(answers).filter(v => v !== null).length;
  }, [answers]);

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce<number>((acc, cur) => acc + (cur ?? 0), 0);
  }, [answers]);

  const recommendedTrack: 'beginner' | 'intermediate' = useMemo(() => {
    return totalScore >= 3 ? 'intermediate' : 'beginner';
  }, [totalScore]);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex(t => t.id === activeTab);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = TABS[(currentIndex + 1) % TABS.length].id;
      setActiveTab(nextTab);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = TABS[(currentIndex - 1 + TABS.length) % TABS.length].id;
      setActiveTab(prevTab);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(TABS[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(TABS[TABS.length - 1].id);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Hero Header */}
      <section className="pt-2 pb-6 border-b border-slate-200/80 dark:border-[#43433F]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Heading & Subtitle */}
          <div className="lg:col-span-7 space-y-3 text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal hero-serif tracking-tight text-slate-900 dark:text-[#FAF9F5]">
              Interview Roadmaps & Preparation Strategy
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8A69C] leading-relaxed max-w-2xl">
              Choose the trajectory tailored to your timeline. Master core algorithmic invariants with the
              15-minute practice loop, or execute a high-velocity 2-to-6 week company sprint.
            </p>
          </div>

          {/* Right Column: Hero Mountain Illustration (Merged into page) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end select-none">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[390px] flex items-center justify-center">
              {/* Subtle ambient backdrop glow to blend naturally into light and dark page backgrounds */}
              <div className="absolute inset-0 bg-radial from-sky-400/10 dark:from-sky-500/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none -z-10" />
              <picture className="w-full flex items-center justify-center">
                <source srcSet="/companywise-roadmap-mountain.webp" type="image/webp" />
                <img
                  src="/companywise-roadmap-mountain.webp"
                  alt="CompanyWise Interview Roadmap: Mountain Journey to Mastery"
                  width={390}
                  height={200}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto object-contain select-none pointer-events-none transition-opacity duration-300"
                />
              </picture>
            </div>
          </div>
        </div>

        {/* Track Switcher Navigation Tabs */}
        <div
          className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          role="tablist"
          aria-label="Roadmap Tracks"
          onKeyDown={handleTabKeyDown}
        >
          {TABS.map((tab) => {
            const isCurrent = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isCurrent ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] shadow-2xs font-bold'
                    : 'bg-white dark:bg-[#30302E] text-slate-600 dark:text-[#A8A69C] hover:bg-slate-100 dark:hover:bg-[#1F1E1D] border border-slate-200/90 dark:border-[#43433F]'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Visual Module 1: Interactive 5-Tap Diagnostic */}
      {activeTab === 'all' && (
        <section
          id="panel-all"
          role="tabpanel"
          aria-labelledby="tab-all"
          className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-6"
        >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2
              id="diagnostic-heading"
              className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]"
            >
              Interactive 5-Tap Diagnostic: Where Do You Stand?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C]">
              Tap your current proficiency across 5 core dimensions to dynamically pinpoint your recommended path.
            </p>
          </div>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleResetDiagnostic}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] transition-colors self-start sm:self-center cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset answers</span>
            </button>
          )}
        </div>

        {/* 5 Diagnostic Questions */}
        <div className="grid grid-cols-1 gap-4">
          {DIAGNOSTIC_QUESTIONS.map((q, idx) => {
            const currentAnswer = answers[q.id];
            return (
              <div
                key={q.id}
                role="radiogroup"
                aria-labelledby={`q-title-${q.id}`}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/70 dark:border-[#43433F]/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full bg-slate-200 dark:bg-[#30302E] text-[11px] font-bold text-slate-700 dark:text-[#FAF9F5] flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {idx + 1}
                    </span>
                    <span id={`q-title-${q.id}`} className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                      {q.title}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-[#A8A69C] hidden sm:inline">
                      ({q.category})
                    </span>
                  </div>
                  {currentAnswer !== null && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                      Answered
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = currentAnswer === opt.score;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleSelectOption(q.id, opt.score)}
                        className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white dark:bg-[#30302E] border-[#0F1B3D] dark:border-[#D97757] ring-1 ring-[#0F1B3D] dark:ring-[#D97757] shadow-2xs'
                            : 'bg-white/60 dark:bg-[#262624]/60 border-slate-200/90 dark:border-[#43433F] hover:bg-white dark:hover:bg-[#262624]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                              {opt.label}
                            </div>
                            <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                              {opt.description}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#0F1B3D] dark:bg-[#D97757] border-[#0F1B3D] dark:border-[#D97757]'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white dark:text-[#1F1E1D]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Diagnostic Recommendation Banner */}
        <div
          data-testid="diagnostic-result"
          aria-live="polite"
          aria-atomic="true"
          className="p-5 rounded-xl border bg-slate-50 dark:bg-[#1F1E1D] border-slate-200/90 dark:border-[#43433F] space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Calculated Recommendation:
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D]">
                  {recommendedTrack === 'beginner' ? (
                    <>
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Beginner Roadmap</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Intermediate Sprint</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-[#A8A69C] font-mono">
                  ({answeredCount}/5 answered)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                {answeredCount === 0
                  ? 'Baseline Default: Beginner Roadmap. Tap options in the 5 questions above to calibrate your track to your experience level.'
                  : recommendedTrack === 'beginner'
                  ? 'Focus on mastering core linear invariants and the 15-minute practice loop. Avoid random hard questions until your pattern intuition is solid.'
                  : 'Your foundational mechanics are strong. Focus on technique pivot scenarios, advanced multi-constraint patterns, and company recency mining.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab(recommendedTrack)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <span>Explore {recommendedTrack === 'beginner' ? 'Beginner Roadmap' : 'Intermediate Sprint'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Visual Module 2: The Visual CompanyWise Engine Loop */}
      {(activeTab === 'all' || activeTab === 'loop') && (
        <section
          id="panel-loop"
          role="tabpanel"
          aria-labelledby="tab-loop"
          className="space-y-6 pt-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 flex items-center justify-center shrink-0">
                <Workflow className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                The CompanyWise Engine Loop
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C]">
              A continuous 7-stage learning circuit that turns solved questions into permanent pattern reflexes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-700 dark:text-[#FAF9F5]">
                    01
                  </span>
                  <BookOpen className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Invariant First
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Learn the mathematical rule guaranteeing correctness before writing code. Understand why the pattern works.
                </p>
              </div>
              <Link
                to="/patterns"
                className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
              >
                <span>Browse Invariants</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-700 dark:text-[#FAF9F5]">
                    02
                  </span>
                  <Eye className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Interactive Visualizer
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Input custom test cases into the visualizer engine to step through pointer progression and state expansion.
                </p>
              </div>
              <Link
                to="/patterns/sliding-window"
                className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
              >
                <span>Try Sliding Window</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-700 dark:text-[#FAF9F5]">
                    03
                  </span>
                  <Timer className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                  15-Min Practice Sprint
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Solo attempt under realistic time constraints. Write the invariant on a scratchpad before typing solution code.
                </p>
              </div>
              <Link
                to="/problems"
                className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
              >
                <span>Browse Practice Problems</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-700 dark:text-[#FAF9F5]">
                    04
                  </span>
                  <HelpCircle className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Ah-Ha Drawer Unstick
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  If blocked past 15 min, open progressive non-spoiler hints step-by-step instead of reading complete editorials.
                </p>
              </div>
              <Link
                to="/patterns/two-pointers"
                className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
              >
                <span>See Ah-Ha Drawers</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-700 dark:text-[#FAF9F5]">
                    05
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                  3-Tier Rating
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Record honest confidence: <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Mastered</span> (clean solo solve), <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Needs Review</span>, or <span className="inline-flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-400"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" />Struggled</span> (needed hints).
                </p>
              </div>
              <Link
                to="/progress"
                className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
              >
                <span>Track Confidence</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 6 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-700 dark:text-[#FAF9F5]">
                    06
                  </span>
                  <RotateCcw className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Revise Today Queue
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Your daily spaced repetition queue automatically resurfaces questions before memory decay sets in (Day 1, 3, 7).
                </p>
              </div>
              <Link
                to="/progress"
                className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
              >
                <span>Open Revision Queue</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Step 7 */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between md:col-span-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-700 dark:text-[#FAF9F5]">
                    07
                  </span>
                  <Building2 className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Company Frequency Targeting
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Filter by target employer across 6 recency windows (Last 30 Days to All Time). Apply mastered pattern invariants directly to actual company interview questions.
                </p>
              </div>
              <Link
                to="/companies"
                className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
              >
                <span>Explore 490 Companies</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Continuous Loop Feedback Indicator */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-800 dark:text-[#FAF9F5]">
              <Workflow className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757] shrink-0" />
              <span className="font-semibold">Closed Learning Circuit:</span>
              <span className="text-slate-600 dark:text-[#A8A69C]">
                Step 07 company practice triggers spaced repetition in Step 06, which routes back to Step 01 Invariants when unsticking is needed.
              </span>
            </div>
            <Link
              to="/patterns"
              className="text-[#0F1B3D] dark:text-[#D97757] font-bold hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Restart loop at Invariants</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      )}

      {/* Visual Module 3: Beginner Roadmap ("From 0 to Pattern Intuition") */}
      {(activeTab === 'all' || activeTab === 'beginner') && (
        <section
          id="panel-beginner"
          role="tabpanel"
          aria-labelledby="tab-beginner"
          className="space-y-8 pt-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                Beginner Roadmap: From 0 to Pattern Intuition
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C]">
              Structured 3-phase curriculum designed to replace brute-force trial and error with intuitive invariant recognition.
            </p>
          </div>

          {/* Quick diagnostic jump helper when navigated directly to Beginner */}
          {activeTab === 'beginner' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-2xs">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-[#A8A69C]">
                <HelpCircle className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757] shrink-0" />
                <span>Not sure if Beginner is your level? Take the 5-tap self-diagnostic in Overview.</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <span>Take 5-Tap Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 3 Milestone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Milestone 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  Weeks 1–2
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Phase 1: Linear Invariants
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                  Master contiguous subarrays, frequency maps, and dual pointers.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-800 dark:text-[#FAF9F5]">Core Invariants:</div>
                <ul className="space-y-1.5 text-slate-600 dark:text-[#A8A69C]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Hashing:</strong> O(1) identity verification</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Two Pointers:</strong> Monotonic search reduction</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Sliding Window:</strong> Expand right, shrink left</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-[#43433F]/80">
                <div className="text-[11px] text-slate-500 dark:text-[#A8A69C] mb-2">Milestone Target: 25 Solved</div>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    to="/patterns/hashing-and-frequency-counting"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5] hover:border-[#D97757]"
                  >
                    Hashing
                  </Link>
                  <Link
                    to="/patterns/two-pointers"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5] hover:border-[#D97757]"
                  >
                    Two Pointers
                  </Link>
                  <Link
                    to="/patterns/sliding-window"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5] hover:border-[#D97757]"
                  >
                    Sliding Window
                  </Link>
                </div>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Weeks 3–5
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Phase 2: Tree & Branching
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                  Conquer recursive call stacks, binary search predicates, and state trees.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-800 dark:text-[#FAF9F5]">Core Invariants:</div>
                <ul className="space-y-1.5 text-slate-600 dark:text-[#A8A69C]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Binary Search:</strong> Halve candidate intervals</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Tree DFS/BFS:</strong> Exhaustive node visitation</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Backtracking:</strong> Choose, explore, unchoose</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-[#43433F]/80">
                <div className="text-[11px] text-slate-500 dark:text-[#A8A69C] mb-2">Milestone Target: 40 Solved</div>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    to="/patterns/binary-search"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5]"
                  >
                    Binary Search
                  </Link>
                  <Link
                    to="/patterns/tree-dfs"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5]"
                  >
                    Tree DFS
                  </Link>
                  <Link
                    to="/patterns/tree-bfs"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5]"
                  >
                    Tree BFS
                  </Link>
                  <Link
                    to="/patterns/backtracking"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5]"
                  >
                    Backtracking
                  </Link>
                </div>
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
                  Weeks 6–8
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Phase 3: Graphs & Subproblems
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                  Represent systems as graph networks and memoize overlapping states.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-800 dark:text-[#FAF9F5]">Core Invariants:</div>
                <ul className="space-y-1.5 text-slate-600 dark:text-[#A8A69C]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Graph Traversal:</strong> Level-by-level shortest path & cycles</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Top K Heaps:</strong> Bounded priority order</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757]">•</span>
                    <span><strong>Dynamic Programming:</strong> Optimal substructure transitions</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-[#43433F]/80">
                <div className="text-[11px] text-slate-500 dark:text-[#A8A69C] mb-2">Milestone Target: 60+ Solved</div>
                <div className="flex flex-wrap gap-1.5">
                  <Link
                    to="/patterns/graph-traversal"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5]"
                  >
                    Graph Traversal
                  </Link>
                  <Link
                    to="/patterns/heap-top-k"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5]"
                  >
                    Top K Heaps
                  </Link>
                  <Link
                    to="/patterns/dynamic-programming"
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-medium text-slate-700 dark:text-[#FAF9F5]"
                  >
                    Dynamic Programming
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 15-Minute Rule Flowchart */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/90 dark:border-[#43433F] space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2">
                <Timer className="w-5 h-5 text-[#0F1B3D] dark:text-[#D97757]" />
                <span>The 15-Minute Rule Flowchart</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                Never spin your wheels for 90 minutes on a single problem. Follow this strict protocol to maximize neural retention.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  00:00 – 02:00
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Rephrase & Constraints
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Restate the problem in plain English. Check array length N to establish asymptotic time limit.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  02:00 – 05:00
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Scratchpad Invariant
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Write the core invariant on paper. Step through a 4-element test case without touching the keyboard.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  05:00 – 15:00
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Code Implementation
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Implement the solution cleanly. Maintain explicit loop invariants and clean pointer bounds.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  Minute 15
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Ah-Ha Progressive Unstick
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Stuck? Reveal Hint 1 in the pattern drawer. Do not open YouTube or the full solution editorial.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  Post-Solve
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Rate & Queue
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Tag <span className="font-semibold text-emerald-700 dark:text-emerald-400">Mastered</span>, <span className="font-semibold text-amber-700 dark:text-amber-400">Review</span>, or <span className="font-semibold text-rose-700 dark:text-rose-400">Struggled</span>. CompanyWise automatically schedules spaced repetition.
                </div>
              </div>
            </div>
          </div>

          {/* Foundation Invariants Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#FAF9F5]">
              Foundation Invariants Cheat Sheet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Sliding Window Invariant
                  </span>
                  <Link
                    to="/patterns/sliding-window"
                    className="text-[11px] text-[#0F1B3D] dark:text-[#D97757] font-semibold hover:underline"
                  >
                    View Pattern →
                  </Link>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  A window [L, R] remains valid by advancing R. Once invalid, increment L until the constraint holds. No redundant nested rescanning.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Two Pointers Invariant
                  </span>
                  <Link
                    to="/patterns/two-pointers"
                    className="text-[11px] text-[#0F1B3D] dark:text-[#D97757] font-semibold hover:underline"
                  >
                    View Pattern →
                  </Link>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  On sorted sequences, comparing elements at the opposite ends allows discarding an entire row, column, or half-space in O(1).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Binary Search Invariant
                  </span>
                  <Link
                    to="/patterns/binary-search"
                    className="text-[11px] text-[#0F1B3D] dark:text-[#D97757] font-semibold hover:underline"
                  >
                    View Pattern →
                  </Link>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Given any monotonic boolean condition P(x), the target boundary is strictly preserved within [low, high] across all iterations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Tree Traversal (DFS/BFS) Invariant
                  </span>
                  <Link
                    to="/patterns/tree-dfs"
                    className="text-[11px] text-[#0F1B3D] dark:text-[#D97757] font-semibold hover:underline"
                  >
                    View Pattern →
                  </Link>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  BFS guarantees discovering unweighted shortest paths level-by-level; DFS preserves path ancestor state from root to leaves.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Visual Module 4: Intermediate Sprint Roadmap ("2-6 Week High-Velocity Prep") */}
      {(activeTab === 'all' || activeTab === 'intermediate') && (
        <section
          id="panel-intermediate"
          role="tabpanel"
          aria-labelledby="tab-intermediate"
          className="space-y-8 pt-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                Intermediate Sprint Roadmap: 2–6 Week High-Velocity Prep
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C]">
              Engineered for candidates with DSA fundamentals facing upcoming interview rounds at Meta, Google, Amazon, or Microsoft.
            </p>
          </div>

          {/* Quick diagnostic jump helper when navigated directly to Intermediate */}
          {activeTab === 'intermediate' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-2xs">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-[#A8A69C]">
                <HelpCircle className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757] shrink-0" />
                <span>Need to verify your prerequisites? Check the 5-tap diagnostic self-test in Overview.</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <span>Take 5-Tap Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* "When Technique X Breaks -> Pivot to Y" Matrix */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2">
                <Split className="w-5 h-5 text-[#0F1B3D] dark:text-[#D97757]" />
                <span>When Technique X Breaks → Pivot to Y</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                Recognizing algorithmic failure modes in real time is what separates Senior/L5+ candidates from junior coders.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                  When BFS TLEs on Weighted Edges
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  <span>Pivot to:</span>
                  <span className="text-[#0F1B3D] dark:text-[#D97757]">Dijkstra / 0-1 BFS</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  FIFO queue fails because step count is not proportional to cost. Replace queue with a min-heap keyed on cumulative path weight.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                  When Hash Table Substring Search OOMs
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  <span>Pivot to:</span>
                  <span className="text-[#0F1B3D] dark:text-[#D97757]">Prefix Tree (Trie)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Hashing every prefix produces massive memory overhead. A Trie overlaps common prefixes into tree branches, bounding memory.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                  When Dependency Resolution / Cycles Get Messy
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  <span>Pivot to:</span>
                  <span className="text-[#0F1B3D] dark:text-[#D97757]">Kahn&apos;s Algorithm (Topo Sort)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  DFS recursion cycle tracking is error-prone. Compute in-degrees and push zero-indegree nodes into a BFS queue.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                  When Nested Loops O(N²) Find Next Greater
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  <span>Pivot to:</span>
                  <span className="text-[#0F1B3D] dark:text-[#D97757]">Monotonic Stack</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Searching backward or forward for the next larger element in O(N²) collapses to linear O(N) by enforcing a strict decreasing stack.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                  When Dynamic Connectivity Recomputation Slows Down
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  <span>Pivot to:</span>
                  <span className="text-[#0F1B3D] dark:text-[#D97757]">Union-Find (Disjoint Set)</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Rerunning BFS or DFS for every edge modification is wasteful. Disjoint set with path compression handles union/find in near O(1).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                <div className="text-[11px] font-bold text-red-600 dark:text-red-400">
                  When 1D DP Cannot Express 2nd Constraint
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  <span>Pivot to:</span>
                  <span className="text-[#0F1B3D] dark:text-[#D97757]">2D Dynamic Programming</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  When remaining capacity or budget cannot be implied by index alone, expand the state matrix to dp[index][capacity].
                </p>
              </div>
            </div>
          </div>

          {/* 6 Advanced Tracks */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#FAF9F5]">
              6 Advanced Sprint Tracks & Time Budgets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                      1. Dijkstra & Shortest Path
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      3–4 Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                    Priority queue relaxations, network delay time, cheapest flights with K stops.
                  </p>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-[#A8A69C]">
                    Target Companies: Amazon, Google, Uber
                  </div>
                </div>
                <Link
                  to="/patterns/dijkstras-algorithm"
                  className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
                >
                  <span>Explore Dijkstra Pattern</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                      2. Trie & Prefix Systems
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      2–3 Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                    Implement Trie, autocomplete systems, Word Search II backtracking hybrid.
                  </p>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-[#A8A69C]">
                    Target Companies: Google, Microsoft, Meta
                  </div>
                </div>
                <Link
                  to="/patterns/trie-prefix-tree"
                  className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
                >
                  <span>Explore Trie Pattern</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                      3. Kahn&apos;s Topo Sort & Dependencies
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      2–3 Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                    Course Schedule I & II, Alien Dictionary, build dependency resolving.
                  </p>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-[#A8A69C]">
                    Target Companies: Meta, Amazon, Apple
                  </div>
                </div>
                <Link
                  to="/patterns/topological-sort"
                  className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
                >
                  <span>Explore Topo Sort</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                      4. Monotonic Stack & Queue
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      3–4 Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                    Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water.
                  </p>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-[#A8A69C]">
                    Target Companies: Bloomberg, Google, ByteDance
                  </div>
                </div>
                <Link
                  to="/patterns/stack-and-monotonic-stack"
                  className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
                >
                  <span>Explore Monotonic Stack</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                      5. Union-Find / Disjoint Set
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      2–3 Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                    Number of Provinces, Redundant Connection, Accounts Merge.
                  </p>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-[#A8A69C]">
                    Target Companies: Amazon, Meta, Microsoft
                  </div>
                </div>
                <Link
                  to="/patterns/union-find"
                  className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
                >
                  <span>Explore Union-Find</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                      6. 2D DP & Knapsack
                    </span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      4–5 Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                    Unique Paths, Longest Common Subsequence, Target Sum, Edit Distance.
                  </p>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-[#A8A69C]">
                    Target Companies: Google, Bloomberg, Goldman Sachs
                  </div>
                </div>
                <Link
                  to="/patterns/dynamic-programming"
                  className="text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline inline-flex items-center gap-1 pt-2"
                >
                  <span>Explore Dynamic Programming</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Company Frequency Mining Guide */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/90 dark:border-[#43433F] space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0F1B3D] dark:text-[#D97757]" />
              <span>Target Company Frequency Mining Protocol</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
              How top candidates leverage CompanyWise data in the final 2 weeks before interview loops:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">1. Filter by 30-Day Window</div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Uncover recent shifts in question pools reported by candidates within the current hiring cycle.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">2. Target Top 20 Frequency</div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Prioritize problems with frequency scores &gt; 0.6. These questions appear repeatedly in screening rounds.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/80 dark:border-[#43433F] space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">3. Cross-Reference Invariants</div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  If Meta loves Binary Search variants, drill the invariant so altered problem constraints don&apos;t throw you off.
                </p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/companies"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors"
              >
                <span>Mine Company Datasets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Visual Module 4 Part 2: Mock Interview Protocol & Execution Playbook */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2">
                <MessageSquareCode className="w-5 h-5 text-[#0F1B3D] dark:text-[#D97757]" />
                <span>Mock Interview Protocol: The 45-Minute Execution Playbook</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C]">
                Senior candidates fail technical loops not from coding inability, but from poor pacing and silent thinking. Follow this exact minute-by-minute protocol.
              </p>
            </div>

            {/* 5-Stage Time Allocation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  00:00 – 05:00
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Clarify & Scope
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Ask about N scale, negative numbers, duplicates, and memory constraints. Restate expected return values.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  05:00 – 15:00
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Invariant Alignment
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Pitch brute force in 30s. State the optimal pattern invariant and asymptotic bounds. Obtain consensus before coding.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  15:00 – 35:00
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Modular Implementation
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Type idiomatic, clean code. Talk out loud through key pointer updates. Write small helpers for complex logic.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  35:00 – 40:00
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Manual Trace Table
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  Trace happy path + 1 edge case (empty array, 1 element) line-by-line with comments before saying &ldquo;I&apos;m finished&rdquo;.
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  40:00 – 45:00
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Complexity & Scale
                </div>
                <div className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                  State time and auxiliary memory Big-O. Address distributed scaling or stream processing follow-ups.
                </div>
              </div>
            </div>

            {/* 4 Execution Checklist Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Never Code in Silence
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                    Verbalize trade-offs continuously. Interviewers grade communication and problem formulation as strictly as working code.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Collaborate on Interviewer Hints
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                    When the interviewer asks &ldquo;What if elements were sorted?&rdquo;, pivot immediately. Hints are directional gifts, not penalties.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Dry-Run Edge Cases by Hand
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                    Catching off-by-one errors yourself during a manual walkthrough signals senior maturity; relying on the interviewer to point it out hurts.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Record and Audit Peer Sessions
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-snug">
                    Record your practice sessions. Watching playback reveals verbal crutches, pace stalling, and points where explanation clarity lagged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Visual Module 5: Visual "Feature Compass" Cheat Sheet */}
      {(activeTab === 'all' || activeTab === 'compass') && (
        <section
          id="panel-compass"
          role="tabpanel"
          aria-labelledby="tab-compass"
          className="space-y-6 pt-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                Feature Compass: From Frustration to Feature
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C]">
              Map common interview preparation roadblocks directly to dedicated CompanyWise capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Frustration:
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] italic">
                  &ldquo;I freeze when facing an unseen problem I haven&apos;t memorized.&rdquo;
                </div>
                <div className="pt-1 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  Solution: Pattern Invariants & Visualizer
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Internalize the 18 core invariant definitions. Walk custom inputs through visual pointer movements to build mental models.
                </p>
              </div>
              <Link
                to="/patterns"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline pt-2"
              >
                <span>Explore Patterns</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Frustration:
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] italic">
                  &ldquo;I don&apos;t know what Google or Meta actually ask in interviews today.&rdquo;
                </div>
                <div className="pt-1 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  Solution: Verified Company Recency Windows
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Query 490 companies filtered across 6 recency snapshots from Last 30 Days to All Time, sorted by verified appearance frequency.
                </p>
              </div>
              <Link
                to="/companies"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline pt-2"
              >
                <span>View Companies</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Frustration:
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] italic">
                  &ldquo;I solve questions but forget the solution 2 weeks later.&rdquo;
                </div>
                <div className="pt-1 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  Solution: 3-Tier Rating & Spaced Repetition
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Rate questions <span className="font-semibold text-emerald-700 dark:text-emerald-400">Mastered</span>, <span className="font-semibold text-amber-700 dark:text-amber-400">Needs Review</span>, or <span className="font-semibold text-rose-700 dark:text-rose-400">Struggled</span>. CompanyWise surfaces questions right at the point of forgetting.
                </p>
              </div>
              <Link
                to="/progress"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline pt-2"
              >
                <span>Open Progress & Revision</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Frustration:
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] italic">
                  &ldquo;I get stuck and look at the full solution editorial too quickly.&rdquo;
                </div>
                <div className="pt-1 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  Solution: Progressive Ah-Ha Drawer
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Reveal hints in 3 progressive tiers without spoiling the code implementation, preserving critical problem-solving struggle.
                </p>
              </div>
              <Link
                to="/patterns"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline pt-2"
              >
                <span>Test Ah-Ha Drawers</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Card 5 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3 flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Frustration:
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] italic">
                  &ldquo;I am completely overwhelmed by 3,400+ problems on LeetCode.&rdquo;
                </div>
                <div className="pt-1 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757]">
                  Solution: 18 High-Yield Pattern Families
                </div>
                <p className="text-[11px] text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Cut through noise with curated patterns mapped to canonical problems. 90% of technical loops test the same 18 patterns.
                </p>
              </div>
              <Link
                to="/problems"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline pt-2"
              >
                <span>Browse Curated Questions</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Action Footer */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]">
          Ready to kick off your preparation?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] max-w-xl mx-auto">
          Start by exploring foundational pattern invariants or jump straight into questions asked by 490 tech companies.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/patterns"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shadow-xs"
          >
            Explore Patterns
          </Link>
          <Link
            to="/companies"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#1F1E1D] hover:bg-slate-50 dark:hover:bg-[#262624] text-slate-700 dark:text-[#FAF9F5] border border-slate-200 dark:border-[#43433F] transition-colors"
          >
            Explore Companies
          </Link>
          <Link
            to="/problems"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#1F1E1D] hover:bg-slate-50 dark:hover:bg-[#262624] text-slate-700 dark:text-[#FAF9F5] border border-slate-200 dark:border-[#43433F] transition-colors"
          >
            Browse Problems
          </Link>
        </div>
      </section>
    </div>
  );
}
