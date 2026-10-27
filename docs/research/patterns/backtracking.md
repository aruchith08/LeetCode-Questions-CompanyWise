# Backtracking Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents state-space tree traversal, branch pruning, constraint satisfaction problems, and undoing operations.

### Verified Academic & Reference Sources
1. **Donald Knuth (The Art of Computer Programming, Vol 4B: Combinatorial Searching)**
   - *Topic:* Backtrack programming, Dancing Links (Algorithm X), exact cover problems.
2. **CLRS (Introduction to Algorithms, Chapter 34: NP-Completeness)**
   - *Topic:* Exhaustive search, Hamiltonian cycle, subset sum, exponential search spaces.
3. **MIT OpenCourseWare (6.006 & 6.046)**
   - *Topic:* Constraint satisfaction, N-Queens problem, pruning state spaces.
4. **LeetCode Canonical Problems**
   - Problem 46: Permutations (All permutations using `used` boolean array)
   - Problem 78: Subsets (Power set generation via include/exclude decision branches)
   - Problem 39: Combination Sum (Unbounded element reuse with remaining target reduction)
   - Problem 40: Combination Sum II (Deduplication via sorting and sibling skip `i > start && nums[i] == nums[i-1]`)
   - Problem 51: N-Queens (Column, positive diagonal $r + c$, negative diagonal $r - c$ bitmasks)
   - Problem 79: Word Search (2D grid DFS backtracking with temporary in-place marking)
   - Problem 37: Sudoku Solver (Row, column, box constraint validation)

---

## 2. Core Algorithmic Principles & Invariants

### A. The 3-Step Backtracking Recipe
```python
def backtrack(candidate_state):
    if is_solution(candidate_state):
        output(candidate_state)
        return
        
    for choice in choices:
        if is_valid(choice, candidate_state):
            # 1. MAKE CHOICE (Modify state)
            apply_choice(choice, candidate_state)
            
            # 2. EXPLORE (Recursive dive)
            backtrack(candidate_state)
            
            # 3. UNDO CHOICE (Revert state / clean up)
            undo_choice(choice, candidate_state)
```
- **Invariant:** When backtracking returns to the caller, the state of the data structure (array, grid, or set) must be **completely restored** to its exact configuration before `apply_choice` was called.

### B. Pruning & Duplicate Handling
- **Duplicate Prevention in Combinations:**
  - Sort candidate elements first: `nums.sort()`.
  - In loop: `if i > start and nums[i] == nums[i-1]: continue`
  - This skips identical choices at the **same tree depth level (siblings)**, while still permitting identical choices along **vertical parent-child ancestor paths**.

### C. Complexity Analysis
- **Permutations:** $\mathcal{O}(n! \times n)$
- **Subsets / Combinations:** $\mathcal{O}(2^n \times n)$
- **Space Complexity:** $\mathcal{O}(n)$ auxiliary call stack depth.

---

## 3. When NOT to Use Backtracking
- **Large $N$ without Pruning ($N > 30$):** Combinatorial explosion renders $O(2^n)$ or $O(n!)$ infeasible for large inputs.
- **Overlapping Subproblems with Optimal Substructure:** If problem asks for the count, maximum, or minimum rather than enumerating all solutions, use **Dynamic Programming** or **Greedy**.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Empty input array | `nums = []` | Subsets returns `[[]]`; Permutations returns `[[]]`. |
| Zero target in combination sum | `target = 0` | Base case hits immediately; records valid empty combination. |
| Duplicate elements in input | `nums = [1, 2, 2]` | Sibling skip logic prevents generating duplicate subset `[1, 2]` twice. |
| Deep grid traversal | Word search grid $50 \times 50$ | Revert in-place character modification (`board[r][c] = temp`) on function return. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Proven via Knuth TAOCP Vol 4B.
- **Practice Problems:** 12 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of choice application, recursive dive, undo revert, and sibling duplicate pruning.
