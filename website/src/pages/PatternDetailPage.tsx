import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  BookOpen,
  Eye,
  Sliders,
  CheckCircle2,
  Code2,
  HelpCircle,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
  Lightbulb,
  Zap,
  AlertTriangle,
  Copy,
  Check,
  Maximize2,
  CheckCircle,
} from 'lucide-react';
import { PATTERNS_CATALOG } from '../data/patternsData';
import { getPatternContent } from '../data/patterns/patternRegistry';
import PatternVisualizerHost from '../components/patterns/PatternVisualizerHost';
import CodeComparison from '../components/patterns/CodeComparison';
import PracticeQuestionsSection from '../components/patterns/PracticeQuestionsSection';
import UnderstandingCheck from '../components/patterns/UnderstandingCheck';
import CodeSnippetModal from '../components/patterns/CodeSnippetModal';
import PatternIcon from '../components/patterns/PatternIcon';

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
    subtitle: 'Conceptual Foundations',
    icon: BookOpen,
  },
  {
    id: 'recognizing',
    title: 'Recognizing Pattern',
    subtitle: 'When to use it?',
    icon: Eye,
  },
  {
    id: 'core-technique',
    title: 'Core Technique',
    subtitle: 'Algorithmic Invariant',
    icon: Layers,
  },
  {
    id: 'variations',
    title: 'Key Variations',
    subtitle: 'Subpatterns & Flavors',
    icon: Sliders,
  },
  {
    id: 'visualizer',
    title: 'Visualization',
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [activeCodeLang, setActiveCodeLang] = useState<'python' | 'typescript'>('python');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const pattern = useMemo(() => PATTERNS_CATALOG.find(p => p.slug === slug), [slug]);
  const patternContent = useMemo(() => (slug ? getPatternContent(slug) : undefined), [slug]);

  const handleCopyTemplate = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] font-semibold text-xs shadow-xs transition-colors"
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
          <Link to="/patterns" className="hover:text-[#0F1B3D] dark:hover:text-[#D97757] transition-colors">
            Patterns
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-[#FAF9F5] font-semibold">{pattern.title}</span>
        </div>

        <div className="rounded-3xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-8 sm:p-12 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] text-xs font-semibold text-slate-600 dark:text-[#A8A69C]">
              <span>Track Level: {pattern.level}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-[#FAF9F5]">
              {pattern.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-[#A8A69C] max-w-xl mx-auto leading-relaxed">
              {pattern.shortDescription}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] max-w-lg mx-auto text-left space-y-2">
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
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] font-semibold text-xs transition-colors shadow-xs"
            >
              <span>Explore Sliding Window</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/patterns"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#43433F] bg-white dark:bg-[#30302E] text-slate-700 dark:text-[#FAF9F5] font-semibold text-xs hover:bg-slate-50 dark:hover:bg-[#1F1E1D] transition-colors"
            >
              All Patterns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Level badge styling
  const levelBadgeClass = (() => {
    switch (pattern.level) {
      case 'Foundation':
        return 'bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50';
    }
  })();

  const currentTemplate = activeCodeLang === 'python'
    ? (patternContent?.pythonTemplate || '')
    : (patternContent?.tsTemplate || '');

  return (
    <div className="min-h-screen py-4 sm:py-6 space-y-5 sm:space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#A8A69C]">
        <Link to="/patterns" className="hover:text-[#0F1B3D] dark:hover:text-[#D97757] transition-colors">
          Patterns
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-[#FAF9F5] font-semibold">{pattern.title}</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/50 border border-emerald-300/80 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-2xs">
              <PatternIcon slug={pattern.slug} name={pattern.title} className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>

            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                {pattern.title}
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-[#A8A69C] max-w-xl leading-relaxed">
                {pattern.shortDescription}
              </p>
            </div>
          </div>

          {/* Right Badges */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${levelBadgeClass}`}>
              {pattern.level}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/50">
              {pattern.category}
            </span>
            {pattern.companiesTop && pattern.companiesTop.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-[#1F1E1D] dark:text-[#A8A69C] dark:border-[#43433F]">
                {pattern.companiesTop.slice(0, 3).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Module Accordion */}
      <div className="lg:hidden rounded-xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-3 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileModulesOpen(!mobileModulesOpen)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-900 dark:text-[#FAF9F5] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] flex items-center justify-center font-bold">
              {MODULES.findIndex(m => m.id === activeModule) + 1}
            </span>
            <span className="truncate">
              Track Module: {MODULES.find(m => m.id === activeModule)?.title}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileModulesOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileModulesOpen && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#43433F]/70 space-y-1">
            {MODULES.map((mod, idx) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  scrollToSection(mod.id);
                  setMobileModulesOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                  activeModule === mod.id
                    ? 'bg-[#0F1B3D]/5 dark:bg-[#D97757]/15 text-[#0F1B3D] dark:text-[#FAF9F5] font-bold'
                    : 'text-slate-600 dark:text-[#A8A69C] hover:bg-slate-50 dark:hover:bg-[#1F1E1D]'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#1F1E1D] font-mono text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{mod.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Two-Column Learning Layout with Collapsible Desktop Rail */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sticky Sidebar Navigator (desktop) */}
        <div
          className={`sticky top-20 hidden lg:block transition-all duration-300 shrink-0 ${
            isSidebarCollapsed ? 'w-14' : 'w-72'
          }`}
        >
          <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-2.5 shadow-2xs space-y-1">
            {isSidebarCollapsed ? (
              /* Collapsed Slim Rail */
              <div className="flex flex-col items-center gap-1.5 py-1">
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="p-1.5 rounded-lg text-[#0F1B3D] dark:text-[#D97757] hover:bg-slate-100 dark:hover:bg-[#1F1E1D] cursor-pointer transition-colors"
                  title="Expand modules sidebar"
                  aria-label="Expand modules sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
                <div className="w-6 h-px bg-slate-200 dark:bg-[#43433F] my-0.5" />
                {MODULES.map((mod, idx) => {
                  const isActive = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => scrollToSection(mod.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer relative group ${
                        isActive
                          ? 'bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] shadow-2xs scale-105'
                          : 'bg-slate-100 text-slate-500 dark:bg-[#1F1E1D] dark:text-[#A8A69C] hover:bg-slate-200 dark:hover:bg-[#262624]'
                      }`}
                      title={`Step ${idx + 1}: ${mod.title}`}
                      aria-label={mod.title}
                    >
                      {idx + 1}
                      <span className="absolute left-10 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-sans font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md">
                        {mod.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Expanded Full Sidebar */
              <>
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-100 dark:border-[#43433F]/70 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Modules in Track
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSidebarCollapsed(true)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D] cursor-pointer transition-colors"
                    title="Collapse modules sidebar (more room for content)"
                    aria-label="Collapse modules sidebar"
                  >
                    <PanelLeftClose className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {MODULES.map((mod, idx) => {
                    const isActive = activeModule === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => scrollToSection(mod.id)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#0F1B3D]/5 dark:bg-[#D97757]/15 border border-[#0F1B3D]/20 dark:border-[#D97757]/30 shadow-2xs'
                            : 'hover:bg-slate-50 dark:hover:bg-[#1F1E1D] border border-transparent'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] shadow-2xs'
                              : 'bg-slate-100 text-slate-500 dark:bg-[#1F1E1D] dark:text-[#A8A69C]'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="overflow-hidden">
                          <div
                            className={`text-xs font-bold truncate ${
                              isActive
                                ? 'text-[#0F1B3D] dark:text-[#FAF9F5]'
                                : 'text-slate-800 dark:text-[#FAF9F5]'
                            }`}
                          >
                            {mod.title}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-[#8E8C82] truncate">
                            {mod.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Main Content Stream */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Collapsed notification pill for quick expand */}
          {isSidebarCollapsed && (
            <div className="hidden lg:flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] text-xs">
              <span className="text-slate-500 dark:text-[#A8A69C] text-[11px]">
                Showing full-width content view. Track modules are collapsed into the left icon rail.
              </span>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="flex items-center gap-1 font-semibold text-[#0F1B3D] dark:text-[#D97757] hover:underline cursor-pointer"
              >
                <PanelLeftOpen className="w-3.5 h-3.5" />
                <span>Expand Sidebar</span>
              </button>
            </div>
          )}

          {/* Module 1: Introduction */}
          <section
            id="intro"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#43433F]/70">
              <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5]">
                {patternContent?.introTitle || `What is ${pattern.title}?`}
              </h2>
            </div>

            <div className="text-xs sm:text-[13px] text-slate-600 dark:text-[#A8A69C] leading-relaxed space-y-2.5">
              {patternContent?.introDescription.map((desc, i) => (
                <p key={i}>{desc}</p>
              ))}
            </div>

            {/* Motivating Problem Card */}
            {patternContent?.motivatingProblem && (
              <div className="rounded-xl border border-slate-200/80 dark:border-[#43433F] bg-slate-50/70 dark:bg-[#1F1E1D]/70 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Motivating Problem: {patternContent.motivatingProblem.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  {patternContent.motivatingProblem.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-1">
                    <div className="text-xs font-bold text-rose-800 dark:text-rose-300">
                      Naive Approach
                    </div>
                    <p className="text-xs text-rose-700 dark:text-rose-400">
                      {patternContent.motivatingProblem.naiveApproach}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Optimal Approach
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      {patternContent.motivatingProblem.optimalApproach}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Applicability Invariant Card */}
            {patternContent?.applicabilityInvariant && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] text-xs text-slate-800 dark:text-[#FAF9F5] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757] shrink-0" />
                  <span>Core Applicability Invariant:</span>
                </div>
                <p className="leading-relaxed text-slate-600 dark:text-[#A8A69C]">
                  {patternContent.applicabilityInvariant}
                </p>
              </div>
            )}
          </section>

          {/* Module 2: Recognizing the Pattern */}
          <section
            id="recognizing"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#43433F]/70">
              <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5]">
                Recognizing the Pattern
              </h2>
            </div>

            <div className="space-y-3 text-xs sm:text-[13px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Keywords & Signals */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Keywords & Signals to Look For
                  </h3>
                  <ul className="text-xs text-slate-600 dark:text-[#A8A69C] space-y-1.5 list-disc list-inside">
                    {patternContent?.signals.map((sig, i) => (
                      <li key={i}>{sig}</li>
                    ))}
                  </ul>
                </div>

                {/* When NOT to Use */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    When NOT to Use (Anti-Signals)
                  </h3>
                  <ul className="text-xs text-slate-600 dark:text-[#A8A69C] space-y-1.5 list-disc list-inside">
                    {patternContent?.antiSignals.map((anti, i) => (
                      <li key={i}>{anti}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Module 3: Core Technique */}
          <section
            id="core-technique"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#43433F]/70">
              <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5]">
                {patternContent?.coreTechniqueTitle || 'Core Technique & Algorithmic Steps'}
              </h2>
            </div>

            <div className="text-xs sm:text-[13px] text-slate-600 dark:text-[#A8A69C] leading-relaxed space-y-3">
              <p>{patternContent?.coreTechniqueDescription}</p>

              {/* Step by step cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {patternContent?.coreTechniqueSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-[#43433F] bg-slate-50/60 dark:bg-[#1F1E1D]/60 space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#0F1B3D]/10 text-[#0F1B3D] dark:bg-[#D97757]/20 dark:text-[#D97757] font-mono text-[11px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="font-bold text-slate-900 dark:text-[#FAF9F5] text-xs">
                        {step.title}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#A8A69C] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Loop Invariant */}
              {patternContent?.loopInvariant && (
                <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 space-y-1 text-xs">
                  <div className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span>Algorithmic & Loop Invariant:</span>
                  </div>
                  <p className="text-purple-800 dark:text-purple-400 leading-relaxed">
                    {patternContent.loopInvariant}
                  </p>
                </div>
              )}

              {/* Pedagogical Distinction Callout for Sliding Window */}
              {pattern.slug === 'sliding-window' && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Monotonicity & Negative Numbers Distinctions:</span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                    Variable-size sliding windows require non-negative values to ensure monotonicity (e.g. <strong>LeetCode #209</strong>: Minimum Size Subarray Sum). If negative numbers are present, running sums fluctuate, requiring specialized techniques:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-amber-800 dark:text-amber-400 leading-relaxed text-[11px]">
                    <li><strong>Shortest subarray with sum &ge; K with negatives:</strong> <strong>Prefix Sum + Monotonic Deque</strong> (<strong>LeetCode #862</strong>, O(N) time).</li>
                    <li><strong>Subarrays with exact sum = K with negatives:</strong> <strong>Prefix Sum + Hash Map</strong> (<strong>LeetCode #560</strong>, O(N) time).</li>
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Module 4: Key Variations */}
          <section
            id="variations"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#43433F]/70">
              <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5]">
                Key Variations & Subpatterns
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-[13px]">
              {patternContent?.variations.map(variation => (
                <div
                  key={variation.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#43433F] bg-slate-50/70 dark:bg-[#1F1E1D]/70 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-[#FAF9F5] text-xs">
                        {variation.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-[#262624] text-slate-600 dark:text-[#A8A69C]">
                        {variation.exampleProblem}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                      {variation.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 dark:border-[#43433F]/70 text-[11px] text-slate-500 dark:text-[#8E8C82]">
                    <strong className="text-slate-700 dark:text-[#FAF9F5]">Key Idea: </strong>
                    {variation.keyIdea}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Module 5: Interactive Visualizer */}
          <section id="visualizer">
            <PatternVisualizerHost
              slug={pattern.slug}
              title={pattern.title}
              subtitle={patternContent?.visualizerSubtitle}
            />
          </section>

          {/* Module 6: Implementation & Code Templates */}
          <section
            id="implementation"
            className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-[#43433F]/70">
              <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center">
                6
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5]">
                Canonical Code Implementation & Complexity
              </h2>
            </div>

            {/* Template Box with Language Toggle and Expand */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-950/70 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-slate-300" />
                  <span className="font-mono text-[11px] font-semibold text-slate-300">
                    {activeCodeLang === 'python' ? 'pattern_template.py' : 'pattern_template.ts'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Language switch */}
                  <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700/80 mr-1">
                    <button
                      type="button"
                      onClick={() => setActiveCodeLang('python')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        activeCodeLang === 'python'
                          ? 'bg-[#0F1B3D] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Python
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeLang('typescript')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        activeCodeLang === 'typescript'
                          ? 'bg-[#0F1B3D] text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      TypeScript
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCodeModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer"
                    title="Expand in big card popup"
                  >
                    <Maximize2 className="w-3 h-3 text-slate-400" />
                    <span>Expand</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyTemplate(currentTemplate)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer"
                    title="Copy code template"
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <pre className="p-3 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto">
                <code>{currentTemplate}</code>
              </pre>
            </div>

            {/* Code Comparison / Walkthrough for canonical problem */}
            {patternContent && (
              <CodeComparison
                title={patternContent.exampleProblemTitle}
                subtitle={patternContent.exampleProblemDescription}
                pythonOptimized={patternContent.pythonExample}
                tsOptimized={patternContent.tsExample}
                optimizedComplexity={patternContent.complexity}
              />
            )}

            {/* Pitfalls & Common Mistakes */}
            {patternContent?.pitfalls && patternContent.pitfalls.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-1.5 text-xs">
                <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Common Pitfalls & Edge Cases:</span>
                </div>
                <ul className="text-xs text-amber-800 dark:text-amber-400 space-y-1 list-disc list-inside">
                  {patternContent.pitfalls.map((pitfall, i) => (
                    <li key={i}>{pitfall}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Module 7: Curated Practice Problems */}
          <section id="practice">
            <PracticeQuestionsSection
              mappings={patternContent?.mappings}
              subpatternTabs={patternContent?.subpatternTabs}
              patternTitle={`Practice: ${pattern.title}`}
              patternDescription={`Curated interview questions for ${pattern.title} indexed by frequency and top companies.`}
            />
          </section>

          {/* Module 8: Understanding Check */}
          <section id="understanding">
            <UnderstandingCheck
              quiz={patternContent?.quiz}
              patternTitle={`Understanding Check: ${pattern.title}`}
              patternDescription={`Verify your intuitive and conceptual grasp of ${pattern.title}.`}
            />
          </section>
        </div>
      </div>

      {/* Big Card Code Modal for Pattern Template */}
      {patternContent && (
        <CodeSnippetModal
          isOpen={codeModalOpen}
          onClose={() => setCodeModalOpen(false)}
          title={`${pattern.title} Canonical Template`}
          subtitle={`Standard boilerplate and invariants for ${pattern.title}`}
          timeComplexity={patternContent.complexity.time}
          spaceComplexity={patternContent.complexity.space}
          languages={[
            {
              id: 'python',
              label: 'Python',
              code: patternContent.pythonTemplate,
            },
            {
              id: 'typescript',
              label: 'TypeScript',
              code: patternContent.tsTemplate,
            },
          ]}
          activeLanguage={activeCodeLang}
          onLanguageChange={lang => setActiveCodeLang(lang as 'python' | 'typescript')}
        />
      )}
    </div>
  );
}
