import type { PatternLearningContent } from '../../types/patterns';

export const INTERMEDIATE_PATTERNS: PatternLearningContent[] = [
  // 7. Stack & Monotonic Stack
  {
    slug: 'stack-and-monotonic-stack',
    title: 'Stack & Monotonic Stack',
    level: 'Intermediate',
    category: 'Stacks & Queues',
    prerequisites: ['Stack LIFO Operations', 'Arrays', 'Amortized Analysis'],
    companiesTop: ['Amazon', 'Google', 'Meta', 'ByteDance'],
    introTitle: 'What is a Stack & Monotonic Stack?',
    introDescription: [
      'A Stack is a Last-In, First-Out (LIFO) linear data structure. A Monotonic Stack is a specialized application of a stack where elements are strictly preserved in monotonic order (either monotonically increasing or decreasing).',
      'When resolving "Next Greater Element", "Previous Smaller Element", or finding the maximum rectangular area under a histogram, a Monotonic Stack finds the nearest bounding elements for every index in linear O(N) amortized time instead of quadratic O(N²).',
    ],
    motivatingProblem: {
      title: 'Daily Temperatures (LeetCode #739)',
      description: 'Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
      naiveApproach: 'For each day i, iterate through days i+1 to N-1 to find the first temperature > temperatures[i]: O(N²) time complexity.',
      optimalApproach: 'Maintain a monotonic decreasing stack of day indices. When current temperature exceeds stack top, pop the top and record the distance: O(N) amortized time and O(N) space.',
    },
    applicabilityInvariant: 'Monotonic Stack applies when solving range-extrema queries where each element needs to find the first element to its left or right that is strictly greater (or smaller) than itself.',
    signals: [
      'Finding the Next Greater Element, Next Smaller Element, or Previous Greater Element',
      'Matching nested parentheses or validating balanced brackets',
      'Calculating maximal rectangular area under a histogram or in a binary matrix',
      'Trapping rainwater horizontally between bounding bars',
    ],
    antiSignals: [
      'FIFO queue processing where elements leave in the order they arrived (use Queue / BFS)',
      'Sliding window extrema requiring elements to expire from the front based on window age (use Monotonic Deque)',
    ],
    coreTechniqueTitle: 'The Monotonic Eviction Invariant',
    coreTechniqueDescription: 'Before pushing the current element onto the stack, pop all elements from the top that violate the required monotonic order. The current element is their Next Greater/Smaller element.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Iterate Through Array',
        description: 'Process each element x at index i.',
      },
      {
        title: 'Step 2: Evict Violating Stack Tops',
        description: 'While stack is non-empty and x > temperatures[stack.top], pop stack.top and resolve its answer as i - stack.top.',
      },
      {
        title: 'Step 3: Push Current Index',
        description: 'Push index i onto the stack to await future resolution.',
      },
    ],
    loopInvariant: 'At any point during execution, the indices in the stack correspond to elements arranged in strictly decreasing order of their temperatures.',
    variations: [
      {
        id: 'next-greater-element',
        title: 'Next Greater Element (1D & Circular)',
        description: 'Find the first larger value ahead in the array.',
        exampleProblem: 'LeetCode #739 & #503: Daily Temperatures / NGE II',
        keyIdea: 'Monotonic decreasing stack evicts smaller items when larger element arrives.',
      },
      {
        id: 'histogram-bounding',
        title: 'Histogram Bounding Boundaries',
        description: 'Find left and right bounding smaller bars to compute maximum rectangle.',
        exampleProblem: 'LeetCode #84: Largest Rectangle in Histogram',
        keyIdea: 'When bar i is popped, its right boundary is current index and left boundary is the new stack top.',
      },
      {
        id: 'bracket-parsing',
        title: 'Parentheses & Expression Parsing',
        description: 'Match delimiters or evaluate mathematical expressions using LIFO order.',
        exampleProblem: 'LeetCode #20: Valid Parentheses',
        keyIdea: 'Last opened bracket must match first closed bracket.',
      },
    ],
    pythonTemplate: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = []  # stores indices
    for i, t in enumerate(temperatures):
        while stack and t > temperatures[stack[-1]]:
            prev = stack.pop()
            ans[prev] = i - prev
        stack.append(i)
    return ans`,
    tsTemplate: `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const ans = new Array(n).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prev = stack.pop()!;
      ans[prev] = i - prev;
    }
    stack.push(i);
  }
  return ans;
}`,
    pythonBrute: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    res = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            if temperatures[j] > temperatures[i]:
                res[i] = j - i
                break
    return res`,
    tsBrute: `function dailyTemperatures(temperatures: number[]): number[] {
  const n = temperatures.length;
  const res = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        res[i] = j - i;
        break;
      }
    }
  }
  return res;
}`,
    bruteComplexity: {
      time: 'O(N²)',
      space: 'O(1) aux',
      notes: 'Checks future days for each day with a nested loop without stack caching.',
    },
    bruteExplanation: 'For each day, scan all subsequent days until a warmer temperature is encountered.',
    exampleProblemTitle: 'Daily Temperatures (LeetCode #739)',
    exampleProblemDescription: 'Return number of days until a warmer temperature occurs for each day.',
    pythonExample: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    ans = [0] * len(temperatures)
    stack = []
    for i, temp in enumerate(temperatures):
        while stack and temp > temperatures[stack[-1]]:
            idx = stack.pop()
            ans[idx] = i - idx
        stack.append(i)
    return ans`,
    tsExample: `function dailyTemperatures(temperatures: number[]): number[] {
  const ans = new Array(temperatures.length).fill(0);
  const stack: number[] = [];
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const idx = stack.pop()!;
      ans[idx] = i - idx;
    }
    stack.push(i);
  }
  return ans;
}`,
    codeExplanation: [
      'Initialize answer array with 0s and an empty stack.',
      'Iterate through temperatures with index i and value temp.',
      'While stack is non-empty and current temp > temperatures[stack.top], pop idx and compute ans[idx] = i - idx.',
      'Push current index i to the stack.',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(N)',
      notes: 'Each index is pushed onto the stack exactly once and popped at most once, guaranteeing at most 2N stack operations.',
    },
    pitfalls: [
      'Storing values instead of indices on the stack prevents calculating distances and handling duplicate values.',
      'Using >= instead of > can pop equal elements when searching for strictly greater items.',
      'Forgetting that leftover elements in the stack upon completion have no next greater element (they remain 0 or -1).',
    ],
    visualizerTitle: 'Monotonic Stack Visualizer',
    visualizerSubtitle: 'Step through push and pop operations as warmer days resolve unresolved stack indices.',
    mappings: [
      { questionId: 20, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'bracket-parsing', subpatternLabel: 'Valid Brackets', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 739, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'next-greater-element', subpatternLabel: 'Next Greater Element', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 496, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'next-greater-element', subpatternLabel: 'Next Greater Element I', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 503, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'next-greater-element', subpatternLabel: 'Circular NGE II', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 155, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'bracket-parsing', subpatternLabel: 'Min Stack Design', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 150, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'bracket-parsing', subpatternLabel: 'Reverse Polish Notation', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 71, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'bracket-parsing', subpatternLabel: 'Simplify Path', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 84, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'histogram-bounding', subpatternLabel: 'Largest Rectangle Histogram', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 85, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'histogram-bounding', subpatternLabel: 'Maximal 2D Rectangle', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 42, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'histogram-bounding', subpatternLabel: 'Trapping Rain Water', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 316, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'next-greater-element', subpatternLabel: 'Lexicographical Order', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 402, primaryPattern: 'stack-and-monotonic-stack', subpattern: 'next-greater-element', subpatternLabel: 'Remove K Digits', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'next-greater-element', label: 'Next Greater Element' },
      { id: 'histogram-bounding', label: 'Histogram Bounding' },
      { id: 'bracket-parsing', label: 'Parsing & Delimiters' },
    ],
    quiz: [
      {
        id: 'sms-q1',
        question: 'Why is the time complexity of the nested while loop in Monotonic Stack overall O(N) rather than O(N²)?',
        options: [
          { id: 'opt-a', text: 'Because Python optimizes while loops automatically.' },
          { id: 'opt-b', text: 'Amortized analysis: each element is pushed to the stack at most once and popped at most once across the entire algorithm.' },
          { id: 'opt-c', text: 'Because stack operations take O(log N) time.' },
          { id: 'opt-d', text: 'Because arrays are sorted.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Each of the N elements can be pushed at most once and popped at most once. Total push operations = N, total pop operations <= N, giving <= 2N total operations = O(N) amortized time.',
      },
      {
        id: 'sms-q2',
        question: 'When finding the Next Greater Element for each item in an array moving left to right, what monotonicity invariant should the stack maintain?',
        options: [
          { id: 'opt-a', text: 'Strictly increasing (smallest on top).' },
          { id: 'opt-b', text: 'Monotonically decreasing (largest at bottom, smaller on top), popping whenever current element is strictly greater.' },
          { id: 'opt-c', text: 'Random order.' },
          { id: 'opt-d', text: 'Sorted by original index only.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'In a monotonic decreasing stack, when an incoming element nums[i] is greater than stack.top(), nums[i] is immediately the next greater element for stack.top(). We pop and record the answer.',
      },
      {
        id: 'sms-q3',
        question: 'In Largest Rectangle in Histogram (LeetCode #84), when a bar is popped from the stack, how are its left and right bounding boundaries determined?',
        options: [
          { id: 'opt-a', text: 'Left boundary is 0, right boundary is array length.' },
          { id: 'opt-b', text: 'Right boundary is the current index i, and left boundary is the new stack top after popping.' },
          { id: 'opt-c', text: 'Both boundaries are found by scanning left and right linearly.' },
          { id: 'opt-d', text: 'The width is always fixed to 1.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Because the stack is monotonic increasing, the popped bar was constrained on the right by the incoming smaller bar at index i, and on the left by whichever bar is now at stack.top(). Width = i - (stack.top() + 1).',
      },
    ],
  },

  // 8. Intervals & Sweep Line
  {
    slug: 'intervals-and-sweep-line',
    title: 'Intervals & Sweep Line',
    level: 'Intermediate',
    category: 'Arrays & Sorting',
    prerequisites: ['Sorting', 'Interval Properties', 'Coordinate Geometry'],
    companiesTop: ['Google', 'Amazon', 'Salesforce', 'Uber'],
    introTitle: 'What is the Intervals & Sweep Line Pattern?',
    introDescription: [
      'The Intervals pattern processes overlapping closed or open ranges [start, end] on a 1D continuous timeline. By sorting intervals by start time or end time, complex intersection and grouping problems become solvable in linear passes.',
      'The Sweep Line technique converts 2D geometric problems or discrete range updates into 1D chronological event points (start event +1, end event -1). A virtual vertical line "sweeps" across the events, maintaining active counts and discovering intersections in O(N log N) time.',
    ],
    motivatingProblem: {
      title: 'Merge Intervals (LeetCode #56)',
      description: 'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals.',
      naiveApproach: 'Compare every interval with every other interval repeatedly until no merges can be made: O(N²) time complexity.',
      optimalApproach: 'Sort intervals by start time in O(N log N). In a single linear pass, merge interval i with the previous interval if start_i <= previous_end. Runs in O(N log N) time and O(N) space.',
    },
    applicabilityInvariant: 'Interval sorting applies when two intervals [s1, e1] and [s2, e2] (with s1 <= s2) overlap if and only if s2 <= e1. Sorting ensures that all potentially overlapping intervals are adjacent.',
    signals: [
      'Meeting rooms, flight schedules, or calendar conflict detection',
      'Merging overlapping intervals or inserting a new range',
      'Finding the minimum number of resources (conference rooms, arrows, lines)',
      'Finding intersection or total covered area of segments',
    ],
    antiSignals: [
      'Continuous dense integers where difference arrays can update ranges in O(1) without sorting',
      'Unordered subset selections without geometric overlap semantics',
    ],
    coreTechniqueTitle: 'Start-Time Sorting and Overlap Merging',
    coreTechniqueDescription: 'Sort intervals by start time. Two adjacent sorted intervals overlap if next_start <= current_end. The merged interval ends at max(current_end, next_end).',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Sort Intervals',
        description: 'Sort intervals primarily by start time in ascending order.',
      },
      {
        title: 'Step 2: Maintain Active Range',
        description: 'Initialize active interval [start, end] with intervals[0].',
      },
      {
        title: 'Step 3: Test Adjacent Overlap',
        description: 'If next_start <= active_end: active_end = max(active_end, next_end). Else: commit active interval and start new one.',
      },
    ],
    loopInvariant: 'At interval i, all intervals [0 ... i-1] have been either merged into the active interval or committed to the final non-overlapping output list.',
    variations: [
      {
        id: 'interval-merge',
        title: 'Interval Merging & Insertion',
        description: 'Combine overlapping segments into non-overlapping unions.',
        exampleProblem: 'LeetCode #56 & #57: Merge / Insert Interval',
        keyIdea: 'Overlaps occur when next_start <= current_end; union end is max(end1, end2).',
      },
      {
        id: 'greedy-scheduling',
        title: 'Earliest Finish Time (Non-overlapping)',
        description: 'Select maximum non-overlapping intervals by sorting by end time.',
        exampleProblem: 'LeetCode #435: Non-overlapping Intervals',
        keyIdea: 'Greedy choice: picking the interval that finishes earliest leaves maximum room for others.',
      },
      {
        id: 'sweep-line-events',
        title: 'Sweep Line Event Counting',
        description: 'Deconstruct intervals into start (+1) and end (-1) point events.',
        exampleProblem: 'LeetCode #253: Meeting Rooms II',
        keyIdea: 'Sort all events chronologically; running sum tracks concurrent active intervals.',
      },
    ],
    pythonTemplate: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
    tsTemplate: `function mergeIntervals(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}`,
    pythonBrute: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    res = [iv[:] for iv in intervals]
    merged = True
    while merged:
        merged = False
        for i in range(len(res)):
            for j in range(i + 1, len(res)):
                if max(res[i][0], res[j][0]) <= min(res[i][1], res[j][1]):
                    res[i] = [min(res[i][0], res[j][0]), max(res[i][1], res[j][1])]
                    res.pop(j)
                    merged = True
                    break
            if merged:
                break
    return res`,
    tsBrute: `function merge(intervals: number[][]): number[][] {
  const res = intervals.map(iv => [...iv]);
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < res.length; i++) {
      for (let j = i + 1; j < res.length; j++) {
        if (Math.max(res[i][0], res[j][0]) <= Math.min(res[i][1], res[j][1])) {
          res[i] = [Math.min(res[i][0], res[j][0]), Math.max(res[i][1], res[j][1])];
          res.splice(j, 1);
          merged = true;
          break;
        }
      }
      if (merged) break;
    }
  }
  return res;
}`,
    bruteComplexity: {
      time: 'O(N²)',
      space: 'O(N)',
      notes: 'Repeatedly searches for overlapping pairs and merges until convergence without pre-sorting.',
    },
    bruteExplanation: 'Scan all pairs of intervals for overlaps and merge them in quadratic passes without pre-sorting.',
    exampleProblemTitle: 'Merge Intervals (LeetCode #56)',
    exampleProblemDescription: 'Merge all overlapping intervals and return array of non-overlapping intervals.',
    pythonExample: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    res = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= res[-1][1]:
            res[-1][1] = max(res[-1][1], e)
        else:
            res.append([s, e])
    return res`,
    tsExample: `function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);
  const res: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i];
    if (s <= res[res.length - 1][1]) {
      res[res.length - 1][1] = Math.max(res[res.length - 1][1], e);
    } else {
      res.push([s, e]);
    }
  }
  return res;
}`,
    codeExplanation: [
      'Sort intervals by start coordinate in ascending order.',
      'Initialize result array with the first interval.',
      'Iterate through remaining intervals. If interval[i].start <= result.last.end, merge by setting result.last.end = max(result.last.end, interval[i].end).',
      'Otherwise, interval does not overlap: append it directly to result.',
    ],
    complexity: {
      time: 'O(N log N)',
      space: 'O(N)',
      notes: 'Sorting N intervals takes O(N log N). The subsequent linear pass takes O(N) time.',
    },
    pitfalls: [
      'Assuming input intervals are already sorted (always sort explicitly).',
      'Forgetting max(last.end, current.end) during merge: if a larger interval completely covers a smaller one ([1, 10] and [2, 5]), end must remain 10.',
      'Handling closed vs open interval boundaries at touching points (e.g. [1, 2] and [2, 3]).',
    ],
    visualizerTitle: 'Intervals Merge Visualizer',
    visualizerSubtitle: 'Watch overlapping intervals merge along a sorted continuous timeline.',
    mappings: [
      { questionId: 56, primaryPattern: 'intervals-and-sweep-line', subpattern: 'interval-merge', subpatternLabel: 'Merge Intervals', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 57, primaryPattern: 'intervals-and-sweep-line', subpattern: 'interval-merge', subpatternLabel: 'Insert Interval', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 435, primaryPattern: 'intervals-and-sweep-line', subpattern: 'greedy-scheduling', subpatternLabel: 'Non-overlapping', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 452, primaryPattern: 'intervals-and-sweep-line', subpattern: 'greedy-scheduling', subpatternLabel: 'Arrow Burst Balloons', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 1288, primaryPattern: 'intervals-and-sweep-line', subpattern: 'interval-merge', subpatternLabel: 'Covered Intervals', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 986, primaryPattern: 'intervals-and-sweep-line', subpattern: 'interval-merge', subpatternLabel: 'Interval Intersections', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 732, primaryPattern: 'intervals-and-sweep-line', subpattern: 'sweep-line-events', subpatternLabel: 'My Calendar III', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 218, primaryPattern: 'intervals-and-sweep-line', subpattern: 'sweep-line-events', subpatternLabel: 'The Skyline Problem', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 1851, primaryPattern: 'intervals-and-sweep-line', subpattern: 'sweep-line-events', subpatternLabel: 'Min Interval Query', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 2406, primaryPattern: 'intervals-and-sweep-line', subpattern: 'sweep-line-events', subpatternLabel: 'Min Group Partition', learningOrder: 10, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'interval-merge', label: 'Merge & Insert' },
      { id: 'greedy-scheduling', label: 'Greedy Scheduling' },
      { id: 'sweep-line-events', label: 'Sweep Line Events' },
    ],
    quiz: [
      {
        id: 'isl-q1',
        question: 'When merging two overlapping intervals [s1, e1] and [s2, e2] (where s1 <= s2), why must the new end coordinate be max(e1, e2)?',
        options: [
          { id: 'opt-a', text: 'Because e2 is always larger than e1.' },
          { id: 'opt-b', text: 'Because interval 1 could completely encompass interval 2 (e.g. [1, 10] and [2, 5]), in which case setting end to e2 would shrink the interval incorrectly.' },
          { id: 'opt-c', text: 'To convert open intervals into closed intervals.' },
          { id: 'opt-d', text: 'Because intervals cannot have odd lengths.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'If [1, 10] and [2, 5] overlap, taking e2 would produce [1, 5], losing the range from 6 to 10. Taking max(e1, e2) = 10 correctly preserves [1, 10].',
      },
      {
        id: 'isl-q2',
        question: 'In Non-overlapping Intervals (LeetCode #435), why should you sort intervals by their END time to minimize removals?',
        options: [
          { id: 'opt-a', text: 'Sorting by start time produces syntax errors.' },
          { id: 'opt-b', text: 'Greedy choice: choosing the interval that ends earliest leaves the maximum possible remaining room for subsequent intervals.' },
          { id: 'opt-c', text: 'Because end times are always larger than start times.' },
          { id: 'opt-d', text: 'It avoids dividing by zero.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Classic activity selection: an interval finishing earlier frees up the resource sooner, leaving maximal room for the rest of the schedule.',
      },
      {
        id: 'isl-q3',
        question: 'In Meeting Rooms II using Sweep Line event points, why must an end event at time T be processed before a start event at time T?',
        options: [
          { id: 'opt-a', text: 'To prevent room count from falsely spiking when a meeting ends exactly as another starts in the same room.' },
          { id: 'opt-b', text: 'Because end times are negative numbers.' },
          { id: 'opt-c', text: 'It has no effect on room count.' },
          { id: 'opt-d', text: 'Because start events require O(N) allocations.' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'If a meeting ends at 10:00 and another starts at 10:00, the same room can be reused. Decrementing before incrementing prevents a spurious room demand spike.',
      },
    ],
  },

  // 9. Heap / Top K
  {
    slug: 'heap-top-k',
    title: 'Heap / Top K',
    level: 'Intermediate',
    category: 'Heaps & Priority Queues',
    prerequisites: ['Binary Heaps', 'Complete Binary Trees', 'Priority Queues'],
    companiesTop: ['Amazon', 'Microsoft', 'Meta', 'Twitter'],
    introTitle: 'What is the Heap / Top K Pattern?',
    introDescription: [
      'A Heap (or Priority Queue) is a specialized tree-based data structure that satisfies the heap property: in a Min-Heap, the root is the smallest element; in a Max-Heap, the root is the largest element.',
      'The Top K pattern uses a bounded heap of size K to process streams or arrays in O(N log K) time and O(K) space, avoiding full O(N log N) sorting. It is also used to maintain dynamic medians (Two Heaps) and merge K sorted streams.',
    ],
    motivatingProblem: {
      title: 'Kth Largest Element in an Array (LeetCode #215)',
      description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
      naiveApproach: 'Sort the entire array in descending order and return nums[k - 1]: O(N log N) time and O(N) space.',
      optimalApproach: 'Maintain a Min-Heap of size K. When an element > heap.root arrives, pop the root and push the new element. Root always holds the K-th largest element: O(N log K) time and O(K) space.',
    },
    applicabilityInvariant: 'A Min-Heap of size K maintains the K largest elements seen so far; its root is the minimum among the top K, which is precisely the K-th largest element.',
    signals: [
      'Finding the K largest, K smallest, or K most frequent elements',
      'Maintaining median or percentiles dynamically in a continuous stream of data',
      'Merging K sorted lists or streams into a single sorted sequence',
      'Greedy scheduling prioritizing tasks with highest frequency or earliest deadline',
    ],
    antiSignals: [
      'Need to search arbitrary elements by key in O(1) (use Hash Map)',
      'Need to maintain full sorted order of all elements (use Sorting)',
    ],
    coreTechniqueTitle: 'Bounded Min-Heap of Size K',
    coreTechniqueDescription: 'Keep at most K elements in a Min-Heap. Any incoming element larger than the root evicts the root, guaranteeing the root is always the K-th largest.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Initialize Min-Heap',
        description: 'Create an empty Min-Heap with maximum capacity K.',
      },
      {
        title: 'Step 2: Stream Insertion',
        description: 'For each element x: if heap size < K, push x. Else if x > heap.peek(), pop peek and push x.',
      },
      {
        title: 'Step 3: Extract K-th Extremum',
        description: 'heap.peek() is the K-th largest element in O(1) time.',
      },
    ],
    loopInvariant: 'At any step after processing k elements, the Min-Heap contains the k largest elements among all examined elements, and the root is the minimum of those k largest.',
    variations: [
      {
        id: 'top-k-elements',
        title: 'Top K Largest/Smallest',
        description: 'Bounded heap of size K filtering stream.',
        exampleProblem: 'LeetCode #215: Kth Largest Element',
        keyIdea: 'Min-Heap of size K tracks K largest; Max-Heap of size K tracks K smallest.',
      },
      {
        id: 'two-heaps-median',
        title: 'Two Heaps (Dynamic Median)',
        description: 'Max-Heap for lower half, Min-Heap for upper half.',
        exampleProblem: 'LeetCode #295: Find Median from Data Stream',
        keyIdea: 'Balance sizes within 1; median is root of lower half or average of both roots in O(1).',
      },
      {
        id: 'k-way-merge',
        title: 'K-Way Merge',
        description: 'Merge K sorted lists by inserting front element of each into heap.',
        exampleProblem: 'LeetCode #23: Merge k Sorted Lists',
        keyIdea: 'Extract min, append to output, and insert next element from the same list.',
      },
    ],
    pythonTemplate: `import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    heap = []
    for num in nums:
        if len(heap) < k:
            heapq.heappush(heap, num)
        elif num > heap[0]:
            heapq.heapreplace(heap, num)
    return heap[0]`,
    tsTemplate: `class MinHeap {
  private heap: number[] = [];
  size(): number { return this.heap.length; }
  peek(): number { return this.heap[0]; }
  push(val: number): void {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[i] < this.heap[p]) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }
  replace(val: number): void {
    this.heap[0] = val;
    let i = 0, n = this.heap.length;
    while (true) {
      let sm = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l] < this.heap[sm]) sm = l;
      if (r < n && this.heap[r] < this.heap[sm]) sm = r;
      if (sm !== i) {
        [this.heap[i], this.heap[sm]] = [this.heap[sm], this.heap[i]];
        i = sm;
      } else break;
    }
  }
}

function findKthLargest(nums: number[], k: number): number {
  const minHeap = new MinHeap();
  for (const num of nums) {
    if (minHeap.size() < k) {
      minHeap.push(num);
    } else if (num > minHeap.peek()) {
      minHeap.replace(num);
    }
  }
  return minHeap.peek();
}`,
    pythonBrute: `def findKthLargest(nums: list[int], k: int) -> int:
    # Sort entire array descending: O(N log N) time, O(1) space
    nums.sort(reverse=True)
    return nums[k - 1]`,
    tsBrute: `function findKthLargest(nums: number[], k: number): number {
  // Sort entire array descending: O(N log N) time, O(1) space
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
    bruteComplexity: {
      time: 'O(N log N)',
      space: 'O(1) aux',
      notes: 'Full sorting requires O(N log N) time and does not support streaming inputs.',
    },
    bruteExplanation: 'Sort the complete array descending and return index k - 1, doing extra work for elements beyond top K.',
    exampleProblemTitle: 'Kth Largest Element in an Array (LeetCode #215)',
    exampleProblemDescription: 'Find the kth largest element in an unsorted array.',
    pythonExample: `import heapq
def findKthLargest(nums: list[int], k: int) -> int:
    return heapq.nlargest(k, nums)[-1]`,
    tsExample: `class MinHeap {
  private heap: number[] = [];
  size(): number { return this.heap.length; }
  peek(): number { return this.heap[0]; }
  push(val: number): void {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[i] < this.heap[p]) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }
  replace(val: number): void {
    this.heap[0] = val;
    let i = 0, n = this.heap.length;
    while (true) {
      let sm = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l] < this.heap[sm]) sm = l;
      if (r < n && this.heap[r] < this.heap[sm]) sm = r;
      if (sm !== i) {
        [this.heap[i], this.heap[sm]] = [this.heap[sm], this.heap[i]];
        i = sm;
      } else break;
    }
  }
}

function findKthLargest(nums: number[], k: number): number {
  const minHeap = new MinHeap();
  for (const num of nums) {
    if (minHeap.size() < k) {
      minHeap.push(num);
    } else if (num > minHeap.peek()) {
      minHeap.replace(num);
    }
  }
  return minHeap.peek();
}`,
    codeExplanation: [
      'Maintain a min-heap bounded to size k.',
      'Push incoming elements; when size exceeds k, pop the smallest.',
      'The root of the heap is the k-th largest element.',
    ],
    complexity: {
      time: 'O(N log K)',
      space: 'O(K)',
      notes: 'Each insertion/eviction takes O(log K). Heap stores only K elements.',
    },
    pitfalls: [
      'Using a Max-Heap instead of a Min-Heap for K-th largest (a Max-Heap would need to store all N elements).',
      'Forgetting that JavaScript standard library lacks a native PriorityQueue class (requires custom heap or sorted array).',
    ],
    visualizerTitle: 'Min-Heap Top K Visualizer',
    visualizerSubtitle: 'Watch numbers stream into a bounded heap of size K and evict smaller values.',
    mappings: [
      { questionId: 215, primaryPattern: 'heap-top-k', subpattern: 'top-k-elements', subpatternLabel: 'Kth Largest', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 347, primaryPattern: 'heap-top-k', subpattern: 'top-k-elements', subpatternLabel: 'Top K Frequent', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 1046, primaryPattern: 'heap-top-k', subpattern: 'top-k-elements', subpatternLabel: 'Last Stone Weight', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 703, primaryPattern: 'heap-top-k', subpattern: 'top-k-elements', subpatternLabel: 'Stream Kth Largest', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 973, primaryPattern: 'heap-top-k', subpattern: 'top-k-elements', subpatternLabel: 'K Closest Points', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 23, primaryPattern: 'heap-top-k', subpattern: 'k-way-merge', subpatternLabel: 'Merge K Sorted Lists', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 373, primaryPattern: 'heap-top-k', subpattern: 'k-way-merge', subpatternLabel: 'K Pairs Smallest Sums', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 295, primaryPattern: 'heap-top-k', subpattern: 'two-heaps-median', subpatternLabel: 'Median from Stream', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 621, primaryPattern: 'heap-top-k', subpattern: 'frequency-heap-greedy', subpatternLabel: 'Task Scheduler', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 767, primaryPattern: 'heap-top-k', subpattern: 'frequency-heap-greedy', subpatternLabel: 'Reorganize String', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 1985, primaryPattern: 'heap-top-k', subpattern: 'top-k-elements', subpatternLabel: 'Kth Largest BigInt', learningOrder: 11, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'top-k-elements', label: 'Top K Elements' },
      { id: 'two-heaps-median', label: 'Two Heaps Median' },
      { id: 'k-way-merge', label: 'K-Way Merge' },
      { id: 'frequency-heap-greedy', label: 'Frequency Heap & Scheduling' },
    ],
    quiz: [
      {
        id: 'htk-q1',
        question: 'To find the K-th LARGEST element in an array, why do we use a MIN-HEAP of size K instead of a Max-Heap?',
        options: [
          { id: 'opt-a', text: 'Min-heaps are faster to allocate in memory.' },
          { id: 'opt-b', text: 'The Min-Heap retains the K largest elements seen so far; its root is the smallest among those K largest, which is precisely the K-th largest overall.' },
          { id: 'opt-c', text: 'Max-heaps cannot store duplicate numbers.' },
          { id: 'opt-d', text: 'Because Min-Heaps run in O(1) time.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'By holding the K biggest numbers, the root of the Min-Heap is the minimum of those top K, which by definition is the K-th largest overall in O(K) space.',
      },
      {
        id: 'htk-q2',
        question: 'What is the time complexity of building a binary heap from an arbitrary unsorted array of N elements using bottom-up heapify?',
        options: [
          { id: 'opt-a', text: 'O(N log N) by inserting elements one by one.' },
          { id: 'opt-b', text: 'O(N) linear time because nodes near the leaves have very small heights.' },
          { id: 'opt-c', text: 'O(N²) due to bubble-down operations.' },
          { id: 'opt-d', text: 'O(log N).' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'The mathematical sum of height * (nodes at height) converges to 2N, proving that bottom-up heapify runs in strictly O(N) linear time.',
      },
      {
        id: 'htk-q3',
        question: 'In Find Median from Data Stream (LeetCode #295), how do the two heaps allow retrieving the stream median in O(1) time (with O(log N) insertion)?',
        options: [
          { id: 'opt-a', text: 'Both heaps store the same numbers.' },
          { id: 'opt-b', text: 'A Max-Heap stores the smaller half of numbers and a Min-Heap stores the larger half, with sizes balanced within 1.' },
          { id: 'opt-c', text: 'The numbers are sorted in an auxiliary array.' },
          { id: 'opt-d', text: 'Only one heap of size N / 2 is used.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Each incoming number is inserted and rebalanced in O(log N) time. The Max-Heap root gives the maximum of the lower half and the Min-Heap root gives the minimum of the upper half, allowing instant O(1) median retrieval.',
      },
    ],
  },

  // 10. Tree DFS
  {
    slug: 'tree-dfs',
    title: 'Tree DFS',
    level: 'Intermediate',
    category: 'Trees & Recursion',
    prerequisites: ['Binary Trees', 'Recursion', 'Call Stack Frames'],
    companiesTop: ['Amazon', 'Meta', 'Microsoft', 'Google'],
    introTitle: 'What is Tree DFS?',
    introDescription: [
      'Tree Depth-First Search (DFS) explores a hierarchical binary or N-ary tree by traversing as deep as possible along each branch before backtracking.',
      'Tree DFS leverages recursion and the system call stack. It is classified into Preorder (Root -> Left -> Right), Inorder (Left -> Root -> Right), and Postorder (Left -> Right -> Root) traversals, enabling top-down state propagation and bottom-up subtree aggregations.',
    ],
    motivatingProblem: {
      title: 'Maximum Depth of Binary Tree (LeetCode #104)',
      description: 'Given the root of a binary tree, return its maximum depth (number of nodes along longest path from root to leaf).',
      naiveApproach: 'Perform level-order queue traversal and count levels.',
      optimalApproach: 'Postorder DFS: max_depth(root) = 1 + max(dfs(left), dfs(right)). Runs in O(N) time with O(height) call stack space.',
    },
    applicabilityInvariant: 'Tree DFS applies when a problem exhibits recursive subtree substructure: the solution for a node can be computed directly from the solutions of its left and right subtrees.',
    signals: [
      'Binary tree paths, diameters, heights, and subtrees',
      'Validating BST properties (Inorder sorted check or range bounds passing)',
      'Lowest Common Ancestor (LCA)',
      'Serializing and deserializing binary trees',
    ],
    antiSignals: [
      'Level-by-level horizontal node grouping (use Tree BFS with Queue)',
      'Shortest path in unweighted tree with early exit at shallowest leaf (Tree BFS is faster)',
    ],
    coreTechniqueTitle: 'Divide and Conquer Subtree Aggregation',
    coreTechniqueDescription: 'Base case returns for null nodes. Compute left and right subtree results recursively. Combine them to return the parent result.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Base Case',
        description: 'if not root: return 0 (or base sentinel).',
      },
      {
        title: 'Step 2: Recurse on Subtrees',
        description: 'left_ans = dfs(root.left), right_ans = dfs(root.right).',
      },
      {
        title: 'Step 3: Combine and Return',
        description: 'return combine(root.val, left_ans, right_ans).',
      },
    ],
    loopInvariant: 'At node u, the recursive calls on left and right children have completely computed the optimal answers for their respective subtrees.',
    variations: [
      {
        id: 'postorder-aggregation',
        title: 'Postorder Bottom-Up Aggregation',
        description: 'Compute heights, subtree sizes, and diameters from children.',
        exampleProblem: 'LeetCode #104 & #543: Max Depth / Diameter',
        keyIdea: 'Children return heights; node updates global diameter and returns max height + 1.',
      },
      {
        id: 'preorder-top-down',
        title: 'Preorder Top-Down Path Deduction',
        description: 'Pass target or path state down from parent to children.',
        exampleProblem: 'LeetCode #112: Path Sum',
        keyIdea: 'Deduct node.val from remaining target; check if remaining target == 0 at leaf.',
      },
      {
        id: 'inorder-bst',
        title: 'Inorder BST Traversal',
        description: 'Traverse Left -> Root -> Right to produce sorted values.',
        exampleProblem: 'LeetCode #98: Validate Binary Search Tree',
        keyIdea: 'Inorder traversal of a valid BST is strictly increasing.',
      },
    ],
    pythonTemplate: `def maxDepth(root) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
    tsTemplate: `function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    pythonBrute: `def maxDepth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    paths = []
    def collect(node, d):
        if not node.left and not node.right:
            paths.append(d)
            return
        if node.left: collect(node.left, d + 1)
        if node.right: collect(node.right, d + 1)
    collect(root, 1)
    return max(paths)`,
    tsBrute: `function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  const depths: number[] = [];
  function collect(node: TreeNode, d: number) {
    if (!node.left && !node.right) {
      depths.push(d);
      return;
    }
    if (node.left) collect(node.left, d + 1);
    if (node.right) collect(node.right, d + 1);
  }
  collect(root, 1);
  return Math.max(...depths);
}`,
    bruteComplexity: {
      time: 'O(N)',
      space: 'O(N)',
      notes: 'Stores all leaf depths in an auxiliary list before computing maximum.',
    },
    bruteExplanation: 'Enumerate all root-to-leaf paths and store their lengths in an auxiliary list, then take the maximum.',
    exampleProblemTitle: 'Maximum Depth of Binary Tree (LeetCode #104)',
    exampleProblemDescription: 'Return maximum depth from root to leaf node.',
    pythonExample: `def maxDepth(root):
    if not root:
        return 0
    left = maxDepth(root.left)
    right = maxDepth(root.right)
    return 1 + max(left, right)`,
    tsExample: `function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  const left = maxDepth(root.left);
  const right = maxDepth(root.right);
  return 1 + Math.max(left, right);
}`,
    codeExplanation: [
      'Base case: if root is null, return 0.',
      'Recursively compute left subtree depth.',
      'Recursively compute right subtree depth.',
      'Return 1 + max(left, right).',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(H)',
      notes: 'Visits every node once. Call stack depth equals tree height H (O(log N) for balanced trees, O(N) for skewed).',
    },
    pitfalls: [
      'Forgetting that in Path Sum, a valid path must terminate at a LEAF node (both left and right must be null).',
      'In Validate BST, checking only root.val > root.left.val is insufficient (all nodes in left subtree must be < root).',
    ],
    visualizerTitle: 'Tree DFS Call Stack Visualizer',
    visualizerSubtitle: 'Watch recursive calls traverse down branches and backtrack to compute heights.',
    mappings: [
      { questionId: 104, primaryPattern: 'tree-dfs', subpattern: 'postorder-aggregation', subpatternLabel: 'Max Depth', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 226, primaryPattern: 'tree-dfs', subpattern: 'preorder-top-down', subpatternLabel: 'Invert Tree', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 100, primaryPattern: 'tree-dfs', subpattern: 'preorder-top-down', subpatternLabel: 'Same Tree', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 101, primaryPattern: 'tree-dfs', subpattern: 'preorder-top-down', subpatternLabel: 'Symmetric Tree', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 112, primaryPattern: 'tree-dfs', subpattern: 'preorder-top-down', subpatternLabel: 'Path Sum', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 113, primaryPattern: 'tree-dfs', subpattern: 'preorder-top-down', subpatternLabel: 'Path Sum II', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 543, primaryPattern: 'tree-dfs', subpattern: 'postorder-aggregation', subpatternLabel: 'Diameter of Tree', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 110, primaryPattern: 'tree-dfs', subpattern: 'postorder-aggregation', subpatternLabel: 'Balanced Tree', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 98, primaryPattern: 'tree-dfs', subpattern: 'inorder-bst', subpatternLabel: 'Validate BST', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 236, primaryPattern: 'tree-dfs', subpattern: 'postorder-aggregation', subpatternLabel: 'Lowest Common Ancestor', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 124, primaryPattern: 'tree-dfs', subpattern: 'postorder-aggregation', subpatternLabel: 'Max Path Sum', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 297, primaryPattern: 'tree-dfs', subpattern: 'preorder-top-down', subpatternLabel: 'Serialize/Deserialize', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'postorder-aggregation', label: 'Bottom-Up Postorder' },
      { id: 'preorder-top-down', label: 'Top-Down Preorder' },
      { id: 'inorder-bst', label: 'Inorder BST' },
    ],
    quiz: [
      {
        id: 'tdfs-q1',
        question: 'Why does Validate Binary Search Tree (LeetCode #98) require passing boundary ranges (minVal, maxVal) rather than simply comparing each node with its immediate children?',
        options: [
          { id: 'opt-a', text: 'To avoid stack overflow.' },
          { id: 'opt-b', text: 'Because every node in the left subtree must be smaller than the root, even if it is a right child deeper in the left subtree.' },
          { id: 'opt-c', text: 'To count the number of nodes in logarithmic time.' },
          { id: 'opt-d', text: 'Because binary trees can have negative keys.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'A tree with root 5, left child 3, and 3\'s right child 6 is invalid because 6 > 5, even though 6 > 3 satisfies the local comparison.',
      },
      {
        id: 'tdfs-q2',
        question: 'In Binary Tree Lowest Common Ancestor (LeetCode #236), what does it mean when recursive calls on both root.left and root.right return non-null nodes?',
        options: [
          { id: 'opt-a', text: 'The tree is symmetric.' },
          { id: 'opt-b', text: 'Target node p is in one subtree and target node q is in the other, meaning current root is their lowest common ancestor.' },
          { id: 'opt-c', text: 'The tree has a cycle.' },
          { id: 'opt-d', text: 'Neither node exists in the tree.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Because p and q reside in split subtrees (one left, one right), the current node is the lowest node where their search paths diverge, making it their LCA.',
      },
      {
        id: 'tdfs-q3',
        question: 'Which traversal discipline is strictly required when computing the Diameter of a Binary Tree (LeetCode #543)?',
        options: [
          { id: 'opt-a', text: 'Preorder (Parent before children).' },
          { id: 'opt-b', text: 'Inorder (Left, Parent, Right).' },
          { id: 'opt-c', text: 'Postorder (Children before Parent), because a parent node cannot know its subtree depths until both left and right branches finish evaluating.' },
          { id: 'opt-d', text: 'Level order traversal.' },
        ],
        correctOptionId: 'opt-c',
        explanation: 'Postorder is bottom-up: we first obtain left_depth and right_depth from subtrees, then update global diameter with left_depth + right_depth, and return 1 + max(left_depth, right_depth) to the caller.',
      },
    ],
  },

  // 11. Tree BFS
  {
    slug: 'tree-bfs',
    title: 'Tree BFS',
    level: 'Intermediate',
    category: 'Trees & Queues',
    prerequisites: ['Binary Trees', 'FIFO Queues', 'Level-Order Traversal'],
    companiesTop: ['Amazon', 'Bloomberg', 'Microsoft', 'LinkedIn'],
    introTitle: 'What is Tree BFS?',
    introDescription: [
      'Tree Breadth-First Search (BFS) traverses a tree level-by-level horizontally, visiting all nodes at depth d before moving to depth d + 1.',
      'Tree BFS utilizes a FIFO queue. By recording the queue length at the beginning of each level iteration, it partitions nodes into distinct vertical levels, enabling level-order collection, zigzag printing, and finding right/left side views.',
    ],
    motivatingProblem: {
      title: 'Binary Tree Level Order Traversal (LeetCode #102)',
      description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (from left to right, level by level).',
      naiveApproach: 'Use DFS and pass depth d as parameter, appending to list[d].',
      optimalApproach: 'Use a FIFO queue with level-size batching. Dequeue all nodes belonging to current level and enqueue their children. Runs in O(N) time and O(W) space where W is max tree width.',
    },
    applicabilityInvariant: 'Tree BFS applies whenever nodes must be grouped or processed by horizontal depth, or when finding the shortest distance in an unweighted tree.',
    signals: [
      'Level order traversal returning a 2D array of node values',
      'Right side view or left side view of a binary tree',
      'Zigzag / spiral order traversal',
      'Minimum depth of a binary tree (finding the shallowest leaf)',
    ],
    antiSignals: [
      'Finding all root-to-leaf paths (use Tree DFS backtracking to avoid storing exponential nodes in queue)',
      'Subtree size aggregations requiring postorder traversal (use Tree DFS)',
    ],
    coreTechniqueTitle: 'The Queue Level-Size Batching Invariant',
    coreTechniqueDescription: 'At the start of each level loop, capture level_size = len(queue). Exactly level_size nodes belong to the current depth level.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Initialize Queue',
        description: 'queue = [root] (if root is not null).',
      },
      {
        title: 'Step 2: Snapshot Level Size',
        description: 'level_size = len(queue). Initialize current_level = [].',
      },
      {
        title: 'Step 3: Process Level Batch',
        description: 'Loop level_size times: popleft node, append node.val, and enqueue non-null left/right children.',
      },
    ],
    loopInvariant: 'At the start of loop iteration d, the queue contains exclusively all nodes at depth d from left to right.',
    variations: [
      {
        id: 'level-order',
        title: 'Standard Level Order (2D Array)',
        description: 'Collect node values grouped by depth level.',
        exampleProblem: 'LeetCode #102: Level Order Traversal',
        keyIdea: 'Queue length snapshot partitions nodes into discrete levels.',
      },
      {
        id: 'side-view',
        title: 'Right/Left Side View',
        description: 'The last node dequeued in each level loop is the visible side node.',
        exampleProblem: 'LeetCode #199: Binary Tree Right Side View',
        keyIdea: 'In level loop of size K, node at index K - 1 is the rightmost node.',
      },
      {
        id: 'minimum-depth',
        title: 'Minimum Depth (Shallowest Leaf)',
        description: 'Terminate early on the very first leaf node encountered.',
        exampleProblem: 'LeetCode #111: Minimum Depth of Binary Tree',
        keyIdea: 'BFS guarantees discovering the shortest path to a leaf first.',
      },
    ],
    pythonTemplate: `from collections import deque

def levelOrder(root) -> list[list[int]]:
    if not root:
        return []
    res = []
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res`,
    tsTemplate: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const res: number[][] = [];
  const q: TreeNode[] = [root];
  while (q.length > 0) {
    const levelSize = q.length;
    const currentLevel: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = q.shift()!;
      currentLevel.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(currentLevel);
  }
  return res;
}`,
    pythonBrute: `def levelOrder(root: Optional[TreeNode]) -> list[list[int]]:
    if not root: return []
    def get_depth(node):
        if not node: return 0
        return 1 + max(get_depth(node.left), get_depth(node.right))
    def get_level(node, d, current):
        if not node: return
        if d == 1: current.append(node.val)
        elif d > 1:
            get_level(node.left, d - 1, current)
            get_level(node.right, d - 1, current)
    h = get_depth(root)
    res = []
    for d in range(1, h + 1):
        lvl = []
        get_level(root, d, lvl)
        res.append(lvl)
    return res`,
    tsBrute: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  function getDepth(node: TreeNode | null): number {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  }
  function getLevel(node: TreeNode | null, d: number, bucket: number[]) {
    if (!node) return;
    if (d === 1) bucket.push(node.val);
    else if (d > 1) {
      getLevel(node.left, d - 1, bucket);
      getLevel(node.right, d - 1, bucket);
    }
  }
  const h = getDepth(root);
  const res: number[][] = [];
  for (let d = 1; d <= h; d++) {
    const lvl: number[] = [];
    getLevel(root, d, lvl);
    res.push(lvl);
  }
  return res;
}`,
    bruteComplexity: {
      time: 'O(N × H) ≈ O(N²)',
      space: 'O(H) aux',
      notes: 'Re-traverses the tree from the root for each level d without a queue.',
    },
    bruteExplanation: 'Traverse from root down to level d for each depth d without maintaining a FIFO queue, repeating node visits.',
    exampleProblemTitle: 'Binary Tree Level Order Traversal (LeetCode #102)',
    exampleProblemDescription: 'Return 2D array of node values level by level.',
    pythonExample: `from collections import deque
def levelOrder(root):
    if not root: return []
    ans, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            n = q.popleft()
            level.append(n.val)
            if n.left: q.append(n.left)
            if n.right: q.append(n.right)
        ans.append(level)
    return ans`,
    tsExample: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const ans: number[][] = [];
  const q: (TreeNode | null)[] = [root];
  let head = 0; // Pointer index keeps dequeue O(1) rather than O(N) Array.shift()
  while (head < q.length) {
    const len = q.length - head;
    const level: number[] = [];
    for (let i = 0; i < len; i++) {
      const node = q[head++]!;
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    ans.push(level);
  }
  return ans;
}`,
    codeExplanation: [
      'Check if root is null. Initialize FIFO queue with root.',
      'While queue is non-empty, measure level size.',
      'Iterate level size times: dequeue node, add its value to level list, enqueue children.',
      'Append level list to result.',
    ],
    complexity: {
      time: 'O(N)',
      space: 'O(W) aux / O(N) total',
      notes: 'O(W) auxiliary queue width (up to N/2 nodes in leaf layer of complete binary tree), and O(N) total space including returned level-order lists.',
    },
    pitfalls: [
      'Using Array.shift() in JavaScript on large arrays has O(K) complexity per shift; use pointer index or queue library for high performance.',
      'Not capturing queue length before the inner loop causes newly added children to be processed in the same level.',
    ],
    visualizerTitle: 'Tree BFS Level-Order Queue Visualizer',
    visualizerSubtitle: 'Step through queue FIFO processing and observe level-by-level batching.',
    mappings: [
      { questionId: 102, primaryPattern: 'tree-bfs', subpattern: 'level-order', subpatternLabel: 'Level Order', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 107, primaryPattern: 'tree-bfs', subpattern: 'level-order', subpatternLabel: 'Bottom-Up Level Order', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 103, primaryPattern: 'tree-bfs', subpattern: 'level-order', subpatternLabel: 'Zigzag Level Order', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 199, primaryPattern: 'tree-bfs', subpattern: 'side-view', subpatternLabel: 'Right Side View', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 111, primaryPattern: 'tree-bfs', subpattern: 'minimum-depth', subpatternLabel: 'Minimum Depth', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 637, primaryPattern: 'tree-bfs', subpattern: 'level-order', subpatternLabel: 'Average of Levels', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 515, primaryPattern: 'tree-bfs', subpattern: 'level-order', subpatternLabel: 'Largest Value Each Row', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 116, primaryPattern: 'tree-bfs', subpattern: 'level-order', subpatternLabel: 'Populating Next Pointers', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 117, primaryPattern: 'tree-bfs', subpattern: 'level-order', subpatternLabel: 'Populating Next Pointers II', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 863, primaryPattern: 'tree-bfs', subpattern: 'level-order', subpatternLabel: 'Distance K in Tree', learningOrder: 10, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'level-order', label: 'Level Order' },
      { id: 'side-view', label: 'Side Views' },
      { id: 'minimum-depth', label: 'Minimum Depth' },
    ],
    quiz: [
      {
        id: 'tbfs-q1',
        question: 'Why is BFS advantageous when finding the minimum depth of a binary tree (LeetCode #111)?',
        options: [
          { id: 'opt-a', text: 'BFS uses less memory.' },
          { id: 'opt-b', text: 'BFS explores level-by-level; as soon as the first leaf node is dequeued, its depth is guaranteed to be minimal, allowing early termination without visiting the remaining deeper branches.' },
          { id: 'opt-c', text: 'DFS cannot handle leaf nodes.' },
          { id: 'opt-d', text: 'Because trees are stored in heap memory.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Because BFS visits nodes in non-decreasing order of depth, the first leaf node dequeued is mathematically guaranteed to be at minimum depth, avoiding unnecessary exploration of deeper branches.',
      },
      {
        id: 'tbfs-q2',
        question: 'In standard level-order BFS, why must `levelSize = queue.length` be captured BEFORE entering the inner for-loop?',
        options: [
          { id: 'opt-a', text: 'To prevent JavaScript from running out of memory.' },
          { id: 'opt-b', text: 'Because the inner loop pushes children into the queue; without fixing levelSize upfront, the loop would consume newly added children in the current level.' },
          { id: 'opt-c', text: 'Because queue lengths are immutable.' },
          { id: 'opt-d', text: 'To ensure pointers move at speed 2.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Fixing levelSize partitions the queue into the current generation. The inner loop processes exactly those nodes belonging to the current depth before advancing to the next level.',
      },
      {
        id: 'tbfs-q3',
        question: 'In Binary Tree Right Side View (LeetCode #199), how can BFS identify which node belongs to the view at each level?',
        options: [
          { id: 'opt-a', text: 'The node with the largest integer value.' },
          { id: 'opt-b', text: 'The last node processed in each level (i === levelSize - 1) when visiting children left-to-right.' },
          { id: 'opt-c', text: 'Any node that has no left child.' },
          { id: 'opt-d', text: 'The root node only.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Processing children from left to right means the final node dequeued at index levelSize - 1 is the rightmost visible node on that horizontal slice.',
      },
    ],
  },

  // 12. Graph Traversal (DFS/BFS)
  {
    slug: 'graph-traversal',
    title: 'Graph Traversal (DFS/BFS)',
    level: 'Intermediate',
    category: 'Graphs',
    prerequisites: ['Adjacency Lists', 'Visited Sets', 'Queue/Stack Discipline'],
    companiesTop: ['Amazon', 'Google', 'Meta', 'Uber'],
    introTitle: 'What is Graph Traversal (DFS/BFS)?',
    introDescription: [
      'Graph Traversal is the systematic process of visiting every vertex and edge in a network of interconnected nodes. Unlike trees, general graphs can contain cycles and disconnected components.',
      'To prevent infinite cycles, graph traversals maintain a visited set. BFS uses a queue to find shortest paths in unweighted graphs, while DFS uses recursion/stack to explore connectivity, flood fill regions, and detect cycles.',
    ],
    motivatingProblem: {
      title: 'Number of Islands (LeetCode #200)',
      description: 'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.',
      naiveApproach: 'Scan grid without marking visited cells, causing infinite recursion over adjacent land cells.',
      optimalApproach: 'Iterate over every cell. When a "1" is encountered, increment island count and flood-fill (sink) all connected land cells to "0" via DFS or BFS. Runs in O(R * C) time.',
    },
    applicabilityInvariant: 'Graph Traversal requires marking nodes as visited immediately upon discovery (or sinking cells in grids) to guarantee each vertex is processed at most once, preventing infinite loops caused by cycles.',
    signals: [
      '2D grids representing maps, mazes, or connected regions (e.g. islands)',
      'Finding the shortest path or minimum transformations in unweighted state spaces (e.g. Word Ladder)',
      'Checking if a graph is bipartite (2-colorable)',
      'Cloning connected graph data structures',
    ],
    antiSignals: [
      'Weighted graphs with varying edge costs (use Dijkstra\'s Algorithm or Bellman-Ford)',
      'Finding dynamic connectivity between sets (Union Find is faster)',
    ],
    coreTechniqueTitle: 'Visited State Tracking & Frontier Expansion',
    coreTechniqueDescription: 'Add start node to visited set and frontier queue/stack. Explore adjacent neighbors; only process unvisited neighbors.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Outer Component Loop',
        description: 'Iterate through all vertices to handle disconnected subgraphs.',
      },
      {
        title: 'Step 2: Frontier Dequeue/Pop',
        description: 'Remove node u from frontier (queue for BFS, stack for DFS).',
      },
      {
        title: 'Step 3: Explore Neighbors',
        description: 'For each neighbor v in adj[u]: if v not in visited: mark visited and add to frontier.',
      },
    ],
    loopInvariant: 'At any point, every node in the visited set has been discovered, and no node is ever pushed to the frontier more than once.',
    variations: [
      {
        id: 'grid-flood-fill',
        title: 'Grid Flood Fill (Islands)',
        description: 'Traverse 4-directionally adjacent cells in a matrix.',
        exampleProblem: 'LeetCode #200: Number of Islands',
        keyIdea: 'Sink visited land cells in-place (grid[r][c] = "0") to save memory.',
      },
      {
        id: 'multi-source-bfs',
        title: 'Multi-Source BFS',
        description: 'Initialize queue with all initial source nodes simultaneously.',
        exampleProblem: 'LeetCode #994: Rotting Oranges',
        keyIdea: 'Frontier expands concurrently outward from all source locations at distance 0.',
      },
      {
        id: 'bipartite-check',
        title: 'Bipartite 2-Coloring',
        description: 'Color neighbors with alternating color (0 and 1).',
        exampleProblem: 'LeetCode #785: Is Graph Bipartite?',
        keyIdea: 'If an adjacent neighbor already has the same color, an odd cycle exists -> not bipartite.',
      },
    ],
    pythonTemplate: `def numIslands(grid: list[list[str]]) -> int:
    if not grid or not grid[0]:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                # Iterative traversal: avoids Python recursion limit on large grids
                stack = [(r, c)]
                grid[r][c] = '0'
                while stack:
                    curr_r, curr_c = stack.pop()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            stack.append((nr, nc))
    return count`,
    tsTemplate: `function numIslands(grid: string[][]): number {
  if (!grid.length || !grid[0].length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        const stack: [number, number][] = [[r, c]];
        grid[r][c] = '0';
        while (stack.length > 0) {
          const [cr, cc] = stack.pop()!;
          for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const nr = cr + dr, nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
              grid[nr][nc] = '0';
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return count;
}`,
    pythonBrute: `def numIslands(grid: list[list[str]]) -> int:
    if not grid or not grid[0]: return 0
    R, C = len(grid), len(grid[0])
    visited = [[False] * C for _ in range(R)]
    islands = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == '1' and not visited[r][c]:
                islands += 1
                stack = [(r, c)]
                visited[r][c] = True
                while stack:
                    cr, cc = stack.pop()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == '1' and not visited[nr][nc]:
                            visited[nr][nc] = True
                            stack.append((nr, nc))
    return islands`,
    tsBrute: `function numIslands(grid: string[][]): number {
  if (!grid.length || !grid[0].length) return 0;
  const R = grid.length, C = grid[0].length;
  const visited = Array.from({ length: R }, () => new Array(C).fill(false));
  let islands = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === '1' && !visited[r][c]) {
        islands++;
        const stack: [number, number][] = [[r, c]];
        visited[r][c] = true;
        while (stack.length > 0) {
          const [cr, cc] = stack.pop()!;
          for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const nr = cr + dr, nc = cc + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === '1' && !visited[nr][nc]) {
              visited[nr][nc] = true;
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return islands;
}`,
    bruteComplexity: {
      time: 'O(R × C)',
      space: 'O(R × C)',
      notes: 'Allocates an external visited matrix instead of mutating the grid in-place.',
    },
    bruteExplanation: 'Allocate an external R x C visited boolean matrix and track state instead of in-place grid sinking.',
    exampleProblemTitle: 'Number of Islands (LeetCode #200)',
    exampleProblemDescription: 'Count connected components of 1s in a 2D binary grid.',
    pythonExample: `def numIslands(grid: list[list[str]]) -> int:
    if not grid or not grid[0]:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                # Iterative traversal: avoids Python recursion limit on large grids
                stack = [(r, c)]
                grid[r][c] = '0'
                while stack:
                    curr_r, curr_c = stack.pop()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = curr_r + dr, curr_c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            grid[nr][nc] = '0'
                            stack.append((nr, nc))
    return count`,
    tsExample: `function numIslands(grid: string[][]): number {
  if (!grid.length || !grid[0].length) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        const stack: [number, number][] = [[r, c]];
        grid[r][c] = '0';
        while (stack.length > 0) {
          const [cr, cc] = stack.pop()!;
          for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const nr = cr + dr, nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
              grid[nr][nc] = '0';
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }
  return count;
}`,
    codeExplanation: [
      'Iterate through every cell (r, c) in the grid.',
      'When an unvisited land cell "1" is encountered, increment island counter.',
      'Trigger DFS/BFS to sink all orthogonally connected land cells to "0".',
      'Return the total number of connected components found.',
    ],
    complexity: {
      time: 'O(V + E) = O(R × C)',
      space: 'O(R × C)',
      notes: 'Every cell is visited a constant number of times. Recursion stack can reach R * C in worst case.',
    },
    pitfalls: [
      'In BFS, forgetting to mark nodes as visited at the time of enqueuing (rather than dequeuing) causes duplicate enqueues and memory explosion.',
      'Not validating grid boundaries before array indexing causing out-of-bounds errors.',
    ],
    visualizerTitle: 'Graph Flood Fill Visualizer',
    visualizerSubtitle: 'Step through connected component exploration across a 2D grid.',
    mappings: [
      { questionId: 200, primaryPattern: 'graph-traversal', subpattern: 'grid-flood-fill', subpatternLabel: 'Number of Islands', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 695, primaryPattern: 'graph-traversal', subpattern: 'grid-flood-fill', subpatternLabel: 'Max Area Island', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 733, primaryPattern: 'graph-traversal', subpattern: 'grid-flood-fill', subpatternLabel: 'Flood Fill', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 133, primaryPattern: 'graph-traversal', subpattern: 'graph-node-cloning', subpatternLabel: 'Clone Graph', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 841, primaryPattern: 'graph-traversal', subpattern: 'graph-reachability', subpatternLabel: 'Keys and Rooms', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 785, primaryPattern: 'graph-traversal', subpattern: 'bipartite-check', subpatternLabel: 'Is Graph Bipartite', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 130, primaryPattern: 'graph-traversal', subpattern: 'grid-flood-fill', subpatternLabel: 'Surrounded Regions', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 417, primaryPattern: 'graph-traversal', subpattern: 'grid-flood-fill', subpatternLabel: 'Pacific Atlantic Flow', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 994, primaryPattern: 'graph-traversal', subpattern: 'multi-source-bfs', subpatternLabel: 'Rotting Oranges', learningOrder: 9, reviewStatus: 'verified' },
      { questionId: 127, primaryPattern: 'graph-traversal', subpattern: 'state-space-shortest-path-bfs', subpatternLabel: 'Word Ladder', learningOrder: 10, reviewStatus: 'verified' },
      { questionId: 797, primaryPattern: 'graph-traversal', subpattern: 'dag-path-enumeration', subpatternLabel: 'All Paths Source Target', learningOrder: 11, reviewStatus: 'verified' },
      { questionId: 752, primaryPattern: 'graph-traversal', subpattern: 'state-space-shortest-path-bfs', subpatternLabel: 'Open the Lock', learningOrder: 12, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'grid-flood-fill', label: 'Grid Flood Fill' },
      { id: 'graph-node-cloning', label: 'Node Cloning & Mapping' },
      { id: 'graph-reachability', label: 'Graph Reachability' },
      { id: 'dag-path-enumeration', label: 'DAG Path Enumeration' },
      { id: 'state-space-shortest-path-bfs', label: 'State-Space Shortest Path BFS' },
      { id: 'multi-source-bfs', label: 'Multi-Source BFS' },
      { id: 'bipartite-check', label: 'Bipartite Coloring' },
    ],
    quiz: [
      {
        id: 'gt-q1',
        question: 'When implementing Graph BFS, why MUST a node be marked as visited at the time it is added to the queue, rather than when it is popped?',
        options: [
          { id: 'opt-a', text: 'To make the algorithm run in reverse.' },
          { id: 'opt-b', text: 'To prevent multiple neighboring nodes from enqueuing the same vertex repeatedly, avoiding redundant processing and uncontrolled queue growth up to O(V × E).' },
          { id: 'opt-c', text: 'Because queues cannot store unvisited nodes.' },
          { id: 'opt-d', text: 'To sort the queue.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'If marking is delayed until dequeuing, multiple paths see the same neighbor as unvisited and push duplicate copies into the queue. Marking on enqueue guarantees each vertex enters the queue at most once.',
      },
      {
        id: 'gt-q2',
        question: 'In directed graph cycle detection using DFS, why are 3 states (e.g. UNVISITED, VISITING / on stack, VISITED / completed) required?',
        options: [
          { id: 'opt-a', text: 'To optimize CPU cache alignment.' },
          { id: 'opt-b', text: 'To distinguish between a back-edge to an active ancestor in the current recursion path (a cycle) versus a cross-edge to an already fully explored branch (not a cycle).' },
          { id: 'opt-c', text: 'Because directed graphs cannot be traversed with boolean arrays.' },
          { id: 'opt-d', text: 'To count components in O(1).' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'In a DAG (e.g. diamond A -> B, A -> C, B -> D, C -> D), D is reached via two paths. When traversing from C, D is already visited, but it is NOT in the current stack, so it is a cross-edge, not a cycle.',
      },
      {
        id: 'gt-q3',
        question: 'When solving grid flood-fill problems (like Number of Islands, LC #200), what is the optimal way to avoid allocating O(M × N) auxiliary space for a visited set?',
        options: [
          { id: 'opt-a', text: 'Mutate the grid in-place by setting visited land cells grid[r][c] = "0".' },
          { id: 'opt-b', text: 'Convert the grid to an adjacency matrix.' },
          { id: 'opt-c', text: 'Use a single integer pointer.' },
          { id: 'opt-d', text: 'Traverse only odd rows.' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'Sinking visited land cells in-place (changing "1" to "0") consumes O(1) auxiliary heap space, reducing memory usage to only the traversal call stack or queue.',
      },
    ],
  },

  // 13. Topological Sort
  {
    slug: 'topological-sort',
    title: 'Topological Sort',
    level: 'Intermediate',
    category: 'Graphs & DAGs',
    prerequisites: ['Directed Graphs', 'In-Degrees', 'Kahn\'s Algorithm'],
    companiesTop: ['Amazon', 'Microsoft', 'Google', 'DoorDash'],
    introTitle: 'What is Topological Sort?',
    introDescription: [
      'Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u appears before vertex v in the ordering.',
      'It is the definitive algorithm for resolving build order dependencies, course prerequisite scheduling, and compilation workflows. A valid topological sort exists if and only if the directed graph contains zero cycles; if a cycle exists, Kahn\'s algorithm detects it immediately.',
    ],
    motivatingProblem: {
      title: 'Course Schedule II (LeetCode #210)',
      description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take bi first if you want to take ai. Return the ordering of courses you should take to finish all courses.',
      naiveApproach: 'Try all permutations of courses: O(N!) time complexity.',
      optimalApproach: 'Kahn\'s algorithm: compute in-degrees for all courses. Enqueue courses with in-degree 0. As each course is completed, decrement in-degrees of dependent courses. Runs in O(V + E) time.',
    },
    applicabilityInvariant: 'A directed graph admits a topological sort if and only if it is a DAG (contains no directed cycles). If Kahn\'s algorithm processes fewer than |V| vertices, a cycle is proven to exist.',
    signals: [
      'Prerequisite relationships, dependency orderings, task scheduling',
      'Detecting circular dependencies or deadlocks in directed graphs',
      'Ordering tasks before execution in build systems',
    ],
    antiSignals: [
      'Undirected graphs (every undirected edge acts as a 2-cycle)',
      'Graphs with bidirectional cycles where no linear ordering can exist',
    ],
    coreTechniqueTitle: 'Kahn\'s In-Degree Reduction Algorithm',
    coreTechniqueDescription: 'Courses with in-degree 0 have no prerequisites and can be taken immediately. Completing them unlocks subsequent courses.',
    coreTechniqueSteps: [
      {
        title: 'Step 1: Compute In-Degrees',
        description: 'in_degree[v] counts incoming prerequisite edges for every node v.',
      },
      {
        title: 'Step 2: Enqueue In-Degree 0',
        description: 'Initialize queue with all vertices having in_degree == 0.',
      },
      {
        title: 'Step 3: Process and Decrement',
        description: 'Dequeue u, append to order. For each edge u -> v, decrement in_degree[v]. If in_degree[v] == 0, enqueue v.',
      },
      {
        title: 'Step 4: Cycle Verification',
        description: 'If order length == V, return order. Otherwise, return [] (cycle detected).',
      },
    ],
    loopInvariant: 'At any point, the queue contains exclusively all vertices whose prerequisites have been completely resolved and satisfied.',
    variations: [
      {
        id: 'kahns-bfs',
        title: 'Kahn\'s Algorithm (In-Degree BFS)',
        description: 'Queue-based in-degree reduction processing on DAGs.',
        exampleProblem: 'LeetCode #207 & #210: Course Schedule I & II',
        keyIdea: 'Nodes with in-degree 0 are ready to execute; decrement neighbors as nodes finish.',
      },
      {
        id: 'dfs-postorder',
        title: 'DFS-based Topological Sort',
        description: 'DFS visit with 3-state coloring; reverse post-order produces topological order.',
        exampleProblem: 'LeetCode #210: Course Schedule II',
        keyIdea: 'Finished nodes pushed to stack; reverse of finishing times is topological order.',
      },
      {
        id: 'leaf-pruning-kahn-analogy',
        title: 'Tree Centroid / Leaf Pruning (Kahn Analogy)',
        description: 'Iterative degree-peeling on undirected trees trimming leaves (degree 1) inward to find centroids.',
        exampleProblem: 'LeetCode #310: Minimum Height Trees',
        keyIdea: 'Applies Kahn\'s degree-reduction intuition to undirected trees to find center nodes in O(V) time.',
      },
    ],
    pythonTemplate: `from collections import deque

def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    adj = {i: [] for i in range(numCourses)}
    in_degree = [0] * numCourses
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1
    q = deque([i for i in range(numCourses) if in_degree[i] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)
    return order if len(order) == numCourses else []`,
    tsTemplate: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree: number[] = new Array(numCourses).fill(0);
  for (const [dest, src] of prerequisites) {
    adj[src].push(dest);
    inDegree[dest]++;
  }
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) q.push(i);
  }
  const order: number[] = [];
  while (q.length > 0) {
    const u = q.shift()!;
    order.push(u);
    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) q.push(v);
    }
  }
  return order.length === numCourses ? order : [];
}`,
    pythonBrute: `def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    in_degrees = [0] * numCourses
    for dest, src in prerequisites:
        in_degrees[dest] += 1
    order = []
    for _ in range(numCourses):
        found = -1
        for c in range(numCourses):
            if in_degrees[c] == 0:
                found = c
                break
        if found == -1:
            return []  # Cycle
        order.append(found)
        in_degrees[found] = -1
        for dest, src in prerequisites:
            if src == found:
                in_degrees[dest] -= 1
    return order`,
    tsBrute: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const inDegrees = new Array(numCourses).fill(0);
  for (const [dest, src] of prerequisites) inDegrees[dest]++;
  const order: number[] = [];
  for (let step = 0; step < numCourses; step++) {
    let found = -1;
    for (let c = 0; c < numCourses; c++) {
      if (inDegrees[c] === 0) { found = c; break; }
    }
    if (found === -1) return []; // Cycle
    order.push(found);
    inDegrees[found] = -1;
    for (const [dest, src] of prerequisites) {
      if (src === found) inDegrees[dest]--;
    }
  }
  return order;
}`,
    bruteComplexity: {
      time: 'O(V² + V × E)',
      space: 'O(V)',
      notes: 'Repeatedly searches for 0 in-degree courses by scanning the in-degree array and full edge list.',
    },
    bruteExplanation: 'Scan courses and the full edge list on every step without an adjacency list or queue.',
    exampleProblemTitle: 'Course Schedule II (LeetCode #210)',
    exampleProblemDescription: 'Return ordering of courses to complete all prerequisites, or empty list if cycle exists.',
    pythonExample: `from collections import deque
def findOrder(numCourses, prerequisites):
    adj = [[] for _ in range(numCourses)]
    deg = [0] * numCourses
    for d, s in prerequisites:
        adj[s].append(d)
        deg[d] += 1
    q = deque([i for i in range(numCourses) if deg[i] == 0])
    res = []
    while q:
        u = q.popleft()
        res.append(u)
        for v in adj[u]:
            deg[v] -= 1
            if deg[v] == 0:
                q.append(v)
    return res if len(res) == numCourses else []`,
    tsExample: `function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const adj: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);
  for (const [d, s] of prerequisites) {
    adj[s].push(d); inDegree[d]++;
  }
  const q: number[] = [];
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);
  const res: number[] = [];
  let head = 0; // Pointer index keeps dequeue O(1) rather than O(N) Array.shift()
  while (head < q.length) {
    const u = q[head++];
    res.push(u);
    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) q.push(v);
    }
  }
  return res.length === numCourses ? res : [];
}`,
    codeExplanation: [
      'Build adjacency list and in-degree array from prerequisite pairs.',
      'Enqueue all courses with in-degree 0.',
      'While queue is non-empty, dequeue course u and append to order.',
      'For every course v dependent on u, decrement in_degree[v]. If in_degree[v] becomes 0, enqueue v.',
      'If processed course count equals numCourses, return order; otherwise return empty array (cycle detected).',
    ],
    complexity: {
      time: 'O(V + E)',
      space: 'O(V + E)',
      notes: 'Every vertex is enqueued once, and every directed edge is examined once.',
    },
    pitfalls: [
      'Reversing edge direction: prerequisites [a, b] means b must be taken BEFORE a (edge is b -> a, not a -> b).',
      'Forgetting that if order length < numCourses, the graph has a cycle and must return an empty list.',
    ],
    visualizerTitle: 'Topological Sort Kahn\'s Visualizer',
    visualizerSubtitle: 'Step through in-degree reductions and watch courses unlock linearly.',
    mappings: [
      { questionId: 207, primaryPattern: 'topological-sort', subpattern: 'kahns-bfs', subpatternLabel: 'Course Schedule I', learningOrder: 1, reviewStatus: 'verified' },
      { questionId: 210, primaryPattern: 'topological-sort', subpattern: 'kahns-bfs', subpatternLabel: 'Course Schedule II', learningOrder: 2, reviewStatus: 'verified' },
      { questionId: 310, primaryPattern: 'topological-sort', subpattern: 'leaf-pruning-kahn-analogy', subpatternLabel: 'Tree Leaf Pruning (Kahn Analogy)', learningOrder: 3, reviewStatus: 'verified' },
      { questionId: 802, primaryPattern: 'topological-sort', subpattern: 'kahns-bfs', subpatternLabel: 'Eventual Safe States', learningOrder: 4, reviewStatus: 'verified' },
      { questionId: 2115, primaryPattern: 'topological-sort', subpattern: 'kahns-bfs', subpatternLabel: 'Recipe Supplies', learningOrder: 5, reviewStatus: 'verified' },
      { questionId: 1462, primaryPattern: 'topological-sort', subpattern: 'kahns-bfs', subpatternLabel: 'Course Schedule IV', learningOrder: 6, reviewStatus: 'verified' },
      { questionId: 1203, primaryPattern: 'topological-sort', subpattern: 'kahns-bfs', subpatternLabel: 'Grouped Sort', learningOrder: 7, reviewStatus: 'verified' },
      { questionId: 329, primaryPattern: 'topological-sort', subpattern: 'dfs-postorder', subpatternLabel: 'Longest Increasing Path', learningOrder: 8, reviewStatus: 'verified' },
      { questionId: 851, primaryPattern: 'topological-sort', subpattern: 'kahns-bfs', subpatternLabel: 'Loud and Rich', learningOrder: 9, reviewStatus: 'verified' },
    ],
    subpatternTabs: [
      { id: 'kahns-bfs', label: 'Kahn\'s Algorithm' },
      { id: 'dfs-postorder', label: 'DFS Topological Sort' },
      { id: 'leaf-pruning-kahn-analogy', label: 'Tree Leaf Pruning' },
    ],
    quiz: [
      {
        id: 'ts-q1',
        question: 'In Kahn\'s algorithm, how do we definitively know whether the graph contains a directed cycle?',
        options: [
          { id: 'opt-a', text: 'If the queue ever contains more than 5 nodes.' },
          { id: 'opt-b', text: 'If the total number of vertices added to the final topological ordering is strictly less than the total number of vertices |V|.' },
          { id: 'opt-c', text: 'If the in-degree array contains negative numbers.' },
          { id: 'opt-d', text: 'By running Dijkstra\'s algorithm.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Nodes inside a directed cycle have at least one incoming edge that can never be resolved because each node waits on another node in the loop. Consequently, their in-degrees never reach 0, they never enter the queue, and order.length < V.',
      },
      {
        id: 'ts-q2',
        question: 'Can an undirected graph have a valid topological sort?',
        options: [
          { id: 'opt-a', text: 'Yes, if the graph is connected.' },
          { id: 'opt-b', text: 'No, because an undirected edge between u and v represents a bidirectional dependency (u -> v and v -> u), forming a trivial 2-cycle.' },
          { id: 'opt-c', text: 'Yes, if we sort nodes by degree.' },
          { id: 'opt-d', text: 'Only if the graph has an odd number of vertices.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'Topological sorting is strictly defined for Directed Acyclic Graphs (DAGs). Any undirected edge creates mutual mutual dependencies, violating linear ordering invariants.',
      },
      {
        id: 'ts-q3',
        question: 'When implementing Topological Sort using DFS postorder traversal, how do you obtain the correct ordering?',
        options: [
          { id: 'opt-a', text: 'Use the postorder list directly.' },
          { id: 'opt-b', text: 'Reverse the postorder completion list (or prepend nodes as they finish recursion).' },
          { id: 'opt-c', text: 'Sort the vertices alphabetically.' },
          { id: 'opt-d', text: 'Take every second node.' },
        ],
        correctOptionId: 'opt-b',
        explanation: 'In DFS, a node finishes and appends to the postorder list only after all of its descendants have completely finished. Reversing this list ensures that prerequisites precede the nodes that depend on them.',
      },
    ],
  },
];
