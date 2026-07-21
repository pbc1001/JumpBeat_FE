import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi, refreshAccessToken, setAccessToken } from '../api/client';
import type { User } from '../api/types';
import { AuthContext, type AuthContextValue } from './AuthContext';

let bootstrapPromise: Promise<User | null> | null = null;

const bootstrapAuth = () => {
  if (!bootstrapPromise) {
    bootstrapPromise = refreshAccessToken()
      .then(() => authApi.getMe())
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        bootstrapPromise = null;
      });
  }
  return bootstrapPromise;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    bootstrapAuth().then((nextUser) => {
      if (active) {
        setUser(nextUser);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (email, password) => {
        setUser(await authApi.login({ email, password }));
      },
      signup: async (nickname, email, password) => {
        setUser(await authApi.signup({ nickname, email, password }));
      },
      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          setUser(null);
        }
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
