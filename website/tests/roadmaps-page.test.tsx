import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
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

    // Verify unwanted text is absent
    expect(screen.queryByText(/with an artifact for display/i)).toBeNull();
    expect(screen.queryByText(/Below is our live design specimen/i)).toBeNull();
    expect(screen.queryByText(/SPEC \/\/ CW-RDMP-2026\.11/i)).toBeNull();
  });

  it('renders mountain roadmap artwork and does not render robot picture', () => {
    renderRoadmapsPage();

    // Mountain roadmap image is present
    const mountainImg = screen.getByAltText(/CompanyWise Interview Roadmap: Mountain Journey to Mastery/i);
    expect(mountainImg).toBeTruthy();
    expect(mountainImg.getAttribute('src')).toBe('/companywise-roadmap-mountain.webp');

    // Robot images and switchers are absent
    expect(screen.queryByAltText(/CompanyWise Construction Robot/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /Mountain Journey/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Repair Robot/i })).toBeNull();
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

  it('verifies lower platform engines section and engineering note are removed', () => {
    renderRoadmapsPage();

    // Lower section removed
    expect(screen.queryByText(/Start Practicing Now with Live Platform Engines/i)).toBeNull();
    expect(screen.queryByText(/ALL 3,411 QUESTIONS & 20 PATTERNS ARE PRODUCTION-READY/i)).toBeNull();
    expect(screen.queryByText(/20 Canonical Patterns/i)).toBeNull();
    expect(screen.queryByText(/490\+ Tech Companies/i)).toBeNull();

    // Engineering note removed
    expect(screen.queryByText(/ENGINEERING NOTE:/i)).toBeNull();
    expect(screen.queryByText(/RoadmapsDraftModules\.tsx/i)).toBeNull();
  });
});
