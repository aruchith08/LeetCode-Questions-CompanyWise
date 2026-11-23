import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  Code2,
  ArrowRight,
  Mountain,
  Bot,
  Flame,
  CheckCircle2
} from 'lucide-react';

type ArtworkView = 'mountain' | 'robot';

export default function RoadmapsPage() {
  const [activeArtwork, setActiveArtwork] = useState<ArtworkView>('mountain');

  return (
    <div className="min-h-screen bg-[#F7F8FB] dark:bg-[#262624] text-[#0F1B3D] dark:text-[#FAF9F5] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-10 sm:space-y-12">
        {/* ========================================================================= */}
        {/* HERO WORK IN PROGRESS CARD WITH ARTWORK DISPLAY (MOUNTAIN & ROBOT)        */}
        {/* ========================================================================= */}
        <section
          aria-labelledby="roadmaps-hero-heading"
          className="relative rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] p-6 sm:p-10 lg:p-12 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          {/* Subtle architectural dot grid background */}
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

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Status Badge, Editorial Serif Title, Subtitle, Quick Buttons */}
            <div className="lg:col-span-7 space-y-6">
              {/* Status Badge: Work In Progress */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider bg-amber-50 dark:bg-[#1F1E1D] text-amber-800 dark:text-[#D97757] border border-amber-200/80 dark:border-[#43433F] shadow-xs">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-[#D97757]" />
                </span>
                <span>Work In Progress</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
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
                <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 leading-snug">
                  Still building — will be available soon.
                </p>
              </div>

              {/* Brief context */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8A69C] leading-relaxed max-w-xl">
                We are curating step-by-step interview trajectories tailored to your timeline. In the meantime, start practicing directly with our live catalog:
              </p>

              {/* Direct Jump Buttons to Live Engines */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <Link
                  to="/patterns"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#0F1B3D] hover:bg-[#1A2D5E] text-white dark:bg-[#D97757] dark:hover:bg-[#c66c4e] dark:text-[#1F1E1D] transition-all shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#D97757]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 dark:text-[#1F1E1D]" />
                  <span>Explore 20 Patterns</span>
                </Link>
                <Link
                  to="/companies"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1E1D] dark:hover:bg-[#30302E] text-slate-700 dark:text-[#FAF9F5] border border-slate-200 dark:border-[#43433F] transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                >
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>490+ Companies</span>
                </Link>
                <Link
                  to="/problems"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1E1D] dark:hover:bg-[#30302E] text-slate-700 dark:text-[#FAF9F5] border border-slate-200 dark:border-[#43433F] transition-all focus:outline-hidden focus:ring-2 focus:ring-slate-400"
                >
                  <Code2 className="w-4 h-4 text-emerald-500" />
                  <span>3,411 Problems</span>
                </Link>
              </div>
            </div>

            {/* Right Column: High-Craft Artwork Display with Mountain / Robot Toggle */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3">
              <div className="relative w-full max-w-[400px] min-h-[220px] sm:min-h-[240px] rounded-2xl bg-slate-50/70 dark:bg-[#1F1E1D]/80 border border-slate-200/80 dark:border-[#43433F] p-4 flex items-center justify-center transition-all">
                {activeArtwork === 'mountain' ? (
                  <img
                    src="/companywise-roadmap-mountain.webp"
                    alt="CompanyWise Interview Roadmap: Mountain Journey to Mastery"
                    className="w-full h-auto max-h-[200px] sm:max-h-[220px] object-contain drop-shadow-sm select-none pointer-events-none transition-all duration-300 animate-fade-in"
                    loading="eager"
                  />
                ) : (
                  <div className="flex items-center justify-center py-2 animate-fade-in">
                    {/* Light mode robot (crisp navy lines) */}
                    <img
                      src="/robot-wip-light.png"
                      alt="CompanyWise Construction Robot: Repairing Roadmap Gears"
                      className="w-full h-auto max-h-[190px] sm:max-h-[210px] object-contain drop-shadow-sm select-none pointer-events-none dark:hidden"
                      loading="eager"
                    />
                    {/* Dark mode robot (warm off-white lines) */}
                    <img
                      src="/robot-wip-dark.png"
                      alt="CompanyWise Construction Robot: Repairing Roadmap Gears"
                      className="w-full h-auto max-h-[190px] sm:max-h-[210px] object-contain drop-shadow-sm select-none pointer-events-none hidden dark:block"
                      loading="eager"
                    />
                  </div>
                )}
              </div>

              {/* Minimalist segmented switcher to view Mountain or Repair Robot artwork */}
              <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F]">
                <button
                  type="button"
                  onClick={() => setActiveArtwork('mountain')}
                  aria-pressed={activeArtwork === 'mountain'}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    activeArtwork === 'mountain'
                      ? 'bg-white dark:bg-[#30302E] text-[#0F1B3D] dark:text-[#FAF9F5] shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-slate-200'
                  }`}
                >
                  <Mountain className="w-3.5 h-3.5 text-blue-500" />
                  <span>Mountain Journey</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArtwork('robot')}
                  aria-pressed={activeArtwork === 'robot'}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    activeArtwork === 'robot'
                      ? 'bg-white dark:bg-[#30302E] text-[#0F1B3D] dark:text-[#FAF9F5] shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-slate-200'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-amber-500 dark:text-[#D97757]" />
                  <span>Repair Robot</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ACTIVE PLATFORM ENGINES DIRECT ACCESS GRID                                */}
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
              ALL 3,411 QUESTIONS & 20 PATTERNS ARE PRODUCTION-READY
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/patterns"
              className="group p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 w-fit">
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
              className="group p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 w-fit">
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
              className="group p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 w-fit">
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
              className="group p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-[#1F1E1D] text-[#D97757] dark:text-[#D97757] w-fit border border-orange-100 dark:border-[#43433F]">
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

        {/* Footer Technical Note */}
        <div className="pt-4 pb-2 text-center">
          <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
            ENGINEERING NOTE: All preliminary modules (5-Tap Diagnostic, 15-Minute Practice Loop, Beginner Milestones, Intermediate Pivot Engine) are safely preserved in <code className="text-slate-600 dark:text-[#A8A69C]">RoadmapsDraftModules.tsx</code> ready for direct integration.
          </p>
        </div>
      </div>
    </div>
  );
}
