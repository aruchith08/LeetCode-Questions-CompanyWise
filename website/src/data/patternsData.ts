import type {
  DSAPattern,
  PatternQuestion,
  PatternQuestionMapping,
  VisualizerStep,
  QuizQuestion,
} from '../types/patterns';
import type { GlobalQuestion } from '../types';
import { generateSlidingWindowSteps } from '../utils/slidingWindowVisualizerEngine';
import {
  ALL_PATTERN_MAPPINGS,
  getPatternContent,
  getPatternMappings,
} from './patterns/patternRegistry';

export { ALL_PATTERN_MAPPINGS, getPatternContent, getPatternMappings };

export const PATTERNS_CATALOG: DSAPattern[] = [
  // Foundation (6)
  {
    id: 'hashing-and-frequency-counting',
    slug: 'hashing-and-frequency-counting',
    title: 'Hashing & Frequency Counting',
    shortDescription: 'Use hash tables and frequency maps for fast O(1) lookups and counting elements.',
    level: 'Foundation',
    availability: 'available',
    category: 'Hash Tables & Arrays',
    questionCount: 12,
    subpatternCount: 4,
    prerequisites: ['Arrays', 'Basic Math', 'Key-Value Dictionaries'],
    tags: ['Hash Map', 'Counting', 'Lookup', 'Frequency Table'],
    companiesTop: ['Amazon', 'Google', 'Microsoft', 'Meta'],
  },
  {
    id: 'two-pointers',
    slug: 'two-pointers',
    title: 'Two Pointers',
    shortDescription: 'Solve problems using coordinated pointers moving from different directions or speeds.',
    level: 'Foundation',
    availability: 'available',
    category: 'Arrays & Strings',
    questionCount: 12,
    subpatternCount: 3,
    prerequisites: ['Arrays', 'Sorting Basics', 'Loop Invariants'],
    tags: ['Pointers', 'Sorted Arrays', 'In-place', 'Opposite Direction'],
    companiesTop: ['Meta', 'Amazon', 'Apple', 'Bloomberg'],
  },
  {
    id: 'sliding-window',
    slug: 'sliding-window',
    title: 'Sliding Window',
    shortDescription: 'Efficiently process contiguous sections of arrays and strings without recomputing everything from scratch.',
    level: 'Foundation',
    availability: 'available',
    category: 'Arrays & Strings',
    questionCount: 15,
    subpatternCount: 4,
    prerequisites: ['Arrays', 'Two Pointers Basics', 'Hash Maps'],
    tags: ['Subarrays', 'Substrings', 'Contiguous', 'Optimization'],
    companiesTop: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
  },
  {
    id: 'prefix-sum',
    slug: 'prefix-sum',
    title: 'Prefix Sum',
    shortDescription: 'Use cumulative running sums to answer range sum queries in O(1) constant time.',
    level: 'Foundation',
    availability: 'available',
    category: 'Arrays & Math',
    questionCount: 12,
    subpatternCount: 4,
    prerequisites: ['Arrays', 'Basic Arithmetic', 'Cumulative Sums'],
    tags: ['Cumulative Sum', 'Range Queries', 'Difference Array', 'Hash Map Range'],
    companiesTop: ['Google', 'Meta', 'Amazon', 'Uber'],
  },
  {
    id: 'binary-search',
    slug: 'binary-search',
    title: 'Binary Search',
    shortDescription: 'Find answers efficiently in sorted arrays or monotonic answer search spaces in O(log N).',
    level: 'Foundation',
    availability: 'available',
    category: 'Searching & Arrays',
    questionCount: 12,
    subpatternCount: 4,
    prerequisites: ['Sorted Arrays', 'Divide and Conquer', 'Monotonic Predicates'],
    tags: ['Divide and Conquer', 'Monotonic Space', 'Logarithmic', 'Boundary Finding'],
    companiesTop: ['Google', 'Meta', 'Amazon', 'Bloomberg'],
  },
  {
    id: 'fast-and-slow-pointers',
    slug: 'fast-and-slow-pointers',
    title: 'Fast & Slow Pointers',
    shortDescription: 'Use two pointers moving at different speeds to detect cycles and find middle nodes.',
    level: 'Foundation',
    availability: 'available',
    category: 'Linked Lists & Arrays',
    questionCount: 10,
    subpatternCount: 3,
    prerequisites: ['Linked Lists', 'Pointers', 'Cycle Detection'],
    tags: ['Floyd Cycle Detection', 'Middle Finding', 'Linked Lists', 'Tortoise and Hare'],
    companiesTop: ['Microsoft', 'Amazon', 'Oracle', 'Apple'],
  },

  // Intermediate (7)
  {
    id: 'stack-and-monotonic-stack',
    slug: 'stack-and-monotonic-stack',
    title: 'Stack & Monotonic Stack',
    shortDescription: 'Use stacks to maintain order and solve next/previous greater or smaller element problems.',
    level: 'Intermediate',
    availability: 'available',
    category: 'Stacks & Queues',
    questionCount: 12,
    subpatternCount: 3,
    prerequisites: ['Stack LIFO Operations', 'Arrays', 'Amortized Analysis'],
    tags: ['Monotonic Stack', 'LIFO', 'Next Greater Element', 'Histogram'],
    companiesTop: ['Amazon', 'Google', 'Meta', 'ByteDance'],
  },
  {
    id: 'intervals-and-sweep-line',
    slug: 'intervals-and-sweep-line',
    title: 'Intervals & Sweep Line',
    shortDescription: 'Work with overlapping intervals, meeting rooms, and event-based point processing.',
    level: 'Intermediate',
    availability: 'available',
    category: 'Arrays & Sorting',
    questionCount: 10,
    subpatternCount: 3,
    prerequisites: ['Sorting', 'Interval Properties', 'Coordinate Geometry'],
    tags: ['Interval Overlaps', 'Sweep Line', 'Meeting Rooms', 'Event Points'],
    companiesTop: ['Google', 'Amazon', 'Salesforce', 'Uber'],
  },
  {
    id: 'heap-top-k',
    slug: 'heap-top-k',
    title: 'Heap / Top K',
    shortDescription: 'Use priority queues to efficiently find top K elements and dynamically maintain order.',
    level: 'Intermediate',
    availability: 'available',
    category: 'Heaps & Priority Queues',
    questionCount: 11,
    subpatternCount: 3,
    prerequisites: ['Binary Heaps', 'Complete Binary Trees', 'Priority Queues'],
    tags: ['Min-Heap', 'Max-Heap', 'Top K Elements', 'Streaming'],
    companiesTop: ['Amazon', 'Microsoft', 'Meta', 'Twitter'],
  },
  {
    id: 'tree-dfs',
    slug: 'tree-dfs',
    title: 'Tree DFS',
    shortDescription: 'Traverse and compute properties of hierarchical trees using recursion and preorder/inorder/postorder.',
    level: 'Intermediate',
    availability: 'available',
    category: 'Trees & Recursion',
    questionCount: 12,
    subpatternCount: 3,
    prerequisites: ['Binary Trees', 'Recursion', 'Call Stack Frames'],
    tags: ['Recursion', 'Binary Trees', 'Backtracking Paths', 'Depth-First'],
    companiesTop: ['Amazon', 'Meta', 'Microsoft', 'Google'],
  },
  {
    id: 'tree-bfs',
    slug: 'tree-bfs',
    title: 'Tree BFS',
    shortDescription: 'Traverse trees level-by-level using queues to solve shortest path and level-order problems.',
    level: 'Intermediate',
    availability: 'available',
    category: 'Trees & Queues',
    questionCount: 10,
    subpatternCount: 3,
    prerequisites: ['Binary Trees', 'FIFO Queues', 'Level-Order Traversal'],
    tags: ['Level Order', 'Queues', 'Shortest Path', 'Breadth-First'],
    companiesTop: ['Amazon', 'Bloomberg', 'Microsoft', 'LinkedIn'],
  },
  {
    id: 'graph-traversal',
    slug: 'graph-traversal',
    title: 'Graph Traversal (DFS/BFS)',
    shortDescription: 'Explore interconnected networks, detect cycles, and find connected components.',
    level: 'Intermediate',
    availability: 'available',
    category: 'Graphs',
    questionCount: 12,
    subpatternCount: 3,
    prerequisites: ['Adjacency Lists', 'Visited Sets', 'Queue/Stack Discipline'],
    tags: ['Adjacency Lists', 'Visited Sets', 'Island Problems', 'Connected Components'],
    companiesTop: ['Amazon', 'Google', 'Meta', 'Uber'],
  },
  {
    id: 'topological-sort',
    slug: 'topological-sort',
    title: 'Topological Sort',
    shortDescription: 'Order vertices linearly in Directed Acyclic Graphs (DAG) to resolve dependencies and prerequisites.',
    level: 'Intermediate',
    availability: 'available',
    category: 'Graphs & DAGs',
    questionCount: 9,
    subpatternCount: 2,
    prerequisites: ['Directed Graphs', 'In-Degrees', "Kahn's Algorithm"],
    tags: ["Kahn's Algorithm", 'In-degree', 'Course Schedule', 'DAG'],
    companiesTop: ['Amazon', 'Microsoft', 'Google', 'DoorDash'],
  },

  // Advanced (5)
  {
    id: 'union-find',
    slug: 'union-find',
    title: 'Union Find (Disjoint Set)',
    shortDescription: 'Maintain partition of a set into disjoint subsets for fast dynamic connectivity and cycle detection.',
    level: 'Advanced',
    availability: 'available',
    category: 'Graphs & Disjoint Sets',
    questionCount: 10,
    subpatternCount: 3,
    prerequisites: ['Equivalence Relations', 'Trees', 'Amortized Complexity'],
    tags: ['Path Compression', 'Rank Union', 'Connected Components', 'Disjoint Set'],
    companiesTop: ['Google', 'Amazon', 'Meta', 'Apple'],
  },
  {
    id: 'backtracking',
    slug: 'backtracking',
    title: 'Backtracking',
    shortDescription: 'Explore combinatorial decision trees incrementally, abandoning paths that fail constraints.',
    level: 'Advanced',
    availability: 'available',
    category: 'Recursion & Combinatorics',
    questionCount: 12,
    subpatternCount: 3,
    prerequisites: ['Recursion', 'Decision Trees', 'State Invariants'],
    tags: ['Permutations', 'Subsets', 'Pruning', 'N-Queens'],
    companiesTop: ['Amazon', 'Google', 'Microsoft', 'Meta'],
  },
  {
    id: 'greedy-algorithms',
    slug: 'greedy-algorithms',
    title: 'Greedy Algorithms',
    shortDescription: 'Construct optimal solutions step-by-step by making the locally optimal choice at each stage.',
    level: 'Advanced',
    availability: 'available',
    category: 'Optimization & Sorting',
    questionCount: 12,
    subpatternCount: 3,
    prerequisites: ['Sorting', 'Mathematical Induction', 'Exchange Arguments'],
    tags: ['Local Optimum', 'Activity Selection', 'Gas Station', 'Greedy Choice'],
    companiesTop: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
  },
  {
    id: 'dynamic-programming',
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    shortDescription: 'Break complex problems into overlapping subproblems with optimal substructure via memoization and tabulation.',
    level: 'Advanced',
    availability: 'available',
    category: 'Optimization & DP',
    questionCount: 12,
    subpatternCount: 4,
    prerequisites: ['Recursion', 'Memoization', 'State Transitions', 'Bellman Optimality'],
    tags: ['Memoization', 'Tabulation', 'Knapsack', 'State Transitions', 'Subproblems'],
    companiesTop: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Goldman Sachs'],
  },
  {
    id: 'bit-manipulation',
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    shortDescription: 'Manipulate individual bits directly using bitwise operators for high-speed algorithmic shortcuts.',
    level: 'Advanced',
    availability: 'available',
    category: 'Bitwise & Math',
    questionCount: 12,
    subpatternCount: 3,
    prerequisites: ['Binary Representation', "Two's Complement", 'Bitwise Operators'],
    tags: ['Bitwise XOR', 'Masking', 'Bit Shifting', 'Two Complement', 'Bit Tricks'],
    companiesTop: ['Amazon', 'Google', 'Apple', 'Meta'],
  },
];

export const SLIDING_WINDOW_MAPPINGS: PatternQuestionMapping[] = [
  // Subcategory 1: Fixed-Size Window
  {
    questionId: 643,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['arrays'],
    subpattern: 'fixed-window',
    subpatternLabel: 'Fixed-Size Window',
    learningOrder: 1,
    reviewStatus: 'verified',
  },
  {
    questionId: 1456,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['strings'],
    subpattern: 'fixed-window',
    subpatternLabel: 'Fixed-Size Window',
    learningOrder: 2,
    reviewStatus: 'verified',
  },
  {
    questionId: 2090,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['prefix-sum'],
    subpattern: 'fixed-window',
    subpatternLabel: 'Fixed-Size Window',
    learningOrder: 3,
    reviewStatus: 'verified',
  },
  {
    questionId: 1423,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['prefix-sum'],
    subpattern: 'fixed-window',
    subpatternLabel: 'Fixed-Size Window',
    learningOrder: 4,
    reviewStatus: 'verified',
  },

  // Subcategory 2: Variable-Size Window
  {
    questionId: 3,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['hash-table', 'two-pointers'],
    subpattern: 'variable-window',
    subpatternLabel: 'Variable-Size Window',
    learningOrder: 5,
    reviewStatus: 'verified',
  },
  {
    questionId: 209,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['binary-search', 'prefix-sum'],
    subpattern: 'variable-window',
    subpatternLabel: 'Variable-Size Window',
    learningOrder: 6,
    reviewStatus: 'verified',
  },
  {
    questionId: 1004,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['two-pointers', 'binary-search'],
    subpattern: 'variable-window',
    subpatternLabel: 'Variable-Size Window',
    learningOrder: 7,
    reviewStatus: 'verified',
  },
  {
    questionId: 1208,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['binary-search', 'prefix-sum'],
    subpattern: 'variable-window',
    subpatternLabel: 'Variable-Size Window',
    learningOrder: 8,
    reviewStatus: 'verified',
  },

  // Subcategory 3: Frequency / Character Counts
  {
    questionId: 904,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['hash-table'],
    subpattern: 'frequency-window',
    subpatternLabel: 'Frequency & Character Counts',
    learningOrder: 9,
    reviewStatus: 'verified',
  },
  {
    questionId: 424,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['hash-table', 'two-pointers'],
    subpattern: 'frequency-window',
    subpatternLabel: 'Frequency & Character Counts',
    learningOrder: 10,
    reviewStatus: 'verified',
  },
  {
    questionId: 567,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['two-pointers', 'hash-table'],
    subpattern: 'frequency-window',
    subpatternLabel: 'Frequency & Character Counts',
    learningOrder: 11,
    reviewStatus: 'verified',
  },
  {
    questionId: 438,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['hash-table'],
    subpattern: 'frequency-window',
    subpatternLabel: 'Frequency & Character Counts',
    learningOrder: 12,
    reviewStatus: 'verified',
  },

  // Subcategory 4: Advanced / Monotonic Deque
  {
    questionId: 76,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['hash-table', 'two-pointers'],
    subpattern: 'advanced-window',
    subpatternLabel: 'Advanced / Multi-Condition',
    learningOrder: 13,
    reviewStatus: 'verified',
  },
  {
    questionId: 239,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['queue', 'monotonic-queue', 'heap'],
    subpattern: 'advanced-window',
    subpatternLabel: 'Advanced / Multi-Condition',
    learningOrder: 14,
    reviewStatus: 'verified',
  },
  {
    questionId: 1838,
    primaryPattern: 'sliding-window',
    secondaryPatterns: ['sorting', 'two-pointers', 'prefix-sum'],
    subpattern: 'advanced-window',
    subpatternLabel: 'Advanced / Multi-Condition',
    learningOrder: 15,
    reviewStatus: 'verified',
  },
];

export function joinPatternQuestions(
  mappings: PatternQuestionMapping[],
  catalog?: GlobalQuestion[] | null
): PatternQuestion[] {
  const catalogMap = new Map<number, GlobalQuestion>();
  if (catalog && Array.isArray(catalog)) {
    for (const q of catalog) {
      catalogMap.set(q.id, q);
    }
  }

  return mappings.map(m => {
    const cq = catalogMap.get(m.questionId);
    if (cq) {
      return {
        id: cq.id,
        title: cq.title,
        difficulty: cq.difficulty,
        acceptance: cq.acceptance || '—',
        link: cq.link || `https://leetcode.com/problems/${cq.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`,
        companies: cq.companySlugs || [],
        companySlugs: cq.companySlugs || [],
        companyCount: cq.companyCount ?? (cq.companySlugs ? cq.companySlugs.length : 0),
        frequency: cq.frequency,
        subpattern: m.subpattern,
        subpatternLabel: m.subpatternLabel,
        learningOrder: m.learningOrder,
        reviewStatus: m.reviewStatus,
        isCatalogAvailable: true,
      };
    }

    // When question is not found in the catalog (or catalog not yet loaded):
    // Preserve authentic pattern mapping info and indicate unavailable catalog state.
    // NEVER invent fake titles, difficulties, acceptance rates, companies, or frequencies!
    return {
      id: m.questionId,
      title: `Problem #${m.questionId}`,
      difficulty: undefined,
      acceptance: '—',
      link: `https://leetcode.com/problemset/all/?search=${m.questionId}`,
      companies: [],
      companySlugs: [],
      companyCount: 0,
      frequency: undefined,
      subpattern: m.subpattern,
      subpatternLabel: m.subpatternLabel,
      learningOrder: m.learningOrder,
      reviewStatus: m.reviewStatus,
      isCatalogAvailable: false,
    };
  });
}

export const SLIDING_WINDOW_QUESTIONS: PatternQuestion[] = joinPatternQuestions(SLIDING_WINDOW_MAPPINGS);

export const VISUALIZER_ARRAY = [1, 12, -5, -6, 50, 3];
export const VISUALIZER_WINDOW_SIZE = 4;

export const VISUALIZER_STEPS: VisualizerStep[] = generateSlidingWindowSteps(
  VISUALIZER_ARRAY,
  VISUALIZER_WINDOW_SIZE
);

export const SLIDING_WINDOW_QUIZ: QuizQuestion[] = [
  {
    id: 'sw-q1',
    question: 'What is the primary advantage of the Sliding Window technique over a brute force approach for contiguous subarrays?',
    options: [
      {
        id: 'opt-a',
        text: 'It sorts the elements to achieve logarithmic search time.',
      },
      {
        id: 'opt-b',
        text: 'It reuses overlapping computation between adjacent windows, reducing time complexity from O(N × K) or O(N²) to O(N).',
      },
      {
        id: 'opt-c',
        text: 'It allows examining non-contiguous subsequences without allocating extra memory.',
      },
      {
        id: 'opt-d',
        text: 'It converts recursive tree traversals into iterative stack structures.',
      },
    ],
    correctOptionId: 'opt-b',
    explanation: 'The fundamental intuition of Sliding Window is overlapping computation: as the window moves one position to the right, only two elements change (one leaves on the left, one enters on the right). By updating the state in O(1) instead of recalculating the entire window of size K, time complexity drops from O(N × K) to O(N).',
  },
  {
    id: 'sw-q2',
    question: 'In a fixed-size window of size K, when the loop index i moves to the right, how do you correctly maintain the rolling sum?',
    options: [
      {
        id: 'opt-a',
        text: 'Recompute sum(nums[i - K + 1 ... i]) with a nested loop.',
      },
      {
        id: 'opt-b',
        text: 'Subtract nums[i] and add nums[i - K].',
      },
      {
        id: 'opt-c',
        text: 'Add nums[i] (entering element) and subtract nums[i - K] (leaving element).',
      },
      {
        id: 'opt-d',
        text: 'Divide the sum by K and add nums[i].',
      },
    ],
    correctOptionId: 'opt-c',
    explanation: 'When moving from window [i - K, i - 1] to [i - K + 1, i], element nums[i - K] exits the left boundary, and element nums[i] enters the right boundary. Thus, new_sum = current_sum + nums[i] - nums[i - K]. This takes exactly O(1) operations.',
  },
  {
    id: 'sw-q3',
    question: 'When solving the "Minimum Size Subarray Sum" problem (LeetCode #209) with a variable-size sliding window, why must all array numbers be positive?',
    options: [
      {
        id: 'opt-a',
        text: 'Because negative numbers would cause division-by-zero errors in the average formula.',
      },
      {
        id: 'opt-b',
        text: 'Because positive numbers guarantee monotonicity: expanding the window always increases the sum, and shrinking always decreases it.',
      },
      {
        id: 'opt-c',
        text: 'Because JavaScript and Python cannot store negative integers inside hash maps.',
      },
      {
        id: 'opt-d',
        text: 'Because the pointers would move in opposite directions, causing infinite loops.',
      },
    ],
    correctOptionId: 'opt-b',
    explanation: 'The variable-size sliding window relies on monotonicity. When all values are positive (or non-negative), expanding right strictly increases or maintains the sum, while contracting left strictly decreases it. If negative numbers are present, shrinking could actually increase the sum, breaking the two-pointer invariant (in which case a prefix sum + monotonic deque or hash map is required instead).',
  },
  {
    id: 'sw-q4',
    question: 'What is the overall time complexity of a standard variable-size sliding window where the inner while loop contracts the left pointer?',
    options: [
      {
        id: 'opt-a',
        text: 'O(N²) because of the nested while loop inside the for loop.',
      },
      {
        id: 'opt-b',
        text: 'O(N log N) due to pointer comparisons.',
      },
      {
        id: 'opt-c',
        text: 'O(N) amortized because each pointer (left and right) visits each array index at most once.',
      },
      {
        id: 'opt-d',
        text: 'O(2^N) in the worst case when the window contracts repeatedly.',
      },
    ],
    correctOptionId: 'opt-c',
    explanation: 'Even though there is a nested while loop inside the outer loop, both the right pointer and the left pointer move only forward from 0 to N - 1. The right pointer increments N times, and across the entire execution of the algorithm, the left pointer also increments at most N times. Total pointer operations: 2N = O(N) amortized time.',
  },
];
