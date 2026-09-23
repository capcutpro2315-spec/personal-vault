import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (fullName: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateBiometricStatus: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 'user-demo',
  email: 'vishnu@lifevault.ai',
  fullName: 'Vishnu Sharma',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  createdAt: '2026-01-01T00:00:00Z',
  isBiometricEnabled: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('lifevault_demo_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (isMounted) {
          if (session?.user) {
            authService.getProfile(session.user.id).then((profile) => {
              if (isMounted) {
                setUser(
                  profile || {
                    id: session.user.id,
                    email: session.user.email || '',
                    fullName: session.user.user_metadata?.full_name || 'Vault User',
                    avatarUrl: session.user.user_metadata?.avatar_url,
                    createdAt: session.user.created_at,
                    isBiometricEnabled: true,
                  }
                );
                setIsLoading(false);
              }
            });
          } else {
            setUser(null);
            setIsLoading(false);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          authService.getProfile(session.user.id).then((profile) => {
            if (isMounted) {
              setUser(
                profile || {
                  id: session.user.id,
                  email: session.user.email || '',
                  fullName: session.user.user_metadata?.full_name || 'Vault User',
                  avatarUrl: session.user.user_metadata?.avatar_url,
                  createdAt: session.user.created_at,
                  isBiometricEnabled: true,
                }
              );
              setIsLoading(false);
            }
          });
        } else if (isSupabaseConfigured) {
          setUser(null);
          setIsLoading(false);
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.signIn(email, pass);
      setUser(loggedUser);
      localStorage.setItem('lifevault_demo_user', JSON.stringify(loggedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (fullName: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const newUser = await authService.signUp(fullName, email, pass);
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('lifevault_demo_user', JSON.stringify(newUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      await login('google.user@lifevault.ai', 'demopassword');
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      localStorage.removeItem('lifevault_demo_user');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const updateBiometricStatus = (enabled: boolean) => {
    if (user) {
      const updated = { ...user, isBiometricEnabled: enabled };
      setUser(updated);
      localStorage.setItem('lifevault_demo_user', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        authService.updateProfile(user.id, { isBiometricEnabled: enabled });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        updateBiometricStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
