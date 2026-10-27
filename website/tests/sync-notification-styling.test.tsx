import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import LeetCodeModal from '../src/components/leetcode/LeetCodeModal';
import type { LeetCodeAccount } from '../src/types';

describe('LeetCode Synchronization Notice Styling', () => {
  const mockAccount: LeetCodeAccount = {
    username: 'alice',
    totalSolved: 150,
    easySolved: 50,
    mediumSolved: 80,
    hardSolved: 20,
    lastSyncedAt: '2026-10-25T10:00:00.000Z',
    recentSubmissions: [],
    autoSync: false,
  };

  it('renders partial synchronization notice with amber warning styling, NOT emerald success styling', () => {
    const { container } = render(
      <LeetCodeModal
        isOpen={true}
        onClose={vi.fn()}
        account={mockAccount}
        isSyncing={false}
        syncStatus="partial"
        syncDetails={{
          outcome: 'partial',
          connectedAt: '2026-10-25T10:00:00.000Z',
          totalSolvedOnProfile: 150,
          recentSubmissionsCount: 20,
          matchedCount: 15,
          unmatchedCount: 5,
          newlySolvedCount: 2,
          isPartial: true,
          message: 'LeetCode synced! Verified 15 problems (partial sync from public history).',
        }}
        syncError={null}
        syncNotice="LeetCode synced! Verified 15 problems (partial sync from public history)."
        onConnect={vi.fn()}
        onSync={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );

    const noticeEl = screen.getByText(/verified 15 problems \(partial sync/i).closest('div');
    expect(noticeEl).not.toBeNull();

    // Must have amber warning classes
    expect(noticeEl?.className).toContain('bg-amber-500/10');
    expect(noticeEl?.className).toContain('border-amber-500/30');
    expect(noticeEl?.className).toContain('text-amber-800');

    // Must NOT have emerald success classes
    expect(noticeEl?.className).not.toContain('bg-emerald-500/10');
    expect(noticeEl?.className).not.toContain('text-emerald-700');
  });

  it('renders completed synchronization notice with emerald success styling', () => {
    render(
      <LeetCodeModal
        isOpen={true}
        onClose={vi.fn()}
        account={mockAccount}
        isSyncing={false}
        syncStatus="completed"
        syncDetails={{
          outcome: 'completed',
          connectedAt: '2026-10-25T10:00:00.000Z',
          totalSolvedOnProfile: 20,
          recentSubmissionsCount: 20,
          matchedCount: 20,
          unmatchedCount: 0,
          newlySolvedCount: 5,
          isPartial: false,
          message: 'LeetCode synced! Verified all 20 problems.',
        }}
        syncError={null}
        syncNotice="LeetCode synced! Verified all 20 problems."
        onConnect={vi.fn()}
        onSync={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );

    const noticeEl = screen.getByText('LeetCode synced! Verified all 20 problems.').closest('div');
    expect(noticeEl).not.toBeNull();

    // Must have emerald success classes
    expect(noticeEl?.className).toContain('bg-emerald-500/10');
    expect(noticeEl?.className).toContain('border-emerald-500/30');
    expect(noticeEl?.className).toContain('text-emerald-700');

    // Must NOT have amber classes
    expect(noticeEl?.className).not.toContain('bg-amber-500/10');
  });

  it('renders error notice with rose red error styling', () => {
    render(
      <LeetCodeModal
        isOpen={true}
        onClose={vi.fn()}
        account={mockAccount}
        isSyncing={false}
        syncStatus="failed"
        syncError="Rate limit exceeded. Please wait a moment."
        syncNotice={null}
        onConnect={vi.fn()}
        onSync={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );

    const errorEl = screen.getByText(/rate limit exceeded/i).closest('div');
    expect(errorEl).not.toBeNull();
    expect(errorEl?.parentElement?.className).toContain('bg-rose-500/10');
  });
});
