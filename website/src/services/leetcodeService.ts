import type { LeetCodeAccount, LeetCodeSubmission } from '../types';

export interface LeetCodeMatchItem {
  id: number;
  timestamp?: string; // Unix epoch seconds string
}

export interface LeetCodeMatchResult {
  matchedItems: LeetCodeMatchItem[];
  matchedIds: number[];
  matchedCount: number;
  unmatchedSubmissions: LeetCodeSubmission[];
  totalSubmissions: number;
}

export type SyncOutcome = 'idle' | 'syncing' | 'connected' | 'completed' | 'partial' | 'failed';

export interface SyncStatusDetails {
  outcome: SyncOutcome;
  connectedAt?: string;
  totalSolvedOnProfile: number;
  recentSubmissionsCount: number;
  matchedCount: number;
  unmatchedCount: number;
  newlySolvedCount: number;
  isPartial: boolean;
  message: string;
  error?: string | null;
}

export async function fetchLeetCodeData(username: string): Promise<LeetCodeAccount> {
  const cleanUsername = username.trim().toLowerCase();
  if (!cleanUsername) {
    throw new Error('Please enter a valid LeetCode username');
  }

  // Attempt 1: Try local proxy (/api/leetcode/graphql)
  try {
    const proxyRes = await fetch('/api/leetcode/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query recentAcSubmissions($username: String!) {
          recentAcSubmissionList(username: $username) {
            id
            title
            titleSlug
            timestamp
          }
          matchedUser(username: $username) {
            username
            profile {
              userAvatar
              ranking
              realName
            }
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }`,
        variables: { username: cleanUsername },
      }),
    });

    if (proxyRes.ok) {
      const contentType = proxyRes.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Not JSON response');
      }
      const data = await proxyRes.json();
      if (data?.data?.matchedUser) {
        const user = data.data.matchedUser;
        const stats = user.submitStats?.acSubmissionNum || [];
        const easy = stats.find((s: any) => s.difficulty === 'Easy')?.count || 0;
        const medium = stats.find((s: any) => s.difficulty === 'Medium')?.count || 0;
        const hard = stats.find((s: any) => s.difficulty === 'Hard')?.count || 0;
        const total = stats.find((s: any) => s.difficulty === 'All')?.count || (easy + medium + hard);

        const submissions: LeetCodeSubmission[] = (data.data.recentAcSubmissionList || []).map((s: any) => ({
          id: String(s.id),
          title: s.title,
          titleSlug: s.titleSlug,
          timestamp: s.timestamp ? String(s.timestamp) : undefined,
        }));

        return {
          username: user.username || cleanUsername,
          realName: user.profile?.realName,
          avatar: user.profile?.userAvatar,
          ranking: user.profile?.ranking,
          totalSolved: total,
          easySolved: easy,
          mediumSolved: medium,
          hardSolved: hard,
          lastSyncedAt: new Date().toISOString(),
          recentSubmissions: submissions,
          autoSync: true,
        };
      }
    }
  } catch {
    // Continue to fallback
  }

  // Attempt 2: Public LeetCode API Mirror (alfa-leetcode-api)
  try {
    const [subRes, solvedRes, profileRes] = await Promise.all([
      fetch(`https://alfa-leetcode-api.onrender.com/${cleanUsername}/acSubmission?limit=100`),
      fetch(`https://alfa-leetcode-api.onrender.com/${cleanUsername}/solved`),
      fetch(`https://alfa-leetcode-api.onrender.com/${cleanUsername}`),
    ]);

    if (solvedRes.ok) {
      const solvedData = await solvedRes.json();
      const profileData = profileRes.ok ? await profileRes.json() : {};
      const subData = subRes.ok ? await subRes.json() : { submission: [] };

      const submissions: LeetCodeSubmission[] = (subData.submission || []).map((s: any, idx: number) => ({
        id: s.id ? String(s.id) : `sub-${idx}`,
        title: s.title,
        titleSlug: s.titleSlug,
        timestamp: s.timestamp ? String(s.timestamp) : undefined,
      }));

      return {
        username: cleanUsername,
        realName: profileData.name,
        avatar: profileData.avatar,
        ranking: profileData.ranking,
        totalSolved: solvedData.solvedProblem || 0,
        easySolved: solvedData.easySolved || 0,
        mediumSolved: solvedData.mediumSolved || 0,
        hardSolved: solvedData.hardSolved || 0,
        lastSyncedAt: new Date().toISOString(),
        recentSubmissions: submissions,
        autoSync: true,
      };
    }
  } catch (err: any) {
    // Continue to error throw
  }

  throw new Error(`Could not find LeetCode profile for "${cleanUsername}". Please verify your username.`);
}

function extractSlugFromLink(link: string): string {
  if (!link) return '';
  return link
    .replace(/^https?:\/\/leetcode\.com\/problems\//i, '')
    .replace(/\/.*$/, '')
    .toLowerCase()
    .trim();
}

function normalizeTitle(title: string): string {
  if (!title) return '';
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Matches LeetCode accepted submissions with catalog questions.
 * Handles deduplication, slug/title normalization, and extracts timestamps.
 */
export function matchLeetCodeSubmissionsWithDetails(
  submissions: LeetCodeSubmission[],
  allQuestions: { id: number; title: string; link: string }[]
): LeetCodeMatchResult {
  if (!submissions || !Array.isArray(submissions) || !allQuestions || !Array.isArray(allQuestions)) {
    return {
      matchedItems: [],
      matchedIds: [],
      matchedCount: 0,
      unmatchedSubmissions: [],
      totalSubmissions: 0,
    };
  }

  // Pre-index questions by slug and by normalized title for O(N + M) performance
  const bySlug = new Map<string, { id: number; title: string; link: string }>();
  const byTitle = new Map<string, { id: number; title: string; link: string }>();

  for (const q of allQuestions) {
    const slug = extractSlugFromLink(q.link);
    if (slug && !bySlug.has(slug)) {
      bySlug.set(slug, q);
    }
    const normT = normalizeTitle(q.title);
    if (normT && !byTitle.has(normT)) {
      byTitle.set(normT, q);
    }
  }

  const matchedItemsMap = new Map<number, LeetCodeMatchItem>();
  const unmatched: LeetCodeSubmission[] = [];

  for (const sub of submissions) {
    const subSlug = sub.titleSlug ? sub.titleSlug.toLowerCase().trim() : '';
    const normSubTitle = sub.title ? normalizeTitle(sub.title) : '';

    let matchedQ = subSlug ? bySlug.get(subSlug) : undefined;
    if (!matchedQ && normSubTitle) {
      matchedQ = byTitle.get(normSubTitle);
    }

    if (matchedQ) {
      // Deduplicate: if already matched, retain existing or update timestamp if newer
      if (!matchedItemsMap.has(matchedQ.id)) {
        matchedItemsMap.set(matchedQ.id, {
          id: matchedQ.id,
          timestamp: sub.timestamp,
        });
      }
    } else {
      unmatched.push(sub);
    }
  }

  const matchedItems = Array.from(matchedItemsMap.values());
  const matchedIds = matchedItems.map(item => item.id);

  return {
    matchedItems,
    matchedIds,
    matchedCount: matchedItems.length,
    unmatchedSubmissions: unmatched,
    totalSubmissions: submissions.length,
  };
}

/**
 * Backward-compatible helper returning matched IDs.
 */
export function matchLeetCodeSubmissionsWithQuestions(
  submissions: LeetCodeSubmission[],
  allQuestions: { id: number; title: string; link: string }[]
): number[] {
  return matchLeetCodeSubmissionsWithDetails(submissions, allQuestions).matchedIds;
}
