import React from 'react';
import {
  Sparkles, Heart, Code2, Github,
  ExternalLink, Globe, CheckCircle2,
  ArrowUpRight, Layers
} from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="space-y-12 pt-10 border-t border-slate-200/80 dark:border-[#43433F]/80">
      {/* Section Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#0F1B3D]/5 dark:bg-[#D97757]/10 text-[#0F1B3D] dark:text-[#D97757] border border-[#0F1B3D]/10 dark:border-[#D97757]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Story Behind CompanyWise</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
          The Story Behind CompanyWise
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#A8A69C] leading-relaxed">
          What started as an open-source collection of company-wise interview questions became a platform designed to make technical interview preparation more focused, organized, and accessible.
        </p>
      </div>

      {/* 3 Chapters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* CHAPTER 01 — THE PURPOSE */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all flex flex-col justify-between shadow-2xs group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-[#1F1E1D] text-[#0F1B3D] dark:text-[#D97757] flex items-center justify-center border border-amber-100 dark:border-[#43433F]">
                <Globe className="w-5 h-5 text-[#0F1B3D] dark:text-[#D97757]" />
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-[#A8A69C] uppercase tracking-wider">
                CHAPTER 01 — THE PURPOSE
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                A Smarter Way to Prepare
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                Interview preparation shouldn&apos;t mean solving hundreds of random problems and hoping for the best.
              </p>
            </div>

            <p className="text-xs text-slate-700 dark:text-[#FAF9F5] leading-relaxed">
              CompanyWise was built around a simple idea:{' '}
              <strong className="text-slate-900 dark:text-[#FAF9F5]">
                know what to practice, understand why it matters, and track how far you&apos;ve come.
              </strong>
            </p>

            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              Instead of navigating scattered spreadsheets, you can explore company-specific questions, identify frequently reported problems, and focus your preparation using historical interview trends.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#43433F]/80">
              <span className="text-[11px] font-bold text-slate-900 dark:text-[#FAF9F5] block">
                What CompanyWise brings together:
              </span>
              <div className="space-y-2 text-xs text-slate-700 dark:text-[#FAF9F5]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#8FBF78] shrink-0 mt-0.5" />
                  <span><strong>1,446 unique problems</strong> across 200 tech companies.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#8FBF78] shrink-0 mt-0.5" />
                  <span><strong>4 time windows</strong> to explore how question frequency changes.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#8FBF78] shrink-0 mt-0.5" />
                  <span><strong>Personal progress tracking</strong> to stay organized as you practice.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#43433F]/80">
            <p className="text-[11px] italic text-slate-500 dark:text-[#A8A69C]">
              Free to explore. Built to make every practice session count.
            </p>
          </div>
        </div>

        {/* CHAPTER 02 — THE FOUNDATION */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all flex flex-col justify-between shadow-2xs group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-[#1F1E1D] text-rose-600 dark:text-[#D97757] flex items-center justify-center border border-rose-100 dark:border-[#43433F]">
                <Heart className="w-5 h-5 text-rose-500 dark:text-[#EE8F78]" />
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-[#A8A69C] uppercase tracking-wider">
                CHAPTER 02 — THE FOUNDATION
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                The Curator: Krishna Dey
              </h3>
              <p className="text-xs font-semibold text-slate-900 dark:text-[#FAF9F5] leading-relaxed">
                Great projects often begin with someone else&apos;s generous contribution to open source. This one is no exception.
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              The foundation of CompanyWise comes from the work of{' '}
              <strong className="text-slate-900 dark:text-[#FAF9F5]">Krishna Dey (@krishnadey30)</strong>, who collected, organized, and openly shared company-wise LeetCode question data drawn from candidate interview reports.
            </p>

            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              His repository made an enormous amount of valuable interview information accessible to developers everywhere. The original collection of{' '}
              <strong className="text-slate-900 dark:text-[#FAF9F5]">537 CSV files</strong> became the data foundation on which CompanyWise was built.
            </p>

            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              CompanyWise is an independent interface built upon that work, and full credit for curating and sharing the original dataset belongs to Krishna.
            </p>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1.5">
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
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#43433F]/80">
            <a
              href="https://github.com/krishnadey30/LeetCode-Questions-CompanyWise"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-[#1F1E1D] dark:hover:bg-[#262624] text-white dark:text-[#FAF9F5] border border-transparent dark:border-[#43433F] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>Explore & Star Krishna&apos;s Repository</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70" />
            </a>
          </div>
        </div>

        {/* CHAPTER 03 — THE CREATION */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-[#D97757] dark:hover:border-[#D97757] transition-all flex flex-col justify-between shadow-2xs group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-[#1F1E1D] text-indigo-600 dark:text-[#D97757] flex items-center justify-center border border-indigo-100 dark:border-[#43433F]">
                <Code2 className="w-5 h-5 text-indigo-600 dark:text-[#D97757]" />
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-[#A8A69C] uppercase tracking-wider">
                CHAPTER 03 — THE CREATION
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                The Builder: Aruchith
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                I&apos;m <strong className="text-slate-900 dark:text-[#FAF9F5]">Aruchith (@aruchith08)</strong>, an engineering student at BVRIT and the developer behind CompanyWise.
              </p>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              While preparing for technical interviews, I came across Krishna&apos;s collection. The information was incredibly useful, but exploring hundreds of CSV files wasn&apos;t exactly the experience I wanted when trying to focus on solving problems.
            </p>

            <p className="text-xs font-semibold text-[#0F1B3D] dark:text-[#D97757] leading-relaxed">
              That sparked an idea: what if all this valuable data could become one intuitive, interactive platform?
            </p>

            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              So I started building CompanyWise. What began as a way to make my own preparation easier gradually evolved into a complete web application designed for anyone who wants a more organized approach to interview preparation.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#43433F]/80">
              <span className="text-[11px] font-bold text-slate-900 dark:text-[#FAF9F5] block">
                Behind the build:
              </span>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-[#A8A69C]">
                <div className="flex items-start gap-2">
                  <span className="text-[#0F1B3D] dark:text-[#D97757] font-bold">•</span>
                  <span>Transformed 537 source CSV files into structured, searchable data.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0F1B3D] dark:text-[#D97757] font-bold">•</span>
                  <span>Developed a unified interface for discovering and filtering company-wise questions.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0F1B3D] dark:text-[#D97757] font-bold">•</span>
                  <span>Integrated LeetCode progress tracking with a privacy-conscious approach.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#0F1B3D] dark:text-[#D97757] font-bold">•</span>
                  <span>Built an interactive WebGL globe and responsive interface for a more engaging experience.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#43433F]/80 space-y-3">
            <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] leading-relaxed">
              CompanyWise is still evolving, driven by the same idea that started it:{' '}
              <strong className="text-slate-800 dark:text-[#FAF9F5]">
                make useful knowledge easier to access and better to use.
              </strong>
            </p>
            <a
              href="https://github.com/aruchith08/LeetCode-Questions-CompanyWise"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shadow-xs"
            >
              <Github className="w-4 h-4" />
              <span>Explore CompanyWise on GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
