import type { VisualizerStep } from '../types/patterns';

export interface SlidingWindowCalculationOptions {
  numbers: number[];
  windowSize: number;
}

/**
 * Pure algorithm engine for generating sliding window step-by-step states.
 * Dynamically computes window ranges, rolling sum, rolling average, and best-so-far
 * without pre-calculated or hardcoded step outputs.
 */
export function generateSlidingWindowSteps(
  numbers: number[],
  windowSize: number
): VisualizerStep[] {
  if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
    return [];
  }
  const k = Math.floor(windowSize);
  if (k <= 0 || k > numbers.length) {
    return [];
  }

  const steps: VisualizerStep[] = [];
  let currentSum = 0;

  // Step 1: Initial window [0 .. k-1]
  const initialIndices: number[] = [];
  const initialElements: number[] = [];
  for (let i = 0; i < k; i++) {
    initialIndices.push(i);
    initialElements.push(numbers[i]);
    currentSum += numbers[i];
  }

  const initialAverage = currentSum / k;
  let bestAverageSoFar = initialAverage;

  const initialFormulaTerms = initialElements
    .map(v => (v < 0 ? `(${v})` : `${v}`))
    .join(' + ');

  steps.push({
    stepNumber: 1,
    title: `Initialize Window (indices 0 to ${k - 1})`,
    windowIndices: initialIndices,
    windowElements: initialElements,
    currentSum,
    currentAverage: initialAverage,
    bestAverageSoFar: initialAverage,
    addedElement: null,
    removedElement: null,
    explanation: `Take the first ${k} elements: ${initialElements.join(', ')}. Calculate initial sum = ${initialFormulaTerms} = ${currentSum}. Current average = ${currentSum} / ${k} = ${initialAverage.toFixed(2)}. This is our initial best average.`,
    formula: `Sum = ${initialFormulaTerms} = ${currentSum}  |  Avg = ${currentSum} / ${k} = ${initialAverage.toFixed(2)}`,
  });

  // Steps 2 .. N - k + 1: Slide right by 1 position each time
  for (let right = k; right < numbers.length; right++) {
    const left = right - k + 1;
    const removedIndex = left - 1;
    const removedVal = numbers[removedIndex];
    const addedIndex = right;
    const addedVal = numbers[addedIndex];

    const prevSum = currentSum;
    const prevBestAverage = bestAverageSoFar;
    currentSum = currentSum - removedVal + addedVal;
    const currentAverage = currentSum / k;
    const isNewBest = currentAverage > bestAverageSoFar;
    if (isNewBest) {
      bestAverageSoFar = currentAverage;
    }

    const windowIndices: number[] = [];
    const windowElements: number[] = [];
    for (let i = left; i <= right; i++) {
      windowIndices.push(i);
      windowElements.push(numbers[i]);
    }

    const removedStr = removedVal < 0 ? `(${removedVal})` : `${removedVal}`;
    const addedStr = addedVal < 0 ? `(${addedVal})` : `${addedVal}`;
    const bestIndicator = isNewBest
      ? '  (New Best!)'
      : `  (Best remains ${bestAverageSoFar.toFixed(2)})`;

    steps.push({
      stepNumber: steps.length + 1,
      title: `Slide Window Right (indices ${left} to ${right})`,
      windowIndices,
      windowElements,
      currentSum,
      currentAverage,
      bestAverageSoFar,
      addedElement: { index: addedIndex, value: addedVal },
      removedElement: { index: removedIndex, value: removedVal },
      explanation: `Slide window right by 1 position. Subtract departing element nums[${removedIndex}] = ${removedVal}, and add incoming element nums[${addedIndex}] = ${addedVal}. New sum = ${prevSum} - ${removedStr} + ${addedStr} = ${currentSum}. New average = ${currentSum} / ${k} = ${currentAverage.toFixed(2)}. ${
        isNewBest
          ? `Since ${currentAverage.toFixed(2)} > ${prevBestAverage.toFixed(2)}, update best average to ${bestAverageSoFar.toFixed(2)}.`
          : `Since ${currentAverage.toFixed(2)} < ${bestAverageSoFar.toFixed(2)}, the best average remains ${bestAverageSoFar.toFixed(2)}.`
      }`,
      formula: `Sum = ${prevSum} - ${removedStr} + ${addedStr} = ${currentSum}  |  Avg = ${currentSum} / ${k} = ${currentAverage.toFixed(2)}${bestIndicator}`,
    });
  }

  return steps;
}
