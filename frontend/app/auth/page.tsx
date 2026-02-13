'use client';

import { authClient, signIn, signOut, getSessionWithFallback } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';

export default function AuthPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const currentSession = await getSessionWithFallback();
        setSession(currentSession);
      } catch (error) {
        console.error('Error getting session:', error);
        setError('Failed to fetch session. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (isLogin) {
      // Sign in
      try {
        const res = await signIn.email({
          email,
          password,
          callbackURL: '/tasks',
        });

        if (res?.session) {
          // Refresh session
          const currentSession = await getSessionWithFallback();
          setSession(currentSession);
          window.location.href = '/tasks';
        } else {
          setError(res?.error?.message || 'Sign in failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Sign in error:', error);
        setError(error?.message || 'Sign in failed. Please try again.');
      }
    } else {
      // Sign up (register) - in better-auth, the same endpoint handles both login and registration
      try {
        const res = await signIn.email({
          email,
          password,
          callbackURL: '/tasks',
        });

        if (res?.session) {
          // Refresh session
          const currentSession = await getSessionWithFallback();
          setSession(currentSession);
          window.location.href = '/tasks';
        } else {
          setError(res?.error?.message || 'Sign up failed. Please try again.');
        }
      } catch (error: any) {
        console.error('Sign up error:', error);
        setError(error?.message || 'Sign up failed. Please try again.');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      setError('Sign out failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-300/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-500 border-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-900 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm text-blue-900 shadow-2xl rounded-2xl border border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Welcome, {session.user?.email}!</CardTitle>
            <CardDescription className="text-blue-700">
              You are currently signed in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">Your user ID: {session.user?.id}</p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSignOut}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <Card className="w-full max-w-sm bg-white/90 backdrop-blur-sm text-blue-900 shadow-2xl rounded-2xl border border-blue-200">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-blue-900">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </CardTitle>
          <CardDescription className="text-blue-700">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>

        {error && (
          <div className="mx-6 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 py-2 px-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm text-blue-800">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 px-3 py-1 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 text-blue-900"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm text-blue-800">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 px-3 py-1 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 text-blue-900"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-2 px-4 pb-4">
            <Button
              type="submit"
              className="w-full py-3 text-base bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg shadow-md"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full py-2 text-sm border-blue-400 hover:bg-blue-100 text-blue-700 rounded-lg"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Need account?' : 'Have account?'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}