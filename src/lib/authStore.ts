import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, isSupabaseConfigured } from './supabase';
import type { Role } from '@/types';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name: string;
}

// Built-in demo accounts — work without any Supabase setup
const DEMO_USERS: Array<AuthUser & { password: string }> = [
  { id: 'demo-buyer-1', email: 'buyer@demo.com', password: 'demo123', role: 'buyer', name: 'Priya Sharma' },
  { id: 'demo-seller-1', email: 'seller@demo.com', password: 'demo123', role: 'seller', name: 'Ravi Kumar' },
  { id: 'demo-admin-1', email: 'admin@demo.com', password: 'demo123', role: 'admin', name: 'Admin' },
];

const LOCAL_USERS_KEY = 'ecomarket_registered_users';

function getLocalUsers(): Array<AuthUser & { password: string }> {
  if (typeof window === 'undefined') return DEMO_USERS;
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    const extra: Array<AuthUser & { password: string }> = stored ? JSON.parse(stored) : [];
    return [...DEMO_USERS, ...extra];
  } catch {
    return DEMO_USERS;
  }
}

function saveLocalUser(user: AuthUser & { password: string }) {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    const extra: Array<AuthUser & { password: string }> = stored ? JSON.parse(stored) : [];
    extra.push(user);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(extra));
  } catch { /* ignore */ }
}

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string, role: 'buyer' | 'seller') => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // 1. Try Supabase Auth if configured
          if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) { set({ isLoading: false }); return { error: error.message }; }
            if (data.user) {
              const { data: profile } = await supabase
                .from('profiles').select('*').eq('id', data.user.id).single();
              const user: AuthUser = {
                id: data.user.id,
                email: data.user.email!,
                role: profile?.role ?? 'buyer',
                name: profile?.name ?? email.split('@')[0],
              };
              set({ user, isLoading: false });
              return {};
            }
          }

          // 2. Fallback: local auth (demo mode)
          const found = getLocalUsers().find(u => u.email === email && u.password === password);
          if (!found) { set({ isLoading: false }); return { error: 'Invalid email or password.' }; }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _pw, ...user } = found;
          set({ user, isLoading: false });
          return {};
        } catch {
          set({ isLoading: false });
          return { error: 'Something went wrong. Please try again.' };
        }
      },

      signup: async (name, email, password, role) => {
        set({ isLoading: true });
        try {
          // 1. Try Supabase Auth if configured
          if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase.auth.signUp({
              email, password,
              options: { data: { role, name } },
            });
            if (error) { set({ isLoading: false }); return { error: error.message }; }
            if (data.user) {
              await supabase.from('profiles').upsert({ id: data.user.id, email, role, name });
              const user: AuthUser = { id: data.user.id, email, role, name };
              set({ user, isLoading: false });
              return {};
            }
          }

          // 2. Fallback: local auth
          if (getLocalUsers().find(u => u.email === email)) {
            set({ isLoading: false });
            return { error: 'An account with this email already exists.' };
          }
          const newUser: AuthUser & { password: string } = {
            id: `local-${Date.now()}`, email, password, role, name,
          };
          saveLocalUser(newUser);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _pw, ...user } = newUser;
          set({ user, isLoading: false });
          return {};
        } catch {
          set({ isLoading: false });
          return { error: 'Something went wrong. Please try again.' };
        }
      },

      logout: async () => {
        if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
        set({ user: null });
      },
    }),
    {
      name: 'ecomarket-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
