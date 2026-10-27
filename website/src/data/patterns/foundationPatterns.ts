import type { PatternLearningContent } from '../../types/patterns';

export const FOUNDATION_PATTERNS: PatternLearningContent[] = [
  // 1. Hashing & Frequency Counting
  {
    slug: 'hashing-and-frequency-counting',
    title: 'Hashing & Frequency Counting',
    level: 'Foundation',
    category: 'Hash Tables & Arrays',
    prerequisites: ['Arrays', 'Basic Math', 'Key-Value Dictionaries'],
    companiesTop: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    introTitle: 'What is Hashing & Frequency Counting?',
    introDescription: [
      'Hashing is an algorithmic technique that maps arbitrary data elements (integers, strings, objects) to fixed-size table indices using a deterministic hash function. It directly trades auxiliary memory for execution speed, converting quadratic O(N²) pair searches into amortized linear O(N) operations.',
      'Frequency counting utilizes hash maps or bounded direct-access arrays (e.g. an integer array of size 26 for lowercase English letters) to record how many times each unique value appears. This permits instantaneous O(1) checks for duplicates, complement values, anagram groupings, and subset containment.',
    ],
    motivatingProblem: {
      title: 'Two Sum (LeetCode #1)',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      naiveApproach: 'Brute force checks every possible pair (i, j) with nested loops: O(N²) time complexity and O(1) space.',
      optimalApproach: 'Maintain a hash map storing {number: index}. For each element x, query if (target - x) already exists in the map in O(1) time. Total time complexity drops to O(N) with O(N) space.',
    },
    applicabilityInvariant: 'Hashing applies whenever an algorithm needs to test membership, query precomputed values, or verify complement relationships in expected O(1) time without requiring elements to remain in sorted order.',
    signals: [
      'Problem asks to find a pair, triplet, or combination summing to a target',
      'Problem involves counting frequencies or identifying the most/least frequent elements',
      'Strings require checking for anagrams, permutations, or isomorphic mappings',
      'Array requires identifying duplicates or finding the first unique item',
    ],
    antiSignals: [
      'The problem requires dynamic range minimum/maximum queries (use Segment Tree or Sparse Table)',
      'The problem requires finding predecessor or successor in sorted order (use Balanced BST)',
      'Memory constraints are strictly bounded to O(1) without hash overhead (use Sorting + Two Pointers)',
    ],
    coreTechniqueTitle: 'The Complement Lookup Invariant',
    coreTechniqueDescription: 'Instead of searching forward for future matching values, each element queries whether its required complement was already encountered in the past.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Initialize Hash Structure',
        description: 'Create an empty hash map to store seen values and their metadata (index or occurrence count).',
      },
      {
        title: 'Step 2: Single Linear Pass',
        description: 'Iterate through the array one element at a time from left to right.',
      },
      {
        title: 'Step 3: Query Complement in O(1)',
        description: 'Calculate complement = target - nums[i]. Check if complement exists in the hash map.',
      },
      {
        title: 'Step 4: Record Current Value',
        description: 'If complement is not found, insert nums[i] -> i into the map and proceed to the next element.',
      },
    ],
    loopInvariant: 'At index i, the hash map contains precisely all elements nums[0 ... i-1] and their corresponding indices, guaranteeing no element is paired with itself.',
    variations: [
      {
        id: 'complement-lookup',
        title: 'Target Complement Lookup',
        description: 'Querying if target - current exists in map to resolve pair equations in one pass.',
        exampleProblem: 'LeetCode #1: Two Sum',
        keyIdea: 'Transform search from O(N) forward scan to O(1) backward hash lookup.',
      },
      {
        id: 'frequency-signature',
        title: 'Frequency Array & Anagram Signatures',
        description: 'Using character frequency signatures (tuple or sorted string) as map keys to group related items.',
        exampleProblem: 'LeetCode #49: Group Anagrams',
        keyIdea: 'Two strings are anagrams if and only if their 26-element character count tuples are identical.',
      },
      {
        id: 'prefix-hash',
        title: 'Prefix Sum Frequency Map',
        description: 'Tracking frequencies of cumulative prefix sums to count subarrays summing to K in O(N) time.',
        exampleProblem: 'LeetCode #560: Subarray Sum Equals K',
        keyIdea: 'Any prior prefix sum equal to P[i] - K forms a valid subarray summing to K.',
      },
    ],
    pythonTemplate: `def two_sum_hash(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    tsTemplate: `function twoSumHash(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    pythonBrute: `def twoSum(nums: list[int], target: int) -> list[int]:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    tsBrute: `function twoSum(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
    bruteComplexity: {
      time: 'O(N²)',
      space: 'O(1)',
      notes: 'Tests all pairs with two nested loops without recording previously seen values.',
    },
    bruteExplanation: 'Evaluate all pairs using nested loops without recording previously seen elements in memory.',
    exampleProblemTitle: 'Two Sum (LeetCode #1)',
    exampleProblemDescription: 'Find indices of two numbers in an array that add up to a specified target value.',
    pythonExample: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    tsExample: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    codeExplanation: [
      'Create a dictionary/Map `seen` mapping numbers to their indices.',
      'Iterate through `nums` with index `i` and value `num`.',
      'Compute `complement = target - num`.',
      'Check if `complement` exists in `seen` in O(1) expected time. If so, return `[seen[complement], i]`.',
      'Store `seen[num] = i` so subsequent elements can pair with `num`.',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(N)',
      notes: 'Each lookup and insertion takes amortized O(1) time. The hash map stores at most N entries.',
    },
    pitfalls: [
      'Storing the current element before checking complement can cause an element to pair with itself (e.g. target 6 with single element 3).',
      'Forgetting that hash table worst-case is O(N) when pathological hash collisions occur (rare in practice with randomized universal hashing).',
      'Using mutable objects as dictionary keys in Python/TypeScript without custom serialization.',
    ],
    visualizerTitle: 'Hash Table Complement Lookup Visualizer',
    visualizerSubtitle: 'Watch elements enter the hash map and trigger an instantaneous O(1) complement match.',
    mappings: [
      { questionId: 1, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'complement-lookup', subpatternLabel: 'Complement Lookup', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 242, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'frequency-signature', subpatternLabel: 'Frequency Counting', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 383, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'frequency-signature', subpatternLabel: 'Frequency Counting', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 387, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'frequency-signature', subpatternLabel: 'Frequency Counting', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 350, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'frequency-signature', subpatternLabel: 'Frequency Counting', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 169, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'frequency-signature', subpatternLabel: 'Frequency Counting', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 49, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'frequency-signature', subpatternLabel: 'Anagram Groups', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 128, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'set-lookup', subpatternLabel: 'Set Sequences', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 451, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'frequency-signature', subpatternLabel: 'Frequency Sort', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 560, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'prefix-hash', subpatternLabel: 'Prefix Hash Map', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 12, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'complement-lookup', subpatternLabel: 'Lookup Tables', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 146, primaryPattern: 'hashing-and-frequency-counting', subpattern: 'complement-lookup', subpatternLabel: 'Hash Map + Linked List', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'complement-lookup', label: 'Complement Lookup' },
      { id: 'lookup-table', label: 'Lookup Table & Conversion' },
      { id: 'frequency-signature', label: 'Frequency Counting' },
      { id: 'set-lookup', label: 'Set Sequences' },
      { id: 'prefix-hash', label: 'Prefix Hash Map' },
    ],
    quiz: [
      {
        id: 'hfc-q1',
        question: 'What is the primary advantage of storing seen elements in a hash map when looking for pairs that sum to a target?',
        options: [
          { id: 'opt-a', text: 'It sorts the elements in logarithmic time.' },
          { id: 'opt-b', text: 'It reduces the pair search from O(N²) to O(N) by turning inner linear searches into O(1) expected lookups.' },
          { id: 'opt-c', text: 'It completely eliminates all memory allocation.' },
          { id: 'opt-d', text: 'It guarantees O(1) worst-case time under all adversarial hash distributions.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'By remembering prior elements in a hash map, testing if (target - num) exists takes expected O(1) amortized time instead of scanning the rest of the array in O(N). Across N elements, total time is O(N).',
      },
      {
        id: 'hfc-q2',
        question: 'Why should you check for the complement in the hash map BEFORE inserting the current element in Two Sum?',
        options: [
          { id: 'opt-a', text: 'To avoid syntax errors in Python and TypeScript.' },
          { id: 'opt-b', text: 'To prevent an element from matching with itself when target equals 2 * nums[i].' },
          { id: 'opt-c', text: 'Because hash maps cannot store elements at index 0.' },
          { id: 'opt-d', text: 'To sort the hash keys in descending order.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'If you insert nums[i] first and target = 2 * nums[i] (e.g., target = 6 and nums[i] = 3), searching for complement 6 - 3 = 3 will immediately match the element you just inserted, producing an invalid pair of the same index [i, i].',
      },
      {
        id: 'hfc-q3',
        question: 'When grouping anagrams (e.g. LeetCode #49), why is a 26-element character count tuple often preferred over sorting each string?',
        options: [
          { id: 'opt-a', text: 'Counting characters takes O(K) time per word where K is word length, whereas sorting takes O(K log K).' },
          { id: 'opt-b', text: 'Tuples use zero bytes of memory.' },
          { id: 'opt-c', text: 'Sorted strings cannot be used as dictionary keys in Python.' },
          { id: 'opt-d', text: 'Hash tables only accept integer keys.' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'For a string of length K with lowercase English characters, counting frequencies takes O(K) linear time with an integer array of size 26. Sorting the string takes O(K log K). For large strings, the linear count tuple is asymptotically faster.',
      },
    ],
  },

  // 2. Two Pointers
  {
    slug: 'two-pointers',
    title: 'Two Pointers',
    level: 'Foundation',
    category: 'Arrays & Strings',
    prerequisites: ['Arrays', 'Sorting Basics', 'Loop Invariants'],
    companiesTop: ['Meta', 'Amazon', 'Apple', 'Bloomberg'],
    introTitle: 'What is the Two Pointers Technique?',
    introDescription: [
      'The Two Pointers pattern utilizes two memory indices (pointers) that navigate through a data structure—typically in opposite directions (converging inward) or in the same direction at varying rates (fast and slow / read and write).',
      'By capitalizing on mathematical monotonicity (especially in sorted arrays), each pointer movement permanently eliminates an entire row or column of potential candidate solutions without computing them, transforming brute force quadratic O(N²) problems into linear O(N) single-pass solutions.',
    ],
    motivatingProblem: {
      title: 'Two Sum II - Input Array Is Sorted (LeetCode #167)',
      description: 'Given a 1-indexed sorted array of integers nums, find two numbers that add up to a specific target number.',
      naiveApproach: 'Examine all N*(N-1)/2 pairs with nested loops: O(N²) time complexity.',
      optimalApproach: 'Place left at index 0 and right at index N-1. If nums[left] + nums[right] < target, advance left. If > target, retreat right. Discards candidate search space in O(N) time and O(1) space.',
    },
    applicabilityInvariant: 'Two Pointers applies when candidate evaluations exhibit monotonicity: incrementing or decrementing a pointer deterministically increases or decreases the evaluated metric, proving no skipped pairings could be optimal.',
    signals: [
      'The array is sorted, or sorting the array is permitted without violating constraints',
      'Finding pairs or triplets satisfying equality or inequality constraints (e.g. 3Sum)',
      'In-place array modifications (e.g. removing duplicates or zeroes in O(1) memory)',
      'Comparing string characters from extremities (e.g. Valid Palindrome)',
    ],
    antiSignals: [
      'The array is unsorted and relative original index ordering must be preserved',
      'Finding non-monotonic aggregations where moving a pointer could both increase or decrease results',
      'Searching arbitrary subsequences requiring combinatorial branching (use Backtracking or DP)',
    ],
    coreTechniqueTitle: 'Opposite-Direction Converging Pointers',
    coreTechniqueDescription: 'Pointers start at opposite ends of a sorted array and converge toward each other based on comparison against the target value.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Position Extremities',
        description: 'Initialize left = 0 and right = nums.length - 1.',
      },
      {
        title: 'Step 2: Evaluate Monotonic Sum',
        description: 'Compute current_sum = nums[left] + nums[right]. Compare with target.',
      },
      {
        title: 'Step 3: Eliminate Suboptimal Subspace',
        description: 'If sum < target: left must increase (left++). If sum > target: right must decrease (right--).',
      },
      {
        title: 'Step 4: Convergence Termination',
        description: 'Terminate when left >= right or target match is discovered.',
      },
    ],
    loopInvariant: 'At any step, the optimal solution (if one exists) is guaranteed to lie within the active index interval [left, right]; all pairs involving discarded indices outside this interval have been proven invalid.',
    variations: [
      {
        id: 'converging-pointers',
        title: 'Opposite-Direction Converging',
        description: 'Pointers start at 0 and N-1 moving inward on sorted data.',
        exampleProblem: 'LeetCode #167: Two Sum II',
        keyIdea: 'Monotonic sum eliminates entire rows/columns of candidate matrix in O(1).',
      },
      {
        id: 'fast-slow-read-write',
        title: 'Same-Direction Read/Write',
        description: 'Slow pointer marks write boundary; fast pointer scans elements.',
        exampleProblem: 'LeetCode #26: Remove Duplicates from Sorted Array',
        keyIdea: 'Modify arrays in-place with O(1) auxiliary memory by separating scanner from writer.',
      },
      {
        id: 'three-way-partition',
        title: 'Dutch National Flag (3-Way Partition)',
        description: 'Three pointers (low, mid, high) partition elements into 3 distinct sections.',
        exampleProblem: 'LeetCode #75: Sort Colors',
        keyIdea: 'Single-pass sorting in O(N) time and O(1) space with 3 directional pointers.',
      },
    ],
    pythonTemplate: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1
    while left < right:
        cur_sum = nums[left] + nums[right]
        if cur_sum == target:
            return [left + 1, right + 1]
        elif cur_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
    tsTemplate: `function twoSumSorted(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}`,
    pythonBrute: `def twoSum(numbers: list[int], target: int) -> list[int]:
    n = len(numbers)
    for i in range(n):
        for j in range(i + 1, n):
            if numbers[i] + numbers[j] == target:
                return [i + 1, j + 1]  # 1-indexed
    return []`,
    tsBrute: `function twoSum(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) {
        return [i + 1, j + 1]; // 1-indexed
      }
    }
  }
  return [];
}`,
    bruteComplexity: {
      time: 'O(N²)',
      space: 'O(1)',
      notes: 'Exhaustively checks all N*(N-1)/2 pairs in quadratic time, ignoring array sortedness.',
    },
    bruteExplanation: 'Check every pair of elements using nested loops, ignoring that the input array is already sorted.',
    exampleProblemTitle: 'Two Sum II - Input Array Is Sorted (LeetCode #167)',
    exampleProblemDescription: 'Find two numbers in a sorted array that sum to target, returning 1-indexed locations.',
    pythonExample: `def twoSum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]
        elif s < target:
            l += 1
        else:
            r -= 1
    return []`,
    tsExample: `function twoSum(numbers: number[], target: number): number[] {
  let l = 0;
  let r = numbers.length - 1;
  while (l < r) {
    const s = numbers[l] + numbers[r];
    if (s === target) {
      return [l + 1, r + 1];
    } else if (s < target) {
      l++;
    } else {
      r--;
    }
  }
  return [];
}`,
    codeExplanation: [
      'Initialize left pointer at 0 and right pointer at len - 1.',
      'Check sum = numbers[l] + numbers[r].',
      'If sum equals target, return 1-based indices [l + 1, r + 1].',
      'If sum < target, advance l++ to increase sum.',
      'If sum > target, retreat r-- to decrease sum.',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(1)',
      notes: 'Each step moves at least one pointer inward, guaranteeing at most N pointer movements with zero heap allocations.',
    },
    pitfalls: [
      'Using left <= right instead of left < right can cause pairing an element with itself.',
      'Failing to sort the array before applying converging pointers on unsorted inputs.',
      'In 3Sum, forgetting to skip duplicate values for both outer and inner loops produces duplicate triplets.',
    ],
    visualizerTitle: 'Two Pointers Converging Search Visualizer',
    visualizerSubtitle: 'Observe left and right pointers eliminate impossible pairs in a sorted array.',
    mappings: [
      { questionId: 167, primaryPattern: 'two-pointers', subpattern: 'converging-pointers', subpatternLabel: 'Opposite Direction', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 125, primaryPattern: 'two-pointers', subpattern: 'converging-pointers', subpatternLabel: 'Palindrome Check', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 26, primaryPattern: 'two-pointers', subpattern: 'fast-slow-read-write', subpatternLabel: 'In-Place Modification', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 27, primaryPattern: 'two-pointers', subpattern: 'fast-slow-read-write', subpatternLabel: 'In-Place Modification', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 283, primaryPattern: 'two-pointers', subpattern: 'fast-slow-read-write', subpatternLabel: 'In-Place Modification', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 977, primaryPattern: 'two-pointers', subpattern: 'converging-pointers', subpatternLabel: 'Opposite Direction', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 11, primaryPattern: 'two-pointers', subpattern: 'converging-pointers', subpatternLabel: 'Greedy Converging', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 15, primaryPattern: 'two-pointers', subpattern: 'converging-pointers', subpatternLabel: 'Triplets & Deduplication', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 16, primaryPattern: 'two-pointers', subpattern: 'converging-pointers', subpatternLabel: 'Closest Target', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 75, primaryPattern: 'two-pointers', subpattern: 'three-way-partition', subpatternLabel: 'Dutch National Flag', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 18, primaryPattern: 'two-pointers', subpattern: 'converging-pointers', subpatternLabel: 'K-Sum Extension', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 42, primaryPattern: 'two-pointers', subpattern: 'converging-pointers', subpatternLabel: 'Elevation Trapping', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'converging-pointers', label: 'Converging Pointers' },
      { id: 'fast-slow-read-write', label: 'Read/Write In-Place' },
      { id: 'three-way-partition', label: '3-Way Partition' },
    ],
    quiz: [
      {
        id: 'tp-q1',
        question: 'Why does advancing the left pointer in Two Sum II guarantee that no valid solutions are accidentally skipped?',
        options: [
          { id: 'opt-a', text: 'Because JavaScript guarantees ascending memory layout.' },
          { id: 'opt-b', text: 'Because the array is sorted: if nums[left] + nums[right] < target, then nums[left] added to ANY element before right will be even smaller than target.' },
          { id: 'opt-c', text: 'Because pointers move in opposite directions at double speed.' },
          { id: 'opt-d', text: 'Because hash sets prevent collisions.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Due to monotonicity in a sorted array, for any k <= right, nums[left] + nums[k] <= nums[left] + nums[right] < target. Thus, no element in the entire remaining subarray can pair with nums[left] to reach target.',
      },
      {
        id: 'tp-q2',
        question: 'In Container With Most Water (LeetCode #11), which pointer should you move inward at each step?',
        options: [
          { id: 'opt-a', text: 'Always move the left pointer.' },
          { id: 'opt-b', text: 'Always move the taller line to increase potential height.' },
          { id: 'opt-c', text: 'Always move the shorter line, because moving the taller line can only decrease width without increasing bounding height.' },
          { id: 'opt-d', text: 'Randomly choose between the two pointers.' },
        ],
        correctOptionId: 'opt-c',
        explanation: 'Area is bounded by min(height[left], height[right]) * width. Moving the taller line reduces width while the height remains constrained by the shorter line, guaranteeing an area strictly smaller. Only moving the shorter line provides any opportunity to discover a taller boundary that compensates for lost width.',
      },
      {
        id: 'tp-q3',
        question: 'In the Three Sum problem (LeetCode #15), how do you prevent duplicate triplets without using an auxiliary hash set?',
        options: [
          { id: 'opt-a', text: 'By sorting the array and advancing the pointers past duplicate values after finding each valid triplet.' },
          { id: 'opt-b', text: 'By skipping all negative numbers in the outer loop.' },
          { id: 'opt-c', text: 'By resetting both pointers to index 0 after each match.' },
          { id: 'opt-d', text: 'By reversing the array before processing.' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'After sorting, duplicate numbers are adjacent. In the outer loop, skip nums[i] if nums[i] == nums[i - 1]. In the two-pointer inner loop, after recording a valid triplet, advance left while nums[left] == nums[left - 1] and decrement right while nums[right] == nums[right + 1].',
      },
    ],
  },

  // 3. Sliding Window (Preserves existing curriculum)
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    level: 'Foundation',
    category: 'Arrays & Strings',
    prerequisites: ['Arrays', 'Two Pointers Basics', 'Hash Maps'],
    companiesTop: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
    introTitle: 'What is a Sliding Window?',
    introDescription: [
      'The Sliding Window technique is an algorithmic pattern designed to convert inefficient nested-loop calculations over contiguous sequences (subarrays or substrings) into linear time O(N) solutions.',
      'Instead of recalculating overlapping portions of the data structure from scratch every time, a "window" of elements maintains a rolling state. When moving the window forward, subtract or remove the exiting element on the left, add the entering element on the right, and update the target metric in O(1) amortized time.',
    ],
    motivatingProblem: {
      title: 'Maximum Average Subarray I (LeetCode #643)',
      description: 'Find a contiguous subarray of size k whose average value is maximum, and return this value.',
      naiveApproach: 'For every index i from 0 to n-k, sum elements from i to i+k-1: O(N * K) time complexity.',
      optimalApproach: 'Compute initial sum of first k elements. For each subsequent step, window_sum = window_sum - nums[i-k] + nums[i]. Runs in O(N) time with O(1) space.',
    },
    applicabilityInvariant: 'Sliding Window requires that window state transitions are locally invertible or incrementally composable (adding an entering element and removing an exiting element takes O(1)) and that valid window boundaries satisfy monotonic expansion/contraction invariants.',
    signals: [
      'Contiguous subarray or substring problems',
      'Window of fixed size k',
      'Longest substring with at most k distinct characters',
      'Minimum size subarray whose sum >= target with positive numbers',
    ],
    antiSignals: [
      'Non-contiguous subsequences (use DP or Greedy)',
      'Negative numbers in variable sum problems (breaks monotonicity; use Prefix Sum + Monotonic Deque or Hash Map)',
      'Arbitrary range minimums without monotonic deque',
    ],
    coreTechniqueTitle: 'Fixed and Variable Window Formulation',
    coreTechniqueDescription: 'Fixed windows slide by maintaining constant length k; variable windows expand with the right pointer and contract with the left pointer when conditions are violated.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Expand Window Boundary',
        description: 'Incorporate nums[right] into the rolling window state (sum, character frequency table, or distinct count).',
      },
      {
        title: 'Step 2: Contract from Left on Invariant Violation',
        description: 'While the window condition is violated (or to find minimal valid length), evict nums[left] and increment left.',
      },
      {
        title: 'Step 3: Evaluate & Record Optimal Metric',
        description: 'Update the target answer (e.g. max_len = max(max_len, right - left + 1)) in O(1) time.',
      },
    ],
    loopInvariant: 'At step right, the window [left, right] contains all valid contiguous elements and its rolling accumulator accurately reflects the exact sum/frequency of these elements.',
    variations: [
      {
        id: 'fixed-window',
        title: 'Fixed-Size Window',
        description: 'Window size k is constant throughout execution.',
        exampleProblem: 'LeetCode #643: Maximum Average Subarray I',
        keyIdea: 'Add nums[i] and subtract nums[i - k] in O(1) per step.',
      },
      {
        id: 'variable-window',
        title: 'Variable-Size Window',
        description: 'Dynamic expansion with right pointer, condition contraction with left pointer.',
        exampleProblem: 'LeetCode #209: Minimum Size Subarray Sum',
        keyIdea: 'Requires non-negative elements to guarantee sum monotonicity.',
      },
      {
        id: 'frequency-window',
        title: 'Character Frequency Window',
        description: 'Sliding window tracking character counts or distinct symbols.',
        exampleProblem: 'LeetCode #3: Longest Substring Without Repeating Characters',
        keyIdea: 'Shrink left until all character counts inside window satisfy condition.',
      },
      {
        id: 'advanced-window',
        title: 'Advanced / Monotonic Deque',
        description: 'Sliding window maintaining extrema in O(1) amortized time.',
        exampleProblem: 'LeetCode #239: Sliding Window Maximum',
        keyIdea: 'Monotonic double-ended queue maintains window maximums in O(1).',
      },
    ],
    pythonTemplate: `def sliding_window_variable(nums: list[int], k: int) -> int:
    """Canonical variable-size sliding window template.
    Example: Longest subarray with sum at most k (for non-negative nums)."""
    left = 0
    current_sum = 0
    max_len = 0
    for right in range(len(nums)):
        # 1. Expand: Include nums[right] in current window
        current_sum += nums[right]
        # 2. Contract: Shrink from left while window invariant is violated
        while current_sum > k and left <= right:
            current_sum -= nums[left]
            left += 1
        # 3. Update answer with current valid window length (right - left + 1)
        max_len = max(max_len, right - left + 1)
    return max_len`,
    tsTemplate: `function slidingWindowVariable(nums: number[], k: number): number {
  let left = 0;
  let currentSum = 0;
  let maxLen = 0;
  for (let right = 0; right < nums.length; right++) {
    // 1. Expand: Include nums[right] in current window
    currentSum += nums[right];
    // 2. Contract: Shrink from left while window invariant is violated
    while (currentSum > k && left <= right) {
      currentSum -= nums[left];
      left++;
    }
    // 3. Update answer with current valid window length (right - left + 1)
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    pythonBrute: `def findMaxAverage(nums: list[int], k: int) -> float:
    n = len(nums)
    max_sum = float('-inf')
    for i in range(n - k + 1):
        window_sum = 0
        for j in range(i, i + k):
            window_sum += nums[j]
        max_sum = max(max_sum, window_sum)
    return max_sum / k`,
    tsBrute: `function findMaxAverage(nums: number[], k: number): number {
  let maxSum = -Infinity;
  for (let i = 0; i <= nums.length - k; i++) {
    let windowSum = 0;
    for (let j = i; j < i + k; j++) {
      windowSum += nums[j];
    }
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum / k;
}`,
    bruteComplexity: {
      time: 'O(N × K)',
      space: 'O(1)',
      notes: 'Recalculates the entire window sum of size K from scratch at every step.',
    },
    bruteExplanation: 'Recalculate sum of k elements for every window from scratch, performing redundant additions.',
    exampleProblemTitle: 'Maximum Average Subarray I (LeetCode #643)',
    exampleProblemDescription: 'Find maximum average of any contiguous subarray of size k.',
    pythonExample: `def findMaxAverage(nums: list[int], k: int) -> float:
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum / k`,
    tsExample: `function findMaxAverage(nums: number[], k: number): number {
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;
  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum / k;
}`,
    codeExplanation: [
      'Initialize windowSum by summing the first k elements.',
      'Set maxSum to windowSum.',
      'Slide the window: add nums[i] and subtract nums[i - k] in O(1) time.',
      'Update maxSum = max(maxSum, windowSum).',
      'Return maxSum / k.',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(1)',
      notes: 'Each element enters and exits the window at most once, yielding linear execution with constant extra memory.',
    },
    pitfalls: [
      'Applying variable window to sum problems with negative numbers breaks monotonicity.',
      'Believing window maximum can be tracked in O(1) with a single variable (requires monotonic deque).',
      'Off-by-one errors when computing window length: length is right - left + 1.',
    ],
    visualizerTitle: 'Sliding Window Interactive Visualizer',
    visualizerSubtitle: 'Step through rolling sum updates and window boundaries in real time.',
    mappings: [
      { questionId: 643, primaryPattern: 'sliding-window', subpattern: 'fixed-window', subpatternLabel: 'Fixed-Size Window', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 1456, primaryPattern: 'sliding-window', subpattern: 'fixed-window', subpatternLabel: 'Fixed-Size Window', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 2090, primaryPattern: 'sliding-window', subpattern: 'fixed-window', subpatternLabel: 'Fixed-Size Window', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 1423, primaryPattern: 'sliding-window', subpattern: 'fixed-window', subpatternLabel: 'Fixed-Size Window', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 3, primaryPattern: 'sliding-window', subpattern: 'variable-window', subpatternLabel: 'Variable-Size Window', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 209, primaryPattern: 'sliding-window', subpattern: 'variable-window', subpatternLabel: 'Variable-Size Window', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 1004, primaryPattern: 'sliding-window', subpattern: 'variable-window', subpatternLabel: 'Variable-Size Window', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 1208, primaryPattern: 'sliding-window', subpattern: 'variable-window', subpatternLabel: 'Variable-Size Window', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 904, primaryPattern: 'sliding-window', subpattern: 'frequency-window', subpatternLabel: 'Frequency & Character Counts', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 424, primaryPattern: 'sliding-window', subpattern: 'frequency-window', subpatternLabel: 'Frequency & Character Counts', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 567, primaryPattern: 'sliding-window', subpattern: 'frequency-window', subpatternLabel: 'Frequency & Character Counts', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 438, primaryPattern: 'sliding-window', subpattern: 'frequency-window', subpatternLabel: 'Frequency & Character Counts', learningOrder: 12, reviewStatus: 'verified' },
      { questionId: 76, primaryPattern: 'sliding-window', subpattern: 'advanced-window', subpatternLabel: 'Advanced / Multi-Condition', learningOrder: 13, reviewStatus: 'verified' },
      { questionId: 239, primaryPattern: 'sliding-window', subpattern: 'advanced-window', subpatternLabel: 'Advanced / Multi-Condition', learningOrder: 14, reviewStatus: 'verified' },
      { questionId: 1838, primaryPattern: 'sliding-window', subpattern: 'advanced-window', subpatternLabel: 'Advanced / Multi-Condition', learningOrder: 15, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'fixed-window', label: 'Fixed-Size' },
      { id: 'variable-window', label: 'Variable-Size' },
      { id: 'frequency-window', label: 'Frequency Counts' },
      { id: 'advanced-window', label: 'Advanced Window' },
    ],
    quiz: [
      {
        id: 'sw-q1',
        question: 'What is the primary advantage of the Sliding Window technique over brute force for contiguous subarrays?',
        options: [
          { id: 'opt-a', text: 'It sorts the elements to achieve logarithmic search time.' },
          { id: 'opt-b', text: 'It reuses overlapping computation between adjacent windows, reducing time complexity from O(N × K) or O(N²) to O(N).' },
          { id: 'opt-c', text: 'It allows examining non-contiguous subsequences without allocating extra memory.' },
          { id: 'opt-d', text: 'It converts recursive tree traversals into iterative stack structures.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Overlapping computation: as the window moves one position to the right, only two elements change. Updating state in O(1) drops complexity to linear O(N).',
      },
      {
        id: 'sw-q2',
        question: 'When solving Minimum Size Subarray Sum (LeetCode #209) with a variable-size sliding window, why must all array numbers be positive?',
        options: [
          { id: 'opt-a', text: 'Because negative numbers cause division-by-zero errors in JavaScript.' },
          { id: 'opt-b', text: 'Because positive numbers guarantee monotonicity: expanding increases the sum and shrinking decreases it.' },
          { id: 'opt-c', text: 'Because Python dictionaries cannot store negative keys.' },
          { id: 'opt-d', text: 'Because pointers would move backward.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Monotonicity is required. Negative numbers cause running sums to oscillate non-monotonically, breaking the greedy pointer contraction guarantee.',
      },
      {
        id: 'sw-q3',
        question: 'In a fixed-size window of size K, when the loop index i moves to the right, how do you correctly maintain the rolling sum?',
        options: [
          { id: 'opt-a', text: 'Recompute sum(nums[i - K + 1 ... i]) with a nested loop.' },
          { id: 'opt-b', text: 'Subtract nums[i] and add nums[i - K].' },
          { id: 'opt-c', text: 'Add nums[i] (entering element) and subtract nums[i - K] (leaving element).' },
          { id: 'opt-d', text: 'Divide the sum by K and add nums[i].' },
        ],
        correctOptionId: 'opt-c',
        explanation: 'When moving from window [i - K, i - 1] to [i - K + 1, i], element nums[i - K] exits the left boundary, and element nums[i] enters the right boundary: new_sum = current_sum + nums[i] - nums[i - K]. Takes O(1) time.',
      },
      {
        id: 'sw-q4',
        question: 'What is the overall time complexity of a standard variable-size sliding window where the inner while loop contracts the left pointer?',
        options: [
          { id: 'opt-a', text: 'O(N²) because of the nested while loop inside the for loop.' },
          { id: 'opt-b', text: 'O(N log N) due to pointer comparisons.' },
          { id: 'opt-c', text: 'O(N) amortized because each pointer (left and right) visits each array index at most once.' },
          { id: 'opt-d', text: 'O(2^N) in the worst case when the window contracts repeatedly.' },
        ],
        correctOptionId: 'opt-c',
        explanation: 'Across the entire execution, the right pointer advances N times and the left pointer advances at most N times. Total pointer operations: 2N = O(N) amortized time.',
      },
    ],
  },

  // 4. Prefix Sum
  {
    slug: 'prefix-sum',
    title: 'Prefix Sum',
    level: 'Foundation',
    category: 'Arrays & Math',
    prerequisites: ['Arrays', 'Basic Arithmetic', 'Cumulative Sums'],
    companiesTop: ['Google', 'Meta', 'Amazon', 'Uber'],
    introTitle: 'What is the Prefix Sum Pattern?',
    introDescription: [
      'The Prefix Sum pattern precomputes cumulative running totals of an array so that any subsequent range sum query over contiguous indices [L, R] can be answered in instant O(1) constant time.',
      'Instead of re-iterating over elements in range [L, R] taking O(R - L + 1) time per query, the range sum equals P[R + 1] - P[L], where P is a 1-indexed cumulative prefix sum array. Extended to difference arrays, it also enables O(1) batch range updates.',
    ],
    motivatingProblem: {
      title: 'Range Sum Query - Immutable (LeetCode #303)',
      description: 'Given an integer array nums, handle multiple queries of the sum of elements between indices left and right inclusive.',
      naiveApproach: 'For each query (L, R), sum nums[L ... R] with a loop: O(N) per query, leading to O(Q * N) for Q queries.',
      optimalApproach: 'Precompute prefix array P in O(N) time. Each query is computed as P[R + 1] - P[L] in O(1) constant time, leading to O(N + Q) overall.',
    },
    applicabilityInvariant: 'Prefix Sum applies when dealing with multiple range sum queries on static arrays, or when counting subarrays whose sums equal a target value even in the presence of negative numbers.',
    signals: [
      'Multiple range sum or range aggregate queries on static arrays',
      'Subarrays summing to target K where negative numbers prevent sliding window',
      '2D matrix sub-rectangle range queries',
      'Batch range additions via difference arrays',
    ],
    antiSignals: [
      'Frequent single-element mutations interspersed between queries (use Fenwick Tree or Segment Tree for O(log N) updates)',
      'Non-invertible aggregations like range minimum or range maximum (use Sparse Table or Segment Tree)',
    ],
    coreTechniqueTitle: 'The Inclusion-Exclusion Prefix Range Invariant',
    coreTechniqueDescription: 'The sum of elements from index L to R is identical to the total sum from 0 to R minus the total sum from 0 to L-1.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Allocate 1-Indexed Array',
        description: 'Create prefix array P of size N + 1 with base P[0] = 0.',
      },
      {
        title: 'Step 2: Cumulative Accumulation',
        description: 'For each i from 0 to N - 1: P[i + 1] = P[i] + nums[i].',
      },
      {
        title: 'Step 3: Answer Queries in O(1)',
        description: 'sum(L ... R) = P[R + 1] - P[L].',
      },
    ],
    loopInvariant: 'For any index k, P[k] holds the exact mathematical sum of nums[0 ... k-1], with P[0] = 0 representing the empty subarray.',
    variations: [
      {
        id: '1d-prefix',
        title: '1D Static Range Queries',
        description: 'O(1) range sum calculation via P[R + 1] - P[L].',
        exampleProblem: 'LeetCode #303: Range Sum Query - Immutable',
        keyIdea: 'Precompute cumulative running sum in O(N) once to answer Q queries in O(1) each.',
      },
      {
        id: 'prefix-hash-map',
        title: 'Prefix Sum + Hash Map',
        description: 'Count or find subarrays with exact sum K with negative numbers.',
        exampleProblem: 'LeetCode #560: Subarray Sum Equals K',
        keyIdea: 'Target sum is achieved when P[R] - P[L] = K => P[L] = P[R] - K in hash map.',
      },
      {
        id: '2d-prefix',
        title: '2D Matrix Prefix Sum',
        description: 'Sub-rectangle sum in O(1) using the 2D inclusion-exclusion principle.',
        exampleProblem: 'LeetCode #304: Range Sum Query 2D - Immutable',
        keyIdea: 'P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1].',
      },
      {
        id: 'difference-array',
        title: 'Difference Array (Range Updates)',
        description: 'Batch range additions in O(1) per update with single prefix reconstruction.',
        exampleProblem: 'LeetCode #1094: Car Pooling',
        keyIdea: 'Inclusive ranges [L, R] add at L and subtract at R+1 (e.g. #1109). Half-open intervals [from, to) add at from and subtract at to (e.g. #1094 Car Pooling, where passengers exit at stop to).',
      },
    ],
    pythonTemplate: `class NumArray:
    def __init__(self, nums: list[int]):
        self.prefix = [0]
        for x in nums:
            self.prefix.append(self.prefix[-1] + x)

    def sumRange(self, left: int, right: int) -> int:
        return self.prefix[right + 1] - self.prefix[left]`,
    tsTemplate: `class NumArray {
  private prefix: number[];

  constructor(nums: number[]) {
    this.prefix = [0];
    for (let i = 0; i < nums.length; i++) {
      this.prefix.push(this.prefix[this.prefix.length - 1] + nums[i]);
    }
  }

  sumRange(left: number, right: number): number {
    return this.prefix[right + 1] - this.prefix[left];
  }
}`,
    pythonBrute: `class NumArray:
    def __init__(self, nums: list[int]):
        self.nums = nums

    def sumRange(self, left: int, right: int) -> int:
        total = 0
        for i in range(left, right + 1):
            total += self.nums[i]
        return total`,
    tsBrute: `class NumArray {
  private nums: number[];
  constructor(nums: number[]) {
    this.nums = nums;
  }
  sumRange(left: number, right: number): number {
    let total = 0;
    for (let i = left; i <= right; i++) {
      total += this.nums[i];
    }
    return total;
  }
}`,
    bruteComplexity: {
      time: 'O(N) per query',
      space: 'O(1)',
      notes: 'Iterates through the range [left, right] on every query call.',
    },
    bruteExplanation: 'Iterate across the array between left and right on every query call, re-summing values from scratch.',
    exampleProblemTitle: 'Range Sum Query - Immutable (LeetCode #303)',
    exampleProblemDescription: 'Answer contiguous range sum queries in O(1) time after O(N) precomputation.',
    pythonExample: `class NumArray:
    def __init__(self, nums: list[int]):
        self.P = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.P[i + 1] = self.P[i] + nums[i]
            
    def sumRange(self, left: int, right: int) -> int:
        return self.P[right + 1] - self.P[left]`,
    tsExample: `class NumArray {
  private P: number[];
  constructor(nums: number[]) {
    this.P = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.P[i + 1] = this.P[i] + nums[i];
    }
  }
  sumRange(left: number, right: number): number {
    return this.P[right + 1] - this.P[left];
  }
}`,
    codeExplanation: [
      'Initialize prefix array P of length nums.length + 1 with P[0] = 0.',
      'Compute P[i + 1] = P[i] + nums[i] in a single linear pass.',
      'For any query (left, right), compute P[right + 1] - P[left] in O(1) time.',
    ],
    complexity: {
      time: 'O(N) precomputation, O(1) per query',
      space: 'O(N)',
      notes: 'Auxiliary array of size N + 1 stores prefix sums.',
    },
    pitfalls: [
      'Not using a 1-indexed prefix array forces special-case handling for left == 0.',
      'In languages with fixed-width integers, prefix sums of large arrays can overflow 32-bit signed integers.',
      'Trying to use prefix sums on dynamic arrays with frequent updates (updating P takes O(N) per write; use Fenwick Tree instead).',
    ],
    visualizerTitle: 'Prefix Sum Array & Range Query Visualizer',
    visualizerSubtitle: 'Step through cumulative prefix computation and watch O(1) range evaluation.',
    mappings: [
      { questionId: 303, primaryPattern: 'prefix-sum', subpattern: '1d-prefix', subpatternLabel: '1D Range Sum', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 724, primaryPattern: 'prefix-sum', subpattern: '1d-prefix', subpatternLabel: 'Pivot Index', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 1422, primaryPattern: 'prefix-sum', subpattern: '1d-prefix', subpatternLabel: 'Split Maximization', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 304, primaryPattern: 'prefix-sum', subpattern: '2d-prefix', subpatternLabel: '2D Matrix Queries', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 238, primaryPattern: 'prefix-sum', subpattern: '1d-prefix', subpatternLabel: 'Prefix/Suffix Products', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 560, primaryPattern: 'prefix-sum', subpattern: 'prefix-hash-map', subpatternLabel: 'Prefix Hash Map', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 525, primaryPattern: 'prefix-sum', subpattern: 'prefix-hash-map', subpatternLabel: 'Prefix Hash Map', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 523, primaryPattern: 'prefix-sum', subpattern: 'prefix-hash-map', subpatternLabel: 'Modulo Prefix', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 974, primaryPattern: 'prefix-sum', subpattern: 'prefix-hash-map', subpatternLabel: 'Modulo Prefix', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 1248, primaryPattern: 'prefix-sum', subpattern: 'prefix-hash-map', subpatternLabel: 'Odd Parity Counts', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 1094, primaryPattern: 'prefix-sum', subpattern: 'difference-array', subpatternLabel: 'Difference Array', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 1109, primaryPattern: 'prefix-sum', subpattern: 'difference-array', subpatternLabel: 'Difference Array', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: '1d-prefix', label: '1D Range Queries' },
      { id: 'prefix-hash-map', label: 'Prefix + Hash Map' },
      { id: '2d-prefix', label: '2D Matrix Prefix' },
      { id: 'difference-array', label: 'Difference Array' },
    ],
    quiz: [
      {
        id: 'ps-q1',
        question: 'Why is a 1-indexed prefix array P of length N + 1 with P[0] = 0 preferable to an N-element prefix array?',
        options: [
          { id: 'opt-a', text: 'It uses less memory than an N-element array.' },
          { id: 'opt-b', text: 'It allows querying range sum from index 0 without needing an if statement for out-of-bounds index L - 1.' },
          { id: 'opt-c', text: 'It sorts the elements automatically.' },
          { id: 'opt-d', text: 'It makes JavaScript run in multithreaded mode.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'When querying sum from 0 to R, the formula P[R + 1] - P[0] evaluates seamlessly to P[R + 1] - 0 without needing special-case branching.',
      },
      {
        id: 'ps-q2',
        question: 'Why can Subarray Sum Equals K (LeetCode #560) be solved with Prefix Sum + Hash Map even when array values are negative?',
        options: [
          { id: 'opt-a', text: 'Because negative numbers are converted to absolute values.' },
          { id: 'opt-b', text: 'Because addition and subtraction form an abelian group: P[R] - P[L] = K holds algebraically regardless of whether numbers are positive, negative, or zero.' },
          { id: 'opt-c', text: 'Because hash maps automatically sort negative numbers.' },
          { id: 'opt-d', text: 'Because the left pointer moves backward.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Prefix sums do not rely on monotonicity. They rely on algebraic subtraction: P[R] - P[L] = K is always true if and only if the subarray (L, R] sums to K.',
      },
      {
        id: 'ps-q3',
        question: 'What is the correct 2D prefix sum formula to query the sum of a subgrid defined by top-left (r1, c1) and bottom-right (r2, c2)?',
        options: [
          { id: 'opt-a', text: 'P[r2][c2] - P[r1][c1]' },
          { id: 'opt-b', text: 'P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1]' },
          { id: 'opt-c', text: 'P[r2][c2] + P[r1][c1] - P[r1][c2] - P[r2][c1]' },
          { id: 'opt-d', text: 'P[r2][c2] / (r2 - r1 + 1)' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'By the principle of inclusion-exclusion on a 2D cumulative sum grid, subtracting the top region and the left region subtracts the top-left overlapping corner twice, so it must be added back once: P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1].',
      },
    ],
  },

  // 5. Binary Search
  {
    slug: 'binary-search',
    title: 'Binary Search',
    level: 'Foundation',
    category: 'Searching & Arrays',
    prerequisites: ['Sorted Arrays', 'Divide and Conquer', 'Monotonic Predicates'],
    companiesTop: ['Google', 'Meta', 'Amazon', 'Bloomberg'],
    introTitle: 'What is Binary Search?',
    introDescription: [
      'Binary Search is a divide-and-conquer searching algorithm that finds the position of a target value within a sorted array, or identifies the optimal threshold over a monotonic answer space, in O(log N) logarithmic time.',
      'By comparing the target against the middle element, Binary Search eliminates exactly half of the remaining search space in each iteration, reducing even search spaces of billions of elements to fewer than 32 comparisons.',
    ],
    motivatingProblem: {
      title: 'Binary Search (LeetCode #704)',
      description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
      naiveApproach: 'Linear scan from 0 to N-1: O(N) time complexity.',
      optimalApproach: 'Compare target with midpoint nums[mid]. Halve the search space each step: O(log N) time and O(1) space.',
    },
    applicabilityInvariant: 'Binary Search applies whenever the search domain exhibits a monotonic truth value: there exists a boundary where all elements to the left evaluate to false and all elements to the right evaluate to true (or vice-versa).',
    signals: [
      'Array is strictly or non-decreasingly sorted',
      'Searching for lower bound, upper bound, or exact match in O(log N)',
      'Finding minimum capacity, speed, or allocation that satisfies a feasibility test ("Binary Search on Answer")',
      'Rotated sorted arrays or peak-finding in unimodal sequences',
    ],
    antiSignals: [
      'Unsorted array where sorting is disallowed',
      'Linked lists (lack O(1) random access; finding midpoint takes O(N))',
      'Non-monotonic answer spaces with multiple local extrema',
    ],
    coreTechniqueTitle: 'The Monotonic Domain Bisection',
    coreTechniqueDescription: 'Calculate midpoint safely, evaluate the condition, and discard the impossible half.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Define Search Boundaries',
        description: 'Initialize left = 0, right = nums.length - 1 (or search space min/max).',
      },
      {
        title: 'Step 2: Safe Midpoint Calculation',
        description: 'mid = left + Math.floor((right - left) / 2) to prevent 32-bit integer overflow.',
      },
      {
        title: 'Step 3: Test Predicate',
        description: 'If nums[mid] == target, return mid. If nums[mid] < target, left = mid + 1. Else right = mid - 1.',
      },
      {
        title: 'Step 4: Convergence',
        description: 'Loop terminates when left > right. Target does not exist if not found.',
      },
    ],
    loopInvariant: 'If the target exists in the array, it is guaranteed to lie within the closed index interval [left, right] at the beginning of each iteration.',
    variations: [
      {
        id: 'exact-search',
        title: 'Exact Match Search',
        description: 'Find index of target in sorted array or return -1.',
        exampleProblem: 'LeetCode #704: Binary Search',
        keyIdea: 'Terminate immediately when nums[mid] == target.',
      },
      {
        id: 'boundary-search',
        title: 'Lower and Upper Bounds',
        description: 'Find first or last occurrence of duplicate elements.',
        exampleProblem: 'LeetCode #34: Find First and Last Position of Element',
        keyIdea: 'Do not terminate on match; continue searching left/right half to find boundary.',
      },
      {
        id: 'rotated-search',
        title: 'Rotated Sorted Array',
        description: 'Search in an array that has been rotated at an unknown pivot.',
        exampleProblem: 'LeetCode #33: Search in Rotated Sorted Array',
        keyIdea: 'At least one half is always sorted; check if target falls in sorted half.',
      },
      {
        id: 'binary-search-answer',
        title: 'Binary Search on Answer Space',
        description: 'Find minimum/maximum parameter satisfying a feasibility condition.',
        exampleProblem: 'LeetCode #875: Koko Eating Bananas',
        keyIdea: 'Feasibility check function is monotonic: if speed K works, K+1 also works. Time is O(log R × cost(check)) where R is the search space.',
      },
    ],
    pythonTemplate: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    tsTemplate: `function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    pythonBrute: `def search(nums: list[int], target: int) -> int:
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1`,
    tsBrute: `function search(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
    bruteComplexity: {
      time: 'O(N)',
      space: 'O(1)',
      notes: 'Linear scan inspecting elements sequentially without utilizing binary partitioning.',
    },
    bruteExplanation: 'Sequentially scan the array from left to right in linear time without taking advantage of sorted boundaries.',
    exampleProblemTitle: 'Binary Search (LeetCode #704)',
    exampleProblemDescription: 'Search for target in sorted array nums in O(log N) time.',
    pythonExample: `def search(nums: list[int], target: int) -> int:
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1`,
    tsExample: `function search(nums: number[], target: number): number {
  let l = 0;
  let r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor(l + (r - l) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }
  return -1;
}`,
    codeExplanation: [
      'Initialize l = 0 and r = nums.length - 1.',
      'While l <= r, compute midpoint using l + Math.floor((r - l) / 2).',
      'If nums[mid] == target, return mid.',
      'If nums[mid] < target, target must be in right half: set l = mid + 1.',
      'If nums[mid] > target, target must be in left half: set r = mid - 1.',
      'If loop finishes without returning, target is absent: return -1.',
    ],
    complexity: {
      time: 'O(log N) array / O(log R · cost(check)) on answers',
      space: 'O(1)',
      notes: 'For array lookup: O(log N) iterations with O(1) comparison. For binary search on answer space (e.g. LeetCode #875): O(log R × cost(check)) where R is the answer range and check() verifies feasibility in O(N).',
    },
    pitfalls: [
      'Using (left + right) / 2 causes integer overflow in languages with fixed-width 32-bit integers.',
      'Using left < right when searching for exact match misses the case when left == right.',
      'Infinite loops caused by not updating mid by +/- 1 (e.g. left = mid when right - left = 1).',
    ],
    visualizerTitle: 'Binary Search Step-by-Step Visualizer',
    visualizerSubtitle: 'Watch boundaries L, M, and R halve the search space at each step.',
    mappings: [
      { questionId: 704, primaryPattern: 'binary-search', subpattern: 'exact-search', subpatternLabel: 'Exact Match', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 35, primaryPattern: 'binary-search', subpattern: 'boundary-search', subpatternLabel: 'Insert Position', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 34, primaryPattern: 'binary-search', subpattern: 'boundary-search', subpatternLabel: 'First/Last Position', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 69, primaryPattern: 'binary-search', subpattern: 'binary-search-answer', subpatternLabel: 'Sqrt Math Search', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 74, primaryPattern: 'binary-search', subpattern: 'exact-search', subpatternLabel: '2D Matrix Search', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 153, primaryPattern: 'binary-search', subpattern: 'rotated-search', subpatternLabel: 'Rotated Minimum', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 33, primaryPattern: 'binary-search', subpattern: 'rotated-search', subpatternLabel: 'Rotated Search', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 162, primaryPattern: 'binary-search', subpattern: 'boundary-search', subpatternLabel: 'Peak Finding', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 875, primaryPattern: 'binary-search', subpattern: 'binary-search-answer', subpatternLabel: 'Search on Answer', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 1011, primaryPattern: 'binary-search', subpattern: 'binary-search-answer', subpatternLabel: 'Search on Answer', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 410, primaryPattern: 'binary-search', subpattern: 'binary-search-answer', subpatternLabel: 'Minimax Allocation', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 4, primaryPattern: 'binary-search', subpattern: 'boundary-search', subpatternLabel: 'Median Two Arrays', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'exact-search', label: 'Exact Match' },
      { id: 'boundary-search', label: 'Boundaries & Peaks' },
      { id: 'rotated-search', label: 'Rotated Arrays' },
      { id: 'binary-search-answer', label: 'Search on Answer' },
    ],
    quiz: [
      {
        id: 'bs-q1',
        question: 'Why is `mid = left + (right - left) / 2` preferred over `mid = (left + right) / 2`?',
        options: [
          { id: 'opt-a', text: 'It runs faster on CPUs.' },
          { id: 'opt-b', text: 'It avoids integer overflow when left + right exceeds the maximum 32-bit signed integer value (2,147,483,647).' },
          { id: 'opt-c', text: 'It automatically rounds up instead of down.' },
          { id: 'opt-d', text: 'It works on floating-point numbers.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'When left and right are large positive integers near 2^31 - 1, left + right overflows to a negative integer, causing out-of-bounds indexing.',
      },
      {
        id: 'bs-q2',
        question: 'In "Binary Search on Answer" problems (like Koko Eating Bananas, LC #875), what property must the feasibility check function exhibit?',
        options: [
          { id: 'opt-a', text: 'It must be non-linear.' },
          { id: 'opt-b', text: 'It must be monotonic: if speed K is feasible, all speeds > K must also be feasible.' },
          { id: 'opt-c', text: 'It must compute values in O(1) time.' },
          { id: 'opt-d', text: 'It must sort the input array.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Binary search on answer requires monotonicity: feasibility must partition the parameter space into [False, False, ..., True, True, True].',
      },
      {
        id: 'bs-q3',
        question: 'When searching for the first true value in a monotonic boolean predicate array [F, F, ..., T, T], what is the correct invariant loop structure?',
        options: [
          { id: 'opt-a', text: 'while (left <= right) with right = mid - 1 when true, returning left.' },
          { id: 'opt-b', text: 'while (left < right) with right = mid when predicate(mid) is true and left = mid + 1 when false, returning left.' },
          { id: 'opt-c', text: 'Both A and B are mathematically equivalent sound binary search boundary templates.' },
          { id: 'opt-d', text: 'Binary search cannot be used on boolean predicates.' },
        ],
        correctOptionId: 'opt-c',
        explanation: 'Both the closed-interval [left, right] template (maintaining right = mid - 1 on true and returning left) and the half-open/converging [left, right) template (maintaining right = mid on true and left = mid + 1 on false, terminating at left == right) are mathematically sound invariants for lower-bound searching.',
      },
    ],
  },

  // 6. Fast & Slow Pointers
  {
    slug: 'fast-and-slow-pointers',
    title: 'Fast & Slow Pointers',
    level: 'Foundation',
    category: 'Linked Lists & Arrays',
    prerequisites: ['Linked Lists', 'Pointers', 'Cycle Detection'],
    companiesTop: ['Microsoft', 'Amazon', 'Oracle', 'Apple'],
    introTitle: 'What is the Fast & Slow Pointers Pattern?',
    introDescription: [
      'The Fast & Slow Pointers technique (also known as Floyd\'s Cycle Detection or Tortoise and Hare algorithm) employs two pointers that traverse a sequence or linked list at different relative speeds (typically 1 node vs 2 nodes per step).',
      'It is predominantly used to detect cycles in linked lists in O(N) time and O(1) space, identify the exact cycle entrance node, determine the midpoint of a linked list in a single pass, or identify cycle repetitions in state-transition sequences.',
    ],
    motivatingProblem: {
      title: 'Linked List Cycle (LeetCode #141)',
      description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
      naiveApproach: 'Store visited node addresses in a Hash Set: O(N) time but requires O(N) auxiliary space.',
      optimalApproach: 'Advance slow by 1 step and fast by 2 steps. If a cycle exists, fast will lap and collide with slow inside the cycle: O(N) time and O(1) space.',
    },
    applicabilityInvariant: 'Fast & Slow pointers applies to directed state sequences where each node has a deterministic next state. If the state space is finite and deterministic, any infinite traversal must eventually repeat, forming a cycle.',
    signals: [
      'Detecting loops or cycles in a linked list in O(1) space',
      'Finding the exact entrance node of a cycle',
      'Finding the middle node of a linked list in a single pass',
      'Checking if a number or sequence enters a cycle (e.g. Happy Number)',
      'Finding duplicates in an array where values act as implicit pointers (e.g. LC #287)',
    ],
    antiSignals: [
      'Doubly linked lists with tail pointers (can use converging two pointers from head and tail)',
      'Trees (by definition directed acyclic graphs without cycles)',
      'Arbitrary graph cycle detection with multiple outgoing branches per node (use DFS with 3-color states or Union Find)',
    ],
    coreTechniqueTitle: 'Floyd\'s Cycle Detection & Entrance Derivation',
    coreTechniqueDescription: 'Phase 1 detects collision; Phase 2 resets one pointer to head to find the cycle entrance.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Pointer Initialization',
        description: 'Initialize slow = head and fast = head at the start of the list or sequence.',
      },
      {
        title: 'Step 2: Differential Speed Traversal',
        description: 'Advance slow by 1 node (slow = slow.next) and fast by 2 nodes (fast = fast.next.next). If fast reaches null, no cycle exists. If slow == fast, a cycle is detected.',
      },
      {
        title: 'Step 3: Cycle Entrance Resolution',
        description: 'Reset one pointer to head while keeping the other at the meeting node. Advance both at 1 step simultaneously; their collision identifies the exact cycle entrance.',
      },
    ],
    loopInvariant: 'In a cycle of length C, every iteration decreases the relative distance between fast and slow by 1 modulo C. Fast is guaranteed to catch slow within C steps.',
    variations: [
      {
        id: 'cycle-detection',
        title: 'Cycle Detection & Entry',
        description: 'Detect cycle and find entrance in O(1) space.',
        exampleProblem: 'LeetCode #141 & #142: Linked List Cycle I & II',
        keyIdea: 'Distance from head to cycle entrance equals distance from meeting point to cycle entrance modulo C.',
      },
      {
        id: 'middle-finding',
        title: 'Middle of Linked List',
        description: 'Locate middle node in a single pass.',
        exampleProblem: 'LeetCode #876: Middle of the Linked List',
        keyIdea: 'When fast reaches the end, slow is positioned at exactly n/2.',
      },
      {
        id: 'implicit-pointers',
        title: 'Array as Implicit Linked List',
        description: 'Find duplicate numbers where array values act as pointers to next indices.',
        exampleProblem: 'LeetCode #287: Find the Duplicate Number',
        keyIdea: 'Pigeonhole principle guarantees duplicate value, forming cycle in index mapping.',
      },
    ],
    pythonTemplate: `def detect_cycle_entry(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Phase 2: Find entrance
            p1 = head
            p2 = slow
            while p1 != p2:
                p1 = p1.next
                p2 = p2.next
            return p1
    return None`,
    tsTemplate: `function detectCycleEntry(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) {
      // Phase 2: Find entrance
      let p1 = head;
      let p2 = slow;
      while (p1 !== p2) {
        p1 = p1!.next;
        p2 = p2!.next;
      }
      return p1;
    }
  }
  return null;
}`,
    pythonBrute: `def detectCycle(head: Optional[ListNode]) -> Optional[ListNode]:
    visited = set()
    curr = head
    while curr:
        if curr in visited:
            return curr  # Cycle entrance
        visited.add(curr)
        curr = curr.next
    return None`,
    tsBrute: `function detectCycle(head: ListNode | null): ListNode | null {
  const visited = new Set<ListNode>();
  let curr = head;
  while (curr) {
    if (visited.has(curr)) return curr; // Cycle entrance
    visited.add(curr);
    curr = curr.next;
  }
  return null;
}`,
    bruteComplexity: {
      time: 'O(N)',
      space: 'O(N)',
      notes: 'Requires storing visited node references in a Hash Set to detect revisits.',
    },
    bruteExplanation: 'Store every visited node reference in a Hash Set to detect revisits, using O(N) auxiliary memory.',
    exampleProblemTitle: 'Linked List Cycle II (LeetCode #142)',
    exampleProblemDescription: 'Return the node where the cycle begins in a linked list, or null if no cycle exists.',
    pythonExample: `def detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None`,
    tsExample: `function detectCycle(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      slow = head;
      while (slow !== fast) {
        slow = slow!.next;
        fast = fast!.next;
      }
      return slow;
    }
  }
  return null;
}`,
    codeExplanation: [
      'Initialize slow and fast pointers to head.',
      'Loop while fast and fast.next are non-null.',
      'Advance slow by 1 node, fast by 2 nodes.',
      'If slow and fast meet, reset slow to head.',
      'Advance both slow and fast by 1 node at a time until they meet again.',
      'The meeting node is the cycle entrance. Return it.',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(1)',
      notes: 'Slow takes at most 2N steps before collision. Space is strictly O(1) with two pointer variables.',
    },
    pitfalls: [
      'Not checking fast.next before accessing fast.next.next causes null pointer exceptions.',
      'In Phase 2, advancing fast by 2 instead of 1 will skip the entrance collision.',
      'Even vs odd list length middle node: depending on whether while loop checks fast.next or fast.next.next, returns first or second middle.',
    ],
    visualizerTitle: 'Floyd\'s Cycle Detection Visualizer',
    visualizerSubtitle: 'Step through slow and fast pointer movements to see the collision and cycle entry resolution.',
    mappings: [
      { questionId: 141, primaryPattern: 'fast-and-slow-pointers', subpattern: 'cycle-detection', subpatternLabel: 'Cycle Detection', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 142, primaryPattern: 'fast-and-slow-pointers', subpattern: 'cycle-detection', subpatternLabel: 'Cycle Entrance', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 876, primaryPattern: 'fast-and-slow-pointers', subpattern: 'middle-finding', subpatternLabel: 'Middle of List', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 202, primaryPattern: 'fast-and-slow-pointers', subpattern: 'cycle-detection', subpatternLabel: 'Digit Sum Cycle', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 234, primaryPattern: 'fast-and-slow-pointers', subpattern: 'middle-finding', subpatternLabel: 'Palindrome List', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 287, primaryPattern: 'fast-and-slow-pointers', subpattern: 'implicit-pointers', subpatternLabel: 'Implicit Array Pointers', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 143, primaryPattern: 'fast-and-slow-pointers', subpattern: 'middle-finding', subpatternLabel: 'Reorder List', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 19, primaryPattern: 'fast-and-slow-pointers', subpattern: 'middle-finding', subpatternLabel: 'Remove Nth Node', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 61, primaryPattern: 'fast-and-slow-pointers', subpattern: 'middle-finding', subpatternLabel: 'Rotate List', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 2130, primaryPattern: 'fast-and-slow-pointers', subpattern: 'middle-finding', subpatternLabel: 'Twin Sum', learningOrder: 10, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'cycle-detection', label: 'Cycle Detection' },
      { id: 'middle-finding', label: 'Middle Finding' },
      { id: 'implicit-pointers', label: 'Implicit Pointers' },
    ],
    quiz: [
      {
        id: 'fsp-q1',
        question: 'Why does fast moving at twice the speed of slow guarantee that they will collide if a cycle exists?',
        options: [
          { id: 'opt-a', text: 'Because fast always reaches the end of the list first.' },
          { id: 'opt-b', text: 'Because inside a cycle of length C, each step reduces the distance from fast to slow by exactly 1 node modulo C.' },
          { id: 'opt-c', text: 'Because slow reverses direction upon reaching the cycle.' },
          { id: 'opt-d', text: 'Because the pointers have different memory addresses.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Inside the cycle, relative velocity is (2 - 1) = 1 node per step. The relative gap closes by 1 at each step, guaranteeing they collide within C steps.',
      },
      {
        id: 'fsp-q2',
        question: 'In Floyd\'s cycle detection, after slow and fast collide, why does resetting one pointer to head and moving both at 1 step find the cycle entrance?',
        options: [
          { id: 'opt-a', text: 'It is a heuristic that works in 90% of test cases.' },
          { id: 'opt-b', text: 'The mathematical formula L = k*C - d proves the distance from head to entrance equals the distance from collision point to entrance.' },
          { id: 'opt-c', text: 'Because linked lists are always sorted.' },
          { id: 'opt-d', text: 'Because the slow pointer moves backward.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Distance from head to entrance L is congruent to (C - d) modulo C. Moving both pointers at speed 1 guarantees they meet at the exact entrance.',
      },
      {
        id: 'fsp-q3',
        question: 'When using Fast & Slow pointers to find the middle node of an even-length singly linked list (e.g. 1 -> 2 -> 3 -> 4), what determines whether you stop at node 2 or node 3?',
        options: [
          { id: 'opt-a', text: 'Whether the while loop condition checks while (fast && fast.next) vs while (fast.next && fast.next.next).' },
          { id: 'opt-b', text: 'The memory address of the head node.' },
          { id: 'opt-c', text: 'Whether the list values are positive or negative.' },
          { id: 'opt-d', text: 'Fast and slow pointers cannot handle even-length lists.' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'Checking while (fast && fast.next) stops slow at the second middle (node 3), which is standard for LeetCode #876. Checking while (fast.next && fast.next.next) stops slow at the first middle (node 2), which is required when splitting a list for merge sort or palindrome checks.',
      },
    ],
  },
];
