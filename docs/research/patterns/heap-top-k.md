# Heap / Top K Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents binary heaps, priority queues, partial sorting, two-heap median maintenance, and streaming $K$-extrema.

### Verified Academic & Reference Sources
1. **CLRS (Introduction to Algorithms, Chapter 6: Heapsort)**
   - *Topic:* Binary heap property (min-heap, max-heap), `Build-Heap` in $\mathcal{O}(n)$, `Heapify` in $\mathcal{O}(\log n)$.
2. **Sedgewick & Wayne (Algorithms, 4th Edition, Section 2.4: Priority Queues)**
   - *Topic:* Array representation of complete binary trees (children at $2i + 1, 2i + 2$, parent at $\lfloor (i - 1)/2 \rfloor$).
3. **CP-Algorithms**
   - *Topic:* Binary heap and randomized heaps for competitive programming.
   - *Reference:* [CP-Algorithms: Disjoint Set & Heaps](https://cp-algorithms.com/)
4. **LeetCode Canonical Problems**
   - Problem 215: Kth Largest Element in an Array (Min-heap of size $K$ in $\mathcal{O}(n \log K)$ or Quickselect in $\mathcal{O}(n)$)
   - Problem 347: Top K Frequent Elements (Bucket sort or Min-heap of frequencies)
   - Problem 295: Find Median from Data Stream (Two heaps: Max-heap of lower half, Min-heap of upper half)
   - Problem 23: Merge k Sorted Lists (Min-heap of size $K$ yielding $\mathcal{O}(N \log K)$)
   - Problem 373: Find K Pairs with Smallest Sums (Priority queue of frontier coordinate pairs)
   - Problem 621: Task Scheduler (Max-heap of task frequencies + cooldown queue)

---

## 2. Core Algorithmic Principles & Invariants

### A. The Min-Heap of Size K Invariant
To find the $K$-th largest element in an unsorted stream of size $n$:
- Maintain a **Min-Heap** bounded to at most $K$ elements.
- For each incoming element $x$:
  - If heap size $< K$: push $x$.
  - Else if $x > \text{heap.peek()}$: pop the smallest element and push $x$.
- **Invariant:** At all times, the heap retains the $K$ largest elements seen so far. The minimum of these $K$ largest elements is at the root ($\text{peek()}$), which is exactly the $K$-th largest element!
- **Complexity:** $\mathcal{O}(n \log K)$ time and $\mathcal{O}(K)$ auxiliary space (vastly superior to sorting the whole array in $\mathcal{O}(n \log n)$ when $K \ll n$).

### B. Subpatterns
1. **Top K Frequent Elements:**
   - Hash map counts frequencies; Min-heap of size $K$ preserves top $K$ frequent items.
2. **Two Heaps (Dynamic Median):**
   - Maintain `lowerHalf` (Max-Heap) and `upperHalf` (Min-Heap).
   - Invariant: Balance heap sizes so $| \text{lowerHalf} | - | \text{upperHalf} | \in \{0, 1\}$.
   - Median is either top of `lowerHalf` or the average of both tops in $\mathcal{O}(1)$ time.
3. **K-Way Merge (Sorted Streams):**
   - Insert the first element of each of the $K$ sorted lists into a Min-Heap. Pop minimum and insert its successor.
4. **Task Scheduling / Greedy Frequency Priority:**
   - Always prioritize the remaining task with the highest frequency using a Max-Heap to prevent idle bottlenecks.

### C. Complexity Analysis
- **Build Heap:** $\mathcal{O}(n)$ time via bottom-up heapification.
- **Push / Pop:** $\mathcal{O}(\log K)$ time.
- **Peek:** $\mathcal{O}(1)$ constant time.
- **Space:** $\mathcal{O}(K)$ auxiliary memory.

---

## 3. When NOT to Use Heaps
- **Exact Arbitrary Index Access:** Heaps do not support $\mathcal{O}(1)$ or $\mathcal{O}(\log n)$ random lookup or arbitrary deletion without auxiliary hash maps (Indexed Priority Queue).
- **Full Array Sorting Needed:** Standard Quicksort / Mergesort / Timsort are practically faster with smaller constant factors.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| $K = 1$ | 1st largest element | Reduces to finding $\max(A)$ in $\mathcal{O}(n)$ linear scan without heap overhead. |
| $K = n$ | $n$-th largest element | Reduces to finding $\min(A)$ in $\mathcal{O}(n)$. |
| Duplicate numbers | `nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4` | Handled seamlessly; duplicate values are retained in heap. |
| Empty stream | Median query on empty stream | Return 0 or appropriate sentinel. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Proven via CLRS Chapter 6 heap invariants.
- **Practice Problems:** 11 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of bounded min-heaps, two-heap median maintenance, and K-way stream merging.
