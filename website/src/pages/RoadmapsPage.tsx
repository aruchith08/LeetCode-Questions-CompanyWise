import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Workflow,
  Timer,
  GitFork,
  ArrowRight,
  Sparkles,
  Building2,
  Code2,
  Layers,
  FileCode2,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  ExternalLink,
  Flame,
  Boxes,
  HelpCircle
} from 'lucide-react';

type ArchitecturalProposal = 'dag-tree' | 'company-sprint' | 'pivot-matrix';

interface ProposalSpec {
  id: ArchitecturalProposal;
  label: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  bestFor: string;
  cognitiveLoad: 'Low' | 'Medium' | 'High';
  timelineYield: '2–3 Months' | '2–6 Weeks' | 'Any / Just-in-Time';
  summary: string;
  schematicTitle: string;
  schematicSteps: {
    tier: string;
    title: string;
    description: string;
    patterns: { name: string; slug: string }[];
    status: 'prerequisite' | 'core' | 'capstone';
  }[];
  tradeoffs: {
    pros: string[];
    cons: string[];
  };
}

const PROPOSALS: Record<ArchitecturalProposal, ProposalSpec> = {
  'dag-tree': {
    id: 'dag-tree',
    label: 'Model A: Interactive Skill Tree DAG',
    badge: 'STRUCTURAL MASTERY',
    icon: Workflow,
    tagline: 'Dependency graph progression from foundational invariants to non-linear structures.',
    bestFor: 'Candidates with 2–4 months who want rock-solid algorithmic intuition and zero knowledge gaps.',
    cognitiveLoad: 'Medium',
    timelineYield: '2–3 Months',
    summary:
      'Models algorithmic problem solving as a Directed Acyclic Graph (DAG). Candidates unlock downstream nodes only after proving invariant fluency on upstream prerequisites, preventing the common failure mode of jumping into Dynamic Programming without mastery of recursion.',
    schematicTitle: 'Hierarchical Invariant Trajectory',
    schematicSteps: [
      {
        tier: 'Tier 1 // Foundation',
        title: 'Linear Invariants & Pointers',
        description: 'Two Pointers opposite/same direction, sliding window fixed/dynamic contraction, prefix sums.',
        patterns: [
          { name: 'Two Pointers', slug: 'two-pointers' },
          { name: 'Sliding Window', slug: 'sliding-window' },
          { name: 'Prefix Sum', slug: 'prefix-sum' },
        ],
        status: 'prerequisite',
      },
      {
        tier: 'Tier 2 // Branching',
        title: 'Non-Linear & Hierarchical Traversal',
        description: 'Binary search boundary conditions, DFS/BFS state trees, monotonic stack element boundaries.',
        patterns: [
          { name: 'Binary Search', slug: 'binary-search' },
          { name: 'Tree DFS', slug: 'tree-dfs' },
          { name: 'Monotonic Stack', slug: 'stack-and-monotonic-stack' },
        ],
        status: 'core',
      },
      {
        tier: 'Tier 3 // Capstone',
        title: 'Graph Invariants & Dynamic States',
        description: 'Topological dependency ordering, cycle detection, memoization DAGs, and state compression.',
        patterns: [
          { name: 'Topological Sort', slug: 'topological-sort' },
          { name: 'Dynamic Programming', slug: 'dynamic-programming' },
        ],
        status: 'capstone',
      },
    ],
    tradeoffs: {
      pros: [
        'Eliminates tutorial hell by enforcing prerequisite mastery before complex topics.',
        'Visually rewarding progression with lock/unlock mechanics and skill confidence ratings.',
        'Protects against memorization by anchoring each node around a mathematical invariant.',
      ],
      cons: [
        'Requires more time commitment; not optimized for emergency 2-week interview sprints.',
        'High initial UI density can feel daunting to candidates who just need top 20 questions.',
      ],
    },
  },
  'company-sprint': {
    id: 'company-sprint',
    label: 'Model B: High-Velocity Company Sprint',
    badge: 'MAXIMUM INTERVIEW ROI',
    icon: Timer,
    tagline: 'Time-budgeted frequency mining targeted at specific company interview cycles.',
    bestFor: 'Candidates with interviews scheduled in 2–6 weeks who need immediate high-yield practice.',
    cognitiveLoad: 'Low',
    timelineYield: '2–6 Weeks',
    summary:
      'Organizes prep into strictly time-boxed countdown sprints (14, 30, or 45 days) driven by real-world company hiring bar analytics. Bypasses niche algorithms to focus exclusively on patterns with >85% recurring frequency at Meta, Google, Amazon, or Microsoft.',
    schematicTitle: 'Time-Boxed Sprint Velocity Playbook',
    schematicSteps: [
      {
        tier: 'Week 1–2 // Phase 1',
        title: 'High-Frequency Core Blitz',
        description: 'Top 30 company-tagged questions covering Sliding Window, Hash Maps, and Binary Search.',
        patterns: [
          { name: 'Sliding Window', slug: 'sliding-window' },
          { name: 'Two Pointers', slug: 'two-pointers' },
          { name: 'Binary Search', slug: 'binary-search' },
        ],
        status: 'prerequisite',
      },
      {
        tier: 'Week 3–4 // Phase 2',
        title: 'Graph & Tree Speedruns',
        description: 'BFS shortest path in grid, DFS recursion trees, and company-specific variants (e.g. Meta graph crawls).',
        patterns: [
          { name: 'Tree BFS', slug: 'tree-bfs' },
          { name: 'Topological Sort', slug: 'topological-sort' },
        ],
        status: 'core',
      },
      {
        tier: 'Week 5–6 // Phase 3',
        title: 'Mock Protocol & Edge Case Defense',
        description: '45-minute timed live simulation, manual trace tables, and interviewer hint navigation.',
        patterns: [
          { name: 'Monotonic Stack', slug: 'stack-and-monotonic-stack' },
          { name: 'Dynamic Programming', slug: 'dynamic-programming' },
        ],
        status: 'capstone',
      },
    ],
    tradeoffs: {
      pros: [
        'Immediate practical utility for urgent interview dates with clear daily quotas.',
        'Direct alignment with real-world hiring rounds at Meta, Amazon, Apple, and Google.',
        'High motivation through clear countdown milestones and bite-sized problem sets.',
      ],
      cons: [
        'Leaves blind spots for rare or innovative questions that fall outside top-frequency lists.',
        'Risk of superficial pattern matching if foundational invariants are glossed over.',
      ],
    },
  },
  'pivot-matrix': {
    id: 'pivot-matrix',
    label: 'Model C: Technique Pivot & Decision Matrix',
    badge: 'ANTI-FREEZE ARCHITECTURE',
    icon: GitFork,
    tagline: 'Diagnostic "When Pattern X Breaks → Pivot to Y" cognitive recovery system.',
    bestFor: 'Candidates who know theory but freeze or get stuck when an unseen problem invalidates their first attempt.',
    cognitiveLoad: 'Medium',
    timelineYield: 'Any / Just-in-Time',
    summary:
      'Rather than a linear timeline, this model represents roadmaps as a real-time interview survival matrix. It maps problem symptoms, failure conditions, and interviewer pushback directly to algorithmic pivots, training candidates to pivot smoothly without panicking.',
    schematicTitle: 'Live Interview Pivot Diagnostics',
    schematicSteps: [
      {
        tier: 'Diagnostic Pivot 01',
        title: 'Sliding Window Fails on Negative Numbers',
        description: 'Symptom: Shrinking left pointer no longer guarantees sum monotonicity. Pivot immediately to Prefix Sum + Hash Map.',
        patterns: [
          { name: 'Sliding Window', slug: 'sliding-window' },
          { name: 'Prefix Sum', slug: 'prefix-sum' },
        ],
        status: 'core',
      },
      {
        tier: 'Diagnostic Pivot 02',
        title: 'Recursion Call Stack Hits Memory Limits',
        description: 'Symptom: Deep tree or graph causes Maximum Call Stack Exceeded. Pivot to Monotonic Stack or Iterative BFS Queue.',
        patterns: [
          { name: 'Tree DFS', slug: 'tree-dfs' },
          { name: 'Monotonic Stack', slug: 'stack-and-monotonic-stack' },
        ],
        status: 'core',
      },
      {
        tier: 'Diagnostic Pivot 03',
        title: 'Greedy Choice Fails Counter-Example',
        description: 'Symptom: Locally optimal choice misses global optimum. Pivot to 1D/2D Dynamic Programming state array.',
        patterns: [
          { name: 'Dynamic Programming', slug: 'dynamic-programming' },
          { name: 'Two Pointers', slug: 'two-pointers' },
        ],
        status: 'capstone',
      },
    ],
    tradeoffs: {
      pros: [
        'Directly cures interview freezing — gives candidates an instinctive "Plan B" during live rounds.',
        'Trains higher-order engineering judgment and critical trade-off articulation.',
        'Works seamlessly as a quick reference sheet during interview prep weeks.',
      ],
      cons: [
        'Assumes prior familiarity with multiple patterns; less standalone for pure beginners.',
        'Matrix format requires careful visual hierarchy to prevent information overload.',
      ],
    },
  },
};

export default function RoadmapsPage() {
  const [activeProposal, setActiveProposal] = useState<ArchitecturalProposal>('dag-tree');
  const spec = PROPOSALS[activeProposal];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: ArchitecturalProposal[] = ['dag-tree', 'company-sprint', 'pivot-matrix'];
    const currentIndex = keys.indexOf(activeProposal);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % keys.length;
      setActiveProposal(keys[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
      setActiveProposal(keys[prevIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveProposal(keys[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveProposal(keys[keys.length - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FB] dark:bg-[#262624] text-[#0F1B3D] dark:text-[#FAF9F5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION WITH CLEAN MOUNTAIN INTEGRATION & STILL BUILDING NOTICE    */}
        {/* ========================================================================= */}
        <section
          aria-labelledby="roadmaps-hero-heading"
          className="relative rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] p-6 sm:p-8 md:p-10 shadow-sm overflow-hidden"
        >
          {/* Subtle architectural grid pattern accent */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(currentColor 1px, transparent 1px), radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
            aria-hidden="true"
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading, Still Building Notice, Description */}
            <div className="lg:col-span-7 space-y-5">
              {/* Status pill with pulsing amber indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shadow-xs">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span>STATUS: ARCHITECTURAL DESIGN // COMING SOON</span>
              </div>

              {/* Editorial Serif Heading */}
              <h1
                id="roadmaps-hero-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-tight text-[#0F1B3D] dark:text-[#FAF9F5] leading-tight"
                style={{
                  fontFamily:
                    '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif',
                }}
              >
                Interview Roadmaps & Preparation Strategy
              </h1>

              {/* Exact user-facing notice string & context */}
              <div className="space-y-3">
                <p className="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                  Still building — will be available soon with an artifact for display.
                </p>
                <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  We are actively deliberating the optimal representation architecture to bridge theoretical algorithms with high-velocity interview execution. Below is our live design specimen detailing the three candidate roadmap models currently under evaluation.
                </p>
              </div>

              {/* Quick Jump Buttons to Live Catalog Modules */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#artifact-specimen"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] hover:opacity-90 transition-all shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#D97757]"
                >
                  <FileCode2 className="w-4 h-4" />
                  <span>Inspect Display Artifact</span>
                </a>
                <Link
                  to="/patterns"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1E1D] dark:hover:bg-[#30302E] text-slate-700 dark:text-[#FAF9F5] border border-slate-200 dark:border-[#43433F] transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Explore 20 Patterns</span>
                </Link>
                <Link
                  to="/companies"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1E1D] dark:hover:bg-[#30302E] text-slate-700 dark:text-[#FAF9F5] border border-slate-200 dark:border-[#43433F] transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                >
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>490+ Companies</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Clean Mountain Illustration (de-matted for clean contrast on both light & dark) */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] rounded-xl overflow-hidden p-2 flex items-center justify-center">
                <img
                  src="/companywise-roadmap-mountain.webp"
                  alt="CompanyWise Interview Roadmap: Mountain Journey to Mastery"
                  className="w-full h-auto max-h-[190px] sm:max-h-[220px] object-contain drop-shadow-sm select-none pointer-events-none transition-all duration-300"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. ARCHITECTURAL ARTIFACT SPECIMEN CARD (SPEC // CW-RDMP-2026.11)         */}
        {/* ========================================================================= */}
        <section
          id="artifact-specimen"
          aria-labelledby="artifact-specimen-heading"
          className="rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] shadow-sm overflow-hidden"
        >
          {/* Engineering Specimen Header Bar */}
          <div className="px-6 py-4 sm:px-8 border-b border-slate-200 dark:border-[#43433F] bg-slate-50/80 dark:bg-[#1F1E1D]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-200/80 dark:bg-[#30302E] text-slate-700 dark:text-slate-300">
                <Layers className="w-5 h-5 text-[#0F1B3D] dark:text-[#D97757]" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#A8A69C] block">
                  SPEC // CW-RDMP-2026.11 · SYSTEM ARTIFACT FOR DISPLAY
                </span>
                <h2
                  id="artifact-specimen-heading"
                  className="text-base sm:text-lg font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5]"
                >
                  Roadmap Representation Candidate Models
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                <Code2 className="w-3.5 h-3.5" />
                DRAFT-SPEC 0.4
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-medium bg-slate-100 dark:bg-[#1F1E1D] text-slate-600 dark:text-[#A8A69C] border border-slate-200 dark:border-[#43433F]">
                3 CANDIDATES
              </span>
            </div>
          </div>

          {/* Model Switcher Tabs */}
          <div className="px-6 sm:px-8 pt-6">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-[#A8A69C] mb-3">
              SELECT PROPOSED REPRESENTATION ARCHITECTURE TO PREVIEW:
            </p>
            <div
              role="tablist"
              aria-label="Roadmap architectural proposals"
              onKeyDown={handleKeyDown}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              {(Object.keys(PROPOSALS) as ArchitecturalProposal[]).map((key) => {
                const item = PROPOSALS[key];
                const isSelected = activeProposal === key;
                const IconComponent = item.icon;

                return (
                  <button
                    key={key}
                    role="tab"
                    id={`tab-${key}`}
                    aria-selected={isSelected}
                    aria-controls={`panel-${key}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setActiveProposal(key)}
                    className={`text-left p-4 rounded-xl border transition-all relative ${
                      isSelected
                        ? 'bg-slate-50 dark:bg-[#1F1E1D] border-[#0F1B3D] dark:border-[#D97757] ring-1 ring-[#0F1B3D] dark:ring-[#D97757] shadow-sm'
                        : 'bg-white dark:bg-[#30302E] border-slate-200 dark:border-[#43433F] hover:border-slate-300 dark:hover:border-slate-600 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent
                          className={`w-4 h-4 ${
                            isSelected
                              ? 'text-[#0F1B3D] dark:text-[#D97757]'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        />
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-[#A8A69C]">
                          {item.badge}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#0F1B3D] dark:bg-[#D97757]" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-[#0F1B3D] dark:text-[#FAF9F5] mb-1">
                      {item.label}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#A8A69C] line-clamp-2">
                      {item.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Model Specimen Body */}
          <div
            role="tabpanel"
            id={`panel-${spec.id}`}
            aria-labelledby={`tab-${spec.id}`}
            className="p-6 sm:p-8 space-y-8"
          >
            {/* Header Summary Box */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                      ARCHITECTURE SPECIFICATION
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-[#A8A69C]">
                      ID: {spec.id}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5]">
                    {spec.label}
                  </h3>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-3 py-1 rounded bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] text-slate-700 dark:text-slate-300">
                    Cognitive Load: <strong className="text-[#0F1B3D] dark:text-[#FAF9F5]">{spec.cognitiveLoad}</strong>
                  </span>
                  <span className="px-3 py-1 rounded bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] text-slate-700 dark:text-slate-300">
                    Yield Window: <strong className="text-[#0F1B3D] dark:text-[#FAF9F5]">{spec.timelineYield}</strong>
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                {spec.summary}
              </p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-[#43433F]/60 flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C]">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 dark:text-slate-200">Recommended Candidate Profile: </strong>
                  {spec.bestFor}
                </span>
              </div>
            </div>

            {/* Specimen Visual Schematic Display */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-mono uppercase tracking-wider text-slate-600 dark:text-[#A8A69C] flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                  <span>Interactive Trajectory Schematic // {spec.schematicTitle}</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  SAMPLE FLOW
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {spec.schematicSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] relative flex flex-col justify-between space-y-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-500 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#A8A69C]">
                          {step.tier}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                            step.status === 'prerequisite'
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                              : step.status === 'core'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                      <h5 className="text-base font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5]">
                        {step.title}
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-[#43433F]/60">
                      <div className="text-[11px] font-mono text-slate-500 dark:text-[#A8A69C] mb-2">
                        CANONICAL PATTERNS:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {step.patterns.map((p) => (
                          <Link
                            key={p.slug}
                            to={`/patterns/${p.slug}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-[#30302E] text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-200 dark:hover:bg-[#43433F] transition-colors"
                          >
                            <span>{p.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Trade-offs Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Architectural Strengths</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {spec.tradeoffs.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-sm">
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Design Trade-Offs & Mitigations</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {spec.tradeoffs.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. COMPARATIVE ARCHITECTURAL EVALUATION MATRIX                             */}
        {/* ========================================================================= */}
        <section
          aria-labelledby="comparison-matrix-heading"
          className="rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-[#A8A69C]">
                ENGINEERING DECISION RUBRIC
              </span>
              <h2
                id="comparison-matrix-heading"
                className="text-lg sm:text-xl font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5]"
              >
                Model Comparison & Deliberation Matrix
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 dark:text-[#A8A69C]">
              FINAL DECISION PENDING USER SELECTION
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#43433F] text-slate-500 dark:text-[#A8A69C] font-mono uppercase text-[11px]">
                  <th className="py-3 px-4 font-semibold">Evaluation Criteria</th>
                  <th className="py-3 px-4 font-semibold text-[#0F1B3D] dark:text-[#FAF9F5]">Model A (Skill Tree DAG)</th>
                  <th className="py-3 px-4 font-semibold text-[#0F1B3D] dark:text-[#FAF9F5]">Model B (Company Sprint)</th>
                  <th className="py-3 px-4 font-semibold text-[#0F1B3D] dark:text-[#FAF9F5]">Model C (Pivot Matrix)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#43433F]/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">Primary Candidate Focus</td>
                  <td className="py-3.5 px-4">Beginners to Intermediates (Zero to Intuition)</td>
                  <td className="py-3.5 px-4">Urgent 2–6 Week Candidates (High Frequency)</td>
                  <td className="py-3.5 px-4">Interview-Day Anti-Freeze & Recovery</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">Cognitive Mental Model</td>
                  <td className="py-3.5 px-4">Prerequisite Graph (Topological unlocking)</td>
                  <td className="py-3.5 px-4">Calendar Timeline & Daily Problem Quotas</td>
                  <td className="py-3.5 px-4">Diagnostic Symptom → Solution Lookups</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">Optimal Practice Window</td>
                  <td className="py-3.5 px-4">8 to 16 Weeks comprehensive</td>
                  <td className="py-3.5 px-4">14 to 45 Days focused velocity</td>
                  <td className="py-3.5 px-4">Any timeline / Pre-interview refactor</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">Retention & Invariant Yield</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Highest (First-principles proofs)</td>
                  <td className="py-3.5 px-4 text-amber-600 dark:text-amber-400 font-semibold">High on top 50 recurring variants</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">Highest under stress/hints</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">Platform Integration Depth</td>
                  <td className="py-3.5 px-4">Tied to Pattern Visualizers & Quizzes</td>
                  <td className="py-3.5 px-4">Tied to Company Frequency Filters</td>
                  <td className="py-3.5 px-4">Tied to Ah-Ha Drawer & Solution Hints</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ACTIVE PLATFORM CAPABILITIES QUICK ACCESS GRID                          */}
        {/* ========================================================================= */}
        <section aria-labelledby="live-tools-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2
              id="live-tools-heading"
              className="text-lg sm:text-xl font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5]"
            >
              Start Practicing Now with Live Platform Engines
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-[#A8A69C]">
              ALL UNDERLYING QUESTIONS & PATTERNS ARE PRODUCTION-READY
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/patterns"
              className="group p-5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5] group-hover:text-amber-600 dark:group-hover:text-[#D97757] transition-colors">
                  20 Canonical Patterns
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Interactive step-by-step visualizers, invariant cheat-sheets, and subpattern breakdowns.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757]">
                <span>Launch Patterns Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/companies"
              className="group p-5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 w-fit">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5] group-hover:text-blue-600 dark:group-hover:text-[#D97757] transition-colors">
                  490+ Tech Companies
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Real-world hiring bar questions for Meta, Google, Amazon, Apple, Microsoft, and Uber.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757]">
                <span>Filter by Target Company</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/problems"
              className="group p-5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 w-fit">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5] group-hover:text-emerald-600 dark:group-hover:text-[#D97757] transition-colors">
                  3,411 Curated Problems
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Full problem catalog with difficulty tags, company appearances, and Ah-Ha mental models.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757]">
                <span>Search Problem Archive</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/progress"
              className="group p-5 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-[#1F1E1D] text-[#D97757] dark:text-[#D97757] w-fit border border-orange-100 dark:border-[#43433F]">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#0F1B3D] dark:text-[#FAF9F5] group-hover:text-[#D97757] transition-colors">
                  Personal Mastery Tracker
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  Track your solved questions, accuracy metrics, and spaced repetition review schedules.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757]">
                <span>View Solved Progress</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* Footer Technical Note regarding preserved draft modules */}
        <div className="pt-4 pb-2 text-center">
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
            ENGINEERING NOTE: All preliminary modules (5-Tap Diagnostic, 15-Minute Practice Loop, Beginner Milestones, Intermediate Pivot Engine) are preserved in <code className="text-slate-600 dark:text-[#A8A69C]">RoadmapsDraftModules.tsx</code> ready for direct integration.
          </p>
        </div>
      </div>
    </div>
  );
}
