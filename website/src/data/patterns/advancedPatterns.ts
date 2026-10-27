import type { PatternLearningContent } from '../../types/patterns';

export const ADVANCED_PATTERNS: PatternLearningContent[] = [
  // 14. Union Find
  {
    slug: 'union-find',
    title: 'Union Find (Disjoint Set)',
    level: 'Advanced',
    category: 'Graphs & Disjoint Sets',
    prerequisites: ['Equivalence Relations', 'Trees', 'Amortized Complexity'],
    companiesTop: ['Google', 'Amazon', 'Meta', 'Apple'],
    introTitle: 'What is Union Find (Disjoint Set)?',
    introDescription: [
      'Union Find (also known as Disjoint Set Union or DSU) is a data structure that tracks a partition of a set into disjoint (non-overlapping) subsets.',
      'It supports two primary operations: find(x) determines which subset element x belongs to, and union(x, y) merges the subsets containing x and y. When optimized with Path Compression and Union by Rank, each operation runs in virtually constant O(α(N)) amortized time, where α is the Inverse Ackermann function.',
    ],
    motivatingProblem: {
      title: 'Redundant Connection (LeetCode #684)',
      description: 'Given an undirected graph with N vertices and N edges, find an edge that can be removed so that the resulting graph is a tree of N vertices.',
      naiveApproach: 'For each edge, run a full DFS/BFS to check if a cycle is created: O(N²) time complexity.',
      optimalApproach: 'Process edges sequentially with Union Find. If find(u) == find(v), u and v are already connected, proving that edge (u, v) is the cycle-causing redundant connection. Runs in O(N * α(N)) time and O(N) space.',
    },
    applicabilityInvariant: 'Union Find applies to dynamic undirected connectivity queries where elements are progressively merged and equivalence relations must be tested in near O(1) time.',
    signals: [
      'Checking if two elements belong to the same connected component',
      'Detecting cycles in an undirected graph while adding edges dynamically',
      'Minimum Spanning Tree construction (Kruskal\'s Algorithm)',
      'Merging accounts, email addresses, or equivalence equations',
    ],
    antiSignals: [
      'Directed graphs where edge connectivity is asymmetric (use Topological Sort or Tarjan\'s SCC)',
      'Dynamic edge deletions (standard DSU does not support un-merging without complex rollbacks)',
    ],
    coreTechniqueTitle: 'Path Compression & Union by Rank',
    coreTechniqueDescription: 'Path compression flattens the tree during find(), pointing nodes directly to the root. Union by rank attaches smaller trees under larger trees to keep depth bounded.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Initialize Array',
        description: 'parent = [0 ... N-1] where each node is initially its own root. rank = [0 ... 0].',
      },
      {
        title: 'Step 2: Find with Compression',
        description: 'Recursive find(x): if parent[x] != x: parent[x] = find(parent[x]). Return parent[x].',
      },
      {
        title: 'Step 3: Union by Rank',
        description: 'Find roots rx = find(x), ry = find(y). If rx != ry, attach smaller rank root to larger rank root.',
      },
    ],
    loopInvariant: 'At any step, if find(x) == find(y), there exists a path connecting x and y through previously added edges.',
    variations: [
      {
        id: 'cycle-detection-dsu',
        title: 'Undirected Cycle Detection',
        description: 'An edge (u, v) creates a cycle if find(u) == find(v).',
        exampleProblem: 'LeetCode #684: Redundant Connection',
        keyIdea: 'Testing root equality before merging detects cycles immediately.',
      },
      {
        id: 'connected-components',
        title: 'Component Counting & Merging',
        description: 'Track count of disjoint sets initialized to N, decrementing on every successful union.',
        exampleProblem: 'LeetCode #547: Number of Provinces',
        keyIdea: 'Number of connected components equals count of nodes where parent[i] == i.',
      },
      {
        id: 'kruskal-mst',
        title: 'Kruskal\'s Minimum Spanning Tree',
        description: 'Sort edges by weight; add edge if endpoints belong to different disjoint sets.',
        exampleProblem: 'LeetCode #1584: Min Cost to Connect All Points',
        keyIdea: 'Greedy edge selection + DSU cycle prevention builds the optimal MST.',
      },
    ],
    pythonTemplate: `class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]

    def union(self, x: int, y: int) -> bool:
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False  # Already connected (cycle)
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        self.count -= 1
        return True`,
    tsTemplate: `class UnionFind {
  parent: number[];
  rank: number[];
  count: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    let rx = this.find(x);
    let ry = this.find(y);
    if (rx === ry) return false;
    if (this.rank[rx] < this.rank[ry]) {
      const temp = rx; rx = ry; ry = temp;
    }
    this.parent[ry] = rx;
    if (this.rank[rx] === this.rank[ry]) {
      this.rank[rx]++;
    }
    this.count--;
    return true;
  }
}`,
    pythonBrute: `def findRedundantConnection(edges: list[list[int]]) -> list[int]:
    adj = {i: [] for i in range(1, len(edges) + 1)}
    def is_connected(source, target, visited):
        if source == target:
            return True
        visited.add(source)
        for neighbor in adj[source]:
            if neighbor not in visited:
                if is_connected(neighbor, target, visited):
                    return True
        return False
    for u, v in edges:
        if is_connected(u, v, set()):
            return [u, v]
        adj[u].append(v)
        adj[v].append(u)
    return []`,
    tsBrute: `function findRedundantConnection(edges: number[][]): number[] {
  const n = edges.length;
  const adj: Map<number, number[]> = new Map();
  for (let i = 1; i <= n; i++) adj.set(i, []);
  function isConnected(src: number, dest: number, visited: Set<number>): boolean {
    if (src === dest) return true;
    visited.add(src);
    for (const neighbor of (adj.get(src) || [])) {
      if (!visited.has(neighbor) && isConnected(neighbor, dest, visited)) return true;
    }
    return false;
  }
  for (const [u, v] of edges) {
    if (isConnected(u, v, new Set())) return [u, v];
    adj.get(u)!.push(v);
    adj.get(v)!.push(u);
  }
  return [];
}`,
    bruteComplexity: {
      time: 'O(E × (V + E)) = O(V²)',
      space: 'O(V + E)',
      notes: 'Runs a full DFS path reachability search from u to v before adding each edge.',
    },
    bruteExplanation: 'Execute a full DFS path reachability search from u to v before adding each edge.',
    exampleProblemTitle: 'Redundant Connection (LeetCode #684)',
    exampleProblemDescription: 'Find the edge that creates a cycle in an undirected graph.',
    pythonExample: `def findRedundantConnection(edges: list[list[int]]) -> list[int]:
    parent = list(range(len(edges) + 1))
    def find(x):
        if parent[x] != x: parent[x] = find(parent[x])
        return parent[x]
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv: return [u, v]
        parent[ru] = rv
    return []`,
    tsExample: `function findRedundantConnection(edges: number[][]): number[] {
  const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  for (const [u, v] of edges) {
    const ru = find(u), rv = find(v);
    if (ru === rv) return [u, v];
    parent[ru] = rv;
  }
  return [];
}`,
    codeExplanation: [
      'Initialize parent array where each node points to itself.',
      'For each edge (u, v), find the roots ru and rv.',
      'If ru == rv, adding edge (u, v) creates a cycle: return [u, v].',
      'Otherwise, merge sets by setting parent[ru] = rv.',
    ],
    complexity: {
      time: 'O(N × α(N)) ≈ O(N)',
      space: 'O(N)',
      notes: 'Inverse Ackermann α(N) is <= 4 for all practical inputs. Time is essentially linear.',
    },
    pitfalls: [
      'Omitting path compression causes find() to degrade to O(N) on skewed chains.',
      '1-indexed vs 0-indexed node IDs (size parent array to N + 1 for 1-indexed inputs).',
    ],
    visualizerTitle: 'Union Find Disjoint Sets Visualizer',
    visualizerSubtitle: 'Step through dynamic edge unions, path compression, and cycle discovery.',
    mappings: [
      { questionId: 684, primaryPattern: 'union-find', subpattern: 'cycle-detection-dsu', subpatternLabel: 'Redundant Connection', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 547, primaryPattern: 'union-find', subpattern: 'connected-components', subpatternLabel: 'Provinces Count', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 721, primaryPattern: 'union-find', subpattern: 'connected-components', subpatternLabel: 'Accounts Merge', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 990, primaryPattern: 'union-find', subpattern: 'cycle-detection-dsu', subpatternLabel: 'Equality Equations', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 1319, primaryPattern: 'union-find', subpattern: 'connected-components', subpatternLabel: 'Network Operations', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 1584, primaryPattern: 'union-find', subpattern: 'kruskal-mst', subpatternLabel: 'Min Cost Connect Points', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 128, primaryPattern: 'union-find', subpattern: 'connected-components', subpatternLabel: 'Consecutive Sequence', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 947, primaryPattern: 'union-find', subpattern: 'connected-components', subpatternLabel: 'Remove Stones', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 765, primaryPattern: 'union-find', subpattern: 'connected-components', subpatternLabel: 'Couples Holding Hands', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 1627, primaryPattern: 'union-find', subpattern: 'connected-components', subpatternLabel: 'Graph Connectivity', learningOrder: 10, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'cycle-detection-dsu', label: 'Cycle Detection' },
      { id: 'connected-components', label: 'Connected Components' },
      { id: 'kruskal-mst', label: 'Kruskal\'s MST' },
    ],
    quiz: [
      {
        id: 'uf-q1',
        question: 'Why does Union Find achieve near O(1) amortized operations instead of O(N)?',
        options: [
          { id: 'opt-a', text: 'Because trees are stored in cache lines.' },
          { id: 'opt-b', text: 'Path compression flattens the tree during find(), pointing nodes directly to the root, while union by rank keeps tree height logarithmic.' },
          { id: 'opt-c', text: 'Because hash tables eliminate tree traversals.' },
          { id: 'opt-d', text: 'Because numbers are hashed into 32-bit registers.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Path compression flattens tree depths so subsequent calls take O(1) time. Combined with union by rank, complexity is bounded by O(α(N)).',
      },
      {
        id: 'uf-q2',
        question: 'In Kruskal\'s Minimum Spanning Tree algorithm, how does Union-Find detect whether adding edge (u, v) creates a cycle?',
        options: [
          { id: 'opt-a', text: 'By checking if edge weight is negative.' },
          { id: 'opt-b', text: 'By testing if find(u) === find(v); if both vertices already share the same root representative, adding (u, v) creates an alternate path, forming a cycle.' },
          { id: 'opt-c', text: 'By counting the number of neighbors u has.' },
          { id: 'opt-d', text: 'By reversing the edge.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'If find(u) == find(v), u and v already belong to the same connected component. Adding the edge (u, v) would provide a second path between them, creating a cycle.',
      },
      {
        id: 'uf-q3',
        question: 'What is the mathematical upper bound for α(N) (the inverse Ackermann function) for all conceivable universe-scale input sizes N <= 10^80?',
        options: [
          { id: 'opt-a', text: 'α(N) <= 4 (essentially a small constant).' },
          { id: 'opt-b', text: 'α(N) = log₂(N).' },
          { id: 'opt-c', text: 'α(N) = √N.' },
          { id: 'opt-d', text: 'α(N) = N / 2.' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'The Ackermann function grows extraordinarily fast, so its inverse α(N) grows extremely slowly. For all practical and astronomical inputs N <= 10^80, α(N) <= 4, making Union-Find effectively O(1) per operation.',
      },
    ],
  },

  // 15. Backtracking
  {
    slug: 'backtracking',
    title: 'Backtracking',
    level: 'Advanced',
    category: 'Recursion & Combinatorics',
    prerequisites: ['Recursion', 'Decision Trees', 'State Invariants'],
    companiesTop: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    introTitle: 'What is Backtracking?',
    introDescription: [
      'Backtracking is an algorithmic technique for solving constraint satisfaction and combinatorial search problems by building candidates incrementally and abandoning ("backtracking" from) a candidate as soon as it is determined that it cannot possibly lead to a valid solution.',
      'It navigates a state-space decision tree using a three-step cycle: Make a Choice, Explore Recursively, and Undo the Choice. Pruning invalid branches early prevents exhaustive exponential explosions.',
    ],
    motivatingProblem: {
      title: 'Permutations (LeetCode #46)',
      description: 'Given an array nums of distinct integers, return all the possible permutations in any order.',
      naiveApproach: 'Generate all N^N potential assignments and filter those with duplicate elements: highly inefficient.',
      optimalApproach: 'Backtracking: maintain a path and a boolean used array. Recursively build valid permutations of length N, undoing choices upon return. Runs in O(N! * N) time.',
    },
    applicabilityInvariant: 'Backtracking applies when we must generate, count, or find all configurations satisfying constraints, and partial states can be checked for validity and undone in O(1) time.',
    signals: [
      'Generating all permutations, subsets, combinations, or partitions',
      'Solving puzzle games (Sudoku, N-Queens, Word Search, Crosswords)',
      'Finding whether any valid path exists under complex conditional constraints',
    ],
    antiSignals: [
      'Finding the minimum or maximum cost where subproblems overlap (use Dynamic Programming)',
      'Locally optimal greedy choice is mathematically provable (use Greedy)',
    ],
    coreTechniqueTitle: 'The Choose - Explore - Unchoose Template',
    coreTechniqueDescription: 'Apply a choice to the current state, recurse to explore subsequent decisions, and restore the state before trying alternative choices.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Base Case Check',
        description: 'If current candidate satisfies the goal (e.g. len(path) == N), save a copy of path and return.',
      },
      {
        title: 'Step 2: Iterate Candidate Choices',
        description: 'For each available choice: if valid(choice): apply choice.',
      },
      {
        title: 'Step 3: Recursive Dive',
        description: 'backtrack(next_state).',
      },
      {
        title: 'Step 4: Undo Choice (Backtrack)',
        description: 'Revert state changes (e.g. path.pop(), used[i] = False) so sibling branches start clean.',
      },
    ],
    loopInvariant: 'When returning from a recursive call, the candidate path and visited state are exactly identical to their configuration before the call was invoked.',
    variations: [
      {
        id: 'permutations',
        title: 'Permutations (Order Matters)',
        description: 'Arrange all elements in every possible order.',
        exampleProblem: 'LeetCode #46: Permutations',
        keyIdea: 'Use boolean used[] array to track available choices at each depth.',
      },
      {
        id: 'subsets-combinations',
        title: 'Subsets & Combinations (Order Does Not Matter)',
        description: 'Generate power sets or fixed-size combinations.',
        exampleProblem: 'LeetCode #78 & #39: Subsets / Combination Sum',
        keyIdea: 'Pass startIndex to ensure elements are only chosen from indices >= start, eliminating duplicate permutations.',
      },
      {
        id: 'grid-backtracking',
        title: 'Grid & Constraint Satisfaction',
        description: 'Place items on 2D boards adhering to row/col/diagonal constraints.',
        exampleProblem: 'LeetCode #51 & #79: N-Queens / Word Search',
        keyIdea: 'Use hash sets or bitmasks to validate row, column, and diagonal safety in O(1).',
      },
    ],
    pythonTemplate: `def permute(nums: list[int]) -> list[list[int]]:
    res = []
    def backtrack(path, used):
        if len(path) == len(nums):
            res.append(path[:])  # Copy
            return
        for i in range(len(nums)):
            if used[i]: continue
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()  # Undo
            used[i] = False
    backtrack([], [False] * len(nums))
    return res`,
    tsTemplate: `function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  const used = new Array(nums.length).fill(false);
  function backtrack(path: number[]) {
    if (path.length === nums.length) {
      res.push([...path]); // Copy
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack(path);
      path.pop(); // Undo
      used[i] = false;
    }
  }
  backtrack([]);
  return res;
}`,
    pythonBrute: `def permute(nums: list[int]) -> list[list[int]]:
    res = []
    n = len(nums)
    def generate(path):
        if len(path) == n:
            if len(set(path)) == n:
                res.append(path[:])
            return
        for x in nums:
            path.append(x)
            generate(path)
            path.pop()
    generate([])
    return res`,
    tsBrute: `function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  const n = nums.length;
  function generate(path: number[]) {
    if (path.length === n) {
      if (new Set(path).size === n) res.push([...path]);
      return;
    }
    for (const x of nums) {
      path.push(x);
      generate(path);
      path.pop();
    }
  }
  generate([]);
  return res;
}`,
    bruteComplexity: {
      time: 'O(N^N × N)',
      space: 'O(N)',
      notes: 'Generates all N^N assignments and filters for distinct permutations.',
    },
    bruteExplanation: 'Generate all N^N potential assignments and filter only those with all unique elements.',
    exampleProblemTitle: 'Permutations (LeetCode #46)',
    exampleProblemDescription: 'Return all possible permutations of distinct integers.',
    pythonExample: `def permute(nums):
    res = []
    def backtrack(curr):
        if len(curr) == len(nums):
            res.append(list(curr))
            return
        for x in nums:
            if x not in curr:
                curr.append(x)
                backtrack(curr)
                curr.pop()
    backtrack([])
    return res`,
    tsExample: `function permute(nums: number[]): number[][] {
  const res: number[][] = [];
  function backtrack(curr: number[]) {
    if (curr.length === nums.length) { res.push([...curr]); return; }
    for (const x of nums) {
      if (!curr.includes(x)) {
        curr.push(x);
        backtrack(curr);
        curr.pop();
      }
    }
  }
  backtrack([]);
  return res;
}`,
    codeExplanation: [
      'Initialize result array res.',
      'Define recursive backtrack function with current path.',
      'If path length equals nums length, push a shallow copy [...path] to results.',
      'Iterate through candidate numbers. If number is not used, add to path, recurse, and pop to undo choice.',
    ],
    complexity: {
      time: 'O(N! × N)',
      space: 'O(N)',
      notes: 'There are N! permutations, each of length N. Call stack depth is N.',
    },
    pitfalls: [
      'Appending path directly to result instead of a copy (path[:] or [...path]) causes all results to become empty lists upon backtracking.',
      'Forgetting to undo the choice (missing path.pop() or used[i] = false).',
      'In Combination Sum II, forgetting to skip duplicate siblings: if i > start and nums[i] == nums[i-1]: continue.',
    ],
    visualizerTitle: 'Backtracking State-Space Visualizer',
    visualizerSubtitle: 'Watch decisions get explored, base cases recorded, and choices undone.',
    mappings: [
      { questionId: 46, primaryPattern: 'backtracking', subpattern: 'permutations', subpatternLabel: 'Permutations', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 47, primaryPattern: 'backtracking', subpattern: 'permutations', subpatternLabel: 'Permutations II', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 78, primaryPattern: 'backtracking', subpattern: 'subsets-combinations', subpatternLabel: 'Subsets', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 90, primaryPattern: 'backtracking', subpattern: 'subsets-combinations', subpatternLabel: 'Subsets II', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 39, primaryPattern: 'backtracking', subpattern: 'subsets-combinations', subpatternLabel: 'Combination Sum', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 40, primaryPattern: 'backtracking', subpattern: 'subsets-combinations', subpatternLabel: 'Combination Sum II', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 77, primaryPattern: 'backtracking', subpattern: 'subsets-combinations', subpatternLabel: 'Combinations', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 51, primaryPattern: 'backtracking', subpattern: 'grid-backtracking', subpatternLabel: 'N-Queens', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 79, primaryPattern: 'backtracking', subpattern: 'grid-backtracking', subpatternLabel: 'Word Search', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 17, primaryPattern: 'backtracking', subpattern: 'permutations', subpatternLabel: 'Letter Combinations Phone', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 22, primaryPattern: 'backtracking', subpattern: 'permutations', subpatternLabel: 'Generate Parentheses', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 37, primaryPattern: 'backtracking', subpattern: 'grid-backtracking', subpatternLabel: 'Sudoku Solver', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'permutations', label: 'Permutations' },
      { id: 'subsets-combinations', label: 'Subsets & Combinations' },
      { id: 'grid-backtracking', label: 'Grid Constraints' },
    ],
    quiz: [
      {
        id: 'bt-q1',
        question: 'When appending the current path to the final result list in Backtracking, why must you append a COPY (e.g. path[:] or [...path]) instead of `res.append(path)`?',
        options: [
          { id: 'opt-a', text: 'To convert integers to strings.' },
          { id: 'opt-b', text: 'Because path is a mutable reference: subsequent pop() calls will mutate the list in-place, leaving all stored results empty.' },
          { id: 'opt-c', text: 'Because JavaScript arrays cannot be nested.' },
          { id: 'opt-d', text: 'To sort the result.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Lists are passed by reference. If you store the reference, subsequent backtrack pop operations will alter the stored lists, resulting in an array of empty lists upon completion.',
      },
      {
        id: 'bt-q2',
        question: 'In Subsets II and Combination Sum II with duplicate numbers, how do you prune duplicate branches at the same tree depth?',
        options: [
          { id: 'opt-a', text: 'By converting the final array to a hash set.' },
          { id: 'opt-b', text: 'Sort the array upfront and skip candidate nums[i] if i > start && nums[i] === nums[i - 1].' },
          { id: 'opt-c', text: 'By restricting recursion depth to 2.' },
          { id: 'opt-d', text: 'By reversing the array.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Sorting groups identical values together. In the loop iterating over choices at the current decision level, if index i is greater than start and matches the preceding choice, exploring it would generate an identical decision subtree.',
      },
      {
        id: 'bt-q3',
        question: 'What is the key difference between Backtracking and standard Brute-Force DFS generation?',
        options: [
          { id: 'opt-a', text: 'Backtracking uses queues instead of recursion.' },
          { id: 'opt-b', text: 'Pruning: backtracking abandons (prunes) an entire subtree of candidate choices immediately when partial constraints are violated, avoiding exponential futile exploration.' },
          { id: 'opt-c', text: 'Backtracking only works on sorted arrays.' },
          { id: 'opt-d', text: 'Backtracking uses dynamic programming memoization.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Brute force generates all 2^N or N! states before validating them. Backtracking tests constraints incrementally at every decision step, cutting off whole branches before expanding them.',
      },
    ],
  },

  // 16. Greedy Algorithms
  {
    slug: 'greedy-algorithms',
    title: 'Greedy Algorithms',
    level: 'Advanced',
    category: 'Optimization & Sorting',
    prerequisites: ['Sorting', 'Mathematical Induction', 'Exchange Arguments'],
    companiesTop: ['Google', 'Amazon', 'Microsoft', 'Adobe'],
    introTitle: 'What are Greedy Algorithms?',
    introDescription: [
      'A Greedy Algorithm builds up a solution piece by piece, always choosing the next piece that offers the most immediate (local) benefit or optimum, without ever rethinking or backtracking on prior choices.',
      'Greedy algorithms only produce a globally optimal solution when the problem exhibits the Greedy-Choice Property and Optimal Substructure. When applicable, they solve optimization problems in O(N) or O(N log N) time with O(1) space, dramatically outperforming dynamic programming.',
    ],
    motivatingProblem: {
      title: 'Jump Game (LeetCode #55)',
      description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element represents your maximum jump length at that position. Return true if you can reach the last index.',
      naiveApproach: 'Backtracking or DP checking all jump lengths from each index: O(N²) time complexity.',
      optimalApproach: 'Greedy horizon tracking: maintain max_reach = max(max_reach, i + nums[i]). If i > max_reach, return false. If max_reach >= last_index, return true. Runs in O(N) time and O(1) space.',
    },
    applicabilityInvariant: 'Greedy works if and only if making the locally optimal choice at step k never precludes reaching the globally optimal solution (proven via Exchange Argument or "Greedy Stays Ahead").',
    signals: [
      'Optimization problems asking for minimum/maximum operations or intervals',
      'Interval scheduling (always choose earliest finish time)',
      'Reachability horizons (e.g. Jump Game)',
      'Gas station circular deficit replenishment',
    ],
    antiSignals: [
      '0-1 Knapsack problem where items cannot be fractionally divided (requires Dynamic Programming)',
      'Coin change with non-canonical denominations (e.g. coins [1, 3, 4] for amount 6, where greedy gives 4+1+1=3 coins but optimal is 3+3=2 coins; requires DP)',
    ],
    coreTechniqueTitle: 'Greedy Horizon Tracking & Invariants',
    coreTechniqueDescription: 'At each position, greedily update the furthest boundary reachable so far. If current index exceeds the boundary, reaching it is impossible.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Initialize Horizon',
        description: 'max_reach = 0.',
      },
      {
        title: 'Step 2: Iterate Positions',
        description: 'For each i in range(len(nums)): if i > max_reach: return False. max_reach = max(max_reach, i + nums[i]).',
      },
      {
        title: 'Step 3: Early Exit',
        description: 'If max_reach >= len(nums) - 1: return True.',
      },
    ],
    loopInvariant: 'At index i, max_reach is the maximum index that can be reached from any valid sequence of jumps starting at index 0.',
    variations: [
      {
        id: 'horizon-expansion',
        title: 'Reachability Horizon Expansion',
        description: 'Track maximum boundary reach in single pass.',
        exampleProblem: 'LeetCode #55 & #45: Jump Game I & II',
        keyIdea: 'Local choice maximizes the rightmost frontier reachable in k steps.',
      },
      {
        id: 'deficit-reset',
        title: 'Deficit Reset / Prefix Feasibility',
        description: 'Reset candidate starting point when running tank becomes negative.',
        exampleProblem: 'LeetCode #134: Gas Station',
        keyIdea: 'If total gas >= total cost, a solution exists; reset start index if balance dips below 0.',
      },
      {
        id: 'two-pass-greedy',
        title: 'Two-Pass Forward & Backward Greedy',
        description: 'Satisfy left-to-right constraints, then satisfy right-to-left constraints.',
        exampleProblem: 'LeetCode #135: Candy',
        keyIdea: 'Combine left-pass condition and right-pass condition via max() in O(N).',
      },
    ],
    pythonTemplate: `def canJump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
        if max_reach >= len(nums) - 1:
            return True
    return True`,
    tsTemplate: `function canJump(nums: number[]): number | boolean {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}`,
    pythonBrute: `def canJump(nums: list[int]) -> bool:
    n = len(nums)
    def can_reach(pos):
        if pos >= n - 1:
            return True
        max_jump = min(pos + nums[pos], n - 1)
        for next_pos in range(pos + 1, max_jump + 1):
            if can_reach(next_pos):
                return True
        return False
    return can_reach(0)`,
    tsBrute: `function canJump(nums: number[]): boolean {
  const n = nums.length;
  function canReach(pos: number): boolean {
    if (pos >= n - 1) return true;
    const maxJump = Math.min(pos + nums[pos], n - 1);
    for (let next = pos + 1; next <= maxJump; next++) {
      if (canReach(next)) return true;
    }
    return false;
  }
  return canReach(0);
}`,
    bruteComplexity: {
      time: 'O(2^N)',
      space: 'O(N)',
      notes: 'Exponential recursive branching testing every possible jump path.',
    },
    bruteExplanation: 'Try all possible jump sizes from every index recursively without tracking the furthest reachable boundary.',
    exampleProblemTitle: 'Jump Game (LeetCode #55)',
    exampleProblemDescription: 'Determine if you can reach the last index from index 0.',
    pythonExample: `def canJump(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach: return False
        reach = max(reach, i + x)
    return True`,
    tsExample: `function canJump(nums: number[]): boolean {
  let reach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}`,
    codeExplanation: [
      'Initialize max reachable horizon reach = 0.',
      'Iterate through array with index i and jump capacity.',
      'If current index i exceeds reach, you are trapped: return false.',
      'Update reach = max(reach, i + nums[i]).',
      'If loop completes, last index was reachable: return true.',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(1)',
      notes: 'Single pass across N elements with constant scalar accumulator.',
    },
    pitfalls: [
      'Assuming greedy works without proving the Greedy-Choice Property (e.g. applying greedy to 0-1 Knapsack).',
      'Forgetting to check if current index > max_reach before updating.',
    ],
    visualizerTitle: 'Greedy Horizon Tracking Visualizer',
    visualizerSubtitle: 'Step through Jump Game and watch the max reachable boundary expand greedily.',
    mappings: [
      { questionId: 55, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Jump Game I', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 45, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Jump Game II', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 134, primaryPattern: 'greedy-algorithms', subpattern: 'deficit-reset', subpatternLabel: 'Gas Station', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 122, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Stock Trading II', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 455, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Assign Cookies', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 406, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Queue Reconstruction', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 763, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Partition Labels', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 135, primaryPattern: 'greedy-algorithms', subpattern: 'two-pass-greedy', subpatternLabel: 'Candy Distribution', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 860, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Lemonade Change', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 605, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Can Place Flowers', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 678, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Valid Parenthesis String', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 334, primaryPattern: 'greedy-algorithms', subpattern: 'horizon-expansion', subpatternLabel: 'Increasing Triplet', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'horizon-expansion', label: 'Horizon Expansion' },
      { id: 'deficit-reset', label: 'Deficit Reset' },
      { id: 'two-pass-greedy', label: 'Two-Pass Greedy' },
    ],
    quiz: [
      {
        id: 'grd-q1',
        question: 'When does a Greedy Algorithm FAIL to produce an optimal solution?',
        options: [
          { id: 'opt-a', text: 'When the array contains positive numbers.' },
          { id: 'opt-b', text: 'When a locally optimal choice locks the search into a path that misses a superior global outcome (e.g. Coin Change with coins [1, 3, 4] for amount 6).' },
          { id: 'opt-c', text: 'When the algorithm uses O(1) space.' },
          { id: 'opt-d', text: 'When arrays are sorted.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'For coins [1, 3, 4] and target 6, greedy takes 4 first, leaving 2, which requires 1+1 (3 coins total: 4, 1, 1). But optimal is 3 + 3 (2 coins). Greedy fails because it lacks optimal substructure under local choices.',
      },
      {
        id: 'grd-q2',
        question: 'What mathematical proof method is most standard for proving that a greedy algorithm produces the global optimum?',
        options: [
          { id: 'opt-a', text: 'Exchange Argument (proving that any hypothetical optimal solution can be transformed step-by-step into the greedy solution without worsening the objective).' },
          { id: 'opt-b', text: 'Monte Carlo simulation.' },
          { id: 'opt-c', text: 'Randomized sampling.' },
          { id: 'opt-d', text: 'Quadratic regression.' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'The exchange argument assumes an optimal solution S* differs from greedy solution G, and proves swapping elements to match G never worsens value, establishing G is equally optimal.',
      },
      {
        id: 'grd-q3',
        question: 'In Gas Station (LeetCode #134), why does finding total_gas >= total_cost guarantee that a valid starting station exists?',
        options: [
          { id: 'opt-a', text: 'Because fuel tanks have infinite capacity.' },
          { id: 'opt-b', text: 'Conservation of energy: the circular net deficit/surplus is positive; starting immediately after the lowest cumulative dip ensures the running tank never drops below zero.' },
          { id: 'opt-c', text: 'Gas stations are sorted in ascending order.' },
          { id: 'opt-d', text: 'All gas stations provide free gas.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'If total gas exceeds total cost, the global net balance is non-negative. Starting immediately after the point of maximum cumulative deficit ensures that throughout the entire circuit, the running tank never goes negative.',
      },
    ],
  },

  // 17. Dynamic Programming
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    level: 'Advanced',
    category: 'Optimization & DP',
    prerequisites: ['Recursion', 'Memoization', 'State Transitions', 'Bellman Optimality'],
    companiesTop: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Goldman Sachs'],
    introTitle: 'What is Dynamic Programming?',
    introDescription: [
      'Dynamic Programming (DP) solves complex optimization problems by breaking them down into simpler, overlapping subproblems, solving each subproblem exactly once, and storing their solutions (either top-down with memoization or bottom-up with tabulation).',
      'DP applies when a problem exhibits Optimal Substructure (an optimal solution contains optimal solutions to subproblems) and Overlapping Subproblems (the same subproblems are solved repeatedly by naive recursion). It reduces exponential O(2^N) recursive algorithms to polynomial O(N) or O(N²).',
    ],
    motivatingProblem: {
      title: 'Coin Change (LeetCode #322)',
      description: 'Given an integer array coins representing coins of different denominations and an integer amount, return the fewest number of coins that you need to make up that amount.',
      naiveApproach: 'Brute force recursive branching exploring all coin combinations: exponential O(C^amount) time complexity.',
      optimalApproach: '1D DP tabulation: dp[i] = min(dp[i - c] + 1) for all c in coins. Solves each subproblem from 1 to amount once in O(amount * len(coins)) time.',
    },
    applicabilityInvariant: 'Bellman\'s Principle of Optimality: an optimal policy has the property that whatever the initial state and initial decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision.',
    signals: [
      'Problems asking for minimum/maximum cost, ways to reach a target, or whether a partition is possible',
      'Decisions made at step i depend on optimal outcomes of previous steps (0 ... i-1)',
      'Subproblems overlap heavily when drawn as a recursion tree',
      'Strings: Edit Distance, Longest Common Subsequence, Palindromic Partitioning',
    ],
    antiSignals: [
      'Subproblems are completely disjoint with zero overlap (use Divide and Conquer, e.g. Mergesort)',
      'State space cannot be discretely compressed into polynomial bounds (use Backtracking)',
    ],
    coreTechniqueTitle: 'The 5-Step DP Formulation Framework',
    coreTechniqueDescription: 'Define state dp[i], identify transitions from smaller subproblems, establish base cases, determine evaluation order, and extract the answer.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Define Subproblem State',
        description: 'dp[i] represents the minimum coins needed to make amount i.',
      },
      {
        title: 'Step 2: Base Cases',
        description: 'dp[0] = 0 (0 coins for $0); all other dp[i] = infinity.',
      },
      {
        title: 'Step 3: State Transition Recurrence',
        description: 'For each amount i from 1 to target: dp[i] = min(dp[i - coin] + 1) for all coin <= i.',
      },
      {
        title: 'Step 4: Answer Extraction',
        description: 'return dp[target] if dp[target] != infinity else -1.',
      },
    ],
    loopInvariant: 'At amount i, dp[i] holds the mathematically proven minimum number of coins required to form value i using the allowed denominations.',
    variations: [
      {
        id: '1d-linear-dp',
        title: '1D Linear DP & State Choice',
        description: 'Subproblems depend on previous 1 or 2 values (e.g. House Robber).',
        exampleProblem: 'LeetCode #70 & #198: Climbing Stairs / House Robber',
        keyIdea: 'dp[i] = max(dp[i-1], nums[i] + dp[i-2]); compress to O(1) space with 2 variables.',
      },
      {
        id: 'knapsack-unbounded',
        title: 'Unbounded & 0-1 Knapsack',
        description: 'Coin change or subset sum capacity fitting.',
        exampleProblem: 'LeetCode #322 & #416: Coin Change / Partition Equal Subset Sum',
        keyIdea: '0-1 knapsack loops capacity backwards; unbounded knapsack loops forward.',
      },
      {
        id: '2d-string-alignment',
        title: '2D String Matching & Alignment',
        description: 'Grid transitions on pairs of strings (LCS, Edit Distance).',
        exampleProblem: 'LeetCode #1143 & #72: Longest Common Subsequence / Edit Distance',
        keyIdea: 'If chars match: dp[i][j] = dp[i-1][j-1]; else take min/max of delete/insert/replace.',
      },
      {
        id: 'kadane-subarray',
        title: 'Kadane\'s Subarray Optimization',
        description: 'Maximum contiguous sum: dp[i] = max(nums[i], dp[i-1] + nums[i]).',
        exampleProblem: 'LeetCode #53: Maximum Subarray',
        keyIdea: 'Either extend previous subarray or start fresh from current element in O(N).',
      },
    ],
    pythonTemplate: `def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    tsTemplate: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) {
        dp[i] = Math.min(dp[i], dp[i - c] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    pythonBrute: `def coinChange(coins: list[int], amount: int) -> int:
    def solve(rem):
        if rem == 0: return 0
        if rem < 0: return float('inf')
        min_coins = float('inf')
        for coin in coins:
            res = solve(rem - coin)
            if res != float('inf'):
                min_coins = min(min_coins, 1 + res)
        return min_coins
    ans = solve(amount)
    return ans if ans != float('inf') else -1`,
    tsBrute: `function coinChange(coins: number[], amount: number): number {
  function solve(rem: number): number {
    if (rem === 0) return 0;
    if (rem < 0) return Infinity;
    let minCoins = Infinity;
    for (const coin of coins) {
      const res = solve(rem - coin);
      if (res !== Infinity) minCoins = Math.min(minCoins, 1 + res);
    }
    return minCoins;
  }
  const ans = solve(amount);
  return ans === Infinity ? -1 : ans;
}`,
    bruteComplexity: {
      time: 'O(S^A)',
      space: 'O(A)',
      notes: 'Exponential recursive tree recomputing identical sub-amounts repeatedly (S coins, A amount).',
    },
    bruteExplanation: 'Explore all combinations of coin subtractions via naive recursion without memoization or caching.',
    exampleProblemTitle: 'Coin Change (LeetCode #322)',
    exampleProblemDescription: 'Find fewest number of coins needed to make up amount.',
    pythonExample: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if i - c >= 0:
                dp[i] = min(dp[i], dp[i-c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
    tsExample: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    codeExplanation: [
      'Initialize dp array of size amount + 1 filled with Infinity, dp[0] = 0.',
      'Iterate each amount from 1 to target.',
      'For each coin, if i >= coin, update dp[i] = min(dp[i], dp[i - coin] + 1).',
      'Return dp[amount] if reachable, else -1.',
    ],
    complexity: {
      time: 'O(amount × len(coins))',
      space: 'O(amount)',
      notes: 'Solves `amount` subproblems, each making `coins.length` choices.',
    },
    pitfalls: [
      'In 0-1 Knapsack, iterating capacity in ascending order causes an item to be reused multiple times (must iterate in descending order).',
      'Forgetting the base case dp[0] = 0 leads to all values remaining Infinity.',
    ],
    visualizerTitle: 'Dynamic Programming Tabulation Visualizer',
    visualizerSubtitle: 'Step through subproblem table filling and see optimal substructure in action.',
    mappings: [
      { questionId: 70, primaryPattern: 'dynamic-programming', subpattern: '1d-linear-dp', subpatternLabel: 'Climbing Stairs', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 198, primaryPattern: 'dynamic-programming', subpattern: '1d-linear-dp', subpatternLabel: 'House Robber', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 213, primaryPattern: 'dynamic-programming', subpattern: '1d-linear-dp', subpatternLabel: 'House Robber II', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 53, primaryPattern: 'dynamic-programming', subpattern: 'kadane-subarray', subpatternLabel: 'Kadane Max Subarray', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 322, primaryPattern: 'dynamic-programming', subpattern: 'knapsack-unbounded', subpatternLabel: 'Coin Change', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 518, primaryPattern: 'dynamic-programming', subpattern: 'knapsack-unbounded', subpatternLabel: 'Coin Change II', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 300, primaryPattern: 'dynamic-programming', subpattern: '1d-linear-dp', subpatternLabel: 'Longest Increasing Subseq', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 62, primaryPattern: 'dynamic-programming', subpattern: '2d-string-alignment', subpatternLabel: 'Unique Paths', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 64, primaryPattern: 'dynamic-programming', subpattern: '2d-string-alignment', subpatternLabel: 'Minimum Path Sum', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 1143, primaryPattern: 'dynamic-programming', subpattern: '2d-string-alignment', subpatternLabel: 'Longest Common Subseq', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 72, primaryPattern: 'dynamic-programming', subpattern: '2d-string-alignment', subpatternLabel: 'Edit Distance', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 416, primaryPattern: 'dynamic-programming', subpattern: 'knapsack-unbounded', subpatternLabel: 'Partition Equal Subset', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: '1d-linear-dp', label: '1D State DP' },
      { id: 'knapsack-unbounded', label: 'Knapsack Variants' },
      { id: '2d-string-alignment', label: '2D Grid & Strings' },
      { id: 'kadane-subarray', label: 'Kadane Subarray' },
    ],
    quiz: [
      {
        id: 'dp-q1',
        question: 'What is the difference between 0-1 Knapsack and Unbounded Knapsack in 1D array tabulation?',
        options: [
          { id: 'opt-a', text: '0-1 knapsack uses recursion while unbounded knapsack uses iteration.' },
          { id: 'opt-b', text: 'In 0-1 Knapsack, the capacity loop runs in reverse (descending order) to ensure each item is used at most once; in Unbounded Knapsack, it runs in forward (ascending) order.' },
          { id: 'opt-c', text: 'Unbounded knapsack requires sorting coins.' },
          { id: 'opt-d', text: 'There is no difference.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Iterating capacity backwards ensures dp[w - weight] references the state from the previous item iteration, preventing an item from being counted multiple times.',
      },
      {
        id: 'dp-q2',
        question: 'What two fundamental mathematical properties characterize Dynamic Programming problems where memoization yields polynomial-time efficiency?',
        options: [
          { id: 'opt-a', text: 'Sorted input and log-linear time.' },
          { id: 'opt-b', text: 'Optimal Substructure (an optimal solution contains optimal solutions to subproblems) and Overlapping Subproblems (the same subproblems are solved repeatedly).' },
          { id: 'opt-c', text: 'Monotonicity and two pointers.' },
          { id: 'opt-d', text: 'Bipartite coloring and DAG structure.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Optimal substructure guarantees that solving subproblems optimally produces a globally optimal solution. Overlapping subproblems provide the reason memoization is vastly faster than plain recursive tree recomputation.',
      },
      {
        id: 'dp-q3',
        question: 'In Longest Increasing Subsequence (LeetCode #300), how does the Patience Sorting / Binary Search optimization reduce time complexity from O(N²) to O(N log N)?',
        options: [
          { id: 'opt-a', text: 'By sorting the array first.' },
          { id: 'opt-b', text: 'By maintaining an array tails where tails[i] stores the smallest tail of all increasing subsequences of length i + 1, and binary searching for the replacement index.' },
          { id: 'opt-c', text: 'By skipping duplicate numbers.' },
          { id: 'opt-d', text: 'By converting numbers to base 2.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'The tails array is strictly increasing, so for each number in nums, we can find its insertion position via binary search in O(log N) time, giving O(N log N) overall.',
      },
    ],
  },

  // 18. Bit Manipulation
  {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    level: 'Advanced',
    category: 'Bitwise & Math',
    prerequisites: ['Binary Representation', 'Two\'s Complement', 'Bitwise Operators'],
    companiesTop: ['Amazon', 'Google', 'Apple', 'Meta'],
    introTitle: 'What is Bit Manipulation?',
    introDescription: [
      'Bit Manipulation operates directly on individual bits of integer data types using machine-level bitwise operations: AND (&), OR (|), XOR (^), NOT (~), and bit shifts (<<, >>, >>>).',
      'Because microprocessors execute bitwise instructions in single clock cycles with zero memory overhead, bit manipulation delivers blazingly fast algorithmic tricks: finding single unique numbers via XOR cancellation, counting set bits via Brian Kernighan\'s algorithm, and representing subsets as compact 32-bit or 64-bit integers (bitmasks).',
    ],
    motivatingProblem: {
      title: 'Single Number (LeetCode #136)',
      description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in O(N) time and O(1) space.',
      naiveApproach: 'Use a Hash Set to track occurrences: O(N) time but requires O(N) auxiliary space.',
      optimalApproach: 'XOR all numbers together: since x ^ x = 0 and x ^ 0 = x, duplicate pairs cancel out completely. The accumulated result is the unique number: O(N) time and O(1) space.',
    },
    applicabilityInvariant: 'Bit Manipulation applies when problems involve binary states, parity, powers of two, or compact subset enumeration that can be mapped to 32/64 bit machine words.',
    signals: [
      'Every number appears twice/thrice except one unique element',
      'Checking if an integer is a power of two',
      'Counting the number of set bits (Hamming weight)',
      'Subsets or state encoding over small sets (N <= 30) using bitmasks',
    ],
    antiSignals: [
      'Arbitrary precision operations requiring more than 64 bits without BigInt library',
      'Floating point numbers where IEEE 754 bit representations do not obey integer arithmetic rules',
    ],
    coreTechniqueTitle: 'XOR Involution & Bit Clearing Invariants',
    coreTechniqueDescription: 'x ^ x = 0 (self-cancellation) and n & (n - 1) clears the lowest set 1-bit in an integer.',
    coreTechniqueSteps: [
      {
        title: 'Identity 1: XOR Cancellation',
        description: 'a ^ b ^ a = (a ^ a) ^ b = 0 ^ b = b. Eliminates paired duplicates.',
      },
      {
        title: 'Identity 2: Brian Kernighan Bit Clearing',
        description: 'n & (n - 1) removes the lowest set bit of n in O(1).',
      },
      {
        title: 'Identity 3: Isolate Lowest Bit',
        description: 'lowest_bit = n & (-n).',
      },
    ],
    loopInvariant: 'At step i, accumulator holds the bitwise XOR of all elements nums[0 ... i]. All completed pairs have cancelled to 0.',
    variations: [
      {
        id: 'xor-cancellation',
        title: 'XOR Parity & Duplicate Cancellation',
        description: 'Identify unique elements by cancelling duplicate pairs.',
        exampleProblem: 'LeetCode #136 & #260: Single Number I & III',
        keyIdea: 'Duplicates cancel to 0; isolate different bits using diff & (-diff).',
      },
      {
        id: 'bit-counting',
        title: 'Hamming Weight & Bit Counting',
        description: 'Count number of 1-bits in O(set bits) time.',
        exampleProblem: 'LeetCode #191 & #338: Number of 1 Bits / Counting Bits',
        keyIdea: 'n & (n - 1) removes lowest set bit; loops exactly as many times as there are 1s.',
      },
      {
        id: 'bitmask-subsets',
        title: 'Bitmask State Representation',
        description: 'Represent combinations of up to 30 items as integer bits.',
        exampleProblem: 'LeetCode #78: Subsets (Bitmask iteration)',
        keyIdea: 'Integer mask from 0 to 2^N - 1 encodes every subset; test bit i with (mask & (1 << i)).',
      },
    ],
    pythonTemplate: `def singleNumber(nums: list[int]) -> int:
    acc = 0
    for x in nums:
        acc ^= x
    return acc`,
    tsTemplate: `function singleNumber(nums: number[]): number {
  let acc = 0;
  for (let i = 0; i < nums.length; i++) {
    acc ^= nums[i];
  }
  return acc;
}`,
    pythonBrute: `def singleNumber(nums: list[int]) -> int:
    for i in range(len(nums)):
        count = 0
        for j in range(len(nums)):
            if nums[i] == nums[j]:
                count += 1
        if count == 1:
            return nums[i]
    return -1`,
    tsBrute: `function singleNumber(nums: number[]): number {
  for (let i = 0; i < nums.length; i++) {
    let count = 0;
    for (let j = 0; j < nums.length; j++) {
      if (nums[i] === nums[j]) count++;
    }
    if (count === 1) return nums[i];
  }
  return -1;
}`,
    bruteComplexity: {
      time: 'O(N²)',
      space: 'O(1)',
      notes: 'Counts the frequency of each number by scanning the entire array in quadratic time.',
    },
    bruteExplanation: 'Scan the entire array for every element to count its occurrences, requiring quadratic time.',
    exampleProblemTitle: 'Single Number (LeetCode #136)',
    exampleProblemDescription: 'Find the single non-duplicate number in an array in O(N) time and O(1) space.',
    pythonExample: `def singleNumber(nums):
    res = 0
    for x in nums:
        res ^= x
    return res`,
    tsExample: `function singleNumber(nums: number[]): number {
  let res = 0;
  for (const x of nums) res ^= x;
  return res;
}`,
    codeExplanation: [
      'Initialize accumulator res = 0.',
      'Iterate through every integer x in nums, updating res ^= x.',
      'Since XOR is commutative and associative, all duplicate pairs cancel out (x ^ x = 0).',
      'The single non-duplicate value remains in res.',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(1)',
      notes: 'Single pass of bitwise operations. Consumes 0 additional heap memory.',
    },
    pitfalls: [
      'In JavaScript, bitwise operators convert numbers to 32-bit signed integers; use unsigned right shift (>>> 0) when working with unsigned 32-bit numbers.',
      'Operator precedence: bitwise operators (&, |, ^) have lower precedence than comparison operators (==, !=, <). Always wrap in parentheses: `(n & 1) === 0`.',
    ],
    visualizerTitle: 'Bitwise XOR & State Visualizer',
    visualizerSubtitle: 'Step through binary bits and watch duplicate numbers cancel out to leave the unique value.',
    mappings: [
      { questionId: 136, primaryPattern: 'bit-manipulation', subpattern: 'xor-cancellation', subpatternLabel: 'Single Number', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 191, primaryPattern: 'bit-manipulation', subpattern: 'bit-counting', subpatternLabel: 'Number of 1 Bits', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 338, primaryPattern: 'bit-manipulation', subpattern: 'bit-counting', subpatternLabel: 'Counting Bits', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 190, primaryPattern: 'bit-manipulation', subpattern: 'bit-counting', subpatternLabel: 'Reverse Bits', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 231, primaryPattern: 'bit-manipulation', subpattern: 'bit-counting', subpatternLabel: 'Power of Two', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 268, primaryPattern: 'bit-manipulation', subpattern: 'xor-cancellation', subpatternLabel: 'Missing Number', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 137, primaryPattern: 'bit-manipulation', subpattern: 'xor-cancellation', subpatternLabel: 'Single Number II', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 260, primaryPattern: 'bit-manipulation', subpattern: 'xor-cancellation', subpatternLabel: 'Single Number III', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 371, primaryPattern: 'bit-manipulation', subpattern: 'bit-counting', subpatternLabel: 'Sum Two Integers', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 201, primaryPattern: 'bit-manipulation', subpattern: 'bit-counting', subpatternLabel: 'Bitwise AND Range', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 78, primaryPattern: 'bit-manipulation', subpattern: 'bitmask-subsets', subpatternLabel: 'Subsets via Bitmask', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 89, primaryPattern: 'bit-manipulation', subpattern: 'bitmask-subsets', subpatternLabel: 'Gray Code', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'xor-cancellation', label: 'XOR Cancellation' },
      { id: 'bit-counting', label: 'Bit Counting' },
      { id: 'bitmask-subsets', label: 'Bitmask Subsets' },
    ],
    quiz: [
      {
        id: 'bm-q1',
        question: 'What does the bitwise expression `n & (n - 1)` do?',
        options: [
          { id: 'opt-a', text: 'Multiplies n by 2.' },
          { id: 'opt-b', text: 'Clears (turns to 0) the lowest set 1-bit in n.' },
          { id: 'opt-c', text: 'Inverts all bits of n.' },
          { id: 'opt-d', text: 'Calculates the square root of n.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Subtracting 1 flips the lowest set bit and all bits to its right. Bitwise AND with the original number n zeroes out that lowest set bit, running in O(1).',
      },
      {
        id: 'bm-q2',
        question: 'Why does `(n > 0) && ((n & (n - 1)) === 0)` determine if an integer n is a power of two?',
        options: [
          { id: 'opt-a', text: 'Powers of two have all 1s in their binary representation.' },
          { id: 'opt-b', text: 'A power of two has exactly one set bit in binary. Clearing that single bit with n & (n - 1) leaves 0.' },
          { id: 'opt-c', text: 'Because bitwise AND divides by 2.' },
          { id: 'opt-d', text: 'Because powers of two are always even.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Powers of 2 (1, 2, 4, 8, 16...) have binary representations 0b1, 0b10, 0b100, etc., containing exactly one 1-bit. Clearing it yields 0.',
      },
      {
        id: 'bm-q3',
        question: 'How do you isolate the lowest set bit (rightmost 1) of an integer n in two\'s complement binary representation?',
        options: [
          { id: 'opt-a', text: 'n & (-n)' },
          { id: 'opt-b', text: 'n | (-n)' },
          { id: 'opt-c', text: 'n ^ (-n)' },
          { id: 'opt-d', text: '~n' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'In two\'s complement, -n is (~n + 1). This inverts all bits to the left of the lowest set bit and keeps the lowest set bit and trailing zeroes identical. Thus, n & (-n) zeroes out all bits except the lowest set bit.',
      },
    ],
  },
];
