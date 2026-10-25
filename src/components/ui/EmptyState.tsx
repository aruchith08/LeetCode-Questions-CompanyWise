import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-slate-400 dark:text-slate-500 mb-4">
        {icon || <FolderOpen className="w-16 h-16" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">{message}</p>
    </div>
  );
}
