/**
 * Verified reference implementations for Sliding Window algorithms.
 * Used for both educational displays and regression testing.
 */

/**
 * Brute force solution for LeetCode 643 (Maximum Average Subarray I)
 * Time: O(N * K), Space: O(1)
 */
export function findMaxAverageBrute(nums: number[], k: number): number {
  if (!nums || !Array.isArray(nums) || nums.length === 0 || k <= 0 || k > nums.length) {
    return 0;
  }
  let maxSum = -Infinity;
  const n = nums.length;

  for (let i = 0; i <= n - k; i++) {
    let windowSum = 0;
    for (let j = i; j < i + k; j++) {
      windowSum += nums[j];
    }
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum / k;
}

/**
 * Optimized Fixed-Size Sliding Window for LeetCode 643
 * Time: O(N), Space: O(1)
 */
export function findMaxAverageSliding(nums: number[], k: number): number {
  if (!nums || !Array.isArray(nums) || nums.length === 0 || k <= 0 || k > nums.length) {
    return 0;
  }
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;

  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum / k;
}

/**
 * Variable-size Sliding Window for LeetCode 3 (Longest Substring Without Repeating Characters)
 * Time: O(N), Space: O(min(N, Sigma))
 */
export function lengthOfLongestSubstring(s: string): number {
  if (!s || s.length === 0) return 0;
  const lastSeen = new Map<string, number>();
  let maxLen = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (lastSeen.has(char) && (lastSeen.get(char)! >= left)) {
      left = lastSeen.get(char)! + 1;
    }
    lastSeen.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

/**
 * Variable-size Sliding Window for LeetCode 209 (Minimum Size Subarray Sum)
 * Assumes non-negative numbers for monotonic sum behavior.
 * Time: O(N), Space: O(1)
 */
export function minSubArrayLen(target: number, nums: number[]): number {
  if (!nums || !Array.isArray(nums) || nums.length === 0 || target <= 0) return 0;
  let minLen = Infinity;
  let left = 0;
  let currentSum = 0;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    while (currentSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      currentSum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}
