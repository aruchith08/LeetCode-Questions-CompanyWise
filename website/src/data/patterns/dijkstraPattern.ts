import type { PatternLearningContent } from '../../types/patterns';

export const DIJKSTRA_PATTERN: PatternLearningContent = {
  slug: 'dijkstras-algorithm',
  title: "Dijkstra's Shortest Path",
  level: 'Advanced',
  category: 'Graphs & Greedy',
  prerequisites: ['Graph Traversal (DFS/BFS)', 'Adjacency Lists', 'Heap / Top K (Priority Queue)'],
  companiesTop: ['Google', 'Amazon', 'Meta', 'Uber', 'Microsoft'],

  // Module 1: Intro
  introTitle: "What is Dijkstra's Algorithm?",
  introDescription: [
    "Dijkstra's Algorithm is a greedy single-source shortest path algorithm that finds the minimal cumulative distance from a starting node to all other vertices in a directed or undirected graph with non-negative edge weights.",
    'By greedily processing the vertex with the current smallest tentative distance using a Min-Heap (priority queue), Dijkstra guarantees that once a vertex is extracted from the heap, its computed shortest path is permanently finalized.',
  ],
  motivatingProblem: {
    title: 'Network Delay Time (LeetCode #743)',
    description: 'Given a network of n nodes and directed weighted edges times[i] = (u, v, w), return the minimum time it takes for all n nodes to receive a signal sent from node k. If it is impossible, return -1.',
    naiveApproach: 'Exhaustive DFS or BFS exploration without priority queue can revisit nodes an exponential number of times across non-optimal paths: O(V!) or O(V * 2^V).',
    optimalApproach: "Use Dijkstra's algorithm with a Min-Heap: each node is finalized at most once, running in optimal O((V + E) log V) time with O(V + E) space.",
  },
  applicabilityInvariant: 'Dijkstra applies whenever finding the shortest or minimum-cost path from a source in a weighted graph where all edge weights are strictly non-negative (w >= 0).',

  // Module 2: Recognition
  signals: [
    'Finding minimum travel time, latency, or monetary cost in a weighted road or flight network',
    'Edge weights vary (not unweighted or uniformly 1 like BFS)',
    'All weights are non-negative (w >= 0)',
    'Finding path with maximum probability (multiplying probabilities <= 1 reduces monotonically, equivalent to Dijkstra)',
    'Finding path with minimum maximum effort across 2D grid matrix cells',
  ],
  antiSignals: [
    'Graph is unweighted or all edge costs are uniform (use standard BFS in O(V + E) without heap overhead)',
    'Edges have negative weights (Dijkstra breaks because greedy finality is violated; use Bellman-Ford or SPFA instead)',
    'Graph is a Directed Acyclic Graph (DAG) with prerequisites (topological sort relaxation in O(V + E) is faster)',
  ],

  // Module 3: Core Technique
  coreTechniqueTitle: 'Greedy Min-Heap Relaxation Invariant',
  coreTechniqueDescription: 'Maintain a distance array dist initialized to infinity (with dist[src] = 0) and a min-heap of (distance, node) pairs. Repeatedly pop the lowest-distance node and relax all its outgoing neighbors.',
  coreTechniqueSteps: [
    {
      title: 'Step 1: Priority Queue Initialization',
      description: 'Initialize dist array of size N+1 with infinity. Set dist[src] = 0. Push (0, src) into a Min-Heap.',
    },
    {
      title: 'Step 2: Pop Smallest Tentative Distance',
      description: 'Extract (current_dist, u) from the min-heap. If current_dist > dist[u], this entry is stale — discard and continue.',
    },
    {
      title: 'Step 3: Edge Relaxation',
      description: 'For each directed edge (u -> v, weight): if dist[u] + weight < dist[v], update dist[v] = dist[u] + weight and push (dist[v], v) into the min-heap.',
    },
    {
      title: 'Step 4: Answer Extraction',
      description: 'When the heap is empty, max(dist) gives the network delay time. If any node remains at infinity, return -1.',
    },
  ],
  loopInvariant: 'Whenever vertex u is popped from the min-heap with current_dist == dist[u], dist[u] is strictly and permanently the true shortest distance from the source to u.',

  // Module 4: Variations
  variations: [
    {
      id: 'max-probability-path',
      title: 'Maximum Probability Path',
      description: 'Find path from start to end with highest product of probabilities.',
      exampleProblem: 'LeetCode #1514: Path with Maximum Probability',
      keyIdea: 'Use a Max-Heap instead of a Min-Heap. Since probabilities <= 1, multiplication is monotonically non-increasing.',
    },
    {
      id: 'min-effort-grid',
      title: 'Minimum Effort Grid Path',
      description: 'Find path from top-left to bottom-right minimizing the maximum absolute height difference along the path.',
      exampleProblem: 'LeetCode #1631: Path With Minimum Effort',
      keyIdea: 'Dijkstra on 2D grid: relaxation step sets new_effort = max(current_effort, abs(heights[r][c] - heights[nr][nc])).',
    },
    {
      id: 'constrained-stops',
      title: 'Shortest Path with K Stops',
      description: 'Cheapest flight path with at most K intermediate stops.',
      exampleProblem: 'LeetCode #787: Cheapest Flights Within K Stops',
      keyIdea: 'Track stops count in heap state (cost, stops, u) or use Bellman-Ford round-based relaxation to prevent premature pruning.',
    },
  ],

  // Module 5: Code Templates
  pythonTemplate: `import heapq

def dijkstra(n: int, edges: list[list[int]], src: int) -> dict[int, int]:
    # 1. Build adjacency list: u -> list of (v, weight)
    graph = {i: [] for i in range(1, n + 1)}
    for u, v, w in edges:
        graph[u].append((v, w))
        
    # 2. Distances table & min-heap
    dist = {i: float('inf') for i in range(1, n + 1)}
    dist[src] = 0
    pq = [(0, src)]  # (distance, node)
    
    while pq:
        d, u = heapq.heappop(pq)
        
        # Stale entry check
        if d > dist[u]:
            continue
            
        # 3. Relax outgoing edges
        for v, weight in graph[u]:
            new_dist = d + weight
            if new_dist < dist[v]:
                dist[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
                
    return dist`,

  tsTemplate: `function dijkstra(n: number, edges: number[][], src: number): Map<number, number> {
  // 1. Build adjacency list: u -> list of [v, weight]
  const graph = new Map<number, [number, number][]>();
  for (let i = 1; i <= n; i++) graph.set(i, []);
  for (const [u, v, w] of edges) {
    graph.get(u)!.push([v, w]);
  }

  // 2. Distances table
  const dist = new Map<number, number>();
  for (let i = 1; i <= n; i++) dist.set(i, Infinity);
  dist.set(src, 0);

  // Simple priority queue simulation
  const pq: [number, number][] = [[0, src]]; // [distance, node]

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;

    if (d > dist.get(u)!) continue;

    for (const [v, weight] of graph.get(u) || []) {
      const newDist = d + weight;
      if (newDist < dist.get(v)!) {
        dist.set(v, newDist);
        pq.push([newDist, v]);
      }
    }
  }

  return dist;
}`,

  pythonExample: `import heapq

def networkDelayTime(times: list[list[int]], n: int, k: int) -> int:
    graph = {i: [] for i in range(1, n + 1)}
    for u, v, w in times:
        graph[u].append((v, w))
        
    dist = {i: float('inf') for i in range(1, n + 1)}
    dist[k] = 0
    pq = [(0, k)]
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
            
        for v, weight in graph[u]:
            if d + weight < dist[v]:
                dist[v] = d + weight
                heapq.heappush(pq, (d + weight, v))
                
    max_delay = max(dist.values())
    return max_delay if max_delay < float('inf') else -1`,

  tsExample: `function networkDelayTime(times: number[][], n: number, k: number): number {
  const graph = new Map<number, [number, number][]>();
  for (let i = 1; i <= n; i++) graph.set(i, []);
  for (const [u, v, w] of times) {
    graph.get(u)!.push([v, w]);
  }

  const dist = new Map<number, number>();
  for (let i = 1; i <= n; i++) dist.set(i, Infinity);
  dist.set(k, 0);

  const pq: [number, number][] = [[0, k]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;

    if (d > dist.get(u)!) continue;

    for (const [v, weight] of graph.get(u) || []) {
      const newDist = d + weight;
      if (newDist < dist.get(v)!) {
        dist.set(v, newDist);
        pq.push([newDist, v]);
      }
    }
  }

  let maxDelay = 0;
  for (let i = 1; i <= n; i++) {
    const d = dist.get(i)!;
    if (d === Infinity) return -1;
    maxDelay = Math.max(maxDelay, d);
  }
  return maxDelay;
}`,

  pythonBrute: `def networkDelayTimeBrute(times: list[list[int]], n: int, k: int) -> int:
    # Bellman-Ford O(V * E) relaxation
    dist = [float('inf')] * (n + 1)
    dist[k] = 0
    for _ in range(n - 1):
        updated = False
        for u, v, w in times:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break
    max_d = max(dist[1:])
    return max_d if max_d < float('inf') else -1`,

  tsBrute: `function networkDelayTimeBrute(times: number[][], n: number, k: number): number {
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  for (let i = 1; i <= n - 1; i++) {
    let updated = false;
    for (const [u, v, w] of times) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        updated = true;
      }
    }
    if (!updated) break;
  }
  const maxDelay = Math.max(...dist.slice(1));
  return maxDelay === Infinity ? -1 : maxDelay;
}`,

  bruteComplexity: {
    time: 'O(V * E)',
    space: 'O(V)',
    notes: 'Bellman-Ford repeatedly relaxes all E edges V-1 times without priority selection.',
  },
  bruteExplanation: 'Bellman-Ford relaxes all edges without a priority queue in O(V * E) operations, which is slower on dense or non-negative graphs.',

  exampleProblemTitle: 'Network Delay Time (LeetCode #743)',
  exampleProblemDescription: 'Calculate the total time needed for a broadcast signal from node k to reach all nodes in a network of n vertices.',
  codeExplanation: [
    'Graph Representation: Adjacency list maps each node to a list of (neighbor, weight) pairs.',
    'Min-Heap Priority Queue: Stores (tentative_distance, node) tuples to always inspect the closest reachable node next.',
    'Stale Entry Check: If popped distance d > dist[u], a shorter path to u was already discovered and finalized; skip.',
    'Relaxation: If d + weight < dist[v], update dist[v] and push the new tentative distance to the priority queue.',
    'Answer: Once the priority queue is empty, the signal has reached all connected nodes. The time required is max(dist).',
  ],
  complexity: {
    time: 'O((V + E) log V)',
    space: 'O(V + E)',
    notes: 'Using binary heap priority queue. Each edge is relaxed once; each vertex insertion/extraction takes O(log V).',
  },
  pitfalls: [
    'Attempting to run Dijkstra on graphs with negative edge weights (greedy property fails; use Bellman-Ford).',
    'Forgetting the stale entry check if d > dist[u], causing unnecessary edge evaluations on obsolete heap entries.',
    '1-indexed versus 0-indexed vertex numbering off-by-one errors in LeetCode graph problems.',
  ],

  // Module 6: Visualizer
  visualizerTitle: "Dijkstra's Algorithm Visualizer",
  visualizerSubtitle: 'Watch distance values relax greedily as the min-heap expands across weighted edges.',

  // Module 7: Practice Questions
  mappings: [
    { questionId: 743, primaryPattern: 'dijkstras-algorithm', subpattern: 'single-source-shortest-path', subpatternLabel: 'Network Delay Time', learningOrder: 1, reviewStatus: 'verified' },
    { questionId: 1514, primaryPattern: 'dijkstras-algorithm', subpattern: 'max-probability-path', subpatternLabel: 'Max Probability Path', learningOrder: 2, reviewStatus: 'verified' },
    { questionId: 1631, primaryPattern: 'dijkstras-algorithm', subpattern: 'min-effort-grid', subpatternLabel: 'Min Effort Path', learningOrder: 3, reviewStatus: 'verified' },
    { questionId: 787, primaryPattern: 'dijkstras-algorithm', subpattern: 'constrained-stops', subpatternLabel: 'Cheapest Flights K Stops', learningOrder: 4, reviewStatus: 'verified' },
    { questionId: 778, primaryPattern: 'dijkstras-algorithm', subpattern: 'min-effort-grid', subpatternLabel: 'Swim in Rising Water', learningOrder: 5, reviewStatus: 'verified' },
    { questionId: 1368, primaryPattern: 'dijkstras-algorithm', subpattern: 'single-source-shortest-path', subpatternLabel: 'Min Cost Valid Path Grid', learningOrder: 6, reviewStatus: 'verified' },
    { questionId: 1976, primaryPattern: 'dijkstras-algorithm', subpattern: 'single-source-shortest-path', subpatternLabel: 'Ways to Arrive Destination', learningOrder: 7, reviewStatus: 'verified' },
    { questionId: 882, primaryPattern: 'dijkstras-algorithm', subpattern: 'single-source-shortest-path', subpatternLabel: 'Reachable Nodes Subdivided', learningOrder: 8, reviewStatus: 'verified' },
    { questionId: 2642, primaryPattern: 'dijkstras-algorithm', subpattern: 'single-source-shortest-path', subpatternLabel: 'Shortest Path Calculator', learningOrder: 9, reviewStatus: 'verified' },
  ],
  subpatternTabs: [
    { id: 'single-source-shortest-path', label: 'Single-Source Shortest Path' },
    { id: 'max-probability-path', label: 'Max Probability Path' },
    { id: 'min-effort-grid', label: 'Min Effort Grid' },
    { id: 'constrained-stops', label: 'Constrained Stops' },
  ],

  // Module 8: Quiz
  quiz: [
    {
      id: 'dijkstra-q1',
      question: "Why does Dijkstra's algorithm fail when edge weights can be negative?",
      options: [
        { id: 'a', text: 'Because heaps cannot store negative numbers' },
        { id: 'b', text: "Because once a node is popped, Dijkstra marks its shortest distance as finalized, but a subsequent negative edge could offer a cheaper path" },
        { id: 'c', text: 'Because negative edges cause division by zero' },
        { id: 'd', text: 'Because adjacency lists cannot store negative numbers' },
      ],
      correctOptionId: 'b',
      explanation: 'Dijkstra assumes distances are non-decreasing along paths. A negative edge can retroactively reduce the distance to a finalized node, violating the greedy invariant.',
    },
    {
      id: 'dijkstra-q2',
      question: 'What is the optimal time complexity of Dijkstra using a standard binary min-heap priority queue?',
      options: [
        { id: 'a', text: 'O(V²)' },
        { id: 'b', text: 'O((V + E) log V)' },
        { id: 'c', text: 'O(V * E)' },
        { id: 'd', text: 'O(E²)' },
      ],
      correctOptionId: 'b',
      explanation: 'Each vertex is extracted from the min-heap in O(log V) time, and each edge is relaxed at most once with a heap push in O(log V) time, totaling O((V + E) log V).',
    },
    {
      id: 'dijkstra-q3',
      question: 'How can Dijkstra be used to find the path with MAXIMUM probability (LeetCode #1514)?',
      options: [
        { id: 'a', text: 'Invert edge weights to negative numbers and run standard Dijkstra' },
        { id: 'b', text: 'Use a Max-Heap instead of a Min-Heap, because multiplying probabilities between 0 and 1 monotonically decreases values' },
        { id: 'c', text: 'Dijkstra cannot be used for probabilities' },
        { id: 'd', text: 'Add 1 to all probabilities' },
      ],
      correctOptionId: 'b',
      explanation: 'Since edge probabilities satisfy 0 <= p <= 1, multiplying by p produces smaller or equal values (monotonicity holds). Popping the maximum probability node first guarantees finality.',
    },
    {
      id: 'dijkstra-q4',
      question: 'What is the purpose of checking `if d > dist[u]: continue` when popping from the priority queue?',
      options: [
        { id: 'a', text: 'To prevent infinite recursion' },
        { id: 'b', text: 'To skip stale heap entries that were superseded by earlier, shorter relaxations of the same node' },
        { id: 'c', text: 'To check if the graph is disconnected' },
        { id: 'd', text: 'To reset the source node' },
      ],
      correctOptionId: 'b',
      explanation: 'Standard heaps do not support efficient decrease-key operations in O(1). Instead, we push updated distances and ignore older, larger distances when they are eventually popped.',
    },
  ],
};
