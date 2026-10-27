import React, { useState } from 'react';
import { Copy, Check, Maximize2 } from 'lucide-react';
import CodeSnippetModal from './CodeSnippetModal';

export interface CodeComparisonProps {
  title?: string;
  subtitle?: string;
  pythonBrute?: string;
  pythonOptimized?: string;
  tsBrute?: string;
  tsOptimized?: string;
  bruteComplexity?: { time: string; space: string; notes?: string };
  optimizedComplexity?: { time: string; space: string; notes?: string };
  bruteExplanation?: string;
  optimizedExplanation?: string;
}

export default function CodeComparison({
  title = 'Example: Maximum Average Subarray I (LeetCode #643)',
  subtitle = 'Find the maximum average of any contiguous subarray of size 4 in the array [1, 12, -5, -6, 50, 3].',
  pythonBrute,
  pythonOptimized,
  tsBrute,
  tsOptimized,
  bruteComplexity = { time: 'O(N²)', space: 'O(1)' },
  optimizedComplexity = { time: 'O(N)', space: 'O(1)' },
  bruteExplanation,
  optimizedExplanation,
}: CodeComparisonProps = {}) {
  const [copiedSection, setCopiedSection] = useState<'brute' | 'optimized' | null>(null);
  const [language, setLanguage] = useState<'python' | 'typescript'>('python');
  const [expandedModal, setExpandedModal] = useState<'brute' | 'optimized' | null>(null);

  const hasBrute = Boolean(pythonBrute || tsBrute);
  const bruteCode = language === 'python' ? (pythonBrute || '') : (tsBrute || '');
  const optimizedCode = language === 'python' ? (pythonOptimized || '') : (tsOptimized || '');

  const handleCopy = (code: string, type: 'brute' | 'optimized') => {
    navigator.clipboard.writeText(code);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const currentBruteExplanation = bruteExplanation || 'Naive or exhaustive search checking combinations without pattern optimization.';
  const currentOptimizedExplanation = optimizedExplanation || 'Optimal algorithmic technique avoiding redundant recomputation.';

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header with Title and Language Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#43433F]">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Language switcher */}
        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLanguage('python')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              language === 'python'
                ? 'bg-white dark:bg-[#262624] text-slate-900 dark:text-[#FAF9F5] shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5]'
            }`}
          >
            Python
          </button>
          <button
            type="button"
            onClick={() => setLanguage('typescript')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              language === 'typescript'
                ? 'bg-white dark:bg-[#262624] text-slate-900 dark:text-[#FAF9F5] shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5]'
            }`}
          >
            TypeScript
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className={`grid grid-cols-1 ${hasBrute ? 'lg:grid-cols-2' : ''} gap-4`}>
        {/* Left: Brute Force Approach (rendered when available) */}
        {hasBrute && (
          <div className="rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 p-3.5 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-rose-700 dark:text-rose-400">
                  Brute Force Approach
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                    {bruteComplexity.time}
                  </span>
                  <button
                    type="button"
                    onClick={() => setExpandedModal('brute')}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#1F1E1D] transition-colors cursor-pointer"
                    title="Expand to big card view"
                    aria-label="Expand code in big card modal"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(bruteCode, 'brute')}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#1F1E1D] transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedSection === 'brute' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#A8A69C] mb-2.5">
                {currentBruteExplanation}
              </p>

              <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-2xs">
                <code>{bruteCode}</code>
              </pre>
            </div>

            <div className="pt-2.5 border-t border-rose-100 dark:border-rose-900/30 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#A8A69C]">
              <span>Time: {bruteComplexity.time}</span>
              <span>Space: {bruteComplexity.space}</span>
            </div>
          </div>
        )}

        {/* Right: Optimized Approach */}
        <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 p-3.5 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                Optimized Approach
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {optimizedComplexity.time}
                </span>
                <button
                  type="button"
                  onClick={() => setExpandedModal('optimized')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#1F1E1D] transition-colors cursor-pointer"
                  title="Expand to big card view"
                  aria-label="Expand code in big card modal"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(optimizedCode, 'optimized')}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#1F1E1D] transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {copiedSection === 'optimized' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A8A69C] mb-2.5">
              {currentOptimizedExplanation}
            </p>

            <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-2xs">
              <code>{optimizedCode}</code>
            </pre>
          </div>

          <div className="pt-2.5 border-t border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#A8A69C]">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Time: {optimizedComplexity.time}</span>
            <span>Space: {optimizedComplexity.space}</span>
          </div>
        </div>
      </div>

      {/* Big Card Code Modal */}
      <CodeSnippetModal
        isOpen={expandedModal !== null}
        onClose={() => setExpandedModal(null)}
        title={
          expandedModal === 'brute'
            ? `Brute Force Approach — ${title}`
            : `Optimized Approach — ${title}`
        }
        subtitle={
          expandedModal === 'brute'
            ? currentBruteExplanation
            : currentOptimizedExplanation
        }
        timeComplexity={expandedModal === 'brute' ? bruteComplexity.time : optimizedComplexity.time}
        spaceComplexity={expandedModal === 'brute' ? bruteComplexity.space : optimizedComplexity.space}
        languages={[
          {
            id: 'python',
            label: 'Python',
            code: expandedModal === 'brute' ? (pythonBrute || '') : (pythonOptimized || ''),
          },
          {
            id: 'typescript',
            label: 'TypeScript',
            code: expandedModal === 'brute' ? (tsBrute || '') : (tsOptimized || ''),
          },
        ]}
        activeLanguage={language}
        onLanguageChange={(newLang: string) => setLanguage(newLang as 'python' | 'typescript')}
      />
    </div>
  );
}
