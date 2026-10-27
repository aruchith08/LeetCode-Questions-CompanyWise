# Sliding Window Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents the formal algorithmic principles, complexity proofs, validity conditions, and edge cases for the Sliding Window pattern.

### Verified Academic & Reference Sources
1. **MIT OpenCourseWare (6.006 Introduction to Algorithms)**
   - *Topic:* Two-pointer techniques, sequence analysis, contiguous subarrays.
   - *Reference:* [MIT 6.006 Lecture Notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)
2. **CP-Algorithms (e-maxx algorithms)**
   - *Topic:* Sliding Window Minimum / Maximum using Monotonic Deque, Subsegment sum optimization.
   - *Reference:* [CP-Algorithms: Minimum stack / Minimum queue](https://cp-algorithms.com/data_structures/stack_queue_modification.html)
3. **CLRS (Introduction to Algorithms, Cormen et al.)**
   - *Topic:* Chapter on amortized analysis, two pointers, rolling hashing (Rabin-Karp connection to sliding window).
4. **LeetCode Canonical Problems**
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
* **Crucial Monotonicity Requirement & Distinctions Across Techniques:**
  - **LeetCode #209 — Minimum Size Subarray Sum:**
    - *Objective:* Find the shortest non-empty contiguous subarray whose sum is $\ge S$, under the problem's assumption that all elements are strictly positive ($\text{nums}[i] > 0$).
    - *Why Sliding Window works:* Expanding $R$ strictly increases the sum, and shrinking $L$ strictly decreases the sum. This mathematical monotonicity ensures that greedy contraction preserves optimality without backtracking.
    - *Complexity:* $\mathcal{O}(n)$ time, $\mathcal{O}(1)$ auxiliary space.
  - **LeetCode #862 — Shortest Subarray with Sum at Least K:**
    - *Objective:* Find the minimum length of a non-empty contiguous subarray whose sum is $\ge K$, when the array can contain negative numbers.
    - *Why standard Sliding Window fails:* Negative numbers cause running sums to oscillate non-monotonically: expanding $R$ can decrease the sum, and advancing $L$ can increase it.
    - *Correct Technique:* **Prefix Sum + Monotonic Deque**. By maintaining indices of strictly increasing prefix sums in a double-ended queue, we can check potential left endpoints in $\mathcal{O}(1)$ amortized time:
      1. Pop from front when $P[R] - P[\text{deque.front()}] \ge K$ (recording candidate minimum length; any future right endpoint $R' > R$ would yield a strictly longer subarray).
      2. Pop from back while $P[R] \le P[\text{deque.back()}]$ (as $R$ is both further right and has a smaller/equal prefix sum, dominating previous entries).
    - *Complexity:* $\mathcal{O}(n)$ time, $\mathcal{O}(n)$ auxiliary space.
  - **LeetCode #560 — Subarray Sum Equals K:**
    - *Objective:* Count the total number of contiguous subarrays whose sum is *exactly equal* to $K$, allowing negative numbers.
    - *Why Monotonic Deque / Sliding Window are inapplicable:* This is an exact equality count problem, not an inequality or length minimization problem.
    - *Correct Technique:* **Prefix Sum + Hash Map**. Maintain a hash map of prefix sum frequencies: any prior prefix satisfying $P[j] = P[i] - K$ denotes a valid contiguous subarray $(j, i]$ summing to $K$.
    - *Complexity:* $\mathcal{O}(n)$ expected time, $\mathcal{O}(n)$ auxiliary space.

### C. Window Extrema (Maximum & Minimum)
* **The Correct Approach:** A **Monotonic Deque** (Double-Ended Queue) storing indices of elements in strictly decreasing order.
  - Adding element $i$: Pop elements from back of deque that are $\le \text{nums}[i]$.
  - Expiring elements: If front index $< i - k + 1$, pop front.
  - Current maximum: Always at front of deque in $\mathcal{O}(1)$.
  - Total time: Each element pushed and popped at most once $\to \mathcal{O}(n)$ time, $\mathcal{O}(k)$ space.

---

## 3. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Empty array | `nums = []`, `k > 0` | Guard check returns `0` or appropriate sentinel. |
| Window size $k > n$ | Array shorter than window | Returns sentinel/0 or handles as invalid input. |
| Window size $k = 1$ | Every element is its own window | Reduces to finding $\max(\text{nums})$ in $\mathcal{O}(n)$. |
| Window size $k = n$ | Entire array is the only window | Returns $\text{sum}(\text{nums}) / n$ after 1 step. |
| All negative numbers | `nums = [-5, -2, -8, -1]` | Rolling sum correctly updates negative values; maximum average is properly computed. |
| Duplicate characters | `s = "bbbbb"` | Frequency window contracts immediately to length 1. |

---

## 4. Verification Status
- **Sliding Window Visualizer Engine:** Verified dynamic calculation matching exact mathematical outputs.
- **Curated 15 Questions:** 100% verified to exist in CompanyWise canonical question catalog.
- **Educational Content:** Updated with clear distinction between fixed, variable, monotonic, and negative-number constraints.
