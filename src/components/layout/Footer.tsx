import React from 'react';
import { Link } from 'react-router-dom';
import CompanyWiseLogo from '../ui/CompanyWiseLogo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-[#1E2E5C] bg-[#F7F8FB] dark:bg-[#0B132B] text-slate-500 dark:text-slate-400 text-xs py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Brand mark and brief */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CompanyWiseLogo variant="full" size="sm" />
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#111C3D] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1E2E5C]">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm">
              Curated company-wise LeetCode problems indexed for technical interview loops across 200 tech companies.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-[#0F1B3D] dark:hover:text-[#F5A524] transition-colors">
              Home
            </Link>
            <Link to="/companies" className="text-slate-600 dark:text-slate-300 hover:text-[#0F1B3D] dark:hover:text-[#F5A524] transition-colors">
              Companies
            </Link>
            <Link to="/problems" className="text-slate-600 dark:text-slate-300 hover:text-[#0F1B3D] dark:hover:text-[#F5A524] transition-colors">
              Problems
            </Link>
            <Link to="/progress" className="text-slate-600 dark:text-slate-300 hover:text-[#0F1B3D] dark:hover:text-[#F5A524] transition-colors">
              My Progress
            </Link>
          </div>
        </div>

        {/* Telemetry and Shortcuts Strip */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-[#1E2E5C]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>1,446 Questions · 200 Companies · 4 Recency Windows</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#111C3D] text-[#0F1B3D] dark:text-amber-300 border border-slate-300 dark:border-[#1E2E5C] font-semibold">/</kbd> to search</span>
            <span>·</span>
            <span>Zero trackers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
