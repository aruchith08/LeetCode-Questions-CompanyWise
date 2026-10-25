import React from 'react';

interface DifficultyBadgeProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  size?: 'sm' | 'md';
}

const dotColors = {
  Easy: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  Hard: 'bg-rose-500',
};

const textColors = {
  Easy: 'text-emerald-700 dark:text-emerald-400',
  Medium: 'text-amber-700 dark:text-amber-400',
  Hard: 'text-rose-700 dark:text-rose-400',
};

export default function DifficultyBadge({ difficulty, size = 'md' }: DifficultyBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium text-xs ${textColors[difficulty]}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[difficulty]}`} />
      <span>{difficulty}</span>
    </span>
  );
}
