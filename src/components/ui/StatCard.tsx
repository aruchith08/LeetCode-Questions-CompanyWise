import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: string;
}

export default function StatCard({ icon: Icon, label, value, color = 'text-blue-400' }: StatCardProps) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
      </div>
    </div>
  );
}
