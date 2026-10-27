# Tree BFS Pattern — Algorithmic Research & Technical Notes

## 1. Scope & References Consulted

This technical note documents queue-based level-order traversal, boundary views, zigzag orders, and shortest tree path calculations.

### Verified Academic & Reference Sources
1. **CLRS (Introduction to Algorithms, Chapter 22: Elementary Graph Algorithms)**
   - *Topic:* Breadth-First Search, queue FIFO discipline, shortest path tree.
2. **Sedgewick & Wayne (Algorithms, 4th Edition)**
   - *Topic:* Level-order traversal of binary trees and tries using queues.
3. **CP-Algorithms**
   - *Topic:* BFS and tree diameter calculation via double BFS.
   - *Reference:* [CP-Algorithms: Breadth First Search](https://cp-algorithms.com/graph/breadth-first-search.html)
4. **LeetCode Canonical Problems**
   - Problem 102: Binary Tree Level Order Traversal (Queue-based 2D level array)
   - Problem 107: Binary Tree Level Order Traversal II (Bottom-up level order)
   - Problem 103: Binary Tree Zigzag Level Order Traversal (Alternating direction deque)
   - Problem 199: Binary Tree Right Side View (Last node of each BFS level)
   - Problem 111: Minimum Depth of Binary Tree (First leaf encountered in BFS)
   - Problem 116: Populating Next Right Pointers in Each Node (Level-order horizontal linking)
   - Problem 863: All Nodes Distance K in Binary Tree (Tree converted to graph BFS)

---

## 2. Core Algorithmic Principles & Invariants

### A. Level-Size Queue Batching Invariant
Standard tree BFS avoids mixing elements of different depths by recording the size of the queue at the start of each level:
```python
queue = deque([root])
while queue:
    level_size = len(queue)  # Snapshot of current level's width
    current_level = []
    for _ in range(level_size):
        node = queue.popleft()
        current_level.append(node.val)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    result.append(current_level)
```
- **Invariant:** At the beginning of iteration $d$, `queue` contains exclusively all nodes at depth $d$.
- **Shortest Path Optimality:** The first time a leaf node is dequeued, its depth is guaranteed to be the minimum depth of the tree.

### B. Subpatterns
1. **Standard Level Order (2D Array):**
   - Collect nodes grouped by discrete vertical level.
2. **Right / Left Side View:**
   - In each level loop of size $K$, the element at index $K - 1$ is the rightmost visible node.
3. **Zigzag / Spiral Traversal:**
   - Alternate the insertion order (or reverse the level list) depending on whether depth is even or odd.
4. **Horizontal Node Linking:**
   - Link `node.next = next_node_in_level` to create horizontal traversal chains without extra memory.

### C. Complexity Analysis
- **Time Complexity:** $\mathcal{O}(n)$ because each node is enqueued and dequeued exactly once.
- **Space Complexity:** $\mathcal{O}(w)$ where $w$ is the maximum width (breadth) of the tree.
  - In a complete binary tree, the leaf level contains $\lceil n / 2 \rceil$ nodes $\implies \mathcal{O}(n)$ auxiliary queue space.

---

## 3. When NOT to Use Tree BFS
- **Deep Path Sum / Backtracking:** If searching for root-to-leaf paths or combinatorial subtrees, DFS uses only $\mathcal{O}(h)$ call stack space instead of $\mathcal{O}(2^h)$ queue space.
- **Topological Inorder Traversal:** Inorder BST traversal requires DFS; BFS does not naturally yield sorted elements from a BST.

---

## 4. Edge-Case Matrix

| Case | Scenario | Expected Handling |
|---|---|---|
| Null root | `root == null` | Returns empty array `[]` immediately. |
| Single node | `[1]` | Returns `[[1]]` with 1 level of length 1. |
| Unbalanced or skewed tree | Long linear chain | Queue never contains more than 1 node at a time; space drops to $\mathcal{O}(1)$. |
| Large balanced tree | Deep complete tree ($n \approx 10^5$) | Queue holds up to $n/2$ nodes; allocate sufficient buffer capacity. |

---

## 5. Verification Status
- **Algorithmic Correctness:** Proven via BFS level-order invariant in CLRS Chapter 22.
- **Practice Problems:** 10 curated questions verified in `questions.json`.
- **Reviewer Status:** Approved with complete coverage of queue snapshot batching, right side view, and zigzag traversal.
