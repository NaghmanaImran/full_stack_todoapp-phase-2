'use client';

import { authClient } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentSession = await authClient.getSession();
        setSession(currentSession);

        if (!currentSession?.user) {
          // Redirect to auth page if not authenticated
          router.push('/auth');
        }
      } catch (error) {
        console.error('Error getting session:', error);
        router.push('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Checking authentication...</span>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!session?.user) {
    // Return a minimal component while redirect happens
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Redirecting to login...</span>
      </div>
    );
  }

  // Render children only if user is authenticated
  return <>{children}</>;
}