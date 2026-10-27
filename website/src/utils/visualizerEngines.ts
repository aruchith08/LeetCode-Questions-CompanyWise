import type { GenericVisualizerStep } from '../types/patterns';

// 1. Hashing & Frequency Counting (Two Sum example)
export function generateHashingSteps(
  nums: number[] = [2, 7, 11, 15],
  target: number = 9
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const map: Record<number, number> = {};

  steps.push({
    stepNumber: 1,
    title: 'Initialize Hash Map',
    explanation: `Searching for two numbers that sum to ${target} in array [${nums.join(', ')}]. Start with an empty hash map to store seen values and their indices.`,
    elements: nums,
    highlightIndices: [],
    metrics: [
      { label: 'Target', value: target },
      { label: 'Map Entries', value: 0 },
    ],
    auxiliaryData: { map: {} },
    statusBadge: { label: 'Initialized', variant: 'info' },
  });

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    const complement = target - val;

    if (complement in map) {
      const compIdx = map[complement];
      steps.push({
        stepNumber: steps.length + 1,
        title: `Match Found! ${val} + ${complement} = ${target}`,
        explanation: `At index ${i}, element is ${val}. Complement needed is ${target} - ${val} = ${complement}. Complement ${complement} was found in the hash map at index ${compIdx}! Solution indices: [${compIdx}, ${i}].`,
        elements: nums,
        highlightIndices: [compIdx, i],
        activePointers: [
          { name: 'Complement', index: compIdx, color: 'emerald' },
          { name: 'Current', index: i, color: 'emerald' },
        ],
        metrics: [
          { label: 'Target', value: target },
          { label: 'Found Pair', value: `[${complement}, ${val}]` },
          { label: 'Indices', value: `[${compIdx}, ${i}]` },
        ],
        auxiliaryData: { map: { ...map }, complement, found: true },
        statusBadge: { label: 'Solution Found', variant: 'success' },
      });
      break;
    } else {
      map[val] = i;
      steps.push({
        stepNumber: steps.length + 1,
        title: `Inspect Index ${i} (${val})`,
        explanation: `At index ${i}, element is ${val}. Complement needed is ${target} - ${val} = ${complement}. Not in hash map yet. Insert key ${val} -> index ${i} into map.`,
        elements: nums,
        highlightIndices: [i],
        activePointers: [{ name: 'Current', index: i, color: 'blue' }],
        metrics: [
          { label: 'Current Val', value: val },
          { label: 'Complement', value: complement },
          { label: 'Map Entries', value: Object.keys(map).length },
        ],
        auxiliaryData: { map: { ...map } },
        statusBadge: { label: 'Stored in Map', variant: 'info' },
      });
    }
  }

  return steps;
}

// 2. Two Pointers (Two Sum II sorted array)
export function generateTwoPointersSteps(
  nums: number[] = [1, 2, 4, 6, 8, 11],
  target: number = 10
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  let left = 0;
  let right = nums.length - 1;

  steps.push({
    stepNumber: 1,
    title: 'Initialize Left & Right Pointers',
    explanation: `Array is sorted: [${nums.join(', ')}]. Place Left pointer at start (index 0, val ${nums[left]}) and Right pointer at end (index ${right}, val ${nums[right]}). Target sum is ${target}.`,
    elements: nums,
    highlightIndices: [left, right],
    activePointers: [
      { name: 'L', index: left, color: 'indigo' },
      { name: 'R', index: right, color: 'rose' },
    ],
    metrics: [
      { label: 'Left', value: `nums[${left}] = ${nums[left]}` },
      { label: 'Right', value: `nums[${right}] = ${nums[right]}` },
      { label: 'Sum', value: nums[left] + nums[right] },
      { label: 'Target', value: target },
    ],
    statusBadge: { label: 'Initialized', variant: 'info' },
  });

  while (left < right) {
    const sum = nums[left] + nums[right];

    if (sum === target) {
      steps.push({
        stepNumber: steps.length + 1,
        title: `Target Reached: ${nums[left]} + ${nums[right]} = ${target}`,
        explanation: `Current sum ${nums[left]} + ${nums[right]} equals target ${target}! Pointers at indices [${left}, ${right}].`,
        elements: nums,
        highlightIndices: [left, right],
        activePointers: [
          { name: 'L', index: left, color: 'emerald' },
          { name: 'R', index: right, color: 'emerald' },
        ],
        metrics: [
          { label: 'Pair', value: `[${nums[left]}, ${nums[right]}]` },
          { label: 'Indices', value: `[${left}, ${right}]` },
          { label: 'Sum', value: sum },
        ],
        statusBadge: { label: 'Match Found', variant: 'success' },
      });
      break;
    } else if (sum < target) {
      const prevL = left;
      left++;
      steps.push({
        stepNumber: steps.length + 1,
        title: `Sum (${sum}) < Target (${target}) -> Advance Left`,
        explanation: `Sum ${nums[prevL]} + ${nums[right]} = ${sum} is too small. Because array is sorted, any pair using nums[${prevL}] will also be < ${target}. Increment Left from ${prevL} to ${left} to increase sum.`,
        elements: nums,
        highlightIndices: [left, right],
        activePointers: [
          { name: 'L', index: left, color: 'indigo' },
          { name: 'R', index: right, color: 'rose' },
        ],
        metrics: [
          { label: 'Old Sum', value: sum },
          { label: 'New Sum', value: nums[left] + nums[right] },
          { label: 'Target', value: target },
        ],
        statusBadge: { label: 'Shift Left ->', variant: 'warning' },
      });
    } else {
      const prevR = right;
      right--;
      steps.push({
        stepNumber: steps.length + 1,
        title: `Sum (${sum}) > Target (${target}) -> Decrement Right`,
        explanation: `Sum ${nums[left]} + ${nums[prevR]} = ${sum} is too large. Any pair using nums[${prevR}] will also be > ${target}. Decrement Right from ${prevR} to ${right} to decrease sum.`,
        elements: nums,
        highlightIndices: [left, right],
        activePointers: [
          { name: 'L', index: left, color: 'indigo' },
          { name: 'R', index: right, color: 'rose' },
        ],
        metrics: [
          { label: 'Old Sum', value: sum },
          { label: 'New Sum', value: nums[left] + nums[right] },
          { label: 'Target', value: target },
        ],
        statusBadge: { label: '<- Shift Right', variant: 'warning' },
      });
    }
  }

  return steps;
}

// 3. Prefix Sum (1D array cumulative sum and range query)
export function generatePrefixSumSteps(
  nums: number[] = [2, 4, 1, 3, 5],
  query: [number, number] = [1, 3]
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const prefix: number[] = [0];

  steps.push({
    stepNumber: 1,
    title: 'Initialize 1-Indexed Prefix Array',
    explanation: `Original array: [${nums.join(', ')}]. Initialize prefix sum array with base P[0] = 0. Length is ${nums.length + 1}.`,
    elements: nums,
    highlightIndices: [],
    auxiliaryData: { prefix: [0] },
    metrics: [
      { label: 'Original Length', value: nums.length },
      { label: 'P[0]', value: 0 },
    ],
    statusBadge: { label: 'Base P[0] = 0', variant: 'info' },
  });

  for (let i = 0; i < nums.length; i++) {
    const nextSum = prefix[prefix.length - 1] + nums[i];
    prefix.push(nextSum);

    steps.push({
      stepNumber: steps.length + 1,
      title: `Compute P[${i + 1}] = P[${i}] + nums[${i}]`,
      explanation: `Add nums[${i}] = ${nums[i]} to running total ${prefix[i]}. Result P[${i + 1}] = ${nextSum}. Prefix array is now [${prefix.join(', ')}].`,
      elements: nums,
      highlightIndices: [i],
      activePointers: [{ name: `+nums[${i}]`, index: i, color: 'emerald' }],
      auxiliaryData: { prefix: [...prefix] },
      metrics: [
        { label: `nums[${i}]`, value: nums[i] },
        { label: `P[${i + 1}]`, value: nextSum },
        { label: 'Formula', value: `${prefix[i]} + ${nums[i]} = ${nextSum}` },
      ],
      statusBadge: { label: 'Accumulating', variant: 'info' },
    });
  }

  // Range Query Demonstration
  const [L, R] = query;
  const rangeSum = prefix[R + 1] - prefix[L];
  const queryIndices = [];
  for (let i = L; i <= R; i++) queryIndices.push(i);

  steps.push({
    stepNumber: steps.length + 1,
    title: `O(1) Range Query: sum(indices ${L}..${R})`,
    explanation: `Calculate sum of subarray [${queryIndices.map(i => nums[i]).join(', ')}] in O(1) time: P[${R + 1}] - P[${L}] = ${prefix[R + 1]} - ${prefix[L]} = ${rangeSum}.`,
    elements: nums,
    highlightIndices: queryIndices,
    auxiliaryData: { prefix: [...prefix], query: { L, R, rangeSum } },
    metrics: [
      { label: 'Query Range', value: `[${L}..${R}]` },
      { label: `P[${R + 1}]`, value: prefix[R + 1] },
      { label: `P[${L}]`, value: prefix[L] },
      { label: 'Range Sum', value: rangeSum },
    ],
    statusBadge: { label: `Result = ${rangeSum}`, variant: 'success' },
  });

  return steps;
}

// 4. Binary Search (Search in sorted array)
export function generateBinarySearchSteps(
  nums: number[] = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
  target: number = 23
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  let left = 0;
  let right = nums.length - 1;

  steps.push({
    stepNumber: 1,
    title: 'Initialize Binary Search Space',
    explanation: `Target is ${target} in sorted array of ${nums.length} elements. Search boundaries: Left = 0, Right = ${right}. Search window size: ${nums.length}.`,
    elements: nums,
    highlightIndices: [left, right],
    activePointers: [
      { name: 'L', index: left, color: 'indigo' },
      { name: 'R', index: right, color: 'rose' },
    ],
    metrics: [
      { label: 'Left', value: left },
      { label: 'Right', value: right },
      { label: 'Target', value: target },
    ],
    statusBadge: { label: 'Start Search', variant: 'info' },
  });

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    const midVal = nums[mid];

    if (midVal === target) {
      steps.push({
        stepNumber: steps.length + 1,
        title: `Target Found! nums[${mid}] === ${target}`,
        explanation: `Midpoint index ${mid} has value ${midVal}, matching target ${target}! Search finishes successfully in logarithmic steps.`,
        elements: nums,
        highlightIndices: [mid],
        activePointers: [
          { name: 'Target', index: mid, color: 'emerald' },
        ],
        metrics: [
          { label: 'Found Index', value: mid },
          { label: 'Value', value: midVal },
        ],
        statusBadge: { label: 'Target Located', variant: 'success' },
      });
      break;
    } else if (midVal < target) {
      steps.push({
        stepNumber: steps.length + 1,
        title: `nums[${mid}] (${midVal}) < Target (${target}) -> Discard Left Half`,
        explanation: `Midpoint ${mid} has value ${midVal} which is smaller than ${target}. Since array is sorted, all elements from index ${left} to ${mid} are also < ${target}. Set Left = ${mid + 1}.`,
        elements: nums,
        highlightIndices: [mid],
        activePointers: [
          { name: 'L', index: left, color: 'indigo' },
          { name: 'M', index: mid, color: 'amber' },
          { name: 'R', index: right, color: 'rose' },
        ],
        metrics: [
          { label: 'Mid Val', value: midVal },
          { label: 'Target', value: target },
          { label: 'Next Left', value: mid + 1 },
        ],
        statusBadge: { label: 'Search Right Half', variant: 'warning' },
      });
      left = mid + 1;
    } else {
      steps.push({
        stepNumber: steps.length + 1,
        title: `nums[${mid}] (${midVal}) > Target (${target}) -> Discard Right Half`,
        explanation: `Midpoint ${mid} has value ${midVal} which is greater than ${target}. All elements from index ${mid} to ${right} are also > ${target}. Set Right = ${mid - 1}.`,
        elements: nums,
        highlightIndices: [mid],
        activePointers: [
          { name: 'L', index: left, color: 'indigo' },
          { name: 'M', index: mid, color: 'amber' },
          { name: 'R', index: right, color: 'rose' },
        ],
        metrics: [
          { label: 'Mid Val', value: midVal },
          { label: 'Target', value: target },
          { label: 'Next Right', value: mid - 1 },
        ],
        statusBadge: { label: 'Search Left Half', variant: 'warning' },
      });
      right = mid - 1;
    }
  }

  return steps;
}

// 5. Fast & Slow Pointers (Floyd's Cycle Detection)
export function generateFastSlowSteps(): GenericVisualizerStep[] {
  // Implicit cycle: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 2 (cycle length 4, entry at 2)
  const list = [0, 1, 2, 3, 4, 5];
  const nextNode = [1, 2, 3, 4, 5, 2];

  const steps: GenericVisualizerStep[] = [
    {
      stepNumber: 1,
      title: 'Initialize Slow & Fast at Head',
      explanation: 'Linked list has nodes [0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 2]. Cycle begins at node 2. Both Slow (1 step) and Fast (2 steps) start at node 0.',
      elements: list,
      highlightIndices: [0],
      activePointers: [
        { name: 'Slow', index: 0, color: 'indigo' },
        { name: 'Fast', index: 0, color: 'rose' },
      ],
      metrics: [
        { label: 'Slow Pos', value: 0 },
        { label: 'Fast Pos', value: 0 },
        { label: 'Status', value: 'Head' },
      ],
      statusBadge: { label: 'Initialized', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Step 1: Slow -> 1, Fast -> 2',
      explanation: 'Slow advances 1 hop (node 1). Fast advances 2 hops (node 2). They are at different nodes.',
      elements: list,
      highlightIndices: [1, 2],
      activePointers: [
        { name: 'Slow', index: 1, color: 'indigo' },
        { name: 'Fast', index: 2, color: 'rose' },
      ],
      metrics: [
        { label: 'Slow Pos', value: 1 },
        { label: 'Fast Pos', value: 2 },
      ],
      statusBadge: { label: 'Running', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'Step 2: Slow -> 2, Fast -> 4',
      explanation: 'Slow enters cycle at node 2. Fast advances from 2 -> 3 -> 4.',
      elements: list,
      highlightIndices: [2, 4],
      activePointers: [
        { name: 'Slow', index: 2, color: 'indigo' },
        { name: 'Fast', index: 4, color: 'rose' },
      ],
      metrics: [
        { label: 'Slow Pos', value: 2 },
        { label: 'Fast Pos', value: 4 },
      ],
      statusBadge: { label: 'In Cycle', variant: 'warning' },
    },
    {
      stepNumber: 4,
      title: 'Step 3: Slow -> 3, Fast -> 2 (Cycle Loop)',
      explanation: 'Slow moves to node 3. Fast moves from 4 -> 5 -> 2 (looping back in cycle).',
      elements: list,
      highlightIndices: [3, 2],
      activePointers: [
        { name: 'Fast', index: 2, color: 'rose' },
        { name: 'Slow', index: 3, color: 'indigo' },
      ],
      metrics: [
        { label: 'Slow Pos', value: 3 },
        { label: 'Fast Pos', value: 2 },
      ],
      statusBadge: { label: 'Approaching', variant: 'warning' },
    },
    {
      stepNumber: 5,
      title: 'Step 4: Collision at Node 4!',
      explanation: 'Slow moves to node 4. Fast moves from 2 -> 3 -> 4. Both pointers collide at node 4! Cycle is definitively confirmed.',
      elements: list,
      highlightIndices: [4],
      activePointers: [
        { name: 'Slow & Fast', index: 4, color: 'emerald' },
      ],
      metrics: [
        { label: 'Collision Node', value: 4 },
        { label: 'Cycle Found', value: 'Yes' },
      ],
      statusBadge: { label: 'Collision!', variant: 'success' },
    },
    {
      stepNumber: 6,
      title: 'Phase 2: Reset One Pointer to Head to Find Entrance',
      explanation: 'Reset Pointer 1 to Head (node 0) while keeping Pointer 2 at collision node (4). Move both at 1 step/hop. They will collide at node 2 (the exact cycle entry)!',
      elements: list,
      highlightIndices: [0, 4],
      activePointers: [
        { name: 'P1 (Head)', index: 0, color: 'indigo' },
        { name: 'P2 (Met)', index: 4, color: 'purple' },
      ],
      metrics: [
        { label: 'P1 Pos', value: 0 },
        { label: 'P2 Pos', value: 4 },
      ],
      statusBadge: { label: 'Phase 2 Start', variant: 'info' },
    },
    {
      stepNumber: 7,
      title: 'Cycle Entrance Confirmed at Node 2',
      explanation: 'After 2 steps: P1 (0 -> 1 -> 2) and P2 (4 -> 5 -> 2) meet at node 2! Node 2 is mathematically proven to be the cycle entrance.',
      elements: list,
      highlightIndices: [2],
      activePointers: [
        { name: 'Cycle Start', index: 2, color: 'emerald' },
      ],
      metrics: [
        { label: 'Cycle Entrance', value: 'Node 2' },
        { label: 'Total Space', value: 'O(1)' },
      ],
      statusBadge: { label: 'Entrance Verified', variant: 'success' },
    },
  ];

  return steps;
}

// 6. Stack & Monotonic Stack (Daily Temperatures / Next Greater)
export function generateStackSteps(
  temperatures: number[] = [73, 74, 75, 71, 69, 72, 76, 73]
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const stack: number[] = []; // Store indices
  const result: number[] = new Array(temperatures.length).fill(0);

  steps.push({
    stepNumber: 1,
    title: 'Initialize Empty Monotonic Stack',
    explanation: `Array: [${temperatures.join(', ')}]. We want to find the number of days until a warmer temperature for each day. Initialize an empty stack to track unresolved days.`,
    elements: temperatures,
    highlightIndices: [],
    auxiliaryData: { stack: [], result: [...result] },
    metrics: [
      { label: 'Stack Size', value: 0 },
      { label: 'Unresolved', value: temperatures.length },
    ],
    statusBadge: { label: 'Initialized', variant: 'info' },
  });

  for (let i = 0; i < temperatures.length; i++) {
    const curTemp = temperatures[i];

    while (stack.length > 0 && curTemp > temperatures[stack[stack.length - 1]]) {
      const prevIdx = stack.pop()!;
      const days = i - prevIdx;
      result[prevIdx] = days;

      steps.push({
        stepNumber: steps.length + 1,
        title: `Warmer Day Found! Day ${i} (${curTemp}°) > Day ${prevIdx} (${temperatures[prevIdx]}°)`,
        explanation: `Temperature at Day ${i} (${curTemp}°) is strictly warmer than Day ${prevIdx} (${temperatures[prevIdx]}°). Pop Day ${prevIdx} from stack. Days waited = ${i} - ${prevIdx} = ${days}.`,
        elements: temperatures,
        highlightIndices: [prevIdx, i],
        activePointers: [
          { name: 'Resolved', index: prevIdx, color: 'emerald' },
          { name: 'Warmer', index: i, color: 'rose' },
        ],
        auxiliaryData: { stack: [...stack], result: [...result] },
        metrics: [
          { label: `Result[${prevIdx}]`, value: `${days} days` },
          { label: 'Stack', value: stack.map(idx => `${temperatures[idx]}°`).join(', ') || 'empty' },
        ],
        statusBadge: { label: `Resolved Day ${prevIdx}`, variant: 'success' },
      });
    }

    stack.push(i);
    steps.push({
      stepNumber: steps.length + 1,
      title: `Push Day ${i} (${curTemp}°) to Stack`,
      explanation: `Push index ${i} (temp ${curTemp}°) onto stack to wait for a warmer upcoming day. Stack now holds unresolved indices [${stack.join(', ')}].`,
      elements: temperatures,
      highlightIndices: [i],
      activePointers: [{ name: 'Pushed', index: i, color: 'indigo' }],
      auxiliaryData: { stack: [...stack], result: [...result] },
      metrics: [
        { label: 'Stack Top', value: `${curTemp}°` },
        { label: 'Stack Size', value: stack.length },
      ],
      statusBadge: { label: 'Pushed to Stack', variant: 'info' },
    });
  }

  return steps;
}

// 7. Intervals & Sweep Line (Merge Intervals)
export function generateIntervalsSteps(): GenericVisualizerStep[] {
  const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]];
  const steps: GenericVisualizerStep[] = [
    {
      stepNumber: 1,
      title: 'Sort Intervals by Start Time',
      explanation: 'Input intervals: [[1, 3], [2, 6], [8, 10], [15, 18]]. Intervals are sorted in ascending order of their start values.',
      elements: intervals.map(i => `[${i[0]}, ${i[1]}]`),
      metrics: [
        { label: 'Total Intervals', value: 4 },
        { label: 'Status', value: 'Sorted' },
      ],
      auxiliaryData: { merged: [] },
      statusBadge: { label: 'Sorted', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Initialize with First Interval [1, 3]',
      explanation: 'Add [1, 3] as the initial current active interval. Current merged list: [[1, 3]].',
      elements: intervals.map(i => `[${i[0]}, ${i[1]}]`),
      highlightIndices: [0],
      metrics: [
        { label: 'Active Interval', value: '[1, 3]' },
        { label: 'Merged Count', value: 1 },
      ],
      auxiliaryData: { merged: [[1, 3]] },
      statusBadge: { label: 'Active [1, 3]', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'Overlap Detected! [2, 6] overlaps [1, 3]',
      explanation: 'Inspect [2, 6]. Since start 2 <= active end 3, intervals overlap! Merge by taking max end: max(3, 6) = 6. Active interval becomes [1, 6].',
      elements: intervals.map(i => `[${i[0]}, ${i[1]}]`),
      highlightIndices: [0, 1],
      metrics: [
        { label: 'New Active', value: '[1, 6]' },
        { label: 'Formula', value: '[1, max(3, 6)]' },
      ],
      auxiliaryData: { merged: [[1, 6]] },
      statusBadge: { label: 'Merged -> [1, 6]', variant: 'warning' },
    },
    {
      stepNumber: 4,
      title: 'No Overlap with [8, 10] -> Commit [1, 6]',
      explanation: 'Inspect [8, 10]. Since start 8 > active end 6, there is no overlap. Commit [1, 6] to output and make [8, 10] the new active interval.',
      elements: intervals.map(i => `[${i[0]}, ${i[1]}]`),
      highlightIndices: [2],
      metrics: [
        { label: 'Committed', value: '[1, 6]' },
        { label: 'New Active', value: '[8, 10]' },
      ],
      auxiliaryData: { merged: [[1, 6], [8, 10]] },
      statusBadge: { label: 'New Interval', variant: 'info' },
    },
    {
      stepNumber: 5,
      title: 'No Overlap with [15, 18] -> Final Result',
      explanation: 'Inspect [15, 18]. Start 15 > active end 10. Commit [8, 10] and append [15, 18]. Final merged intervals: [[1, 6], [8, 10], [15, 18]].',
      elements: intervals.map(i => `[${i[0]}, ${i[1]}]`),
      highlightIndices: [3],
      metrics: [
        { label: 'Final Output', value: '[[1, 6], [8, 10], [15, 18]]' },
        { label: 'Reduced From', value: '4 to 3 intervals' },
      ],
      auxiliaryData: { merged: [[1, 6], [8, 10], [15, 18]] },
      statusBadge: { label: 'Complete', variant: 'success' },
    },
  ];

  return steps;
}

// 8. Heap / Top K (Min-Heap of size K)
export function generateHeapSteps(): GenericVisualizerStep[] {
  const stream = [4, 10, 3, 5, 1, 9];
  const k = 3;

  return [
    {
      stepNumber: 1,
      title: 'Initialize Min-Heap of Capacity K = 3',
      explanation: `Goal: Find the 3rd largest element in stream [${stream.join(', ')}] using a Min-Heap of size 3. At all times, the heap root holds the current 3rd largest element.`,
      elements: stream,
      auxiliaryData: { heap: [] },
      metrics: [
        { label: 'K', value: k },
        { label: 'Heap Size', value: 0 },
      ],
      statusBadge: { label: 'Empty Heap', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Fill Heap to Capacity: Add 4, 10, 3',
      explanation: 'Push first 3 elements into heap: [4, 10, 3]. Min-heap orders them: [3, 10, 4]. Root (minimum) is 3.',
      elements: stream,
      highlightIndices: [0, 1, 2],
      auxiliaryData: { heap: [3, 10, 4] },
      metrics: [
        { label: 'Heap Root (Min)', value: 3 },
        { label: 'Heap', value: '[3, 10, 4]' },
      ],
      statusBadge: { label: 'Heap Full', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'Inspect 5: 5 > Root (3) -> Replace Root',
      explanation: 'Next element is 5. Since 5 > root 3, 3 cannot be in the top 3. Pop 3 and insert 5. Heap re-balances to [4, 10, 5]. New root is 4.',
      elements: stream,
      highlightIndices: [3],
      auxiliaryData: { heap: [4, 10, 5] },
      metrics: [
        { label: 'Evicted', value: 3 },
        { label: 'New Root', value: 4 },
        { label: 'Heap', value: '[4, 10, 5]' },
      ],
      statusBadge: { label: 'Root Evicted', variant: 'warning' },
    },
    {
      stepNumber: 4,
      title: 'Inspect 1: 1 < Root (4) -> Ignore',
      explanation: 'Next element is 1. Since 1 < current root 4, 1 is too small to be in the top 3. Discard 1 without modifying heap.',
      elements: stream,
      highlightIndices: [4],
      auxiliaryData: { heap: [4, 10, 5] },
      metrics: [
        { label: 'Ignored', value: 1 },
        { label: 'Root Retained', value: 4 },
      ],
      statusBadge: { label: 'Skipped', variant: 'info' },
    },
    {
      stepNumber: 5,
      title: 'Inspect 9: 9 > Root (4) -> Replace Root & Final Answer',
      explanation: 'Next element is 9. Since 9 > root 4, pop 4 and insert 9. Heap becomes [5, 10, 9]. The 3rd largest element overall is the heap root: 5!',
      elements: stream,
      highlightIndices: [5],
      auxiliaryData: { heap: [5, 10, 9] },
      metrics: [
        { label: 'Top 3 Elements', value: '[5, 9, 10]' },
        { label: '3rd Largest', value: 5 },
      ],
      statusBadge: { label: 'Ans = 5', variant: 'success' },
    },
  ];
}

// 9. Tree DFS (Preorder Traversal & Height)
export function generateTreeDFSSteps(): GenericVisualizerStep[] {
  return [
    {
      stepNumber: 1,
      title: 'Start DFS at Root (Node 1)',
      explanation: 'Binary Tree: Node 1 has children (Left: 2, Right: 3). Node 2 has child (Left: 4). Call stack pushes DFS(1).',
      elements: ['Node 1', 'Node 2', 'Node 3', 'Node 4'],
      highlightIndices: [0],
      metrics: [
        { label: 'Call Stack', value: '[DFS(1)]' },
        { label: 'Current Depth', value: 1 },
      ],
      statusBadge: { label: 'Visiting Root', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Recurse Left: DFS(2)',
      explanation: 'Traverse left child: push DFS(2) to call stack. Current node is 2 at depth 2.',
      elements: ['Node 1', 'Node 2', 'Node 3', 'Node 4'],
      highlightIndices: [1],
      metrics: [
        { label: 'Call Stack', value: '[DFS(1), DFS(2)]' },
        { label: 'Current Depth', value: 2 },
      ],
      statusBadge: { label: 'Diving Left', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'Recurse Left to Leaf: DFS(4)',
      explanation: 'Traverse left child: push DFS(4). Node 4 is a leaf (left=null, right=null). Max depth reached is 3.',
      elements: ['Node 1', 'Node 2', 'Node 3', 'Node 4'],
      highlightIndices: [3],
      metrics: [
        { label: 'Call Stack', value: '[DFS(1), DFS(2), DFS(4)]' },
        { label: 'Max Depth', value: 3 },
      ],
      statusBadge: { label: 'Leaf Reached', variant: 'warning' },
    },
    {
      stepNumber: 4,
      title: 'Backtrack to Node 2 and Return Height',
      explanation: 'DFS(4) returns height 1. Node 2 right child is null. DFS(2) returns 1 + max(1, 0) = 2. Pop from call stack.',
      elements: ['Node 1', 'Node 2', 'Node 3', 'Node 4'],
      highlightIndices: [1],
      metrics: [
        { label: 'Subtree 2 Height', value: 2 },
        { label: 'Call Stack', value: '[DFS(1)]' },
      ],
      statusBadge: { label: 'Backtracking', variant: 'info' },
    },
    {
      stepNumber: 5,
      title: 'Traverse Right Subtree: DFS(3) & Final Depth',
      explanation: 'Recurse to right child Node 3. Node 3 returns height 1. Root combines: 1 + max(left=2, right=1) = 3. Maximum tree depth is 3.',
      elements: ['Node 1', 'Node 2', 'Node 3', 'Node 4'],
      highlightIndices: [0, 2],
      metrics: [
        { label: 'Left Height', value: 2 },
        { label: 'Right Height', value: 1 },
        { label: 'Max Tree Depth', value: 3 },
      ],
      statusBadge: { label: 'Height = 3', variant: 'success' },
    },
  ];
}

// 10. Tree BFS (Level-Order Queue)
export function generateTreeBFSSteps(): GenericVisualizerStep[] {
  return [
    {
      stepNumber: 1,
      title: 'Initialize Queue with Root Node 1 (Level 0)',
      explanation: 'Tree: Root 1, Children (2, 3), Grandchildren of 2 are (4, 5). Enqueue root 1. Queue = [1].',
      elements: ['1', '2', '3', '4', '5'],
      highlightIndices: [0],
      metrics: [
        { label: 'Queue', value: '[1]' },
        { label: 'Current Level', value: 0 },
      ],
      statusBadge: { label: 'Level 0', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Process Level 0: Dequeue 1, Enqueue 2 & 3',
      explanation: 'Level size is 1. Dequeue node 1. Enqueue left child 2 and right child 3. Level 0 result = [1]. Queue = [2, 3].',
      elements: ['1', '2', '3', '4', '5'],
      highlightIndices: [0],
      metrics: [
        { label: 'Processed', value: '[1]' },
        { label: 'Queue', value: '[2, 3]' },
      ],
      statusBadge: { label: 'Level 0 Done', variant: 'success' },
    },
    {
      stepNumber: 3,
      title: 'Process Level 1: Dequeue 2, Enqueue 4 & 5',
      explanation: 'Level size is 2. Dequeue 2. Node 2 has children 4 and 5: enqueue both. Queue = [3, 4, 5].',
      elements: ['1', '2', '3', '4', '5'],
      highlightIndices: [1],
      metrics: [
        { label: 'Dequeued', value: '2' },
        { label: 'Queue', value: '[3, 4, 5]' },
      ],
      statusBadge: { label: 'Level 1 Active', variant: 'info' },
    },
    {
      stepNumber: 4,
      title: 'Process Level 1: Dequeue 3',
      explanation: 'Dequeue 3. Node 3 has no children. Level 1 complete: result = [2, 3]. Queue = [4, 5].',
      elements: ['1', '2', '3', '4', '5'],
      highlightIndices: [2],
      metrics: [
        { label: 'Level 1 Result', value: '[2, 3]' },
        { label: 'Queue', value: '[4, 5]' },
      ],
      statusBadge: { label: 'Level 1 Done', variant: 'success' },
    },
    {
      stepNumber: 5,
      title: 'Process Level 2: Dequeue Leaves 4 & 5',
      explanation: 'Dequeue 4 and 5. Both have no children. Queue is now empty. Final level order traversal: [[1], [2, 3], [4, 5]].',
      elements: ['1', '2', '3', '4', '5'],
      highlightIndices: [3, 4],
      metrics: [
        { label: 'Final Levels', value: '[[1], [2, 3], [4, 5]]' },
        { label: 'Queue', value: '[] (Empty)' },
      ],
      statusBadge: { label: 'Traversal Complete', variant: 'success' },
    },
  ];
}

// 11. Graph Traversal (DFS/BFS Island Flood Fill)
export function generateGraphTraversalSteps(): GenericVisualizerStep[] {
  return [
    {
      stepNumber: 1,
      title: 'Detect Unvisited Land Cell at (0, 0)',
      explanation: 'Scanning 2D grid. Encounter land cell "1" at coordinate (0, 0). Increment island count = 1 and initiate flood fill.',
      elements: ['(0,0): 1', '(0,1): 1', '(1,0): 1', '(1,1): 0'],
      highlightIndices: [0],
      metrics: [
        { label: 'Islands Count', value: 1 },
        { label: 'Start Cell', value: '(0, 0)' },
      ],
      statusBadge: { label: 'New Island', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Flood Fill East: Visit (0, 1)',
      explanation: 'From (0, 0), traverse orthogonal neighbor east to (0, 1). Mark (0, 0) as visited ("0") and enqueue/recurse on (0, 1).',
      elements: ['(0,0): 0', '(0,1): 1', '(1,0): 1', '(1,1): 0'],
      highlightIndices: [1],
      metrics: [
        { label: 'Visited Set', value: '{(0,0), (0,1)}' },
      ],
      statusBadge: { label: 'Flooding East', variant: 'warning' },
    },
    {
      stepNumber: 3,
      title: 'Flood Fill South: Visit (1, 0)',
      explanation: 'Traverse orthogonal neighbor south from (0, 0) to (1, 0). Mark (1, 0) as visited. All connected land cells of this island are now sunken.',
      elements: ['(0,0): 0', '(0,1): 0', '(1,0): 1', '(1,1): 0'],
      highlightIndices: [2],
      metrics: [
        { label: 'Island Cells', value: '3 cells' },
      ],
      statusBadge: { label: 'Flooding South', variant: 'warning' },
    },
    {
      stepNumber: 4,
      title: 'Island Completely Explored',
      explanation: 'No further unvisited orthogonal land neighbors exist. Entire connected component is explored. Total islands discovered: 1.',
      elements: ['(0,0): 0', '(0,1): 0', '(1,0): 0', '(1,1): 0'],
      highlightIndices: [0, 1, 2],
      metrics: [
        { label: 'Total Islands', value: 1 },
        { label: 'Remaining Land', value: '0' },
      ],
      statusBadge: { label: 'Completed', variant: 'success' },
    },
  ];
}

// 12. Topological Sort (Kahn\'s In-Degree Algorithm)
export function generateTopologicalSortSteps(): GenericVisualizerStep[] {
  return [
    {
      stepNumber: 1,
      title: 'Compute In-Degrees for All Courses',
      explanation: 'Dependencies: 1 -> 0 (take 1 before 0), 2 -> 0, 3 -> 1, 3 -> 2. In-degrees: Course 0: 2, Course 1: 1, Course 2: 1, Course 3: 0.',
      elements: ['Course 0: in=2', 'Course 1: in=1', 'Course 2: in=1', 'Course 3: in=0'],
      highlightIndices: [3],
      metrics: [
        { label: 'Course 3 In-Degree', value: 0 },
        { label: 'Prerequisites', value: '4 edges' },
      ],
      statusBadge: { label: 'In-Degrees Computed', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Enqueue Course 3 (In-Degree = 0)',
      explanation: 'Course 3 has no prerequisites. Push to queue. Queue = [3].',
      elements: ['Course 0: in=2', 'Course 1: in=1', 'Course 2: in=1', 'Course 3: in=0'],
      highlightIndices: [3],
      metrics: [
        { label: 'Queue', value: '[Course 3]' },
        { label: 'Order', value: '[]' },
      ],
      statusBadge: { label: 'Queueing Roots', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'Process Course 3: Decrement In-Degrees of 1 and 2',
      explanation: 'Dequeue 3 and add to order. Edges (3 -> 1) and (3 -> 2) resolved: Course 1 in-degree becomes 0; Course 2 in-degree becomes 0. Enqueue both 1 and 2.',
      elements: ['Course 0: in=2', 'Course 1: in=0', 'Course 2: in=0', 'Course 3: done'],
      highlightIndices: [1, 2],
      metrics: [
        { label: 'Order', value: '[3]' },
        { label: 'Queue', value: '[Course 1, Course 2]' },
      ],
      statusBadge: { label: 'Decremented', variant: 'warning' },
    },
    {
      stepNumber: 4,
      title: 'Process Courses 1 and 2: Decrement Course 0',
      explanation: 'Dequeue 1 and 2. Both point to Course 0. Course 0 in-degree decrements 2 -> 1 -> 0! Enqueue Course 0.',
      elements: ['Course 0: in=0', 'Course 1: done', 'Course 2: done', 'Course 3: done'],
      highlightIndices: [0],
      metrics: [
        { label: 'Order', value: '[3, 1, 2]' },
        { label: 'Queue', value: '[Course 0]' },
      ],
      statusBadge: { label: 'Course 0 Unlocked', variant: 'warning' },
    },
    {
      stepNumber: 5,
      title: 'Final Valid Topological Ordering',
      explanation: 'Dequeue Course 0. All 4 courses processed without detecting any cycles. Valid graduation order: [3, 1, 2, 0].',
      elements: ['Course 3', 'Course 1', 'Course 2', 'Course 0'],
      highlightIndices: [0, 1, 2, 3],
      metrics: [
        { label: 'Final Order', value: '[3, 1, 2, 0]' },
        { label: 'Cycle Free', value: 'Yes' },
      ],
      statusBadge: { label: 'Valid DAG Order', variant: 'success' },
    },
  ];
}

// 13. Union Find (Disjoint Set Union & Cycle Detection)
export function generateUnionFindSteps(): GenericVisualizerStep[] {
  return [
    {
      stepNumber: 1,
      title: 'Initialize Disjoint Sets for 4 Nodes',
      explanation: 'Nodes 0, 1, 2, 3. Each node is initially its own parent: parent = [0, 1, 2, 3], rank = [0, 0, 0, 0]. Total components = 4.',
      elements: ['Node 0 (p:0)', 'Node 1 (p:1)', 'Node 2 (p:2)', 'Node 3 (p:3)'],
      metrics: [
        { label: 'Components', value: 4 },
        { label: 'Parents', value: '[0, 1, 2, 3]' },
      ],
      statusBadge: { label: '4 Disjoint Sets', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Union(0, 1): Connect Edge (0, 1)',
      explanation: 'find(0) = 0, find(1) = 1. Different roots: attach root 1 under root 0. parent[1] = 0. Components drop to 3.',
      elements: ['Node 0 (Root)', 'Node 1 (p:0)', 'Node 2 (p:2)', 'Node 3 (p:3)'],
      highlightIndices: [0, 1],
      metrics: [
        { label: 'Components', value: 3 },
        { label: 'parent[1]', value: 0 },
      ],
      statusBadge: { label: 'Union Successful', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'Union(1, 2): Path Compression Connects 2 to 0',
      explanation: 'find(1) compresses to root 0. find(2) = 2. Attach root 2 under root 0. Components drop to 2. Component {0, 1, 2} formed.',
      elements: ['Node 0 (Root)', 'Node 1 (p:0)', 'Node 2 (p:0)', 'Node 3 (p:3)'],
      highlightIndices: [0, 2],
      metrics: [
        { label: 'Components', value: 2 },
        { label: 'Root 0 Size', value: 3 },
      ],
      statusBadge: { label: 'Path Compressed', variant: 'info' },
    },
    {
      stepNumber: 4,
      title: 'Edge (0, 2): Redundant Cycle Detected!',
      explanation: 'Inspect edge (0, 2). find(0) = 0 and find(2) = 0. Roots are identical! Adding edge (0, 2) creates a cycle and is redundant.',
      elements: ['Node 0 (Root)', 'Node 1 (p:0)', 'Node 2 (p:0)', 'Node 3 (p:3)'],
      highlightIndices: [0, 2],
      metrics: [
        { label: 'find(0)', value: 0 },
        { label: 'find(2)', value: 0 },
        { label: 'Cycle Edge', value: '(0, 2)' },
      ],
      statusBadge: { label: 'Redundant Edge!', variant: 'danger' },
    },
  ];
}

// 14. Backtracking (Subsets Generation)
export function generateBacktrackingSteps(): GenericVisualizerStep[] {
  return [
    {
      stepNumber: 1,
      title: 'Initial State: Empty Subset []',
      explanation: 'Input nums = [1, 2]. Start backtracking at index 0 with current subset []. Add [] to result list.',
      elements: ['[]', '[1]', '[1, 2]', '[2]'],
      highlightIndices: [0],
      metrics: [
        { label: 'Current Subset', value: '[]' },
        { label: 'Total Subsets', value: 1 },
      ],
      statusBadge: { label: 'Base Subset []', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Choose 1: Push 1 -> Subset [1]',
      explanation: 'Pick element 1 at index 0. Current subset becomes [1]. Add [1] to results. Recurse to index 1.',
      elements: ['[]', '[1]', '[1, 2]', '[2]'],
      highlightIndices: [1],
      metrics: [
        { label: 'Current Subset', value: '[1]' },
        { label: 'Total Subsets', value: 2 },
      ],
      statusBadge: { label: 'Choice: +1', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'Choose 2: Push 2 -> Subset [1, 2]',
      explanation: 'Pick element 2 at index 1. Current subset becomes [1, 2]. Add [1, 2] to results. End of array reached.',
      elements: ['[]', '[1]', '[1, 2]', '[2]'],
      highlightIndices: [2],
      metrics: [
        { label: 'Current Subset', value: '[1, 2]' },
        { label: 'Total Subsets', value: 3 },
      ],
      statusBadge: { label: 'Choice: +2', variant: 'info' },
    },
    {
      stepNumber: 4,
      title: 'Backtrack: Pop 2 then Pop 1',
      explanation: 'Backtrack: Undo choice 2 -> subset reverts to [1]. Undo choice 1 -> subset reverts to []. State restored to explore branch without 1.',
      elements: ['[]', '[1]', '[1, 2]', '[2]'],
      metrics: [
        { label: 'Restored State', value: '[]' },
        { label: 'Backtracks', value: '2 pops' },
      ],
      statusBadge: { label: 'Undo Backtrack', variant: 'warning' },
    },
    {
      stepNumber: 5,
      title: 'Choose 2 Directly -> Subset [2] & Complete',
      explanation: 'At index 1, pick element 2 without 1. Current subset becomes [2]. All 2^2 = 4 subsets generated: [[], [1], [1, 2], [2]].',
      elements: ['[]', '[1]', '[1, 2]', '[2]'],
      highlightIndices: [3],
      metrics: [
        { label: 'Final Subsets', value: '[[], [1], [1,2], [2]]' },
        { label: 'Total Count', value: 4 },
      ],
      statusBadge: { label: '2^N Subsets Found', variant: 'success' },
    },
  ];
}

// 15. Greedy Algorithms (Jump Game)
export function generateGreedySteps(): GenericVisualizerStep[] {
  const nums = [2, 3, 1, 1, 4];
  return [
    {
      stepNumber: 1,
      title: 'Initialize Jump Game at Index 0',
      explanation: `Array: [${nums.join(', ')}]. Start at index 0. Value is 2: can jump up to 2 steps. Max reachable horizon = index 0 + 2 = 2.`,
      elements: nums,
      highlightIndices: [0],
      activePointers: [{ name: 'Current', index: 0, color: 'indigo' }],
      metrics: [
        { label: 'Max Reachable', value: 'Index 2' },
        { label: 'Target Destination', value: 'Index 4' },
      ],
      statusBadge: { label: 'Reach = 2', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Inspect Index 1 (Val 3): Horizon Expands to Index 4!',
      explanation: 'Advance to index 1. Index 1 <= max reach 2 (reachable). Potential jump is 1 + 3 = 4. Update max reachable = max(2, 4) = 4!',
      elements: nums,
      highlightIndices: [1],
      activePointers: [{ name: 'Current', index: 1, color: 'indigo' }],
      metrics: [
        { label: 'Previous Reach', value: 2 },
        { label: 'New Max Reach', value: 4 },
      ],
      statusBadge: { label: 'Horizon -> 4', variant: 'warning' },
    },
    {
      stepNumber: 3,
      title: 'Destination Reached! Greedy Horizon >= Last Index',
      explanation: 'Since max reachable index 4 >= target index 4, reaching the end of the array is guaranteed! Returns True in O(n) time and O(1) space.',
      elements: nums,
      highlightIndices: [4],
      activePointers: [{ name: 'Target Reached', index: 4, color: 'emerald' }],
      metrics: [
        { label: 'Max Reach', value: 4 },
        { label: 'Last Index', value: 4 },
        { label: 'Result', value: 'True' },
      ],
      statusBadge: { label: 'Destination Reachable', variant: 'success' },
    },
  ];
}

// 16. Dynamic Programming (Coin Change)
export function generateDPSteps(): GenericVisualizerStep[] {
  const coins = [1, 2, 5];
  const amount = 7;
  return [
    {
      stepNumber: 1,
      title: 'Initialize DP Array for Amount 7',
      explanation: 'Coins: [1, 2, 5], Target Amount: 7. Create DP array of size 8 initialized to Infinity, with base case dp[0] = 0 (0 coins to make $0).',
      elements: ['0', '∞', '∞', '∞', '∞', '∞', '∞', '∞'],
      highlightIndices: [0],
      metrics: [
        { label: 'dp[0]', value: 0 },
        { label: 'Target', value: 7 },
      ],
      statusBadge: { label: 'Base Case Set', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'Fill Subproblems 1 to 4',
      explanation: 'For amount 1: 1 coin (1). For amount 2: 1 coin (2). For amount 3: 2 coins (2+1). For amount 4: 2 coins (2+2).',
      elements: ['0', '1', '1', '2', '2', '∞', '∞', '∞'],
      highlightIndices: [1, 2, 3, 4],
      metrics: [
        { label: 'dp[1..4]', value: '[1, 1, 2, 2]' },
      ],
      statusBadge: { label: 'Solving Subproblems', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'Amount 5: Coin 5 Solves in 1 Step',
      explanation: 'For amount 5: dp[5] = min(dp[5-1]+1, dp[5-2]+1, dp[5-5]+1) = dp[0] + 1 = 1 coin (coin 5).',
      elements: ['0', '1', '1', '2', '2', '1', '∞', '∞'],
      highlightIndices: [5],
      metrics: [
        { label: 'dp[5]', value: 1 },
      ],
      statusBadge: { label: 'dp[5] = 1', variant: 'warning' },
    },
    {
      stepNumber: 4,
      title: 'Amount 7: Optimal Combination = 5 + 2 (2 Coins)',
      explanation: 'For amount 7: test coin 1 (dp[6]+1 = 3), test coin 2 (dp[5]+1 = 2), test coin 5 (dp[2]+1 = 2). Minimum is 2 coins! Result = 2.',
      elements: ['0', '1', '1', '2', '2', '1', '2', '2'],
      highlightIndices: [7],
      metrics: [
        { label: 'dp[7]', value: 2 },
        { label: 'Optimal Coins', value: '5 + 2' },
      ],
      statusBadge: { label: 'Min Coins = 2', variant: 'success' },
    },
  ];
}

// 17. Bit Manipulation (Single Number via XOR)
export function generateBitManipulationSteps(): GenericVisualizerStep[] {
  const nums = [4, 1, 2, 1, 2];
  return [
    {
      stepNumber: 1,
      title: 'Initialize Accumulator: acc = 0',
      explanation: `Array: [${nums.join(', ')}]. Every number appears twice except one unique number. Exploit XOR involution: x ^ x = 0 and x ^ 0 = x.`,
      elements: nums,
      metrics: [
        { label: 'Accumulator', value: '0 (0b0000)' },
        { label: 'Rule', value: 'A ^ A = 0' },
      ],
      statusBadge: { label: 'acc = 0', variant: 'info' },
    },
    {
      stepNumber: 2,
      title: 'XOR with 4: 0 ^ 4 = 4',
      explanation: 'Binary: 0000 ^ 0100 = 0100 (4). Accumulator is now 4.',
      elements: nums,
      highlightIndices: [0],
      activePointers: [{ name: 'XOR 4', index: 0, color: 'indigo' }],
      metrics: [
        { label: 'acc', value: '4 (0b0100)' },
      ],
      statusBadge: { label: 'acc = 4', variant: 'info' },
    },
    {
      stepNumber: 3,
      title: 'XOR with 1 then 2: acc = 4 ^ 1 ^ 2 = 7',
      explanation: 'Binary: 0100 ^ 0001 = 0101 (5). Then 0101 ^ 0010 = 0111 (7).',
      elements: nums,
      highlightIndices: [1, 2],
      metrics: [
        { label: 'acc', value: '7 (0b0111)' },
      ],
      statusBadge: { label: 'acc = 7', variant: 'warning' },
    },
    {
      stepNumber: 4,
      title: 'XOR with 1: Cancels out First 1!',
      explanation: 'Binary: 0111 ^ 0001 = 0110 (6). The duplicate 1 cancels itself out from the bit stream!',
      elements: nums,
      highlightIndices: [3],
      metrics: [
        { label: 'acc', value: '6 (0b0110)' },
        { label: 'Cancelled', value: 'Number 1' },
      ],
      statusBadge: { label: '1 Cancelled', variant: 'warning' },
    },
    {
      stepNumber: 5,
      title: 'XOR with 2: Cancels out First 2 -> Unique 4 Remains!',
      explanation: 'Binary: 0110 ^ 0010 = 0100 (4). Number 2 cancels out. Only the single non-duplicate number 4 remains in O(N) time and O(1) space!',
      elements: nums,
      highlightIndices: [4],
      metrics: [
        { label: 'Final Result', value: '4' },
        { label: 'Space', value: 'O(1)' },
      ],
      statusBadge: { label: 'Unique Number: 4', variant: 'success' },
    },
  ];
}
