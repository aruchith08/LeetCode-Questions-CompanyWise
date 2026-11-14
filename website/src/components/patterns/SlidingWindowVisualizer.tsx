import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Info,
  Sliders,
  Sparkles,
  SlidersHorizontal,
  Code2,
  AlertCircle,
  Check,
} from 'lucide-react';
import {
  VISUALIZER_ARRAY,
  VISUALIZER_WINDOW_SIZE,
} from '../../data/patternsData';
import { generateSlidingWindowSteps } from '../../utils/slidingWindowVisualizerEngine';

const PRESETS = [
  { label: 'Default Benchmark', array: [1, 12, -5, -6, 50, 3], k: 4 },
  { label: 'All Negative Values', array: [-2, -5, -1, -8, -3], k: 3 },
  { label: 'High Center Peak', array: [2, 1, 5, 1, 3, 2], k: 3 },
  { label: 'Alternating Swings', array: [5, -2, 6, -3, 8, -1], k: 2 },
];

const PYTHON_LINES = [
  { line: 1, text: 'def findMaxAverage(nums: list[int], k: int) -> float:' },
  { line: 2, text: '    # 1. Initialize window of size k' },
  { line: 3, text: '    window_sum = sum(nums[:k])' },
  { line: 4, text: '    max_avg = window_sum / k' },
  { line: 5, text: '' },
  { line: 6, text: '    # 2. Slide window across array in O(N) time' },
  { line: 7, text: '    for i in range(k, len(nums)):' },
  { line: 8, text: '        window_sum += nums[i] - nums[i - k]' },
  { line: 9, text: '        max_avg = max(max_avg, window_sum / k)' },
  { line: 10, text: '' },
  { line: 11, text: '    return max_avg' },
];

const TYPESCRIPT_LINES = [
  { line: 1, text: 'function findMaxAverage(nums: number[], k: number): number {' },
  { line: 2, text: '  // 1. Initialize window of size k' },
  { line: 3, text: '  let windowSum = 0;' },
  { line: 4, text: '  for (let i = 0; i < k; i++) windowSum += nums[i];' },
  { line: 5, text: '  let maxAvg = windowSum / k;' },
  { line: 6, text: '' },
  { line: 7, text: '  // 2. Slide window through rest of array' },
  { line: 8, text: '  for (let i = k; i < nums.length; i++) {' },
  { line: 9, text: '    windowSum += nums[i] - nums[i - k];' },
  { line: 10, text: '    maxAvg = Math.max(maxAvg, windowSum / k);' },
  { line: 11, text: '  }' },
  { line: 12, text: '  return maxAvg;' },
  { line: 13, text: '}' },
];

export default function SlidingWindowVisualizer() {
  const [array, setArray] = useState<number[]>(VISUALIZER_ARRAY);
  const [windowSize, setWindowSize] = useState<number>(VISUALIZER_WINDOW_SIZE);
  const [steps, setSteps] = useState(() => generateSlidingWindowSteps(VISUALIZER_ARRAY, VISUALIZER_WINDOW_SIZE));

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowMode, setWindowMode] = useState<'fixed' | 'variable'>('fixed');

  // Custom Input State
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customArrayStr, setCustomArrayStr] = useState('1, 12, -5, -6, 50, 3');
  const [customKStr, setCustomKStr] = useState('4');
  const [customError, setCustomError] = useState<string | null>(null);

  // Synchronized Code State
  const [selectedLang, setSelectedLang] = useState<'python' | 'typescript'>('python');
  const [isCodeVisible, setIsCodeVisible] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = steps.length;
  const step = steps[currentStepIndex] || steps[0];

  // Auto-play interval handler
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, totalSteps]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStepIndex >= totalSteps - 1) {
        setCurrentStepIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const handleApplyCustom = (arrStr: string, kStr: string) => {
    setCustomError(null);
    const parsedNums = arrStr
      .split(/[,\s]+/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(Number);

    if (parsedNums.length < 2) {
      setCustomError('Please provide at least 2 numbers.');
      return;
    }
    if (parsedNums.length > 12) {
      setCustomError('Please provide at most 12 numbers for optimal visualization.');
      return;
    }
    if (parsedNums.some(n => isNaN(n))) {
      setCustomError('Array contains invalid numbers.');
      return;
    }

    const parsedK = parseInt(kStr, 10);
    if (isNaN(parsedK) || parsedK < 1 || parsedK > parsedNums.length) {
      setCustomError(`Window size k must be between 1 and ${parsedNums.length}.`);
      return;
    }

    const newSteps = generateSlidingWindowSteps(parsedNums, parsedK);
    setArray(parsedNums);
    setWindowSize(parsedK);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setCustomError(null);
  };

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    const arrStr = preset.array.join(', ');
    const kStr = String(preset.k);
    setCustomArrayStr(arrStr);
    setCustomKStr(kStr);
    handleApplyCustom(arrStr, kStr);
  };

  // Determine active line in code for current step
  const activeLineInfo = useMemo(() => {
    if (!step) return null;
    const isLast = currentStepIndex === steps.length - 1;
    if (selectedLang === 'python') {
      if (step.activeLineNumber === 3) return { lines: [3, 4], label: 'Initialize window of size k' };
      if (step.activeLineNumber === 9) return { lines: [8, 9], label: 'Slide window & update best average' };
      if (step.activeLineNumber === 8) return { lines: [8], label: 'Slide window: subtract leaving, add entering' };
      if (isLast) return { lines: [11], label: 'Return final max average' };
      return { lines: [7], label: 'Iterate next window position' };
    } else {
      if (step.activeLineNumber === 3) return { lines: [3, 4, 5], label: 'Initialize window sum of size k' };
      if (step.activeLineNumber === 9) return { lines: [9, 10], label: 'Slide window & update best average' };
      if (step.activeLineNumber === 8) return { lines: [9], label: 'Slide window: subtract leaving, add entering' };
      if (isLast) return { lines: [12], label: 'Return final max average' };
      return { lines: [8], label: 'Iterate next window position' };
    }
  }, [step, selectedLang, currentStepIndex, steps.length]);

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-xs">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-[#43433F]/70">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
            5
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
              Sliding Window Interactive Visualization & Execution Playground
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
              Step through the sliding window invariant execution with custom inputs and synchronized code highlighting.
            </p>
          </div>
        </div>

        {/* Mode Selector & Custom Input Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setIsCustomOpen(!isCustomOpen)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
              isCustomOpen
                ? 'bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] border-transparent shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#1F1E1D] dark:text-[#FAF9F5] dark:hover:bg-[#262624] border-slate-200/80 dark:border-[#43433F]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Custom Input</span>
          </button>

          <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F]">
            <button
              type="button"
              onClick={() => setWindowMode('fixed')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                windowMode === 'fixed'
                  ? 'bg-white dark:bg-[#30302E] text-[#0F1B3D] dark:text-[#FAF9F5] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5]'
              }`}
            >
              Fixed-size (k = {windowSize})
            </button>
            <button
              type="button"
              onClick={() => setWindowMode('variable')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                windowMode === 'variable'
                  ? 'bg-white dark:bg-[#30302E] text-[#0F1B3D] dark:text-[#FAF9F5] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5]'
              }`}
            >
              Variable-size Concept
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Custom Input Drawer */}
      {isCustomOpen && (
        <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757]" />
              <span>Simulate Your Own Array & Window Size</span>
            </div>
            <span className="text-[10.5px] font-mono text-slate-500 dark:text-[#A8A69C]">
              2 to 12 integers
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-[#A8A69C] mr-1">
              Presets:
            </span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p)}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white dark:bg-[#262624] text-slate-700 dark:text-[#FAF9F5] border border-slate-200 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#A8A69C]">
                Array Elements (comma separated):
              </label>
              <input
                type="text"
                value={customArrayStr}
                onChange={e => setCustomArrayStr(e.target.value)}
                placeholder="e.g. 1, 12, -5, -6, 50, 3"
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-[#262624] border border-slate-200 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#0F1B3D] dark:focus:ring-[#D97757]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#A8A69C]">
                Window Size (k):
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={customKStr}
                onChange={e => setCustomKStr(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-white dark:bg-[#262624] border border-slate-200 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#0F1B3D] dark:focus:ring-[#D97757]"
              />
            </div>
          </div>

          {customError && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{customError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60 dark:border-[#43433F]/70">
            <button
              type="button"
              onClick={() => handlePresetSelect(PRESETS[0])}
              className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5] cursor-pointer"
            >
              Reset to Benchmark
            </button>
            <button
              type="button"
              onClick={() => handleApplyCustom(customArrayStr, customKStr)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] shadow-2xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simulate Visualizer</span>
            </button>
          </div>
        </div>
      )}

      {windowMode === 'fixed' ? (
        <>
          {/* Main Visualizer Stage */}
          <div className="space-y-4">
            {/* Array Row with Window Box */}
            <div className="flex flex-col items-center justify-center py-4 px-3 bg-slate-50/70 dark:bg-[#1F1E1D]/60 rounded-xl border border-slate-100 dark:border-[#43433F]/70 overflow-x-auto">
              <div className="flex items-center gap-3 px-2 min-w-max">
                <span className="font-semibold text-xs text-slate-500 dark:text-[#A8A69C]">
                  Array:
                </span>

                <div className="flex items-center gap-2 sm:gap-2.5 relative py-1">
                  {array.map((val, idx) => {
                    const isInWindow = step.windowIndices.includes(idx);
                    const isAdded = step.addedElement?.index === idx;
                    const isRemoved = step.removedElement?.index === idx;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center font-mono text-sm sm:text-base font-bold transition-all duration-300 border-2 ${
                            isAdded
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-400 scale-105 shadow-sm'
                              : isRemoved
                              ? 'border-rose-400 bg-rose-50 text-rose-600 line-through opacity-75 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-500'
                              : isInWindow
                              ? 'border-[#0F1B3D] bg-[#0F1B3D]/5 text-[#0F1B3D] dark:border-[#D97757] dark:bg-[#D97757]/15 dark:text-[#FAF9F5] shadow-xs'
                              : 'border-slate-200 dark:border-[#43433F] text-slate-700 dark:text-[#A8A69C] bg-white dark:bg-[#1F1E1D]'
                          }`}
                        >
                          {val}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-[#8E8C82] mt-1 font-medium">
                          {idx}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-label explaining entering and leaving elements */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-2.5 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs bg-[#0F1B3D] dark:bg-[#D97757]" />
                  <span className="text-slate-500 dark:text-[#A8A69C]">Active Window (k={windowSize})</span>
                </div>
                {step.removedElement && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-rose-500" />
                    <span className="text-rose-600 dark:text-rose-400">
                      Leaving: nums[{step.removedElement.index}] = {step.removedElement.value}
                    </span>
                  </div>
                )}
                {step.addedElement && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-xs bg-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Entering: nums[{step.addedElement.index}] = {step.addedElement.value}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Row (4 stat cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Metric 1: Window Size */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-[#1F1E1D]/80 border border-slate-200/80 dark:border-[#43433F]">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#A8A69C] tracking-wider">
                  Window Size
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-[#FAF9F5] mt-0.5">
                  {windowSize}
                </div>
              </div>

              {/* Metric 2: Current Sum */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-[#1F1E1D]/80 border border-slate-200/80 dark:border-[#43433F]">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#A8A69C] tracking-wider">
                  Current Sum
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-[#FAF9F5] mt-0.5">
                  {step.currentSum}
                </div>
              </div>

              {/* Metric 3: Current Average */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-[#1F1E1D]/80 border border-slate-200/80 dark:border-[#43433F]">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#A8A69C] tracking-wider">
                  Current Average
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-[#0F1B3D] dark:text-[#D97757] mt-0.5">
                  {step.currentAverage.toFixed(2)}
                </div>
              </div>

              {/* Metric 4: Best Average */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-[#1F1E1D]/80 border border-slate-200/80 dark:border-[#43433F]">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#A8A69C] tracking-wider">
                  Best Average
                </div>
                <div className="text-base sm:text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                  {step.bestAverageSoFar.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Step Explanation Callout Banner */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/90 dark:border-[#43433F] flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#0F1B3D] dark:bg-[#D97757] text-white dark:text-[#1F1E1D] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Info className="w-3 h-3" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                  Step {step.stepNumber} of {totalSteps}: {step.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                  {step.explanation}
                </p>
                <div className="text-[11px] font-mono text-[#0F1B3D] dark:text-[#D97757] pt-0.5 font-semibold">
                  {step.formula}
                </div>
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              {/* Reset button */}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* Step indicator */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStepIndex
                        ? 'w-5 bg-[#0F1B3D] dark:bg-[#D97757]'
                        : 'w-1.5 bg-slate-300 dark:bg-[#43433F] hover:bg-slate-400'
                    }`}
                    aria-label={`Jump to step ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-[#43433F] bg-white dark:bg-[#30302E] text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStepIndex >= totalSteps - 1}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-[#43433F] bg-white dark:bg-[#30302E] text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D] transition-colors cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757]" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757] fill-[#0F1B3D] dark:fill-[#D97757]" />
                      <span>Auto Play</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Synchronized Code Execution Frame */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#43433F]/70 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                  <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Synchronized Code Stepper
                  </span>
                  {activeLineInfo && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300/80 dark:border-amber-700/50">
                      {activeLineInfo.label}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedLang('python')}
                      className={`px-2 py-0.5 rounded-md font-mono font-medium transition-colors cursor-pointer ${
                        selectedLang === 'python'
                          ? 'bg-white dark:bg-[#30302E] text-[#0F1B3D] dark:text-[#FAF9F5] shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-[#A8A69C]'
                      }`}
                    >
                      Python
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedLang('typescript')}
                      className={`px-2 py-0.5 rounded-md font-mono font-medium transition-colors cursor-pointer ${
                        selectedLang === 'typescript'
                          ? 'bg-white dark:bg-[#30302E] text-[#0F1B3D] dark:text-[#FAF9F5] shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-900 dark:text-[#A8A69C]'
                      }`}
                    >
                      TypeScript
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCodeVisible(!isCodeVisible)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] cursor-pointer"
                  >
                    {isCodeVisible ? 'Hide Code' : 'Show Code'}
                  </button>
                </div>
              </div>

              {isCodeVisible && (
                <div className="rounded-xl overflow-hidden border border-slate-200/80 dark:border-[#43433F] bg-slate-900 text-slate-200 font-mono text-xs shadow-inner">
                  <div className="py-2.5 overflow-x-auto">
                    {(selectedLang === 'python' ? PYTHON_LINES : TYPESCRIPT_LINES).map(lineObj => {
                      const isActive = activeLineInfo?.lines.includes(lineObj.line);
                      return (
                        <div
                          key={lineObj.line}
                          className={`flex items-center px-4 py-0.5 font-mono transition-colors ${
                            isActive
                              ? 'bg-[#D97757]/20 text-[#FAF9F5] border-l-4 border-[#D97757] font-semibold'
                              : 'hover:bg-slate-800/40 opacity-80'
                          }`}
                        >
                          <span className="w-8 shrink-0 text-slate-500 text-[10px] select-none text-right pr-3">
                            {lineObj.line}
                          </span>
                          <span className="flex-1 whitespace-pre">{lineObj.text}</span>
                          {isActive && (
                            <span className="ml-2 text-[10px] text-[#D97757] font-bold px-1.5 py-0.2 rounded bg-[#D97757]/10 uppercase tracking-wider select-none shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Variable Window Concept Explainer */
        <div className="space-y-3 py-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757]" />
              Dynamic Expansion and Contraction Mechanism
            </h4>
            <p className="text-xs text-slate-600 dark:text-[#A8A69C] leading-relaxed">
              Unlike a fixed window where size <code className="px-1 py-0.5 rounded bg-slate-200 dark:bg-[#30302E] font-mono text-[11px]">k</code> is static, a variable-size window dynamically stretches and shrinks based on a validity condition:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px]">
                  1. Expansion (Right Pointer):
                </span>
                <p className="text-slate-600 dark:text-[#A8A69C] text-[11px]">
                  Move the <code className="font-mono text-[10px] font-bold">right</code> pointer forward to include new elements into the window until the condition is either satisfied or violated.
                </p>
              </div>
              <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-300 text-[11px]">
                  2. Contraction (Left Pointer):
                </span>
                <p className="text-slate-600 dark:text-[#A8A69C] text-[11px]">
                  While the window violates the condition (e.g. duplicate character found or sum exceeds target), advance the <code className="font-mono text-[10px] font-bold">left</code> pointer forward to restore validity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
