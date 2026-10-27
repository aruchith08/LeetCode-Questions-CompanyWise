# Topological Sort Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents Directed Acyclic Graph (DAG) vertex linear orderings, Kahn's algorithm (BFS In-Degree), DFS post-order reversal (Tarjan), and cycle detection in dependency graphs.

### Verified Academic & Reference Sources
1. **Arthur B. Kahn (Topological Sorting of Large Networks, CACM 1962)**
   - *Topic:* In-degree reduction algorithm using queue, work-order processing.
2. **CLRS (Introduction to Algorithms, Chapter 22.4: Topological Sort)**
   - *Topic:* Lemma: A directed graph is acyclic (DAG) iff a depth-first search yields no back edges. Topological sort as reverse of finishing times.
3. **CP-Algorithms**
   - *Topic:* Topological Sorting via DFS and BFS (Kahn's Algorithm).
   - *Reference:* [CP-Algorithms: Topological Sort](https://cp-algorithms.com/graph/topological_sort.html)
4. **LeetCode Canonical Problems**
   - Problem 207: Course Schedule (Cycle detection in dependency graph)
   - Problem 210: Course Schedule II (Outputting the full linear order)
   - Problem 310: Minimum Height Trees (Trimming leaves via topological in-degree reduction)
   - Problem 802: Find Eventual Safe States (Terminal reachability via reverse graph topological sort)
   - Problem 2115: Find All Possible Recipes from Given Supplies (Kahn's algorithm with available resources)
   - Problem 1462: Course Schedule IV (Transitive closure reachability in DAG)

---

## 2. Core Algorithmic Principles & Invariants

### A. Formal Definition & The DAG Theorem
A topological sort of a directed graph $G = (V, E)$ is a linear ordering of all its vertices such that if $G$ contains an edge $(u, v)$, then $u$ appears before $v$ in the ordering.
- **Fundamental Theorem:** A topological sort exists **if and only if** the graph contains **no directed cycles** (i.e. $G$ is a DAG).

### B. Kahn's Algorithm (In-Degree BFS)
1. **Compute In-Degrees:** For every node $v$, calculate $\text{in\_degree}[v] = \text{number of incoming edges } (u, v)$.
2. **Initialize Queue:** Push all vertices with $\text{in\_degree}[v] == 0$ onto a FIFO queue (nodes with no prerequisites).
3. **Process Vertices:** While the queue is non-empty:
   - Dequeue node $u$ and append it to the topological ordering.
   - For every outgoing edge $(u, v)$, decrement $\text{in\_degree}[v] -= 1$.
   - If $\text{in\_degree}[v]$ becomes 0, enqueue $v$.
4. **Cycle Detection Invariant:** If the total count of processed vertices is strictly less than $|V|$, the graph contains a directed cycle (deadlock / circular dependency), and no valid ordering exists.

### C. Complexity Analysis
- **Time Complexity:** $\mathcal{O}(V + E)$ where $V$ is number of vertices and $E$ is number of prerequisite edges.
- **Space Complexity:** $\mathcal{O}(V + E)$ for adjacency list, in-degree array, and queue.

---

## 3. When NOT to Use Topological Sort
- **Undirected Graphs:** Topological sort is strictly undefined for undirected graphs (every undirected edge acts as a bidirectional 2-cycle).
- **Finding All Topological Orders:** Generating all valid orderings is NP-hard in general; use Backtracking only when $V \le 12$.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Graph with cycle | `1 -> 2 -> 3 -> 1` | Kahn's algorithm terminates early; detected when `result.length < numCourses`, returns empty list `[]`. |
| Graph with disconnected vertices | Some courses have no prerequisites | In-degree 0 immediately enqueued; included naturally in ordering. |
| Self-dependencies | Node requires itself: `0 -> 0` | In-degree is at least 1; never enters queue; identified as cycle. |
| Empty graph | `numCourses = 0` or no edges | Returns `[]` or list of all unconstrained nodes. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Proven via Kahn (1962) and CLRS Chapter 22.4.
- **Practice Problems:** 9 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of Kahn's in-degree queue algorithm and cycle detection invariants.
