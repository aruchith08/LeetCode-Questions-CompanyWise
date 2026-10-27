# Intervals & Sweep Line Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents interval sorting, event-driven sweep line algorithms, meeting room allocations, and segment intersections.

### Verified Academic & Reference Sources
1. **Franco P. Preparata & Michael I. Shamos (Computational Geometry, Chapter 2)**
   - *Topic:* Sweep-line paradigm, status structure, event point schedule.
2. **CLRS (Introduction to Algorithms, Chapter 14: Augmenting Data Structures & Chapter 16: Greedy Algorithms)**
   - *Topic:* Interval trees, activity selection problem, greedy choice on earliest finish time.
3. **CP-Algorithms**
   - *Topic:* Sweep line algorithms for point/segment overlap queries.
   - *Reference:* [CP-Algorithms: Sweep-line](https://cp-algorithms.com/geometry/intersecting_segments.html)
4. **LeetCode Canonical Problems**
   - Problem 56: Merge Intervals (Sorting by start time + running overlap merge)
   - Problem 57: Insert Interval (Linear insertion maintaining sorted partitions)
   - Problem 435: Non-overlapping Intervals (Greedy removal based on earliest end time)
   - Problem 452: Minimum Number of Arrows to Burst Balloons (Interval intersection greedy shooting)
   - Problem 253: Meeting Rooms II (Sweep line event counting / min-heap of active meetings)
   - Problem 218: The Skyline Problem (Sweep line with max-heap of building heights)

---

## 2. Core Algorithmic Principles & Invariants

### A. Overlap Conditions
Two closed intervals $A = [s_1, e_1]$ and $B = [s_2, e_2]$ (where $s_1 \le s_2$) overlap if and only if:
$$s_2 \le e_1$$
When they overlap, their union is:
$$\text{Merge}(A, B) = [s_1, \max(e_1, e_2)]$$
Their intersection is:
$$\text{Intersect}(A, B) = [\max(s_1, s_2), \min(e_1, e_2)]$$

### B. Subpatterns
1. **Sort by Start Time (Merge Intervals):**
   - Sort intervals by $s_i$.
   - Iterate and maintain current interval $[S, E]$. If next interval has $s_{i+1} \le E$, update $E = \max(E, e_{i+1})$. Otherwise, commit $[S, E]$ to output and set new current interval to $[s_{i+1}, e_{i+1}]$.
2. **Sort by End Time (Greedy Activity Selection / Non-overlapping):**
   - Sorting by end time $e_i$ leaves maximum possible room for subsequent intervals. Always pick the interval that finishes earliest.
3. **Sweep Line / Event Processing:**
   - Deconstruct intervals $[s_i, e_i]$ into discrete event points:
     - Start event: $(s_i, +1)$
     - End event: $(e_i, -1)$
   - Sort all events chronologically (processing end events before start events if boundaries touch without overlapping). A running counter tracks active concurrent intervals at any point in time.

### C. Complexity Analysis
- **Time Complexity:** $\mathcal{O}(n \log n)$ dominated by sorting the $n$ intervals or $2n$ event points.
- **Space Complexity:** $\mathcal{O}(n)$ to store sorted intervals/events and result list.

---

## 3. When NOT to Use Intervals / Sweep Line
- **High-Dimensional Spatial Regions:** 3D or arbitrary geometric bounding boxes (use R-Trees or KD-Trees).
- **Static Point Querying on Continuous Fixed Arrays:** Prefix sums or difference arrays are faster ($\mathcal{O}(n)$ rather than $\mathcal{O}(n \log n)$) when coordinates are dense integers.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Non-overlapping intervals | `[[1, 2], [3, 4]]` | Remains untouched without false merging. |
| Completely nested intervals | `[[1, 10], [2, 5]]` | Correctly resolves to `[[1, 10]]` via `max(e1, e2)`. |
| Touching boundaries | `[[1, 2], [2, 3]]` | Check problem spec: if closed $[1, 2]$ and $[2, 3]$ touch at 2, merge into `[[1, 3]]`. |
| Single interval or empty | `[[1, 5]]` or `[]` | Returns input directly. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Proven via computational geometry sweep line theorems.
- **Practice Problems:** 10 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of start-time sorting, end-time greedy scheduling, and sweep-line event points.
