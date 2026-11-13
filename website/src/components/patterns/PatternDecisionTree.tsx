import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { PatternLevel } from '../../types/patterns';

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

export interface DecisionResult {
  patternSlug: string;
  patternTitle: string;
  level: PatternLevel;
  whyThisPattern: string;
  coreInvariant: string;
  whenItBreaks: string;
  breakAlternative?: {
    slug: string;
    title: string;
    reason: string;
  };
  sampleQuestion: {
    id: number;
    title: string;
    link: string;
  };
}

export interface QuickScenario {
  id: string;
  problemScenario: string;
  patternSlug: string;
  patternTitle: string;
  level: PatternLevel;
  decisionRule: string;
  whenItBreaks: string;
}

// 1. Input Shape definitions
const INPUT_OPTIONS: DecisionOption[] = [
  {
    id: 'array-string',
    label: 'Array or String',
    description: 'Sequenced contiguous or indexable items',
  },
  {
    id: 'linked-list',
    label: 'Linked List',
    description: 'Chained nodes with next / prev pointers',
  },
  {
    id: 'tree',
    label: 'Binary Tree or BST',
    description: 'Hierarchical node branching with no cycles',
  },
  {
    id: 'graph-grid',
    label: 'Graph or 2D Matrix',
    description: 'Arbitrary connectivity, grid paths, or networks',
  },
  {
    id: 'intervals',
    label: 'Intervals / Time Ranges',
    description: 'Pairs of [start, end] values or calendar blocks',
  },
  {
    id: 'numeric-bits',
    label: 'Numbers or Bitwise',
    description: 'Math properties, integer ranges, or bit manipulation',
  },
];

// 2. Goal definitions keyed by input
const GOAL_OPTIONS: Record<string, DecisionOption[]> = {
  'array-string': [
    {
      id: 'contiguous-subarray',
      label: 'Contiguous Subarray / Substring',
      description: 'Find optimal, fixed, or target-bounded slice',
    },
    {
      id: 'pair-triplet',
      label: 'Pair or Triplet Matching',
      description: 'Find 2 or 3 elements that satisfy a sum/target',
    },
    {
      id: 'next-greater-bound',
      label: 'Next Greater or Bounding Element',
      description: 'Nearest element greater/smaller than current',
    },
    {
      id: 'optimization-dp',
      label: 'Optimal Substructure / Maximize-Minimize',
      description: 'Count total ways, min cost, or longest subsequence',
    },
    {
      id: 'exhaustive-generation',
      label: 'Generate All Subsets or Permutations',
      description: 'Enumerate all combinatorial solutions',
    },
    {
      id: 'search-in-range',
      label: 'Find Boundary in Monotonic Space',
      description: 'Target lookup or minimum feasible threshold',
    },
  ],
  'linked-list': [
    {
      id: 'cycle-midpoint',
      label: 'Cycle Detection or Midpoint',
      description: 'Find loop start, middle node with O(1) space',
    },
    {
      id: 'reversal-partition',
      label: 'In-place Pointer Rewiring',
      description: 'Reverse subsegment or merge sorted lists',
    },
  ],
  'tree': [
    {
      id: 'tree-depth-path',
      label: 'Maximum Depth / Path Sum / Ancestry',
      description: 'Explore root-to-leaf or subtree aggregations',
    },
    {
      id: 'tree-level-order',
      label: 'Level-by-Level or Width Traversal',
      description: 'Process nodes by horizontal tier / depth order',
    },
  ],
  'graph-grid': [
    {
      id: 'shortest-path-unweighted',
      label: 'Shortest Path / Flood Fill',
      description: 'Fewest steps or connected island components',
    },
    {
      id: 'dependency-ordering',
      label: 'Course / Task Prerequisites',
      description: 'Order nodes respecting dependencies (DAG)',
    },
    {
      id: 'dynamic-connectivity',
      label: 'Dynamic Connected Components',
      description: 'Track connected clusters as edges are added',
    },
  ],
  'intervals': [
    {
      id: 'interval-merge',
      label: 'Merge Overlapping or Schedule Rooms',
      description: 'Consolidate spans or find peak concurrent intervals',
    },
  ],
  'numeric-bits': [
    {
      id: 'unique-cancellation',
      label: 'Find Unique Number / Bit Counting',
      description: 'Isolate single element using XOR or bit flags',
    },
    {
      id: 'binary-search-answer',
      label: 'Minimize Maximum Feasible Value',
      description: 'Binary search on the continuous answer space',
    },
  ],
};

// 3. Constraint definitions keyed by input + goal
const CONSTRAINT_OPTIONS: Record<string, DecisionOption[]> = {
  'array-string:contiguous-subarray': [
    {
      id: 'all-positive-monotonic',
      label: 'All positive numbers (Monotonic sum)',
      description: 'Expanding right always increases sum; shrinking left decreases it',
    },
    {
      id: 'negative-numbers-allowed',
      label: 'Negative numbers allowed (Non-monotonic)',
      description: 'Expanding right may decrease sum; monotonicity is broken',
    },
  ],
  'array-string:pair-triplet': [
    {
      id: 'sorted-or-sortable',
      label: 'Array is sorted (or sorting is allowed in O(N log N))',
      description: 'Values have monotonic order; two pointers can converge',
    },
    {
      id: 'unsorted-linear-required',
      label: 'Array is unsorted and strict O(N) time required',
      description: 'Order cannot be altered or sorting is too slow',
    },
  ],
  'array-string:next-greater-bound': [
    {
      id: 'nearest-linear-sweep',
      label: 'Looking for nearest previous or next dominant element',
      description: 'Comparison depends on immediate sequential neighbors',
    },
  ],
  'array-string:optimization-dp': [
    {
      id: 'overlapping-subproblems',
      label: 'State depends on previous overlapping choices',
      description: 'Subproblems repeat (e.g. coin change, knapsack)',
    },
    {
      id: 'exchange-greedy-works',
      label: 'Local optimum is provably global optimum',
      description: 'You never have to reconsider a past decision',
    },
  ],
  'array-string:exhaustive-generation': [
    {
      id: 'need-all-combinations',
      label: 'Must construct all valid arrangements/subsets',
      description: 'Output is the full list of combinations',
    },
  ],
  'array-string:search-in-range': [
    {
      id: 'monotonic-predicate',
      label: 'Evaluation predicate is monotonic (TTT...FFF or FFF...TTT)',
      description: 'Can eliminate half the remaining search space each check',
    },
  ],
  'linked-list:cycle-midpoint': [
    {
      id: 'constant-space-required',
      label: 'O(1) auxiliary space strictly required',
      description: 'Cannot allocate a visited HashSet',
    },
  ],
  'linked-list:reversal-partition': [
    {
      id: 'in-place-rewiring',
      label: 'Rewire next pointers directly in-place',
      description: 'Maintain prev, curr, and next pointers during sweep',
    },
  ],
  'tree:tree-depth-path': [
    {
      id: 'post-order-bottom-up',
      label: 'Result of root requires left and right subtree results',
      description: 'Recursive bottom-up post-order DFS',
    },
  ],
  'tree:tree-level-order': [
    {
      id: 'fifo-queue-snapshot',
      label: 'Inspect nodes level-by-level horizontally',
      description: 'Queue length snapshots current tier',
    },
  ],
  'graph-grid:shortest-path-unweighted': [
    {
      id: 'unweighted-edges',
      label: 'All edge weights are uniform (1 step = 1 unit)',
      description: 'Queue naturally visits in increasing distance order',
    },
  ],
  'graph-grid:dependency-ordering': [
    {
      id: 'directed-acyclic-graph',
      label: 'Directed graph with prerequisite dependencies (DAG)',
      description: 'Kahn in-degree reduction or post-order DFS',
    },
  ],
  'graph-grid:dynamic-connectivity': [
    {
      id: 'incremental-edge-additions',
      label: 'Graph components merge dynamically edge-by-edge',
      description: 'Need fast connected(u, v) and union(u, v)',
    },
  ],
  'intervals:interval-merge': [
    {
      id: 'sort-by-start-sweep',
      label: 'Can sort intervals chronologically by start time',
      description: 'Overlaps occur only when curr.start <= prev.end',
    },
  ],
  'numeric-bits:unique-cancellation': [
    {
      id: 'xor-even-occurrences',
      label: 'Every element appears twice except for one unique element',
      description: 'XOR self-cancellation collapses identical pairs to 0',
    },
  ],
  'numeric-bits:binary-search-answer': [
    {
      id: 'feasibility-is-monotonic',
      label: 'Feasibility function isMonotonic(threshold) can be evaluated in O(N)',
      description: 'Binary search over [minPossible, maxPossible]',
    },
  ],
};

// Result mapping table
const DECISION_RESULTS: Record<string, DecisionResult> = {
  'array-string:contiguous-subarray:all-positive-monotonic': {
    patternSlug: 'sliding-window',
    patternTitle: 'Sliding Window',
    level: 'Foundation',
    whyThisPattern:
      'Because all elements are positive, expanding the right pointer monotonically increases window sum, and shrinking the left pointer decreases it. This allows finding the optimal window in O(N) total time.',
    coreInvariant:
      'The window [L, R] represents the current valid state; both pointers sweep from left to right at most N times.',
    whenItBreaks:
      '⚠️ If numbers can be negative, expanding R does NOT guarantee a larger sum. Monotonicity collapses!',
    breakAlternative: {
      slug: 'prefix-sum',
      title: 'Prefix Sum + Hash Map',
      reason: 'Use running prefix sums and a map to look up (sum - k) in O(1) regardless of signs.',
    },
    sampleQuestion: {
      id: 209,
      title: 'Minimum Size Subarray Sum',
      link: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
    },
  },
  'array-string:contiguous-subarray:negative-numbers-allowed': {
    patternSlug: 'prefix-sum',
    patternTitle: 'Prefix Sum',
    level: 'Foundation',
    whyThisPattern:
      'Negative numbers destroy the monotonic property of sliding windows. Using a Prefix Sum Hash Map, any subarray sum(i, j) = prefix[j] - prefix[i-1] = k <=> prefix[i-1] = prefix[j] - k, solvable in O(N) time with O(1) lookups.',
    coreInvariant:
      'prefix[i] stores the cumulative sum up to index i; map records the historical count or first occurrence of prefix sums.',
    whenItBreaks:
      '⚠️ If the array undergoes frequent updates or modifications, recalculating prefix sum takes O(N) per update. Use Fenwick or Segment Tree.',
    breakAlternative: {
      slug: 'sliding-window',
      title: 'Sliding Window',
      reason: 'Only switch back to sliding window if all array elements are strictly non-negative.',
    },
    sampleQuestion: {
      id: 560,
      title: 'Subarray Sum Equals K',
      link: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    },
  },
  'array-string:pair-triplet:sorted-or-sortable': {
    patternSlug: 'two-pointers',
    patternTitle: 'Two Pointers',
    level: 'Foundation',
    whyThisPattern:
      'Sorted boundaries give directional monotonicity. If sum < target, left pointer must advance; if sum > target, right pointer must retreat. Eliminates entire candidate search spaces in O(N) with O(1) auxiliary space.',
    coreInvariant:
      'The optimal pair is guaranteed to exist within the active search window [left, right].',
    whenItBreaks:
      '⚠️ If the array cannot be sorted (e.g. original index preservation required in strictly O(N) time), Two Pointers fails.',
    breakAlternative: {
      slug: 'hashing-and-frequency-counting',
      title: 'Hashing & Frequency Counting',
      reason: 'Hash map stores elements seen so far for O(1) complement lookup without altering order.',
    },
    sampleQuestion: {
      id: 167,
      title: 'Two Sum II - Input Array Is Sorted',
      link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    },
  },
  'array-string:pair-triplet:unsorted-linear-required': {
    patternSlug: 'hashing-and-frequency-counting',
    patternTitle: 'Hashing & Frequency Counting',
    level: 'Foundation',
    whyThisPattern:
      'Converts an O(N^2) brute-force pair search into an O(N) single-pass lookup table. For each element x, query if (target - x) is in the Hash Map in O(1) amortized time.',
    coreInvariant:
      'Map stores {value: index} for all elements strictly preceding the current index i.',
    whenItBreaks:
      '⚠️ If auxiliary space is strictly bounded to O(1) memory, hash tables cannot be allocated. Sort in-place first and use Two Pointers.',
    breakAlternative: {
      slug: 'two-pointers',
      title: 'Two Pointers',
      reason: 'In-place sorting achieves O(1) extra space with O(N log N) runtime.',
    },
    sampleQuestion: {
      id: 1,
      title: 'Two Sum',
      link: 'https://leetcode.com/problems/two-sum/',
    },
  },
  'array-string:next-greater-bound:nearest-linear-sweep': {
    patternSlug: 'stack-and-monotonic-stack',
    patternTitle: 'Stack & Monotonic Stack',
    level: 'Intermediate',
    whyThisPattern:
      'Maintains indices in strictly monotonic order. When an incoming element violates the order, all dominated smaller elements on top of the stack are popped and their next greater element is resolved in O(1) amortized time.',
    coreInvariant:
      'Elements remaining on the stack are in strictly sorted order waiting for their boundary element.',
    whenItBreaks:
      '⚠️ Fails if queries ask for arbitrary range minimums/maximums over dynamic ranges (use Segment Tree).',
    sampleQuestion: {
      id: 739,
      title: 'Daily Temperatures',
      link: 'https://leetcode.com/problems/daily-temperatures/',
    },
  },
  'array-string:optimization-dp:overlapping-subproblems': {
    patternSlug: 'dynamic-programming',
    patternTitle: 'Dynamic Programming',
    level: 'Advanced',
    whyThisPattern:
      'The problem exhibits both optimal substructure and overlapping subproblems. Optimal solution for state N reuses precomputed optimal solutions for smaller subproblems, collapsing exponential time to polynomial time.',
    coreInvariant:
      'dp[state] represents the mathematically verified optimal value for that exact subproblem.',
    whenItBreaks:
      '⚠️ If the local optimal choice is mathematically proven to always be globally optimal without needing subproblem search, DP is wasteful over-engineering.',
    breakAlternative: {
      slug: 'greedy-algorithms',
      title: 'Greedy Algorithms',
      reason: 'Exchange argument proves local best choice leads directly to global optimum.',
    },
    sampleQuestion: {
      id: 322,
      title: 'Coin Change',
      link: 'https://leetcode.com/problems/coin-change/',
    },
  },
  'array-string:optimization-dp:exchange-greedy-works': {
    patternSlug: 'greedy-algorithms',
    patternTitle: 'Greedy Algorithms',
    level: 'Advanced',
    whyThisPattern:
      'By mathematical induction or exchange arguments, committing to the locally best choice at each step never locks you out of the global optimum. Avoids DP tables or backtracking exploration.',
    coreInvariant:
      'The current greedy choice preserves feasibility and reaches the maximum possible reach or profit.',
    whenItBreaks:
      '⚠️ Greedy fails if choosing a locally tempting item blocks an overall better combination later (e.g. 0/1 Knapsack, Coin Change with arbitrary denominations).',
    breakAlternative: {
      slug: 'dynamic-programming',
      title: 'Dynamic Programming',
      reason: 'DP evaluates all overlapping state combinations rather than betting on local greed.',
    },
    sampleQuestion: {
      id: 55,
      title: 'Jump Game',
      link: 'https://leetcode.com/problems/jump-game/',
    },
  },
  'array-string:exhaustive-generation:need-all-combinations': {
    patternSlug: 'backtracking',
    patternTitle: 'Backtracking',
    level: 'Intermediate',
    whyThisPattern:
      'Systematically explores the combinatorial decision tree: Choose an element, Recursively explore down the branch, and Un-choose (revert state) before the next sibling. Traverses exponential search spaces with O(depth) memory.',
    coreInvariant:
      'The active path contains the exact prefix of choices made from the root of the decision tree.',
    whenItBreaks:
      '⚠️ Backtracking takes O(2^N) or O(N!) time. If the question only asks for the COUNT of solutions or the MIN/MAX cost rather than printing all paths, use Dynamic Programming!',
    breakAlternative: {
      slug: 'dynamic-programming',
      title: 'Dynamic Programming',
      reason: 'DP computes counts or optimal values in O(N^2) or O(N) without printing combinations.',
    },
    sampleQuestion: {
      id: 46,
      title: 'Permutations',
      link: 'https://leetcode.com/problems/permutations/',
    },
  },
  'array-string:search-in-range:monotonic-predicate': {
    patternSlug: 'binary-search',
    patternTitle: 'Binary Search',
    level: 'Foundation',
    whyThisPattern:
      'Whenever the search space has monotonic order (or a feasibility function isMonotonic(x) transitions from False to True once), binary search discards half the candidate range per step in O(log N).',
    coreInvariant:
      'The optimal target is guaranteed to lie within the inclusive bounds [low, high].',
    whenItBreaks:
      '⚠️ If the array is unsorted or the feasibility condition is not monotonic, binary search cannot discard halves.',
    sampleQuestion: {
      id: 875,
      title: 'Koko Eating Bananas',
      link: 'https://leetcode.com/problems/koko-eating-bananas/',
    },
  },
  'linked-list:cycle-midpoint:constant-space-required': {
    patternSlug: 'fast-and-slow-pointers',
    patternTitle: 'Fast & Slow Pointers',
    level: 'Foundation',
    whyThisPattern:
      'Floyd Tortoise and Hare algorithm advances fast pointer by 2 and slow pointer by 1. In a cycle of length C, the relative distance between them shrinks by 1 each step, guaranteeing detection in O(N) time with O(1) space.',
    coreInvariant:
      'If a cycle exists, fast meets slow inside the loop in <= C steps; otherwise fast hits null.',
    whenItBreaks:
      '⚠️ Fails on general graphs where nodes have multiple branching edges (requires BFS/DFS visited set).',
    sampleQuestion: {
      id: 141,
      title: 'Linked List Cycle',
      link: 'https://leetcode.com/problems/linked-list-cycle/',
    },
  },
  'linked-list:reversal-partition:in-place-rewiring': {
    patternSlug: 'two-pointers',
    patternTitle: 'Two Pointers (Linked List Manipulation)',
    level: 'Foundation',
    whyThisPattern:
      'Iterative pointer manipulation using `prev`, `curr`, and `next` rewires node links in single O(N) pass without extra node allocations.',
    coreInvariant:
      'Sublist before `curr` is completely reversed; `next` preserves forward traverse access.',
    whenItBreaks:
      '⚠️ Recursive approaches risk StackOverflow for lists exceeding 10,000 nodes; use iterative rewiring.',
    sampleQuestion: {
      id: 206,
      title: 'Reverse Linked List',
      link: 'https://leetcode.com/problems/reverse-linked-list/',
    },
  },
  'tree:tree-depth-path:post-order-bottom-up': {
    patternSlug: 'tree-dfs',
    patternTitle: 'Tree DFS',
    level: 'Intermediate',
    whyThisPattern:
      'Post-order DFS computes subproblem answers from left and right subtrees first, then combines them at the current node. Naturally handles path sums, diameters, and subtree validations.',
    coreInvariant:
      'dfs(node) returns the optimal single-branch contribution upwards, while updating the global maximum across apexes.',
    whenItBreaks:
      '⚠️ If problem requires traversing layer-by-layer or finding the shortest distance in an unweighted tree, switch to BFS.',
    sampleQuestion: {
      id: 124,
      title: 'Binary Tree Maximum Path Sum',
      link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
    },
  },
  'tree:tree-level-order:fifo-queue-snapshot': {
    patternSlug: 'tree-bfs',
    patternTitle: 'Tree BFS (Level-Order Traversal)',
    level: 'Intermediate',
    whyThisPattern:
      'Using a FIFO queue where `levelSize = queue.length` is snapshotted at each loop iteration processes all nodes at depth d before moving to depth d+1.',
    coreInvariant:
      'All nodes currently dequeued within the inner loop belong to the exact same depth level.',
    whenItBreaks:
      '⚠️ Requires O(W) auxiliary memory where W is maximum tree width. For very deep degenerate trees, recursion uses O(H) stack.',
    sampleQuestion: {
      id: 102,
      title: 'Binary Tree Level Order Traversal',
      link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    },
  },
  'graph-grid:shortest-path-unweighted:unweighted-edges': {
    patternSlug: 'graph-traversal',
    patternTitle: 'Graph Traversal (BFS)',
    level: 'Intermediate',
    whyThisPattern:
      'Because every edge or step has uniform weight 1, standard queue BFS guarantees visiting nodes in non-decreasing order of distance. The first time target is reached, that path is provably shortest.',
    coreInvariant:
      'Nodes enqueued in wave k are at distance k from source; no shorter path to them can exist.',
    whenItBreaks:
      '⚠️ If edges have non-negative varying weights, standard BFS does NOT guarantee shortest path. Switch to Dijkstra with Min-Heap!',
    sampleQuestion: {
      id: 994,
      title: 'Rotting Oranges',
      link: 'https://leetcode.com/problems/rotting-oranges/',
    },
  },
  'graph-grid:dependency-ordering:directed-acyclic-graph': {
    patternSlug: 'topological-sort',
    patternTitle: 'Topological Sort',
    level: 'Intermediate',
    whyThisPattern:
      "Kahn's Algorithm tracks in-degrees of all nodes. Enqueue nodes with in-degree 0. As each finishes, decrement downstream neighbors' in-degrees. Detects cycles if processed count < total vertices.",
    coreInvariant:
      'Nodes are emitted only when all their prerequisite dependencies have been completely resolved.',
    whenItBreaks:
      '⚠️ Graph must be directed and acyclic. If an undirected graph is passed, in-degrees are symmetric and topological order is undefined.',
    sampleQuestion: {
      id: 207,
      title: 'Course Schedule',
      link: 'https://leetcode.com/problems/course-schedule/',
    },
  },
  'graph-grid:dynamic-connectivity:incremental-edge-additions': {
    patternSlug: 'union-find',
    patternTitle: 'Union Find',
    level: 'Advanced',
    whyThisPattern:
      'Disjoint Set Union (DSU) with path compression and union by rank provides near O(1) amortized connectivity checks (inverse Ackermann alpha(N)) as edges arrive dynamically.',
    coreInvariant:
      'find(u) === find(v) if and only if u and v belong to the exact same connected component.',
    whenItBreaks:
      '⚠️ Standard Union-Find cannot efficiently handle edge deletions or directed path reachability.',
    sampleQuestion: {
      id: 684,
      title: 'Redundant Connection',
      link: 'https://leetcode.com/problems/redundant-connection/',
    },
  },
  'intervals:interval-merge:sort-by-start-sweep': {
    patternSlug: 'intervals-and-sweep-line',
    patternTitle: 'Intervals & Sweep Line',
    level: 'Intermediate',
    whyThisPattern:
      'Sorting intervals chronologically by start time eliminates temporal ambiguity. Two consecutive intervals [s1, e1] and [s2, e2] overlap if and only if s2 <= e1.',
    coreInvariant:
      'Intervals are sorted by start time: curr.start >= prev.start. If curr.start <= prev.end, merge into [prev.start, max(prev.end, curr.end)].',
    whenItBreaks:
      '⚠️ If intervals have multi-dimensional coordinates (e.g. 2D rectangles), 1D timeline sweep does not directly apply.',
    sampleQuestion: {
      id: 56,
      title: 'Merge Intervals',
      link: 'https://leetcode.com/problems/merge-intervals/',
    },
  },
  'numeric-bits:unique-cancellation:xor-even-occurrences': {
    patternSlug: 'bit-manipulation',
    patternTitle: 'Bit Manipulation',
    level: 'Foundation',
    whyThisPattern:
      'XOR has two algebraic properties: x ^ x = 0 (self-cancellation) and x ^ 0 = x (identity). XORing all array elements together cancels out all pairs in O(N) time with strictly O(1) auxiliary space.',
    coreInvariant:
      'XOR is commutative and associative: the running XOR aggregate cancels all numbers with even frequency.',
    whenItBreaks:
      '⚠️ Fails if duplicate numbers appear an odd number of times (e.g., 3 times instead of 2).',
    sampleQuestion: {
      id: 136,
      title: 'Single Number',
      link: 'https://leetcode.com/problems/single-number/',
    },
  },
  'numeric-bits:binary-search-answer:feasibility-is-monotonic': {
    patternSlug: 'binary-search',
    patternTitle: 'Binary Search on Answer Space',
    level: 'Foundation',
    whyThisPattern:
      'When the question asks to "minimize the maximum X" or "find minimum feasible speed/capacity", evaluate feasibility with an O(N) checker function. Because feasibility is monotonic, binary search over the range [1, maxRange] takes O(N log(maxRange)).',
    coreInvariant:
      'Feasibility predicate isFeasible(k) transitions monotonically from False to True exactly once.',
    whenItBreaks:
      '⚠️ If the feasibility predicate oscillates non-monotonically, binary search cannot safely eliminate bounds.',
    sampleQuestion: {
      id: 875,
      title: 'Koko Eating Bananas',
      link: 'https://leetcode.com/problems/koko-eating-bananas/',
    },
  },
};

// Quick Decision Scenarios for direct browsing / quick cheat sheet
const QUICK_SCENARIOS: QuickScenario[] = [
  {
    id: 's1',
    problemScenario: 'Contiguous subarray with target sum & all positive numbers',
    patternSlug: 'sliding-window',
    patternTitle: 'Sliding Window',
    level: 'Foundation',
    decisionRule: 'All positive numbers guarantee sum increases monotonically as right pointer expands.',
    whenItBreaks: 'Negative numbers break sum monotonicity -> Switch to Prefix Sum + Hash Map.',
  },
  {
    id: 's2',
    problemScenario: 'Contiguous subarray with target sum & negative numbers allowed',
    patternSlug: 'prefix-sum',
    patternTitle: 'Prefix Sum',
    level: 'Foundation',
    decisionRule: 'sum(i, j) = prefix[j] - prefix[i-1] = k <=> prefix[i-1] = prefix[j] - k. O(1) hash map lookup.',
    whenItBreaks: 'If array elements are modified frequently in-place -> Switch to Fenwick/Segment Tree.',
  },
  {
    id: 's3',
    problemScenario: 'Find pair summing to target in sorted array',
    patternSlug: 'two-pointers',
    patternTitle: 'Two Pointers',
    level: 'Foundation',
    decisionRule: 'Sorted boundaries: sum < target => L++; sum > target => R--. O(1) memory.',
    whenItBreaks: 'If array is unsorted and sorting is forbidden or too slow -> Use Hash Map.',
  },
  {
    id: 's4',
    problemScenario: 'Find next greater / smaller element for each index',
    patternSlug: 'stack-and-monotonic-stack',
    patternTitle: 'Stack & Monotonic Stack',
    level: 'Intermediate',
    decisionRule: 'Monotonic stack preserves order; incoming element pops all dominated elements in amortized O(N).',
    whenItBreaks: 'If queries ask for dynamic range min/max across arbitrary intervals -> Use Segment Tree.',
  },
  {
    id: 's5',
    problemScenario: 'Shortest path in unweighted grid or network',
    patternSlug: 'graph-traversal',
    patternTitle: 'Graph Traversal (BFS)',
    level: 'Intermediate',
    decisionRule: 'Queue explores nodes layer-by-layer; first time destination is popped, shortest distance is known.',
    whenItBreaks: 'If edges have non-negative weights -> Switch to Dijkstra with Priority Queue.',
  },
  {
    id: 's6',
    problemScenario: 'Task scheduling with prerequisite order (DAG)',
    patternSlug: 'topological-sort',
    patternTitle: 'Topological Sort',
    level: 'Intermediate',
    decisionRule: "Kahn's in-degree queue pops vertices with 0 prerequisites and relaxes neighbors.",
    whenItBreaks: 'If graph has directed cycle -> In-degree never hits 0 (deadlock detection).',
  },
  {
    id: 's7',
    problemScenario: 'Detect cycle in linked list with O(1) space',
    patternSlug: 'fast-and-slow-pointers',
    patternTitle: 'Fast & Slow Pointers',
    level: 'Foundation',
    decisionRule: 'Fast advances by 2, slow by 1. Distance shrinks by 1 modulo cycle length each step.',
    whenItBreaks: 'General graphs with branching edges require visited set BFS/DFS.',
  },
  {
    id: 's8',
    problemScenario: 'Find single number where every other number appears twice',
    patternSlug: 'bit-manipulation',
    patternTitle: 'Bit Manipulation',
    level: 'Foundation',
    decisionRule: 'XOR self-cancellation: x ^ x = 0 and x ^ 0 = x. O(N) runtime with O(1) auxiliary space.',
    whenItBreaks: 'If numbers appear an odd count of times (e.g. 3 times) -> Bit count arrays needed.',
  },
  {
    id: 's9',
    problemScenario: 'Minimize maximum capacity / threshold satisfying condition',
    patternSlug: 'binary-search',
    patternTitle: 'Binary Search on Answer Space',
    level: 'Foundation',
    decisionRule: 'Feasibility function isMonotonic(k) transitions from False to True; binary search finds boundary in O(N log K).',
    whenItBreaks: 'If feasibility check is not monotonic, binary search cannot halve candidate intervals.',
  },
  {
    id: 's10',
    problemScenario: 'Count total ways or minimize cost with overlapping subproblems',
    patternSlug: 'dynamic-programming',
    patternTitle: 'Dynamic Programming',
    level: 'Advanced',
    decisionRule: 'Optimal subproblems repeat; memoize or tabulate state transitions.',
    whenItBreaks: 'If greedy choice provably reaches global optimum -> Switch to Greedy to avoid O(N^2) state space.',
  },
];

export default function PatternDecisionTree() {
  const [activeMode, setActiveMode] = useState<'diagnostic' | 'matrix'>('diagnostic');
  const [selectedInput, setSelectedInput] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedConstraint, setSelectedConstraint] = useState<string | null>(null);
  const [searchMatrix, setSearchMatrix] = useState('');

  // Reset decision flow
  const handleReset = () => {
    setSelectedInput(null);
    setSelectedGoal(null);
    setSelectedConstraint(null);
  };

  // Get available goals based on selected input
  const availableGoals = useMemo(() => {
    if (!selectedInput) return [];
    return GOAL_OPTIONS[selectedInput] || [];
  }, [selectedInput]);

  // Get available constraints based on selected input + goal
  const availableConstraints = useMemo(() => {
    if (!selectedInput || !selectedGoal) return [];
    const key = `${selectedInput}:${selectedGoal}`;
    return CONSTRAINT_OPTIONS[key] || [];
  }, [selectedInput, selectedGoal]);

  // Compute final diagnosis result
  const decisionResult: DecisionResult | null = useMemo(() => {
    if (!selectedInput || !selectedGoal || !selectedConstraint) return null;
    const key = `${selectedInput}:${selectedGoal}:${selectedConstraint}`;
    return DECISION_RESULTS[key] || null;
  }, [selectedInput, selectedGoal, selectedConstraint]);

  // Filtered matrix scenarios
  const filteredScenarios = useMemo(() => {
    const q = searchMatrix.toLowerCase().trim();
    if (!q) return QUICK_SCENARIOS;
    return QUICK_SCENARIOS.filter(
      s =>
        s.problemScenario.toLowerCase().includes(q) ||
        s.patternTitle.toLowerCase().includes(q) ||
        s.decisionRule.toLowerCase().includes(q) ||
        s.whenItBreaks.toLowerCase().includes(q)
    );
  }, [searchMatrix]);

  return (
    <div className="space-y-6">
      {/* Top Controller: Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F1B3D]/10 dark:bg-[#D97757]/15 border border-[#0F1B3D]/15 dark:border-[#D97757]/30 flex items-center justify-center text-[#0F1B3D] dark:text-[#D97757] shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
              30-Second Pattern Recognition Flowchart
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#A8A69C]">
              Identify the right pattern for unfamiliar problems in 3 constraint questions.
            </p>
          </div>
        </div>

        {/* Tab toggle: Diagnostic vs Cheat Sheet */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F]/70">
          <button
            type="button"
            onClick={() => setActiveMode('diagnostic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMode === 'diagnostic'
                ? 'bg-white dark:bg-[#30302E] text-slate-900 dark:text-[#FAF9F5] shadow-xs'
                : 'text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5]'
            }`}
          >
            Diagnostic Wizard
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeMode === 'matrix'
                ? 'bg-white dark:bg-[#30302E] text-slate-900 dark:text-[#FAF9F5] shadow-xs'
                : 'text-slate-600 dark:text-[#A8A69C] hover:text-slate-900 dark:hover:text-[#FAF9F5]'
            }`}
          >
            Pattern Decision Matrix ({QUICK_SCENARIOS.length})
          </button>
        </div>
      </div>

      {activeMode === 'diagnostic' ? (
        <div className="space-y-6">
          {/* Step Breadcrumb Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 Pill */}
            <div
              className={`p-3 rounded-xl border text-xs transition-all ${
                selectedInput
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white dark:bg-[#30302E] border-slate-200 dark:border-[#43433F] text-slate-700 dark:text-[#FAF9F5]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider opacity-75">
                  Step 1: Input Shape
                </span>
                {selectedInput && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <p className="font-bold text-slate-900 dark:text-[#FAF9F5] truncate">
                {selectedInput
                  ? INPUT_OPTIONS.find(o => o.id === selectedInput)?.label
                  : 'Select input structure...'}
              </p>
            </div>

            {/* Step 2 Pill */}
            <div
              className={`p-3 rounded-xl border text-xs transition-all ${
                selectedGoal
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : selectedInput
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-[#252422] border-slate-200 dark:border-[#383733] text-slate-400 dark:text-[#6C6A63] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider opacity-75">
                  Step 2: Target Goal
                </span>
                {selectedGoal && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <p className="font-bold text-slate-900 dark:text-[#FAF9F5] truncate">
                {selectedGoal
                  ? availableGoals.find(o => o.id === selectedGoal)?.label
                  : selectedInput
                  ? 'Select objective...'
                  : 'Awaiting Step 1'}
              </p>
            </div>

            {/* Step 3 Pill */}
            <div
              className={`p-3 rounded-xl border text-xs transition-all ${
                selectedConstraint
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : selectedGoal
                  ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300'
                  : 'bg-slate-50 dark:bg-[#252422] border-slate-200 dark:border-[#383733] text-slate-400 dark:text-[#6C6A63] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-[10px] uppercase tracking-wider opacity-75">
                  Step 3: Key Constraint
                </span>
                {selectedConstraint && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <p className="font-bold text-slate-900 dark:text-[#FAF9F5] truncate">
                {selectedConstraint
                  ? availableConstraints.find(o => o.id === selectedConstraint)?.label
                  : selectedGoal
                  ? 'Select constraint...'
                  : 'Awaiting Step 2'}
              </p>
            </div>
          </div>

          {/* Interactive Question Cards */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-2xs space-y-6">
            {/* Step 1: Input Shape */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0F1B3D] dark:bg-[#D97757] text-white dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                    What is the primary input data structure?
                  </h3>
                </div>
                {selectedInput && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {INPUT_OPTIONS.map(opt => {
                  const isSelected = selectedInput === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedInput(opt.id);
                        setSelectedGoal(null);
                        setSelectedConstraint(null);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F1B3D]/5 dark:bg-[#D97757]/15 border-[#0F1B3D] dark:border-[#D97757] shadow-xs'
                          : 'bg-slate-50/60 dark:bg-[#1F1E1D]/60 border-slate-200/80 dark:border-[#43433F]/70 hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900 dark:text-[#FAF9F5]">
                          {opt.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] mt-1 leading-snug">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Target Goal */}
            {selectedInput && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#43433F]/60 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0F1B3D] dark:bg-[#D97757] text-white dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                    What is the primary target objective or operation?
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {availableGoals.map(opt => {
                    const isSelected = selectedGoal === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedGoal(opt.id);
                          setSelectedConstraint(null);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F1B3D]/5 dark:bg-[#D97757]/15 border-[#0F1B3D] dark:border-[#D97757] shadow-xs'
                            : 'bg-slate-50/60 dark:bg-[#1F1E1D]/60 border-slate-200/80 dark:border-[#43433F]/70 hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-900 dark:text-[#FAF9F5]">
                            {opt.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] mt-1 leading-snug">
                          {opt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Key Constraint */}
            {selectedGoal && availableConstraints.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#43433F]/60 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0F1B3D] dark:bg-[#D97757] text-white dark:text-[#1F1E1D] font-mono text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                    Which key constraint or property governs the input?
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableConstraints.map(opt => {
                    const isSelected = selectedConstraint === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedConstraint(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F1B3D]/5 dark:bg-[#D97757]/15 border-[#0F1B3D] dark:border-[#D97757] shadow-xs'
                            : 'bg-slate-50/60 dark:bg-[#1F1E1D]/60 border-slate-200/80 dark:border-[#43433F]/70 hover:bg-slate-100 dark:hover:bg-[#1F1E1D]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-900 dark:text-[#FAF9F5]">
                            {opt.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#0F1B3D] dark:text-[#D97757]" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] mt-1 leading-snug">
                          {opt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Diagnosis Result Card */}
          {decisionResult && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white via-white to-amber-50/30 dark:from-[#30302E] dark:via-[#30302E] dark:to-[#2A241F] border border-amber-200 dark:border-amber-900/60 shadow-lg space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        Optimal Pattern Diagnosis
                      </span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-[#1F1E1D] dark:text-[#A8A69C]">
                        {decisionResult.level}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5] mt-1">
                      {decisionResult.patternTitle}
                    </h3>
                  </div>
                </div>

                <Link
                  to={`/patterns/${decisionResult.patternSlug}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shadow-xs"
                >
                  <span>Explore Track & Practice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Explanations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {/* Why This Technique */}
                <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] space-y-1">
                  <span className="font-bold text-slate-900 dark:text-[#FAF9F5] flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Why this technique dominates:
                  </span>
                  <p className="text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                    {decisionResult.whyThisPattern}
                  </p>
                </div>

                {/* Core Invariant */}
                <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#1F1E1D] border border-amber-200/80 dark:border-amber-900/50 space-y-1">
                  <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    The Loop / Algorithm Invariant:
                  </span>
                  <p className="text-slate-700 dark:text-[#E2DFD8] font-mono text-[11px] leading-relaxed">
                    {decisionResult.coreInvariant}
                  </p>
                </div>

                {/* When It Breaks & Anti-Signal */}
                <div className="md:col-span-2 p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
                  <span className="font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    When this pattern breaks (Interview Anti-Signal):
                  </span>
                  <p className="text-slate-700 dark:text-[#E2DFD8] leading-relaxed">
                    {decisionResult.whenItBreaks}
                  </p>
                  {decisionResult.breakAlternative && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-[#A8A69C]">
                        Fallback Alternative:
                      </span>
                      <Link
                        to={`/patterns/${decisionResult.breakAlternative.slug}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 hover:underline"
                      >
                        <span>{decisionResult.breakAlternative.title}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Canonical Question Pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-slate-400 text-[11px]">
                    #{decisionResult.sampleQuestion.id}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-[#FAF9F5] truncate">
                    Canonical Benchmark: {decisionResult.sampleQuestion.title}
                  </span>
                </div>
                <a
                  href={decisionResult.sampleQuestion.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] shrink-0 font-semibold"
                >
                  <span>LeetCode</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Pattern Decision Matrix (Instant Cheat Sheet) */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchMatrix}
                onChange={e => setSearchMatrix(e.target.value)}
                placeholder="Search problem scenario (e.g. subarray, cycle, next greater)..."
                className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:border-[#0F1B3D] dark:focus:border-[#D97757]"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-[#A8A69C] font-mono">
              Showing {filteredScenarios.length} canonical interview decision rules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredScenarios.map(sc => (
              <div
                key={sc.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-2xs space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#FAF9F5] leading-snug">
                      {sc.problemScenario}
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-[#1F1E1D] dark:text-[#A8A69C] shrink-0">
                      {sc.level}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5 text-xs">
                    <p className="text-slate-600 dark:text-[#A8A69C] leading-relaxed">
                      <span className="font-semibold text-slate-900 dark:text-[#FAF9F5]">Rule: </span>
                      {sc.decisionRule}
                    </p>
                    <p className="text-rose-700 dark:text-rose-400 text-[11px] leading-relaxed">
                      <span className="font-semibold">Anti-Signal: </span>
                      {sc.whenItBreaks}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-[#43433F]/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5]">
                    {sc.patternTitle}
                  </span>
                  <Link
                    to={`/patterns/${sc.patternSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0F1B3D] dark:text-[#D97757] hover:underline"
                  >
                    <span>Jump to Track</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
