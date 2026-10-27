import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PatternIcon, {
  hasPatternIcon,
  normalizePatternSlug,
  PATTERN_ICON_MAP,
} from '../src/components/patterns/PatternIcon';
import { PATTERNS_CATALOG } from '../src/data/patternsData';
import PatternDetailPage from '../src/pages/PatternDetailPage';
import PatternCard from '../src/components/patterns/PatternCard';
import { ProgressProvider } from '../src/context/ProgressContext';

describe('Centralized Pattern & Topic Icons', () => {
  it('ensures 100% of the 18 patterns in PATTERNS_CATALOG have dedicated concept icons', () => {
    expect(PATTERNS_CATALOG).toHaveLength(18);

    for (const pattern of PATTERNS_CATALOG) {
      const hasIcon = hasPatternIcon(pattern.slug);
      expect(hasIcon, `Pattern '${pattern.slug}' (${pattern.title}) must have a registered icon`).toBe(true);

      // Verify the icon renders an SVG element
      const { container } = render(<PatternIcon slug={pattern.slug} name={pattern.title} />);
      const svg = container.querySelector('svg');
      expect(svg, `Pattern '${pattern.slug}' must render an SVG element`).toBeTruthy();
      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    }
  });

  it('normalizes slugs with uppercase, spaces, and underscores properly', () => {
    expect(normalizePatternSlug('Two Pointers')).toBe('two-pointers');
    expect(normalizePatternSlug('SLIDING_WINDOW')).toBe('sliding-window');
    expect(normalizePatternSlug('  hashing-and-frequency-counting  ')).toBe('hashing-and-frequency-counting');

    const { container: c1 } = render(<PatternIcon slug="TWO_POINTERS" />);
    const { container: c2 } = render(<PatternIcon slug="two-pointers" />);
    expect(c1.querySelector('svg')?.innerHTML).toBe(c2.querySelector('svg')?.innerHTML);
  });

  it('resolves core DSA topics and aliases to meaningful icons', () => {
    const topics = [
      'arrays',
      'strings',
      'linked-lists',
      'queue',
      'sorting',
      'matrix',
      'math',
      'recursion',
      'trie',
    ];

    for (const topic of topics) {
      expect(hasPatternIcon(topic), `Topic '${topic}' should have an icon`).toBe(true);
      const { container } = render(<PatternIcon slug={topic} />);
      expect(container.querySelector('svg')).toBeTruthy();
    }
  });

  it('gracefully falls back to algorithmic code icon for unknown patterns without text initials', () => {
    expect(hasPatternIcon('unknown-future-pattern')).toBe(false);

    const { container } = render(<PatternIcon slug="unknown-future-pattern" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    // Must not contain letter abbreviation text placeholders
    expect(container.textContent).toBe('');
  });

  it('renders PatternDetailPage with concept SVG icon instead of 2-letter uppercase initials', () => {
    const { container } = render(
      <ProgressProvider>
        <MemoryRouter initialEntries={['/patterns/hashing-and-frequency-counting']}>
          <Routes>
            <Route path="/patterns/:slug" element={<PatternDetailPage />} />
          </Routes>
        </MemoryRouter>
      </ProgressProvider>
    );

    // The hero container should contain an SVG icon and NOT the text initials 'HA'
    const heroIconContainer = container.querySelector('.rounded-xl.bg-emerald-100\\/80, .rounded-xl.bg-emerald-100');
    expect(heroIconContainer).toBeTruthy();
    expect(heroIconContainer?.querySelector('svg')).toBeTruthy();
    expect(heroIconContainer?.textContent?.trim()).toBe('');
  });

  it('renders PatternCard with matching PatternIcon next to pattern title', () => {
    const pattern = PATTERNS_CATALOG[0]; // hashing-and-frequency-counting
    const { container } = render(
      <MemoryRouter>
        <PatternCard pattern={pattern} solvedCount={0} totalQuestions={12} />
      </MemoryRouter>
    );

    const titleContainer = container.querySelector('h3');
    expect(titleContainer?.textContent).toContain('Hashing & Frequency Counting');

    // Sibling or adjacent icon container exists
    const iconWrapper = container.querySelector('.w-6.h-6.rounded-md');
    expect(iconWrapper).toBeTruthy();
    expect(iconWrapper?.querySelector('svg')).toBeTruthy();
  });
});
