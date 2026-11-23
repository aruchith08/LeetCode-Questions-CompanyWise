import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  Code2
} from 'lucide-react';

export default function RoadmapsPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FB] dark:bg-[#262624] text-[#0F1B3D] dark:text-[#FAF9F5] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* ========================================================================= */}
        {/* HERO WORK IN PROGRESS CARD WITH MOUNTAIN ROADMAP ARTWORK                  */}
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

            {/* Right Column: Mountain Roadmap Illustration */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[420px] rounded-2xl bg-slate-50/70 dark:bg-[#1F1E1D]/80 border border-slate-200/80 dark:border-[#43433F] p-4 sm:p-5 flex items-center justify-center transition-all">
                <img
                  src="/companywise-roadmap-mountain.webp"
                  alt="CompanyWise Interview Roadmap: Mountain Journey to Mastery"
                  className="w-full h-auto max-h-[220px] sm:max-h-[250px] object-contain drop-shadow-sm select-none pointer-events-none transition-all duration-300"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
