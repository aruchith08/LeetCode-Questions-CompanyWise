import React, { createContext, useContext } from 'react';
import { useProgressState, type ProgressStateReturn } from '../hooks/useProgressState';

export type ProgressContextType = ProgressStateReturn;

export const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const value = useProgressState();
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressContext(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
