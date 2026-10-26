import { useContext } from 'react';
import {
  ProgressContext,
  ProgressProvider,
  type ProgressContextType,
} from '../context/ProgressContext';
import {
  getLocalDateString,
  getDefaultProgress,
  useProgressState,
  type ProgressStateReturn,
} from './useProgressState';

export { ProgressProvider, getLocalDateString, getDefaultProgress, useProgressState };
export type ProgressHookReturn = ProgressContextType;

/**
 * Shared progress hook consuming the application-wide ProgressContext.
 * Guarantees a single source of truth across all components.
 * Throws a clear error if invoked outside a ProgressProvider.
 */
export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
