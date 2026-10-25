import React from 'react';
import { CheckCircle2, Zap, Tag } from 'lucide-react';

interface HeroIllustrationProps {
  className?: string;
}

export default function HeroIllustration({ className = '' }: HeroIllustrationProps) {
  return (
    <div
      className={`relative w-full max-w-[340px] flex items-center justify-center select-none ${className}`}
      aria-hidden="true"
    >
      {/* Editor Window Container */}
      <div className="w-full rounded-xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#111115] shadow-lg shadow-neutral-200/40 dark:shadow-black/50 overflow-hidden font-mono transition-all">
        {/* Window Chrome Titlebar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/90 dark:bg-neutral-900/80 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            </div>
            <div className="flex items-center gap-1.5 pl-2 text-neutral-400 dark:text-neutral-500 text-[11px]">
              <span>leetcode</span>
              <span>/</span>
              <span className="text-slate-800 dark:text-neutral-200 font-semibold">1. Two Sum</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            Easy
          </span>
        </div>

        {/* Code Body with Real, Legible Syntax Highlighting */}
        <div className="p-3.5 text-[11px] leading-[1.7] bg-white dark:bg-[#111115] text-slate-800 dark:text-neutral-200">
          <div className="flex">
            <span className="w-5 text-neutral-400 dark:text-neutral-600 select-none text-[10px]">1</span>
            <span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">def</span>{' '}
              <span className="text-purple-600 dark:text-purple-400 font-semibold">twoSum</span>
              <span className="text-neutral-500">(</span>
              <span className="text-slate-700 dark:text-neutral-300">nums</span>
              <span className="text-neutral-400">: </span>
              <span className="text-cyan-600 dark:text-cyan-400">list</span>
              <span className="text-neutral-500">, </span>
              <span className="text-slate-700 dark:text-neutral-300">target</span>
              <span className="text-neutral-400">: </span>
              <span className="text-cyan-600 dark:text-cyan-400">int</span>
              <span className="text-neutral-500">):</span>
            </span>
          </div>

          <div className="flex">
            <span className="w-5 text-neutral-400 dark:text-neutral-600 select-none text-[10px]">2</span>
            <span className="pl-3">
              <span className="text-slate-700 dark:text-neutral-300">seen</span>{' '}
              <span className="text-neutral-400">=</span>{' '}
              <span className="text-amber-600 dark:text-amber-400">&#123;&#125;</span>
            </span>
          </div>

          <div className="flex">
            <span className="w-5 text-neutral-400 dark:text-neutral-600 select-none text-[10px]">3</span>
            <span className="pl-3">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">for</span>{' '}
              <span className="text-slate-700 dark:text-neutral-300">i, n</span>{' '}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">in</span>{' '}
              <span className="text-purple-600 dark:text-purple-400">enumerate</span>
              <span className="text-neutral-500">(nums):</span>
            </span>
          </div>

          <div className="flex">
            <span className="w-5 text-neutral-400 dark:text-neutral-600 select-none text-[10px]">4</span>
            <span className="pl-6">
              <span className="text-slate-700 dark:text-neutral-300">diff</span>{' '}
              <span className="text-neutral-400">=</span>{' '}
              <span className="text-slate-700 dark:text-neutral-300">target</span>{' '}
              <span className="text-neutral-400">-</span>{' '}
              <span className="text-slate-700 dark:text-neutral-300">n</span>
            </span>
          </div>

          <div className="flex">
            <span className="w-5 text-neutral-400 dark:text-neutral-600 select-none text-[10px]">5</span>
            <span className="pl-6">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">if</span>{' '}
              <span className="text-slate-700 dark:text-neutral-300">diff</span>{' '}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">in</span>{' '}
              <span className="text-slate-700 dark:text-neutral-300">seen:</span>
            </span>
          </div>

          <div className="flex">
            <span className="w-5 text-neutral-400 dark:text-neutral-600 select-none text-[10px]">6</span>
            <span className="pl-9">
              <span className="text-rose-600 dark:text-rose-400 font-semibold">return</span>{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">[seen[diff], i]</span>
            </span>
          </div>

          <div className="flex">
            <span className="w-5 text-neutral-400 dark:text-neutral-600 select-none text-[10px]">7</span>
            <span className="pl-6">
              <span className="text-slate-700 dark:text-neutral-300">seen[n]</span>{' '}
              <span className="text-neutral-400">=</span>{' '}
              <span className="text-slate-700 dark:text-neutral-300">i</span>
            </span>
          </div>
        </div>

        {/* Realistic Benchmark Panel */}
        <div className="px-3.5 py-2.5 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-neutral-900/60 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Runtime: 44 ms</span>
            <span className="text-neutral-400 dark:text-neutral-500 font-normal">· Beats 96.8%</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 dark:text-neutral-400">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>O(N)</span>
          </div>
        </div>

        {/* Company Frequency Badges in Editor Footer */}
        <div className="px-3.5 py-2 border-t border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-[#111115] flex items-center justify-between text-[10px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-neutral-400" />
            <span className="text-neutral-400">Asked by:</span>
            <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-medium">Google</span>
            <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-medium">Amazon</span>
            <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 font-medium">+69 more</span>
          </div>
          <span className="font-semibold text-blue-600 dark:text-blue-400">Top 1% freq</span>
        </div>
      </div>
    </div>
  );
}
