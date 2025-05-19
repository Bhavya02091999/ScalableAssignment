'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [user, router]);

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Access Denied
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              You are logged in as <span className="font-medium">{user.email}</span> with the role of{' '}
              <span className="font-medium capitalize">{user.user_metadata?.role || 'student'}</span>.
            </p>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Go to Dashboard
            </button>
            
            <div className="mt-4">
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Sign in as a different user
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
