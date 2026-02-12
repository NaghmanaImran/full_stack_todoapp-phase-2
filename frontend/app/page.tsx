'use client';

import Link from 'next/link';
import { authClient } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const currentSession = await authClient.getSession();
        setSession(currentSession);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error getting session:', err);
        setError('Unable to load user session. Authentication service may be unavailable.');
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-base text-blue-800">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-900">Task Management App</CardTitle>
            <CardDescription className="text-lg text-blue-700 mt-2">
              Organize your tasks efficiently
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            {error && (
              <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <Link href="/tasks" className="w-full">
                <Button
                  variant="default"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 text-base"
                  disabled={isLoading}
                >
                  View Tasks
                </Button>
              </Link>

              {session?.user ? (
                <Link href="/auth" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full py-4 text-base text-blue-700 border-blue-400 hover:bg-blue-100"
                    disabled={isLoading}
                  >
                    My Account
                  </Button>
                </Link>
              ) : (
                <Link href="/auth" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full py-4 text-base text-blue-700 border-blue-400 hover:bg-blue-100"
                    disabled={isLoading}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-8 text-center text-blue-700">
              <p>Get started by managing your tasks or signing in to sync your data.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}