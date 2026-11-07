import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Code2,
  Layers,
  BarChart2,
  ArrowLeft,
  Compass,
} from 'lucide-react';

export default function NotFoundPage() {
  const quickLinks = [
    {
      title: 'Company Question Sets',
      description: '490+ verified company question banks indexed across 6 recency windows.',
      to: '/companies',
      icon: Building2,
      badge: '490 Companies',
      badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/50',
    },
    {
      title: 'Problems Catalog',
      description: 'Search 3,411 canonical LeetCode questions with multi-filter sorting.',
      to: '/problems',
      icon: Code2,
      badge: '3,411 Problems',
      badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/50',
    },
    {
      title: 'DSA Patterns',
      description: 'Understand 18 core interview algorithmic tracks with interactive visualizers.',
      to: '/patterns',
      icon: Layers,
      badge: '18 Tracks',
      badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/50',
    },
    {
      title: 'Personal Progress',
      description: 'Review your preparation metrics, target companies, and bookmarked questions.',
      to: '/progress',
      icon: BarChart2,
      badge: 'Progress Hub',
      badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/50',
    },
  ];

  return (
    <div
      data-testid="not-found-page"
      className="max-w-4xl mx-auto py-10 sm:py-16 space-y-10 animate-fade-in"
    >
      {/* Hero 404 Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0F1B3D]/5 dark:bg-[#D97757]/15 text-[#0F1B3D] dark:text-[#D97757] border border-[#0F1B3D]/15 dark:border-[#D97757]/30">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 · Page Not Found</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal hero-serif tracking-tight text-slate-900 dark:text-[#FAF9F5]">
          Lost in the problem space?
        </h1>

        <p className="text-sm text-slate-600 dark:text-[#A8A69C] leading-relaxed">
          The page or track you're looking for doesn't exist, was renamed, or has an invalid URL. Choose one of our main prep tracks below to get back on course.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Return to CompanyWise Home</span>
          </Link>
        </div>
      </div>

      {/* Directory Quick-Jump Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {quickLinks.map(link => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] flex items-center justify-center text-slate-700 dark:text-[#FAF9F5] group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${link.badgeColor}`}>
                  {link.badge}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-[#FAF9F5] group-hover:text-[#0F1B3D] dark:group-hover:text-[#D97757] transition-colors flex items-center justify-between">
                  <span>{link.title}</span>
                  <span className="text-slate-400 group-hover:translate-x-1 transition-transform text-sm">
                    &rarr;
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#A8A69C] mt-1 leading-relaxed">
                  {link.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
