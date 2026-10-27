import React, { useMemo } from 'react';
import SlidingWindowVisualizer from './SlidingWindowVisualizer';
import GenericPatternVisualizer from './GenericPatternVisualizer';
import {
  generateHashingSteps,
  generateTwoPointersSteps,
  generatePrefixSumSteps,
  generateBinarySearchSteps,
  generateFastSlowSteps,
  generateStackSteps,
  generateIntervalsSteps,
  generateHeapSteps,
  generateTreeDFSSteps,
  generateTreeBFSSteps,
  generateGraphTraversalSteps,
  generateTopologicalSortSteps,
  generateUnionFindSteps,
  generateBacktrackingSteps,
  generateGreedySteps,
  generateDPSteps,
  generateBitManipulationSteps,
} from '../../utils/visualizerEngines';

interface PatternVisualizerHostProps {
  slug: string;
  title?: string;
  subtitle?: string;
}

export default function PatternVisualizerHost({
  slug,
  title,
  subtitle,
}: PatternVisualizerHostProps) {
  // If sliding window, use the dedicated specialized visualizer
  if (slug === 'sliding-window') {
    return <SlidingWindowVisualizer />;
  }

  // Otherwise, select the appropriate algorithm generator
  const steps = useMemo(() => {
    switch (slug) {
      case 'hashing-and-frequency-counting':
        return generateHashingSteps();
      case 'two-pointers':
        return generateTwoPointersSteps();
      case 'prefix-sum':
        return generatePrefixSumSteps();
      case 'binary-search':
        return generateBinarySearchSteps();
      case 'fast-and-slow-pointers':
        return generateFastSlowSteps();
      case 'stack-and-monotonic-stack':
        return generateStackSteps();
      case 'intervals-and-sweep-line':
        return generateIntervalsSteps();
      case 'heap-top-k':
        return generateHeapSteps();
      case 'tree-dfs':
        return generateTreeDFSSteps();
      case 'tree-bfs':
        return generateTreeBFSSteps();
      case 'graph-traversal':
        return generateGraphTraversalSteps();
      case 'topological-sort':
        return generateTopologicalSortSteps();
      case 'union-find':
        return generateUnionFindSteps();
      case 'backtracking':
        return generateBacktrackingSteps();
      case 'greedy-algorithms':
        return generateGreedySteps();
      case 'dynamic-programming':
        return generateDPSteps();
      case 'bit-manipulation':
        return generateBitManipulationSteps();
      default:
        return generateTwoPointersSteps();
    }
  }, [slug]);

  const defaultTitle = `${title || 'Algorithm'} Visualizer`;
  const defaultSubtitle = subtitle || 'Step-by-step interactive algorithm demonstration with live state transitions.';

  return (
    <GenericPatternVisualizer
      title={defaultTitle}
      subtitle={defaultSubtitle}
      steps={steps}
    />
  );
}
