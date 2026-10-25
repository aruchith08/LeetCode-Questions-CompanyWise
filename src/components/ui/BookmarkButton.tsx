import React from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

export default function BookmarkButton({ isBookmarked, onToggle }: BookmarkButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-1.5 rounded-lg transition-colors ${
        isBookmarked
          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100 dark:text-yellow-400 dark:bg-yellow-500/15 dark:hover:bg-yellow-500/25'
          : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:text-slate-500 dark:hover:text-yellow-400 dark:hover:bg-yellow-500/10'
      }`}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  );
}
