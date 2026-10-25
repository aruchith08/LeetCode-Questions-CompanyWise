import React from 'react';
import {
  Heart, Code2, Github, Linkedin,
  Globe, CheckCircle2, ArrowUpRight, Layers
} from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="space-y-8 pt-10 border-t border-slate-200/80 dark:border-[#43433F]/80">
      {/* Section Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal hero-serif text-slate-900 dark:text-[#FAF9F5] tracking-tight">
          The Story Behind CompanyWise
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8A69C] leading-relaxed">
          What started as an open-source collection of company-wise interview questions became a platform designed to make technical interview preparation more focused, organized, and accessible.
        </p>
      </div>

      {/* Horizontal Chapters Flow */}
      <div className="space-y-6">
        {/* CHAPTER 01 — THE PURPOSE */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column: Chapter Meta */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-[#1F1E1D] text-[#0F1B3D] dark:text-[#D97757] flex items-center justify-center border border-amber-100 dark:border-[#43433F] shrink-0">
                  <Globe className="w-5 h-5 text-[#0F1B3D] dark:text-[#D97757]" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-[#A8A69C] tracking-wider uppercase">
                  CHAPTER 01 — THE PURPOSE
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
                A Smarter Way to Prepare
              </h3>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-100 dark:border-[#43433F] text-xs italic text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                Free to explore. Built to make every practice session count.
              </div>
            </div>

            {/* Right Column: Narrative Content */}
            <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed lg:border-l lg:border-slate-100 dark:lg:border-[#43433F]/80 lg:pl-10">
              <p>
                Interview preparation shouldn&apos;t mean solving hundreds of random problems and hoping for the best.
              </p>

              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-[#D97757]/10 border border-amber-500/10 dark:border-[#D97757]/20 text-slate-800 dark:text-[#FAF9F5]">
                <p className="font-medium">
                  CompanyWise was built around a simple idea:{' '}
                  <strong className="text-[#0F1B3D] dark:text-[#D97757] font-semibold">
                    know what to practice, understand why it matters, and track how far you&apos;ve come.
                  </strong>
                </p>
              </div>

              <p>
                Instead of navigating scattered spreadsheets, you can explore company-specific questions, identify frequently reported problems, and focus your preparation using historical interview trends.
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-[#43433F]/80 space-y-2.5">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-[#FAF9F5] block">
                  What CompanyWise brings together:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1">
                    <span className="font-bold text-slate-900 dark:text-[#FAF9F5] text-xs block">
                      3,411 unique problems
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block">
                      Across 490 tech companies.
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1">
                    <span className="font-bold text-slate-900 dark:text-[#FAF9F5] text-xs block">
                      6 time windows
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block">
                      Explore question frequency shifts.
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1">
                    <span className="font-bold text-slate-900 dark:text-[#FAF9F5] text-xs block">
                      Personal tracking
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block">
                      Stay organized as you practice.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHAPTER 02 — THE FOUNDATION */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column: Chapter Meta */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-[#1F1E1D] text-rose-600 dark:text-[#D97757] flex items-center justify-center border border-rose-100 dark:border-[#43433F] shrink-0">
                  <Heart className="w-5 h-5 text-rose-500 dark:text-[#EE8F78]" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-[#A8A69C] tracking-wider uppercase">
                  CHAPTER 02 — THE FOUNDATION
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="/krishna-dey.png"
                  alt="Krishna Dey"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200/90 dark:border-[#43433F] shadow-sm bg-slate-100 dark:bg-[#1F1E1D] shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight leading-snug">
                    The Curator: Krishna Dey
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-[#A8A69C]">
                    @krishnadey30 · Curator
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-100 dark:border-[#43433F] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                  Original open-source project
                </span>
                <div className="font-mono text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757]">
                  krishnadey30/LeetCode-Questions-CompanyWise
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block">
                  537 source CSV files · 20,453 question occurrences
                </span>
              </div>

              <div>
                <a
                  href="https://github.com/krishnadey30/LeetCode-Questions-CompanyWise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-[#1F1E1D] dark:hover:bg-[#262624] text-white dark:text-[#FAF9F5] border border-transparent dark:border-[#43433F] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Explore & Star Krishna&apos;s Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                </a>
              </div>
            </div>

            {/* Right Column: Narrative Content */}
            <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed lg:border-l lg:border-slate-100 dark:lg:border-[#43433F]/80 lg:pl-10">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] text-slate-800 dark:text-[#FAF9F5] font-medium">
                Great projects often begin with someone else&apos;s generous contribution to open source. This one is no exception.
              </div>

              <p>
                The foundation of CompanyWise comes from the work of{' '}
                <strong className="text-slate-900 dark:text-[#FAF9F5]">Krishna Dey (@krishnadey30)</strong>, who collected, organized, and openly shared company-wise LeetCode question data drawn from candidate interview reports.
              </p>

              <p>
                His repository made an enormous amount of valuable interview information accessible to developers everywhere.
              </p>

              <p>
                The original collection of{' '}
                <strong className="text-slate-900 dark:text-[#FAF9F5]">537 CSV files</strong> became the data foundation on which CompanyWise was built.
              </p>

              <p className="pt-2 border-t border-slate-100 dark:border-[#43433F]/80 text-slate-700 dark:text-[#FAF9F5]">
                CompanyWise is an independent interface built upon that work, and full credit for curating and sharing the original dataset belongs to Krishna.
              </p>
            </div>
          </div>
        </div>

        {/* CHAPTER 03 — THE EXPANSION */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column: Chapter Meta */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-[#1F1E1D] text-emerald-600 dark:text-[#8FBF78] flex items-center justify-center border border-emerald-100 dark:border-[#43433F] shrink-0">
                  <Layers className="w-5 h-5 text-emerald-600 dark:text-[#8FBF78]" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-[#A8A69C] tracking-wider uppercase">
                  CHAPTER 03 — THE EXPANSION
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="/liquidslr.png"
                  alt="liquidslr"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200/90 dark:border-[#43433F] shadow-sm bg-slate-100 dark:bg-[#1F1E1D] shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight leading-snug">
                    The Contributor: liquidslr
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-[#A8A69C]">
                    @liquidslr · Data Contributor
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-100 dark:border-[#43433F] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-semibold">
                  Updated & Expanded Dataset
                </span>
                <div className="font-mono text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757]">
                  liquidslr/leetcode-company-wise-problems
                </div>
                <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block">
                  470+ company folders · 3,400+ indexed problems · 30-day &amp; 3-month recency
                </span>
              </div>

              <div>
                <a
                  href="https://github.com/liquidslr/leetcode-company-wise-problems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-[#1F1E1D] dark:hover:bg-[#262624] text-white dark:text-[#FAF9F5] border border-transparent dark:border-[#43433F] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Explore & Star liquidslr&apos;s Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                </a>
              </div>
            </div>

            {/* Right Column: Narrative Content */}
            <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed lg:border-l lg:border-slate-100 dark:lg:border-[#43433F]/80 lg:pl-10">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] text-slate-800 dark:text-[#FAF9F5] font-medium">
                Technical interview patterns continuously shift. Keeping problem frequency rankings current and reflecting recent hiring trends is essential.
              </div>

              <p>
                To expand and refresh the catalog, CompanyWise integrated the comprehensive dataset maintained by{' '}
                <strong className="text-slate-900 dark:text-[#FAF9F5]">liquidslr (@liquidslr)</strong> from their repository{' '}
                <strong className="text-slate-900 dark:text-[#FAF9F5]">liquidslr/leetcode-company-wise-problems</strong>.
              </p>

              <p>
                Their repository brought in <strong className="text-slate-900 dark:text-[#FAF9F5]">290 newly covered companies</strong> and <strong className="text-slate-900 dark:text-[#FAF9F5]">1,965 newly indexed problems</strong>, substantially expanding CompanyWise to 490 employers and 3,411 canonical LeetCode questions.
              </p>

              <p>
                In addition, their dataset provided high-signal recency windows—specifically <strong className="text-slate-900 dark:text-[#FAF9F5]">Last 30 Days</strong> and <strong className="text-slate-900 dark:text-[#FAF9F5]">Last 3 Months</strong>—enabling developers to target what top tech teams are asking right now.
              </p>

              <p className="pt-2 border-t border-slate-100 dark:border-[#43433F]/80 text-slate-700 dark:text-[#FAF9F5]">
                We want to recognize and thank liquidslr for their dedication to openly sharing this valuable and regularly updated collection.
              </p>
            </div>
          </div>
        </div>

        {/* CHAPTER 04 — THE CREATION */}
        <div className="p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Column: Chapter Meta */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-[#1F1E1D] text-indigo-600 dark:text-[#D97757] flex items-center justify-center border border-indigo-100 dark:border-[#43433F] shrink-0">
                  <Code2 className="w-5 h-5 text-indigo-600 dark:text-[#D97757]" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-500 dark:text-[#A8A69C] tracking-wider uppercase">
                  CHAPTER 04 — THE CREATION
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <img
                    src="/alokam-ruchith.png"
                    alt="Alokam Ruchith"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200/90 dark:border-[#43433F] shadow-sm bg-slate-100 dark:bg-[#1F1E1D]"
                  />
                  {/* Social links directly under photo */}
                  <div className="flex items-center justify-center gap-1.5 pt-0.5">
                    <a
                      href="https://linkedin.com/in/ruchithalokam"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      title="LinkedIn"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#1F1E1D] dark:hover:bg-[#262624] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] flex items-center justify-center text-slate-600 hover:text-[#0F1B3D] dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://github.com/aruchith08"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      title="GitHub"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#1F1E1D] dark:hover:bg-[#262624] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] flex items-center justify-center text-slate-600 hover:text-[#0F1B3D] dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://x.com/A_Ruchith"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X (formerly Twitter)"
                      title="X"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#1F1E1D] dark:hover:bg-[#262624] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] flex items-center justify-center text-slate-600 hover:text-[#0F1B3D] dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] transition-colors"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href="https://alokam.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Personal Website"
                      title="Website"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-[#1F1E1D] dark:hover:bg-[#262624] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] flex items-center justify-center text-slate-600 hover:text-[#0F1B3D] dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight leading-snug">
                    The Builder: Alokam Ruchith
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-[#A8A69C]">
                    @aruchith08 · BVRIT
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-100 dark:border-[#43433F] text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                Driven by the same idea that started it:{' '}
                <strong className="text-slate-800 dark:text-[#FAF9F5]">
                  make useful knowledge easier to access and better to use.
                </strong>
              </div>

              <div>
                <a
                  href="https://github.com/aruchith08/LeetCode-Questions-CompanyWise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shadow-xs"
                >
                  <Github className="w-4 h-4" />
                  <span>Explore CompanyWise on GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70" />
                </a>
              </div>
            </div>

            {/* Right Column: Narrative Content */}
            <div className="lg:col-span-8 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed lg:border-l lg:border-slate-100 dark:lg:border-[#43433F]/80 lg:pl-10">
              <p>
                I&apos;m <strong className="text-slate-900 dark:text-[#FAF9F5]">Alokam Ruchith (@aruchith08)</strong>, an engineering student at BVRIT and the developer behind CompanyWise.
              </p>

              <p>
                While preparing for technical interviews, I came across Krishna&apos;s collection. The information was incredibly useful, but exploring hundreds of CSV files wasn&apos;t exactly the experience I wanted when trying to focus on solving problems.
              </p>

              <div className="p-4 rounded-2xl bg-[#0F1B3D]/5 dark:bg-[#D97757]/10 border border-[#0F1B3D]/10 dark:border-[#D97757]/20 text-slate-800 dark:text-[#FAF9F5] font-semibold">
                That sparked an idea: what if all this valuable data could become one intuitive, interactive platform?
              </div>

              <p>
                So I started building CompanyWise. What began as a way to make my own preparation easier gradually evolved into a complete web application designed for anyone who wants a more organized approach to interview preparation.
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-[#43433F]/80 space-y-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-[#FAF9F5] block">
                  Behind the build:
                </span>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-[#A8A69C]">
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757] font-bold text-sm leading-none mt-0.5">•</span>
                    <span>Transformed 1,112 source CSV files into structured, searchable data.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757] font-bold text-sm leading-none mt-0.5">•</span>
                    <span>Developed a unified interface for discovering and filtering company-wise questions.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757] font-bold text-sm leading-none mt-0.5">•</span>
                    <span>Integrated LeetCode progress tracking with a privacy-conscious approach.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#0F1B3D] dark:text-[#D97757] font-bold text-sm leading-none mt-0.5">•</span>
                    <span>Built an interactive WebGL globe and responsive interface for a more engaging experience.</span>
                  </div>
                </div>
              </div>

              <p className="pt-2 text-slate-600 dark:text-[#A8A69C]">
                CompanyWise is still evolving, driven by the same idea that started it:{' '}
                <strong className="text-slate-900 dark:text-[#FAF9F5]">
                  make useful knowledge easier to access and better to use.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
