'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on the client side
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.user) {
          // If authenticated, redirect to tasks page
          router.push('/tasks');
        }
      } catch (error) {
        // If there's an error getting session, stay on landing page
        console.error('Authentication check failed:', error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
          Task Manager
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Organize your work and boost productivity with our intuitive task management system.
          Sign in to start managing your tasks efficiently.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth"
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Get Started
          </Link>

          <Link
            href="/tasks"
            className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:shadow-lg border border-gray-300 transition-all duration-300"
          >
            View Tasks
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Create Tasks</h3>
            <p className="text-gray-600">Easily add and organize your daily tasks with detailed descriptions.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600">Monitor your progress with completion statuses and filters.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Stay Organized</h3>
            <p className="text-gray-600">Sort and filter tasks to focus on what matters most.</p>
          </div>
        </div>
      </div>
    </div>
  );
}