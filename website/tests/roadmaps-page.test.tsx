import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RoadmapsPage from '../src/pages/RoadmapsPage';

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

  it('renders hero card with "Work In Progress" badge, title, and "Still building — will be available soon."', () => {
    renderRoadmapsPage();

    // Verify main header
    expect(
      screen.getByRole('heading', { name: /Interview Roadmaps & Preparation Strategy/i, level: 1 })
    ).toBeTruthy();

    // Verify Work In Progress status badge
    expect(screen.getByText('Work In Progress')).toBeTruthy();

    // Verify exact clean notice
    expect(
      screen.getByText(/Still building — will be available soon\./i)
    ).toBeTruthy();

    // Verify unwanted speculative text has been completely removed
    expect(screen.queryByText(/with an artifact for display/i)).toBeNull();
    expect(screen.queryByText(/Below is our live design specimen detailing the three candidate roadmap models/i)).toBeNull();
    expect(screen.queryByText(/SPEC \/\/ CW-RDMP-2026\.11/i)).toBeNull();
  });

  it('renders default mountain roadmap artwork and allows switching to repair robot artwork', () => {
    renderRoadmapsPage();

    // Default view has the mountain artwork
    const mountainImg = screen.getByAltText(/CompanyWise Interview Roadmap: Mountain Journey to Mastery/i);
    expect(mountainImg).toBeTruthy();
    expect(mountainImg.getAttribute('src')).toBe('/companywise-roadmap-mountain.webp');

    // Switcher buttons exist
    const mountainBtn = screen.getByRole('button', { name: /Mountain Journey/i });
    const robotBtn = screen.getByRole('button', { name: /Repair Robot/i });
    expect(mountainBtn).toBeTruthy();
    expect(robotBtn).toBeTruthy();

    // Click Repair Robot button
    fireEvent.click(robotBtn);

    // Mountain should no longer be visible; Robot images are rendered
    expect(screen.queryByAltText(/CompanyWise Interview Roadmap: Mountain Journey to Mastery/i)).toBeNull();
    const robotImgs = screen.getAllByAltText(/CompanyWise Construction Robot: Repairing Roadmap Gears/i);
    expect(robotImgs.length).toBeGreaterThan(0);

    // Click Mountain Journey button to switch back
    fireEvent.click(mountainBtn);
    expect(screen.getByAltText(/CompanyWise Interview Roadmap: Mountain Journey to Mastery/i)).toBeTruthy();
  });

  it('renders direct navigation links to live production engines within the hero card', () => {
    renderRoadmapsPage();

    const patternBtn = screen.getByRole('link', { name: /Explore 20 Patterns/i });
    expect(patternBtn.getAttribute('href')).toBe('/patterns');

    const companyBtn = screen.getByRole('link', { name: /490\+ Companies/i });
    expect(companyBtn.getAttribute('href')).toBe('/companies');

    const problemBtn = screen.getByRole('link', { name: /3,411 Problems/i });
    expect(problemBtn.getAttribute('href')).toBe('/problems');
  });

  it('renders active platform engines direct access grid', () => {
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

  it('renders engineering note acknowledging preserved draft modules', () => {
    renderRoadmapsPage();

    expect(
      screen.getByText(/RoadmapsDraftModules\.tsx/i)
    ).toBeTruthy();
  });
});
