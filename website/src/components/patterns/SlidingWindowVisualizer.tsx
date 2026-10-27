import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import {
  VISUALIZER_ARRAY,
  VISUALIZER_WINDOW_SIZE,
  VISUALIZER_STEPS,
} from '../../data/patternsData';

export default function SlidingWindowVisualizer() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowMode, setWindowMode] = useState<'fixed' | 'variable'>('fixed');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const step = VISUALIZER_STEPS[currentStepIndex];
  const totalSteps = VISUALIZER_STEPS.length;

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

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-xs">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-[#43433F]/70">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
            Interactive Visualization
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
            See how a fixed-size sliding window works to find the maximum average subarray.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
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
              Fixed-size (k = 4)
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
                  {VISUALIZER_ARRAY.map((val, idx) => {
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
                  <span className="text-slate-500 dark:text-[#A8A69C]">Active Window</span>
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
                  {VISUALIZER_WINDOW_SIZE}
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
                  Step {step.stepNumber}: {step.title}
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
              <div className="flex items-center gap-1.5">
                {VISUALIZER_STEPS.map((_, idx) => (
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
