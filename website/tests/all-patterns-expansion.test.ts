import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import {
  ALL_PATTERNS_CONTENT,
  PATTERN_CONTENT_MAP,
  getPatternContent,
  ALL_PATTERN_MAPPINGS,
  TOTAL_PATTERN_MAPPINGS_COUNT,
  UNIQUE_PATTERN_QUESTIONS_COUNT,
  UNIQUE_PATTERN_QUESTION_IDS,
  getCrossPatternQuestions,
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
import PatternVisualizerHost from '../src/components/patterns/PatternVisualizerHost';
import GenericPatternVisualizer from '../src/components/patterns/GenericPatternVisualizer';

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

describe('18 DSA Patterns Expansion - Question Catalog & Metric Separation', () => {
  const catalogPath = path.resolve(__dirname, '../public/data/questions.json');
  const questionsJson = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const canonicalIds = new Set(questionsJson.map((q: any) => q.id));

  it('verifies 100% of question mappings exist in the canonical question catalog', () => {
    expect(ALL_PATTERN_MAPPINGS.length).toBe(TOTAL_PATTERN_MAPPINGS_COUNT);

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

  it('independently separates total mappings (207) from unique question IDs (203)', () => {
    expect(TOTAL_PATTERN_MAPPINGS_COUNT).toBe(207);
    expect(UNIQUE_PATTERN_QUESTIONS_COUNT).toBe(203);
    expect(UNIQUE_PATTERN_QUESTION_IDS).toHaveLength(203);

    // Exactly 4 questions appear in two different valid tracks
    const crossQuestions = getCrossPatternQuestions();
    expect(crossQuestions).toHaveLength(4);

    const crossIds = crossQuestions.map(q => q.questionId).sort((a, b) => a - b);
    expect(crossIds).toEqual([42, 78, 128, 560]);

    // Verify technical justifications for cross-pattern mappings:
    // LeetCode 42 (Trapping Rain Water) -> two-pointers & stack-and-monotonic-stack
    const q42 = crossQuestions.find(q => q.questionId === 42)!;
    expect(q42.patterns).toContain('two-pointers');
    expect(q42.patterns).toContain('stack-and-monotonic-stack');

    // LeetCode 78 (Subsets) -> backtracking & bit-manipulation
    const q78 = crossQuestions.find(q => q.questionId === 78)!;
    expect(q78.patterns).toContain('backtracking');
    expect(q78.patterns).toContain('bit-manipulation');

    // LeetCode 128 (Longest Consecutive Sequence) -> hashing-and-frequency-counting & union-find
    const q128 = crossQuestions.find(q => q.questionId === 128)!;
    expect(q128.patterns).toContain('hashing-and-frequency-counting');
    expect(q128.patterns).toContain('union-find');

    // LeetCode 560 (Subarray Sum Equals K) -> hashing-and-frequency-counting & prefix-sum
    const q560 = crossQuestions.find(q => q.questionId === 560)!;
    expect(q560.patterns).toContain('hashing-and-frequency-counting');
    expect(q560.patterns).toContain('prefix-sum');
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

describe('18 DSA Patterns Expansion - React Hook-Order Invariant in PatternVisualizerHost', () => {
  it('switches between Sliding Window and generic patterns without violating hook order', () => {
    // Render sliding-window first (previously returned early before useMemo)
    const { rerender } = render(
      React.createElement(PatternVisualizerHost, {
        slug: 'sliding-window',
        title: 'Sliding Window',
      })
    );

    expect(screen.getAllByText(/Sliding Window/i).length).toBeGreaterThanOrEqual(1);

    // Rerender as two-pointers on the SAME component instance
    // If hook order is violated, React throws an error here!
    rerender(
      React.createElement(PatternVisualizerHost, {
        slug: 'two-pointers',
        title: 'Two Pointers',
      })
    );
    expect(screen.getAllByText(/Two Pointers/i).length).toBeGreaterThanOrEqual(1);

    // Rerender back to sliding-window
    rerender(
      React.createElement(PatternVisualizerHost, {
        slug: 'sliding-window',
        title: 'Sliding Window',
      })
    );
    expect(screen.getAllByText(/Sliding Window/i).length).toBeGreaterThanOrEqual(1);

    // Rerender to binary-search
    rerender(
      React.createElement(PatternVisualizerHost, {
        slug: 'binary-search',
        title: 'Binary Search',
      })
    );
    expect(screen.getAllByText(/Binary Search/i).length).toBeGreaterThanOrEqual(1);

    cleanup();
  });
});

describe('18 DSA Patterns Expansion - True Algorithmic Execution Correctness', () => {
  it('1. Hashing Two Sum computes correct solution indices for standard and custom inputs', () => {
    const steps1 = generateHashingSteps([2, 7, 11, 15], 9);
    const lastStep1 = steps1[steps1.length - 1];
    expect(lastStep1.statusBadge?.label).toBe('Solution Found');
    expect(lastStep1.highlightIndices).toEqual([0, 1]);

    // Custom input test
    const steps2 = generateHashingSteps([3, 2, 4], 6);
    const lastStep2 = steps2[steps2.length - 1];
    expect(lastStep2.statusBadge?.label).toBe('Solution Found');
    expect(lastStep2.highlightIndices).toEqual([1, 2]);
  });

  it('2. Two Pointers Two Sum II converges to correct matching indices', () => {
    const steps = generateTwoPointersSteps([1, 2, 4, 6, 8, 11], 10);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('Match Found');
    // Indices 1 and 4 have 2 + 8 = 10
    expect(lastStep.highlightIndices).toEqual([1, 4]);
  });

  it('3. Prefix Sum generates correct running sums and O(1) range query values', () => {
    const steps = generatePrefixSumSteps([2, 4, 1, 3, 5], [1, 3]);
    const lastStep = steps[steps.length - 1];
    // Range [1..3] is nums[1] + nums[2] + nums[3] = 4 + 1 + 3 = 8
    expect(lastStep.auxiliaryData?.query?.rangeSum).toBe(8);
    expect(lastStep.statusBadge?.label).toBe('Result = 8');
  });

  it('4. Binary Search locates target with logarithmic boundary reductions', () => {
    const steps = generateBinarySearchSteps([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('Target Located');
    expect(lastStep.highlightIndices).toEqual([5]);
    expect(lastStep.auxiliaryData?.foundIndex).toBe(5);
  });

  it('5. Fast & Slow Pointers mathematically detects cycle and confirms exact entrance', () => {
    const steps = generateFastSlowSteps([0, 1, 2, 3, 4, 5], 2);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('Entrance Verified');
    expect(lastStep.auxiliaryData?.cycleEntrance).toBe(2);
    expect(lastStep.auxiliaryData?.entranceProven).toBe(true);
  });

  it('6. Monotonic Stack resolves daily temperatures accurately', () => {
    const steps = generateStackSteps([73, 74, 75, 71, 69, 72, 76, 73]);
    const lastStep = steps[steps.length - 1];
    const finalResult = lastStep.auxiliaryData?.result;
    // Expected next warmer days: [1, 1, 4, 2, 1, 1, 0, 0]
    expect(finalResult).toEqual([1, 1, 4, 2, 1, 1, 0, 0]);
  });

  it('7. Intervals & Sweep Line merges overlapping intervals via start-time sorting', () => {
    const steps = generateIntervalsSteps([
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18],
    ]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('Complete');
    expect(lastStep.auxiliaryData?.merged).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
  });

  it('8. Min-Heap tracks Top K stream elements with binary heap sift-down', () => {
    const steps = generateHeapSteps([4, 10, 3, 5, 1, 9], 3);
    const lastStep = steps[steps.length - 1];
    // Stream sorted desc: 10, 9, 5, 4, 3, 1 -> 3rd largest is 5
    expect(lastStep.auxiliaryData?.kthLargest).toBe(5);
    expect(lastStep.statusBadge?.label).toBe('Ans: 5');
  });

  it('9. Tree DFS computes accurate recursive tree height and call stack states', () => {
    const steps = generateTreeDFSSteps();
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('Max Depth = 3');
    expect(lastStep.auxiliaryData?.finalHeight).toBe(3);
  });

  it('10. Tree BFS performs true level-order queue traversals', () => {
    const steps = generateTreeBFSSteps();
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('BFS Complete');
    expect(lastStep.auxiliaryData?.levelOrder).toBe('[[1],[2,3],[4,5]]');
  });

  it('11. Graph Traversal flood-fills orthogonal cells and counts connected islands', () => {
    const grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ];
    const steps = generateGraphTraversalSteps(grid);
    const lastStep = steps[steps.length - 1];
    // Island 1: {(0,0), (0,1), (1,0)}; Island 2: {(2,2)}
    expect(lastStep.statusBadge?.label).toBe('Total: 2');
    expect(lastStep.auxiliaryData?.totalIslands).toBe(2);
  });

  it('12. Topological Sort executes Kahn in-degree algorithm and detects acyclic DAG', () => {
    const steps = generateTopologicalSortSteps(4, [
      [1, 3],
      [2, 3],
      [0, 1],
      [0, 2],
    ]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('Valid DAG');
    expect(lastStep.auxiliaryData?.isDAG).toBe(true);

    // Topological order must place prerequisite 3 before 1 and 2, and 1 and 2 before 0
    const order: string[] = lastStep.auxiliaryData?.order;
    expect(order.indexOf('Course 3')).toBeLessThan(order.indexOf('Course 1'));
    expect(order.indexOf('Course 3')).toBeLessThan(order.indexOf('Course 2'));
    expect(order.indexOf('Course 1')).toBeLessThan(order.indexOf('Course 0'));
    expect(order.indexOf('Course 2')).toBeLessThan(order.indexOf('Course 0'));
  });

  it('13. Union Find with path compression detects redundant edges and cycles', () => {
    const steps = generateUnionFindSteps(4, [
      [0, 1],
      [1, 2],
      [0, 2],
      [2, 3],
    ]);
    // Step detecting redundant cycle edge (0, 2)
    const cycleStep = steps.find(s => s.statusBadge?.label === 'Cycle Detected');
    expect(cycleStep).toBeDefined();
    expect(cycleStep?.auxiliaryData?.redundantEdge).toBe('(0, 2)');
  });

  it('14. Backtracking generates exactly N! permutations through choose, explore, and un-choose', () => {
    const steps = generateBacktrackingSteps([1, 2]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('Complete');
    // 2! = 2 permutations: [1, 2], [2, 1]
    expect(lastStep.auxiliaryData?.allPermutations).toHaveLength(2);
    expect(lastStep.auxiliaryData?.allPermutations).toEqual(['[1, 2]', '[2, 1]']);
  });

  it('15. Greedy Jump Game tracks reachable horizon and detects when destination is reached', () => {
    const stepsReachable = generateGreedySteps([2, 3, 1, 1, 4]);
    const lastStep1 = stepsReachable[stepsReachable.length - 1];
    expect(lastStep1.statusBadge?.label).toBe('Goal Reachable');
    expect(lastStep1.auxiliaryData?.reachable).toBe(true);

    // Unreachable case
    const stepsUnreachable = generateGreedySteps([3, 2, 1, 0, 4]);
    const lastStep2 = stepsUnreachable[stepsUnreachable.length - 1];
    expect(lastStep2.statusBadge?.label).toBe('Unreachable');
    expect(lastStep2.auxiliaryData?.reachable).toBe(false);
  });

  it('16. Dynamic Programming Coin Change calculates optimal minimum coins', () => {
    const steps = generateDPSteps([1, 2, 5], 7);
    const lastStep = steps[steps.length - 1];
    // 7 can be made with 5 + 2 = 2 coins
    expect(lastStep.statusBadge?.label).toBe('Answer = 2');
    expect(lastStep.auxiliaryData?.optimalCoins).toBe(2);
  });

  it('17. Bit Manipulation Single Number utilizes XOR cancellation to find the unique number', () => {
    const steps = generateBitManipulationSteps([4, 1, 2, 1, 2]);
    const lastStep = steps[steps.length - 1];
    expect(lastStep.statusBadge?.label).toBe('Unique: 4');
    expect(lastStep.auxiliaryData?.singleNumber).toBe(4);
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

        // Verify correct option text is substantial and meaningful
        const correctOpt = q.options.find(opt => opt.id === q.correctOptionId)!;
        expect(correctOpt.text.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

describe('18 DSA Patterns Expansion - GenericPatternVisualizer Deep Component Tests', () => {
  it('renders co-located active pointers simultaneously without dropping any', async () => {
    cleanup();
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
    cleanup();
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
    cleanup();
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
    cleanup();
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
