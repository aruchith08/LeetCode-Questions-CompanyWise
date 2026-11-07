import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../../api/leetcode.js';

function createMockReqRes(options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}) {
  const req = {
    method: options.method || 'POST',
    body: options.body,
    headers: options.headers || {},
    socket: { remoteAddress: '127.0.0.1' },
  };

  const headersSet: Record<string, string> = {};
  let statusCode = 200;
  let jsonResponse: any = null;
  let ended = false;

  const res = {
    setHeader: vi.fn((key: string, val: string) => {
      headersSet[key] = val;
    }),
    status: vi.fn((code: number) => {
      statusCode = code;
      return res;
    }),
    json: vi.fn((data: any) => {
      jsonResponse = data;
      ended = true;
      return res;
    }),
    end: vi.fn(() => {
      ended = true;
      return res;
    }),
  };

  return {
    req,
    res,
    getHeaders: () => headersSet,
    getStatusCode: () => statusCode,
    getJSON: () => jsonResponse,
    isEnded: () => ended,
  };
}

describe('API Security Hardening — api/leetcode.js', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sets compliant CORS headers without Access-Control-Allow-Credentials: true', async () => {
    const { req, res, getHeaders, getStatusCode } = createMockReqRes({ method: 'OPTIONS' });
    await handler(req as any, res as any);

    expect(getStatusCode()).toBe(200);
    expect(getHeaders()['Access-Control-Allow-Origin']).toBe('*');
    expect(getHeaders()['Access-Control-Allow-Credentials']).toBeUndefined();
    expect(getHeaders()['Access-Control-Allow-Methods']).toBe('POST,OPTIONS');
  });

  it('rejects non-POST HTTP methods with 405 Method Not Allowed', async () => {
    for (const method of ['GET', 'PUT', 'DELETE', 'PATCH']) {
      const { req, res, getStatusCode, getJSON } = createMockReqRes({ method });
      await handler(req as any, res as any);
      expect(getStatusCode()).toBe(405);
      expect(getJSON().error).toContain('Method not allowed');
    }
  });

  it('rejects oversized request bodies exceeding 10 KB with 413 Payload Too Large', async () => {
    const largeString = 'a'.repeat(12 * 1024);
    const { req, res, getStatusCode, getJSON } = createMockReqRes({
      method: 'POST',
      body: JSON.stringify({ query: 'query matchedUser { matchedUser { username } }', large: largeString }),
    });

    await handler(req as any, res as any);
    expect(getStatusCode()).toBe(413);
    expect(getJSON().error).toContain('Payload too large');
  });

  it('rejects malformed JSON payloads with 400 Bad Request', async () => {
    const { req, res, getStatusCode, getJSON } = createMockReqRes({
      method: 'POST',
      body: '{ not valid json }',
    });

    await handler(req as any, res as any);
    expect(getStatusCode()).toBe(400);
    expect(getJSON().error).toContain('Invalid JSON body');
  });

  it('rejects invalid or dangerous username formats with 400 Bad Request', async () => {
    const invalidUsernames = [
      '',
      '   ',
      'user; DROP TABLE users;',
      '<script>alert(1)</script>',
      'user name with spaces',
      'toolongusername'.repeat(10), // > 64 chars
    ];

    for (const username of invalidUsernames) {
      const { req, res, getStatusCode, getJSON } = createMockReqRes({
        method: 'POST',
        body: {
          query: 'query matchedUser($username: String!) { matchedUser(username: $username) { username } }',
          variables: { username },
        },
      });

      await handler(req as any, res as any);
      expect(getStatusCode()).toBe(400);
      expect(getJSON().error).toContain('Invalid username parameter');
    }
  });

  it('blocks unapproved GraphQL operations and introspection queries with 403 Forbidden', async () => {
    const dangerousQueries = [
      'mutation deleteUser { deleteUser(id: 1) { success } }',
      'query Introspection { __schema { types { name } } }',
      'query IntrospectionType { __type(name: "User") { fields { name } } }',
      'query arbitraryQuery { allSystemData { secret } }',
    ];

    for (const query of dangerousQueries) {
      const { req, res, getStatusCode, getJSON } = createMockReqRes({
        method: 'POST',
        body: {
          query,
          variables: { username: 'valid_user123' },
        },
      });

      await handler(req as any, res as any);
      expect(getStatusCode()).toBe(403);
      expect(getJSON().error).toContain('Forbidden');
    }
  });

  it('successfully proxies approved operations (matchedUser / recentAcSubmissionList) with valid inputs', async () => {
    const mockData = {
      data: {
        matchedUser: { username: 'valid_user' },
        recentAcSubmissionList: [{ id: '1', title: 'Two Sum' }],
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => mockData,
    });

    const { req, res, getStatusCode, getJSON } = createMockReqRes({
      method: 'POST',
      body: {
        query: `query recentAcSubmissions($username: String!) {
          recentAcSubmissionList(username: $username) { id title }
          matchedUser(username: $username) { username }
        }`,
        variables: { username: 'valid_user' },
      },
    });

    await handler(req as any, res as any);
    expect(getStatusCode()).toBe(200);
    expect(getJSON()).toEqual(mockData);
  });

  it('handles upstream timeouts gracefully with 504 Gateway Timeout', async () => {
    globalThis.fetch = vi.fn().mockImplementation(() => {
      const error = new Error('The operation was aborted');
      error.name = 'AbortError';
      return Promise.reject(error);
    });

    const { req, res, getStatusCode, getJSON } = createMockReqRes({
      method: 'POST',
      body: {
        query: 'query matchedUser($username: String!) { matchedUser(username: $username) { username } }',
        variables: { username: 'valid_user' },
      },
    });

    await handler(req as any, res as any);
    expect(getStatusCode()).toBe(504);
    expect(getJSON().error).toContain('timed out');
  });
});
