/**
 * Pattern Triggers & Active Recall Insights
 * 
 * Provides concise, 1-2 sentence "Ah-Ha" triggers for canonical interview questions.
 * Helps candidates understand the intuition of WHY a pattern was chosen before seeing code.
 */

export interface PatternTrigger {
  questionId: number;
  trigger: string;
  whyThisPattern: string;
  whenItBreaks?: string;
  keyInvariant: string;
}

export const PATTERN_TRIGGERS: Record<number, PatternTrigger> = {
  // Hashing & Frequency
  1: {
    questionId: 1,
    trigger: "Complement lookup in O(1): Instead of scanning forward for target - x in O(N), store seen numbers in a hash map.",
    whyThisPattern: "Converts a nested O(N^2) pair search into an O(N) single-pass lookup table.",
    whenItBreaks: "If O(1) auxiliary space is strictly required, sort first and use Two Pointers instead.",
    keyInvariant: "For current number x, check if (target - x) is already present in the map.",
  },
  49: {
    questionId: 49,
    trigger: "Canonical signature hashing: All anagrams share the exact same sorted string or 26-character frequency tuple.",
    whyThisPattern: "Hash table maps the standardized signature key to an array of matching original words.",
    whenItBreaks: "If alphabet size is unbounded (arbitrary Unicode), sorting the string is cleaner than a huge frequency tuple.",
    keyInvariant: "Two strings belong to the same group if and only if signature(s1) === signature(s2).",
  },
  128: {
    questionId: 128,
    trigger: "Sequence boundary detection: An integer num starts a sequence only if num - 1 is NOT in the HashSet.",
    whyThisPattern: "HashSet lookups are O(1). Skipping numbers that aren't sequence starters ensures every number is visited at most twice.",
    whenItBreaks: "Sorting achieves O(N log N) with O(1) space, but O(N) time requires hash set space.",
    keyInvariant: "Only expand sequences from elements where (x - 1) is absent.",
  },

  // Two Pointers
  167: {
    questionId: 167,
    trigger: "Sorted boundaries: Because the array is sorted, sum < target means left pointer must advance; sum > target means right pointer must decrease.",
    whyThisPattern: "Monotonicity allows discarding an entire row or column of candidate pairs with each step.",
    whenItBreaks: "Fails on unsorted arrays (use Hash Map instead).",
    keyInvariant: "The active search space [left, right] is guaranteed to contain the answer if one exists.",
  },
  11: {
    questionId: 11,
    trigger: "Bottleneck elimination: Area is bounded by min(height[L], height[R]) * (R - L). Moving the taller wall can never increase area; only moving the shorter wall has a chance.",
    whyThisPattern: "Guarantees eliminating the limiting factor at each step in O(N) total time.",
    whenItBreaks: "Cannot skip pointers if area depended on internal peak sums rather than endpoints.",
    keyInvariant: "The shorter wall is definitively exhausted and cannot form a larger container with any other line.",
  },
  15: {
    questionId: 15,
    trigger: "Fixed pivot + sorted two-pointer sweep: Sort array, fix nums[i], and run Two Sum II on the remaining suffix with duplicate skipping.",
    whyThisPattern: "Reduces O(N^3) brute-force triplets to O(N^2) with O(1) extra memory.",
    whenItBreaks: "If indices must be preserved in original order, use hash map indices.",
    keyInvariant: "Sorting allows duplicate elements to be bypassed continuously: nums[L] === nums[L-1].",
  },
  42: {
    questionId: 42,
    trigger: "Boundary bottleneck: Water at index i is strictly min(maxLeft, maxRight) - height[i]. Moving the smaller max wall inwards guarantees its bottleneck is known.",
    whyThisPattern: "Eliminates precomputing prefix/suffix arrays, reducing extra space from O(N) to O(1).",
    whenItBreaks: "If water can flow diagonally or in 2D, requires BFS/PriorityQueue (Trapping Rain Water II).",
    keyInvariant: "If maxLeft < maxRight, water trapped at left pointer is determined solely by maxLeft.",
  },

  // Sliding Window
  643: {
    questionId: 643,
    trigger: "Fixed window slide: Subtract the leaving element at left and add the entering element at right in O(1).",
    whyThisPattern: "Avoids recalculating the sum of k elements from scratch on every step.",
    keyInvariant: "Window size is strictly fixed at k: windowSum += nums[i] - nums[i - k].",
  },
  3: {
    questionId: 3,
    trigger: "Dynamic window with unique set: Expand right pointer until a duplicate character is found, then shrink left pointer past the first occurrence.",
    whyThisPattern: "Maintains a valid state (all characters distinct) over the contiguous substring [left, right].",
    keyInvariant: "Every character inside the current window [L, R] has frequency <= 1.",
  },
  76: {
    questionId: 76,
    trigger: "Match counter contraction: Expand right until all target characters are matched ('formed === required'), then shrink left to find the minimal valid window.",
    whyThisPattern: "Substrings are contiguous; the optimal window can be discovered in linear time O(N + M).",
    keyInvariant: "Window is shrunk only while it contains all required characters with sufficient counts.",
  },
  239: {
    questionId: 239,
    trigger: "Monotonic decreasing deque: Store indices in a deque whose values strictly decrease. The front is always the window maximum.",
    whyThisPattern: "Discard elements that are smaller than the incoming element and to the left (they can never be maximums).",
    keyInvariant: "deque[0] always points to the largest element currently inside the active window.",
  },

  // Prefix Sum
  303: {
    questionId: 303,
    trigger: "Range sum subtraction: Range sum of [L, R] equals prefix[R + 1] - prefix[L] in O(1) time.",
    whyThisPattern: "Precomputes cumulative sums in O(N) once to serve endless range queries in O(1).",
    whenItBreaks: "Fails efficiently if array elements are frequently updated (use Fenwick/Segment Tree).",
    keyInvariant: "prefix[i] stores the sum of all elements nums[0...i-1].",
  },
  560: {
    questionId: 560,
    trigger: "Negative numbers break sliding window: Use prefix sum hash map to count how many times (runningSum - k) occurred previously.",
    whyThisPattern: "Subarray sum(i, j) = prefix[j] - prefix[i-1] = k  <=>  prefix[i-1] = prefix[j] - k.",
    whenItBreaks: "Do NOT use sliding window here because negative numbers destroy sum monotonicity.",
    keyInvariant: "Map stores frequency of historical prefix sums seen so far.",
  },
  525: {
    questionId: 525,
    trigger: "Transform to zero-sum: Replace 0s with -1s. Equal number of 0s and 1s now means subarray sum equals 0.",
    whyThisPattern: "Store the FIRST occurrence of each prefix sum to maximize length: right - firstIndex[sum].",
    keyInvariant: "If prefixSum seen at index A matches index B, the intermediate slice has net sum 0.",
  },

  // Binary Search
  704: {
    questionId: 704,
    trigger: "Monotonic search space: Sorted array allows halving the candidate range in each iteration.",
    whyThisPattern: "O(log N) elimination by comparing midpoint with target.",
    keyInvariant: "Target is guaranteed to be within [low, high] if present.",
  },
  33: {
    questionId: 33,
    trigger: "Half-sorted invariant: In any rotated sorted array, at least one half [low, mid] or [mid, high] is always normally sorted.",
    whyThisPattern: "Check if target lies inside the sorted half; if yes, search there; otherwise search the rotated half.",
    keyInvariant: "nums[low] <= nums[mid] signifies left half is sorted; otherwise right half is sorted.",
  },
  875: {
    questionId: 875,
    trigger: "Binary search on answer space: Speed k is monotonic — if eating speed k works, any speed > k also works.",
    whyThisPattern: "Range is [1, max(piles)]. Search for the minimal feasible speed in O(N log(maxPile)).",
    keyInvariant: "Feasibility function isMonotonic(k) transitions from False to True exactly once.",
  },

  // Fast & Slow Pointers
  141: {
    questionId: 141,
    trigger: "Floyd's cycle detection: Fast pointer advances by 2, slow by 1. If a cycle exists, the distance between them shrinks by 1 each step.",
    whyThisPattern: "Detects cycle in O(N) time with O(1) memory, avoiding an O(N) hash set.",
    keyInvariant: "In a cycle of length C, fast catches up to slow in at most C steps.",
  },
  142: {
    questionId: 142,
    trigger: "Mathematical cycle start: When fast and slow meet, reset slow to head. Advance both 1 step at a time; they collide at the cycle entry.",
    whyThisPattern: "Distance from head to entry equals distance from meeting point to entry modulo cycle length.",
    keyInvariant: "Distance arithmetic: 2(F + a) = F + a + nC => F = nC - a.",
  },
  287: {
    questionId: 287,
    trigger: "Array as implicit linked list: Value nums[i] represents pointer to next node index. Duplicate value means two indices point to the same node (cycle entry).",
    whyThisPattern: "Find duplicate in O(N) time and O(1) space without modifying read-only array.",
    keyInvariant: "Cycle entrance corresponds to the repeated duplicate number.",
  },

  // Stack & Monotonic Stack
  739: {
    questionId: 739,
    trigger: "Monotonic decreasing stack: Maintain temperatures in descending order. When a warmer day arrives, pop all cooler days and record their delta.",
    whyThisPattern: "Finds the 'next greater element' for each element in O(N) total amortized time.",
    keyInvariant: "Stack elements are strictly decreasing from bottom to top.",
  },
  84: {
    questionId: 84,
    trigger: "Histogram bounding boundaries: A bar height[i] can only expand horizontally until it hits the first shorter bar to its left and right.",
    whyThisPattern: "Monotonic increasing stack finds both bounding limits for every bar in single pass.",
    keyInvariant: "When a shorter bar is encountered, the popped bar's area can be completely calculated.",
  },

  // Tree DFS & BFS
  104: {
    questionId: 104,
    trigger: "Bottom-up recursion: Height of a tree is 1 + max(depth(left), depth(right)).",
    whyThisPattern: "Post-order DFS naturally returns subproblem answers up the tree.",
    keyInvariant: "A null node has depth 0; a leaf has depth 1.",
  },
  124: {
    questionId: 124,
    trigger: "Return one value, record another: Return the max single-path branch to the parent, but update globalMax with (left + right + root.val).",
    whyThisPattern: "A path cannot bifurcate at parent, but the current node can be the apex of the path.",
    keyInvariant: "Negative branch sums are clamped to 0: max(0, dfs(child)).",
  },
  102: {
    questionId: 102,
    trigger: "Level-size queue snapshot: At start of each while loop iteration, size = queue.length represents exactly one tree depth level.",
    whyThisPattern: "Maintains level-by-level segregation in FIFO queue.",
    keyInvariant: "Looping exactly `size` times processes the entire current level before children are visited.",
  },

  // Graph Traversal
  200: {
    questionId: 200,
    trigger: "Connected component sink: When a land cell '1' is found, increment islands count and BFS/DFS to flood-fill and mutate all connected cells to '0'.",
    whyThisPattern: "Prevents revisiting cells and avoids allocating a separate visited matrix.",
    keyInvariant: "Every connected component is visited and collapsed exactly once.",
  },
  994: {
    questionId: 994,
    trigger: "Multi-source simultaneous BFS: Enqueue ALL rotten oranges at t=0 simultaneously, then advance time minute-by-minute.",
    whyThisPattern: "Single-source BFS would give wrong order; multi-source BFS expands all rot fronts concurrently.",
    keyInvariant: "All oranges reached in wave t were infected at the exact same minute.",
  },

  // Topological Sort
  207: {
    questionId: 207,
    trigger: "DAG dependency in-degree reduction: Calculate in-degrees. Enqueue all courses with in-degree 0. As each finishes, decrement neighbors' in-degrees.",
    whyThisPattern: "Kahn's algorithm detects cycles: if processed count < total courses, a dependency deadlock exists.",
    keyInvariant: "Only nodes with zero unsatisfied prerequisites are enqueued.",
  },

  // Dynamic Programming
  322: {
    questionId: 322,
    trigger: "Unbounded Knapsack: dp[i] = min(dp[i - coin] + 1) for all allowed coin values. Iterate amounts from 1 to target.",
    whyThisPattern: "Overlapping subproblems: the minimum coins for amount 11 reuses optimal solutions for amounts 10, 9, 6.",
    whenItBreaks: "Greedy choice (taking largest coin) fails on arbitrary denominations (e.g. coins=[1,3,4], amount=6: greedy gives 4+1+1=3, optimal is 3+3=2).",
    keyInvariant: "dp[i] stores the mathematically verified minimal coins for exact value i.",
  },
  300: {
    questionId: 300,
    trigger: "Patience sorting / Binary search DP: Maintain tails array where tails[len] is the smallest tail of all increasing subsequences of that length.",
    whyThisPattern: "O(N log N) using binary search (bisect_left) on monotonic tails array, compared to O(N^2) tabular DP.",
    keyInvariant: "tails array is always strictly sorted, allowing binary search placement.",
  },

  // Backtracking
  46: {
    questionId: 46,
    trigger: "Choose / Explore / Un-choose: Use a visited boolean array or in-place swapping to build length-N permutations.",
    whyThisPattern: "Exhaustive combinatorial search where each state is reversible via backtracking step.",
    keyInvariant: "Current path always contains unique elements from the prefix choice tree.",
  },

  // Greedy
  55: {
    questionId: 55,
    trigger: "Forward reachability horizon: Track maxReach = max(maxReach, i + nums[i]). If current index i > maxReach, further progress is impossible.",
    whyThisPattern: "Exchange argument: you never need to backtrack; taking the furthest possible reach is always globally optimal.",
    keyInvariant: "All indices <= maxReach can be visited.",
  },

  // Union Find
  684: {
    questionId: 684,
    trigger: "Cycle on dynamic edge arrival: For each edge (u, v), if find(u) === find(v), they are already connected; this edge creates the cycle.",
    whyThisPattern: "Near O(1) amortized cycle detection via path compression and union by rank.",
    keyInvariant: "Roots define disjoint connected components.",
  },

  // Bit Manipulation
  136: {
    questionId: 136,
    trigger: "XOR self-cancellation: x ^ x = 0 and x ^ 0 = x. XORing all numbers together cancels all pairs and leaves the unique single number.",
    whyThisPattern: "O(N) time with strictly O(1) auxiliary space without hash sets or sorting.",
    keyInvariant: "XOR is commutative and associative: order of elements does not matter.",
  },

  // Dynamic Programming (Advanced Additions)
  312: {
    questionId: 312,
    trigger: "Reverse thinking: Instead of choosing which balloon to burst FIRST, choose which balloon k to burst LAST in range (i, j).",
    whyThisPattern: "Bursting forward creates dependent, non-contiguous subproblems; bursting last ensures subproblems (i, k) and (k, j) remain strictly independent.",
    whenItBreaks: "Forward simulation breaks because bursting removes walls between previously distant neighbors.",
    keyInvariant: "dp[i][j] = max_{i < k < j}(dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j]).",
  },
  10: {
    questionId: 10,
    trigger: "Wildcard matching state: When p[j+1] == '*', we can either ignore p[j..j+1] (dp(i, j+2)) or match one character if s[i] matches p[j] (dp(i+1, j)).",
    whyThisPattern: "2D DP memoizes overlapping character prefixes and handles arbitrary zero-or-more quantifier branching.",
    keyInvariant: "dp[i][j] is true if and only if s[i:] matches p[j:].",
  },
  188: {
    questionId: 188,
    trigger: "State Machine DP: Maintain buy[k] and sell[k] states across at most k transactions. If k >= n/2, greedily accumulate all upward price movements.",
    whyThisPattern: "State compression allows computing optimal transactions in O(k * n) time and O(k) space.",
    keyInvariant: "sell[t] = max(sell[t], buy[t] + price), buy[t] = max(buy[t], sell[t-1] - price).",
  },

  // Tries (Prefix Trees)
  208: {
    questionId: 208,
    trigger: "Common prefix branch tree: Each character branches to child nodes; exact search checks isEnd, while startsWith checks path existence.",
    whyThisPattern: "Provides strictly O(L) insertion, search, and prefix queries independent of dictionary size N.",
    whenItBreaks: "Hash Sets achieve O(L) exact search with less memory, but CANNOT perform prefix queries without O(N * L) scans.",
    keyInvariant: "Every node at depth d uniquely represents the prefix formed by characters along the path from root.",
  },
  211: {
    questionId: 211,
    trigger: "Wildcard '.' branching: Standard characters follow single child pointer; '.' fans out to all non-null children with DFS recursion.",
    whyThisPattern: "Prunes invalid prefixes immediately while recursively exploring all branches for wildcard slots.",
    keyInvariant: "A dot matches any active child; non-dot characters match strictly one child index.",
  },
  212: {
    questionId: 212,
    trigger: "Grid DFS guided by Trie: Build a Trie of the dictionary words and explore the 2D matrix once, stepping along Trie nodes.",
    whyThisPattern: "Searching board for each word takes O(W * M * N * 4^L); stepping board against Trie takes O(M * N * 4^L) by pruning invalid prefixes early.",
    keyInvariant: "Board DFS only moves to adjacent cells that exist as valid children of current TrieNode.",
  },
  648: {
    questionId: 648,
    trigger: "Shortest prefix root match: Insert root dictionary into Trie. For each sentence word, walk the Trie and stop at the first node with isEnd = true.",
    whyThisPattern: "Finds the shortest root prefix in O(L) time without checking all candidate roots.",
    keyInvariant: "First encountered isEnd = true node along word path is its shortest root.",
  },
  677: {
    questionId: 677,
    trigger: "Prefix score accumulation: Store running score sum on each TrieNode along the word path to answer sum(prefix) in O(L) time.",
    whyThisPattern: "Augmenting Trie nodes with aggregate values converts O(N) prefix searches into instant O(L) lookups.",
    keyInvariant: "Node score equals the sum of all word values residing in its subtree.",
  },

  // Dijkstra's Shortest Path
  743: {
    questionId: 743,
    trigger: "Weighted non-negative edges: Greedily extract minimum tentative distance node from Min-Heap to finalize shortest path.",
    whyThisPattern: "Greedy relaxation guarantees the popped node cannot be reached via any shorter alternative path.",
    whenItBreaks: "Negative edge weights violate the greedy non-decreasing distance assumption (use Bellman-Ford).",
    keyInvariant: "When node u is popped from min-heap, dist[u] is permanently optimal.",
  },
  787: {
    questionId: 787,
    trigger: "Constrained edge-count shortest path: Track stops in priority queue state or run K+1 Bellman-Ford rounds to avoid premature pruning.",
    whyThisPattern: "A route with higher cost but fewer stops must not be discarded if it enables reaching the destination within K stops.",
    keyInvariant: "After round r, dist[u] stores the cheapest price to reach u using at most r flights.",
  },
  1514: {
    questionId: 1514,
    trigger: "Multiplicative monotonic decrease: Edge probabilities <= 1 mean path probability monotonically shrinks; use Dijkstra with Max-Heap!",
    whyThisPattern: "Multiplying fractions produces non-increasing values, making Max-Heap Dijkstra equivalent to shortest path.",
    whenItBreaks: "If probabilities were > 1, multiplication would create positive cycles and Dijkstra would fail.",
    keyInvariant: "When node u is popped from max-heap, prob[u] is permanently maximal.",
  },
  1631: {
    questionId: 1631,
    trigger: "Minimax grid path: Dijkstra relaxation where edge cost is max(current_effort, abs(height_diff)). Min-Heap prioritizes smallest effort.",
    whyThisPattern: "Dijkstra naturally generalizes to minimax bottleneck paths where edge evaluation uses max() instead of +.",
    keyInvariant: "Popped cell effort is the minimal maximum-edge-difference achievable from top-left.",
  },
};

/**
 * Retrieve trigger insight for a question ID with fallback to subpattern/pattern description
 */
export function getPatternTrigger(questionId: number, subpatternLabel?: string): PatternTrigger | undefined {
  if (PATTERN_TRIGGERS[questionId]) {
    return PATTERN_TRIGGERS[questionId];
  }
  if (subpatternLabel) {
    return {
      questionId,
      trigger: `Key intuition: Apply the ${subpatternLabel} approach to decompose this problem into stateful invariants.`,
      whyThisPattern: `Focuses on ${subpatternLabel} to eliminate redundant states and prune the search space.`,
      keyInvariant: `Maintain invariant state transitions as the algorithm sweeps or recurses.`,
    };
  }
  return undefined;
}
