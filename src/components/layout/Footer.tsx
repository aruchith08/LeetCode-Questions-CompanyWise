import React from 'react';
import { Link } from 'react-router-dom';
import CompanyWiseLogo from '../ui/CompanyWiseLogo';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0A0A0B] text-neutral-500 text-xs py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Brand mark and brief */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CompanyWiseLogo variant="full" size="sm" />
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 max-w-sm">
              Curated company-wise LeetCode problems indexed for technical interview loops across 200 tech companies.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/companies" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Companies
            </Link>
            <Link to="/problems" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Problems
            </Link>
            <Link to="/progress" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              My Progress
            </Link>
          </div>
        </div>

        {/* Telemetry and Shortcuts Strip */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>1,446 Questions · 200 Companies · 4 Recency Windows</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">/</kbd> to search</span>
            <span>·</span>
            <span>Zero trackers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
