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
  bruteComplexity?: { time: string; space: string };
  optimizedComplexity?: { time: string; space: string };
}

export default function CodeComparison({
  title = 'Example: Maximum Average Subarray I (LeetCode #643)',
  subtitle = 'Find the maximum average of any contiguous subarray of size 4 in the array [1, 12, -5, -6, 50, 3].',
  pythonBrute: customPythonBrute,
  pythonOptimized: customPythonOptimized,
  tsBrute: customTsBrute,
  tsOptimized: customTsOptimized,
  bruteComplexity = { time: 'O(N × K)', space: 'O(1)' },
  optimizedComplexity = { time: 'O(N)', space: 'O(1)' },
}: CodeComparisonProps = {}) {
  const [copiedSection, setCopiedSection] = useState<'brute' | 'optimized' | null>(null);
  const [language, setLanguage] = useState<'python' | 'typescript'>('python');
  const [expandedModal, setExpandedModal] = useState<'brute' | 'optimized' | null>(null);

  const defaultPythonBrute = `def max_average_bruteforce(nums: list[int], k: int) -> float:
    n = len(nums)
    max_sum = float('-inf')
    
    # Check all possible subarrays of size k
    for i in range(n - k + 1):
        window_sum = 0
        for j in range(i, i + k):
            window_sum += nums[j]
        max_sum = max(max_sum, window_sum)
        
    return max_sum / k`;

  const defaultPythonOptimized = `def max_average_sliding(nums: list[int], k: int) -> float:
    # Initialize the sum of first window
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide the window across the array
    for i in range(k, len(nums)):
        # Subtract exiting element, add entering element
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
        
    return max_sum / k`;

  const defaultTsBrute = `function findMaxAverageBrute(nums: number[], k: number): number {
  let maxSum = -Infinity;
  const n = nums.length;

  // Recalculate sum of k elements for each window
  for (let i = 0; i <= n - k; i++) {
    let windowSum = 0;
    for (let j = i; j < i + k; j++) {
      windowSum += nums[j];
    }
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum / k;
}`;

  const defaultTsOptimized = `function findMaxAverageSliding(nums: number[], k: number): number {
  // Step 1: Initialize sum of first k elements
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;

  // Step 2: Slide window: O(1) update per step
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum / k;
}`;

  const pythonBrute = customPythonBrute || defaultPythonBrute;
  const pythonOptimized = customPythonOptimized || defaultPythonOptimized;
  const tsBrute = customTsBrute || defaultTsBrute;
  const tsOptimized = customTsOptimized || defaultTsOptimized;

  const bruteCode = language === 'python' ? pythonBrute : tsBrute;
  const optimizedCode = language === 'python' ? pythonOptimized : tsOptimized;

  const handleCopy = (code: string, type: 'brute' | 'optimized') => {
    navigator.clipboard.writeText(code);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2000);
  };

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
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
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
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Brute Force Approach */}
        <div className="rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/20 dark:bg-rose-950/10 p-3.5 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-rose-700 dark:text-rose-400">
                Brute Force Approach
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                  O(N × K)
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
              Calculate the sum for every possible subarray of size k from scratch.
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

        {/* Right: Optimized Sliding Window Approach */}
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
              Optimal algorithmic technique avoiding redundant recomputation.
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
            ? 'Brute Force Approach — Maximum Average Subarray I (LeetCode #643)'
            : 'Optimized Sliding Window — Maximum Average Subarray I (LeetCode #643)'
        }
        subtitle={
          expandedModal === 'brute'
            ? 'Recalculates sum of k elements for every window from scratch.'
            : 'Uses rolling sum update in O(1) amortized time per window slide.'
        }
        timeComplexity={expandedModal === 'brute' ? 'O(N × K)' : 'O(N)'}
        spaceComplexity="O(1)"
        languages={[
          {
            id: 'python',
            label: 'Python',
            code: expandedModal === 'brute' ? pythonBrute : pythonOptimized,
          },
          {
            id: 'typescript',
            label: 'TypeScript',
            code: expandedModal === 'brute' ? tsBrute : tsOptimized,
          },
        ]}
        activeLanguage={language}
        onLanguageChange={(newLang: string) => setLanguage(newLang as 'python' | 'typescript')}
      />
    </div>
  );
}
