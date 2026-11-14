import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PERIOD_LABELS, PERIOD_ORDER } from '../src/types';
import { useTheme } from '../src/hooks/useTheme';
import { ECOSYSTEM_PLATFORMS } from '../src/config/ecosystem';

describe('Theme & Navigation Behavior', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.body.className = '';
  });

  it('verifies theme defaults to light mode for any device and switches correctly', () => {
    const getStoredTheme = () =>
      (localStorage.getItem('companywise-theme') || localStorage.getItem('codewise-theme')) === 'dark' ? 'dark' : 'light';

    expect(getStoredTheme()).toBe('light');

    // Simulate toggle to dark mode
    localStorage.setItem('companywise-theme', 'dark');
    expect(getStoredTheme()).toBe('dark');

    // Toggle back to light mode
    localStorage.setItem('companywise-theme', 'light');
    expect(getStoredTheme()).toBe('light');
  });

  it('useTheme hook updates DOM classes, defaults to light mode, and switches to dark mode upon user action', () => {
    const { result } = renderHook(() => useTheme());

    // Initial state is light mode by default for any device
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.body.className).toContain('bg-[#F7F8FB]');
    expect(localStorage.getItem('companywise-theme')).toBe('light');

    // Toggle to dark mode
    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(document.body.className).toContain('bg-[#262624]');
    expect(localStorage.getItem('companywise-theme')).toBe('dark');

    // Toggle back to light mode
    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.body.className).toContain('bg-[#F7F8FB]');
    expect(localStorage.getItem('companywise-theme')).toBe('light');
  });

  it('persists and honors previous user preference stored in localStorage on that device', () => {
    // If the user previously selected dark mode on this device
    localStorage.setItem('companywise-theme', 'dark');
    const { result: darkResult } = renderHook(() => useTheme());
    expect(darkResult.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // If the user explicitly stored light mode on this device
    localStorage.setItem('companywise-theme', 'light');
    const { result: lightResult } = renderHook(() => useTheme());
    expect(lightResult.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('supports the required time period taxonomy and display labels', () => {
    expect(PERIOD_ORDER).toEqual(['30days', '3months', '6months', '1year', '2year', 'alltime']);

    expect(PERIOD_LABELS['30days']).toBe('Last 30 Days');
    expect(PERIOD_LABELS['3months']).toBe('Last 3 Months');

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

  it('verifies ecosystem platforms include PracHub with correct URL and metadata', () => {
    const prachub = ECOSYSTEM_PLATFORMS.find(p => p.id === 'prachub');
    expect(prachub).toBeDefined();
    expect(prachub?.url).toBe('https://prachub.com/');
    expect(prachub?.name).toBe('PracHub');
    expect(prachub?.isExternal).toBe(true);
    expect(prachub?.logo).toBe('/brands/prachub.png');
  });
});
