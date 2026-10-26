import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ProgressProvider, useProgress } from '../src/hooks/useProgress';

function ConsumerA() {
  const { totalSolved, toggleSolved, isBookmarked, toggleBookmark } = useProgress();
  return (
    <div>
      <span data-testid="solved-a">{totalSolved}</span>
      <span data-testid="bookmarked-a">{isBookmarked(1) ? 'yes' : 'no'}</span>
      <button data-testid="solve-btn-a" onClick={() => toggleSolved(1)}>Solve 1</button>
      <button data-testid="bookmark-btn-a" onClick={() => toggleBookmark(1)}>Bookmark 1</button>
    </div>
  );
}

function ConsumerB() {
  const { totalSolved, isBookmarked, getStatus } = useProgress();
  return (
    <div>
      <span data-testid="solved-b">{totalSolved}</span>
      <span data-testid="bookmarked-b">{isBookmarked(1) ? 'yes' : 'no'}</span>
      <span data-testid="status-b">{getStatus(1)}</span>
    </div>
  );
}

function TestApp() {
  return (
    <ProgressProvider>
      <ConsumerA />
      <ConsumerB />
    </ProgressProvider>
  );
}

describe('React Context & Shared Progress Hook Architecture', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shares single application-wide progress state across multiple independent consumers', () => {
    render(<TestApp />);

    expect(screen.getByTestId('solved-a').textContent).toBe('0');
    expect(screen.getByTestId('solved-b').textContent).toBe('0');
    expect(screen.getByTestId('status-b').textContent).toBe('unsolved');

    // Trigger action in Consumer A
    act(() => {
      screen.getByTestId('solve-btn-a').click();
    });

    // Consumer B immediately updates with the exact same shared state
    expect(screen.getByTestId('solved-a').textContent).toBe('1');
    expect(screen.getByTestId('solved-b').textContent).toBe('1');
    expect(screen.getByTestId('status-b').textContent).toBe('solved');

    // Bookmark in Consumer A
    act(() => {
      screen.getByTestId('bookmark-btn-a').click();
    });

    expect(screen.getByTestId('bookmarked-a').textContent).toBe('yes');
    expect(screen.getByTestId('bookmarked-b').textContent).toBe('yes');
  });

  it('throws a descriptive error when useProgress is invoked outside a ProgressProvider', () => {
    function OrphanComponent() {
      useProgress();
      return <div>Orphan</div>;
    }

    // Suppress React error boundary console log during intentional throw test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<OrphanComponent />);
    }).toThrow('useProgress must be used within a ProgressProvider');

    spy.mockRestore();
  });
});
