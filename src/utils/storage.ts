const KEYS = {
  accessToken: 'agenda:token',
  businessId: 'agenda:businessId',
  lastBusiness: 'agenda:lastBusiness',
  soloMode: 'agenda:soloMode',
} as const;

function safeGet(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors (private browsing, quota exceeded)
  }
}

// Sets a non-httpOnly cookie so middleware can detect auth state.
function setAuthCookie(hasToken: boolean): void {
  if (typeof document === 'undefined') return;
  if (hasToken) {
    document.cookie = 'agenda:authed=1; path=/; SameSite=Strict';
  } else {
    document.cookie = 'agenda:authed=; path=/; SameSite=Strict; max-age=0';
  }
}

function safeRemove(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const storage = {
  getToken: (): string | null => safeGet(KEYS.accessToken),
  setToken: (token: string): void => {
    safeSet(KEYS.accessToken, token);
    setAuthCookie(true);
  },
  removeToken: (): void => {
    safeRemove(KEYS.accessToken);
    setAuthCookie(false);
  },

  getBusinessId: (): string | null => safeGet(KEYS.businessId),
  setBusinessId: (id: string): void => safeSet(KEYS.businessId, id),
  removeBusinessId: (): void => safeRemove(KEYS.businessId),

  getLastBusiness: (): { businessId: string; businessName: string } | null => {
    const raw = safeGet(KEYS.lastBusiness);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { businessId: string; businessName: string };
    } catch {
      return null;
    }
  },
  setLastBusiness: (data: { businessId: string; businessName: string }): void =>
    safeSet(KEYS.lastBusiness, JSON.stringify(data)),

  getSoloMode: (): boolean => safeGet(KEYS.soloMode) === 'true',
  setSoloMode: (val: boolean): void => safeSet(KEYS.soloMode, String(val)),

  clearAll: (): void => {
    safeRemove(KEYS.accessToken);
    safeRemove(KEYS.businessId);
    safeRemove(KEYS.soloMode);
    setAuthCookie(false);
    // lastBusiness is intentionally kept — login form needs businessId before a token exists
  },
};
