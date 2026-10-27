import React from 'react';
import {
  Hash,
  Sigma,
  ScanSearch,
  FastForward,
  Layers,
  Network,
  Workflow,
  Undo2,
  Target,
  Grid3X3,
  Binary,
  Link2,
  SortAsc,
  Type,
  Calculator,
  ArrowRightToLine,
  RotateCcw,
  Code2,
  type LucideProps,
} from 'lucide-react';

export interface PatternIconProps {
  /** Pattern slug, identifier or topic name (e.g. 'hashing-and-frequency-counting', 'two-pointers') */
  slug?: string;
  /** Optional pattern title or topic string (fallback normalization) */
  name?: string;
  /** Size in pixels or number (default: inherited or 20) */
  size?: number | string;
  /** Tailwind class for sizing and styling */
  className?: string;
  /** Custom stroke width (defaults to 2 to match Lucide standard) */
  strokeWidth?: number | string;
  /** Accessible title or label */
  title?: string;
}

/* ============================================================================
 * Specialized Algorithmic SVG Icons (Lucide 24x24, stroke="currentColor" style)
 * ============================================================================ */

interface CustomIconProps extends LucideProps {
  className?: string;
  strokeWidth?: number | string;
}

/** Two Pointers: Opposing pointers traversing an array inward */
function TwoPointersIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M7 8L3 12l4 4" />
      <path d="M17 8l4 4-4 4" />
      <circle cx="3" cy="12" r="1.5" fill="currentColor" />
      <circle cx="21" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** Sliding Window: Contiguous sub-array bracketed window frame */
function SlidingWindowIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Background array cells */}
      <rect x="2" y="7" width="20" height="10" rx="2" strokeWidth={1.5} opacity={0.35} />
      <line x1="6.5" y1="7" x2="6.5" y2="17" strokeWidth={1.5} opacity={0.35} />
      <line x1="11" y1="7" x2="11" y2="17" strokeWidth={1.5} opacity={0.35} />
      <line x1="15.5" y1="7" x2="15.5" y2="17" strokeWidth={1.5} opacity={0.35} />
      {/* Active sliding window frame */}
      <rect x="6.5" y="4.5" width="9" height="15" rx="2" strokeWidth={strokeWidth} />
      <line x1="9.5" y1="12" x2="12.5" y2="12" strokeWidth={strokeWidth} />
    </svg>
  );
}

/** Intervals & Sweep Line: Overlapping horizontal segments with vertical sweep line */
function IntervalsSweepLineIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Vertical sweep line */}
      <line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" strokeWidth={1.5} opacity={0.5} />
      {/* Overlapping intervals */}
      <rect x="3" y="4.5" width="10" height="3" rx="1.5" />
      <rect x="8" y="10.5" width="13" height="3" rx="1.5" />
      <rect x="4" y="16.5" width="11" height="3" rx="1.5" />
    </svg>
  );
}

/** Heap / Top K: Complete binary heap tree with root and priority layers */
function HeapTopKIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="4" r="2.2" />
      <line x1="10.2" y1="5.8" x2="6.8" y2="9.5" />
      <line x1="13.8" y1="5.8" x2="17.2" y2="9.5" />
      <circle cx="6" cy="11.5" r="2" />
      <circle cx="18" cy="11.5" r="2" />
      <line x1="4.8" y1="13.2" x2="3.2" y2="16.8" />
      <line x1="7.2" y1="13.2" x2="8.8" y2="16.8" />
      <line x1="16.8" y1="13.2" x2="15.2" y2="16.8" />
      <line x1="19.2" y1="13.2" x2="20.8" y2="16.8" />
      <circle cx="3" cy="18.5" r="1.5" />
      <circle cx="9" cy="18.5" r="1.5" />
      <circle cx="15" cy="18.5" r="1.5" />
      <circle cx="21" cy="18.5" r="1.5" />
    </svg>
  );
}

/** Tree DFS: Hierarchical binary tree with deep traversal path descent */
function TreeDFSIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="4" r="2.2" />
      {/* Primary DFS branch traversed deeply */}
      <line x1="10.5" y1="5.8" x2="6.5" y2="10" strokeWidth={2.5} />
      <circle cx="6" cy="12" r="2.2" strokeWidth={2.5} />
      <line x1="5" y1="14" x2="3.5" y2="18" strokeWidth={2.5} />
      <circle cx="3" cy="20" r="2" strokeWidth={2.5} />
      {/* Subtree branches */}
      <line x1="13.5" y1="5.8" x2="17.5" y2="10" opacity={0.35} />
      <circle cx="18" cy="12" r="2" opacity={0.35} />
      <line x1="7.2" y1="14" x2="8.8" y2="18" opacity={0.35} />
      <circle cx="9" cy="20" r="1.5" opacity={0.35} />
    </svg>
  );
}

/** Tree BFS: Hierarchical binary tree with horizontal level-by-level traversal */
function TreeBFSIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Horizontal level scan line */}
      <path d="M2 12h20" strokeDasharray="2 2" strokeWidth={1.5} opacity={0.4} />
      <circle cx="12" cy="4" r="2" />
      <line x1="10.5" y1="5.8" x2="6.5" y2="10" />
      <line x1="13.5" y1="5.8" x2="17.5" y2="10" />
      {/* Traversed level nodes */}
      <circle cx="6" cy="12" r="2.3" strokeWidth={2.5} />
      <circle cx="18" cy="12" r="2.3" strokeWidth={2.5} />
      {/* Next level branches */}
      <line x1="5.2" y1="14" x2="3.8" y2="17.8" opacity={0.35} />
      <line x1="18.8" y1="14" x2="20.2" y2="17.8" opacity={0.35} />
      <circle cx="3.5" cy="19.5" r="1.5" opacity={0.35} />
      <circle cx="20.5" cy="19.5" r="1.5" opacity={0.35} />
    </svg>
  );
}

/** Union Find: Disjoint set clusters being linked via union operation */
function UnionFindIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Cluster 1 */}
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <line x1="5" y1="8.5" x2="5" y2="15.5" />
      {/* Cluster 2 */}
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <line x1="19" y1="8.5" x2="19" y2="15.5" />
      {/* Dynamic connectivity union bridge */}
      <path d="M7.5 12h9" strokeDasharray="2 2" strokeWidth={2} />
      <path d="M13.5 9.5l3 2.5-3 2.5" />
    </svg>
  );
}

/** Arrays: Contiguous memory cell row */
function ArrayCellsIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <line x1="7" y1="7" x2="7" y2="17" />
      <line x1="12" y1="7" x2="12" y2="17" />
      <line x1="17" y1="7" x2="17" y2="17" />
    </svg>
  );
}

/** Trie: Prefix character tree branching */
function TrieIcon({ className, strokeWidth = 2, ...props }: CustomIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="4" r="2" />
      <line x1="10.5" y1="5.5" x2="6" y2="10" />
      <line x1="12" y1="6" x2="12" y2="10" />
      <line x1="13.5" y1="5.5" x2="18" y2="10" />
      <circle cx="6" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18" cy="12" r="2" />
      <line x1="6" y1="14" x2="4" y2="18" />
      <line x1="6" y1="14" x2="8" y2="18" />
      <circle cx="4" cy="20" r="1.5" />
      <circle cx="8" cy="20" r="1.5" />
    </svg>
  );
}

/* ============================================================================
 * Centralized Icon Mapping Registry
 * ============================================================================ */

type IconRenderer = React.ComponentType<LucideProps>;

/**
 * Normalizes pattern/topic slug for reliable lookup.
 */
export function normalizePatternSlug(raw?: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Master mapping for all 18 DSA patterns plus common DSA topics and aliases.
 */
export const PATTERN_ICON_MAP: Record<string, IconRenderer> = {
  // === 18 Core DSA Patterns ===
  'hashing-and-frequency-counting': Hash,
  'two-pointers': TwoPointersIcon,
  'sliding-window': SlidingWindowIcon,
  'prefix-sum': Sigma,
  'binary-search': ScanSearch,
  'fast-and-slow-pointers': FastForward,
  'stack-and-monotonic-stack': Layers,
  'intervals-and-sweep-line': IntervalsSweepLineIcon,
  'heap-top-k': HeapTopKIcon,
  'tree-dfs': TreeDFSIcon,
  'tree-bfs': TreeBFSIcon,
  'graph-traversal': Network,
  'topological-sort': Workflow,
  'union-find': UnionFindIcon,
  'backtracking': Undo2,
  'greedy-algorithms': Target,
  'dynamic-programming': Grid3X3,
  'bit-manipulation': Binary,

  // === Common Pattern Aliases ===
  'hashing': Hash,
  'hash-table': Hash,
  'hash-map': Hash,
  'frequency-counting': Hash,
  '2-pointers': TwoPointersIcon,
  'monotonic-stack': Layers,
  'stack': Layers,
  'stacks': Layers,
  'intervals': IntervalsSweepLineIcon,
  'sweep-line': IntervalsSweepLineIcon,
  'heap': HeapTopKIcon,
  'priority-queue': HeapTopKIcon,
  'top-k': HeapTopKIcon,
  'min-heap': HeapTopKIcon,
  'max-heap': HeapTopKIcon,
  'trees-dfs': TreeDFSIcon,
  'trees-bfs': TreeBFSIcon,
  'dfs': TreeDFSIcon,
  'bfs': TreeBFSIcon,
  'graph': Network,
  'graphs': Network,
  'topo-sort': Workflow,
  'dag': Workflow,
  'disjoint-set': UnionFindIcon,
  'dsu': UnionFindIcon,
  'backtrack': Undo2,
  'greedy': Target,
  'dp': Grid3X3,
  'memoization': Grid3X3,
  'bitwise': Binary,
  'bits': Binary,

  // === General DSA Topics ===
  'arrays': ArrayCellsIcon,
  'array': ArrayCellsIcon,
  'strings': Type,
  'string': Type,
  'linked-lists': Link2,
  'linked-list': Link2,
  'queue': ArrowRightToLine,
  'queues': ArrowRightToLine,
  'sorting': SortAsc,
  'sort': SortAsc,
  'matrix': Grid3X3,
  'grid': Grid3X3,
  'math': Calculator,
  'number-theory': Calculator,
  'recursion': RotateCcw,
  'trie': TrieIcon,
  'prefix-tree': TrieIcon,
};

/**
 * Returns whether a pattern slug or alias has a dedicated concept icon in the registry.
 */
export function hasPatternIcon(slug?: string): boolean {
  const normalized = normalizePatternSlug(slug);
  return Boolean(PATTERN_ICON_MAP[normalized]);
}

/**
 * Centralized PatternIcon Component
 * Renders a visually meaningful DSA algorithm/data structure icon with consistent
 * stroke, geometry, and light/dark theme responsiveness.
 */
export default function PatternIcon({
  slug,
  name,
  size,
  className = 'w-5 h-5',
  strokeWidth = 2,
  title,
}: PatternIconProps) {
  const normalizedKey = normalizePatternSlug(slug || name);
  const IconComponent = PATTERN_ICON_MAP[normalizedKey] || Code2;

  // Render the icon with custom or inherited styles
  return (
    <span
      className="inline-flex items-center justify-center shrink-0"
      style={size ? { width: size, height: size } : undefined}
      title={title || name || slug}
    >
      <IconComponent className={className} strokeWidth={strokeWidth} />
    </span>
  );
}
