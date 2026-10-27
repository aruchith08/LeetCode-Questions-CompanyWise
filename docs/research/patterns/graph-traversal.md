# Graph Traversal (DFS/BFS) Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents general graph exploration, adjacency representations, visited sets, connected components, cycle detection, and shortest paths.

### Verified Academic & Reference Sources
1. **CLRS (Introduction to Algorithms, Chapter 22: Elementary Graph Algorithms)**
   - *Topic:* Graph representations (Adjacency List vs Matrix), BFS, DFS, edge classification (Tree, Back, Forward, Cross edges).
2. **MIT OpenCourseWare (6.006 Introduction to Algorithms, Lecture 11-13)**
   - *Topic:* Breadth-First Search, Depth-First Search, cycle detection, connected components.
3. **CP-Algorithms**
   - *Topic:* Connected components in a graph, flood fill, 0-1 BFS, bipartite check.
   - *Reference:* [CP-Algorithms: Graph Traversals](https://cp-algorithms.com/graph/breadth-first-search.html)
4. **LeetCode Canonical Problems**
   - Problem 200: Number of Islands (2D Grid connected components via Flood Fill)
   - Problem 133: Clone Graph (DFS/BFS with hash map mapping original to clone)
   - Problem 785: Is Graph Bipartite? (2-coloring via BFS/DFS)
   - Problem 841: Keys and Rooms (Reachable component size)
   - Problem 127: Word Ladder (Shortest path in unweighted state-space graph via BFS)
   - Problem 994: Rotting Oranges (Multi-source BFS simulation)
   - Problem 417: Pacific Atlantic Water Flow (Reverse reachability from boundaries)

---

## 2. Core Algorithmic Principles & Invariants

### A. Graph Representations & The Visited Invariant
Graphs $G = (V, E)$ are typically stored as **Adjacency Lists** `adj[u] = [v1, v2, ...]`.
- **The Visited Invariant:** To prevent infinite loops caused by cycles, a node must be marked as `visited` **immediately upon discovering it** (in BFS: at the moment it is pushed to the queue; in DFS: at the beginning of the function call).

### B. BFS vs DFS for Graphs
| Property | Breadth-First Search (BFS) | Depth-First Search (DFS) |
|---|---|---|
| **Data Structure** | FIFO Queue | LIFO Call Stack |
| **Shortest Path** | Guarantees shortest path in unweighted graphs | Does NOT guarantee shortest path |
| **Cycle Detection** | Cross/back edges | Back edges to ancestor in current call stack |
| **Connected Components** | Flood level-by-level | Floods deep until dead end |
| **Memory** | $\mathcal{O}(\text{frontier}) \le \mathcal{O}(V)$ | $\mathcal{O}(\text{path depth}) \le \mathcal{O}(V)$ |

### C. Subpatterns
1. **Grid Flood Fill (Matrix as Graph):**
   - Cells $(r, c)$ are vertices; edges connect to orthogonal neighbors $(r \pm 1, c)$ and $(r, c \pm 1)$.
2. **Multi-Source BFS:**
   - Initialize the queue with all initial source nodes simultaneously (distance 0). The expansion radiates outward concurrently.
3. **Bipartite Graph Check (2-Coloring):**
   - Color start node with color 0. Every adjacent neighbor must have color $1 - \text{color}(u)$. If an already visited neighbor shares the same color, the graph contains an odd-length cycle and is NOT bipartite.
4. **Graph Cloning:**
   - Traverse graph; use a hash map `visited[old_node] = new_node` to avoid duplicating cloned nodes and handle cycles.

### D. Complexity Analysis
- **Time Complexity:** $\mathcal{O}(V + E)$ (or $\mathcal{O}(R \times C)$ for 2D grids with 4 directions).
- **Space Complexity:** $\mathcal{O}(V)$ for visited set and queue/stack.

---

## 3. When NOT to Use Graph BFS/DFS
- **Weighted Graphs with Arbitrary Non-uniform Weights:** BFS fails to find shortest paths; use **Dijkstra's Algorithm** ($\mathcal{O}((V + E) \log V)$) for non-negative weights or **Bellman-Ford** ($\mathcal{O}(V \cdot E)$) for negative weights.
- **Dynamic Connectivity with Millions of Union Queries:** Use **Union Find (Disjoint Set)** for near $\mathcal{O}(1)$ connectivity checks instead of $\mathcal{O}(V + E)$ graph traversals.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Disconnected components | Graph has multiple isolated subgraphs | Outer loop `for node in range(V): if node not in visited: bfs(node)` ensures full coverage. |
| Self-loops or multi-edges | Node has edge to itself | Handled by visited check without infinite recursion. |
| Empty graph | `V = 0` or empty grid | Guard returns `0` or appropriate sentinel. |
| Multi-source BFS with no sources | Grid has no initial rotten oranges/sources | Returns `0` or `-1` depending on unreached targets. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Verified via CLRS Chapter 22.
- **Practice Problems:** 12 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of single-source BFS/DFS, multi-source BFS, and 2-coloring bipartite validation.
