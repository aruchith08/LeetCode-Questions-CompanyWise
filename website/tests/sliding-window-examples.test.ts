import { describe, it, expect } from 'vitest';
import {
  findMaxAverageBrute,
  findMaxAverageSliding,
  lengthOfLongestSubstring,
  minSubArrayLen,
} from '../src/utils/slidingWindowCodeExamples';
import { generateSlidingWindowSteps } from '../src/utils/slidingWindowVisualizerEngine';

describe('Sliding Window Algorithm Implementations', () => {
  describe('LeetCode 643 - Maximum Average Subarray I', () => {
    it('matches brute force and sliding window on standard array', () => {
      const nums = [1, 12, -5, -6, 50, 3];
      const k = 4;
      const brute = findMaxAverageBrute(nums, k);
      const sliding = findMaxAverageSliding(nums, k);
      expect(brute).toBeCloseTo(12.75);
      expect(sliding).toBeCloseTo(12.75);
    });

    it('correctly handles all negative numbers', () => {
      const nums = [-5, -1, -8, -12, -2];
      const k = 2;
      const brute = findMaxAverageBrute(nums, k);
      const sliding = findMaxAverageSliding(nums, k);
      expect(brute).toBeCloseTo(-3);
      expect(sliding).toBeCloseTo(-3);
    });

    it('handles window size k = 1', () => {
      const nums = [5, -2, 10, 4];
      expect(findMaxAverageSliding(nums, 1)).toBe(10);
    });

    it('handles window size k = array length', () => {
      const nums = [1, 2, 3, 4];
      expect(findMaxAverageSliding(nums, 4)).toBe(2.5);
    });

    it('handles invalid inputs gracefully (k <= 0, k > length, empty array)', () => {
      expect(findMaxAverageSliding([], 4)).toBe(0);
      expect(findMaxAverageSliding([1, 2], 3)).toBe(0);
      expect(findMaxAverageSliding([1, 2], 0)).toBe(0);
      expect(findMaxAverageSliding([1, 2], -1)).toBe(0);
    });
  });

  describe('LeetCode 3 - Longest Substring Without Repeating Characters', () => {
    it('handles standard cases', () => {
      expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
      expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
      expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
    });

    it('handles empty and single character strings', () => {
      expect(lengthOfLongestSubstring('')).toBe(0);
      expect(lengthOfLongestSubstring('a')).toBe(1);
    });

    it('handles all unique characters', () => {
      expect(lengthOfLongestSubstring('abcdef')).toBe(6);
    });
  });

  describe('LeetCode 209 - Minimum Size Subarray Sum (Variable Window with Non-negative values)', () => {
    it('finds minimum subarray length with target', () => {
      expect(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])).toBe(2); // [4, 3]
      expect(minSubArrayLen(4, [1, 4, 4])).toBe(1); // [4]
    });

    it('returns 0 when no valid subarray meets target', () => {
      expect(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1])).toBe(0);
    });

    it('handles single element meeting target', () => {
      expect(minSubArrayLen(5, [5])).toBe(1);
    });
  });

  describe('generateSlidingWindowSteps Visualizer Engine', () => {
    it('generates dynamic steps correctly without leaking future best values', () => {
      const nums = [1, 12, -5, -6, 50, 3];
      const k = 4;
      const steps = generateSlidingWindowSteps(nums, k);

      expect(steps).toHaveLength(3); // 6 - 4 + 1 = 3 windows

      // Step 0: [1, 12, -5, -6], sum = 2, avg = 0.5, best = 0.5
      expect(steps[0].windowElements).toEqual([1, 12, -5, -6]);
      expect(steps[0].currentSum).toBe(2);
      expect(steps[0].currentAverage).toBe(0.5);
      expect(steps[0].bestAverageSoFar).toBe(0.5);

      // Step 1: [12, -5, -6, 50], sum = 51, avg = 12.75, best = 12.75
      expect(steps[1].windowElements).toEqual([12, -5, -6, 50]);
      expect(steps[1].currentSum).toBe(51);
      expect(steps[1].currentAverage).toBe(12.75);
      expect(steps[1].bestAverageSoFar).toBe(12.75);

      // Step 2: [-5, -6, 50, 3], sum = 42, avg = 10.5, best stays 12.75
      expect(steps[2].windowElements).toEqual([-5, -6, 50, 3]);
      expect(steps[2].currentSum).toBe(42);
      expect(steps[2].currentAverage).toBe(10.5);
      expect(steps[2].bestAverageSoFar).toBe(12.75);
    });

    it('handles empty or invalid window sizes', () => {
      expect(generateSlidingWindowSteps([], 4)).toEqual([]);
      expect(generateSlidingWindowSteps([1, 2], 3)).toEqual([]);
      expect(generateSlidingWindowSteps([1, 2], 0)).toEqual([]);
    });
  });
});
