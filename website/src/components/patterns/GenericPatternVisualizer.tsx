import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info,
  Database,
} from 'lucide-react';
import type { GenericVisualizerStep } from '../../types/patterns';

interface GenericPatternVisualizerProps {
  title: string;
  subtitle: string;
  steps: GenericVisualizerStep[];
}

function AuxiliaryStateInspection({
  auxiliaryData,
}: {
  auxiliaryData: Record<string, any>;
}) {
  const keys = Object.keys(auxiliaryData).filter(
    k => auxiliaryData[k] !== undefined && auxiliaryData[k] !== null
  );

  if (keys.length === 0) return null;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-[#43433F] bg-slate-50/80 dark:bg-[#1F1E1D]/80 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#FAF9F5] border-b border-slate-200/60 dark:border-[#43433F]/70 pb-2">
        <Database className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757]" />
        <span>Internal Data Structure & Auxiliary State</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Render Hash Map if present */}
        {'map' in auxiliaryData && typeof auxiliaryData.map === 'object' && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#262624] border border-slate-200/70 dark:border-[#43433F] space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-[#FAF9F5] flex items-center justify-between">
              <span>Hash Map Table</span>
              <span className="font-mono text-[10px] text-slate-400">
                {Object.keys(auxiliaryData.map).length} entries
              </span>
            </div>
            {Object.keys(auxiliaryData.map).length === 0 ? (
              <div className="text-[11px] text-slate-400 italic">Map is currently empty</div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {Object.entries(auxiliaryData.map).map(([k, v]) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50"
                  >
                    <span className="font-bold">{k}</span>
                    <span className="text-slate-400">→</span>
                    <span>idx {String(v)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Render Monotonic Stack if present */}
        {'stack' in auxiliaryData && Array.isArray(auxiliaryData.stack) && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#262624] border border-slate-200/70 dark:border-[#43433F] space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-[#FAF9F5] flex items-center justify-between">
              <span>Monotonic Stack (LIFO)</span>
              <span className="font-mono text-[10px] text-slate-400">
                Size {auxiliaryData.stack.length}
              </span>
            </div>
            {auxiliaryData.stack.length === 0 ? (
              <div className="text-[11px] text-slate-400 italic">Stack is currently empty</div>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5">
                {auxiliaryData.stack.map((item: any, i: number) => {
                  const isTop = i === auxiliaryData.stack.length - 1;
                  return (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-md border ${
                        isTop
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50 font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1F1E1D] dark:text-[#FAF9F5] dark:border-[#43433F]'
                      }`}
                    >
                      {String(item)}
                      {isTop && (
                        <span className="text-[9px] uppercase tracking-wider text-rose-600 dark:text-rose-400 ml-0.5">
                          Top
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Render Heap if present */}
        {'heap' in auxiliaryData && Array.isArray(auxiliaryData.heap) && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#262624] border border-slate-200/70 dark:border-[#43433F] space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-[#FAF9F5] flex items-center justify-between">
              <span>Min-Heap Priority Queue</span>
              <span className="font-mono text-[10px] text-slate-400">
                {auxiliaryData.heap.length} items
              </span>
            </div>
            {auxiliaryData.heap.length === 0 ? (
              <div className="text-[11px] text-slate-400 italic">Heap is empty</div>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5">
                {auxiliaryData.heap.map((val: any, idx: number) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded-md border ${
                      idx === 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50 font-bold'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#1F1E1D] dark:text-[#FAF9F5] dark:border-[#43433F]'
                    }`}
                  >
                    {String(val)}
                    {idx === 0 && (
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 ml-0.5">
                        Root
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Render Prefix Array if present */}
        {'prefix' in auxiliaryData && Array.isArray(auxiliaryData.prefix) && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#262624] border border-slate-200/70 dark:border-[#43433F] space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-[#FAF9F5] flex items-center justify-between">
              <span>Prefix Sum Array (P)</span>
              <span className="font-mono text-[10px] text-slate-400">
                Length {auxiliaryData.prefix.length}
              </span>
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pt-0.5">
              {auxiliaryData.prefix.map((pVal: any, pIdx: number) => (
                <div key={pIdx} className="flex flex-col items-center">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50">
                    {pVal}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">P[{pIdx}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render Result Array if present */}
        {'result' in auxiliaryData && Array.isArray(auxiliaryData.result) && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#262624] border border-slate-200/70 dark:border-[#43433F] space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-[#FAF9F5]">
              Output Result Array
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pt-0.5">
              {auxiliaryData.result.map((rVal: any, rIdx: number) => (
                <div key={rIdx} className="flex flex-col items-center">
                  <span
                    className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded border ${
                      rVal > 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50'
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-[#1F1E1D] dark:text-[#A8A69C] dark:border-[#43433F]'
                    }`}
                  >
                    {rVal}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 mt-0.5">d[{rIdx}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render Merged Intervals if present */}
        {'merged' in auxiliaryData && Array.isArray(auxiliaryData.merged) && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#262624] border border-slate-200/70 dark:border-[#43433F] space-y-1.5">
            <div className="text-[11px] font-bold text-slate-700 dark:text-[#FAF9F5]">
              Committed Intervals
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {auxiliaryData.merged.map((interval: any, idx: number) => (
                <span
                  key={idx}
                  className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50 font-bold"
                >
                  [{interval[0]}, {interval[1]}]
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fallback generic inspection for other auxiliary fields */}
        {keys
          .filter(k => !['map', 'stack', 'heap', 'prefix', 'result', 'merged'].includes(k))
          .map(k => (
            <div
              key={k}
              className="p-3 rounded-lg bg-white dark:bg-[#262624] border border-slate-200/70 dark:border-[#43433F] space-y-1"
            >
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-[#A8A69C] tracking-wider truncate">
                {k}
              </div>
              <div className="font-mono text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                {typeof auxiliaryData[k] === 'object'
                  ? JSON.stringify(auxiliaryData[k])
                  : String(auxiliaryData[k])}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function GenericPatternVisualizer({
  title,
  subtitle,
  steps,
}: GenericPatternVisualizerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize state and reset whenever steps or title change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [steps]);

  const totalSteps = steps.length;
  const safeStepIndex = Math.max(0, Math.min(currentStepIndex, totalSteps - 1));
  const step = steps[safeStepIndex] || steps[0];

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
    if (safeStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (safeStepIndex > 0) {
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
      if (safeStepIndex >= totalSteps - 1) {
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
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
            5
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-0.5">
              {subtitle}
            </p>
          </div>
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
              const matchingPointers = step.activePointers?.filter(p => p.index === idx) || [];

              return (
                <div key={idx} className="flex flex-col items-center">
                  {/* Top Pointer Badges (Supports co-located pointers) */}
                  <div className="min-h-4 flex items-center justify-center gap-1 mb-1">
                    {matchingPointers.map((pointer, pIdx) => (
                      <span
                        key={pIdx}
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shadow-2xs whitespace-nowrap ${
                          pointer.color === 'emerald'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : pointer.color === 'rose'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : pointer.color === 'amber'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : pointer.color === 'purple'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : pointer.color === 'blue'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {pointer.name}
                      </span>
                    ))}
                  </div>

                  {/* Element Box with flexible padding */}
                  <div
                    className={`min-w-9 h-9 sm:min-w-11 sm:h-11 px-2.5 sm:px-3 whitespace-nowrap rounded-lg flex items-center justify-center font-mono text-xs sm:text-sm font-bold border-2 transition-all duration-300 ${
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

      {/* Auxiliary Internal State Inspection (Hash Map, Stack, Heap, Prefix, etc.) */}
      {step.auxiliaryData && Object.keys(step.auxiliaryData).length > 0 && (
        <AuxiliaryStateInspection auxiliaryData={step.auxiliaryData} />
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

      {/* Step Scrubber Timeline Navigation */}
      <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-[#1F1E1D]/60 border border-slate-200/60 dark:border-[#43433F]/60 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#A8A69C]">
          <span className="font-semibold text-slate-700 dark:text-[#FAF9F5]">Interactive Timeline</span>
          <span>
            Step {safeStepIndex + 1} of {totalSteps}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={safeStepIndex}
          onChange={e => {
            setIsPlaying(false);
            setCurrentStepIndex(Number(e.target.value));
          }}
          className="w-full h-1.5 bg-slate-200 dark:bg-[#43433F] rounded-lg appearance-none cursor-pointer accent-[#0F1B3D] dark:accent-[#D97757]"
          aria-label="Step Scrubber"
        />

        <div className="flex items-center justify-between gap-1 overflow-x-auto py-0.5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`flex-1 min-w-[14px] h-1.5 rounded-full transition-all cursor-pointer ${
                idx === safeStepIndex
                  ? 'bg-[#0F1B3D] dark:bg-[#D97757] ring-2 ring-[#0F1B3D]/30 dark:ring-[#D97757]/40'
                  : idx < safeStepIndex
                  ? 'bg-emerald-500/80 dark:bg-emerald-500/60'
                  : 'bg-slate-200 dark:bg-[#43433F]'
              }`}
              title={`Jump to step ${idx + 1}: ${s.title}`}
              aria-label={`Jump to step ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
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
                <span>{safeStepIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
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
            disabled={safeStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#43433F] text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#1F1E1D] font-semibold text-xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={safeStepIndex >= totalSteps - 1}
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
