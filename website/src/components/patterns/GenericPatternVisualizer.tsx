import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import type { GenericVisualizerStep } from '../../types/patterns';

interface GenericPatternVisualizerProps {
  title: string;
  subtitle: string;
  steps: GenericVisualizerStep[];
}

export default function GenericPatternVisualizer({
  title,
  subtitle,
  steps,
}: GenericPatternVisualizerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = steps.length;
  const step = steps[currentStepIndex] || steps[0];

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
      }, 2400);
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

  if (!step) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#43433F]/70">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Step Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] text-slate-700 dark:text-[#FAF9F5]">
            Step {step.stepNumber} of {totalSteps}
          </span>
          {step.statusBadge && (
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                step.statusBadge.variant === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50'
                  : step.statusBadge.variant === 'warning'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50'
                  : step.statusBadge.variant === 'danger'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50'
              }`}
            >
              {step.statusBadge.label}
            </span>
          )}
        </div>
      </div>

      {/* Main Elements Visualizer Stage */}
      {step.elements && step.elements.length > 0 && (
        <div className="py-4 px-3 bg-slate-50/70 dark:bg-[#1F1E1D]/60 rounded-xl border border-slate-100 dark:border-[#43433F]/70 flex flex-col items-center justify-center overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-max py-1">
            {step.elements.map((el, idx) => {
              const isHighlighted = step.highlightIndices?.includes(idx);
              const pointer = step.activePointers?.find(p => p.index === idx);

              return (
                <div key={idx} className="flex flex-col items-center">
                  {/* Top Pointer Badge */}
                  <div className="h-4 flex items-center justify-center mb-1">
                    {pointer && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          pointer.color === 'emerald'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : pointer.color === 'rose'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : pointer.color === 'amber'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : pointer.color === 'purple'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {pointer.name}
                      </span>
                    )}
                  </div>

                  {/* Element Box */}
                  <div
                    className={`min-w-9 h-9 sm:min-w-11 sm:h-11 px-2 rounded-lg flex items-center justify-center font-mono text-xs sm:text-sm font-bold border-2 transition-all duration-300 ${
                      isHighlighted
                        ? 'border-[#0F1B3D] bg-[#0F1B3D]/10 text-[#0F1B3D] dark:border-[#D97757] dark:bg-[#D97757]/20 dark:text-[#FAF9F5] shadow-xs scale-105'
                        : 'border-slate-200 dark:border-[#43433F] text-slate-700 dark:text-[#A8A69C] bg-white dark:bg-[#262624]'
                    }`}
                  >
                    {el}
                  </div>

                  {/* Bottom Index Label */}
                  <span className="text-[10px] font-mono text-slate-400 dark:text-[#7A7870] mt-1 font-medium">
                    {idx}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      {step.metrics && step.metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {step.metrics.map((m, mIdx) => (
            <div
              key={mIdx}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-[#1F1E1D]/80 border border-slate-200/80 dark:border-[#43433F]"
            >
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#A8A69C] tracking-wider truncate">
                {m.label}
              </div>
              <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-[#FAF9F5] mt-0.5 truncate">
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step Explanation Card */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 space-y-1.5 text-xs text-slate-700 dark:text-[#FAF9F5]">
        <div className="font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-1.5 text-xs">
          <Info className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757] shrink-0" />
          <span>{step.title}</span>
        </div>
        <p className="leading-relaxed text-slate-600 dark:text-[#A8A69C]">
          {step.explanation}
        </p>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#43433F] text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D] font-semibold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Step Prev / Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#43433F] text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#1F1E1D] font-semibold text-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
