# Hashing & Frequency Counting — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents the foundational data structure and algorithmic principles, hash collisions, complexity guarantees, and edge cases for the Hashing & Frequency Counting pattern.

### Verified Academic & Reference Sources
1. **MIT OpenCourseWare (6.006 Introduction to Algorithms, Lecture 8-10)**
   - *Topic:* Hash tables, universal hashing, direct access arrays, open addressing vs chaining.
   - *Reference:* [MIT 6.006 Hashing Notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/)
2. **CLRS (Introduction to Algorithms, 3rd/4th Edition, Chapter 11)**
   - *Topic:* Hash functions, load factors, collision resolution, $O(1)$ expected time complexity proofs.
3. **CP-Algorithms**
   - *Topic:* String hashing, hash maps with custom hashers to prevent anti-hash adversarial test cases.
   - *Reference:* [CP-Algorithms: String Hashing](https://cp-algorithms.com/string/string-hashing.html)
4. **LeetCode Canonical Problems**
   - Problem 1: Two Sum (Complement lookup in $O(1)$)
   - Problem 242: Valid Anagram (Frequency count array / character map)
   - Problem 49: Group Anagrams (Sorted tuple / frequency signature as hash key)
   - Problem 128: Longest Consecutive Sequence (HashSet lookup for sequence roots)
   - Problem 560: Subarray Sum Equals K (Prefix sum frequency hash map)

---

## 2. Core Algorithmic Principles & Invariants

### A. The Core Idea
Directly trade space for time by mapping keys (integers, strings, or structured states) into array indices using a hash function $h(k) \pmod m$. By maintaining an expected load factor $\alpha = n / m \le 0.75$, dictionary operations (Insert, Lookup, Delete) achieve $\mathcal{O}(1)$ expected amortized time.

### B. Subpatterns
1. **Complement / Difference Lookup:**
   - Instead of checking all pairs $(i, j)$ in $O(n^2)$, store previously seen elements in a hash set/map and query if $\text{target} - \text{nums}[i]$ has already been visited in $O(1)$.
2. **Frequency Array / Counter:**
   - Count occurrences of alphabet symbols (e.g., lowercase English letters in a fixed-size `int[26]` array) or arbitrary keys in a dynamic map.
3. **Canonical Representation / Signature as Keys:**
   - Grouping items by invariant properties (e.g. sorted string or 26-element tuple counts for anagrams).
4. **Set Membership for Boundary / Root Identification:**
   - Testing if $x - 1 \notin \text{Set}$ in $O(1)$ to only begin traversing sequences from their true start elements, eliminating redundant work.

### C. Complexity Analysis
- **Time Complexity:**
  - Expected: $\mathcal{O}(1)$ insertion, deletion, and lookup.
  - Worst Case: $\mathcal{O}(n)$ if all keys collide into the same bucket (mitigated by Robin Hood hashing, universal hash families, or balanced tree buckets in modern runtimes like Java's `HashMap`).
- **Space Complexity:**
  - $\mathcal{O}(n)$ to store $n$ distinct entries or $\mathcal{O}(\Sigma)$ for bounded alphabets ($\Sigma \le 256$).

---

## 3. When NOT to Use Hashing
- **Sorted Order Queries:** When range minimum/maximum, predecessor, or successor queries are required (use balanced BST or B-Tree in $O(\log n)$).
- **Extremely Low Memory Limits:** Hash tables require substantial pointer overhead and empty buckets. Direct bit manipulation or array sorting may be preferable.
- **Prefix / Suffix Matching:** For dynamic prefix queries on strings, a **Trie** is asymptotically superior.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Duplicate elements | Multiple identical keys in array | Frequency count handles counts $> 1$; 2-Sum tracks latest index or handles distinct indices. |
| Negative keys | Keys with negative values | Handled naturally by modern dynamic dictionaries; offsets needed for raw array indexing. |
| Empty input | `nums = []` or `s = ""` | Early return empty map, `0`, or `[]`. |
| Single element | Array of length 1 | Check if target requires pairs; return appropriate boundary value. |
| Large integer keys | Values exceeding 32-bit limits | Use 64-bit integer keys or stringified BigInt representations. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Verified through MIT 6.006 and CLRS.
- **Practice Problems:** 12 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with full coverage of load factors, collision resolution, and frequency counter arrays.
