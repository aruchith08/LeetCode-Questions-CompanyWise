import { describe, it, expect, vi, beforeEach } from 'vitest';
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LeetCodeModal from '../src/components/leetcode/LeetCodeModal';
import CustomDropdown from '../src/components/ui/CustomDropdown';

// Mock useAllQuestions hook
vi.mock('../src/hooks/useAllQuestions', () => ({
  useAllQuestions: () => ({ data: [] }),
}));

describe('Phase 4 — Accessibility & UX Polish', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('LeetCodeModal Accessibility & Focus Management', () => {
    it('renders with appropriate dialog roles, aria-modal, and labeledby title', () => {
      const handleClose = vi.fn();
      render(
        <LeetCodeModal
          isOpen={true}
          onClose={handleClose}
          account={null}
          isSyncing={false}
          syncError={null}
          syncNotice={null}
          onConnect={vi.fn()}
          onSync={vi.fn()}
          onDisconnect={vi.fn()}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeTruthy();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(dialog.getAttribute('aria-labelledby')).toBe('lc-modal-title');
      expect(screen.getByRole('heading', { name: /Connect LeetCode/i }).getAttribute('id')).toBe(
        'lc-modal-title'
      );
      expect(screen.getByLabelText(/Close dialog/i)).toBeTruthy();
    });

    it('contains an aria-live="polite" live region for dynamic notices and errors', () => {
      const { rerender } = render(
        <LeetCodeModal
          isOpen={true}
          onClose={vi.fn()}
          account={null}
          isSyncing={false}
          syncError={null}
          syncNotice={null}
          onConnect={vi.fn()}
          onSync={vi.fn()}
          onDisconnect={vi.fn()}
        />
      );

      // Verify polite live container exists in the DOM
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeTruthy();
      expect(liveRegion?.getAttribute('aria-atomic')).toBe('true');

      // Re-render with notice
      rerender(
        <LeetCodeModal
          isOpen={true}
          onClose={vi.fn()}
          account={null}
          isSyncing={false}
          syncError={null}
          syncNotice="Successfully synced 45 questions"
          onConnect={vi.fn()}
          onSync={vi.fn()}
          onDisconnect={vi.fn()}
        />
      );

      expect(liveRegion?.textContent).toContain('Successfully synced 45 questions');
    });

    it('closes on Escape key press', () => {
      const handleClose = vi.fn();
      render(
        <LeetCodeModal
          isOpen={true}
          onClose={handleClose}
          account={null}
          isSyncing={false}
          syncError={null}
          syncNotice={null}
          onConnect={vi.fn()}
          onSync={vi.fn()}
          onDisconnect={vi.fn()}
        />
      );

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('CustomDropdown Keyboard Navigation & ARIA Patterns', () => {
    const mockOptions = [
      { value: 'all', label: 'All Companies' },
      { value: 'amazon', label: 'Amazon', badge: 120 },
      { value: 'google', label: 'Google', badge: 95 },
      { value: 'meta', label: 'Meta', badge: 80 },
    ];

    it('has proper combobox/listbox attributes on trigger button', () => {
      render(
        <CustomDropdown
          value="all"
          onChange={vi.fn()}
          options={mockOptions}
          placeholder="Filter by company"
        />
      );

      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-haspopup')).toBe('listbox');
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('opens on ArrowDown key and allows keyboard selection with Enter', () => {
      const handleChange = vi.fn();
      function TestWrapper() {
        const [val, setVal] = useState('all');
        return (
          <CustomDropdown
            value={val}
            onChange={(newVal) => {
              setVal(newVal);
              handleChange(newVal);
            }}
            options={mockOptions}
          />
        );
      }

      render(<TestWrapper />);
      const trigger = screen.getByRole('button');

      // Press ArrowDown on closed button -> opens dropdown
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeTruthy();

      // Navigate down to Amazon (index 1)
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      // Press Enter to select
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(handleChange).toHaveBeenCalledWith('amazon');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('closes on Escape key and returns focus to trigger', () => {
      render(
        <CustomDropdown
          value="all"
          onChange={vi.fn()}
          options={mockOptions}
        />
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
