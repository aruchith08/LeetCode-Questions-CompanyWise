import React from 'react';
import {
  Sparkles, Heart, Code2, Database, Github,
  ExternalLink, ShieldCheck, Terminal, Globe,
  CheckCircle2, ArrowUpRight, Cpu
} from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="space-y-12 pt-10 border-t border-slate-200/80 dark:border-[#43433F]/80">
      {/* Section Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#0F1B3D]/5 dark:bg-[#D97757]/10 text-[#0F1B3D] dark:text-[#D97757] border border-[#0F1B3D]/10 dark:border-[#D97757]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Story Behind CompanyWise</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold dark:font-serif dark:font-normal font-serif-heading text-slate-900 dark:text-[#FAF9F5] tracking-tight">
          How this platform came to life
        </h2>
        <p className="text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed">
          From an open-source dataset of candidate interview reports to a full-featured, zero-telemetry technical interview workstation.
        </p>
      </div>

      {/* 3 Chapters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Chapter 1: About the Website */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all flex flex-col justify-between shadow-2xs group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-[#1F1E1D] text-[#0F1B3D] dark:text-[#D97757] flex items-center justify-center border border-amber-100 dark:border-[#43433F]">
                <Globe className="w-5 h-5 text-[#0F1B3D] dark:text-[#D97757]" />
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-[#A8A69C] uppercase tracking-wider">
                Chapter 01
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold dark:font-serif dark:font-normal font-serif-heading text-slate-900 dark:text-[#FAF9F5]">
                The Platform
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                Technical interview preparation is broken when candidates grind random questions without understanding which problems are actively asked by their target companies.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 text-xs text-slate-700 dark:text-[#FAF9F5]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#8FBF78] shrink-0 mt-0.5" />
                <span><strong>1,446 verified problems</strong> across 200 top tech companies.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#8FBF78] shrink-0 mt-0.5" />
                <span><strong>4 recency tiers</strong>: 6 months, 1 year, 2 years, and all-time.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#8FBF78] shrink-0 mt-0.5" />
                <span><strong>Private client sync</strong>: zero passwords, zero tracking, stored locally.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#8FBF78] shrink-0 mt-0.5" />
                <span><strong>3D WebGL Globe</strong> with dynamic light & dark mode shaders.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#43433F]/80 flex items-center justify-between text-xs text-slate-500 dark:text-[#A8A69C]">
            <span className="font-mono text-[11px]">Free & Open Forever</span>
            <span className="font-mono text-[11px] text-[#0F1B3D] dark:text-[#D97757] font-semibold">100% Client-Side</span>
          </div>
        </div>

        {/* Chapter 2: The Dataset Curator (Krishna Dey) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all flex flex-col justify-between shadow-2xs group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-[#1F1E1D] text-rose-600 dark:text-[#D97757] flex items-center justify-center border border-rose-100 dark:border-[#43433F]">
                <Heart className="w-5 h-5 text-rose-500 dark:text-[#EE8F78]" />
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-[#A8A69C] uppercase tracking-wider">
                Chapter 02
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold dark:font-serif dark:font-normal font-serif-heading text-slate-900 dark:text-[#FAF9F5]">
                The Curator: Krishna Dey
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                All gratitude and credits for gathering this wealth of interview data belong to <strong>Krishna Dey</strong> (<code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-800 dark:text-[#E0B14F] text-[11px]">@krishnadey30</code>).
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              Krishna gathered, cataloged, and open-sourced company-wise LeetCode frequency spreadsheets based on real candidate interview reports. His repository provided the canonical 537 CSV files that form the bedrock of this application.
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                Original Repository
              </span>
              <a
                href="https://github.com/krishnadey30/LeetCode-Questions-CompanyWise"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757] hover:underline flex items-center gap-1.5 break-all"
              >
                <span>krishnadey30/LeetCode-Questions-CompanyWise</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
              <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block">
                537 CSVs · 20,453 problem occurrences mapped
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#43433F]/80">
            <a
              href="https://github.com/krishnadey30/LeetCode-Questions-CompanyWise"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-[#1F1E1D] dark:hover:bg-[#262624] text-white dark:text-[#FAF9F5] border border-transparent dark:border-[#43433F] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Star Krishna&apos;s Repository</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70" />
            </a>
          </div>
        </div>

        {/* Chapter 3: The Builder (Aruchith) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all flex flex-col justify-between shadow-2xs group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-[#1F1E1D] text-indigo-600 dark:text-[#D97757] flex items-center justify-center border border-indigo-100 dark:border-[#43433F]">
                <Code2 className="w-5 h-5 text-indigo-600 dark:text-[#D97757]" />
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-[#A8A69C] uppercase tracking-wider">
                Chapter 03
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold dark:font-serif dark:font-normal font-serif-heading text-slate-900 dark:text-[#FAF9F5]">
                The Builder: Aruchith
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                Built by <strong>Aruchith</strong> (<code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-[#1F1E1D] text-slate-800 dark:text-[#E0B14F] text-[11px]">@aruchith08</code>), an engineering student at BVRIT.
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              Frustrated by navigating dozens of static CSV spreadsheets and disconnected folders while prepping for technical interviews, I engineered CompanyWise to transform static tables into an ultra-responsive, enjoyable workspace.
            </p>

            <div className="space-y-2 text-xs text-slate-700 dark:text-[#A8A69C]">
              <div className="flex items-start gap-2">
                <Terminal className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757] shrink-0 mt-0.5" />
                <span>Wrote the ETL ingest pipeline normalizing 537 CSVs into unified JSON.</span>
              </div>
              <div className="flex items-start gap-2">
                <Cpu className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757] shrink-0 mt-0.5" />
                <span>Created the interactive WebGL globe with dynamic dark-mode white shaders.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757] shrink-0 mt-0.5" />
                <span>Built client-side LeetCode profile sync with zero-knowledge local storage.</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#43433F]/80">
            <a
              href="https://github.com/aruchith08/LeetCode-Questions-CompanyWise"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shadow-xs"
            >
              <Github className="w-4 h-4" />
              <span>View Project on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
