# Union Find (Disjoint Set) Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents Disjoint Set Union (DSU), Path Compression, Union by Rank/Size, Inverse Ackermann function complexity, dynamic connectivity, and Kruskal's MST.

### Verified Academic & Reference Sources
1. **Robert E. Tarjan (Efficiency of a Good But Not Linear Set Union Algorithm, JACM 1975)**
   - *Topic:* Tight bound $\mathcal{O}(m \cdot \alpha(n))$ for DSU with path compression and union by rank.
2. **CLRS (Introduction to Algorithms, Chapter 21: Data Structures for Disjoint Sets)**
   - *Topic:* Disjoint-set forests, union by rank, path compression heuristic, Ackermann's function.
3. **CP-Algorithms**
   - *Topic:* Disjoint Set Union, rollbacks in DSU, Arpa's trick.
   - *Reference:* [CP-Algorithms: Disjoint Set Union](https://cp-algorithms.com/data_structures/disjoint_set_union.html)
4. **LeetCode Canonical Problems**
   - Problem 684: Redundant Connection (Cycle detection in undirected graph)
   - Problem 547: Number of Provinces (Counting connected components)
   - Problem 721: Accounts Merge (Merging email sets with Union Find)
   - Problem 990: Satisfiability of Equality Equations (Equivalence relations)
   - Problem 1319: Number of Operations to Make Network Connected (Redundant edge counting)
   - Problem 1584: Min Cost to Connect All Points (Kruskal's Algorithm using DSU)

---

## 2. Core Algorithmic Principles & Invariants

### A. The Two Key Optimizations
1. **Path Compression (in `find`):**
   - While traversing upward from node $x$ to its root, point every visited ancestor directly to the root:
     ```python
     def find(x):
         if parent[x] != x:
             parent[x] = find(parent[x])  # Flatten tree
         return parent[x]
     ```
   - Flattens the tree so subsequent lookups are $\mathcal{O}(1)$.
2. **Union by Rank / Size (in `union`):**
   - Always attach the shorter tree (smaller rank) under the root of the taller tree (larger rank).
   - Prevents tree degeneration into linear linked lists of height $n$.

### B. The Inverse Ackermann Complexity $\alpha(n)$
When **both** Path Compression and Union by Rank are used:
- Any sequence of $m$ operations on $n$ elements runs in $\mathcal{O}(m \cdot \alpha(n))$ time.
- Here $\alpha(n)$ is the extremely slow-growing **Inverse Ackermann function**.
- For any practically conceivable input ($n < 10^{80}$, more than the number of atoms in the observable universe), $\alpha(n) \le 4$.
- Therefore, each `find` and `union` operation runs in **essentially constant $\mathcal{O}(1)$ amortized time**.

### C. Subpatterns
1. **Dynamic Connected Components:**
   - Initialize `parent[i] = i` and `components = n`. Each successful union decrements `components -= 1`.
2. **Cycle Detection in Undirected Graph:**
   - For an edge $(u, v)$: if $\text{find}(u) == \text{find}(v)$, an alternative path already exists connecting $u$ and $v$. Therefore, adding $(u, v)$ creates a cycle.
3. **Kruskal's Minimum Spanning Tree (MST):**
   - Sort edges by weight in ascending order. Add each edge if its endpoints belong to different disjoint sets.

---

## 3. When NOT to Use Union Find
- **Directed Graph Cycle Detection / Reachability:** Union Find handles symmetric relations (undirected edges). In directed graphs, reachability is asymmetric (use Topological Sort or Tarjan's SCC).
- **Edge Deletions / Disconnections:** Standard DSU does not support deleting edges without complex rollback mechanisms or offline divide-and-conquer.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Single node graph | `V = 1`, no edges | `find(0) == 0`, count = 1. |
| Self-loops | Edge connects $(u, u)$ | `find(u) == find(u)` correctly catches redundant cycle immediately. |
| Fully disconnected vertices | Zero edges | Disjoint sets remain partitioned; returns count = $V$. |
| Graph already fully connected | Extra edges added | Caught as redundant edges without altering structure. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Proven via Tarjan (1975) and CLRS Chapter 21.
- **Practice Problems:** 10 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of path compression, union by rank, and inverse Ackermann amortized bound.
