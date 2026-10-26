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
  questionCount: number;
  subpatternCount?: number;
  prerequisites?: string[];
  companiesTop?: string[];
  tags: string[];
}

export interface PatternQuestion {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subpattern: SlidingWindowSubcategory;
  subpatternLabel: string;
  link: string;
  acceptance: string;
  companies: string[];
  frequency: number;
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
