import type { GenericVisualizerStep } from '../types/patterns';

// 1. Hashing & Frequency Counting (Two Sum)
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
    auxiliaryData: { left, right, sum: nums[left] + nums[right], target, action: 'Evaluate Sum' },
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
        auxiliaryData: { left, right, sum, target, action: 'Match Found!' },
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
        auxiliaryData: { left, right, sum: nums[left] + nums[right], target, action: `Advance Left -> idx ${left}` },
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
        explanation: `Sum ${nums[left]} + ${nums[prevR]} = ${sum} is too large. Decrement Right from ${prevR} to ${right} to decrease sum.`,
        elements: nums,
        highlightIndices: [left, right],
        activePointers: [
          { name: 'L', index: left, color: 'indigo' },
          { name: 'R', index: right, color: 'rose' },
        ],
        auxiliaryData: { left, right, sum: nums[left] + nums[right], target, action: `Decrement Right -> idx ${right}` },
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
    auxiliaryData: { prefix: [...prefix] },
    metrics: [
      { label: 'Base P[0]', value: 0 },
      { label: 'Prefix Length', value: 1 },
      { label: 'Target Range', value: `[${query[0]}..${query[1]}]` },
    ],
    statusBadge: { label: 'P[0] = 0', variant: 'info' },
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
  const queryIndices: number[] = [];
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
    auxiliaryData: { left, right, searchRange: `[${left} .. ${right}]`, target },
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
        auxiliaryData: { left, mid, right, foundIndex: mid, target },
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
          { name: 'Mid', index: mid, color: 'amber' },
          { name: 'R', index: right, color: 'rose' },
        ],
        auxiliaryData: { left: mid + 1, right, eliminated: `[${left}..${mid}]` },
        metrics: [
          { label: 'Mid Val', value: midVal },
          { label: 'Target', value: target },
          { label: 'New Left', value: mid + 1 },
        ],
        statusBadge: { label: 'Advance Left ->', variant: 'warning' },
      });
      left = mid + 1;
    } else {
      steps.push({
        stepNumber: steps.length + 1,
        title: `nums[${mid}] (${midVal}) > Target (${target}) -> Discard Right Half`,
        explanation: `Midpoint ${mid} has value ${midVal} which is greater than ${target}. Discard all elements from index ${mid} to ${right}. Set Right = ${mid - 1}.`,
        elements: nums,
        highlightIndices: [mid],
        activePointers: [
          { name: 'L', index: left, color: 'indigo' },
          { name: 'Mid', index: mid, color: 'amber' },
          { name: 'R', index: right, color: 'rose' },
        ],
        auxiliaryData: { left, right: mid - 1, eliminated: `[${mid}..${right}]` },
        metrics: [
          { label: 'Mid Val', value: midVal },
          { label: 'Target', value: target },
          { label: 'New Right', value: mid - 1 },
        ],
        statusBadge: { label: '<- Advance Right', variant: 'warning' },
      });
      right = mid - 1;
    }
  }

  return steps;
}

// 5. Fast & Slow Pointers (Floyd's Cycle Detection & Cycle Entrance)
export function generateFastSlowSteps(
  list: number[] = [0, 1, 2, 3, 4, 5],
  cycleEntry: number = 2
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const n = list.length;
  // Node transition function simulating cycle:
  // 0 -> 1 -> ... -> (n - 1) -> cycleEntry -> ...
  const next = (curr: number): number => {
    if (curr === n - 1) return cycleEntry;
    return curr + 1;
  };

  let slow = 0;
  let fast = 0;

  steps.push({
    stepNumber: 1,
    title: 'Phase 1: Initialize Slow and Fast Pointers at Head',
    explanation: `Linked List: [${list.join(' -> ')} -> loop to Node ${cycleEntry}]. Initialize Slow and Fast pointers at Head (Node 0). Slow advances 1 hop, Fast advances 2 hops per iteration.`,
    elements: list.map(val => `Node ${val}`),
    highlightIndices: [0],
    activePointers: [
      { name: 'Slow', index: 0, color: 'indigo' },
      { name: 'Fast', index: 0, color: 'rose' },
    ],
    auxiliaryData: { slowNode: 0, fastNode: 0, phase: 'Phase 1: Cycle Detection' },
    metrics: [
      { label: 'Slow Pos', value: 0 },
      { label: 'Fast Pos', value: 0 },
      { label: 'Status', value: 'Head' },
    ],
    statusBadge: { label: 'Initialized', variant: 'info' },
  });

  // Phase 1: Detect Cycle
  let stepCount = 0;
  const maxIterations = 20;
  let collisionNode = -1;

  while (stepCount < maxIterations) {
    stepCount++;
    slow = next(slow);
    fast = next(next(fast));

    if (slow === fast) {
      collisionNode = slow;
      steps.push({
        stepNumber: steps.length + 1,
        title: `Collision Detected at Node ${slow}!`,
        explanation: `Slow and Fast pointers collided at Node ${slow}! Because Fast travels at 2x speed and overlapped Slow, a directed cycle is mathematically proven.`,
        elements: list.map(val => `Node ${val}`),
        highlightIndices: [slow],
        activePointers: [
          { name: 'Slow', index: slow, color: 'emerald' },
          { name: 'Fast', index: slow, color: 'emerald' },
        ],
        auxiliaryData: { slowNode: slow, fastNode: fast, collisionNode: slow, cycleDetected: true },
        metrics: [
          { label: 'Collision Node', value: slow },
          { label: 'Cycle Found', value: 'Yes' },
        ],
        statusBadge: { label: 'Collision!', variant: 'success' },
      });
      break;
    } else {
      steps.push({
        stepNumber: steps.length + 1,
        title: `Iteration ${stepCount}: Slow -> Node ${slow}, Fast -> Node ${fast}`,
        explanation: `Slow advances 1 hop to Node ${slow}. Fast advances 2 hops to Node ${fast}.`,
        elements: list.map(val => `Node ${val}`),
        highlightIndices: [slow, fast],
        activePointers: [
          { name: 'Slow', index: slow, color: 'indigo' },
          { name: 'Fast', index: fast, color: 'rose' },
        ],
        auxiliaryData: { slowNode: slow, fastNode: fast, phase: 'Phase 1: Traversing' },
        metrics: [
          { label: 'Slow Pos', value: slow },
          { label: 'Fast Pos', value: fast },
        ],
        statusBadge: { label: 'Traversing', variant: 'info' },
      });
    }
  }

  // Phase 2: Find Cycle Entrance
  if (collisionNode !== -1) {
    let p1 = 0;
    let p2 = collisionNode;

    steps.push({
      stepNumber: steps.length + 1,
      title: 'Phase 2: Reset Pointer 1 to Head to Locate Cycle Entrance',
      explanation: `Reset Pointer 1 to Head (Node 0) while keeping Pointer 2 at collision Node ${collisionNode}. Advance both pointers at the same 1 hop/step pace. By Floyd's cycle theorem, they will meet at the cycle entrance!`,
      elements: list.map(val => `Node ${val}`),
      highlightIndices: [0, collisionNode],
      activePointers: [
        { name: 'P1 (Head)', index: 0, color: 'indigo' },
        { name: 'P2 (Met)', index: collisionNode, color: 'purple' },
      ],
      auxiliaryData: { p1Head: 0, p2Collision: collisionNode, phase: 'Phase 2: Find Entrance' },
      metrics: [
        { label: 'P1 Pos', value: 0 },
        { label: 'P2 Pos', value: collisionNode },
      ],
      statusBadge: { label: 'Phase 2 Start', variant: 'info' },
    });

    while (p1 !== p2) {
      p1 = next(p1);
      p2 = next(p2);
      if (p1 === p2) break;

      steps.push({
        stepNumber: steps.length + 1,
        title: `Advance Both 1 Step: P1 -> Node ${p1}, P2 -> Node ${p2}`,
        explanation: `P1 advances to Node ${p1}. P2 advances to Node ${p2}. Moving toward intersection.`,
        elements: list.map(val => `Node ${val}`),
        highlightIndices: [p1, p2],
        activePointers: [
          { name: 'P1', index: p1, color: 'indigo' },
          { name: 'P2', index: p2, color: 'purple' },
        ],
        auxiliaryData: { p1, p2, phase: 'Approaching Entrance' },
        metrics: [
          { label: 'P1 Pos', value: p1 },
          { label: 'P2 Pos', value: p2 },
        ],
        statusBadge: { label: 'Advancing', variant: 'info' },
      });
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: `Cycle Entrance Confirmed at Node ${p1}!`,
      explanation: `P1 and P2 collided at Node ${p1}! Node ${p1} is mathematically proven to be the cycle entrance (matching expected entrance ${cycleEntry}).`,
      elements: list.map(val => `Node ${val}`),
      highlightIndices: [p1],
      activePointers: [
        { name: 'P1', index: p1, color: 'emerald' },
        { name: 'P2', index: p1, color: 'emerald' },
      ],
      auxiliaryData: { p1, p2, cycleEntrance: p1, entranceProven: true },
      metrics: [
        { label: 'Cycle Entrance', value: `Node ${p1}` },
        { label: 'Total Space', value: 'O(1)' },
      ],
      statusBadge: { label: 'Entrance Verified', variant: 'success' },
    });
  }

  return steps;
}

// 6. Stack & Monotonic Stack (Daily Temperatures)
export function generateStackSteps(
  temperatures: number[] = [73, 74, 75, 71, 69, 72, 76, 73]
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const stack: number[] = [];
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

// 7. Intervals & Sweep Line (Merge Overlapping Intervals - Algorithm Driven)
export function generateIntervalsSteps(
  intervals: [number, number][] = [
    [1, 3],
    [2, 6],
    [8, 10],
    [15, 18],
  ]
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  // Sort intervals by start time
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const elements = sorted.map(int => `[${int[0]}, ${int[1]}]`);

  steps.push({
    stepNumber: 1,
    title: 'Sort Intervals by Start Time',
    explanation: `Sorted intervals: [${elements.join(', ')}]. Sorting by start coordinate enables a single linear sweep to detect all overlaps.`,
    elements,
    highlightIndices: [0],
    metrics: [
      { label: 'Total Intervals', value: sorted.length },
      { label: 'First Interval', value: elements[0] },
    ],
    auxiliaryData: { merged: [sorted[0]] },
    statusBadge: { label: 'Sorted', variant: 'info' },
  });

  const merged: [number, number][] = [[sorted[0][0], sorted[0][1]]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    if (current[0] <= lastMerged[1]) {
      // Overlap detected!
      const oldEnd = lastMerged[1];
      lastMerged[1] = Math.max(lastMerged[1], current[1]);

      steps.push({
        stepNumber: steps.length + 1,
        title: `Overlap Detected: ${elements[i]} with [${lastMerged[0]}, ${oldEnd}]`,
        explanation: `Start ${current[0]} <= previous end ${oldEnd}. Intervals overlap! Merge by extending end to max(${oldEnd}, ${current[1]}) = ${lastMerged[1]}.`,
        elements,
        highlightIndices: [i - 1, i],
        activePointers: [
          { name: 'Active', index: i - 1, color: 'indigo' },
          { name: 'Merging', index: i, color: 'rose' },
        ],
        metrics: [
          { label: 'Merged Interval', value: `[${lastMerged[0]}, ${lastMerged[1]}]` },
          { label: 'Max End', value: `max(${oldEnd}, ${current[1]})` },
        ],
        auxiliaryData: { merged: merged.map(m => [...m]) },
        statusBadge: { label: 'Merged', variant: 'warning' },
      });
    } else {
      // No overlap: commit current as new active interval
      merged.push([current[0], current[1]]);

      steps.push({
        stepNumber: steps.length + 1,
        title: `No Overlap: Disjoint Interval ${elements[i]}`,
        explanation: `Start ${current[0]} > previous end ${lastMerged[1]}. No overlap. Commit previous interval and add ${elements[i]} as new active interval.`,
        elements,
        highlightIndices: [i],
        activePointers: [{ name: 'New Interval', index: i, color: 'emerald' }],
        metrics: [
          { label: 'Committed Count', value: merged.length },
          { label: 'New Interval', value: elements[i] },
        ],
        auxiliaryData: { merged: merged.map(m => [...m]) },
        statusBadge: { label: 'Committed', variant: 'info' },
      });
    }
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: 'Sweep Complete: Final Merged Output',
    explanation: `Linear sweep completed. Final disjoint non-overlapping intervals: [${merged.map(m => `[${m[0]}, ${m[1]}]`).join(', ')}].`,
    elements,
    highlightIndices: Array.from({ length: sorted.length }, (_, i) => i),
    metrics: [
      { label: 'Input Count', value: sorted.length },
      { label: 'Output Count', value: merged.length },
    ],
    auxiliaryData: { merged: merged.map(m => [...m]) },
    statusBadge: { label: 'Complete', variant: 'success' },
  });

  return steps;
}

// 8. Heap / Top K (Min-Heap Size K - Algorithm Driven)
export function generateHeapSteps(
  stream: number[] = [4, 10, 3, 5, 1, 9],
  k: number = 3
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const heap: number[] = [];

  const siftUp = (idx: number) => {
    while (idx > 0) {
      const pIdx = Math.floor((idx - 1) / 2);
      if (heap[idx] < heap[pIdx]) {
        const tmp = heap[idx];
        heap[idx] = heap[pIdx];
        heap[pIdx] = tmp;
        idx = pIdx;
      } else {
        break;
      }
    }
  };

  const siftDown = (idx: number) => {
    while (true) {
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      let smallest = idx;
      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
      if (smallest !== idx) {
        const tmp = heap[idx];
        heap[idx] = heap[smallest];
        heap[smallest] = tmp;
        idx = smallest;
      } else {
        break;
      }
    }
  };

  steps.push({
    stepNumber: 1,
    title: `Initialize Min-Heap of Capacity K = ${k}`,
    explanation: `Stream: [${stream.join(', ')}]. Goal: Track the ${k}-th largest element. A Min-Heap of size ${k} stores the top ${k} largest seen so far, with the minimum among them (the ${k}-th largest) at the root!`,
    elements: stream,
    highlightIndices: [],
    metrics: [
      { label: 'Capacity K', value: k },
      { label: 'Heap Size', value: 0 },
    ],
    auxiliaryData: { heap: [] },
    statusBadge: { label: 'Initialized', variant: 'info' },
  });

  for (let i = 0; i < stream.length; i++) {
    const val = stream[i];

    if (heap.length < k) {
      heap.push(val);
      siftUp(heap.length - 1);

      steps.push({
        stepNumber: steps.length + 1,
        title: `Add ${val} to Heap (Size ${heap.length}/${k})`,
        explanation: `Heap has room. Insert ${val} and rebalance. Current Min-Heap root (minimum of top ${heap.length}) is ${heap[0]}.`,
        elements: stream,
        highlightIndices: [i],
        activePointers: [{ name: `+${val}`, index: i, color: 'indigo' }],
        metrics: [
          { label: 'Inserted', value: val },
          { label: 'Heap Root (Min)', value: heap[0] },
        ],
        auxiliaryData: { heap: [...heap] },
        statusBadge: { label: 'Heap Filling', variant: 'info' },
      });
    } else {
      const root = heap[0];
      if (val > root) {
        heap[0] = val;
        siftDown(0);

        steps.push({
          stepNumber: steps.length + 1,
          title: `Stream ${val} > Root ${root} -> Replace Root`,
          explanation: `New element ${val} is larger than the current ${k}-th largest (${root}). Evict ${root}, insert ${val}, and sift down. New root is ${heap[0]}.`,
          elements: stream,
          highlightIndices: [i],
          activePointers: [{ name: `Replaced ${root}`, index: i, color: 'rose' }],
          metrics: [
            { label: 'Evicted', value: root },
            { label: 'New Root', value: heap[0] },
          ],
          auxiliaryData: { heap: [...heap], evicted: root },
          statusBadge: { label: 'Root Replaced', variant: 'warning' },
        });
      } else {
        steps.push({
          stepNumber: steps.length + 1,
          title: `Stream ${val} <= Root ${root} -> Ignore`,
          explanation: `New element ${val} is <= current ${k}-th largest (${root}). It cannot belong to the top ${k}. Discard without modifying heap.`,
          elements: stream,
          highlightIndices: [i],
          activePointers: [{ name: 'Ignored', index: i, color: 'amber' }],
          metrics: [
            { label: 'Ignored', value: val },
            { label: 'Retained Root', value: root },
          ],
          auxiliaryData: { heap: [...heap] },
          statusBadge: { label: 'Ignored', variant: 'info' },
        });
      }
    }
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: `Final ${k}-th Largest Element is ${heap[0]}`,
    explanation: `All stream items processed. Top ${k} elements are [${heap.join(', ')}]. The ${k}-th largest element overall is heap root ${heap[0]}!`,
    elements: stream,
    highlightIndices: [stream.indexOf(heap[0]) >= 0 ? stream.indexOf(heap[0]) : 0],
    metrics: [
      { label: `${k}-th Largest`, value: heap[0] },
      { label: 'Top K Set', value: `[${heap.join(', ')}]` },
    ],
    auxiliaryData: { heap: [...heap], kthLargest: heap[0] },
    statusBadge: { label: `Ans: ${heap[0]}`, variant: 'success' },
  });

  return steps;
}

// 9. Tree DFS (Preorder/Postorder Max Depth - Algorithm Driven)
export function generateTreeDFSSteps(
  tree: Record<number, { val: number; left: number | null; right: number | null }> = {
    1: { val: 1, left: 2, right: 3 },
    2: { val: 2, left: 4, right: null },
    3: { val: 3, left: null, right: null },
    4: { val: 4, left: null, right: null },
  },
  root: number = 1
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const nodes = Object.keys(tree).map(Number);
  const elements = nodes.map(id => `Node ${tree[id].val}`);
  const callStack: string[] = [];
  let maxDepth = 0;

  steps.push({
    stepNumber: 1,
    title: `Start DFS Traversal at Root (Node ${root})`,
    explanation: `Binary tree with nodes [${nodes.join(', ')}]. Computing maximum tree depth recursively. Starting at root Node ${root}.`,
    elements,
    highlightIndices: [nodes.indexOf(root)],
    activePointers: [{ name: 'Root', index: nodes.indexOf(root), color: 'indigo' }],
    auxiliaryData: { callStack: [`DFS(${root})`], currentDepth: 1 },
    metrics: [
      { label: 'Current Node', value: root },
      { label: 'Depth', value: 1 },
    ],
    statusBadge: { label: 'Visiting Root', variant: 'info' },
  });

  function dfs(nodeId: number, depth: number): number {
    callStack.push(`DFS(${nodeId})`);
    maxDepth = Math.max(maxDepth, depth);
    const nodeIdx = nodes.indexOf(nodeId);

    steps.push({
      stepNumber: steps.length + 1,
      title: `Visit Node ${nodeId} at Depth ${depth}`,
      explanation: `Exploring Node ${nodeId}. Left child: ${tree[nodeId].left ?? 'null'}, Right child: ${tree[nodeId].right ?? 'null'}.`,
      elements,
      highlightIndices: [nodeIdx],
      activePointers: [{ name: `DFS(${nodeId})`, index: nodeIdx, color: 'indigo' }],
      auxiliaryData: { callStack: [...callStack], currentDepth: depth, maxDepth },
      metrics: [
        { label: 'Node', value: nodeId },
        { label: 'Depth', value: depth },
        { label: 'Max Depth', value: maxDepth },
      ],
      statusBadge: { label: `Depth ${depth}`, variant: 'info' },
    });

    let leftH = 0;
    if (tree[nodeId].left !== null) {
      leftH = dfs(tree[nodeId].left, depth + 1);
    }

    let rightH = 0;
    if (tree[nodeId].right !== null) {
      rightH = dfs(tree[nodeId].right, depth + 1);
    }

    const h = 1 + Math.max(leftH, rightH);
    callStack.pop();

    steps.push({
      stepNumber: steps.length + 1,
      title: `Backtrack from Node ${nodeId}: Height = ${h}`,
      explanation: `Node ${nodeId} subtree height is 1 + max(L:${leftH}, R:${rightH}) = ${h}. Returning to caller.`,
      elements,
      highlightIndices: [nodeIdx],
      activePointers: [{ name: `Height: ${h}`, index: nodeIdx, color: 'emerald' }],
      auxiliaryData: { callStack: [...callStack], returnedHeight: h, maxDepth },
      metrics: [
        { label: 'Subtree Height', value: h },
        { label: 'Call Stack Size', value: callStack.length },
      ],
      statusBadge: { label: `Height ${h}`, variant: 'warning' },
    });

    return h;
  }

  const finalHeight = dfs(root, 1);

  steps.push({
    stepNumber: steps.length + 1,
    title: `DFS Complete: Maximum Depth is ${finalHeight}`,
    explanation: `Full binary tree traversed. Maximum tree depth from root is ${finalHeight}.`,
    elements,
    highlightIndices: [nodes.indexOf(root)],
    activePointers: [{ name: `Max Depth: ${finalHeight}`, index: nodes.indexOf(root), color: 'emerald' }],
    auxiliaryData: { callStack: [], maxDepth: finalHeight, finalHeight },
    metrics: [
      { label: 'Max Depth', value: finalHeight },
      { label: 'Time Complexity', value: 'O(N)' },
    ],
    statusBadge: { label: `Max Depth = ${finalHeight}`, variant: 'success' },
  });

  return steps;
}

// 10. Tree BFS (Level-Order Queue - Algorithm Driven)
export function generateTreeBFSSteps(
  tree: Record<number, number[]> = {
    1: [2, 3],
    2: [4, 5],
    3: [],
    4: [],
    5: [],
  },
  root: number = 1
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const nodes = Object.keys(tree).map(Number);
  const elements = nodes.map(n => `Node ${n}`);
  const queue: number[] = [root];
  const levels: number[][] = [];

  steps.push({
    stepNumber: 1,
    title: `Initialize BFS Queue with Root (Node ${root})`,
    explanation: `Binary tree nodes: [${nodes.join(', ')}]. Initialize FIFO queue with root Node ${root}. Queue = [Node ${root}].`,
    elements,
    highlightIndices: [nodes.indexOf(root)],
    activePointers: [{ name: 'Root', index: nodes.indexOf(root), color: 'indigo' }],
    auxiliaryData: { queue: [`Node ${root}`], levels: [] },
    metrics: [
      { label: 'Queue Size', value: 1 },
      { label: 'Current Level', value: 0 },
    ],
    statusBadge: { label: 'Level 0', variant: 'info' },
  });

  let levelIdx = 0;
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevelVals: number[] = [];

    steps.push({
      stepNumber: steps.length + 1,
      title: `Start Level ${levelIdx} (Size ${levelSize})`,
      explanation: `Level ${levelIdx} has ${levelSize} node(s) in queue: [${queue.map(id => `Node ${id}`).join(', ')}].`,
      elements,
      highlightIndices: queue.map(id => nodes.indexOf(id)),
      activePointers: queue.map(id => ({ name: `L${levelIdx}`, index: nodes.indexOf(id), color: 'indigo' })),
      auxiliaryData: { queue: queue.map(id => `Node ${id}`), currentLevel: levelIdx },
      metrics: [
        { label: 'Level', value: levelIdx },
        { label: 'Nodes in Level', value: levelSize },
      ],
      statusBadge: { label: `Level ${levelIdx} Start`, variant: 'info' },
    });

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevelVals.push(node);
      const children = tree[node] || [];
      for (const child of children) {
        queue.push(child);
      }

      steps.push({
        stepNumber: steps.length + 1,
        title: `Dequeue Node ${node} -> Enqueue Children [${children.join(', ') || 'none'}]`,
        explanation: `Processed Node ${node}. Children [${children.join(', ') || 'none'}] pushed to back of queue.`,
        elements,
        highlightIndices: [nodes.indexOf(node)],
        activePointers: [{ name: 'Dequeued', index: nodes.indexOf(node), color: 'emerald' }],
        auxiliaryData: { queue: queue.map(id => `Node ${id}`), processed: currentLevelVals },
        metrics: [
          { label: 'Dequeued', value: `Node ${node}` },
          { label: 'New Queue Size', value: queue.length },
        ],
        statusBadge: { label: `Processed ${node}`, variant: 'info' },
      });
    }

    levels.push(currentLevelVals);
    levelIdx++;
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: 'BFS Traversal Complete',
    explanation: `All levels visited. Level-order output: [${levels.map(l => `[${l.join(', ')}]`).join(', ')}].`,
    elements,
    highlightIndices: Array.from({ length: nodes.length }, (_, i) => i),
    metrics: [
      { label: 'Total Levels', value: levels.length },
      { label: 'Total Nodes', value: nodes.length },
    ],
    auxiliaryData: { queue: [], levelOrder: JSON.stringify(levels) },
    statusBadge: { label: 'BFS Complete', variant: 'success' },
  });

  return steps;
}

// 11. Graph Traversal (DFS/BFS Island Flood Fill - Algorithm Driven)
export function generateGraphTraversalSteps(
  grid: number[][] = [
    [1, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ]
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();
  const flatCells: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      flatCells.push(`(${r},${c}): ${grid[r][c]}`);
    }
  }

  steps.push({
    stepNumber: 1,
    title: `Initialize 2D Grid (${rows}x${cols}) Island Count`,
    explanation: `Grid: ${rows} rows x ${cols} cols. Scanning cells to count connected land components (1s) using 4-directional flood fill.`,
    elements: flatCells,
    highlightIndices: [],
    metrics: [
      { label: 'Grid Size', value: `${rows}x${cols}` },
      { label: 'Islands Found', value: 0 },
    ],
    auxiliaryData: { visited: [], islandsCount: 0 },
    statusBadge: { label: 'Scanning Grid', variant: 'info' },
  });

  let islands = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      const cellIdx = r * cols + c;

      if (grid[r][c] === 1 && !visited.has(key)) {
        islands++;
        const islandCells: string[] = [];
        const queue: [number, number][] = [[r, c]];
        visited.add(key);
        islandCells.push(`(${r},${c})`);

        steps.push({
          stepNumber: steps.length + 1,
          title: `New Island #${islands} Discovered at (${r}, ${c})`,
          explanation: `Encountered unvisited land cell '1' at coordinate (${r}, ${c}). Increment island count to ${islands} and initiate flood fill.`,
          elements: flatCells,
          highlightIndices: [cellIdx],
          activePointers: [{ name: `Island ${islands}`, index: cellIdx, color: 'indigo' }],
          metrics: [
            { label: 'Islands Count', value: islands },
            { label: 'Start Cell', value: `(${r}, ${c})` },
          ],
          auxiliaryData: { visited: Array.from(visited), islandsCount: islands },
          statusBadge: { label: `Island #${islands}`, variant: 'info' },
        });

        // BFS Flood fill
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        while (queue.length > 0) {
          const [cr, cc] = queue.shift()!;
          for (const [dr, dc] of dirs) {
            const nr = cr + dr;
            const nc = cc + dc;
            const nKey = `${nr},${nc}`;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1 && !visited.has(nKey)) {
              visited.add(nKey);
              islandCells.push(`(${nr},${nc})`);
              queue.push([nr, nc]);

              const nIdx = nr * cols + nc;
              steps.push({
                stepNumber: steps.length + 1,
                title: `Flood Fill: Traversed to Neighbor (${nr}, ${nc})`,
                explanation: `Connected orthogonal land neighbor found at (${nr}, ${nc}). Mark visited and continue flood fill.`,
                elements: flatCells,
                highlightIndices: [nIdx],
                activePointers: [{ name: 'Flooded', index: nIdx, color: 'rose' }],
                metrics: [
                  { label: 'Current Island', value: islands },
                  { label: 'Island Cells', value: islandCells.length },
                ],
                auxiliaryData: { visited: Array.from(visited), islandsCount: islands },
                statusBadge: { label: 'Flooding', variant: 'warning' },
              });
            }
          }
        }
      }
    }
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: `Grid Exploration Complete: ${islands} Island(s) Found`,
    explanation: `Full 2D grid scanned. All land cells partitioned into connected components. Total islands: ${islands}.`,
    elements: flatCells,
    highlightIndices: Array.from({ length: flatCells.length }, (_, i) => i),
    metrics: [
      { label: 'Total Islands', value: islands },
      { label: 'Visited Land', value: visited.size },
    ],
    auxiliaryData: { visited: Array.from(visited), islandsCount: islands, totalIslands: islands },
    statusBadge: { label: `Total: ${islands}`, variant: 'success' },
  });

  return steps;
}

// 12. Topological Sort (Kahn's In-Degree Algorithm - Algorithm Driven)
export function generateTopologicalSortSteps(
  numCourses: number = 4,
  prereqs: [number, number][] = [
    [1, 3],
    [2, 3],
    [0, 1],
    [0, 2],
  ]
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const inDegree = new Array(numCourses).fill(0);
  const adj: Record<number, number[]> = {};

  for (let i = 0; i < numCourses; i++) adj[i] = [];
  // Prereq [a, b] means b is prerequisite for a (edge: b -> a)
  for (const [a, b] of prereqs) {
    inDegree[a]++;
    adj[b].push(a);
  }

  const elements = Array.from({ length: numCourses }, (_, i) => `Course ${i} (in=${inDegree[i]})`);

  steps.push({
    stepNumber: 1,
    title: 'Compute In-Degrees for All Courses',
    explanation: `Graph with ${numCourses} courses and ${prereqs.length} prerequisite edges. Initial in-degrees: ${elements.join(', ')}.`,
    elements,
    highlightIndices: inDegree.map((d, i) => (d === 0 ? i : -1)).filter(i => i >= 0),
    metrics: [
      { label: 'Total Courses', value: numCourses },
      { label: 'Prerequisites', value: prereqs.length },
    ],
    auxiliaryData: { inDegrees: { ...inDegree }, queue: [], order: [] },
    statusBadge: { label: 'In-Degrees Computed', variant: 'info' },
  });

  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: `Enqueue Independent Courses (In-Degree = 0): [${queue.map(c => `Course ${c}`).join(', ')}]`,
    explanation: `Courses with in-degree 0 have no outstanding prerequisites and can be taken immediately. Push to processing queue: [${queue.map(c => `Course ${c}`).join(', ')}].`,
    elements,
    highlightIndices: queue,
    activePointers: queue.map(c => ({ name: 'Ready', index: c, color: 'indigo' })),
    metrics: [
      { label: 'Queue Size', value: queue.length },
      { label: 'Ready Courses', value: queue.join(', ') },
    ],
    auxiliaryData: { inDegrees: { ...inDegree }, queue: queue.map(c => `Course ${c}`), order: [] },
    statusBadge: { label: 'Queued', variant: 'info' },
  });

  const order: number[] = [];

  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);

    steps.push({
      stepNumber: steps.length + 1,
      title: `Take Course ${u} -> Decrement Dependent Prerequisites`,
      explanation: `Completed Course ${u}. Decrement in-degrees of dependent courses: [${adj[u].map(v => `Course ${v}`).join(', ') || 'none'}].`,
      elements: Array.from({ length: numCourses }, (_, i) => `Course ${i} (in=${inDegree[i]})`),
      highlightIndices: [u],
      activePointers: [{ name: 'Completed', index: u, color: 'emerald' }],
      metrics: [
        { label: 'Current Course', value: u },
        { label: 'Completed Order', value: order.join(' -> ') },
      ],
      auxiliaryData: { inDegrees: { ...inDegree }, queue: queue.map(c => `Course ${c}`), order: order.map(c => `Course ${c}`) },
      statusBadge: { label: `Course ${u} Taken`, variant: 'info' },
    });

    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
        steps.push({
          stepNumber: steps.length + 1,
          title: `Course ${v} In-Degree Reached 0 -> Enqueue!`,
          explanation: `All prerequisites for Course ${v} are now satisfied (in-degree = 0). Enqueue Course ${v}!`,
          elements: Array.from({ length: numCourses }, (_, i) => `Course ${i} (in=${inDegree[i]})`),
          highlightIndices: [v],
          activePointers: [{ name: 'Unlocked', index: v, color: 'emerald' }],
          metrics: [
            { label: 'Unlocked', value: `Course ${v}` },
            { label: 'Queue Size', value: queue.length },
          ],
          auxiliaryData: { inDegrees: { ...inDegree }, queue: queue.map(c => `Course ${c}`), order: order.map(c => `Course ${c}`) },
          statusBadge: { label: `Unlocked ${v}`, variant: 'warning' },
        });
      }
    }
  }

  const isDAG = order.length === numCourses;

  steps.push({
    stepNumber: steps.length + 1,
    title: isDAG ? 'Valid Topological Sort Completed!' : 'Cycle Detected! No Valid Order',
    explanation: isDAG
      ? `All ${numCourses} courses resolved without cyclic dependencies. Valid schedule: [${order.map(c => `Course ${c}`).join(' -> ')}].`
      : 'Cycle detected in prerequisite graph. Graph is not a DAG.',
    elements: order.map(c => `Course ${c}`),
    highlightIndices: Array.from({ length: order.length }, (_, i) => i),
    metrics: [
      { label: 'Schedule Order', value: order.join(' -> ') },
      { label: 'Cycle Free', value: isDAG ? 'Yes' : 'No' },
    ],
    auxiliaryData: { order: order.map(c => `Course ${c}`), isDAG },
    statusBadge: { label: isDAG ? 'Valid DAG' : 'Cycle!', variant: isDAG ? 'success' : 'danger' },
  });

  return steps;
}

// 13. Union Find (Disjoint Set Union - Algorithm Driven)
export function generateUnionFindSteps(
  numNodes: number = 4,
  edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 2],
    [2, 3],
  ]
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const parent = Array.from({ length: numNodes }, (_, i) => i);
  const rank = new Array(numNodes).fill(0);
  let components = numNodes;

  const elements = Array.from({ length: numNodes }, (_, i) => `Node ${i} (p:${parent[i]})`);

  steps.push({
    stepNumber: 1,
    title: `Initialize Disjoint Sets for ${numNodes} Nodes`,
    explanation: `Nodes: [0..${numNodes - 1}]. Initially each node is its own parent. Components = ${numNodes}.`,
    elements,
    highlightIndices: [],
    metrics: [
      { label: 'Components', value: components },
      { label: 'Parents', value: `[${parent.join(', ')}]` },
    ],
    auxiliaryData: { parents: [...parent], components },
    statusBadge: { label: `${numNodes} Disjoint Sets`, variant: 'info' },
  });

  const find = (x: number): number => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  };

  for (const [u, v] of edges) {
    const rootU = find(u);
    const rootV = find(v);

    if (rootU === rootV) {
      // Cycle detected!
      steps.push({
        stepNumber: steps.length + 1,
        title: `Edge (${u}, ${v}): Redundant Cycle Detected!`,
        explanation: `find(${u}) = ${rootU} and find(${v}) = ${rootV}. Both nodes already share root ${rootU}. Adding edge (${u}, ${v}) creates a cycle and is redundant!`,
        elements: Array.from({ length: numNodes }, (_, i) => `Node ${i} (p:${parent[i]})`),
        highlightIndices: [u, v],
        activePointers: [
          { name: `Root ${rootU}`, index: u, color: 'rose' },
          { name: `Root ${rootV}`, index: v, color: 'rose' },
        ],
        metrics: [
          { label: 'Edge', value: `(${u}, ${v})` },
          { label: 'Shared Root', value: rootU },
          { label: 'Cycle Status', value: 'Redundant' },
        ],
        auxiliaryData: { parents: [...parent], components, redundantEdge: `(${u}, ${v})` },
        statusBadge: { label: 'Cycle Detected', variant: 'danger' },
      });
    } else {
      // Union by rank
      if (rank[rootU] < rank[rootV]) {
        parent[rootU] = rootV;
      } else if (rank[rootU] > rank[rootV]) {
        parent[rootV] = rootU;
      } else {
        parent[rootV] = rootU;
        rank[rootU]++;
      }
      components--;

      steps.push({
        stepNumber: steps.length + 1,
        title: `Union(${u}, ${v}): Connected Disjoint Sets`,
        explanation: `find(${u}) = ${rootU}, find(${v}) = ${rootV}. Joined roots. Remaining components: ${components}.`,
        elements: Array.from({ length: numNodes }, (_, i) => `Node ${i} (p:${parent[i]})`),
        highlightIndices: [u, v],
        activePointers: [
          { name: 'Root', index: parent[u], color: 'indigo' },
          { name: 'Joined', index: v, color: 'indigo' },
        ],
        metrics: [
          { label: 'Edge Added', value: `(${u}, ${v})` },
          { label: 'Components', value: components },
        ],
        auxiliaryData: { parents: [...parent], components },
        statusBadge: { label: 'Union Done', variant: 'info' },
      });
    }
  }

  return steps;
}

// 14. Backtracking (Subsets Generation - Algorithm Driven)
export function generateBacktrackingSteps(nums: number[] = [1, 2]): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const currentSubset: number[] = [];
  const allSubsets: string[] = [];

  steps.push({
    stepNumber: 1,
    title: 'Initialize Backtracking for Subsets',
    explanation: `Generate all 2^N subsets of [${nums.join(', ')}]. Start with empty subset [].`,
    elements: nums,
    highlightIndices: [],
    metrics: [
      { label: 'Input Length', value: nums.length },
      { label: 'Total Expected', value: Math.pow(2, nums.length) },
    ],
    auxiliaryData: { currentSubset: '[]', allSubsets: [] },
    statusBadge: { label: 'Start Backtracking', variant: 'info' },
  });

  function backtrack(startIdx: number) {
    allSubsets.push(`[${currentSubset.join(', ')}]`);

    steps.push({
      stepNumber: steps.length + 1,
      title: `Record Subset: [${currentSubset.join(', ')}]`,
      explanation: `Add current subset state [${currentSubset.join(', ')}] to answer list. Total subsets collected: ${allSubsets.length}.`,
      elements: nums,
      highlightIndices: currentSubset.map(val => nums.indexOf(val)),
      metrics: [
        { label: 'Current Subset', value: `[${currentSubset.join(', ')}]` },
        { label: 'Subsets Found', value: allSubsets.length },
      ],
      auxiliaryData: { currentSubset: `[${currentSubset.join(', ')}]`, allSubsets: [...allSubsets] },
      statusBadge: { label: 'Recorded', variant: 'info' },
    });

    for (let i = startIdx; i < nums.length; i++) {
      // Choose
      currentSubset.push(nums[i]);
      steps.push({
        stepNumber: steps.length + 1,
        title: `Choose: Push ${nums[i]} -> Subset [${currentSubset.join(', ')}]`,
        explanation: `Make decision: include element ${nums[i]}. Recurse deeper down decision branch.`,
        elements: nums,
        highlightIndices: [i],
        activePointers: [{ name: `+${nums[i]}`, index: i, color: 'indigo' }],
        metrics: [
          { label: 'Choice', value: nums[i] },
          { label: 'State', value: `[${currentSubset.join(', ')}]` },
        ],
        auxiliaryData: { currentSubset: `[${currentSubset.join(', ')}]`, allSubsets: [...allSubsets] },
        statusBadge: { label: `Choose +${nums[i]}`, variant: 'info' },
      });

      // Explore
      backtrack(i + 1);

      // Un-choose (Backtrack)
      const popped = currentSubset.pop();
      steps.push({
        stepNumber: steps.length + 1,
        title: `Backtrack: Pop ${popped} -> Restore State`,
        explanation: `Undo decision: pop element ${popped}. Revert subset to [${currentSubset.join(', ')}] to explore alternative branches.`,
        elements: nums,
        highlightIndices: [i],
        activePointers: [{ name: 'Undo', index: i, color: 'amber' }],
        metrics: [
          { label: 'Undone', value: popped ?? 'none' },
          { label: 'Reverted State', value: `[${currentSubset.join(', ')}]` },
        ],
        auxiliaryData: { currentSubset: `[${currentSubset.join(', ')}]`, allSubsets: [...allSubsets] },
        statusBadge: { label: 'Backtracked', variant: 'warning' },
      });
    }
  }

  backtrack(0);

  steps.push({
    stepNumber: steps.length + 1,
    title: `Backtracking Complete: All ${allSubsets.length} Subsets Found`,
    explanation: `Full decision tree explored. All 2^${nums.length} = ${allSubsets.length} subsets generated: [${allSubsets.join(', ')}].`,
    elements: nums,
    highlightIndices: Array.from({ length: nums.length }, (_, i) => i),
    metrics: [
      { label: 'Total Subsets', value: allSubsets.length },
      { label: 'Complexity', value: 'O(2^N)' },
    ],
    auxiliaryData: { currentSubset: '[]', allSubsets: [...allSubsets] },
    statusBadge: { label: 'Complete', variant: 'success' },
  });

  return steps;
}

// 15. Greedy Algorithms (Jump Game - Algorithm Driven)
export function generateGreedySteps(nums: number[] = [2, 3, 1, 1, 4]): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  let maxReach = 0;

  steps.push({
    stepNumber: 1,
    title: 'Initialize Greedy Jump Game',
    explanation: `Array: [${nums.join(', ')}]. Goal: Determine if last index (${nums.length - 1}) is reachable. Greedily maintain maximum reachable horizon from each visited position.`,
    elements: nums,
    highlightIndices: [0],
    activePointers: [{ name: 'Start', index: 0, color: 'indigo' }],
    metrics: [
      { label: 'Target Index', value: nums.length - 1 },
      { label: 'Max Reach', value: 0 },
    ],
    auxiliaryData: { maxReach: 0, targetIndex: nums.length - 1 },
    statusBadge: { label: 'Initialized', variant: 'info' },
  });

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) {
      steps.push({
        stepNumber: steps.length + 1,
        title: `Stuck at Index ${i} > Max Reach ${maxReach}`,
        explanation: `Current index ${i} exceeds maximum reachable horizon ${maxReach}. Cannot move forward! Target is unreachable.`,
        elements: nums,
        highlightIndices: [i],
        activePointers: [{ name: 'Stuck', index: i, color: 'rose' }],
        metrics: [
          { label: 'Current Index', value: i },
          { label: 'Max Reach', value: maxReach },
        ],
        auxiliaryData: { maxReach, reachable: false },
        statusBadge: { label: 'Unreachable', variant: 'danger' },
      });
      return steps;
    }

    const reachFromHere = i + nums[i];
    const prevReach = maxReach;
    maxReach = Math.max(maxReach, reachFromHere);

    steps.push({
      stepNumber: steps.length + 1,
      title: `Inspect Index ${i} (Jump = ${nums[i]}) -> Reach = max(${prevReach}, ${reachFromHere}) = ${maxReach}`,
      explanation: `At index ${i}, jump capacity is ${nums[i]}. Can reach up to index ${reachFromHere}. Updated greedy horizon: max(${prevReach}, ${reachFromHere}) = ${maxReach}.`,
      elements: nums,
      highlightIndices: [i],
      activePointers: [{ name: 'Current', index: i, color: 'indigo' }],
      metrics: [
        { label: 'Jump', value: nums[i] },
        { label: 'Reach from here', value: reachFromHere },
        { label: 'Max Reach', value: maxReach },
      ],
      auxiliaryData: { maxReach, currentIndex: i },
      statusBadge: { label: `Reach ${maxReach}`, variant: 'info' },
    });

    if (maxReach >= nums.length - 1) {
      steps.push({
        stepNumber: steps.length + 1,
        title: `Goal Reached! Max Reach (${maxReach}) >= Last Index (${nums.length - 1})`,
        explanation: `Maximum reach ${maxReach} covers the destination index ${nums.length - 1}. Last position is guaranteed reachable in O(N) time and O(1) space!`,
        elements: nums,
        highlightIndices: [nums.length - 1],
        activePointers: [{ name: 'Goal', index: nums.length - 1, color: 'emerald' }],
        metrics: [
          { label: 'Destination', value: nums.length - 1 },
          { label: 'Max Reach', value: maxReach },
          { label: 'Result', value: 'Reachable' },
        ],
        auxiliaryData: { maxReach, reachable: true },
        statusBadge: { label: 'Goal Reachable', variant: 'success' },
      });
      break;
    }
  }

  return steps;
}

// 16. Dynamic Programming (Coin Change - Algorithm Driven)
export function generateDPSteps(
  coins: number[] = [1, 2, 5],
  amount: number = 7
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  const displayDP = () => dp.map(val => (val === Infinity ? '∞' : val));

  steps.push({
    stepNumber: 1,
    title: `Initialize DP Array for Amount ${amount}`,
    explanation: `Coins: [${coins.join(', ')}]. Allocate DP array of size ${amount + 1} initialized to ∞. Base case: dp[0] = 0 (0 coins required for amount $0).`,
    elements: displayDP(),
    highlightIndices: [0],
    activePointers: [{ name: 'Base', index: 0, color: 'indigo' }],
    metrics: [
      { label: 'dp[0]', value: 0 },
      { label: 'Target Amount', value: amount },
    ],
    auxiliaryData: { dpTable: displayDP() },
    statusBadge: { label: 'Base Case Set', variant: 'info' },
  });

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a >= c && dp[a - c] !== Infinity) {
        dp[a] = Math.min(dp[a], dp[a - c] + 1);
      }
    }

    steps.push({
      stepNumber: steps.length + 1,
      title: `Compute dp[${a}] = ${dp[a] === Infinity ? '∞' : dp[a]}`,
      explanation: `For amount ${a}, test coins: dp[${a}] = min(${coins.filter(c => a >= c).map(c => `dp[${a - c}]+1`).join(', ')}) = ${dp[a] === Infinity ? '∞' : dp[a]}.`,
      elements: displayDP(),
      highlightIndices: [a],
      activePointers: [{ name: `dp[${a}]`, index: a, color: 'indigo' }],
      metrics: [
        { label: `dp[${a}]`, value: dp[a] === Infinity ? '∞' : dp[a] },
        { label: 'Subproblem Amount', value: a },
      ],
      auxiliaryData: { dpTable: displayDP(), currentAmount: a },
      statusBadge: { label: `dp[${a}] = ${dp[a]}`, variant: 'info' },
    });
  }

  const ans = dp[amount] === Infinity ? -1 : dp[amount];

  steps.push({
    stepNumber: steps.length + 1,
    title: `Optimal Solution: Minimum Coins for ${amount} is ${ans}`,
    explanation: `Dynamic programming completed. Minimum number of coins to make amount ${amount} is dp[${amount}] = ${ans}.`,
    elements: displayDP(),
    highlightIndices: [amount],
    activePointers: [{ name: 'Optimal', index: amount, color: 'emerald' }],
    metrics: [
      { label: 'Final Answer', value: ans },
      { label: 'Space', value: `O(${amount})` },
    ],
    auxiliaryData: { dpTable: displayDP(), optimalCoins: ans },
    statusBadge: { label: `Answer = ${ans}`, variant: 'success' },
  });

  return steps;
}

// 17. Bit Manipulation (Single Number XOR - Algorithm Driven)
export function generateBitManipulationSteps(
  nums: number[] = [4, 1, 2, 1, 2]
): GenericVisualizerStep[] {
  const steps: GenericVisualizerStep[] = [];
  let acc = 0;

  const toBinary = (val: number) => `0b${(val >>> 0).toString(2).padStart(4, '0')}`;

  steps.push({
    stepNumber: 1,
    title: 'Initialize Bitwise Accumulator (acc = 0)',
    explanation: `Array: [${nums.join(', ')}]. Every element appears twice except for one unique element. Using XOR property: X ^ X = 0 and X ^ 0 = X.`,
    elements: nums,
    highlightIndices: [],
    metrics: [
      { label: 'Accumulator', value: `0 (${toBinary(0)})` },
      { label: 'Identity Rule', value: 'A ^ A = 0' },
    ],
    auxiliaryData: { accumulator: 0, binary: toBinary(0) },
    statusBadge: { label: 'acc = 0', variant: 'info' },
  });

  const seen = new Set<number>();

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    const prev = acc;
    acc ^= val;
    const isDuplicate = seen.has(val);
    seen.add(val);

    steps.push({
      stepNumber: steps.length + 1,
      title: isDuplicate
        ? `XOR with ${val}: Cancels out earlier ${val}!`
        : `XOR with ${val}: Accumulator becomes ${acc}`,
      explanation: isDuplicate
        ? `Element ${val} was seen earlier. Bitwise ${toBinary(prev)} ^ ${toBinary(val)} = ${toBinary(acc)}. The pair cancels out!`
        : `Bitwise ${toBinary(prev)} ^ ${toBinary(val)} = ${toBinary(acc)}. Element ${val} incorporated into bit stream.`,
      elements: nums,
      highlightIndices: [i],
      activePointers: [{ name: `XOR ${val}`, index: i, color: isDuplicate ? 'rose' : 'indigo' }],
      metrics: [
        { label: 'XOR Operand', value: `${val} (${toBinary(val)})` },
        { label: 'Accumulator', value: `${acc} (${toBinary(acc)})` },
      ],
      auxiliaryData: { accumulator: acc, binary: toBinary(acc), cancelled: isDuplicate ? val : undefined },
      statusBadge: { label: isDuplicate ? `Cancelled ${val}` : `acc = ${acc}`, variant: isDuplicate ? 'warning' : 'info' },
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    title: `Final Result: Unique Number is ${acc}`,
    explanation: `All duplicate pairs have cancelled to 0. The single unique number is ${acc}. Time: O(N), Space: O(1).`,
    elements: nums,
    highlightIndices: [nums.indexOf(acc)],
    activePointers: [{ name: 'Answer', index: nums.indexOf(acc), color: 'emerald' }],
    metrics: [
      { label: 'Single Number', value: acc },
      { label: 'Aux Space', value: 'O(1)' },
    ],
    auxiliaryData: { accumulator: acc, binary: toBinary(acc), singleNumber: acc },
    statusBadge: { label: `Unique: ${acc}`, variant: 'success' },
  });

  return steps;
}
