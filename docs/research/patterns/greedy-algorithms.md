# Greedy Algorithms Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents the Greedy-Choice Property, Optimal Substructure, matroid theory, exchange arguments, and local-to-global optimality proofs.

### Verified Academic & Reference Sources
1. **CLRS (Introduction to Algorithms, Chapter 16: Greedy Algorithms)**
   - *Topic:* Activity-selection problem, Elements of the greedy strategy, Huffman codes, Matroids.
2. **MIT OpenCourseWare (6.046 Design and Analysis of Algorithms, Lecture 2-3)**
   - *Topic:* Greedy choice proofs: "Greedy stays ahead" and "Exchange arguments".
3. **Kleinberg & Tardos (Algorithm Design, Chapter 4: Greedy Algorithms)**
   - *Topic:* Interval scheduling, scheduling all intervals, minimum spanning trees, clustering.
4. **LeetCode Canonical Problems**
   - Problem 55: Jump Game (Greedy max reachable index boundary)
   - Problem 45: Jump Game II (BFS-style greedy horizon frontiers)
   - Problem 134: Gas Station (Cumulative deficit and reset invariant)
   - Problem 122: Best Time to Buy and Sell Stock II (Summing all positive forward differences)
   - Problem 455: Assign Cookies (Sorting both children and cookies; pairing smallest satisfying cookie)
   - Problem 763: Partition Labels (Last occurrence index expansion)
   - Problem 135: Candy (Left-to-right and right-to-left two-pass greedy distribution)

---

## 2. Core Algorithmic Principles & Invariants

### A. The Two Theoretical Requirements
1. **Greedy-Choice Property:** A globally optimal solution can be arrived at by making locally optimal (greedy) choices without reconsidering previously made decisions.
2. **Optimal Substructure:** An optimal solution to the problem contains within it optimal solutions to subproblems.

### B. Proof Techniques for Greedy Correctness
- **Exchange Argument:**
  - Assume there exists an optimal solution $O$ different from the greedy solution $G$.
  - Identify the first difference between $O$ and $G$.
  - Transform $O$ into $O'$ by exchanging the differing element with the greedy choice.
  - Prove that $O'$ is valid and its objective value is at least as good as $O$.
  - Conclude that the greedy solution is itself optimal.
- **Greedy Stays Ahead:**
  - Show by induction that at every step $k$, the greedy solution is ahead of or tied with any other feasible partial solution according to a defined progress metric (e.g. furthest reachable index in Jump Game).

### C. Subpatterns
1. **Furthest Reachable Horizon (Jump Game):**
   - `max_reach = max(max_reach, i + nums[i])`. If `i > max_reach`, return `false`.
2. **Two-Pass Greedy (Candy):**
   - Left-to-right pass satisfies $A[i] > A[i-1] \implies C[i] = C[i-1] + 1$.
   - Right-to-left pass satisfies $A[i] > A[i+1] \implies C[i] = \max(C[i], C[i+1] + 1)$.
3. **Cumulative Deficit Reset (Gas Station):**
   - If total gas $\ge$ total cost, a solution is guaranteed to exist.
   - If running tank becomes $< 0$ at station $i$, no station from $0 \dots i$ can be the starting station. Reset start to $i + 1$.

### D. Complexity Analysis
- **Time Complexity:** Typically $\mathcal{O}(n)$ single pass, or $\mathcal{O}(n \log n)$ when sorting elements first.
- **Space Complexity:** $\mathcal{O}(1)$ auxiliary memory in most formulations.

---

## 3. When NOT to Use Greedy
- **0-1 Knapsack Problem:** Unlike Fractional Knapsack, items cannot be broken. Greedy ratio choice (value/weight) fails; **Dynamic Programming** is required.
- **Coin Change with Arbitrary Denominations:** While greedy works for standard canonical coin systems (US Dollar: 25, 10, 5, 1), it fails for denominations like $\{1, 3, 4\}$ when making change for 6 (Greedy chooses $4 + 1 + 1 = 3$ coins, but optimal is $3 + 3 = 2$ coins). Use **Dynamic Programming**.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Zero values in array | `nums = [0, 2, 3]` in Jump Game | If index 0 has 0 jump capacity, immediately trapped. |
| Negative sum in Gas Station | Total gas $<$ total cost | Returns `-1` directly via global sum check. |
| All elements identical | `nums = [1, 1, 1]` in Candy | Every child gets exactly 1 candy; returns $n$. |
| Single element array | `nums = [0]` in Jump Game | Already at last index; returns `true`. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Proven via CLRS Chapter 16 and Kleinberg-Tardos exchange arguments.
- **Practice Problems:** 12 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of exchange argument proof, horizon frontiers, and two-pass greedy distribution.
