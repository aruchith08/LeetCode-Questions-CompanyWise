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

  it('renders hero section with title, "still building" notice, and clean mountain image', () => {
    renderRoadmapsPage();

    // Verify main header
    expect(
      screen.getByRole('heading', { name: /Interview Roadmaps & Preparation Strategy/i, level: 1 })
    ).toBeTruthy();

    // Verify status badge
    expect(screen.getByText(/STATUS: ARCHITECTURAL DESIGN \/\/ COMING SOON/i)).toBeTruthy();

    // Verify exact user-requested notice
    expect(
      screen.getByText(/Still building — will be available soon with an artifact for display/i)
    ).toBeTruthy();

    // Verify hero mountain image
    const heroImage = screen.getByAltText(/CompanyWise Interview Roadmap: Mountain Journey to Mastery/i);
    expect(heroImage).toBeTruthy();
    expect(heroImage.getAttribute('src')).toBe('/companywise-roadmap-mountain.webp');
  });

  it('renders the architectural artifact specimen card with all 3 proposal tabs', () => {
    renderRoadmapsPage();

    // Specimen header metadata
    expect(screen.getByText(/SPEC \/\/ CW-RDMP-2026\.11 · SYSTEM ARTIFACT FOR DISPLAY/i)).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Roadmap Representation Candidate Models/i })).toBeTruthy();

    // 3 Candidate Proposal Tabs
    expect(screen.getByRole('tab', { name: /Model A: Interactive Skill Tree DAG/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Model B: High-Velocity Company Sprint/i })).toBeTruthy();
    expect(screen.getByRole('tab', { name: /Model C: Technique Pivot & Decision Matrix/i })).toBeTruthy();
  });

  it('switches views interactively when clicking candidate proposal tabs', () => {
    renderRoadmapsPage();

    // Default view is Model A: Interactive Skill Tree DAG
    expect(screen.getByText(/Hierarchical Invariant Trajectory/i)).toBeTruthy();
    expect(screen.getByText(/Tier 1 \/\/ Foundation/i)).toBeTruthy();
    expect(screen.getByText(/Linear Invariants & Pointers/i)).toBeTruthy();

    // Click Model B: High-Velocity Company Sprint
    const modelBTab = screen.getByRole('tab', { name: /Model B: High-Velocity Company Sprint/i });
    fireEvent.click(modelBTab);

    expect(screen.getByText(/Time-Boxed Sprint Velocity Playbook/i)).toBeTruthy();
    expect(screen.getByText(/Week 1–2 \/\/ Phase 1/i)).toBeTruthy();
    expect(screen.getByText(/High-Frequency Core Blitz/i)).toBeTruthy();
    expect(screen.queryByText(/Linear Invariants & Pointers/i)).toBeNull();

    // Click Model C: Technique Pivot & Decision Matrix
    const modelCTab = screen.getByRole('tab', { name: /Model C: Technique Pivot & Decision Matrix/i });
    fireEvent.click(modelCTab);

    expect(screen.getByText(/Live Interview Pivot Diagnostics/i)).toBeTruthy();
    expect(screen.getByText(/Diagnostic Pivot 01/i)).toBeTruthy();
    expect(screen.getByText(/Sliding Window Fails on Negative Numbers/i)).toBeTruthy();
    expect(screen.queryByText(/High-Frequency Core Blitz/i)).toBeNull();

    // Click back to Model A
    const modelATab = screen.getByRole('tab', { name: /Model A: Interactive Skill Tree DAG/i });
    fireEvent.click(modelATab);

    expect(screen.getByText(/Hierarchical Invariant Trajectory/i)).toBeTruthy();
    expect(screen.getByText(/Linear Invariants & Pointers/i)).toBeTruthy();
  });

  it('supports keyboard navigation across architectural proposal tablist (ArrowRight, ArrowLeft, Home, End)', () => {
    renderRoadmapsPage();

    const tablist = screen.getByRole('tablist', { name: /Roadmap architectural proposals/i });

    // Press ArrowRight -> moves to Model B
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(
      screen.getByRole('tab', { name: /Model B: High-Velocity Company Sprint/i }).getAttribute('aria-selected')
    ).toBe('true');

    // Press ArrowRight -> moves to Model C
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(
      screen.getByRole('tab', { name: /Model C: Technique Pivot & Decision Matrix/i }).getAttribute('aria-selected')
    ).toBe('true');

    // Press End -> stays on Model C
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(
      screen.getByRole('tab', { name: /Model C: Technique Pivot & Decision Matrix/i }).getAttribute('aria-selected')
    ).toBe('true');

    // Press Home -> moves back to Model A
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(
      screen.getByRole('tab', { name: /Model A: Interactive Skill Tree DAG/i }).getAttribute('aria-selected')
    ).toBe('true');

    // Press ArrowLeft -> wraps to Model C
    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(
      screen.getByRole('tab', { name: /Model C: Technique Pivot & Decision Matrix/i }).getAttribute('aria-selected')
    ).toBe('true');
  });

  it('renders comparative evaluation matrix table with all criteria', () => {
    renderRoadmapsPage();

    expect(screen.getByText(/Model Comparison & Deliberation Matrix/i)).toBeTruthy();
    expect(screen.getByText('Primary Candidate Focus')).toBeTruthy();
    expect(screen.getByText('Cognitive Mental Model')).toBeTruthy();
    expect(screen.getByText('Optimal Practice Window')).toBeTruthy();
    expect(screen.getByText('Retention & Invariant Yield')).toBeTruthy();
    expect(screen.getByText('Platform Integration Depth')).toBeTruthy();
  });

  it('renders quick access cards to live production modules with valid routes', () => {
    const { container } = renderRoadmapsPage();

    expect(screen.getByText(/Start Practicing Now with Live Platform Engines/i)).toBeTruthy();
    expect(screen.getByText(/20 Canonical Patterns/i)).toBeTruthy();
    expect(screen.getByText(/490\+ Tech Companies/i)).toBeTruthy();
    expect(screen.getByText(/3,411 Curated Problems/i)).toBeTruthy();
    expect(screen.getByText(/Personal Mastery Tracker/i)).toBeTruthy();

    const links = Array.from(container.querySelectorAll('a'))
      .map(a => a.getAttribute('href'))
      .filter((href): href is string => href !== null);

    expect(links).toContain('/patterns');
    expect(links).toContain('/companies');
    expect(links).toContain('/problems');
    expect(links).toContain('/progress');
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
  });

  it('renders technical engineering note acknowledging preserved draft modules', () => {
    renderRoadmapsPage();

    expect(
      screen.getByText(/RoadmapsDraftModules\.tsx/i)
    ).toBeTruthy();
  });
});
