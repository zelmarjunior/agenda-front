'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, LoginRequest, RegisterBusinessRequest } from '@/types/auth.types';
import { authService } from '@/modules/auth/services/authService';
import { businessService } from '@/modules/business/services/businessService';
import { decodeToken } from '@/utils/jwt';
import { storage } from '@/utils/storage';

interface AuthContextValue extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterBusinessRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const EMPTY_STATE: AuthState = { token: null, businessId: null, role: null, professionalId: null, mustChangePassword: false, isAuthenticated: false };

function buildAuthState(): AuthState {
  const token = storage.getToken();
  if (!token) return EMPTY_STATE;
  const payload = decodeToken(token);
  if (!payload) { storage.removeToken(); return EMPTY_STATE; }
  storage.setToken(token);
  return {
    token,
    businessId: payload.businessId,
    role: (payload.roles?.[0] ?? null) as AuthState['role'],
    professionalId: payload.professionalId ?? null,
    mustChangePassword: payload.mustChangePassword ?? false,
    isAuthenticated: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [auth, setAuth] = useState<AuthState>(buildAuthState);
  const router = useRouter();

  const login = useCallback(
    async (data: LoginRequest) => {
      const { token, mustChangePassword } = await authService.login(data);
      storage.setToken(token);
      const payload = decodeToken(token);
      if (payload) {
        storage.setBusinessId(payload.businessId);
        businessService.get(payload.businessId)
          .then((biz) => storage.setSoloMode(biz.soloMode))
          .catch(() => {});
      }
      setAuth(buildAuthState());
      // TODO: reativar quando /trocar-senha estiver funcionando
      // router.push(mustChangePassword ? '/trocar-senha' : '/');
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
      storage.setSoloMode(data.soloMode ?? false);
      setAuth(buildAuthState());
      router.push('/');
    },
    [router],
  );

  const logout = useCallback(() => {
    storage.clearAll();
    setAuth(EMPTY_STATE);
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
