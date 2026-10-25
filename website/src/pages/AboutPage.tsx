import React from 'react';
import AboutSection from '../components/ui/AboutSection';
import {
  Database, ShieldCheck, Terminal, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="space-y-12 animate-fade-in pb-16">
      {/* Main 4 Horizontal Chapters */}
      <AboutSection />

      {/* Deep-Dive Technical Blueprint */}
      <section className="space-y-6 pt-8 border-t border-slate-200/80 dark:border-[#43433F]/80">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]">
            Engineering & Architecture Decisions
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C]">
            How CompanyWise delivers sub-millisecond filtering and zero-telemetry client execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3">
            <div className="flex items-center gap-2.5 text-[#0F1B3D] dark:text-[#D97757] font-semibold text-sm">
              <Database className="w-4 h-4" />
              <span>Offline-First Ingest Pipeline</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              All 1,112 CSV files in the repository are ingested through an offline TypeScript pipeline that parses 38,825 entries, validates every LeetCode problem URL, deduplicates records, and outputs unified, compressed static index files served directly via Vite.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3">
            <div className="flex items-center gap-2.5 text-[#0F1B3D] dark:text-[#D97757] font-semibold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Tracking Privacy Design</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              No analytics trackers, third-party cookies, or intermediate database servers. Your solved questions, bookmarked problems, recent views, and LeetCode profile are saved strictly inside your browser&apos;s <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-[11px]">localStorage</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3">
            <div className="flex items-center gap-2.5 text-[#0F1B3D] dark:text-[#D97757] font-semibold text-sm">
              <Globe className="w-4 h-4" />
              <span>Native WebGL 3D Visualization</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              Zero heavy runtime 3D libraries. Built on native WebGL 1 shaders with 738 geodesic network edges and 248 metallic nodes. Continents procedurally adapt to crisp white in dark mode with real-time classList observation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] space-y-3">
            <div className="flex items-center gap-2.5 text-[#0F1B3D] dark:text-[#D97757] font-semibold text-sm">
              <Terminal className="w-4 h-4" />
              <span>Restrained System Typography</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              Zero web font downloads. Powered by local device font stacks: editorial serif (<code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-[11px]">Iowan Old Style</code> / <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-[11px]">Georgia</code>) specifically for the central hero statement, and high-legibility system sans (<code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-[11px]">San Francisco</code> / <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-[11px]">Segoe UI</code>) everywhere else.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="p-8 rounded-3xl bg-slate-100 dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5]">
          Ready to target your interview questions?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] max-w-xl mx-auto">
          Explore 490 tech companies and start practicing the problems that matter most.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/companies"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shadow-xs"
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
      </div>
    </div>
  );
}
