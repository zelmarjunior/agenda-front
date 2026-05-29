'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, LoginRequest, RegisterBusinessRequest } from '@/types/auth.types';
import { authService } from '@/modules/auth/services/authService';
import { decodeToken } from '@/utils/jwt';
import { storage } from '@/utils/storage';

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterBusinessRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function buildAuthState(): AuthState {
  const token = storage.getToken();
  if (!token) return { token: null, businessId: null, role: null, isAuthenticated: false };
  const payload = decodeToken(token);
  if (!payload) return { token: null, businessId: null, role: null, isAuthenticated: false };
  return {
    token,
    businessId: payload.businessId,
    role: (payload.roles?.[0] ?? null) as AuthState['role'],
    isAuthenticated: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [auth, setAuth] = useState<AuthState>(buildAuthState);
  const router = useRouter();

  const login = useCallback(
    async (data: LoginRequest) => {
      const { token } = await authService.login(data);
      storage.setToken(token);
      const payload = decodeToken(token);
      if (payload) {
        storage.setBusinessId(payload.businessId);
      }
      setAuth(buildAuthState());
      router.push('/');
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterBusinessRequest) => {
      const { token } = await authService.register(data);
      storage.setToken(token);
      const payload = decodeToken(token);
      if (payload) {
        storage.setBusinessId(payload.businessId);
        storage.setLastBusiness({
          businessId: payload.businessId,
          businessName: data.businessName,
        });
      }
      setAuth(buildAuthState());
      router.push('/');
    },
    [router],
  );

  const logout = useCallback(() => {
    storage.clearAll();
    setAuth({ token: null, businessId: null, role: null, isAuthenticated: false });
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
