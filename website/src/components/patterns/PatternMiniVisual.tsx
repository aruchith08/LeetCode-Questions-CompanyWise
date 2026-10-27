import PatternIcon from './PatternIcon';
import React from 'react';
import { Check, X } from 'lucide-react';

interface PatternMiniVisualProps {
  slug: string;
  isAvailable?: boolean;
}

export default function PatternMiniVisual({ slug, isAvailable }: PatternMiniVisualProps) {
  switch (slug) {
    case 'sliding-window':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2.5 flex flex-col justify-center items-center select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex items-center gap-1.5 relative">
            {/* Sliding window bounding box outline covering indices 1 to 3 */}
            <div
              className={`absolute -top-1 bottom-0 left-[34px] w-[114px] rounded-lg border-2 ${
                isAvailable
                  ? 'border-[#0F1B3D] bg-[#0F1B3D]/10 dark:border-[#D97757] dark:bg-[#D97757]/15'
                  : 'border-slate-400 bg-slate-400/10 dark:border-[#52524E]'
              } pointer-events-none transition-all shadow-xs`}
            />

            {[
              { val: 2, idx: 0, inWindow: false },
              { val: 1, idx: 1, inWindow: true },
              { val: 5, idx: 2, inWindow: true },
              { val: 1, idx: 3, inWindow: true },
              { val: 3, idx: 4, inWindow: false },
              { val: 2, idx: 5, inWindow: false },
            ].map(({ val, idx, inWindow }) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono text-xs font-semibold border transition-colors ${
                    inWindow
                      ? 'border-[#0F1B3D] text-[#0F1B3D] bg-[#0F1B3D]/10 dark:border-[#D97757] dark:text-[#FAF9F5] dark:bg-[#D97757]/20 shadow-2xs font-bold'
                      : 'border-slate-200 dark:border-[#43433F] text-slate-600 dark:text-[#A8A69C] bg-white dark:bg-[#262624]'
                  }`}
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-[#7A7870] mt-1">{idx}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'two-pointers':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2.5 flex flex-col justify-center items-center select-none border border-slate-100 dark:border-[#43433F]/70">
          {/* Two arrows pointing downwards matching screenshot */}
          <div className="flex items-center justify-between w-[184px] px-8 mb-1 text-[11px] font-bold">
            <span className="text-rose-500 dark:text-rose-400">↓</span>
            <span className="text-indigo-600 dark:text-indigo-400">↓</span>
          </div>
          {/* Array cells */}
          <div className="flex items-center gap-1.5">
            {[
              { val: '', highlighted: false },
              { val: '1', highlighted: true, color: 'rose' },
              { val: '', highlighted: false },
              { val: '', highlighted: false },
              { val: '', highlighted: true, color: 'indigo' },
              { val: '', highlighted: false },
            ].map((cell, idx) => (
              <div
                key={idx}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono text-xs font-semibold border ${
                  cell.highlighted
                    ? cell.color === 'rose'
                      ? 'border-rose-400 bg-rose-50 dark:border-rose-500/60 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 font-bold'
                      : 'border-indigo-400 bg-indigo-50 dark:border-indigo-500/60 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-[#43433F] bg-white dark:bg-[#262624]'
                }`}
              >
                {cell.val}
              </div>
            ))}
          </div>
        </div>
      );

    case 'hashing-and-frequency-counting':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex items-center justify-center gap-3 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[10px] font-mono font-bold text-rose-600 dark:text-rose-300">
              <span>#k1</span>
              <span>→</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[10px] font-mono font-bold text-blue-600 dark:text-blue-300">
              <span>#k2</span>
              <span>→</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-0.5 border border-slate-200 dark:border-[#43433F] rounded-lg p-1 bg-white dark:bg-[#262624]">
            <div className="w-6 h-5 flex items-center justify-center font-mono text-[10px] font-bold bg-slate-100 dark:bg-[#383835] text-slate-700 dark:text-slate-200 rounded">1</div>
            <div className="w-6 h-5 flex items-center justify-center font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold rounded">→ 2</div>
            <div className="w-6 h-5 flex items-center justify-center font-mono text-[10px] text-slate-500 dark:text-slate-400 rounded">1</div>
            <div className="w-6 h-5 flex items-center justify-center font-mono text-[10px] font-bold bg-slate-100 dark:bg-[#383835] text-slate-700 dark:text-slate-200 rounded">3</div>
            <div className="w-6 h-5 flex items-center justify-center font-mono text-[10px] text-rose-600 dark:text-rose-400 font-bold rounded">→ 4</div>
            <div className="w-6 h-5 flex items-center justify-center font-mono text-[10px] text-slate-500 dark:text-slate-400 rounded">4</div>
          </div>
        </div>
      );

    case 'prefix-sum':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2.5 flex flex-col justify-center items-center select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex items-center gap-1.5">
            {[
              { val: 1, idx: 0, high: false },
              { val: 2, idx: 1, high: true },
              { val: 3, idx: 2, high: true },
              { val: 2, idx: 3, high: true },
              { val: 1, idx: 4, high: false },
            ].map(({ val, idx, high }) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono text-xs font-semibold border ${
                    high
                      ? 'border-amber-400 bg-amber-50 dark:border-amber-500/60 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-bold'
                      : 'border-slate-200 dark:border-[#43433F] text-slate-600 dark:text-[#A8A69C] bg-white dark:bg-[#262624]'
                  }`}
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-slate-400 dark:text-[#7A7870] mt-1">{idx}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'binary-search':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2.5 flex flex-col justify-center items-center select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex items-center gap-1.5">
            {['', '', '8', '', '2'].map((val, idx) => (
              <div
                key={idx}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center font-mono text-xs font-semibold border ${
                  idx === 2
                    ? 'border-blue-500 bg-blue-500 text-white font-bold shadow-xs'
                    : 'border-slate-200 dark:border-[#43433F] text-slate-600 dark:text-[#A8A69C] bg-white dark:bg-[#262624]'
                }`}
              >
                {val}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-1.5 text-[10px] font-mono text-slate-400 dark:text-[#A8A69C]">
            <span>L</span>
            <span className="text-blue-500 font-bold">M</span>
            <span>R</span>
          </div>
        </div>
      );

    case 'fast-and-slow-pointers':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex items-center justify-center select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-400 flex items-center justify-center text-[10px] font-mono text-blue-600">●</div>
            <span className="text-slate-300 dark:text-[#43433F] text-xs">→</span>
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-400 flex items-center justify-center text-[10px] font-mono text-blue-600">●</div>
            <span className="text-slate-300 dark:text-[#43433F] text-xs">→</span>
            <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/60 border border-rose-500 flex items-center justify-center text-[10px] font-mono text-rose-600 font-bold">●</div>
            <span className="text-slate-300 dark:text-[#43433F] text-xs">→</span>
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-400 flex items-center justify-center text-[10px] font-mono text-blue-600">●</div>
            <span className="text-slate-300 dark:text-[#43433F] text-xs">↺</span>
          </div>
        </div>
      );

    case 'stack-and-monotonic-stack':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex items-center justify-center gap-4 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex flex-col-reverse w-8 h-14 border-x-2 border-b-2 border-slate-300 dark:border-[#52524E] rounded-b-md p-0.5 gap-1">
            <div className="h-3 w-full bg-blue-400/80 dark:bg-blue-500/60 rounded-xs" />
            <div className="h-3 w-full bg-blue-500 dark:bg-blue-600 rounded-xs" />
            <div className="h-3 w-full bg-blue-600 dark:bg-blue-700 rounded-xs" />
          </div>
          <span className="text-slate-400 text-xs">→</span>
          <div className="flex flex-col-reverse w-8 h-14 border-x-2 border-b-2 border-slate-300 dark:border-[#52524E] rounded-b-md p-0.5 gap-1">
            <div className="h-3 w-full bg-blue-400/80 dark:bg-blue-500/60 rounded-xs" />
            <div className="h-3 w-full bg-blue-600 dark:bg-blue-700 rounded-xs" />
          </div>
        </div>
      );

    case 'intervals-and-sweep-line':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex flex-col justify-center items-center gap-1.5 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="w-36 h-2.5 rounded-full bg-amber-400/70 dark:bg-amber-500/60 ml-[-20px]" />
          <div className="w-36 h-2.5 rounded-full bg-blue-500/80 dark:bg-blue-500/70 ml-[20px]" />
          <div className="w-24 h-2.5 rounded-full bg-rose-400/70 dark:bg-rose-500/60 ml-[-10px]" />
        </div>
      );

    case 'heap-top-k':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex items-center justify-center gap-4 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/60 border border-rose-400 flex items-center justify-center text-[10px] font-mono font-bold text-rose-600">
              1
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-400 flex items-center justify-center text-[9px] font-mono text-blue-600">
                3
              </div>
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-400 flex items-center justify-center text-[9px] font-mono text-blue-600">
                2
              </div>
            </div>
          </div>
          {/* Min-heap pyramid */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-3 h-2 border border-slate-300 dark:border-[#52524E]" />
            <div className="flex gap-0.5">
              <div className="w-3 h-2 border border-slate-300 dark:border-[#52524E]" />
              <div className="w-3 h-2 border border-slate-300 dark:border-[#52524E]" />
            </div>
            <div className="flex gap-0.5">
              <div className="w-3 h-2 border border-slate-300 dark:border-[#52524E]" />
              <div className="w-3 h-2 border border-slate-300 dark:border-[#52524E]" />
              <div className="w-3 h-2 border border-slate-300 dark:border-[#52524E]" />
            </div>
          </div>
        </div>
      );

    case 'tree-dfs':
    case 'tree-bfs':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex flex-col items-center justify-center gap-1 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-400 flex items-center justify-center text-[9px] font-mono font-bold text-emerald-600">
            R
          </div>
          <div className="flex items-center gap-5">
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-[#383835] border border-slate-300 dark:border-[#52524E]" />
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-[#383835] border border-slate-300 dark:border-[#52524E]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-[#383835]" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-[#383835]" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-[#383835]" />
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-[#383835]" />
          </div>
        </div>
      );

    case 'graph-traversal':
    case 'topological-sort':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex items-center justify-center gap-3 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 text-indigo-600 font-mono text-[10px] font-bold flex items-center justify-center">0</div>
            <span className="text-slate-400 text-xs">→</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 text-indigo-600 font-mono text-[10px] font-bold flex items-center justify-center">1</div>
            <span className="text-slate-400 text-xs">→</span>
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 text-indigo-600 font-mono text-[10px] font-bold flex items-center justify-center">2</div>
          </div>
        </div>
      );

    case 'union-find':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex items-center justify-center gap-4 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 border border-teal-400 flex items-center justify-center text-[9px] font-mono text-teal-700">A</div>
            <div className="flex gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-[#383835]" />
              <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-[#383835]" />
            </div>
          </div>
          <span className="text-teal-500 font-bold text-sm">∪</span>
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 border border-teal-400 flex items-center justify-center text-[9px] font-mono text-teal-700">B</div>
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-[#383835]" />
          </div>
        </div>
      );

    case 'backtracking':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex flex-col items-center justify-center gap-1.5 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-900/60 border border-purple-400 flex items-center justify-center text-[10px] font-mono font-bold text-purple-700">[]</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold">
              <span>[1]</span>
              <Check className="w-2.5 h-2.5" />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-rose-500 font-bold">
              <span>[2]</span>
              <X className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      );

    case 'dynamic-programming':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex items-center justify-center select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="grid grid-cols-4 gap-1 p-1 rounded-lg border border-slate-200 dark:border-[#43433F] bg-white dark:bg-[#262624]">
            <div className="w-5 h-5 bg-slate-100 dark:bg-[#383835] rounded-xs" />
            <div className="w-5 h-5 bg-slate-100 dark:bg-[#383835] rounded-xs" />
            <div className="w-5 h-5 bg-blue-100 dark:bg-blue-950/60 rounded-xs" />
            <div className="w-5 h-5 bg-slate-100 dark:bg-[#383835] rounded-xs" />
            <div className="w-5 h-5 bg-slate-100 dark:bg-[#383835] rounded-xs" />
            <div className="w-5 h-5 bg-blue-200 dark:bg-blue-900/60 rounded-xs" />
            <div className="w-5 h-5 bg-blue-500 text-white font-mono text-[9px] font-bold flex items-center justify-center rounded-xs">dp</div>
            <div className="w-5 h-5 bg-slate-100 dark:bg-[#383835] rounded-xs" />
          </div>
        </div>
      );

    case 'greedy-algorithms':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex items-center justify-center gap-2 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex items-end gap-1.5 h-12">
            <div className="w-5 h-4 bg-emerald-300 dark:bg-emerald-600/60 rounded-t-xs" />
            <div className="w-5 h-7 bg-emerald-400 dark:bg-emerald-500/70 rounded-t-xs" />
            <div className="w-5 h-11 bg-emerald-500 dark:bg-emerald-400 rounded-t-xs" />
            <div className="w-5 h-9 bg-emerald-400/80 dark:bg-emerald-500/70 rounded-t-xs" />
          </div>
        </div>
      );

    case 'bit-manipulation':
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl p-2 flex flex-col justify-center items-center gap-1.5 select-none border border-slate-100 dark:border-[#43433F]/70">
          <div className="flex items-center gap-1 font-mono text-xs font-bold">
            <span className="w-6 h-6 rounded bg-slate-200 dark:bg-[#383835] flex items-center justify-center text-slate-700 dark:text-slate-300">1</span>
            <span className="w-6 h-6 rounded bg-slate-200 dark:bg-[#383835] flex items-center justify-center text-slate-700 dark:text-slate-300">0</span>
            <span className="w-6 h-6 rounded bg-slate-200 dark:bg-[#383835] flex items-center justify-center text-slate-700 dark:text-slate-300">1</span>
            <span className="w-6 h-6 rounded bg-slate-200 dark:bg-[#383835] flex items-center justify-center text-slate-700 dark:text-slate-300">1</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
            <span>&</span>
            <span>|</span>
            <span>^</span>
            <span>{'<<'}</span>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-24 bg-slate-50 dark:bg-[#1F1E1D] rounded-xl flex items-center justify-center border border-slate-100 dark:border-[#43433F]/70">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
            <PatternIcon slug={slug} className="w-5 h-5" />
          </div>
        </div>
      );
  }
}
