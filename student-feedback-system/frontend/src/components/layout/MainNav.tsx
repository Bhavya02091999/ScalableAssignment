'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/MockAuthContext';

const routes = [
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/courses',
    label: 'Courses',
  },
  {
    href: '/feedback',
    label: 'Feedback',
  },
  {
    href: '/admin',
    label: 'Admin',
    adminOnly: true,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      {routes.map((route) => {
        // Skip admin routes if user is not an admin
        if (route.adminOnly && !isAdmin) {
          return null;
        }
        
        const isActive = pathname === route.href || 
                       (route.href !== '/' && pathname.startsWith(route.href));
        
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'transition-colors hover:text-primary',
              isActive ? 'text-primary' : 'text-muted-foreground',
              'px-2 py-1 rounded-md text-sm font-medium'
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
