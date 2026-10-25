import { describe, it, expect } from 'vitest';
import type { Question, GlobalQuestion } from '../src/types';

const mockQuestions: GlobalQuestion[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: '49.5%',
    frequency: 4.5,
    link: 'https://leetcode.com/problems/two-sum',
    companySlugs: ['amazon', 'google', 'apple'],
    companyCount: 3,
  },
  {
    id: 200,
    title: 'Number of Islands',
    difficulty: 'Medium',
    acceptance: '56.2%',
    frequency: 3.8,
    link: 'https://leetcode.com/problems/number-of-islands',
    companySlugs: ['amazon', 'microsoft'],
    companyCount: 2,
  },
  {
    id: 42,
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    acceptance: '58.9%',
    frequency: 4.8,
    link: 'https://leetcode.com/problems/trapping-rain-water',
    companySlugs: ['google', 'bloomberg'],
    companyCount: 2,
  },
  {
    id: 20,
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    acceptance: '40.3%',
    frequency: 3.2,
    link: 'https://leetcode.com/problems/valid-parentheses',
    companySlugs: ['facebook'],
    companyCount: 1,
  },
];

describe('Search & Filtering Operations', () => {
  it('filters by query string matching title or ID', () => {
    const titleMatch = mockQuestions.filter(q =>
      q.title.toLowerCase().includes('islands') || q.id.toString().includes('islands')
    );
    expect(titleMatch.length).toBe(1);
    expect(titleMatch[0].id).toBe(200);

    const idMatch = mockQuestions.filter(q =>
      q.title.toLowerCase().includes('42') || q.id.toString().includes('42')
    );
    expect(idMatch.length).toBe(1);
    expect(idMatch[0].title).toBe('Trapping Rain Water');
  });

  it('filters by difficulty accurately', () => {
    const easy = mockQuestions.filter(q => q.difficulty === 'Easy');
    expect(easy.length).toBe(2);

    const medium = mockQuestions.filter(q => q.difficulty === 'Medium');
    expect(medium.length).toBe(1);

    const hard = mockQuestions.filter(q => q.difficulty === 'Hard');
    expect(hard.length).toBe(1);
  });

  it('filters questions by company slug', () => {
    const amazonQuestions = mockQuestions.filter(q => q.companySlugs.includes('amazon'));
    expect(amazonQuestions.length).toBe(2);
    expect(amazonQuestions.map(q => q.id)).toContain(1);
    expect(amazonQuestions.map(q => q.id)).toContain(200);

    const googleQuestions = mockQuestions.filter(q => q.companySlugs.includes('google'));
    expect(googleQuestions.length).toBe(2);
    expect(googleQuestions.map(q => q.id)).toContain(1);
    expect(googleQuestions.map(q => q.id)).toContain(42);
  });

  it('sorts questions correctly by frequency descending', () => {
    const sorted = [...mockQuestions].sort((a, b) => b.frequency - a.frequency);
    expect(sorted[0].id).toBe(42); // 4.8
    expect(sorted[1].id).toBe(1);  // 4.5
    expect(sorted[2].id).toBe(200); // 3.8
    expect(sorted[3].id).toBe(20); // 3.2
  });

  it('sorts questions correctly by company count descending', () => {
    const sorted = [...mockQuestions].sort((a, b) => b.companyCount - a.companyCount);
    expect(sorted[0].id).toBe(1); // 3 companies
    expect(sorted[3].id).toBe(20); // 1 company
  });
});
