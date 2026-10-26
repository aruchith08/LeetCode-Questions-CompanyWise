import React, { createContext, useContext } from 'react';
import { useProgressInternal } from '../hooks/useProgress';

export type ProgressContextType = ReturnType<typeof useProgressInternal>;

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const value = useProgressInternal();
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

export { ProgressContext };
