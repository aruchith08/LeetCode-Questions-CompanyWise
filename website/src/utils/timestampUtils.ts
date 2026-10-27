/**
 * Timestamp normalization and validation utilities.
 * Ensures consistent handling of Unix epoch seconds, Unix epoch milliseconds,
 * and ISO 8601 strings without fabricating dates.
 */

/**
 * Safely parses and normalizes a timestamp into a valid Date object.
 * Distinguishes Unix seconds (10 digits), Unix milliseconds (13 digits), and ISO strings.
 * Never invents a current timestamp. Returns null if invalid or missing.
 */
export function normalizeTimestampToDate(ts: string | number | undefined | null): Date | null {
  if (ts === undefined || ts === null || ts === '') {
    return null;
  }

  // Pure numeric timestamp (or string containing solely digits)
  if (typeof ts === 'number' || (typeof ts === 'string' && /^\d+$/.test(ts.trim()))) {
    const num = typeof ts === 'number' ? ts : parseInt(ts.trim(), 10);
    if (!Number.isFinite(num) || num <= 0) {
      return null;
    }

    // Heuristic boundary: 100,000,000,000 ms = March 1973.
    // Numbers below this threshold are Unix epoch seconds.
    // Numbers at or above this threshold are Unix epoch milliseconds.
    const ms = num < 100_000_000_000 ? num * 1000 : num;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  // String timestamp (ISO 8601 or date format)
  if (typeof ts === 'string') {
    const trimmed = ts.trim();
    if (!trimmed) return null;
    const parsed = Date.parse(trimmed);
    if (!isNaN(parsed) && parsed > 0) {
      return new Date(parsed);
    }
  }

  return null;
}

/**
 * Normalizes a timestamp to an ISO 8601 string, or returns undefined if invalid/missing.
 */
export function normalizeTimestampToISO(ts: string | number | undefined | null): string | undefined {
  const d = normalizeTimestampToDate(ts);
  return d ? d.toISOString() : undefined;
}

/**
 * Normalizes a timestamp to a Unix epoch seconds string, or returns undefined if invalid/missing.
 */
export function normalizeTimestampToSecondsString(ts: string | number | undefined | null): string | undefined {
  const d = normalizeTimestampToDate(ts);
  return d ? String(Math.floor(d.getTime() / 1000)) : undefined;
}
