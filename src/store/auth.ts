import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  setAuth: (auth: { token: string; isAuthenticated: boolean }) => void;
  logout: () => void;
  logoutTimer?: number | NodeJS.Timeout;
  checkAuthentication:() => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      let logoutTimer: number | NodeJS.Timeout;

      const checkAuthentication = () => {
        const token = Cookies.get('token');
        if (!token) {
          set({ isAuthenticated: false });
        }
      };

      return {
        isAuthenticated: !!Cookies.get('token'),
        setAuth: (auth) => {
          Cookies.set('token', auth.token, {
            expires: 1, //1 day 
            // secure: true,
            sameSite: 'none',
          });

          // Update state
          set({ isAuthenticated: auth.isAuthenticated });

          // Clear any existing timer
          if (logoutTimer) {
            clearTimeout(logoutTimer);
          }

          // Set a timer to log out after 1 day
          logoutTimer = setTimeout(() => {
            set({ isAuthenticated: false });
            Cookies.remove('token');
            window.location.href = '/login';
          }, 24 * 60 * 60 * 1000); // 1day
        },
        logout: () => {
          // Clear the token and state
          Cookies.remove('token');
          set({ isAuthenticated: false });
          if (logoutTimer) {
            clearTimeout(logoutTimer);
          }
          window.location.href = '/login';
        },
        checkAuthentication,
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);