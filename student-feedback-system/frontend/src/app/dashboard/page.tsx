'use client';

import { useAuth } from '@/context/MockAuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.name || user.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            {user.email} • {user.role}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
        
        <div className="space-y-8">
          <div>
            <p className="text-muted-foreground">
              Here's what's happening with your account today.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium">Total Courses</h3>
              <p className="mt-2 text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">+0% from last month</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium">Feedback Received</h3>
              <p className="mt-2 text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">+0% from last month</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium">Average Rating</h3>
              <p className="mt-2 text-2xl font-bold">-</p>
              <p className="text-xs text-muted-foreground">No ratings yet</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium">Upcoming Deadlines</h3>
              <p className="mt-2 text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">No upcoming deadlines</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium">Recent Feedback</h3>
              <div className="text-center text-sm text-muted-foreground">
                No recent feedback
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-medium">Recent Courses</h3>
              <div className="text-center text-sm text-muted-foreground">
                No recent courses
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
