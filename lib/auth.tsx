'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { api } from './api';
import { AuthUser, ApiSuccess } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refresh(): Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const router = useRouter();

  const refresh = useCallback(async (): Promise<boolean> => {
    try {
      const res = await api.post<{ accessToken: string }>('/auth/refresh', {});
      if (res.status !== 'success') return false;
      api.setToken((res as ApiSuccess<{ accessToken: string }>).data.accessToken);

      const meRes = await api.get<AuthUser>('/auth/me');
      if (meRes.status !== 'success') return false;
      setState({ user: (meRes as ApiSuccess<AuthUser>).data, loading: false });
      return true;
    } catch {
      setState({ user: null, loading: false });
      return false;
    }
  }, []);

  // On mount, try to restore session via refresh cookie
  useEffect(() => {
    refresh().then((ok) => {
      if (!ok) setState({ user: null, loading: false });
    });
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ user: AuthUser; accessToken: string }>('/auth/login', {
      email,
      password,
    });
    if (res.status !== 'success') {
      throw new Error((res as { message: string }).message || 'Login failed');
    }
    const data = (res as ApiSuccess<{ user: AuthUser; accessToken: string }>).data;
    api.setToken(data.accessToken);
    setState({ user: data.user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout', {});
    api.setToken(null);
    setState({ user: null, loading: false });
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
