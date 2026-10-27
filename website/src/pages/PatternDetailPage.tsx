import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Layers,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  CheckCircle2,
  Code2,
  HelpCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { PATTERNS_CATALOG } from '../data/patternsData';
import SlidingWindowVisualizer from '../components/patterns/SlidingWindowVisualizer';
import CodeComparison from '../components/patterns/CodeComparison';
import PracticeQuestionsSection from '../components/patterns/PracticeQuestionsSection';
import UnderstandingCheck from '../components/patterns/UnderstandingCheck';

interface NavModule {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MODULES: NavModule[] = [
  {
    id: 'intro',
    title: 'Introduction',
    subtitle: 'What is a Sliding Window?',
    icon: BookOpen,
  },
  {
    id: 'recognizing',
    title: 'Recognizing the Pattern',
    subtitle: 'When to use it?',
    icon: Eye,
  },
  {
    id: 'fixed-size',
    title: 'Fixed-size Window',
    subtitle: 'Solve by size examples',
    icon: Layers,
  },
  {
    id: 'variable-size',
    title: 'Variable-size Window',
    subtitle: 'Expanding and shrinking',
    icon: Sliders,
  },
  {
    id: 'visualizer',
    title: 'Interactive Visualization',
    subtitle: 'See it in action',
    icon: Sparkles,
  },
  {
    id: 'implementation',
    title: 'Implementation',
    subtitle: 'Code and complexity',
    icon: Code2,
  },
  {
    id: 'practice',
    title: 'Practice Problems',
    subtitle: 'Curated questions',
    icon: CheckCircle2,
  },
  {
    id: 'understanding',
    title: 'Understanding Check',
    subtitle: 'Test your knowledge',
    icon: HelpCircle,
  },
];

export default function PatternDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeModule, setActiveModule] = useState<string>('intro');

  const pattern = PATTERNS_CATALOG.find(p => p.slug === slug);

  // Scrollspy to update active module indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const m of MODULES) {
        const el = document.getElementById(m.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveModule(m.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveModule(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!pattern) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]">
          Pattern Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#A8A69C] max-w-md">
          The requested pattern module does not exist or has moved.
        </p>
        <Link
          to="/patterns"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patterns</span>
        </Link>
      </div>
    );
  }

  // If the pattern is upcoming, show an elegant Coming Soon view
  if (pattern.availability === 'upcoming') {
    return (
      <div className="min-h-[70vh] py-12 space-y-8 max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#A8A69C]">
          <Link to="/patterns" className="hover:text-slate-900 dark:hover:text-[#FAF9F5]">
            Patterns
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-[#FAF9F5] font-semibold">{pattern.title}</span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-8 sm:p-12 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E1E1C] border border-slate-200 dark:border-[#43433F] text-xs font-semibold text-slate-600 dark:text-[#A8A69C]">
              <span>Track Level: {pattern.level}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-[#FAF9F5]">
              {pattern.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-[#A8A69C] max-w-xl mx-auto leading-relaxed">
              {pattern.shortDescription}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] max-w-lg mx-auto text-left space-y-2">
            <div className="text-xs font-bold text-slate-700 dark:text-[#FAF9F5]">
              Curriculum Roadmap:
            </div>
            <ul className="text-xs text-slate-500 dark:text-[#A8A69C] space-y-1 list-disc list-inside">
              <li>Comprehensive conceptual intuition guide</li>
              <li>Interactive step-by-step algorithm visualizer</li>
              <li>Dual-language code templates (Python & TypeScript)</li>
              <li>Curated LeetCode interview questions indexed by top companies</li>
            </ul>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/patterns/sliding-window"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Explore Sliding Window (Available Now) →
            </Link>
            <Link
              to="/patterns"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#43433F] bg-white dark:bg-[#262624] text-slate-700 dark:text-[#FAF9F5] font-semibold text-xs hover:bg-slate-50 dark:hover:bg-[#30302E] transition-colors"
            >
              All Patterns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Full Sliding Window Learning Module
  return (
    <div className="min-h-screen py-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#A8A69C]">
        <Link to="/patterns" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Patterns
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-[#FAF9F5] font-semibold">{pattern.title}</span>
      </div>

      {/* Hero Header matching screenshot */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-[#43433F] bg-white dark:bg-[#262624] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Mint Green Circle Badge with Window Icon */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" fillOpacity="0.2" />
                <path d="M7 12h10" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                {pattern.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] max-w-2xl leading-relaxed">
                {pattern.shortDescription}
              </p>
            </div>
          </div>

          {/* Right Badges */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50">
              Foundation
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/50">
              Arrays & Strings
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Learning Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Sidebar Navigator (desktop) */}
        <div className="lg:col-span-4 sticky top-20 hidden lg:block">
          <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-3 shadow-xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Modules in this Track
            </div>

            {MODULES.map((mod, idx) => {
              const isActive = activeModule === mod.id;

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => scrollToSection(mod.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 shadow-2xs'
                      : 'hover:bg-slate-50 dark:hover:bg-[#1E1E1C] border border-transparent'
                  }`}
                >
                  {/* Numbered Circle Indicator */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-500 dark:bg-[#1E1E1C] dark:text-[#A8A69C]'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="overflow-hidden">
                    <div
                      className={`text-xs font-bold truncate ${
                        isActive
                          ? 'text-blue-900 dark:text-blue-200'
                          : 'text-slate-800 dark:text-[#FAF9F5]'
                      }`}
                    >
                      {mod.title}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-[#8E8C82] truncate">
                      {mod.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Content Stream */}
        <div className="lg:col-span-8 space-y-8">
          {/* Module 1: Introduction */}
          <section
            id="intro"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#383835]">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                What is a Sliding Window?
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed space-y-3">
              <p>
                The <strong>Sliding Window</strong> technique is an algorithmic pattern designed to convert inefficient nested-loop calculations over contiguous sequences (subarrays or substrings) into linear time <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1E1E1C] font-mono text-blue-600 dark:text-blue-400 font-bold">O(N)</code> solutions.
              </p>
              <p>
                Instead of recalculating overlapping portions of the data structure from scratch every time, a &ldquo;window&rdquo; of elements maintains a rolling state. When moving the window forward:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-700 dark:text-[#FAF9F5]">
                <li><strong>Subtract or remove</strong> the single element exiting on the left boundary (<code className="font-mono text-xs">left</code>).</li>
                <li><strong>Add or incorporate</strong> the single new element entering on the right boundary (<code className="font-mono text-xs">right</code>).</li>
                <li><strong>Update</strong> the target metric (sum, frequencies, distinct count) in <code className="font-mono text-xs font-semibold">O(1)</code> amortized time.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>💡</span> Core Applicability Invariant:
              </div>
              <p>
                Not every contiguous subarray problem qualifies for Sliding Window. The technique requires that window state transitions are <strong>locally invertible or incrementally composable</strong> (i.e. adding an entering element and removing an exiting element takes <code className="font-mono text-[11px]">O(1)</code>) and that valid window boundaries satisfy monotonic expansion/contraction invariants.
              </p>
            </div>
          </section>

          {/* Module 2: Recognizing the Pattern */}
          <section
            id="recognizing"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#383835]">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                Recognizing the Pattern
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Keywords & Signals */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Keywords & Signals to Look For
                  </h3>
                  <ul className="text-xs text-slate-600 dark:text-[#A8A69C] space-y-1 list-disc list-inside">
                    <li>"Contiguous subarray" or "substring"</li>
                    <li>"Window of fixed size k"</li>
                    <li>"Longest substring with at most k distinct chars"</li>
                    <li>"Minimum size subarray whose sum &gt;= target"</li>
                    <li>"Substrings containing all characters of pattern"</li>
                  </ul>
                </div>

                {/* When NOT to Use */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    When NOT to Use Sliding Window
                  </h3>
                  <ul className="text-xs text-slate-600 dark:text-[#A8A69C] space-y-1 list-disc list-inside">
                    <li><strong>Subsequences:</strong> Non-contiguous choices (use DP or Greedy).</li>
                    <li><strong>Negative numbers in sum problems:</strong> Breaks monotonic window expansion/contraction (use Prefix Sum + Hash Map).</li>
                    <li><strong>Arbitrary index queries:</strong> Requires segment trees or interval trees.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Module 3: Fixed-size Window */}
          <section
            id="fixed-size"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#383835]">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                Fixed-size Window Pattern
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed space-y-3">
              <p>
                In a fixed-size window, the window length <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1E1E1C] font-mono text-xs font-bold">k</code> is constant throughout execution. The standard recipe consists of two clean phases:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#383835] bg-slate-50/60 dark:bg-[#1E1E1C]/60 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-[#FAF9F5] text-xs">Phase 1: Build the First Window</div>
                  <p className="text-xs text-slate-500 dark:text-[#A8A69C]">
                    Iterate from <code className="font-mono text-[11px]">0</code> to <code className="font-mono text-[11px]">k - 1</code> and compute the initial state (sum, character frequency map, etc.).
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#383835] bg-slate-50/60 dark:bg-[#1E1E1C]/60 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-[#FAF9F5] text-xs">Phase 2: Slide Across the Sequence</div>
                  <p className="text-xs text-slate-500 dark:text-[#A8A69C]">
                    Iterate from <code className="font-mono text-[11px]">k</code> to <code className="font-mono text-[11px]">n - 1</code>. In each step, remove <code className="font-mono text-[11px]">nums[i - k]</code>, add <code className="font-mono text-[11px]">nums[i]</code>, and record the answer.
                  </p>
                </div>
              </div>

              {/* Edge Cases & Negative Numbers in Fixed Windows */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1E1E1C] border border-slate-200/80 dark:border-[#383835] space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-1.5">
                  <span>⚡</span> Negative Numbers & Boundary Considerations:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-[#A8A69C]">
                  <li>
                    <strong>Negative numbers are fully supported in fixed windows:</strong> Because the rolling sum update (<code className="font-mono text-[11px]">sum += nums[i] - nums[i - k]</code>) is purely algebraic addition/subtraction, negative values do not break the calculation.
                  </li>
                  <li>
                    <strong>Input boundaries:</strong> If <code className="font-mono text-[11px]">k &gt; n</code>, no valid window exists; return <code className="font-mono text-[11px]">0</code> or throw depending on problem spec. When <code className="font-mono text-[11px]">k === 1</code>, the problem reduces to finding the maximum single element.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Module 4: Variable-size Window */}
          <section
            id="variable-size"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#262624] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#383835]">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                Variable-size Window Pattern & Monotonicity
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed space-y-3">
              <p>
                In variable-size problems (e.g. <em>LeetCode #3: Longest Substring Without Repeating Characters</em> or <em>LeetCode #209: Minimum Size Subarray Sum</em>), the window expands and contracts dynamically using two pointers (<code className="font-mono text-xs">left</code> and <code className="font-mono text-xs">right</code>):
              </p>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800">
                <code>{`left = 0
for right in range(len(nums)):
    # 1. Expand: Include nums[right] in current window
    add_to_window(nums[right])
    
    # 2. Contract: Shrink from left while window condition is violated (or to find minimum)
    while window_is_invalid():
        remove_from_window(nums[left])
        left += 1
        
    # 3. Update answer with valid window: (right - left + 1)
    max_len = max(max_len, right - left + 1)`}</code>
              </pre>

              {/* Monotonicity and Negative Numbers Caveat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <span>⚠️</span> The Monotonicity Requirement:
                  </div>
                  <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                    Variable-size windows on sums require <strong>non-negative values</strong>. Why? When all values are non-negative, expanding right monotonically <em>increases</em> the sum, and shrinking left monotonically <em>decreases</em> it.
                  </p>
                  <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                    If negative numbers are present, shrinking could unpredictably increase the sum! In that scenario, use <strong>Prefix Sum + Hash Map</strong> (LeetCode #560) or <strong>Prefix Sum + Monotonic Deque</strong> (LeetCode #862).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 space-y-2 text-xs">
                  <div className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <span>💡</span> Window Extrema (Min/Max):
                  </div>
                  <p className="text-purple-800 dark:text-purple-400 leading-relaxed">
                    Can we track the window maximum with a single variable? <strong>No!</strong> When the current maximum leaves the window on the left, you cannot know the second-largest element without rescanning the window in <code className="font-mono text-[11px]">O(K)</code> time.
                  </p>
                  <p className="text-purple-800 dark:text-purple-400 leading-relaxed">
                    To maintain sliding window minimum or maximum in <code className="font-mono text-[11px]">O(1)</code> amortized time, use a <strong>Monotonic Deque</strong> (double-ended queue storing indices in monotonic order, e.g. <em>LeetCode #239</em>).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Module 5: Interactive Visualizer */}
          <section id="visualizer">
            <SlidingWindowVisualizer />
          </section>

          {/* Module 6: Implementation & Code Comparison */}
          <section id="implementation">
            <CodeComparison />
          </section>

          {/* Module 7: Curated Practice Problems */}
          <section id="practice">
            <PracticeQuestionsSection />
          </section>

          {/* Module 8: Understanding Check */}
          <section id="understanding">
            <UnderstandingCheck />
          </section>
        </div>
      </div>
    </div>
  );
}
