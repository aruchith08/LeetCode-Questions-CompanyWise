import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Sliding Window Educational Notes & Algorithmic Distinctions', () => {
  const notesPath = path.resolve(__dirname, '../../docs/research/sliding-window-notes.md');
  const lessonPath = path.resolve(__dirname, '../src/pages/PatternDetailPage.tsx');

  it('verifies research notes file exists and clearly distinguishes LC #209, LC #862, and LC #560', () => {
    expect(fs.existsSync(notesPath)).toBe(true);
    const content = fs.readFileSync(notesPath, 'utf8');

    // LeetCode #209: Variable-size Sliding Window, strictly positive numbers
    expect(content).toContain('LeetCode #209');
    expect(content).toContain('Minimum Size Subarray Sum');
    expect(content).toMatch(/Variable-Size Sliding Window/i);
    expect(content).toMatch(/strictly positive/i);

    // LeetCode #862: Prefix Sum + Monotonic Deque, handles negative numbers
    expect(content).toContain('LeetCode #862');
    expect(content).toContain('Shortest Subarray with Sum at Least K');
    expect(content).toMatch(/Prefix Sum \+ Monotonic Deque/i);

    // LeetCode #560: Prefix Sum + Hash Map, counts exact sum = K
    expect(content).toContain('LeetCode #560');
    expect(content).toContain('Subarray Sum Equals K');
    expect(content).toMatch(/Prefix Sum \+ Hash Map/i);

    // Complexity verification in notes: O(n) time for all three
    expect(content).toMatch(/\\mathcal\{O\}\(n\)/);
  });

  it('verifies PatternDetailPage distinguishes LC #209, LC #862, and LC #560 correctly', () => {
    expect(fs.existsSync(lessonPath)).toBe(true);
    const lessonContent = fs.readFileSync(lessonPath, 'utf8');

    expect(lessonContent).toContain('LeetCode #209');
    expect(lessonContent).toContain('LeetCode #862');
    expect(lessonContent).toContain('LeetCode #560');
    expect(lessonContent).toContain('Prefix Sum + Monotonic Deque');
    expect(lessonContent).toContain('Prefix Sum + Hash Map');
  });

  it('validates algorithmic rationale: positive integers guarantee monotonicity, negatives break it', () => {
    const content = fs.readFileSync(notesPath, 'utf8');

    // Must explain that negative numbers break monotonicity
    expect(content).toMatch(/negative numbers cause running sums to oscillate non-monotonically/i);
    // Must explain why deque pops from front (R - front >= K) and back (P[R] <= P[back])
    expect(content).toMatch(/pop from front when/i);
    expect(content).toMatch(/pop from back while/i);
  });
});
