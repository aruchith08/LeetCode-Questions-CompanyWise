import type { LeetCodeAccount, LeetCodeSubmission } from '../types';

export interface LeetCodeSyncResult {
  account: LeetCodeAccount;
  matchedCount: number;
  newlySolvedIds: number[];
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
          timestamp: s.timestamp,
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
        timestamp: s.timestamp || String(Math.floor(Date.now() / 1000)),
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

export function matchLeetCodeSubmissionsWithQuestions(
  submissions: LeetCodeSubmission[],
  allQuestions: { id: number; title: string; link: string }[]
): number[] {
  const solvedIds = new Set<number>();

  for (const sub of submissions) {
    const subSlug = sub.titleSlug?.toLowerCase().trim();
    const subTitle = sub.title?.toLowerCase().trim();

    for (const q of allQuestions) {
      const questionSlug = q.link
        ? q.link.replace(/^https?:\/\/leetcode\.com\/problems\//i, '').replace(/\/+$/, '').toLowerCase().trim()
        : '';
      const questionTitle = q.title?.toLowerCase().trim();

      if ((subSlug && questionSlug && subSlug === questionSlug) || (subTitle && questionTitle && subTitle === questionTitle)) {
        solvedIds.add(q.id);
      }
    }
  }

  return Array.from(solvedIds);
}
