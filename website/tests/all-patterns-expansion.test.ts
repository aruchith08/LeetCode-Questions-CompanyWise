import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  ALL_PATTERNS_CONTENT,
  PATTERN_CONTENT_MAP,
  getPatternContent,
  ALL_PATTERN_MAPPINGS,
} from '../src/data/patterns/patternRegistry';
import { PATTERNS_CATALOG } from '../src/data/patternsData';
import {
  generateHashingSteps,
  generateTwoPointersSteps,
  generatePrefixSumSteps,
  generateBinarySearchSteps,
  generateFastSlowSteps,
  generateStackSteps,
  generateIntervalsSteps,
  generateHeapSteps,
  generateTreeDFSSteps,
  generateTreeBFSSteps,
  generateGraphTraversalSteps,
  generateTopologicalSortSteps,
  generateUnionFindSteps,
  generateBacktrackingSteps,
  generateGreedySteps,
  generateDPSteps,
  generateBitManipulationSteps,
} from '../src/utils/visualizerEngines';
import { generateSlidingWindowSteps } from '../src/utils/slidingWindowVisualizerEngine';

describe('18 DSA Patterns Expansion - Catalog & Content Integrity', () => {
  it('contains exactly 18 fully developed patterns in both registry and catalog', () => {
    expect(ALL_PATTERNS_CONTENT).toHaveLength(18);
    expect(PATTERNS_CATALOG).toHaveLength(18);

    const catalogSlugs = new Set(PATTERNS_CATALOG.map(p => p.slug));
    const contentSlugs = new Set(ALL_PATTERNS_CONTENT.map(p => p.slug));

    expect(catalogSlugs.size).toBe(18);
    expect(contentSlugs.size).toBe(18);

    for (const slug of catalogSlugs) {
      expect(contentSlugs.has(slug)).toBe(true);
      expect(getPatternContent(slug)).toBeDefined();
    }
  });

  it('guarantees all 18 patterns are marked available with valid metadata', () => {
    for (const pattern of PATTERNS_CATALOG) {
      expect(pattern.availability).toBe('available');
      expect(pattern.questionCount).toBeGreaterThan(0);
      expect(pattern.subpatternCount).toBeGreaterThan(0);
      expect(pattern.tags.length).toBeGreaterThan(0);
      expect(pattern.prerequisites && pattern.prerequisites.length).toBeGreaterThan(0);
      expect(pattern.companiesTop && pattern.companiesTop.length).toBeGreaterThan(0);
    }
  });

  it('ensures each pattern has rich curriculum content across all 8 modules', () => {
    for (const pattern of ALL_PATTERNS_CONTENT) {
      // Module 1: Intro
      expect(pattern.introTitle).toBeTruthy();
      expect(pattern.introDescription.length).toBeGreaterThanOrEqual(2);
      expect(pattern.motivatingProblem.title).toBeTruthy();
      expect(pattern.motivatingProblem.naiveApproach).toBeTruthy();
      expect(pattern.motivatingProblem.optimalApproach).toBeTruthy();
      expect(pattern.applicabilityInvariant).toBeTruthy();

      // Module 2: Recognition
      expect(pattern.signals.length).toBeGreaterThanOrEqual(3);
      expect(pattern.antiSignals.length).toBeGreaterThanOrEqual(2);

      // Module 3: Core Technique
      expect(pattern.coreTechniqueTitle).toBeTruthy();
      expect(pattern.coreTechniqueSteps.length).toBeGreaterThanOrEqual(3);
      expect(pattern.loopInvariant).toBeTruthy();

      // Module 4: Variations
      expect(pattern.variations.length).toBeGreaterThanOrEqual(2);
      for (const v of pattern.variations) {
        expect(v.title).toBeTruthy();
        expect(v.exampleProblem).toBeTruthy();
        expect(v.keyIdea).toBeTruthy();
      }

      // Module 5: Code Templates
      expect(pattern.pythonTemplate).toBeTruthy();
      expect(pattern.tsTemplate).toBeTruthy();
      expect(pattern.pythonExample).toBeTruthy();
      expect(pattern.tsExample).toBeTruthy();
      expect(pattern.complexity.time).toBeTruthy();
      expect(pattern.complexity.space).toBeTruthy();
      expect(pattern.pitfalls.length).toBeGreaterThanOrEqual(2);

      // Module 6: Visualizer
      expect(pattern.visualizerTitle).toBeTruthy();
      expect(pattern.visualizerSubtitle).toBeTruthy();

      // Module 7: Questions
      expect(pattern.mappings.length).toBeGreaterThanOrEqual(9);
      expect(pattern.subpatternTabs.length).toBeGreaterThanOrEqual(2);

      // Module 8: Quiz
      expect(pattern.quiz.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('18 DSA Patterns Expansion - Canonical Question Catalog Validation', () => {
  const catalogPath = path.resolve(__dirname, '../public/data/questions.json');
  const questionsJson = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const canonicalIds = new Set(questionsJson.map((q: any) => q.id));

  it('verifies 100% of question mappings exist in the canonical question catalog', () => {
    expect(ALL_PATTERN_MAPPINGS.length).toBeGreaterThanOrEqual(200);

    const missingIds: number[] = [];
    for (const mapping of ALL_PATTERN_MAPPINGS) {
      if (!canonicalIds.has(mapping.questionId)) {
        missingIds.push(mapping.questionId);
      }
      expect(mapping.primaryPattern).toBeTruthy();
      expect(mapping.subpattern).toBeTruthy();
      expect(mapping.subpatternLabel).toBeTruthy();
      expect(mapping.learningOrder).toBeGreaterThan(0);
      expect(mapping.reviewStatus).toBe('verified');
    }

    expect(missingIds).toEqual([]);
  });

  it('validates distribution across Foundation, Intermediate, and Advanced tiers', () => {
    const foundation = PATTERNS_CATALOG.filter(p => p.level === 'Foundation');
    const intermediate = PATTERNS_CATALOG.filter(p => p.level === 'Intermediate');
    const advanced = PATTERNS_CATALOG.filter(p => p.level === 'Advanced');

    expect(foundation).toHaveLength(6);
    expect(intermediate).toHaveLength(7);
    expect(advanced).toHaveLength(5);

    const foundationQuestions = foundation.reduce((sum, p) => sum + (p.questionCount ?? 0), 0);
    const intermediateQuestions = intermediate.reduce((sum, p) => sum + (p.questionCount ?? 0), 0);
    const advancedQuestions = advanced.reduce((sum, p) => sum + (p.questionCount ?? 0), 0);

    expect(foundationQuestions).toBeGreaterThanOrEqual(60);
    expect(intermediateQuestions).toBeGreaterThanOrEqual(70);
    expect(advancedQuestions).toBeGreaterThanOrEqual(50);
  });
});

describe('18 DSA Patterns Expansion - Visualizer Generators Execution', () => {
  it('executes all 17 generic pattern visualizer engines without error', () => {
    const engines = [
      { name: 'hashing', fn: generateHashingSteps },
      { name: 'two-pointers', fn: generateTwoPointersSteps },
      { name: 'prefix-sum', fn: generatePrefixSumSteps },
      { name: 'binary-search', fn: generateBinarySearchSteps },
      { name: 'fast-slow', fn: generateFastSlowSteps },
      { name: 'stack', fn: generateStackSteps },
      { name: 'intervals', fn: generateIntervalsSteps },
      { name: 'heap', fn: generateHeapSteps },
      { name: 'tree-dfs', fn: generateTreeDFSSteps },
      { name: 'tree-bfs', fn: generateTreeBFSSteps },
      { name: 'graph', fn: generateGraphTraversalSteps },
      { name: 'topological-sort', fn: generateTopologicalSortSteps },
      { name: 'union-find', fn: generateUnionFindSteps },
      { name: 'backtracking', fn: generateBacktrackingSteps },
      { name: 'greedy', fn: generateGreedySteps },
      { name: 'dp', fn: generateDPSteps },
      { name: 'bit-manipulation', fn: generateBitManipulationSteps },
    ];

    for (const engine of engines) {
      const steps = engine.fn();
      expect(steps.length, `Engine ${engine.name} returned empty steps`).toBeGreaterThanOrEqual(3);

      for (const step of steps) {
        expect(step.stepNumber).toBeGreaterThan(0);
        expect(step.title).toBeTruthy();
        expect(step.explanation).toBeTruthy();
      }
    }
  });

  it('executes specialized Sliding Window visualizer engine correctly', () => {
    const swSteps = generateSlidingWindowSteps([1, 12, -5, -6, 50, 3], 4);
    expect(swSteps).toHaveLength(3);
    expect(swSteps[0].currentSum).toBe(2);
    expect(swSteps[1].currentSum).toBe(51);
    expect(swSteps[2].currentSum).toBe(42);
  });
});

describe('18 DSA Patterns Expansion - Quiz Integrity Validation', () => {
  it('verifies every pattern has valid quiz questions with sound answer keys', () => {
    for (const pattern of ALL_PATTERNS_CONTENT) {
      expect(pattern.quiz.length).toBeGreaterThanOrEqual(3);

      for (const q of pattern.quiz) {
        expect(q.id).toBeTruthy();
        expect(q.question).toBeTruthy();
        expect(q.explanation).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(3);

        const optionIds = q.options.map(opt => opt.id);
        expect(optionIds).toContain(q.correctOptionId);

        // Guarantee no duplicate options
        const optionTexts = q.options.map(opt => opt.text.trim());
        const uniqueTexts = new Set(optionTexts);
        expect(uniqueTexts.size).toBe(q.options.length);
      }
    }
  });
});

describe('18 DSA Patterns Expansion - GenericPatternVisualizer Deep Component Tests', () => {
  it('renders co-located active pointers simultaneously without dropping any', async () => {
    const { render, screen, cleanup } = await import('@testing-library/react');
    cleanup();
    const React = await import('react');
    const { default: GenericPatternVisualizer } = await import(
      '../src/components/patterns/GenericPatternVisualizer'
    );
    const steps = generateFastSlowSteps();

    // Step 1 of fast-slow has BOTH 'Slow' and 'Fast' at index 0
    render(
      React.createElement(GenericPatternVisualizer, {
        title: 'Fast & Slow Visualizer',
        subtitle: 'Cycle detection',
        steps,
      })
    );

    // Both pointers must be in the document above index 0
    expect(screen.getByText('Slow')).toBeTruthy();
    expect(screen.getByText('Fast')).toBeTruthy();
    cleanup();
  });

  it('renders auxiliary data structure inspection panel when auxiliaryData is present', async () => {
    const { render, screen, cleanup } = await import('@testing-library/react');
    cleanup();
    const React = await import('react');
    const { default: GenericPatternVisualizer } = await import(
      '../src/components/patterns/GenericPatternVisualizer'
    );
    const steps = generateHashingSteps([2, 7, 11, 15], 9);

    render(
      React.createElement(GenericPatternVisualizer, {
        title: 'Hashing Visualizer',
        subtitle: 'Two sum hashing',
        steps,
      })
    );

    // Header and internal state inspection panel must be present
    expect(screen.getByText(/Internal Data Structure & Auxiliary State/i)).toBeTruthy();
    expect(screen.getByText(/Hash Map Table/i)).toBeTruthy();
    cleanup();
  });

  it('provides an interactive timeline scrubber allowing direct jumps to steps', async () => {
    const { render, screen, fireEvent, cleanup } = await import('@testing-library/react');
    cleanup();
    const React = await import('react');
    const { default: GenericPatternVisualizer } = await import(
      '../src/components/patterns/GenericPatternVisualizer'
    );
    const steps = generateBinarySearchSteps([2, 5, 8, 12, 16, 23, 38], 23);

    render(
      React.createElement(GenericPatternVisualizer, {
        title: 'Binary Search Visualizer',
        subtitle: 'Search boundaries',
        steps,
      })
    );

    // Initial state: Step 1 of N
    expect(screen.getAllByText(`Step 1 of ${steps.length}`).length).toBeGreaterThanOrEqual(1);

    // Find step scrubber and jump to step 2 (index 1)
    const scrubber = screen.getByLabelText(/Step Scrubber/i);
    fireEvent.change(scrubber, { target: { value: '1' } });

    // Step badge must reflect Step 2
    expect(screen.getAllByText(`Step 2 of ${steps.length}`).length).toBeGreaterThanOrEqual(1);

    // Click on timeline button for step 3
    const jumpBtn = screen.getByLabelText('Jump to step 3');
    fireEvent.click(jumpBtn);
    expect(screen.getAllByText(`Step 3 of ${steps.length}`).length).toBeGreaterThanOrEqual(1);
    cleanup();
  });

  it('resets step index to 0 when steps prop changes', async () => {
    const { render, screen, fireEvent, cleanup } = await import('@testing-library/react');
    cleanup();
    const React = await import('react');
    const { default: GenericPatternVisualizer } = await import(
      '../src/components/patterns/GenericPatternVisualizer'
    );
    const steps1 = generateTwoPointersSteps([1, 2, 4, 6, 8, 11], 10);
    const steps2 = generatePrefixSumSteps([2, 4, 1, 3, 5], [1, 3]);

    const { rerender } = render(
      React.createElement(GenericPatternVisualizer, {
        title: 'Two Pointers',
        subtitle: 'Two sum sorted',
        steps: steps1,
      })
    );

    // Advance to step 2
    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);
    expect(screen.getAllByText(`Step 2 of ${steps1.length}`).length).toBeGreaterThanOrEqual(1);

    // Rerender with different steps
    rerender(
      React.createElement(GenericPatternVisualizer, {
        title: 'Prefix Sum',
        subtitle: 'Cumulative range',
        steps: steps2,
      })
    );

    // Must reset to Step 1
    expect(screen.getAllByText(`Step 1 of ${steps2.length}`).length).toBeGreaterThanOrEqual(1);
    cleanup();
  });

  it('ensures all 17 generic visualizer engines populate auxiliaryData on steps', () => {
    const engines = [
      generateHashingSteps,
      generateTwoPointersSteps,
      generatePrefixSumSteps,
      generateBinarySearchSteps,
      generateFastSlowSteps,
      generateStackSteps,
      generateIntervalsSteps,
      generateHeapSteps,
      generateTreeDFSSteps,
      generateTreeBFSSteps,
      generateGraphTraversalSteps,
      generateTopologicalSortSteps,
      generateUnionFindSteps,
      generateBacktrackingSteps,
      generateGreedySteps,
      generateDPSteps,
      generateBitManipulationSteps,
    ];

    for (const engine of engines) {
      const steps = engine();
      const hasAuxData = steps.some(
        s => s.auxiliaryData && Object.keys(s.auxiliaryData).length > 0
      );
      expect(hasAuxData).toBe(true);
    }
  });
});
