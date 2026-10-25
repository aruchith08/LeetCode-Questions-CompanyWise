import React from 'react';
import { Link } from 'react-router-dom';
import CompanyWiseLogo from '../ui/CompanyWiseLogo';
import { useDataIndex } from '../../hooks/useDataIndex';

export default function Footer() {
  const { data } = useDataIndex();
  const totalQuestions = data?.totalQuestions ? data.totalQuestions.toLocaleString() : '3,411';
  const totalCompanies = data?.totalCompanies || 490;

  return (
    <footer className="border-t border-slate-200 dark:border-[#43433F] bg-[#F7F8FB] dark:bg-[#262624] text-slate-500 dark:text-[#A8A69C] text-xs py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Brand mark and brief */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CompanyWiseLogo variant="full" size="sm" />
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#30302E] text-slate-600 dark:text-[#A8A69C] border border-slate-200 dark:border-[#43433F]">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] max-w-sm">
              Curated company-wise LeetCode problems indexed for technical interview loops across {totalCompanies} tech companies.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <Link to="/" className="text-slate-600 dark:text-[#A8A69C] hover:text-[#0F1B3D] dark:hover:text-[#D97757] transition-colors">
              Home
            </Link>
            <Link to="/companies" className="text-slate-600 dark:text-[#A8A69C] hover:text-[#0F1B3D] dark:hover:text-[#D97757] transition-colors">
              Companies
            </Link>
            <Link to="/problems" className="text-slate-600 dark:text-[#A8A69C] hover:text-[#0F1B3D] dark:hover:text-[#D97757] transition-colors">
              Problems
            </Link>
            <Link to="/progress" className="text-slate-600 dark:text-[#A8A69C] hover:text-[#0F1B3D] dark:hover:text-[#D97757] transition-colors">
              My Progress
            </Link>
            <Link to="/about" className="text-slate-600 dark:text-[#A8A69C] hover:text-[#0F1B3D] dark:hover:text-[#D97757] transition-colors">
              About
            </Link>
          </div>
        </div>

        {/* Telemetry and Shortcuts Strip */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-[#43433F]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-slate-500 dark:text-[#A8A69C]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#8FBF78]" />
            <span>{totalQuestions} Questions · {totalCompanies} Companies · 6 Recency Windows</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#30302E] text-[#0F1B3D] dark:text-[#D97757] border border-slate-300 dark:border-[#43433F] font-semibold">/</kbd> to search</span>
            <span>·</span>
            <span>Zero trackers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
