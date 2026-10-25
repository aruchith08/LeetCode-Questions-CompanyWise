import React, { useState, useRef, useEffect } from 'react';
import { Check, Clock } from 'lucide-react';
import type { QuestionStatus } from '../../types';

interface StatusToggleProps {
  status: QuestionStatus;
  onToggleSolved?: () => void;
  onSelectStatus?: (status: QuestionStatus) => void;
  className?: string;
}

export default function StatusToggle({
  status,
  onToggleSolved,
  onSelectStatus,
  className = '',
}: StatusToggleProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectStatus) {
      setMenuOpen(prev => !prev);
    } else if (onToggleSolved) {
      onToggleSolved();
    }
  };

  const handleSelect = (newStatus: QuestionStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectStatus) {
      onSelectStatus(newStatus);
    } else if (onToggleSolved && newStatus !== status) {
      onToggleSolved();
    }
    setMenuOpen(false);
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={handleClick}
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all focus:outline-none ${
          status === 'solved'
            ? 'bg-emerald-500 dark:bg-[#8FBF78] text-white dark:text-[#1F1E1D] shadow-2xs hover:opacity-90 scale-100 hover:scale-105'
            : status === 'attempted'
            ? 'bg-amber-500 dark:bg-[#E0B14F] text-white dark:text-[#1F1E1D] shadow-2xs hover:opacity-90 scale-100 hover:scale-105'
            : 'border-2 border-slate-300 dark:border-[#43433F] hover:border-[#0F1B3D] dark:hover:border-[#D97757] hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
        }`}
        title={`Status: ${status.charAt(0).toUpperCase() + status.slice(1)} (Click to change)`}
        aria-label={`Problem status: ${status}`}
      >
        {status === 'solved' && <Check className="w-3 h-3 stroke-[3]" />}
        {status === 'attempted' && <Clock className="w-3 h-3 stroke-[2.5]" />}
      </button>

      {/* Popover Menu to select between Solved, Attempted, and Unsolved */}
      {menuOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 w-36 rounded-xl border border-slate-200 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-1.5 shadow-xl shadow-slate-900/10 dark:shadow-black/50 text-xs animate-fade-in"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={e => handleSelect('solved', e)}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
              status === 'solved'
                ? 'bg-emerald-50 dark:bg-[#1F1E1D] text-emerald-700 dark:text-[#8FBF78] font-bold'
                : 'text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 dark:bg-[#8FBF78] text-white dark:text-[#1F1E1D] flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>Solved</span>
          </button>

          <button
            onClick={e => handleSelect('attempted', e)}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
              status === 'attempted'
                ? 'bg-amber-50 dark:bg-[#1F1E1D] text-amber-700 dark:text-[#E0B14F] font-bold'
                : 'text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 dark:bg-[#E0B14F] text-white dark:text-[#1F1E1D] flex items-center justify-center shrink-0">
              <Clock className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
            <span>Attempted</span>
          </button>

          <button
            onClick={e => handleSelect('unsolved', e)}
            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left font-medium transition-colors ${
              status === 'unsolved'
                ? 'bg-slate-100 dark:bg-[#1F1E1D] text-[#0F1B3D] dark:text-[#FAF9F5] font-bold'
                : 'text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full border border-slate-400 dark:border-[#43433F] shrink-0" />
            <span>Unsolved</span>
          </button>
        </div>
      )}
    </div>
  );
}
