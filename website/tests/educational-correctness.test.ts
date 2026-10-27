import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { FOUNDATION_PATTERNS } from '../src/data/patterns/foundationPatterns';
import { INTERMEDIATE_PATTERNS } from '../src/data/patterns/intermediatePatterns';
import { ADVANCED_PATTERNS } from '../src/data/patterns/advancedPatterns';
import { generateBacktrackingSteps } from '../src/utils/visualizerEngines';

const ALL_PATTERNS = [
  ...FOUNDATION_PATTERNS,
  ...INTERMEDIATE_PATTERNS,
  ...ADVANCED_PATTERNS,
];

describe('Sliding Window Educational Notes & Algorithmic Distinctions', () => {
  const notesPath = path.resolve(__dirname, '../../docs/research/sliding-window-notes.md');
  const lessonPath = path.resolve(__dirname, '../src/pages/PatternDetailPage.tsx');

  it('verifies research notes file exists and clearly distinguishes LC #209, LC #862, and LC #560', () => {
    expect(fs.existsSync(notesPath)).toBe(true);
    const content = fs.readFileSync(notesPath, 'utf8');

    // LeetCode #209: Variable-size Sliding Window, strictly positive numbers
    expect(content).toContain('LeetCode #209');
    expect(content).toContain('Minimum Size Subarray Sum');
    expect(content).toMatch(/Variable-Size Sliding Window/i);
    expect(content).toMatch(/strictly positive/i);

    // LeetCode #862: Prefix Sum + Monotonic Deque, handles negative numbers
    expect(content).toContain('LeetCode #862');
    expect(content).toContain('Shortest Subarray with Sum at Least K');
    expect(content).toMatch(/Prefix Sum \+ Monotonic Deque/i);

    // LeetCode #560: Prefix Sum + Hash Map, counts exact sum = K
    expect(content).toContain('LeetCode #560');
    expect(content).toContain('Subarray Sum Equals K');
    expect(content).toMatch(/Prefix Sum \+ Hash Map/i);

    // Complexity verification in notes: O(n) time for all three
    expect(content).toMatch(/\\mathcal\{O\}\(n\)/);
  });

  it('verifies PatternDetailPage distinguishes LC #209, LC #862, and LC #560 correctly', () => {
    expect(fs.existsSync(lessonPath)).toBe(true);
    const lessonContent = fs.readFileSync(lessonPath, 'utf8');

    expect(lessonContent).toContain('LeetCode #209');
    expect(lessonContent).toContain('LeetCode #862');
    expect(lessonContent).toContain('LeetCode #560');
    expect(lessonContent).toContain('Prefix Sum + Monotonic Deque');
    expect(lessonContent).toContain('Prefix Sum + Hash Map');
  });

  it('validates algorithmic rationale: positive integers guarantee monotonicity, negatives break it', () => {
    const content = fs.readFileSync(notesPath, 'utf8');

    // Must explain that negative numbers break monotonicity
    expect(content).toMatch(/negative numbers cause running sums to oscillate non-monotonically/i);
    // Must explain why deque pops from front (R - front >= K) and back (P[R] <= P[back])
    expect(content).toMatch(/pop from front when/i);
    expect(content).toMatch(/pop from back while/i);
  });
});

describe('18 Patterns Curriculum Quality & Algorithmic Correctness Gate', () => {
  it('ensures all 18 patterns have non-empty, pattern-specific brute force implementations', () => {
    expect(ALL_PATTERNS).toHaveLength(18);

    for (const pattern of ALL_PATTERNS) {
      // Must have pythonBrute and tsBrute
      expect(pattern.pythonBrute, `Pattern ${pattern.slug} missing pythonBrute`).toBeDefined();
      expect(pattern.pythonBrute?.trim().length).toBeGreaterThan(20);

      expect(pattern.tsBrute, `Pattern ${pattern.slug} missing tsBrute`).toBeDefined();
      expect(pattern.tsBrute?.trim().length).toBeGreaterThan(20);

      // Must have bruteComplexity and bruteExplanation
      expect(pattern.bruteComplexity?.time, `Pattern ${pattern.slug} missing bruteComplexity.time`).toBeDefined();
      expect(pattern.bruteComplexity?.space, `Pattern ${pattern.slug} missing bruteComplexity.space`).toBeDefined();
      expect(pattern.bruteExplanation, `Pattern ${pattern.slug} missing bruteExplanation`).toBeDefined();

      // Ensure non-sliding-window patterns do NOT leak #643 Sliding Window code
      if (pattern.slug !== 'sliding-window') {
        expect(pattern.pythonBrute).not.toContain('max_average_bruteforce');
        expect(pattern.pythonBrute).not.toContain('nums[i] - nums[i - k]');
        expect(pattern.tsBrute).not.toContain('findMaxAverageBrute');
      }
    }
  });

  it('verifies Heap / Top K TypeScript implementation utilizes a true MinHeap instead of array sort', () => {
    const heapPattern = ALL_PATTERNS.find(p => p.slug === 'heap-top-k');
    expect(heapPattern).toBeDefined();

    // The optimized TypeScript template must contain a real MinHeap class with heap sift operations
    expect(heapPattern?.tsTemplate).toContain('class MinHeap');
    expect(heapPattern?.tsTemplate).toContain('peek()');
    expect(heapPattern?.tsTemplate).not.toContain('nums.sort(');

    expect(heapPattern?.tsExample).toContain('class MinHeap');
    expect(heapPattern?.tsExample).not.toContain('nums.sort(');

    // Brute force should correctly capture the O(N log N) sort baseline
    expect(heapPattern?.pythonBrute).toContain('sort');
    expect(heapPattern?.tsBrute).toContain('.sort(');
    expect(heapPattern?.bruteComplexity?.time).toContain('O(N log N)');
  });

  it('verifies Number of Islands implementations use iterative traversal preventing stack overflow', () => {
    const graphPattern = ALL_PATTERNS.find(p => p.slug === 'graph-traversal');
    expect(graphPattern).toBeDefined();

    // Must use iterative stack or queue traversal to prevent Python RecursionError on large grids
    expect(graphPattern?.pythonTemplate).toContain('stack');
    expect(graphPattern?.pythonTemplate).toContain('while stack:');
    expect(graphPattern?.pythonExample).toContain('stack');

    expect(graphPattern?.tsTemplate).toContain('stack');
    expect(graphPattern?.tsExample).toContain('stack');
  });

  it('verifies Backtracking visualizer calculates N! factorial accurately across different input lengths', () => {
    const stepsLen2 = generateBacktrackingSteps([1, 2]);
    const metricLen2 = stepsLen2[0].metrics?.find(m => m.label === 'Expected Perms');
    expect(metricLen2?.value).toBe(2); // 2! = 2

    const stepsLen3 = generateBacktrackingSteps([1, 2, 3]);
    const metricLen3 = stepsLen3[0].metrics?.find(m => m.label === 'Expected Perms');
    expect(metricLen3?.value).toBe(6); // 3! = 6

    const stepsLen4 = generateBacktrackingSteps([1, 2, 3, 4]);
    const metricLen4 = stepsLen4[0].metrics?.find(m => m.label === 'Expected Perms');
    expect(metricLen4?.value).toBe(24); // 4! = 24
  });

  it('ensures all practice questions are assigned to registered subpattern tabs across all 18 patterns', () => {
    for (const pattern of ALL_PATTERNS) {
      const registeredTabIds = new Set(pattern.subpatternTabs.map(t => t.id));
      for (const mapping of pattern.mappings) {
        expect(
          registeredTabIds.has(mapping.subpattern),
          `In pattern '${pattern.slug}', mapping for question #${mapping.questionId} uses subpattern '${mapping.subpattern}', which is not present in subpatternTabs: [${[...registeredTabIds].join(', ')}]`
        ).toBe(true);
      }
    }
  });
});
