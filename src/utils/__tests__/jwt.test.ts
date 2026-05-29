import { describe, it, expect } from 'vitest';
import { decodeToken, isTokenExpired } from '../jwt';

function makeToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${body}.signature`;
}

describe('decodeToken', () => {
  it('returns payload for valid token', () => {
    const now = Math.floor(Date.now() / 1000);
    const token = makeToken({ sub: 'user-1', businessId: 'biz-1', exp: now + 3600 });
    const payload = decodeToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.businessId).toBe('biz-1');
  });

  it('returns null for malformed token', () => {
    expect(decodeToken('not.a.token')).toBeNull();
    expect(decodeToken('onlyone')).toBeNull();
    expect(decodeToken('')).toBeNull();
  });

  it('returns null for token with invalid base64 payload', () => {
    expect(decodeToken('header.!!!invalid!!!.sig')).toBeNull();
  });
});

describe('isTokenExpired', () => {
  it('returns false for token expiring in the future', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const token = makeToken({ sub: 'u', exp });
    expect(isTokenExpired(token)).toBe(false);
  });

  it('returns true for token already expired', () => {
    const exp = Math.floor(Date.now() / 1000) - 1;
    const token = makeToken({ sub: 'u', exp });
    expect(isTokenExpired(token)).toBe(true);
  });

  it('returns true for malformed token', () => {
    expect(isTokenExpired('bad.token.here')).toBe(true);
  });
});
