import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../storage';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
Object.defineProperty(globalThis, 'document', {
  value: { cookie: '' },
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
});

describe('storage.token', () => {
  it('stores and retrieves a token', () => {
    storage.setToken('my-jwt');
    expect(storage.getToken()).toBe('my-jwt');
  });

  it('removes token', () => {
    storage.setToken('my-jwt');
    storage.removeToken();
    expect(storage.getToken()).toBeNull();
  });
});

describe('storage.businessId', () => {
  it('stores and retrieves businessId', () => {
    storage.setBusinessId('biz-123');
    expect(storage.getBusinessId()).toBe('biz-123');
  });

  it('removes businessId', () => {
    storage.setBusinessId('biz-123');
    storage.removeBusinessId();
    expect(storage.getBusinessId()).toBeNull();
  });
});

describe('storage.lastBusiness', () => {
  it('stores and retrieves last business', () => {
    const data = { businessId: 'biz-1', businessName: 'Salão da Ana' };
    storage.setLastBusiness(data);
    expect(storage.getLastBusiness()).toEqual(data);
  });

  it('returns null when not set', () => {
    expect(storage.getLastBusiness()).toBeNull();
  });
});

describe('storage.clearAll', () => {
  it('removes auth token and businessId but keeps lastBusiness', () => {
    storage.setToken('tok');
    storage.setBusinessId('biz');
    storage.setLastBusiness({ businessId: 'b', businessName: 'n' });
    storage.clearAll();
    expect(storage.getToken()).toBeNull();
    expect(storage.getBusinessId()).toBeNull();
    // lastBusiness is intentionally preserved so the login form can pre-fill the business
    expect(storage.getLastBusiness()).toEqual({ businessId: 'b', businessName: 'n' });
  });
});
