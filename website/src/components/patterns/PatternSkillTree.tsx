import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  GitFork,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  BookOpen,
} from 'lucide-react';
import type { PatternLevel } from '../../types/patterns';
import PatternIcon from './PatternIcon';
import { useProgress } from '../../hooks/useProgress';

export interface SkillNode {
  slug: string;
  title: string;
  level: PatternLevel;
  category: 'Linear & Sequences' | 'Trees & Graphs' | 'Optimization & States';
  prerequisites: string[]; // slugs of prerequisite patterns
  unlocks: string[]; // slugs of patterns this unlocks
  summary: string;
  keyInvariant: string;
}

export const SKILL_NODES: SkillNode[] = [
  // Linear & Sequences Trail (7)
  {
    slug: 'hashing-and-frequency-counting',
    title: 'Hashing & Frequency Counting',
    level: 'Foundation',
    category: 'Linear & Sequences',
    prerequisites: [],
    unlocks: ['two-pointers', 'prefix-sum', 'sliding-window'],
    summary: 'The universal building block: O(1) state lookup tables and frequency histograms.',
    keyInvariant: 'Hash map stores seen elements to convert O(N^2) scans into O(1) lookups.',
  },
  {
    slug: 'two-pointers',
    title: 'Two Pointers',
    level: 'Foundation',
    category: 'Linear & Sequences',
    prerequisites: ['hashing-and-frequency-counting'],
    unlocks: ['sliding-window', 'fast-and-slow-pointers'],
    summary: 'Squeeze search boundaries inward or walk pointers symmetrically to prune candidate spaces.',
    keyInvariant: 'Monotonic boundary values guarantee target lies strictly between active pointers.',
  },
  {
    slug: 'sliding-window',
    title: 'Sliding Window',
    level: 'Foundation',
    category: 'Linear & Sequences',
    prerequisites: ['two-pointers'],
    unlocks: ['intervals-and-sweep-line'],
    summary: 'Expand right to explore, shrink left to satisfy constraints over contiguous slices.',
    keyInvariant: 'Window [L, R] validity is monotonic with respect to pointer movement.',
  },
  {
    slug: 'prefix-sum',
    title: 'Prefix Sum',
    level: 'Foundation',
    category: 'Linear & Sequences',
    prerequisites: ['hashing-and-frequency-counting'],
    unlocks: [],
    summary: 'Precompute cumulative running totals to answer range sum queries in O(1).',
    keyInvariant: 'Range sum(i, j) = prefix[j] - prefix[i - 1].',
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    level: 'Foundation',
    category: 'Linear & Sequences',
    prerequisites: ['two-pointers'],
    unlocks: ['heap-top-k'],
    summary: 'Eliminate half the candidate space per step over sorted arrays or monotonic answer spaces.',
    keyInvariant: 'Target or optimal threshold is guaranteed to remain inside [low, high].',
  },
  {
    slug: 'fast-and-slow-pointers',
    title: 'Fast & Slow Pointers',
    level: 'Foundation',
    category: 'Linear & Sequences',
    prerequisites: ['two-pointers'],
    unlocks: [],
    summary: "Floyd's cycle detection and midpoint traversal in linked lists with O(1) space.",
    keyInvariant: 'Relative distance between fast and slow pointers shrinks by 1 each iteration.',
  },
  {
    slug: 'stack-and-monotonic-stack',
    title: 'Stack & Monotonic Stack',
    level: 'Intermediate',
    category: 'Linear & Sequences',
    prerequisites: ['hashing-and-frequency-counting'],
    unlocks: [],
    summary: 'Maintain strictly increasing or decreasing sequences to resolve nearest dominant boundaries.',
    keyInvariant: 'Stack invariants guarantee elements wait in order until popped by a boundary element.',
  },
  {
    slug: 'intervals-and-sweep-line',
    title: 'Intervals & Sweep Line',
    level: 'Intermediate',
    category: 'Linear & Sequences',
    prerequisites: ['sliding-window'],
    unlocks: [],
    summary: 'Sort by start time and sweep along the chronological timeline to detect overlaps.',
    keyInvariant: 'Two sorted intervals [s1, e1] and [s2, e2] overlap if and only if s2 <= e1.',
  },

  // Trees & Graphs Trail (7)
  {
    slug: 'tree-dfs',
    title: 'Tree DFS',
    level: 'Intermediate',
    category: 'Trees & Graphs',
    prerequisites: [],
    unlocks: ['tree-bfs', 'graph-traversal', 'trie-prefix-tree', 'backtracking'],
    summary: 'Recursive post-order subtree aggregations, ancestry pathing, and bottom-up evaluations.',
    keyInvariant: 'Subtree results from children are computed before combining at root apex.',
  },
  {
    slug: 'trie-prefix-tree',
    title: 'Tries (Prefix Trees)',
    level: 'Intermediate',
    category: 'Trees & Graphs',
    prerequisites: ['tree-dfs'],
    unlocks: [],
    summary: 'Branching character tree for O(L) autocomplete, prefix queries, and Boggle word searches.',
    keyInvariant: 'Every node at depth d uniquely represents the prefix formed from root to that node.',
  },
  {
    slug: 'tree-bfs',
    title: 'Tree BFS',
    level: 'Intermediate',
    category: 'Trees & Graphs',
    prerequisites: ['tree-dfs'],
    unlocks: ['graph-traversal'],
    summary: 'Level-by-level queue snapshot processing for horizontal tiers and unweighted shortest paths.',
    keyInvariant: 'Queue length snapshot processes all nodes at depth d before depth d+1 begins.',
  },
  {
    slug: 'graph-traversal',
    title: 'Graph Traversal (DFS/BFS)',
    level: 'Intermediate',
    category: 'Trees & Graphs',
    prerequisites: ['tree-dfs'],
    unlocks: ['topological-sort', 'union-find', 'dijkstras-algorithm'],
    summary: 'Traverse arbitrary cycles and matrix grids using visited sets and queue waves.',
    keyInvariant: 'BFS queue guarantees visiting nodes in non-decreasing order of distance.',
  },
  {
    slug: 'dijkstras-algorithm',
    title: "Dijkstra's Shortest Path",
    level: 'Advanced',
    category: 'Trees & Graphs',
    prerequisites: ['graph-traversal', 'heap-top-k'],
    unlocks: [],
    summary: 'Greedy shortest path in non-negative weighted graphs via min-heap edge relaxation.',
    keyInvariant: 'Popping the minimum tentative distance guarantees the node shortest path is finalized.',
  },
  {
    slug: 'topological-sort',
    title: 'Topological Sort',
    level: 'Intermediate',
    category: 'Trees & Graphs',
    prerequisites: ['graph-traversal'],
    unlocks: [],
    summary: "Order DAG vertices respecting prerequisite constraints using Kahn's in-degree queue.",
    keyInvariant: 'Nodes are processed only when all prerequisite dependencies reach in-degree 0.',
  },
  {
    slug: 'union-find',
    title: 'Union Find (Disjoint Set)',
    level: 'Advanced',
    category: 'Trees & Graphs',
    prerequisites: ['graph-traversal'],
    unlocks: [],
    summary: 'Disjoint-set forest with path compression and rank union for dynamic connectivity.',
    keyInvariant: 'find(u) === find(v) if and only if u and v share the exact same root ancestor.',
  },

  // Optimization & States Trail (5)
  {
    slug: 'heap-top-k',
    title: 'Heap / Top K',
    level: 'Intermediate',
    category: 'Optimization & States',
    prerequisites: ['binary-search'],
    unlocks: [],
    summary: 'Dynamically retrieve minimum or maximum element in O(1) time and O(log K) updates.',
    keyInvariant: 'Root of binary heap is always the minimum (or maximum) of all elements.',
  },
  {
    slug: 'backtracking',
    title: 'Backtracking',
    level: 'Advanced',
    category: 'Optimization & States',
    prerequisites: ['tree-dfs'],
    unlocks: ['dynamic-programming'],
    summary: 'Choose, explore recursively down the decision branch, and un-choose to traverse search spaces.',
    keyInvariant: 'Path state maintains the exact sequence of choices from tree root.',
  },
  {
    slug: 'greedy-algorithms',
    title: 'Greedy Algorithms',
    level: 'Advanced',
    category: 'Optimization & States',
    prerequisites: ['dynamic-programming'],
    unlocks: [],
    summary: 'Make the provably optimal local choice at each step without backtracking.',
    keyInvariant: 'Exchange argument proves local best choice preserves global optimum.',
  },
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    level: 'Advanced',
    category: 'Optimization & States',
    prerequisites: ['backtracking'],
    unlocks: ['greedy-algorithms'],
    summary: 'Memoize or tabulate state transitions to solve overlapping subproblems in polynomial time.',
    keyInvariant: 'dp[state] stores the mathematically verified optimal subproblem solution.',
  },
  {
    slug: 'bit-manipulation',
    title: 'Bit Manipulation',
    level: 'Advanced',
    category: 'Optimization & States',
    prerequisites: [],
    unlocks: [],
    summary: 'Exploit binary boolean algebra, mask bit flags, and XOR cancellation in O(1) space.',
    keyInvariant: 'XOR is commutative and self-cancelling: x ^ x = 0, x ^ 0 = x.',
  },
];

export default function PatternSkillTree() {
  const { getStatus } = useProgress();
  const [selectedSlug, setSelectedSlug] = useState<string>('sliding-window');

  const selectedNode = useMemo(() => {
    return SKILL_NODES.find(n => n.slug === selectedSlug) || SKILL_NODES[0];
  }, [selectedSlug]);

  const categoryGroups = useMemo(() => {
    const groups: Record<string, SkillNode[]> = {
      'Linear & Sequences': [],
      'Trees & Graphs': [],
      'Optimization & States': [],
    };
    for (const node of SKILL_NODES) {
      if (groups[node.category]) {
        groups[node.category].push(node);
      }
    }
    return groups;
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F1B3D]/10 dark:bg-[#D97757]/15 border border-[#0F1B3D]/15 dark:border-[#D97757]/30 flex items-center justify-center text-[#0F1B3D] dark:text-[#D97757] shrink-0">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#FAF9F5] tracking-tight">
              Prerequisites & Pattern Skill Tree
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#A8A69C]">
              Understand how patterns build upon each other. Click any node to inspect upstream prerequisites and downstream unlocks.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500 dark:text-[#A8A69C] self-start md:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Foundation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Intermediate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Advanced</span>
          </div>
        </div>
      </div>

      {/* Main Graph & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Tracks & Node Graph (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {Object.entries(categoryGroups).map(([category, nodes]) => (
            <div
              key={category}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-2xs space-y-3.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#43433F]/60">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-[#A8A69C]">
                  {category} Trail
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  {nodes.length} patterns
                </span>
              </div>

              {/* Node Pills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {nodes.map(node => {
                  const isSelected = selectedSlug === node.slug;
                  const isPrereqOfSelected = selectedNode.prerequisites.includes(node.slug);
                  const isUnlockedBySelected = selectedNode.unlocks.includes(node.slug);

                  // Border and background state based on selection relation
                  let badgeStyle = 'bg-slate-50 dark:bg-[#1F1E1D] border-slate-200/80 dark:border-[#43433F]/70 text-slate-700 dark:text-[#FAF9F5]';
                  if (isSelected) {
                    badgeStyle = 'bg-[#0F1B3D] text-white dark:bg-[#D97757] dark:text-[#1F1E1D] border-[#0F1B3D] dark:border-[#D97757] shadow-md scale-[1.02]';
                  } else if (isPrereqOfSelected) {
                    badgeStyle = 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 ring-1 ring-amber-300/60';
                  } else if (isUnlockedBySelected) {
                    badgeStyle = 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700/60 text-purple-900 dark:text-purple-300 ring-1 ring-purple-300/60';
                  }

                  return (
                    <button
                      key={node.slug}
                      type="button"
                      onClick={() => setSelectedSlug(node.slug)}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 ${badgeStyle}`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xs font-bold leading-snug">
                          {node.title}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white/20 text-white dark:bg-[#1F1E1D]/20 dark:text-[#1F1E1D]'
                              : node.level === 'Foundation'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                              : node.level === 'Intermediate'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
                          }`}
                        >
                          {node.level[0]}
                        </span>
                      </div>

                      {/* Relationship Pill */}
                      <div className="flex items-center justify-between text-[10px]">
                        {isPrereqOfSelected ? (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                            <span>▲ Prerequisite</span>
                          </span>
                        ) : isUnlockedBySelected ? (
                          <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                            <span>▼ Unlocked</span>
                          </span>
                        ) : isSelected ? (
                          <span className="font-mono text-[10px] opacity-80">Active Selected</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-[#8E8C82]">
                            {node.prerequisites.length > 0
                              ? `${node.prerequisites.length} prereq`
                              : 'Entry point'}
                          </span>
                        )}

                        {node.unlocks.length > 0 && !isSelected && (
                          <span className="text-[10px] text-slate-400 dark:text-[#8E8C82] font-mono">
                            → {node.unlocks.length}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Active Node Inspector Card (4 cols) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] shadow-lg space-y-4 animate-fade-in">
            {/* Title & Level */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-[#1F1E1D] dark:text-[#A8A69C]">
                  {selectedNode.category}
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {selectedNode.level}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#FAF9F5]">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A8A69C] mt-1.5 leading-relaxed">
                {selectedNode.summary}
              </p>
            </div>

            {/* Loop / Core Invariant */}
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-[#262420] border border-amber-200/70 dark:border-amber-900/40 space-y-1 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-400 block">
                The Foundational Invariant:
              </span>
              <p className="text-slate-700 dark:text-[#E2DFD8] font-mono text-[11px] leading-relaxed">
                {selectedNode.keyInvariant}
              </p>
            </div>

            {/* Direct Prerequisites */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#43433F]/60">
              <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5] block">
                Upstream Prerequisites ({selectedNode.prerequisites.length}):
              </span>
              {selectedNode.prerequisites.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-[#8E8C82] italic">
                  None — this is a foundational entry point.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.prerequisites.map(prereqSlug => {
                    const prereq = SKILL_NODES.find(n => n.slug === prereqSlug);
                    return (
                      <button
                        key={prereqSlug}
                        type="button"
                        onClick={() => setSelectedSlug(prereqSlug)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/40 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        ▲ {prereq?.title || prereqSlug}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Downstream Unlocks */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#43433F]/60">
              <span className="text-xs font-bold text-slate-900 dark:text-[#FAF9F5] block">
                Downstream Patterns Unlocked ({selectedNode.unlocks.length}):
              </span>
              {selectedNode.unlocks.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-[#8E8C82] italic">
                  Advanced capstone pattern in this branch.
                </p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.unlocks.map(unlockSlug => {
                    const unlock = SKILL_NODES.find(n => n.slug === unlockSlug);
                    return (
                      <button
                        key={unlockSlug}
                        type="button"
                        onClick={() => setSelectedSlug(unlockSlug)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/80 dark:border-purple-900/40 hover:bg-purple-100 transition-colors cursor-pointer"
                      >
                        ▼ {unlock?.title || unlockSlug}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CTA Link to Pattern Track */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#43433F]/60">
              <Link
                to={`/patterns/${selectedNode.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] transition-colors shadow-xs"
              >
                <span>Enter {selectedNode.title} Track</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
