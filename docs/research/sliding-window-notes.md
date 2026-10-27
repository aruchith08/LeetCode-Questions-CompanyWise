# Sliding Window Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents the formal algorithmic principles, complexity proofs, validity conditions, and edge cases for the Sliding Window pattern implemented in CompanyWise.

### Verified Academic & Reference Sources
1. **MIT OpenCourseWare (6.006 Introduction to Algorithms)**
   - *Topic:* Two-pointer techniques, sequence analysis, contiguous subarrays.
   - *Reference:* [MIT 6.006 Lecture Notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)
2. **CP-Algorithms (e-maxx algorithms)**
   - *Topic:* Sliding Window Minimum / Maximum using Monotonic Deque, Subsegment sum optimization.
   - *Reference:* [CP-Algorithms: Minimum stack / Minimum queue](https://cp-algorithms.com/data_structures/stack_queue_modification.html)
3. **CLRS (Introduction to Algorithms, Cormen et al.)**
   - *Topic:* Chapter on amortized analysis, two pointers, rolling hashing (Rabin-Karp connection to sliding window).
4. **LeetCode Official Curated Problems**
   - Problem 643: Maximum Average Subarray I (Fixed-size baseline)
   - Problem 3: Longest Substring Without Repeating Characters (Variable-size hashmap)
   - Problem 209: Minimum Size Subarray Sum (Monotonic positive sum)
   - Problem 239: Sliding Window Maximum (Monotonic deque for window extrema)
   - Problem 76: Minimum Window Substring (Two-pointer frequency-counting)

---

## 2. Core Algorithmic Concepts & Principles

### A. Fixed-Size Sliding Window
* **Invariant:** The window always spans indices $[i - k + 1, i]$ of length exactly $k$.
* **State Transition:** 
  $$\text{window\_sum}_{i} = \text{window\_sum}_{i-1} - \text{nums}[i - k] + \text{nums}[i]$$
* **Complexity:**
  - Time: Initial window computation takes $O(k)$. Sliding across the remaining $n - k$ elements takes $O(n - k)$ steps of $O(1)$ each. Total time: $\mathcal{O}(n)$.
  - Space: $\mathcal{O}(1)$ auxiliary memory (only requires running scalar accumulator).
* **Negative Numbers:** Fully supported! Because addition and subtraction are group operations over integers, negative values do not violate fixed-window rolling updates.

### B. Variable-Size Sliding Window & Monotonicity Condition
* **Invariant:** The window spans $[L, R]$. The right boundary expands monotonically ($R = 0 \to n-1$). The left boundary contracts ($L \to R$) whenever an invariant condition is violated (e.g. invalid character frequency or current sum $\ge$ target).
* **Crucial Monotonicity Requirement:**
  - For problems looking for minimum-size subarray with $\sum \ge S$:
    Expanding $R$ must monotonically increase or maintain the sum ($\text{nums}[i] \ge 0$).
    Shrinking $L$ must monotonically decrease the sum ($\text{nums}[i] \ge 0$).
  - **Failure Case with Negative Numbers:** If an array contains negative numbers (e.g. $[2, -1, 2]$ with target 3), shrinking from the left can *increase* the sum, meaning two pointers cannot guarantee finding the optimal boundary without backtracking. For negative arrays, **Prefix Sum + Monotonic Deque** (LeetCode #862) or **Prefix Sum + Hash Map** (LeetCode #560) is required ($\mathcal{O}(n)$).
* **Complexity:**
  - Although there is a nested `while` loop for contraction, each pointer $L$ and $R$ visits each index at most once.
  - Total pointer advances $\le 2n$, guaranteeing $\mathcal{O}(n)$ amortized time.
  - Space: $\mathcal{O}(1)$ for scalar conditions or $\mathcal{O}(\Sigma)$ / $\mathcal{O}(\min(n, m))$ when tracking character frequencies.

### C. Window Extrema (Maximum & Minimum)
* **Common Misconception:** Believing that maintaining the running maximum of a sliding window can be done in $O(1)$ with a single variable `current_max`.
* **Why it fails:** When the maximum element leaves the left boundary ($i - k$), a scalar variable cannot know the second-largest element without re-scanning the entire window ($\mathcal{O}(k)$ per slide, degrading to $\mathcal{O}(n \cdot k)$).
* **The Correct Approach:** A **Monotonic Deque** (Double-Ended Queue) storing indices of elements in strictly decreasing order.
  - Adding element $i$: Pop elements from back of deque that are $\le \text{nums}[i]$.
  - Expiring elements: If front index $< i - k + 1$, pop front.
  - Current maximum: Always at front of deque in $\mathcal{O}(1)$.
  - Total time: Each element pushed and popped at most once $\to \mathcal{O}(n)$ time, $\mathcal{O}(k)$ space.

---

## 3. Edge-Case Matrix & Handling

| Case | Scenario | Expected Behavior |
|---|---|---|
| Empty array | `nums = []`, `k > 0` | Guard check returns `0` or appropriate sentinel. |
| Window size $k > n$ | Array shorter than window | Returns sentinel/0 or handles as invalid input. |
| Window size $k = 1$ | Every element is its own window | Reduces to finding $\max(\text{nums})$ in $\mathcal{O}(n)$. |
| Window size $k = n$ | Entire array is the only window | Returns $\text{sum}(\text{nums}) / n$ after 1 step. |
| All negative numbers | `nums = [-5, -2, -8, -1]` | Rolling sum correctly updates negative values; maximum average is properly computed. |
| Duplicate characters | `s = "bbbbb"` | Frequency window contracts immediately to length 1. |

---

## 4. Verification Status
* **Sliding Window Visualizer Engine:** Verified dynamic calculation matching exact mathematical outputs.
* **Curated 15 Questions:** 100% verified to exist in CompanyWise canonical question catalog.
* **Educational Content:** Updated with clear distinction between fixed, variable, monotonic, and negative-number constraints.
