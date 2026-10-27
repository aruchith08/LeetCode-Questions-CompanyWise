export type PatternLevel = 'Foundation' | 'Intermediate' | 'Advanced';
export type PatternAvailability = 'available' | 'upcoming';

export type SlidingWindowSubcategory = 
  | 'fixed-window' 
  | 'variable-window' 
  | 'frequency-window' 
  | 'advanced-window';

export interface DSAPattern {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  level: PatternLevel;
  availability: PatternAvailability;
  category: string;
  questionCount?: number;
  subpatternCount?: number;
  prerequisites?: string[];
  companiesTop?: string[];
  tags: string[];
}

export interface PatternQuestionMapping {
  questionId: number;
  primaryPattern: string;
  secondaryPatterns?: string[];
  subpattern: SlidingWindowSubcategory | string;
  subpatternLabel: string;
  learningOrder: number;
  reviewStatus: 'verified' | 'needs-review';
}

export interface PatternQuestion {
  id: number;
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  subpattern: SlidingWindowSubcategory | string;
  subpatternLabel: string;
  link: string;
  acceptance: string;
  companies: string[];
  companySlugs?: string[];
  companyCount?: number;
  frequency?: number;
  learningOrder?: number;
  reviewStatus?: 'verified' | 'needs-review';
  isCatalogAvailable?: boolean;
}

export interface VisualizerStep {
  stepNumber: number;
  title: string;
  windowIndices: number[]; // e.g. [0, 1, 2, 3]
  windowElements: number[];
  currentSum: number;
  currentAverage: number;
  bestAverageSoFar: number;
  addedElement: { index: number; value: number } | null;
  removedElement: { index: number; value: number } | null;
  explanation: string;
  formula: string;
}

export interface GenericVisualizerStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  highlightIndices?: number[];
  activePointers?: { name: string; index: number; color?: 'emerald' | 'rose' | 'blue' | 'amber' | 'purple' | 'indigo' }[];
  elements?: (string | number)[];
  metrics?: { label: string; value: string | number }[];
  statusBadge?: { label: string; variant: 'success' | 'warning' | 'info' | 'danger' };
  auxiliaryData?: Record<string, any>;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface PatternVariation {
  id: string;
  title: string;
  description: string;
  exampleProblem: string;
  keyIdea: string;
}

export interface PatternLearningContent {
  slug: string;
  title: string;
  level: PatternLevel;
  category: string;
  prerequisites: string[];
  companiesTop: string[];
  
  // Module 1: Intro
  introTitle: string;
  introDescription: string[];
  motivatingProblem: {
    title: string;
    description: string;
    naiveApproach: string;
    optimalApproach: string;
  };
  applicabilityInvariant: string;

  // Module 2: Recognition
  signals: string[];
  antiSignals: string[];

  // Module 3: Core Technique
  coreTechniqueTitle: string;
  coreTechniqueDescription: string;
  coreTechniqueSteps: {
    title: string;
    description: string;
  }[];
  loopInvariant: string;

  // Module 4: Variations
  variations: PatternVariation[];

  // Module 5: Code Implementation
  pythonTemplate: string;
  tsTemplate: string;
  pythonExample: string;
  tsExample: string;
  pythonBrute?: string;
  tsBrute?: string;
  bruteComplexity?: {
    time: string;
    space: string;
    notes?: string;
  };
  bruteExplanation?: string;
  exampleProblemTitle: string;
  exampleProblemDescription: string;
  codeExplanation: string[];
  complexity: {
    time: string;
    space: string;
    notes: string;
  };
  pitfalls: string[];

  // Module 6: Visualizer
  visualizerTitle: string;
  visualizerSubtitle: string;

  // Module 7: Practice Questions
  mappings: PatternQuestionMapping[];
  subpatternTabs: { id: string; label: string }[];

  // Module 8: Quiz
  quiz: QuizQuestion[];
}
