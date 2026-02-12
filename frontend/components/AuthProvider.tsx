'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth';

interface AuthContextType {
  session: any;
  loading: boolean;
  getSession: () => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const currentSession = await authClient.getSession();
        setSession(currentSession);
      } catch (error) {
        console.error('Error getting session:', error);
        // Don't set session to null if there's an error - user might not be logged in
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up session updates
    const unsub = authClient.onSessionUpdate((updatedSession) => {
      setSession(updatedSession);
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const getSession = async () => {
    try {
      const currentSession = await authClient.getSession();
      setSession(currentSession);
      return currentSession;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, getSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
