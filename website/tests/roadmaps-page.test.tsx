import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoadmapsPage from '../src/pages/RoadmapsPage';
import { PATTERNS_CATALOG } from '../src/data/patternsData';

describe('RoadmapsPage Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderRoadmapsPage = () => {
    return render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RoadmapsPage />
      </MemoryRouter>
    );
  };

  it('renders page header title, subtitle, and all track switcher tabs', () => {
    renderRoadmapsPage();

    // Verify main header and subtitle
    expect(
      screen.getByRole('heading', { name: /Interview Roadmaps & Preparation Strategy/i, level: 1 })
    ).toBeTruthy();
    expect(
      screen.getByText(/Choose the trajectory tailored to your timeline/i)
    ).toBeTruthy();

    // Verify track switcher tabs
    expect(screen.getByRole('tab', { name: /All Tracks & Overview/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Beginner Roadmap/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Intermediate Sprint/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Feature Compass/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Platform Loop/i })).toBeTruthy();
  });

  it('renders all 5 diagnostic questions with interactive options and accessibility attributes', () => {
    renderRoadmapsPage();

    expect(screen.getByText('Language Fluency')).toBeTruthy();
    expect(screen.getByText('Big-O Intuition')).toBeTruthy();
    expect(screen.getByText('Problems Solved')).toBeTruthy();
    expect(screen.getByText('Recursion & Trees')).toBeTruthy();
    expect(screen.getByText('Core Bottleneck')).toBeTruthy();

    // Check initial recommendation
    const resultBox = screen.getByTestId('diagnostic-result');
    expect(resultBox.textContent).toContain('🔰 Beginner Roadmap');
    expect(resultBox.getAttribute('aria-live')).toBe('polite');
    expect(resultBox.getAttribute('aria-atomic')).toBe('true');

    // Verify radiogroups and radio buttons
    const radioGroups = screen.getAllByRole('radiogroup');
    expect(radioGroups.length).toBe(5);

    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons.length).toBe(10); // 2 per question * 5 questions
  });

  it('dynamically recalculates recommended track when user taps options', () => {
    renderRoadmapsPage();

    const resultBox = screen.getByTestId('diagnostic-result');
    // Initially Beginner
    expect(resultBox.textContent).toContain('🔰 Beginner Roadmap');
    expect(resultBox.textContent).toContain('0/5 answered');

    // Tap 3 intermediate options:
    // 1. Language: Fluent in 1 Language
    const fluentBtn = screen.getByText('Fluent in 1 Language');
    fireEvent.click(fluentBtn);
    expect(resultBox.textContent).toContain('1/5 answered');

    // 2. Big-O: Instant Complexity Intuition
    const bigOBtn = screen.getByText('Instant Complexity Intuition');
    fireEvent.click(bigOBtn);
    expect(resultBox.textContent).toContain('2/5 answered');

    // Still score 2 -> Beginner
    expect(resultBox.textContent).toContain('🔰 Beginner Roadmap');

    // 3. Solved: 50+ Problems Solved -> Score 3 -> Switches to Intermediate
    const solvedBtn = screen.getByText('50+ Problems Solved');
    fireEvent.click(solvedBtn);

    expect(resultBox.textContent).toContain('⚡ Intermediate Sprint');
    expect(resultBox.textContent).toContain('3/5 answered');

    // Click Reset answers
    const resetBtn = screen.getByRole('button', { name: /reset answers/i });
    fireEvent.click(resetBtn);

    // Recalculates back to Beginner
    expect(resultBox.textContent).toContain('🔰 Beginner Roadmap');
    expect(resultBox.textContent).toContain('0/5 answered');
  });

  it('switches views when clicking track switcher tabs', () => {
    renderRoadmapsPage();

    // Switch to Beginner Roadmap tab
    const beginnerTab = screen.getByRole('tab', { name: /Beginner Roadmap/i });
    fireEvent.click(beginnerTab);

    // Should display Beginner sections
    expect(screen.getByText(/🔰 Beginner Roadmap: From 0 to Pattern Intuition/i)).toBeTruthy();
    expect(screen.getByText(/Phase 1: Linear Invariants/i)).toBeTruthy();
    expect(screen.getByText(/The 15-Minute Rule Flowchart/i)).toBeTruthy();
    expect(screen.getByText(/Foundation Invariants Cheat Sheet/i)).toBeTruthy();

    // Intermediate-specific sections should not be visible when Beginner is selected
    expect(screen.queryByText(/When Technique X Breaks → Pivot to Y/i)).toBeNull();

    // Switch to Intermediate Sprint tab
    const intermediateTab = screen.getByRole('tab', { name: /Intermediate Sprint/i });
    fireEvent.click(intermediateTab);

    // Should display Intermediate sections
    expect(screen.getByText(/⚡ Intermediate Sprint Roadmap: 2–6 Week High-Velocity Prep/i)).toBeTruthy();
    expect(screen.getByText(/When Technique X Breaks → Pivot to Y/i)).toBeTruthy();
    expect(screen.getByText(/6 Advanced Sprint Tracks & Time Budgets/i)).toBeTruthy();
    expect(screen.getByText(/Target Company Frequency Mining Protocol/i)).toBeTruthy();
    expect(screen.getByText(/Mock Interview Protocol: The 45-Minute Execution Playbook/i)).toBeTruthy();

    // Beginner-specific sections should not be visible
    expect(screen.queryByText(/🔰 Beginner Roadmap: From 0 to Pattern Intuition/i)).toBeNull();

    // Switch to Feature Compass tab
    const compassTab = screen.getByRole('tab', { name: /Feature Compass/i });
    fireEvent.click(compassTab);

    expect(screen.getByText(/🧭 Feature Compass: From Frustration to Feature/i)).toBeTruthy();
    expect(screen.getByText(/“I freeze when facing an unseen problem I haven't memorized.”/i)).toBeTruthy();
    expect(screen.getByText(/“I don't know what Google or Meta actually ask in interviews today.”/i)).toBeTruthy();

    // Switch to Platform Loop tab
    const loopTab = screen.getByRole('tab', { name: /Platform Loop/i });
    fireEvent.click(loopTab);

    expect(screen.getByText(/The CompanyWise Engine Loop/i)).toBeTruthy();
    expect(screen.getByText(/Invariant First/i)).toBeTruthy();
    expect(screen.getByText(/Interactive Visualizer/i)).toBeTruthy();
    expect(screen.getByText(/15-Min Practice Sprint/i)).toBeTruthy();
    expect(screen.getByText(/Ah-Ha Drawer Unstick/i)).toBeTruthy();
    expect(screen.getByText(/Closed Learning Circuit/i)).toBeTruthy();
  });

  it('renders mock interview execution playbook and communication tips in intermediate track', () => {
    renderRoadmapsPage();

    // Switch to intermediate tab
    const intermediateTab = screen.getByRole('tab', { name: /Intermediate Sprint/i });
    fireEvent.click(intermediateTab);

    // Verify 45-minute stage breakdown
    expect(screen.getByText(/Mock Interview Protocol: The 45-Minute Execution Playbook/i)).toBeTruthy();
    expect(screen.getByText('Clarify & Scope')).toBeTruthy();
    expect(screen.getByText('Invariant Alignment')).toBeTruthy();
    expect(screen.getByText('Modular Implementation')).toBeTruthy();
    expect(screen.getByText('Manual Trace Table')).toBeTruthy();
    expect(screen.getByText('Complexity & Scale')).toBeTruthy();

    // Verify communication guidelines
    expect(screen.getByText('Never Code in Silence')).toBeTruthy();
    expect(screen.getByText('Collaborate on Interviewer Hints')).toBeTruthy();
    expect(screen.getByText('Dry-Run Edge Cases by Hand')).toBeTruthy();
    expect(screen.getByText('Record and Audit Peer Sessions')).toBeTruthy();
  });

  it('supports keyboard navigation across tablist (ArrowRight, ArrowLeft, Home, End)', () => {
    renderRoadmapsPage();

    const tablist = screen.getByRole('tablist');

    // Press ArrowRight -> moves to Beginner
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /Beginner Roadmap/i }).getAttribute('aria-selected')).toBe('true');

    // Press ArrowRight -> moves to Intermediate
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: /Intermediate Sprint/i }).getAttribute('aria-selected')).toBe('true');

    // Press End -> moves to Platform Loop
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(screen.getByRole('tab', { name: /Platform Loop/i }).getAttribute('aria-selected')).toBe('true');

    // Press Home -> moves back to All Tracks & Overview
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(screen.getByRole('tab', { name: /All Tracks & Overview/i }).getAttribute('aria-selected')).toBe('true');

    // Press ArrowLeft -> wraps to Platform Loop
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: /Platform Loop/i }).getAttribute('aria-selected')).toBe('true');
  });

  it('verifies all pattern route links point to valid canonical patterns in catalog', () => {
    const { container } = renderRoadmapsPage();

    const links = Array.from(container.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter((href): href is string => href !== null);

    // Extract pattern detail slugs
    const patternDetailSlugs = links
      .filter(h => h.startsWith('/patterns/') && h !== '/patterns')
      .map(h => h.replace('/patterns/', ''));

    expect(patternDetailSlugs.length).toBeGreaterThan(0);

    const validCatalogSlugs = new Set(PATTERNS_CATALOG.map(p => p.slug));

    // Every pattern link in RoadmapsPage MUST exist in PATTERNS_CATALOG (0 broken 404 links)
    for (const slug of patternDetailSlugs) {
      expect(
        validCatalogSlugs.has(slug),
        `Slug "/patterns/${slug}" was not found in PATTERNS_CATALOG!`
      ).toBe(true);
    }

    // Verify key destinations exist
    expect(links).toContain('/patterns');
    expect(links).toContain('/companies');
    expect(links).toContain('/problems');
    expect(links).toContain('/progress');
  });
});
