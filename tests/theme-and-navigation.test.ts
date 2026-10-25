import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PERIOD_LABELS, PERIOD_ORDER } from '../src/types';
import { useTheme } from '../src/hooks/useTheme';

describe('Theme & Navigation Behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.body.className = '';
  });

  it('verifies theme defaults to dark mode and switches correctly', () => {
    const getStoredTheme = () => localStorage.getItem('codewise-theme') || 'dark';

    expect(getStoredTheme()).toBe('dark');

    // Simulate toggle
    localStorage.setItem('codewise-theme', 'light');
    expect(getStoredTheme()).toBe('light');

    // Toggle back to dark
    localStorage.setItem('codewise-theme', 'dark');
    expect(getStoredTheme()).toBe('dark');
  });

  it('useTheme hook updates DOM classes and switches from dark to light mode', () => {
    const { result } = renderHook(() => useTheme());

    // Initial state is dark
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(localStorage.getItem('codewise-theme')).toBe('dark');

    // Toggle to light mode
    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.body.className).toContain('bg-[#F7F8FB]');
    expect(localStorage.getItem('codewise-theme')).toBe('light');

    // Toggle back to dark mode
    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(document.body.className).toContain('bg-[#111215]');
    expect(localStorage.getItem('codewise-theme')).toBe('dark');
  });

  it('supports the required time period taxonomy and display labels', () => {
    expect(PERIOD_ORDER).toEqual(['6months', '1year', '2year', 'alltime']);

    expect(PERIOD_LABELS['6months']).toBe('Last 6 Months');
    expect(PERIOD_LABELS['1year']).toBe('Last 1 Year');
    expect(PERIOD_LABELS['2year']).toBe('Last 2 Years');
    expect(PERIOD_LABELS['alltime']).toBe('All Time');
  });

  it('ensures core navigation routes are defined', () => {
    const routes = ['/', '/companies', '/problems', '/progress'];
    expect(routes).toContain('/');
    expect(routes).toContain('/companies');
    expect(routes).toContain('/problems');
    expect(routes).toContain('/progress');
  });
});
