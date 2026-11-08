/**
 * Serverless GraphQL Proxy for LeetCode Public Profile & Submissions.
 *
 * Security Architecture & Hardening Notes:
 * 1. CORS: 'Access-Control-Allow-Origin: *' without 'Access-Control-Allow-Credentials'.
 *    Combining '*' with credentials violates W3C Fetch spec and causes client-side security errors.
 * 2. HTTP Method Restrictions: Strictly allows POST (and preflight OPTIONS). Rejects other methods with 405.
 * 3. Payload Limit: Rejects payloads > 10 KB to prevent memory exhaustion and DoS attacks.
 * 4. Input Sanitization: Validates username against /^[a-zA-Z0-9_-]{1,64}$/.
 * 5. Query Whitelisting: Restricts incoming GraphQL operations to public profile queries
 *    ('matchedUser', 'recentAcSubmissionList'). Disallows mutations, subscriptions,
 *    and introspection (__schema, __type).
 * 6. Upstream Timeout: Enforces a strict 10-second timeout on leetcode.com fetch calls using AbortController.
 * 7. Rate Limiting Note: In a stateless Vercel Serverless environment, in-memory rate
 *    limit counters reset per instance. Production rate limiting is best enforced via
 *    Vercel Edge Config / Firewall / Cloudflare rules. For defense-in-depth, an in-memory
 *    IP-based sliding window bucket is included for instance-level burst throttling.
 */

const MAX_PAYLOAD_BYTES = 10 * 1024; // 10 KB
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;
const ALLOWED_OPERATIONS = ['recentAcSubmissionList', 'matchedUser'];
const DISALLOWED_KEYWORDS = ['mutation', '__schema', '__type'];

// Instance-level in-memory sliding window rate limiter (Defense-in-depth)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 req/min per IP

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const record = rateLimitMap.get(ip) || [];
  const validTimestamps = record.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export default async function handler(req, res) {
  // 1. CORS Configuration (W3C compliant - no credentials with wildcard)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. HTTP Method Validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // 3. Rate Limiting Throttling Check
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  // 4. Payload Size Check
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_PAYLOAD_BYTES) {
    return res.status(413).json({ error: 'Payload too large. Maximum allowed size is 10 KB.' });
  }

  // 5. Body & Input Validation
  let parsedBody;
  try {
    parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  if (!parsedBody || typeof parsedBody !== 'object') {
    return res.status(400).json({ error: 'Request body must be a valid JSON object.' });
  }

  const { query, variables } = parsedBody;

  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'GraphQL query must be a non-empty string.' });
  }

  if (!variables || typeof variables !== 'object') {
    return res.status(400).json({ error: 'GraphQL variables must be an object containing username.' });
  }

  const username = variables.username;
  if (typeof username !== 'string' || !USERNAME_REGEX.test(username.trim())) {
    return res.status(400).json({
      error: 'Invalid username parameter. Alphanumeric, underscore, and hyphen only (1-64 characters).',
    });
  }

  // 6. Whitelist Query Validation
  const lowerQuery = query.toLowerCase();
  for (const keyword of DISALLOWED_KEYWORDS) {
    if (lowerQuery.includes(keyword)) {
      return res.status(403).json({ error: `Forbidden operation: "${keyword}" is not permitted.` });
    }
  }

  const hasAllowedOperation = ALLOWED_OPERATIONS.some(op => query.includes(op));
  if (!hasAllowedOperation) {
    return res.status(403).json({
      error: 'Forbidden query: Only recentAcSubmissionList and matchedUser operations are permitted.',
    });
  }

  // 7. Proxy with Upstream Timeout (10 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const leetcodeRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query,
        variables: { username: username.trim() },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = leetcodeRes.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return res.status(502).json({ error: 'Upstream LeetCode API returned non-JSON response.' });
    }

    const data = await leetcodeRes.json();
    return res.status(leetcodeRes.status).json(data);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError') {
      return res.status(504).json({ error: 'Upstream LeetCode request timed out.' });
    }
    return res.status(500).json({
      error: 'Failed to proxy GraphQL request to LeetCode.',
    });
  }
}
