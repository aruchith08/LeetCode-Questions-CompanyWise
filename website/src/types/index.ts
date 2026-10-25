export interface Question {
  id: number;
  title: string;
  acceptance: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: number;
  link: string;
}

export interface DifficultyCounts {
  Easy: number;
  Medium: number;
  Hard: number;
}

export interface CompanyMeta {
  slug: string;
  name: string;
  periods: string[];
  questionCount: number;
  difficultyCounts?: DifficultyCounts;
}

export interface CompanyData {
  slug: string;
  name: string;
  periods: Record<string, Question[]>;
}

export interface DataIndex {
  companies: CompanyMeta[];
  totalQuestions: number;
  totalCompanies: number;
  difficultyCounts: DifficultyCounts;
}

export interface GlobalQuestion extends Question {
  companySlugs: string[];
  companyCount: number;
}

export type QuestionStatus = 'solved' | 'attempted' | 'unsolved';

export interface UserProgress {
  solvedQuestions: Record<number, QuestionStatus>;
  bookmarks: number[];
  targetCompanies?: string[];
  recentCompanies: string[];
  recentQuestions: number[];
  recentQuestionTimestamps?: Record<number, string>;
  activityHistory?: Record<string, number>;
  lastUpdated: string;
}

export interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  timestamp: string;
}

export interface LeetCodeAccount {
  username: string;
  realName?: string;
  avatar?: string;
  ranking?: number;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  lastSyncedAt: string;
  recentSubmissions: LeetCodeSubmission[];
  autoSync: boolean;
}

export const PERIOD_LABELS: Record<string, string> = {
  '30days': 'Last 30 Days',
  '3months': 'Last 3 Months',
  '6months': 'Last 6 Months',
  '1year': 'Last 1 Year',
  '2year': 'Last 2 Years',
  'alltime': 'All Time',
};

export const PERIOD_ORDER = ['30days', '3months', '6months', '1year', '2year', 'alltime'];
