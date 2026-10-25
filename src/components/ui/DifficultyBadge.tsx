import React from 'react';

interface DifficultyBadgeProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  size?: 'sm' | 'md';
}

const dotColors = {
  Easy: 'bg-emerald-500 dark:bg-[#8FBF78]',
  Medium: 'bg-amber-500 dark:bg-[#E0B14F]',
  Hard: 'bg-rose-500 dark:bg-[#EE8F78]',
};

const textColors = {
  Easy: 'text-emerald-700 dark:text-[#8FBF78]',
  Medium: 'text-amber-700 dark:text-[#E0B14F]',
  Hard: 'text-rose-700 dark:text-[#EE8F78]',
};

export default function DifficultyBadge({ difficulty, size = 'md' }: DifficultyBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium text-xs ${textColors[difficulty]}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[difficulty]}`} />
      <span>{difficulty}</span>
    </span>
  );
}
