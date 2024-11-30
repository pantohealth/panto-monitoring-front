import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (auth: { token: string; isAuthenticated: boolean }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        token: null,
        isAuthenticated: false,
        setAuth: (auth) => {
          set(auth);
          window.history.pushState(null, '', window.location.pathname);
        },
        logout: () => {
          localStorage.removeItem('token');
          set({ token: null, isAuthenticated: false });
          window.history.pushState(null, '', '/login');
          window.location.href = '/login';
        },
      }),
      {
        name: 'auth-storage',
      }
    )
  );