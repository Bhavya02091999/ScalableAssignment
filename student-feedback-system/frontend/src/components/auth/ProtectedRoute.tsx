'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/MockAuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'student' | 'instructor' | 'admin';
  redirectTo?: string;
  loadingFallback?: ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/auth/login',
  loadingFallback
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Redirect if not authenticated
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Check if user has the required role
    if (requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [user, loading, requiredRole, router, redirectTo]);

  // Show loading state while checking auth
  if (loading) {
    return loadingFallback || (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If no user is present, don't render children
  if (!user) {
    return null;
  }

  // If role is required but user doesn't have it, don't render children
  if (requiredRole && user.role !== requiredRole) {
    return null;
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has the required role
  return <>{children}</>;
}
