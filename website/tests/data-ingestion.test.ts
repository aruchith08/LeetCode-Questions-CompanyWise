import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const KNOWN_PERIODS = ['6months', '1year', '2year', 'alltime'];

function parseFilename(filename: string): { company: string; period: string } | null {
  const base = path.basename(filename, '.csv');
  for (const period of KNOWN_PERIODS) {
    if (base.endsWith('_' + period)) {
      const company = base.slice(0, base.length - period.length - 1);
      return { company, period };
    }
  }
  return null;
}

function normalizeDifficulty(val: string): 'Easy' | 'Medium' | 'Hard' {
  const lower = val.trim().toLowerCase();
  if (lower === 'easy') return 'Easy';
  if (lower === 'medium') return 'Medium';
  if (lower === 'hard') return 'Hard';
  return 'Medium';
}

function parseAcceptance(val: string): string {
  if (!val) return '0%';
  const trimmed = val.trim();
  if (trimmed.endsWith('%')) return trimmed;
  const num = parseFloat(trimmed);
  if (!isNaN(num)) return num.toFixed(1) + '%';
  return '0%';
}

function validateLink(link: string): string {
  if (!link) return '';
  const trimmed = link.trim();
  if (trimmed.startsWith('https://leetcode.com/problems/')) return trimmed;
  if (trimmed.startsWith('http://leetcode.com/problems/')) {
    return trimmed.replace('http://', 'https://');
  }
  return '';
}

describe('Data Ingestion & Normalization', () => {
  it('correctly parses company slug and period from filenames', () => {
    expect(parseFilename('amazon_6months.csv')).toEqual({ company: 'amazon', period: '6months' });
    expect(parseFilename('goldman-sachs_1year.csv')).toEqual({ company: 'goldman-sachs', period: '1year' });
    expect(parseFilename('c3-iot_alltime.csv')).toEqual({ company: 'c3-iot', period: 'alltime' });
    expect(parseFilename('apple_2year.csv')).toEqual({ company: 'apple', period: '2year' });
    expect(parseFilename('invalid-file.csv')).toBeNull();
  });

  it('normalizes difficulty values correctly', () => {
    expect(normalizeDifficulty('easy')).toBe('Easy');
    expect(normalizeDifficulty('Easy')).toBe('Easy');
    expect(normalizeDifficulty('medium')).toBe('Medium');
    expect(normalizeDifficulty('HARD')).toBe('Hard');
    expect(normalizeDifficulty('')).toBe('Medium');
  });

  it('normalizes acceptance percentage correctly', () => {
    expect(parseAcceptance('54.3%')).toBe('54.3%');
    expect(parseAcceptance(' 45.6% ')).toBe('45.6%');
    expect(parseAcceptance('72.5')).toBe('72.5%');
    expect(parseAcceptance('')).toBe('0%');
  });

  it('validates and secures LeetCode problem URLs', () => {
    expect(validateLink('https://leetcode.com/problems/two-sum')).toBe('https://leetcode.com/problems/two-sum');
    expect(validateLink(' https://leetcode.com/problems/two-sum ')).toBe('https://leetcode.com/problems/two-sum');
    expect(validateLink('http://leetcode.com/problems/two-sum')).toBe('https://leetcode.com/problems/two-sum');
    expect(validateLink('https://google.com')).toBe('');
    expect(validateLink('')).toBe('');
  });

  it('confirms every discovered CSV file has been processed in report.json', () => {
    const reportPath = path.resolve(__dirname, '../public/data/report.json');
    expect(fs.existsSync(reportPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    expect(report.totalFiles).toBe(1112);
    expect(report.totalFilesProcessed).toBe(1112);
    expect(report.totalFilesSkipped).toBe(0);
    expect(report.uniqueCompanies).toBe(490);
    expect(report.uniqueQuestions).toBe(3411);
    expect(report.totalValidRecords).toBe(38825);
    expect(report.errors.length).toBe(0);
  });

  it('verifies generated data index and questions integrity', () => {
    const indexPath = path.resolve(__dirname, '../public/data/index.json');
    const questionsPath = path.resolve(__dirname, '../public/data/questions.json');

    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

    expect(index.totalCompanies).toBe(490);
    expect(index.totalQuestions).toBe(3411);
    expect(questions.length).toBe(3411);

    // Verify difficulty sum matches total
    const sumDiff = index.difficultyCounts.Easy + index.difficultyCounts.Medium + index.difficultyCounts.Hard;
    expect(sumDiff).toBe(3411);

    // Check random question has valid fields
    const sample = questions[0];
    expect(sample.id).toBeGreaterThan(0);
    expect(sample.title.length).toBeGreaterThan(0);
    expect(['Easy', 'Medium', 'Hard']).toContain(sample.difficulty);
    expect(sample.link).toMatch(/^https:\/\/leetcode\.com\/problems\//);
    expect(sample.companySlugs.length).toBeGreaterThan(0);
  });
});
